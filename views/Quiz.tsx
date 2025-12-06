
import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Trophy, BrainCircuit, Target, Zap, Shield, TrendingUp, Coins, Globe, ChevronRight, Lock, Award, Star } from 'lucide-react';
import { QuizQuestion } from '../types';
import confetti from 'canvas-confetti';

// --- Question Database ---
const QUESTIONS_DB: QuizQuestion[] = [
  // BASICS - Easy
  {
    id: 1,
    category: 'Basics',
    difficulty: 'Easy',
    question: "What is the primary purpose of an Emergency Fund?",
    options: ["To buy a new car", "To invest in stocks", "To cover unexpected expenses", "To save for retirement"],
    correctAnswer: 2,
    explanation: "An emergency fund is strictly for unforeseen financial shocks like medical bills or job loss, not for spending or investing."
  },
  {
    id: 2,
    category: 'Basics',
    difficulty: 'Easy',
    question: "Which formula is used to calculate Net Worth?",
    options: ["Income - Expenses", "Assets - Liabilities", "Savings + Investments", "Assets + Income"],
    correctAnswer: 1,
    explanation: "Net Worth is calculated by subtracting what you owe (Liabilities) from what you own (Assets)."
  },
  // BASICS - Medium
  {
    id: 3,
    category: 'Basics',
    difficulty: 'Medium',
    question: "What is the '50-30-20' rule in budgeting?",
    options: ["50% Savings, 30% Needs, 20% Wants", "50% Needs, 30% Wants, 20% Savings", "50% Wants, 30% Needs, 20% Savings", "50% Investing, 30% Expenses, 20% Fun"],
    correctAnswer: 1,
    explanation: "The popular rule suggests allocating 50% to Needs, 30% to Wants, and 20% to Savings/Debt Repayment."
  },

  // INVESTING - Easy
  {
    id: 4,
    category: 'Investing',
    difficulty: 'Easy',
    question: "Buying a share of a company means you own:",
    options: ["Money from the company", "A part of the company", "A loan to the company", "The company's products"],
    correctAnswer: 1,
    explanation: "Stocks represent equity, meaning partial ownership in a corporation."
  },
  // INVESTING - Medium
  {
    id: 5,
    category: 'Investing',
    difficulty: 'Medium',
    question: "What does 'Diversification' mean?",
    options: ["Putting all money in one good stock", "Spreading investments across different assets", "Investing only in diverse countries", "Selling stocks quickly"],
    correctAnswer: 1,
    explanation: "Diversification reduces risk by allocating investments among various financial instruments, industries, and other categories."
  },
  // INVESTING - Hard
  {
    id: 6,
    category: 'Investing',
    difficulty: 'Hard',
    question: "What is a 'P/E Ratio' used for?",
    options: ["Predicting Earnings", "Valuing a company's stock price relative to earnings", "Calculating Portfolio Efficiency", "Profit vs Expenses"],
    correctAnswer: 1,
    explanation: "The Price-to-Earnings (P/E) ratio measures a company's current share price relative to its per-share earnings."
  },

  // CRYPTO - Easy
  {
    id: 7,
    category: 'Crypto',
    difficulty: 'Easy',
    question: "What is Bitcoin?",
    options: ["A physical coin", "A decentralized digital currency", "A stock in a bank", "A government bond"],
    correctAnswer: 1,
    explanation: "Bitcoin is a decentralized digital currency that uses cryptography for security and operates without a central bank."
  },
  // CRYPTO - Medium
  {
    id: 8,
    category: 'Crypto',
    difficulty: 'Medium',
    question: "What is a 'Blockchain'?",
    options: ["A blocked bank account", "A chain of physical blocks", "A distributed digital ledger", "A crypto wallet"],
    correctAnswer: 2,
    explanation: "A blockchain is a distributed digital ledger that records transactions across many computers so that the record cannot be altered retroactively."
  },
  // CRYPTO - Hard
  {
    id: 9,
    category: 'Crypto',
    difficulty: 'Hard',
    question: "What does 'DeFi' stand for?",
    options: ["Digital Finance", "Decentralized Finance", "Debt Free Investment", "Direct Funds"],
    correctAnswer: 1,
    explanation: "DeFi (Decentralized Finance) offers financial instruments without relying on intermediaries such as brokerages, exchanges, or banks."
  },

  // ECONOMICS - Medium
  {
    id: 10,
    category: 'Economics',
    difficulty: 'Medium',
    question: "What happens to purchasing power during high inflation?",
    options: ["It increases", "It stays the same", "It decreases", "It fluctuates wildly"],
    correctAnswer: 2,
    explanation: "Inflation erodes purchasing power, meaning each unit of currency buys fewer goods and services."
  },
  // ECONOMICS - Hard
  {
    id: 11,
    category: 'Economics',
    difficulty: 'Hard',
    question: "Who controls the monetary policy in India?",
    options: ["The President", "SEBI", "Reserve Bank of India (RBI)", "Ministry of Finance"],
    correctAnswer: 2,
    explanation: "The Reserve Bank of India (RBI) is the central bank responsible for regulating the issue and supply of the Indian Rupee."
  }
];

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const CATEGORIES = [
  { id: 'Basics', label: 'Financial Basics', icon: Target, color: 'emerald' },
  { id: 'Investing', label: 'Stock Market', icon: TrendingUp, color: 'indigo' },
  { id: 'Crypto', label: 'Crypto & Web3', icon: Zap, color: 'orange' },
  { id: 'Economics', label: 'Global Economy', icon: Globe, color: 'blue' },
];

