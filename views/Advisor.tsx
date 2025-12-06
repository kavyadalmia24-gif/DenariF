import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

const Advisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm FinBot, your Denari AI assistant. I can explain complex financial concepts, help you plan your savings, or decode market jargon. What's on your mind today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getFinancialAdvice(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-heading font-bold text-slate-900">AI Advisor</h2>
            <p className="text-slate-500">Your personal financial intelligence unit.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 flex items-center gap-2">
            <Sparkles size={14} /> Powered by Gemini
        </div>
      </div>

      <div className="flex-1 backdrop-blur-xl bg-gradient-to-b from-[#fdfbf7] to-white/60 rounded-[2rem] border border-white/60 shadow-xl overflow-hidden flex flex-col relative">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div 
                className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-indigo-600 border border-indigo-50'
                  }
                `}
              >
                {msg.role === 'user' ? <User size={24} /> : <Bot size={24} />}
              </div>
              
              <div 
                className={`
                  max-w-[85%] md:max-w-[70%] p-6 rounded-[2rem] text-[15px] leading-7 shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-sm' 
                    : 'bg-white/80 text-slate-700 border border-white/50 rounded-tl-sm'
                  }
                `}
              >
                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                <div className={`text-[10px] mt-3 font-medium uppercase tracking-wider ${msg.role === 'user' ? 'text-slate-500' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
             <div className="flex gap-5">
               <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 border border-indigo-50 flex items-center justify-center shrink-0 shadow-sm">
                 <Bot size={24} />
               </div>
               <div className="bg-white/80 p-6 rounded-[2rem] rounded-tl-sm border border-white/50 flex items-center gap-3 text-slate-500 text-sm shadow-sm">
                 <Loader2 size={18} className="animate-spin text-indigo-600" /> Analyzing financial data...
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/60 border-t border-white/50 backdrop-blur-md">
          <div className="flex gap-3 max-w-4xl mx-auto bg-white/80 p-2 rounded-[1.5rem] border border-slate-200 shadow-sm focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about investing, saving, or finance terms..."
              className="flex-1 bg-transparent border-none text-slate-900 px-4 py-3 focus:outline-none placeholder:text-slate-400 font-medium"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 text-white w-12 h-12 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-4 font-medium">
            AI can make mistakes. Please verify important financial information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Advisor;