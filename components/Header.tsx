
import React from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'generator', label: 'Ejercicios' },
    { id: 'history', label: 'Mis Rutinas' },
    { id: 'posture', label: 'Guía Postural' },
    { id: 'prevention', label: 'Prevención' }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <div 
          className="flex flex-col items-start cursor-pointer group" 
          onClick={() => setActiveTab('generator')}
        >
          {/* Texto IMSS en verde institucional */}
          <h1 className="text-[#1e5d42] text-3xl font-serif font-extrabold tracking-tighter leading-none">
            IMSS
          </h1>
          {/* Texto Sonora en color guinda */}
          <span className="text-[#6d1d2b] text-sm font-sans font-black uppercase tracking-[0.25em] -mt-1 ml-0.5">
            Sonora
          </span>
          <div className="h-0.5 w-full bg-emerald-500/20 mt-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-bold">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-all py-1 border-b-2 uppercase tracking-widest text-[11px] ${activeTab === item.id ? 'text-emerald-400 border-emerald-500' : 'text-slate-400 border-transparent hover:text-white hover:border-slate-700'}`}
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2.5 rounded-xl transition-all border font-black text-xs flex items-center gap-2 group ${
              activeTab === 'profile' 
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40' 
                : 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
            }`}
          >
            <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            EXPEDIENTE DIGITAL
          </button>
        </nav>

        <div className="lg:hidden text-slate-400 p-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
