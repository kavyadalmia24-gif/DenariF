
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CALCULATORS = 'CALCULATORS',
  QUIZ = 'QUIZ',
  LEARN = 'LEARN',
  ADVISOR = 'ADVISOR',
  MARKET = 'MARKET',
}

export interface PortfolioItem {
  symbol: string;
  quantity: number;
  avgPrice: number;
  type: 'LONG' | 'SHORT';
  leverage: number;
}

export interface PendingOrder {
  id: string;
  symbol: string;
  type: 'LIMIT_BUY' | 'LIMIT_SELL' | 'STOP_LOSS';
  targetPrice: number;
  quantity: number;
  leverage: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface Mission {
  id: string;
  title: string;
  target: number;
  progress: number;
  rewardXP: number;
  rewardCoins: number;
  completed: boolean;
  type: 'TRADE_COUNT' | 'PROFIT_TARGET' | 'DIVERSIFY';
}

export interface UserStats {
  xp: number;
  level: number;
  coins: number;
  lessonsCompleted: number;
  quizScore: number;
  completedChapterIds?: string[];
  walletBalance: number;
  holdings: PortfolioItem[];
  watchlist: string[];
  pendingOrders: PendingOrder[];
  achievements: Achievement[];
  missions: Mission[];
  streakDays: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number; // Daily % change
  history: { time: string; price: number }[];
  category: string;
  sentiment: number; // -1 to 1 (Bearish to Bullish)
  volatility: number; // 0 to 1
}

export interface NewsItem {
  id: string;
  headline: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  affectedSector?: string;
  affectedSymbol?: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface CalculationResult {
  investedAmount: number;
  totalInterest: number;
  totalValue: number;
  monthlyEMI?: number;
  breakdown: Array<{ year: number; balance: number; invested: number }>;
  chartData?: Array<{ name: string; value: number; color: string }>;
  pieSegments?: Array<{ name: string; value: number; color: string }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GeneratedLessonData {
  title: string;
  content: string;
  quiz: QuizQuestion[];
  simulator?: 'SIP' | 'LUMPSUM' | 'EMI' | 'null' | null;
}
