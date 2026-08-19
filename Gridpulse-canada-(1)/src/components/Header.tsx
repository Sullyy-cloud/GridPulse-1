import React, { useState, useEffect } from 'react';
import {
  Zap,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Menu,
  X,
  Radio,
  Sparkles,
  FileSpreadsheet,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { getOntarioGridState, ONTARIO_UTILITIES } from '../data/ontarioRates';
import { OntarioGridState } from '../types';

interface HeaderProps {
  onOpenWaitlist: () => void;
  onOpenGreenButtonModal: () => void;
  onNavigate: (sectionId: string) => void;
  selectedUtilityId: string;
  onSelectUtility: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenWaitlist,
  onOpenGreenButtonModal,
  onNavigate,
  selectedUtilityId,
  onSelectUtility,
}) => {
  const [gridState, setGridState] = useState<OntarioGridState>(() => getOntarioGridState());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [utilityDropdownOpen, setUtilityDropdownOpen] = useState(false);

  // Update live Ontario clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setGridState(getOntarioGridState());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeUtility = ONTARIO_UTILITIES.find((u) => u.id === selectedUtilityId) || ONTARIO_UTILITIES[0];

  const navItems = [
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Calculator', id: 'calculator' },
    { label: 'Architecture', id: 'architecture' },
    { label: 'FAQ', id: 'faq' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#07090E]/95 backdrop-blur-xl transition-all">
      {/* Top Ontario Grid Ticker */}
      <div className="w-full bg-slate-950/90 border-b border-slate-800/80 py-1.5 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-rose-400"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_#F43F5E]"></span>
              </span>
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">ONTARIO GRID FEED (IESO / OEB)</span>
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="text-slate-400 hidden sm:flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-slate-500" />
              Toronto: <strong className="text-slate-200">{gridState.ontarioTimeString} EDT</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Ontario Grid Status Badge */}
            {gridState.activeTier.isULO ? (
              <div className="px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-[11px] font-mono flex items-center gap-2 text-emerald-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
                <span className="uppercase font-bold tracking-wider">
                  ULO WINDOW 3.9¢/KWH — BULK REFILL ACTIVE
                </span>
              </div>
            ) : gridState.activeTier.isPeak ? (
              <div className="px-3 py-1 rounded-full border border-rose-500/40 bg-rose-950/40 text-[11px] font-mono flex items-center gap-2 text-rose-300">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#F43F5E]" />
                <span className="uppercase font-bold tracking-wider">
                  WEEKDAY PEAK 39.1¢/KWH — PEAK DEFENSE ACTIVE
                </span>
              </div>
            ) : gridState.activeTier.id === 'midpeak' ? (
              <div className="px-3 py-1 rounded-full border border-amber-500/40 bg-amber-950/40 text-[11px] font-mono flex items-center gap-2 text-amber-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#F59E0B]" />
                <span className="uppercase font-bold tracking-wider">
                  WEEKDAY MID-PEAK 15.7¢/KWH — THERMAL PRE-COOL / STANDBY
                </span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-[11px] font-mono flex items-center gap-2 text-cyan-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06B6D4]" />
                <span className="uppercase font-bold tracking-wider">
                  WEEKEND OFF-PEAK 9.8¢/KWH — BASELINE CAPTURE
                </span>
              </div>
            )}

            <span className="text-slate-400 hidden md:inline text-[11px] font-mono">
              Next tier: <strong className="text-slate-200">{Math.floor(gridState.minutesUntilNextTier / 60)}h {gridState.minutesUntilNextTier % 60}m</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            id="brand-logo-btn"
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform duration-200">
              <div className="w-3.5 h-3.5 bg-white rounded-sm rotate-45"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xl tracking-tight text-white">
                  Gridpulse <span className="text-emerald-400">Canada</span>
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  OS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wide font-mono hidden sm:inline">Whole-Home Energy OS & Arbitrage</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Utility Provider Switcher Tag */}
            <div className="relative hidden md:block">
              <button
                id="utility-selector-btn"
                onClick={() => setUtilityDropdownOpen(!utilityDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold">{activeUtility.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {utilityDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-500 font-bold border-b border-slate-800">
                    Select Active Ontario LDC
                  </div>
                  {ONTARIO_UTILITIES.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUtility(u.id);
                        setUtilityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ${
                        selectedUtilityId === u.id
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <span className="truncate">{u.name}</span>
                      <span className="text-[10px] text-slate-500">{u.region.split(',')[0]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sync Utility Smart Meter (Green Button CMD) CTA */}
            <button
              id="sync-smart-meter-btn"
              onClick={onOpenGreenButtonModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
              title="Audit your smart meter using Ontario Green Button CMD"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Sync Smart Meter</span>
              <span className="sm:hidden">Sync Meter</span>
            </button>

            {/* Priority Beta CTA */}
            <button
              id="header-cta-btn"
              onClick={onOpenWaitlist}
              className="relative inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-200 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Priority Beta</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu toggle button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 xl:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/80 hover:text-emerald-400"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-3">
            <button
              id="mobile-green-button-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGreenButtonModal();
              }}
              className="w-full text-center py-2.5 rounded-xl font-bold text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Sync Utility Smart Meter (Green Button)</span>
            </button>
            <button
              id="mobile-waitlist-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWaitlist();
              }}
              className="w-full text-center py-3 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300"
            >
              Join Priority Beta (Free)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

