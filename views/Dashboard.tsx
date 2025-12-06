
import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Award, ArrowRight, Zap, Target, BookOpen, Briefcase, CandlestickChart } from 'lucide-react';
import { ViewState, UserStats, Stock } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  userStats: UserStats;
  stocks: Stock[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userStats, stocks }) => {
  
  // Calculate Portfolio Value based on live stock prices
  const portfolioValue = useMemo(() => {
    return (userStats.holdings || []).reduce((acc, curr) => {
      const liveStock = stocks.find(s => s.symbol === curr.symbol);
      const price = liveStock ? liveStock.price : curr.avgPrice;
      return acc + (curr.quantity * price);
    }, 0);
  }, [userStats.holdings, stocks]);

  const totalNetWorth = (userStats.walletBalance || 0) + portfolioValue;

  // Get Top Movers
  const topMovers = useMemo(() => {
    return [...stocks].sort((a, b) => b.change - a.change).slice(0, 4);
  }, [stocks]);

  const marketTrend = useMemo(() => {
    const positiveCount = stocks.filter(s => s.change > 0).length;
    return positiveCount > stocks.length / 2 ? 'Bullish' : 'Bearish';
  }, [stocks]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-2 tracking-tight">
            Hello, Investor! 🚀
          </h1>
          <p className="text-slate-500 text-lg">Your path to financial freedom starts here.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className={`bg-white/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/50 shadow-sm flex items-center gap-2 font-semibold ${marketTrend === 'Bullish' ? 'text-emerald-700' : 'text-rose-700'}`}>
                {marketTrend === 'Bullish' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {marketTrend} Market
            </div>
            <div className="bg-white/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/50 shadow-sm flex items-center gap-2 text-indigo-900 font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live
            </div>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={80} className="text-amber-500" />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
              <Award size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total XP</p>
              <p className="text-3xl font-heading font-bold text-slate-900">{userStats.xp}</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
              style={{ width: `${Math.min(100, (userStats.xp / 5000) * 100)}%` }} 
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Top 5% of learners this week</p>
        </div>

        {/* Stat Card 2 */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookOpen size={80} className="text-violet-500" />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center text-violet-600 shadow-inner">
              <Target size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Lessons</p>
              <p className="text-3xl font-heading font-bold text-slate-900">{userStats.lessonsCompleted}</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-violet-400 to-purple-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
              style={{ width: `${Math.min(100, (userStats.lessonsCompleted / 50) * 100)}%` }} 
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">3 Modules in progress</p>
        </div>

        {/* Stat Card 3 */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={80} className="text-emerald-500" />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
              <DollarSign size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Quiz Score</p>
              <p className="text-3xl font-heading font-bold text-slate-900">{userStats.quizScore}</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
              style={{ width: `${Math.min(100, (userStats.quizScore / 200) * 100)}%` }} 
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Accuracy rate: 92%</p>
        </div>
      </div>

      {/* MARKET PULSE SECTION (NEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Snapshot */}
          <div className="lg:col-span-1 glass-card p-8 rounded-[2rem] border border-white/60 bg-gradient-to-br from-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-[60px] opacity-40 -mr-10 -mt-10" />
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Briefcase size={20} />
                    </div>
                    <span className="font-bold text-indigo-100 uppercase tracking-widest text-xs">Portfolio Value</span>
                </div>
                <h2 className="text-4xl font-heading font-extrabold mb-2">
                    ${totalNetWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </h2>
                <div className="flex items-center gap-2 text-sm text-indigo-200 mb-8">
                    <span className="bg-indigo-500/30 px-2 py-1 rounded text-xs font-bold border border-indigo-400/30">
                        ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} Invested
                    </span>
                    <span>+ ${(userStats.walletBalance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} Cash</span>
                </div>
                <button 
                  onClick={() => onNavigate(ViewState.MARKET)}
                  className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                    Open Market <ArrowRight size={16} />
                </button>
             </div>
          </div>

          {/* Market Movers */}
          <div className="lg:col-span-2 glass-card p-6 rounded-[2rem] border border-white/60 flex flex-col">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="font-heading font-bold text-slate-800 flex items-center gap-2">
                    <CandlestickChart size={20} className="text-indigo-600" /> Top Movers
                 </h3>
                 <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">LIVE</span>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                 {topMovers.map(stock => (
                     <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-slate-100 hover:border-indigo-200 transition-colors">
                         <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs text-white ${stock.change >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                 {stock.symbol[0]}
                             </div>
                             <div>
                                 <p className="font-bold text-slate-900 text-sm">{stock.symbol}</p>
                                 <p className="text-[10px] text-slate-500 font-medium">{stock.name}</p>
                             </div>
                         </div>
                         <div className="text-right">
                             <p className="font-bold text-slate-900 text-sm">${stock.price.toFixed(2)}</p>
                             <p className={`text-xs font-bold ${stock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                 {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                             </p>
                         </div>
                     </div>
                 ))}
             </div>
          </div>
      </div>

      {/* Featured Hero Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          onClick={() => onNavigate(ViewState.CALCULATORS)}
          className="relative rounded-[2rem] p-10 overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl shadow-xl shadow-indigo-900/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-800" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-6 border border-white/20">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-white mb-3">Project Wealth</h2>
              <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
                Visualize your financial future. Use our pro-grade calculators to plan SIPs, Loans, and Investments.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3 text-white font-semibold group-hover:gap-5 transition-all">
              Launch Simulator <ArrowRight size={20} />
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate(ViewState.ADVISOR)}
          className="relative rounded-[2rem] p-10 overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl shadow-xl shadow-slate-200"
        >
          <div className="absolute inset-0 bg-white" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-100 rounded-full blur-[60px] opacity-60" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-[60px] opacity-60" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-slate-300">
                <Zap size={24} fill="currentColor" className="text-yellow-400" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-slate-900 mb-3">Ask FinBot AI</h2>
              <p className="text-slate-600 text-lg max-w-md leading-relaxed">
                Your 24/7 financial genius. Get instant answers to complex money questions in plain English.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3 text-slate-900 font-semibold group-hover:gap-5 transition-all">
              Start Conversation <ArrowRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
