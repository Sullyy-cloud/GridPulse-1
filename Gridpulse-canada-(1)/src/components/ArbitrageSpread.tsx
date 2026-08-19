import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  Calendar,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Building2,
  Award,
  Layers,
} from 'lucide-react';
import { ONTARIO_TARIFF_TIERS, ONTARIO_UTILITIES, getOntarioGridState } from '../data/ontarioRates';

interface ArbitrageSpreadProps {
  onOpenWaitlist: () => void;
}

export const ArbitrageSpread: React.FC<ArbitrageSpreadProps> = ({ onOpenWaitlist }) => {
  const [selectedTierId, setSelectedTierId] = useState<string>('onpeak');
  const liveGrid = getOntarioGridState();

  const tiersList = Object.values(ONTARIO_TARIFF_TIERS);

  return (
    <section id="arbitrage" className="py-12 md:py-16 border-t border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <TrendingUp className="w-3 h-3" />
              <span>Economic Arbitrage Engine</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Historic <span className="text-emerald-400">10.02x Rate Spread</span> in Ontario.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              The Ontario Energy Board (OEB) ULO tariff created North America's largest residential arbitrage opportunity: a <strong className="text-white">35.2¢ / kWh price delta</strong> every weekday.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Grid: </span>
            <span className="font-bold text-emerald-400">{liveGrid.activeTier.name} ({liveGrid.activeTier.rateCents.toFixed(1)}¢)</span>
          </div>
        </div>

        {/* 10x Spread Comparison High Density Card */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 mb-8 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Left Box: ULO 3.9c */}
            <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Bulk Buy Window
                </span>
                <span className="text-[11px] text-slate-400 font-mono">11 PM – 7 AM Daily</span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-emerald-400">
                  3.9¢
                </span>
                <span className="text-slate-400 text-xs font-semibold">/ kWh (CAD)</span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">Ultra-Low Overnight Rate</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Abundant zero-carbon nuclear and hydro overnight. The province sells it virtually at cost to incentivize overnight ingestion.
              </p>

              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Fill 60 kWh EV battery for just <strong>$2.34</strong></span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Full 13.5 kWh Powerwall refill for <strong>$0.52</strong></span>
                </div>
              </div>
            </div>

            {/* Middle: 10.02x Multiplier Badge */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-rose-500 p-[2px] shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center">
                  <span className="font-display font-black text-lg text-white">10.0x</span>
                  <span className="text-[8px] uppercase font-bold text-emerald-400 tracking-wider">Spread</span>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-400 mt-2">
                +35.2¢/kWh Profit
              </span>
            </div>

            {/* Right Box: On-Peak 39.1c */}
            <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/80 border border-rose-500/40 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Surge Peak Hazard
                </span>
                <span className="text-[11px] text-slate-400 font-mono">4 PM – 9 PM Weekdays</span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-rose-400">
                  39.1¢
                </span>
                <span className="text-slate-400 text-xs font-semibold">/ kWh (CAD)</span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">Weekday On-Peak Surge</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Peak dinner & AC hours force expensive gas peaker plants. Unmanaged households pay punishing surcharges.
              </p>

              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-rose-400 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>Unmanaged EV peak charging costs <strong>$23.46</strong></span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Gridpulse automated lockout: <strong>$0.00 Peak Draw</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Tier Official OEB Tariff Grid */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {tiersList.map((tier) => {
              const isCurrent = liveGrid.activeTier.id === tier.id;
              const isSelected = selectedTierId === tier.id;

              return (
                <div
                  key={tier.id}
                  id={`tariff-card-${tier.id}`}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-slate-900/90 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                      : isSelected
                      ? 'bg-slate-900/80 border-cyan-500/60'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${
                        tier.id === 'ulo'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : tier.id === 'onpeak'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : tier.id === 'midpeak'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}
                    >
                      {tier.shortName}
                    </span>

                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/20 px-1.5 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      className={`font-display text-2xl font-extrabold ${
                        tier.id === 'ulo'
                          ? 'text-emerald-400'
                          : tier.id === 'onpeak'
                          ? 'text-rose-400'
                          : tier.id === 'midpeak'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {tier.rateCents.toFixed(1)}¢
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">/ kWh</span>
                  </div>

                  <div className="space-y-1 mb-2.5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-medium truncate">{tier.timeWindow}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{tier.applicableDays}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <p className="text-[10px] text-slate-400 leading-tight">
                      <strong className="text-slate-300">Action:</strong> {tier.actionTitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Supported Ontario LDCs Row */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <h4 className="font-display text-sm font-bold text-white">
                  Supported Ontario Local Distribution Companies (LDCs)
                </h4>
              </div>
              <p className="text-[11px] text-slate-400">
                100% interoperable across all Ontario electric utilities offering the ULO rate
              </p>
            </div>
            <button
              id="ldc-connect-btn"
              onClick={onOpenWaitlist}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Check Your LDC Feeder</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {ONTARIO_UTILITIES.map((utility) => (
              <div
                key={utility.id}
                className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="font-semibold text-xs text-slate-200 block truncate">
                    {utility.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {utility.region}
                  </span>
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-emerald-400 font-mono">
                  <span>ULO READY</span>
                  <span className="text-slate-400">{utility.customers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
