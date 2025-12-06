import React from 'react';
import { LayoutDashboard, GraduationCap, BrainCircuit, Sparkles, PieChart, CandlestickChart, X, User } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, setIsOpen }) => {
  
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.LEARN, label: 'Academy', icon: GraduationCap },
    { id: ViewState.MARKET, label: 'Market', icon: CandlestickChart },
    { id: ViewState.CALCULATORS, label: 'Simulators', icon: PieChart },
    { id: ViewState.QUIZ, label: 'Challenges', icon: BrainCircuit },
    { id: ViewState.ADVISOR, label: 'AI Advisor', icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full glass-sidebar border-r border-white/50 z-30 transition-transform duration-300 ease-in-out w-[280px]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static flex flex-col shadow-xl md:shadow-none
      `}>
        <div className="flex items-center justify-between p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-heading font-bold text-2xl">D</span>
            </div>
            <span className="text-2xl font-heading font-bold text-slate-800 tracking-tight">Denari</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-slate-800 transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }
                `}
              >
                <Icon 
                  size={22} 
                  className={`transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="tracking-wide">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6">
            <div className="glass-card p-4 rounded-2xl border border-white/60 bg-gradient-to-br from-indigo-500/5 to-violet-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold shadow-md">
                  <User size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 truncate">My Portfolio</p>
                  <p className="text-xs text-indigo-600 font-medium truncate">Pro Member</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;