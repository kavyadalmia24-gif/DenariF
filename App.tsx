
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Calculators from './views/Calculators';
import Quiz from './views/Quiz';
import Learn from './views/Learn';
import Advisor from './views/Advisor';
import Market from './views/Market';
import { ViewState, UserStats, Stock, NewsItem, PendingOrder, PortfolioItem } from './types';
import { Menu } from 'lucide-react';
import { INITIAL_STOCKS, generateMarketNews, calculateNextPrice } from './utils/marketData';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Market Simulation State (Global)
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [marketSentiment, setMarketSentiment] = useState(0); // -1 to 1

  // Centralized User State
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 850,
    level: 1,
    coins: 100,
    lessonsCompleted: 3,
    quizScore: 0,
    walletBalance: 10000,
    holdings: [],
    watchlist: ['TCH', 'BIO', 'AIX', 'GRN'],
    completedChapterIds: [],
    pendingOrders: [],
    achievements: [
        { id: 'first_trade', title: 'First Steps', description: 'Complete your first trade', icon: '🚀', unlocked: false },
        { id: 'profit_king', title: 'Profit King', description: 'Make $1000 profit', icon: '👑', unlocked: false },
        { id: 'risk_taker', title: 'Risk Taker', description: 'Execute a Short Sell', icon: '⚡', unlocked: false }
    ],
    missions: [
        { id: 'm1', title: 'Execute 3 Trades', target: 3, progress: 0, rewardXP: 100, rewardCoins: 50, completed: false, type: 'TRADE_COUNT' },
        { id: 'm2', title: 'Diversify Portfolio (3 Sectors)', target: 3, progress: 0, rewardXP: 150, rewardCoins: 75, completed: false, type: 'DIVERSIFY' }
    ],
    streakDays: 3
  });

  // --- GLOBAL MARKET ENGINE ---
  useEffect(() => {
    const interval = setInterval(() => {
      
      // 1. Generate News
      const freshNews = generateMarketNews(stocks);
      if (freshNews) {
        setNewsFeed(prev => [freshNews, ...prev].slice(0, 10)); // Keep last 10
        // Adjust stock sentiment based on news
        if (freshNews.affectedSymbol) {
             setStocks(current => current.map(s => 
                s.symbol === freshNews.affectedSymbol 
                ? { ...s, sentiment: freshNews.sentiment === 'POSITIVE' ? 0.8 : -0.8 } 
                : s
             ));
        }
      }

      // 2. Update Prices & Execute Orders
      setStocks(currentStocks => {
        const updatedStocks = currentStocks.map(stock => {
          // Calculate Price Move
          let newsImpact = 0;
          if (freshNews?.affectedSymbol === stock.symbol) newsImpact = freshNews.sentiment === 'POSITIVE' ? 0.02 : -0.02;
          if (freshNews?.affectedSector === stock.category) newsImpact = freshNews.sentiment === 'POSITIVE' ? 0.01 : -0.01;

          const newPrice = calculateNextPrice(stock, marketSentiment, newsImpact);
          
          const newHistory = [...stock.history, { 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', second:'2-digit' }), 
            price: newPrice 
          }].slice(-30); 

          // Decay Sentiment back to neutral
          const newSentiment = stock.sentiment * 0.95;

          return {
            ...stock,
            price: newPrice,
            sentiment: newSentiment,
            change: ((newPrice - stock.history[0].price) / stock.history[0].price) * 100,
            history: newHistory
          };
        });

        // 3. CHECK PENDING ORDERS
        const executedOrders: PendingOrder[] = [];
        const remainingOrders: PendingOrder[] = [];
        let balanceChange = 0;
        let newHoldings = [...userStats.holdings];

        userStats.pendingOrders.forEach(order => {
            const stock = updatedStocks.find(s => s.symbol === order.symbol);
            if (!stock) return;

            let executed = false;
            // LIMIT BUY: Execute if Price <= Target
            if (order.type === 'LIMIT_BUY' && stock.price <= order.targetPrice) {
                executed = true;
                const cost = stock.price * order.quantity; // Funds already reserved? For simplicity, deduct now or assume reserved.
                // Assuming funds reserved on order creation, we just convert to holding. 
                // BUT for this simplified app, let's assume funds are deducted ON EXECUTION for limit orders to keep logic simple.
                // NOTE: Real apps reserve funds. We will deduct now.
                if (userStats.walletBalance >= cost) {
                    balanceChange -= cost;
                    const existing = newHoldings.find(h => h.symbol === order.symbol && h.type === 'LONG');
                    if (existing) {
                        const totalQty = existing.quantity + order.quantity;
                        existing.avgPrice = ((existing.avgPrice * existing.quantity) + (stock.price * order.quantity)) / totalQty;
                        existing.quantity = totalQty;
                    } else {
                        newHoldings.push({ symbol: stock.symbol, quantity: order.quantity, avgPrice: stock.price, type: 'LONG', leverage: order.leverage });
                    }
                } else {
                    executed = false; // Failed due to funds
                }
            } 
            // STOP LOSS: Execute SELL if Price <= Target
            else if (order.type === 'STOP_LOSS' && stock.price <= order.targetPrice) {
                 executed = true;
                 const holding = newHoldings.find(h => h.symbol === order.symbol);
                 if (holding && holding.quantity >= order.quantity) {
                     balanceChange += stock.price * order.quantity;
                     holding.quantity -= order.quantity;
                     if (holding.quantity === 0) newHoldings = newHoldings.filter(h => h.symbol !== order.symbol);
                 }
            }

            if (executed) {
                executedOrders.push(order);
                // Trigger notification?
            } else {
                remainingOrders.push(order);
            }
        });

        if (executedOrders.length > 0) {
            setUserStats(prev => ({
                ...prev,
                walletBalance: prev.walletBalance + balanceChange,
                holdings: newHoldings,
                pendingOrders: remainingOrders
            }));
             // Ideally show a toast here
        }

        return updatedStocks;
      });

    }, 2000); // 2 second tick

    return () => clearInterval(interval);
  }, [userStats.pendingOrders, userStats.walletBalance, userStats.holdings]); // Dependencies for order execution

  // 1. Load User Stats from Local Storage on Mount
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('denari_user_stats');
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setUserStats(prev => ({
          ...prev,
          ...parsed,
          level: parsed.level || 1,
          coins: parsed.coins || 100,
          missions: parsed.missions || prev.missions,
          achievements: parsed.achievements || prev.achievements,
          holdings: parsed.holdings || [],
          pendingOrders: parsed.pendingOrders || []
        }));
      }
    } catch (e) {
      console.error("Failed to load local stats", e);
    }
  }, []);

  // 2. Auto-save to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem('denari_user_stats', JSON.stringify(userStats));
    } catch (e) {
      console.error("Failed to save stats", e);
    }
  }, [userStats]);

  const updateStats = (newStats: Partial<UserStats>) => {
    setUserStats(prev => {
        const updated = { ...prev, ...newStats };
        // Check Level Up
        const newLevel = Math.floor(updated.xp / 1000) + 1;
        if (newLevel > prev.level) {
            updated.level = newLevel;
            updated.coins += 50; // Level up reward
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        }
        return updated;
    });
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} userStats={userStats} stocks={stocks} />;
      case ViewState.CALCULATORS:
        return <Calculators />;
      case ViewState.QUIZ:
        return <Quiz />;
      case ViewState.LEARN:
        return <Learn userStats={userStats} updateStats={updateStats} />;
      case ViewState.ADVISOR:
        return <Advisor />;
      case ViewState.MARKET:
        return <Market key="market-view-pro" userStats={userStats} updateStats={updateStats} stocks={stocks} newsFeed={newsFeed} />;
      default:
        return <Dashboard onNavigate={setCurrentView} userStats={userStats} stocks={stocks} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative selection:bg-violet-200 selection:text-violet-900">
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[20%] right-[20%] w-[300px] h-[300px] bg-teal-100/40 rounded-full blur-[80px] pointer-events-none" />

      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <div className="md:hidden bg-white/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-slate-200/50 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-indigo-900 font-heading font-bold text-xl">
             Denari
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 hover:text-indigo-600 transition-colors">
            <Menu size={24} />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-10">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
