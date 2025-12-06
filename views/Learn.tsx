
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Building2, 
  ChevronRight, 
  PlayCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  BrainCircuit,
  Award,
  Landmark,
  PiggyBank,
  ShieldCheck,
  Globe2,
  Zap,
  Lock,
  BookOpen,
  Layers,
  FileText,
  Users,
  Scale,
  BarChart4,
  Factory,
  Home,
  AlertTriangle,
  Compass,
  CreditCard,
  Brain,
  HeartHandshake,
  Sun
} from 'lucide-react';
import { generateLessonContent } from '../services/geminiService';
import { GeneratedLessonData, UserStats } from '../types';
import MiniCalculator from '../components/MiniCalculators';
import confetti from 'canvas-confetti';

// --- Types ---

interface Chapter {
  id: string;
  title: string;
  isCompleted?: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

interface Track {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  accentColor: string;
  modules: Module[];
}

// --- Curriculum Data ---

const rawCurriculum = [
  {
    id: 'foundation',
    title: 'Foundation Modules (Beginner)',
    description: 'Essential financial literacy for everyone. Start your journey here.',
    icon: PiggyBank,
    color: 'emerald',
    accentColor: 'from-emerald-500 to-teal-600',
    modules: [
      { title: 'Money Basics 101', desc: 'How money works, income vs expenses, simple decisions' },
      { title: 'Smart Spending & Saving', desc: 'Needs vs wants, savings habits, daily micro-decisions' },
      { title: 'Banking Essentials', desc: 'Types of bank accounts, ATM usage, UPI and digital banking' },
      { title: 'Budgeting for Beginners', desc: 'Create a budget, track expenses, follow your plan' },
      { title: 'Understanding Interest', desc: 'Simple interest explained, compound interest magic' },
      { title: 'Financial Safety & Scams', desc: 'Online fraud types, secure payments, money safety rules' }
    ]
  },
  {
    id: 'intermediate',
    title: 'Intermediate Money Skills',
    description: 'Level up your banking and earning knowledge.',
    icon: Landmark,
    color: 'blue',
    accentColor: 'from-blue-500 to-cyan-600',
    modules: [
      { title: 'Mastering Digital Banking', desc: 'Net banking basics, IMPS NEFT RTGS, mobile banking tools' },
      { title: 'Credit Cards & Credit Score', desc: 'How credit works, EMI basics, building good credit score' },
      { title: 'Savings Accounts vs FD vs RD', desc: 'How to choose accounts, what fits your goals, returns comparison' },
      { title: 'Taxes for Young Earners', desc: 'PAN card, basic tax forms, tax slabs, TDS explained' },
      { title: 'Income Planning & Side Hustles', desc: 'Simple ways to earn, freelancing basics, monetizing skills' }
    ]
  },
  {
    id: 'investing',
    title: 'Investing & Wealth-Building',
    description: 'Grow your money over time using smart investment strategies.',
    icon: TrendingUp,
    color: 'indigo',
    accentColor: 'from-indigo-500 to-violet-600',
    modules: [
      { title: 'Investing Basics for Everyone', desc: 'Why investing matters, inflation impact, long-term thinking' },
      { title: 'Mutual Funds & SIP Mastery', desc: 'Types of funds, SIP explained, risk levels, choosing first fund' },
      { title: 'Stock Market 101', desc: 'Shares explained, market structure, brokers, buying and selling' },
      { title: 'Fundamental Analysis', desc: 'Reading balance sheets, profit and loss, key ratios, real analysis' },
      { title: 'Technical Analysis & Charts', desc: 'Market indicators, candlestick patterns, trend analysis' },
      { title: 'Portfolio Building', desc: 'Asset allocation, diversification strategies, risk management' }
    ]
  },
  {
    id: 'trading-crypto',
    title: 'Advanced Trading & Crypto',
    description: 'High-risk, high-reward strategies and modern digital assets.',
    icon: Zap,
    color: 'orange',
    accentColor: 'from-orange-500 to-amber-600',
    modules: [
      { title: 'Trading vs Investing', desc: 'Clear differences, trading styles, which is right for you' },
      { title: 'Day & Swing Trading Strategies', desc: 'Risk control, trade setups, entry exit rules, position sizing' },
      { title: 'Crypto & Blockchain Basics', desc: 'How crypto works, digital wallets, exchanges, popular coins' },
      { title: 'Advanced Crypto Investing', desc: 'Staking, DeFi concepts, NFTs, smart contracts' },
      { title: 'Crypto Security & Scams', desc: 'Avoiding rug pulls, phishing protection, verification steps' }
    ]
  },
  {
    id: 'youth-family',
    title: 'Youth & Family Finance',
    description: 'Managing money across generations and family dynamics.',
    icon: Users,
    color: 'lime',
    accentColor: 'from-lime-500 to-green-600',
    modules: [
        { title: 'Introducing Kids to Money', desc: 'The value of money, needs vs wants for kids, earning allowance' },
        { title: 'Pocket Money & Smart Choices', desc: 'Weekly budgeting, saving for toys, smart spending choices' },
        { title: 'Joint Accounts & Family Budgeting', desc: 'Couples banking, sharing expenses, financial transparency' },
        { title: 'Wedding Finance Planning', desc: 'Budgeting for big days, guest lists vs costs, saving strategy' },
        { title: 'Parenting for Financial Success', desc: 'Saving for education, child insurance plans, raising money-smart kids' }
    ]
  },
  {
    id: 'wellness',
    title: 'Work-Life & Money Wellness',
    description: 'Balancing professional success with personal well-being and financial health.',
    icon: Sun,
    color: 'amber',
    accentColor: 'from-amber-400 to-yellow-500',
    modules: [
        { title: 'Financial Stress Management', desc: 'Identifying triggers, coping mechanisms, mindfulness techniques' },
        { title: 'Healthy Work-Life Budgeting', desc: 'Budgeting for leisure, self-care funds, hobby investment' },
        { title: 'Money Habits for Mental Wellness', desc: 'Mindful spending, financial therapy basics, abundance mindset' },
        { title: 'Burnout Prevention for Earners', desc: 'Work-life balance strategies, taking sabbaticals, outsourcing chores' },
        { title: 'Sleep, Productivity & Wealth', desc: 'Sleep hygiene ROI, energy management, health as wealth' },
        { title: 'Decision Fatigue & Smart Spending', desc: 'Automating decisions, simplified lifestyle, reducing choice overload' }
    ]
  },
  {
    id: 'legal-rights',
    title: 'Legal & Consumer Rights',
    description: 'Protect yourself with knowledge of laws and regulations.',
    icon: Scale,
    color: 'stone',
    accentColor: 'from-stone-500 to-neutral-600',
    modules: [
        { title: 'Banking Ombudsman Guide', desc: 'Resolving bank disputes, filing complaints, timeline and rights' },
        { title: 'Insurance Claim Rights', desc: 'Claim process, documentation, rejection reasons, appeals' },
        { title: 'Fraud Reporting & Recovery', desc: 'Cyber crime portal, blocking cards, legal recourse' },
        { title: 'Investment Regulations & SEBI', desc: 'SEBI role, investor protection fund, knowing your rights' },
        { title: 'Buying Online Consumer Rights', desc: 'Return policies, chargebacks, consumer court for e-commerce' }
    ]
  },
  {
    id: 'pro-tools',
    title: 'Professional Investment Tools',
    description: 'Advanced instruments for the serious investor.',
    icon: BarChart4,
    color: 'red',
    accentColor: 'from-red-500 to-rose-600',
    modules: [
        { title: 'Options Trading for Beginners', desc: 'Call and Put basics, premiums, strike prices, risk' },
        { title: 'Futures Contracts Explained', desc: 'Forward contracts, expiration dates, margin requirements' },
        { title: 'Index Funds vs ETFs', desc: 'Passive investing, expense ratios, liquidity differences' },
        { title: 'Risk Indicators (VIX, Beta)', desc: 'Understanding Beta, VIX volatility, Sharpe ratio' },
        { title: 'Algo Trading Basics', desc: 'Automated strategies, backtesting basics, execution speed' }
    ]
  },
  {
    id: 'business-deeper',
    title: 'Business & Entrepreneurship (Advanced)',
    description: 'Deep dive into the financials of running a business.',
    icon: Factory,
    color: 'amber',
    accentColor: 'from-amber-500 to-yellow-600',
    modules: [
        { title: 'Cost Structure Optimization', desc: 'Fixed vs variable costs, break-even analysis, margins' },
        { title: 'Business Funding & Loans', desc: 'Bootstrapping, angel investors, venture capital, bank loans' },
        { title: 'Understanding Valuations', desc: 'Pre-money vs post-money, equity dilution, valuation methods' },
        { title: 'Unit Economics Simplified', desc: 'CAC vs LTV, contribution margin, profitability per unit' },
        { title: 'Small Business Taxation', desc: 'GST registration basics, input tax credit, corporate tax' }
    ]
  },
  {
    id: 'real-world',
    title: 'Real World Money Skills',
    description: 'Navigating big life purchases and contracts.',
    icon: Home,
    color: 'cyan',
    accentColor: 'from-cyan-500 to-sky-600',
    modules: [
        { title: 'Home Buying Step-by-Step', desc: 'Down payments, home loan eligibility, hidden costs' },
        { title: 'Rental Agreements & Rights', desc: 'Lease terms, security deposits, tenant rights, agreements' },
        { title: 'Land / Property Document Basics', desc: 'Sale deed, khata, encumbrance certificate verification' },
        { title: 'Car Buying vs Leasing', desc: 'Depreciation, loan vs lease analysis, insurance add-ons' },
        { title: 'Co-Living & Flatmate Finances', desc: 'Splitting bills, managing shared expenses, conflict resolution' }
    ]
  },
  {
    id: 'risk-crisis',
    title: 'Money Risk & Crisis Handling',
    description: 'Preparing for and surviving financial storms.',
    icon: AlertTriangle,
    color: 'rose',
    accentColor: 'from-rose-500 to-pink-600',
    modules: [
        { title: 'Emergency Fund Blueprint', desc: 'Calculating 6 months expenses, liquidity, where to park it' },
        { title: 'Handling Job Loss Financially', desc: 'Severance management, cutting non-essentials, health insurance gap' },
        { title: 'Managing Inflation in Daily Life', desc: 'Purchasing power, adjusting budget, inflation-beating assets' },
        { title: 'Economic Recession Survival Plan', desc: 'Job security measures, cash hoarding, defensive investing' },
        { title: 'Personal Disaster Finance Plan', desc: 'Insurance coverage, digital document locker, family access' }
    ]
  },
  {
    id: 'career-income',
    title: 'Career & Income Building',
    description: 'Maximizing your earning potential and professional value.',
    icon: Compass,
    color: 'sky',
    accentColor: 'from-sky-500 to-blue-600',
    modules: [
        { title: 'Portfolio & Resume Basics', desc: 'Showcasing work, resume optimization, linkedin presence' },
        { title: 'Freelancing Platforms & Payments', desc: 'Upwork and Fiverr, client contracts, invoicing, getting paid' },
        { title: 'Building a Side Business', desc: 'Idea validation, low-cost startup, managing time' },
        { title: 'Personal Branding Basics', desc: 'Online reputation, networking, thought leadership' },
        { title: 'Pricing Your Skills for Profit', desc: 'Hourly vs value-based, negotiation scripts, raising rates' }
    ]
  },
  {
    id: 'credit-mastery',
    title: 'Borrowing & Credit Mastery',
    description: 'Advanced strategies for leveraging credit and loans.',
    icon: CreditCard,
    color: 'violet',
    accentColor: 'from-violet-500 to-purple-600',
    modules: [
        { title: 'Credit Utilization Deep Dive', desc: 'Credit limits, impact on score, optimal ratio management' },
        { title: 'Loan Settlement & CIBIL Repair', desc: 'Settlement vs closing, impact on history, negotiating with banks' },
        { title: 'Balance Transfer Smart Strategy', desc: 'Interest arbitrage, processing fees, hidden terms' },
        { title: 'Credit Card Reward Optimization', desc: 'Airmiles, cashback strategies, maximizing redemption' },
        { title: 'BNPL Risks & Hacks', desc: 'Buy Now Pay Later hidden interest, credit score impact, traps' }
    ]
  },
  {
    id: 'money-psych',
    title: 'Money Psychology & Mindset',
    description: 'Mastering the mental game of wealth.',
    icon: Brain,
    color: 'fuchsia',
    accentColor: 'from-fuchsia-500 to-pink-600',
    modules: [
        { title: 'Overcoming Fear of Money', desc: 'Scarcity mindset, abundance mindset, overcoming anxiety' },
        { title: 'Building Wealth Habits', desc: 'Automating savings, cue-routine-reward, compound habits' },
        { title: 'Minimalism & Money', desc: 'Intentional spending, decluttering finances, value-based living' },
        { title: 'Financial Decision-Making Biases', desc: 'Sunk cost fallacy, confirmation bias, herd mentality' },
        { title: 'Emotional Spending Control', desc: 'Retail therapy triggers, the 24-hour rule, mindfulness' }
    ]
  },
  {
    id: 'relationships',
    title: 'Money & Relationships',
    description: 'Navigating finances with partners and others.',
    icon: HeartHandshake,
    color: 'pink',
    accentColor: 'from-pink-500 to-rose-600',
    modules: [
         { title: 'How to Negotiate Salary & Deals', desc: 'Salary research, making the ask, handling counter-offers' }
    ]
  },
  {
    id: 'alternative',
    title: 'Alternative Investments',
    description: 'Beyond stocks and bonds: Gold, Real Estate, and more.',
    icon: Layers,
    color: 'pink',
    accentColor: 'from-pink-500 to-rose-600',
    modules: [
        { title: 'Gold vs Digital Gold', desc: 'Physical gold, SGBs, ETFs, digital gold apps compared' },
        { title: 'Bonds & Govt Securities', desc: 'T-Bills, G-Secs, corporate bonds, yield curves' },
        { title: 'REITs & InvITs', desc: 'Real Estate Investment Trusts, Infrastructure Trusts basics' },
        { title: 'Commodity Investing', desc: 'Silver, oil, agricultural commodities trading basics' },
        { title: 'Art & Luxury Investing', desc: 'Investing in watches, art, wine, collectibles' },
        { title: 'International Investing', desc: 'Buying US stocks, LRS limits, global ETFs' }
    ]
  },
  {
    id: 'global',
    title: 'Global Financial Literacy',
    description: 'Understanding money on a planetary scale.',
    icon: Globe2,
    color: 'cyan',
    accentColor: 'from-cyan-500 to-sky-600',
    modules: [
        { title: 'Currency & Forex Basics', desc: 'Exchange rates, forex market structure, currency strength' },
        { title: 'Geopolitics & Markets', desc: 'How wars, elections, and policy shifts affect money' },
        { title: 'Trade Deficits Explained', desc: 'Imports vs exports, balance of payments, currency impact' },
        { title: 'Crypto Regulations', desc: 'Global crypto laws, taxation, bans and adoption' },
        { title: 'NRI Taxation Basics', desc: 'Residential status, DTAA, taxable income for NRIs' }
    ]
  },
  {
    id: 'tools',
    title: 'Practical Financial Tools',
    description: 'Hands-on training for real-world money management.',
    icon: FileText,
    color: 'slate',
    accentColor: 'from-slate-500 to-gray-600',
    modules: [
        { title: 'Excel for Finance', desc: 'NPV, XIRR, PMT formulas, loan amortization sheets' },
        { title: 'Tax Filing Step-by-Step', desc: 'ITR-1 vs ITR-4, e-filing portal guide, claiming refunds' },
        { title: 'Salary Slip Breakdown', desc: 'HRA, DA, LTA, PF deductions, in-hand calculation' },
        { title: 'Reading Bank Statements', desc: 'Tracking flows, spotting hidden charges, reconciliation' },
        { title: 'Brokerage App Walkthrough', desc: 'Placing orders, GTT, analyzing portfolio reports' }
    ]
  },
  {
    id: 'growth-life',
    title: 'Financial Growth & Life Skills',
    description: 'Long-term planning, psychology, and security.',
    icon: ShieldCheck,
    color: 'teal',
    accentColor: 'from-teal-500 to-emerald-600',
    modules: [
      { title: 'Insurance Essentials', desc: 'Term life, health insurance, premiums, coverage types' },
      { title: 'Goal Setting & Wealth Planning', desc: 'Short term goals, mid term strategy, long term wealth' },
      { title: 'Behavioural Finance', desc: 'Cognitive biases, emotional spending, money habits, self control' },
      { title: 'Debt Management & Loans', desc: 'How loans work, EMI calculations, interest traps, debt freedom' },
      { title: 'Retirement Planning', desc: 'EPF basics, NPS explained, compounding for retirement' }
    ]
  },
  {
    id: 'bonus',
    title: 'Bonus Specialized Modules',
    description: 'Expert topics on economy, real estate, and business.',
    icon: BookOpen,
    color: 'violet',
    accentColor: 'from-violet-500 to-purple-600',
    modules: [
      { title: 'Indian Financial System', desc: 'RBI role, banking structure, regulators, stock exchanges' },
      { title: 'Inflation & Economy', desc: 'How economy works, business cycles, market movements, GDP' },
      { title: 'Financial Tools Mastery', desc: 'Using UPI apps, broker platforms, budgeting apps, tax portals' },
      { title: 'Real Estate Basics', desc: 'Renting vs buying, property types, home loans, rental yields' },
      { title: 'Entrepreneurship Finance', desc: 'Profit calculations, pricing strategy, managing costs, business math' }
    ]
  }
];

// Helper to parse curriculum into structured data
const processCurriculum = (): Track[] => {
  return rawCurriculum.map(track => ({
    ...track,
    modules: track.modules.map((mod, mIdx) => ({
      id: `${track.id}-m${mIdx}`,
      title: mod.title,
      description: mod.desc,
      chapters: mod.desc.split(/,| and /).map((ch, cIdx) => ({
        id: `${track.id}-m${mIdx}-c${cIdx}`,
        title: ch.trim().replace(/^\w/, c => c.toUpperCase()), // Capitalize first letter
        isCompleted: false
      })).filter(c => c.title.length > 2) // Filter out empty splits
    }))
  }));
};

// --- Improved Markdown Renderer ---

const parseMarkdownText = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-slate-600">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-sm font-mono border border-indigo-100">$1</code>');
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const cleanContent = content
    .replace(/\\n/g, '\n')
    .replace(/#n/g, '\n')
    .trim();

  const sections = cleanContent.split('\n');
  
  return (
    <div className="space-y-4 text-slate-700 leading-relaxed font-light text-lg">
      {sections.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-3" />; 
        
        if (trimmed.startsWith('# ')) {
            return <h2 key={idx} className="text-3xl font-heading font-bold text-slate-900 mt-8 mb-4 border-b border-indigo-100/50 pb-2">{trimmed.replace(/^#\s+/, '')}</h2>;
        }
        if (trimmed.startsWith('## ')) {
            return <h3 key={idx} className="text-2xl font-heading font-bold text-indigo-900 mt-8 mb-4">{trimmed.replace(/^##\s+/, '')}</h3>;
        }
        if (trimmed.startsWith('### ')) {
            return <h4 key={idx} className="text-xl font-heading font-bold text-indigo-700 mt-6 mb-3">{trimmed.replace(/^###\s+/, '')}</h4>;
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex gap-3 ml-2 mb-2 items-start">
              <span className="text-indigo-500 font-bold mt-2 text-[10px] leading-none">●</span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: parseMarkdownText(trimmed.substring(2)) }} />
            </div>
          );
        }
         if (/^\d+\.\s/.test(trimmed)) {
             return (
                <div key={idx} className="flex gap-3 ml-2 mb-2 items-start">
                  <span className="text-indigo-600 font-bold min-w-[20px]">{trimmed.match(/^\d+\./)?.[0]}</span>
                  <span className="flex-1" dangerouslySetInnerHTML={{ __html: parseMarkdownText(trimmed.replace(/^\d+\.\s/, '')) }} />
                </div>
             );
         }

        return (
          <p key={idx} className="mb-4" dangerouslySetInnerHTML={{ __html: parseMarkdownText(trimmed) }} />
        );
      })}
    </div>
  );
};

// --- Main View Component ---

interface LearnProps {
    userStats: UserStats;
    updateStats: (newStats: Partial<UserStats>) => void;
}

const Learn: React.FC<LearnProps> = ({ userStats, updateStats }) => {
  const tracks = useMemo(() => processCurriculum(), []);
  
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [lessonData, setLessonData] = useState<GeneratedLessonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Quiz State
  const [quizMode, setQuizMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [chapterCompleted, setChapterCompleted] = useState(false);

  const handleChapterSelect = async (chapter: Chapter, moduleTitle: string) => {
    setActiveChapter(chapter);
    setLessonData(null);
    setQuizMode(false);
    setChapterCompleted(false);
    setCurrentQ(0);
    setQuizScore(0);
    setIsLoading(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // Pass the Chapter title as the topic, and Module title as context
      const data = await generateLessonContent(chapter.title, moduleTitle);
      if (data) {
          setLessonData(data);
      } else {
          setLessonData({
              title: "Error",
              content: "### Connection Error\nCould not generate lesson. Please check API key.",
              quiz: []
          });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizAnswer = (idx: number) => {
      if (isAnswered) return;
      setSelectedOpt(idx);
      setIsAnswered(true);

      const isCorrect = idx === lessonData?.quiz[currentQ].correctAnswer;
      if (isCorrect) {
          setQuizScore(s => s + 1);
      }
  };

  const handleNextQuestion = () => {
      if (!lessonData) return;
      
      if (currentQ < lessonData.quiz.length - 1) {
          setCurrentQ(c => c + 1);
          setSelectedOpt(null);
          setIsAnswered(false);
      } else {
          finishChapter();
      }
  };

  const finishChapter = () => {
      setChapterCompleted(true);
      const xpEarned = 50 + (quizScore * 10); 
      
      updateStats({
          xp: userStats.xp + xpEarned,
          lessonsCompleted: userStats.lessonsCompleted + 1, // Treat chapters as lessons for stats
          quizScore: userStats.quizScore + quizScore
      });

      confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#8b5cf6', '#ec4899']
      });
  };

  const resetView = () => {
    setActiveChapter(null);
    setLessonData(null);
  };

  // --- View: Player (Chapter Content) ---
  if (selectedTrack && selectedModule && activeChapter) {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500 pb-20">
        <button 
          onClick={resetView}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to {selectedModule.title}
        </button>

        <div className="backdrop-blur-2xl bg-gradient-to-br from-[#fdfbf7] via-[#f5f7fa] to-[#fdfbf7] rounded-[2.5rem] shadow-xl border border-white/60 overflow-hidden min-h-[70vh] relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[600px] gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 bg-indigo-50 rounded-full"></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-heading font-bold text-slate-800">Generating Content...</p>
                <p className="text-sm text-slate-500">Curating knowledge for "{activeChapter.title}"</p>
              </div>
            </div>
          ) : !quizMode ? (
            <div className="p-8 md:p-14">
               {lessonData && (
                   <>
                    <div className="mb-10 pb-8 border-b border-indigo-50/50">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100/50">
                            <BookOpen size={12} /> {selectedModule.title}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4 leading-tight">{lessonData.title}</h1>
                        <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                             <span className="flex items-center gap-1"><Globe2 size={16}/> Denari AI</span>
                             <span className="w-1 h-1 bg-slate-300 rounded-full" />
                             <span>Chapter {selectedModule.chapters.findIndex(c => c.id === activeChapter.id) + 1}</span>
                        </div>
                    </div>

                    <MarkdownRenderer content={lessonData.content} />
                    
                    {lessonData.simulator && lessonData.simulator !== 'null' && (
                        <div className="mt-16 mb-16 transform scale-[1.02]">
                            <MiniCalculator type={lessonData.simulator as any} />
                        </div>
                    )}

                    <div className="mt-16 pt-10 border-t border-indigo-50/50 flex flex-col items-center text-center gap-6">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100 max-w-lg w-full shadow-sm">
                            <h4 className="font-heading font-bold text-indigo-900 flex items-center justify-center gap-2 mb-2 text-lg">
                                <BrainCircuit size={24} className="text-indigo-600" /> Knowledge Check
                            </h4>
                            <p className="text-slate-600">Complete the quiz to earn XP and finish this chapter.</p>
                        </div>
                        <button 
                        onClick={handleStartQuiz}
                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all transform hover:scale-105 shadow-xl hover:shadow-indigo-200 flex items-center gap-3 text-lg"
                        >
                        Start Quiz <ChevronRight size={20} />
                        </button>
                    </div>
                   </>
               )}
            </div>
          ) : (
            <div className="p-8 md:p-14">
                {!chapterCompleted ? (
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-slate-900">Quiz Challenge</h2>
                                <p className="text-slate-500 text-sm">Chapter Assessment</p>
                            </div>
                            <div className="w-16 h-16 rounded-full border-4 border-indigo-100 flex items-center justify-center font-heading font-bold text-indigo-600 text-xl bg-white">
                                {currentQ + 1}<span className="text-sm text-slate-400 font-normal">/{lessonData?.quiz.length}</span>
                            </div>
                        </div>

                        {lessonData && (
                            <div className="space-y-8">
                                <h3 className="text-2xl font-medium text-slate-800 leading-relaxed font-heading">
                                    {lessonData.quiz[currentQ].question}
                                </h3>

                                <div className="space-y-4">
                                    {lessonData.quiz[currentQ].options.map((opt, idx) => {
                                        let btnClass = "w-full p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between group relative overflow-hidden ";
                                        if (isAnswered) {
                                            if (idx === lessonData.quiz[currentQ].correctAnswer) btnClass += "border-emerald-500 bg-emerald-50 text-emerald-900";
                                            else if (idx === selectedOpt) btnClass += "border-rose-500 bg-rose-50 text-rose-900";
                                            else btnClass += "border-slate-100 text-slate-400 opacity-50 bg-white/50";
                                        } else {
                                            btnClass += "border-slate-100 hover:border-indigo-300 hover:bg-white hover:shadow-md bg-white/60";
                                        }

                                        return (
                                            <button 
                                                key={idx}
                                                onClick={() => handleQuizAnswer(idx)}
                                                disabled={isAnswered}
                                                className={btnClass}
                                            >
                                                <span className="font-medium relative z-10">{opt}</span>
                                                {isAnswered && idx === lessonData.quiz[currentQ].correctAnswer && <CheckCircle2 className="text-emerald-600 relative z-10" size={24} />}
                                                {isAnswered && idx === selectedOpt && idx !== lessonData.quiz[currentQ].correctAnswer && <XCircle className="text-rose-600 relative z-10" size={24} />}
                                            </button>
                                        )
                                    })}
                                </div>

                                {isAnswered && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="bg-indigo-50 p-6 rounded-2xl text-indigo-900 mb-8 border border-indigo-100/50">
                                            <strong className="block mb-2 text-indigo-700 font-heading">Insight:</strong> 
                                            <p className="opacity-90 leading-relaxed">{lessonData.quiz[currentQ].explanation}</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <button 
                                                onClick={handleNextQuestion}
                                                className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-600 shadow-lg hover:shadow-indigo-200 transition-all"
                                            >
                                                {currentQ < lessonData.quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16 animate-in zoom-in duration-500 flex flex-col items-center">
                        <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-8 text-amber-500 shadow-xl shadow-amber-100">
                            <Trophy size={64} fill="currentColor" />
                        </div>
                        <h2 className="text-4xl font-heading font-extrabold text-slate-900 mb-2">Chapter Complete!</h2>
                        <p className="text-slate-500 text-lg mb-10 max-w-md">You've mastered <br/><span className="text-indigo-600 font-semibold">{activeChapter.title}</span></p>
                        
                        <div className="flex gap-4 mb-12">
                             <div className="bg-white p-6 rounded-2xl w-40 border border-emerald-100 shadow-sm">
                                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Score</p>
                                <p className="text-4xl font-heading font-extrabold text-slate-900">{quizScore}/{lessonData?.quiz.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl w-40 border border-amber-100 shadow-sm">
                                <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">XP Earned</p>
                                <p className="text-4xl font-heading font-extrabold text-slate-900">+{50 + (quizScore * 10)}</p>
                            </div>
                        </div>

                        <div>
                            <button 
                                onClick={resetView}
                                className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-slate-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                            >
                                Continue Learning
                            </button>
                        </div>
                    </div>
                )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- View: Module Details (Level 2) ---
  if (selectedTrack && selectedModule) {
    return (
      <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
         <button 
          onClick={() => setSelectedModule(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to {selectedTrack.title}
        </button>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 mb-8 border border-slate-100 shadow-xl relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedTrack.accentColor} opacity-10 rounded-full blur-3xl -mr-16 -mt-16`}></div>
             
             <div className="relative z-10">
                 <span className={`inline-block px-3 py-1 rounded-full bg-${selectedTrack.color}-50 text-${selectedTrack.color}-700 text-xs font-bold uppercase tracking-wide mb-4`}>
                    Module {selectedTrack.modules.findIndex(m => m.id === selectedModule.id) + 1}
                 </span>
                 <h2 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">{selectedModule.title}</h2>
                 <p className="text-slate-500 text-xl leading-relaxed max-w-3xl">{selectedModule.description}</p>
             </div>
        </div>

        <div className="grid gap-4">
             {selectedModule.chapters.map((chapter, idx) => (
                 <div 
                    key={chapter.id}
                    className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center justify-between cursor-pointer"
                    onClick={() => handleChapterSelect(chapter, selectedModule.title)}
                 >
                     <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                             {idx + 1}
                         </div>
                         <div>
                             <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{chapter.title}</h3>
                             <p className="text-xs text-slate-400 font-medium mt-1">5-10 mins • 50 XP</p>
                         </div>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 transition-colors">
                         <PlayCircle size={24} />
                     </div>
                 </div>
             ))}
        </div>
      </div>
    )
  }

  // --- View: Track Details (Level 1) ---
  if (selectedTrack) {
    const Icon = selectedTrack.icon;
    return (
      <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
        <button 
          onClick={() => setSelectedTrack(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to Academy
        </button>

        <div className={`rounded-[2.5rem] p-10 mb-10 relative overflow-hidden shadow-2xl bg-gradient-to-br ${selectedTrack.accentColor}`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-[80px] -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 text-white">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Icon size={48} />
            </div>
            <div>
              <h2 className="text-4xl font-heading font-bold mb-3">{selectedTrack.title}</h2>
              <p className="text-white/90 text-lg max-w-2xl leading-relaxed font-light">{selectedTrack.description}</p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-heading font-bold text-slate-900 mb-6 px-2">Core Modules</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedTrack.modules.map((module, idx) => (
            <div 
              key={module.id}
              onClick={() => setSelectedModule(module)}
              className="bg-white p-8 rounded-[2rem] border border-slate-100/80 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                 <div className={`w-14 h-14 rounded-2xl bg-${selectedTrack.color}-50 text-${selectedTrack.color}-600 flex items-center justify-center font-heading font-bold text-xl`}>
                    {idx + 1}
                 </div>
                 <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-wider">
                     {module.chapters.length} Chapters
                 </span>
              </div>
              
              <h4 className="text-xl font-heading font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">
                {module.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                 {module.description}
              </p>

              <div className="flex flex-wrap gap-2">
                  {module.chapters.slice(0, 3).map((ch, i) => (
                      <span key={i} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100">
                          {ch.title}
                      </span>
                  ))}
                  {module.chapters.length > 3 && (
                      <span className="text-[10px] bg-slate-50 text-slate-400 px-2 py-1 rounded border border-slate-100">
                          +{module.chapters.length - 3} more
                      </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- View: Academy Dashboard (Level 0) ---
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/50">
        <div className="max-w-2xl">
            <h2 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">Denari Academy</h2>
            <p className="text-slate-500 text-xl font-light">
            {tracks.reduce((acc, t) => acc + t.modules.length, 0)} Modules. {tracks.length} Learning Tracks. Infinite Knowledge.
            </p>
        </div>
        <div className="glass-card px-6 py-3 rounded-2xl border border-amber-200 flex items-center gap-3 text-amber-700 font-bold whitespace-nowrap shadow-sm bg-amber-50/50">
            <Award size={24} className="text-amber-500" />
            <span className="text-lg">{userStats.xp} XP Earned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => {
          const Icon = track.icon;
          
          return (
            <div 
              key={track.id}
              onClick={() => setSelectedTrack(track)}
              className="backdrop-blur-xl bg-gradient-to-br from-[#f8faff] to-[#fff] p-8 rounded-[2rem] border border-white/60 hover:border-indigo-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${track.accentColor} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`} />
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm bg-white border border-slate-50`}>
                <Icon size={32} className={`text-${track.color}-600`} />
              </div>
              
              <h3 className="text-2xl font-heading font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">
                {track.title}
              </h3>
              
              <p className="text-slate-500 mb-8 leading-relaxed text-sm font-medium h-10 line-clamp-2">
                {track.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">
                  {track.modules.length} Modules
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Learn;
