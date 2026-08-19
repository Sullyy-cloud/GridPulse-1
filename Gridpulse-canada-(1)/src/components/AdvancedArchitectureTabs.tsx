import React, { useState } from 'react';
import {
  Sun,
  Radio,
  Plug,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Terminal,
  Activity,
  Cpu,
} from 'lucide-react';
import { SolarWeatherEngine } from './SolarWeatherEngine';
import { IesoCarbonTelemetry } from './IesoCarbonTelemetry';
import { EvseFallbackSelector } from './EvseFallbackSelector';
import { HardwareDashboard } from './HardwareDashboard';

interface AdvancedArchitectureTabsProps {
  onOpenWaitlist: () => void;
}

export const AdvancedArchitectureTabs: React.FC<AdvancedArchitectureTabsProps> = ({
  onOpenWaitlist,
}) => {
  const [activeTab, setActiveTab] = useState<'solar' | 'ieso' | 'evse' | 'guardrails'>('solar');

  const tabs = [
    {
      id: 'solar' as const,
      label: 'Solar Soak™',
      sublabel: 'Rooftop Irradiance AI',
      icon: Sun,
      color: 'text-amber-400',
      activeBg: 'bg-amber-500/10 border-amber-500/40 text-amber-300',
    },
    {
      id: 'ieso' as const,
      label: 'IESO Telemetry',
      sublabel: 'Fuel Mix & Peaker Carbon',
      icon: Radio,
      color: 'text-cyan-400',
      activeBg: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300',
    },
    {
      id: 'evse' as const,
      label: 'EVSE Fallback',
      sublabel: 'Breaker-Level Relay Control',
      icon: Plug,
      color: 'text-teal-400',
      activeBg: 'bg-teal-500/10 border-teal-500/40 text-teal-300',
    },
    {
      id: 'guardrails' as const,
      label: 'Hardware Guardrails',
      sublabel: 'SoC Reserve & 1-Click Bypass',
      icon: Shield,
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
    },
  ];

  return (
    <section id="architecture" className="py-16 md:py-24 border-b border-slate-800/80 bg-[#07090E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Under The Hood</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Advanced Clean-Tech Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
              Explore the four core engineering modules that power Gridpulse's autonomous 3.9¢ ULO arbitrage engine across Ontario homes.
            </p>
          </div>

          <button
            id="architecture-cta-btn"
            onClick={onOpenWaitlist}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 self-start md:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Architecture Beta</span>
          </button>
        </div>

        {/* Tab Switcher Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8 p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3.5 rounded-xl text-left border transition-all flex items-start gap-3 cursor-pointer ${
                  isActive
                    ? `${tab.activeBg} shadow-lg shadow-black/40 font-semibold`
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 ${tab.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-display font-bold text-xs sm:text-sm block text-white truncate">
                    {tab.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block truncate">
                    {tab.sublabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Area */}
        <div className="rounded-3xl border border-slate-800/90 bg-slate-950/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
          {activeTab === 'solar' && (
            <SolarWeatherEngine onOpenWaitlist={onOpenWaitlist} />
          )}
          {activeTab === 'ieso' && (
            <IesoCarbonTelemetry />
          )}
          {activeTab === 'evse' && (
            <EvseFallbackSelector onOpenWaitlist={onOpenWaitlist} />
          )}
          {activeTab === 'guardrails' && (
            <HardwareDashboard onOpenWaitlist={onOpenWaitlist} />
          )}
        </div>
      </div>
    </section>
  );
};
