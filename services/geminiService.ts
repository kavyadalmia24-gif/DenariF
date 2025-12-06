import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedLessonData } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (userMessage: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment variable.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: `You are a helpful, knowledgeable, and conservative financial literacy assistant named FinBot. 
        Your goal is to educate users about financial concepts, investment strategies, and good money habits.
        
        Guidelines:
        - Explain complex terms simply.
        - Do not give specific financial advice (e.g., "Buy stock X"). Instead, explain the principles (e.g., "Diversification is key because...").
        - If asked about calculations, explain the formula.
        - Be encouraging and positive.
        - Use markdown for formatting (bolding key terms, lists).`,
      },
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the financial knowledge base right now. Please try again later.";
  }
};

export const generateLessonContent = async (topic: string, moduleContext: string): Promise<GeneratedLessonData | null> => {
  if (!apiKey) {
    console.error("API Key Missing");
    return null;
  }

  try {
    const prompt = `
      Create a comprehensive financial lesson about "${topic}" within the module "${moduleContext}".
      
      You must return the response in strict JSON format.
      The JSON object should have the following structure:
      {
        "title": "Lesson Title",
        "content": "Markdown string containing the lesson content. Do NOT repeat the lesson title at the start. Use headers (## for sections), lists (- for bullets), and **bold** for emphasis. Ensure paragraphs are separated by newlines (\\n).",
        "quiz": [
          {
            "id": 1,
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0, // index of correct option (0-3)
            "explanation": "Why this answer is correct."
          },
          ... (Generate exactly 3 questions)
        ],
        "simulator": "Type of simulator relevant to this lesson. Options: 'SIP', 'LUMPSUM', 'EMI', or null if none apply."
      }
      
      For 'simulator', only choose one if the lesson involves calculations like compound interest (LUMPSUM), regular investing (SIP), or loans (EMI). Otherwise set to null.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            simulator: { type: Type.STRING, enum: ["SIP", "LUMPSUM", "EMI", "null"], nullable: true },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["title", "content", "quiz"]
        }
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedLessonData;
    }
    return null;
  } catch (error) {
    console.error("Lesson Generation Error:", error);
    return null;
  }
};