const DIFFICULTIES = [
  { id: 'Easy', label: 'Novice', xpMultiplier: 1, color: 'emerald' },
  { id: 'Medium', label: 'Pro', xpMultiplier: 2, color: 'amber' },
  { id: 'Hard', label: 'Expert', xpMultiplier: 3, color: 'rose' },
];

const Quiz: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'MENU' | 'DIFFICULTY' | 'GAME' | 'RESULTS'>('MENU');
  
  // Selection State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  
  // Game State
  const [gameQuestions, setGameQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // --- Handlers ---

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setView('DIFFICULTY');
  };

  const handleDifficultySelect = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    
    // Filter Questions
    const questions = QUESTIONS_DB.filter(q => 
      q.category === selectedCategory && 
      (q.difficulty === diff || (diff === 'Hard' && q.difficulty === 'Medium')) // Fallback for hard to include medium if sparse
    ).sort(() => 0.5 - Math.random()).slice(0, 5); // Random 5 questions

    if (questions.length === 0) {
      alert("No questions found for this combination yet! Try another.");
      return;
    }

    setGameQuestions(questions);
    setScore(0);
    setCurrentQIndex(0);
    setIsAnswered(false);
    setSelectedOpt(null);
    setView('GAME');
  };

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    if (idx === gameQuestions[currentQIndex].correctAnswer) {
      setScore(s => s + 1);
      if (currentQIndex === gameQuestions.length - 1) {
         confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const handleNext = () => {
    if (currentQIndex < gameQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setView('RESULTS');
    }
  };

  const reset = () => {
    setView('MENU');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  };

  // --- Views ---

  if (view === 'MENU') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-2">Challenge Arena</h1>
          <p className="text-slate-500 text-lg">Select a realm to test your knowledge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`
                  group relative overflow-hidden bg-white p-8 rounded-[2rem] border border-slate-200 
                  hover:border-${cat.color}-300 hover:shadow-xl transition-all text-left
                `}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${cat.color}-50 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50`} />
                
                <div className={`w-14 h-14 rounded-2xl bg-${cat.color}-100 text-${cat.color}-600 flex items-center justify-center mb-6 shadow-sm`}>
                  <Icon size={28} />
                </div>
                
                <h3 className="text-2xl font-heading font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  Start Challenge <ChevronRight size={16} />
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'DIFFICULTY') {
    const category = CATEGORIES.find(c => c.id === selectedCategory);
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
        <button onClick={() => setView('MENU')} className="text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center gap-2">
           <ChevronRight className="rotate-180" size={16} /> Back to Topics
        </button>

        <div className="text-center">
           <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full bg-${category?.color}-50 text-${category?.color}-700 font-bold uppercase text-xs tracking-wider mb-4 border border-${category?.color}-100`}>
              {category?.label}
           </div>
           <h2 className="text-3xl font-heading font-extrabold text-slate-900">Select Intensity</h2>
        </div>

        <div className="space-y-4">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.id}
              onClick={() => handleDifficultySelect(diff.id as Difficulty)}
              className={`
                w-full p-6 rounded-2xl border-2 border-slate-100 hover:border-${diff.color}-400 bg-white
                flex items-center justify-between group transition-all hover:shadow-lg
              `}
            >
              <div className="flex items-center gap-5">
                 <div className={`w-12 h-12 rounded-xl bg-${diff.color}-100 text-${diff.color}-600 flex items-center justify-center`}>
                    {diff.id === 'Easy' && <Star size={24} />}
                    {diff.id === 'Medium' && <Target size={24} />}
                    {diff.id === 'Hard' && <Zap size={24} />}
                 </div>
                 <div className="text-left">
                    <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-900">{diff.label}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">{diff.xpMultiplier}x XP Reward</p>
                 </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-indigo-500" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'GAME') {
    const question = gameQuestions[currentQIndex];
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
           <button onClick={reset} className="text-slate-400 hover:text-rose-500 font-bold text-xs uppercase tracking-wider">
             Exit Challenge
           </button>
           <div className="flex gap-1">
             {gameQuestions.map((_, idx) => (
               <div 
                  key={idx} 
                  className={`h-1.5 w-6 rounded-full transition-colors ${idx <= currentQIndex ? 'bg-indigo-600' : 'bg-slate-200'}`}
               />
             ))}
           </div>
        </div>

        <div className="glass-card p-8 md:p-10 rounded-[2.5rem] border border-white/60 shadow-xl relative bg-white/40">
           <div className="flex items-center justify-between mb-6">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedCategory} • {selectedDifficulty}</span>
             <span className="text-indigo-600 font-bold font-heading">Q{currentQIndex + 1}</span>
           </div>

           <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed font-heading">
             {question.question}
           </h3>

           <div className="space-y-4">
             {question.options.map((opt, idx) => {
               let stateClass = "border-slate-100 hover:border-indigo-300 hover:bg-white hover:shadow-md bg-white/60";
               if (isAnswered) {
                 if (idx === question.correctAnswer) stateClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
                 else if (idx === selectedOpt) stateClass = "border-rose-500 bg-rose-50 text-rose-900";
                 else stateClass = "border-slate-100 opacity-50 bg-white/40";
               } else if (selectedOpt === idx) {
                 stateClass = "border-indigo-500 bg-indigo-50 text-indigo-900";
               }

               return (
                 <button
                   key={idx}
                   onClick={() => handleAnswer(idx)}
                   disabled={isAnswered}
                   className={`w-full p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between group relative overflow-hidden ${stateClass}`}
                 >
                   <span className="font-medium relative z-10">{opt}</span>
                   {isAnswered && idx === question.correctAnswer && <CheckCircle2 className="text-emerald-600" size={20} />}
                   {isAnswered && idx === selectedOpt && idx !== question.correctAnswer && <XCircle className="text-rose-600" size={20} />}
                 </button>
               )
             })}
           </div>
           
           {isAnswered && (
             <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
               <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-6">
                 <p className="text-indigo-900 text-sm leading-relaxed">
                   <strong className="block mb-1 font-heading">Insight:</strong>
                   {question.explanation}
                 </p>
               </div>
               <div className="flex justify-end">
                 <button onClick={handleNext} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg">
                   {currentQIndex < gameQuestions.length - 1 ? 'Next Question' : 'See Results'}
                 </button>
               </div>
             </div>
           )}
        </div>
      </div>
    );
  }

  // RESULTS VIEW
  if (view === 'RESULTS') {
    const diffMultiplier = DIFFICULTIES.find(d => d.id === selectedDifficulty)?.xpMultiplier || 1;
    const totalXP = score * 10 * diffMultiplier;
    const percentage = (score / gameQuestions.length) * 100;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in zoom-in duration-500">
        <div className="relative">
             <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-amber-100/50">
                <Trophy size={64} className="text-amber-500" fill="currentColor" />
            </div>
            {percentage === 100 && (
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl animate-bounce shadow-lg border-2 border-white">
                  A+
              </div>
            )}
        </div>
        
        <div>
            <h2 className="text-4xl font-heading font-extrabold text-slate-900 mb-2">Challenge Complete!</h2>
            <p className="text-slate-500 text-lg">
               You scored <span className="font-bold text-indigo-600">{score}/{gameQuestions.length}</span> on <span className="font-bold text-slate-900">{selectedDifficulty}</span> mode.
            </p>
        </div>
        
        <div className="flex gap-4">
            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm min-w-[140px]">
                <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">XP Earned</p>
                <p className="text-4xl font-heading font-extrabold text-slate-900">+{totalXP}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm min-w-[140px]">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Accuracy</p>
                <p className="text-4xl font-heading font-extrabold text-slate-900">{Math.round(percentage)}%</p>
            </div>
        </div>

        <div className="flex gap-4 mt-8">
           <button 
            onClick={reset}
            className="px-8 py-3 rounded-full font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
           >
             Back to Menu
           </button>
           <button 
            onClick={() => handleDifficultySelect(selectedDifficulty as Difficulty)}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-indigo-600 transition-all shadow-xl hover:-translate-y-1 font-bold"
           >
            <RefreshCw size={18} /> Replay Level
           </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Quiz;
