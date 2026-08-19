import React from 'react';
import {
  Activity,
  Flame,
  Leaf,
  ShieldCheck,
  Zap,
  Radio,
  Clock,
} from 'lucide-react';
import { getIesoFuelMix } from '../data/ontarioRates';

export const IesoCarbonTelemetry: React.FC = () => {
  const fuelMix = getIesoFuelMix();
  const cleanTotal = fuelMix.nuclearPct + fuelMix.hydroPct + fuelMix.windSolarPct;

  return (
    <section id="grid-carbon" className="py-12 border-b border-slate-800 bg-[#0A0D15]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                Live IESO Provincial Grid Telemetry & Marginal Carbon
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
              Ontario Fuel Mix & Peaker Plant Displacement
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Between 4:00 PM and 9:00 PM on weekdays, Ontario fires up fossil gas peaker plants to satisfy peak grid demand.
              Gridpulse isolates your home, eliminating peaker carbon while saving you up to 35.2¢/kWh.
            </p>
          </div>

          {/* Avoided Carbon Household Badge */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                Daily Clean-Tech Impact
              </span>
              <span className="text-xs sm:text-sm font-bold text-white">
                Avoided {fuelMix.householdAvoidedCo2TodayKg} kg CO₂ Today
              </span>
            </div>
          </div>
        </div>

        {/* 4-Stat Fuel Mix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          {/* Nuclear Baseload */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">Nuclear Baseload</span>
              <span className="text-xs font-mono font-bold text-cyan-400">Bruce & Darlington</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-extrabold text-white">{fuelMix.nuclearPct}%</span>
              <span className="text-[10px] text-emerald-400 font-mono">0g CO₂/kWh</span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${fuelMix.nuclearPct}%` }} />
            </div>
          </div>

          {/* Hydro Baseload */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">Hydroelectric</span>
              <span className="text-xs font-mono font-bold text-blue-400">Niagara & St. Lawrence</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-extrabold text-white">{fuelMix.hydroPct}%</span>
              <span className="text-[10px] text-emerald-400 font-mono">Zero Emission</span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: `${fuelMix.hydroPct}%` }} />
            </div>
          </div>

          {/* Wind & Solar */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">Wind & Rooftop Solar</span>
              <span className="text-xs font-mono font-bold text-emerald-400">Renewable Capture</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-extrabold text-white">{fuelMix.windSolarPct}%</span>
              <span className="text-[10px] text-emerald-400 font-mono">100% Green</span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${fuelMix.windSolarPct}%` }} />
            </div>
          </div>

          {/* Gas Peakers */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-xs text-rose-300 font-semibold">Natural Gas Peakers</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Peak Only
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-extrabold text-rose-400">{fuelMix.gasPeakerPct}%</span>
              <span className="text-[10px] text-rose-300 font-mono">{fuelMix.marginalCarbonIntensityGPerKwh} g CO₂/kWh</span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${fuelMix.gasPeakerPct * 4}%` }} />
            </div>
          </div>
        </div>

        {/* Marginal Carbon Callout Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">
              Ontario Grid Marginal Emission Intensity: <strong className="text-white font-mono">{fuelMix.marginalCarbonIntensityGPerKwh} g CO₂/kWh</strong> during peak hours.
              At 3.9¢ ULO overnight (11 PM–7 AM), Ontario's grid runs on <strong className="text-emerald-400">94%+ clean baseload nuclear & hydro</strong>.
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 shrink-0 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>IESO 5-Min Automated Feed</span>
          </div>
        </div>
      </div>
    </section>
  );
};
