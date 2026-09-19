import React from 'react';
import { ShieldCheck, Search, FileText, Users, HelpCircle, ShieldAlert } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: ShieldCheck },
    { id: 'analyze', label: 'Analyze', icon: Search },
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'community', label: 'Community Reports', icon: Users },
    { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 group-hover:bg-sky-500/20 transition-all shadow-glow-cyan">
            <ShieldAlert className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent">
              InternGuard
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-medium uppercase tracking-widest text-sky-400/80 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/20">
              AI Safety Platform
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Primary CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('analyze')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-glow-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search className="w-4 h-4" />
            <span>Analyze Opportunity</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Nav sub-header */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80 bg-[#0F172A]/90 text-xs overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 text-nowrap ${
                isActive ? 'text-sky-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
