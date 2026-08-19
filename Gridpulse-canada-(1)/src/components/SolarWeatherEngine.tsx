import React, { useState } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  Sparkles,
  BatteryCharging,
  TrendingUp,
  Info,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { getSolarWeatherForecast } from '../data/ontarioRates';

interface SolarWeatherEngineProps {
  onOpenWaitlist?: () => void;
}

export const SolarWeatherEngine: React.FC<SolarWeatherEngineProps> = ({ onOpenWaitlist }) => {
  const [selectedCondition, setSelectedCondition] = useState<'sunny' | 'partly_cloudy' | 'overcast' | 'rain'>('sunny');
  const forecast = getSolarWeatherForecast(selectedCondition);

  return (
    <section id="solar-forecast" className="py-12 border-b border-slate-800 bg-[#07090E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-3 h-3 text-amber-400" />
                Next-Gen Solar & Weather Forecasting Engine
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
              Smart Solar Soak™: Zero-Waste Rooftop Absorption
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Standard battery apps blindly fill to 100% overnight at 3.9¢, wasting free daytime rooftop solar.
              Gridpulse predicts tomorrow's irradiance and throttles overnight grid charging to create exact solar headroom.
            </p>
          </div>

          {/* Interactive Weather Scenario Toggles */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              id="forecast-sunny-btn"
              onClick={() => setSelectedCondition('sunny')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCondition === 'sunny'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Sunny</span>
            </button>

            <button
              id="forecast-partly-btn"
              onClick={() => setSelectedCondition('partly_cloudy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCondition === 'partly_cloudy'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
              <span>Partly Cloudy</span>
            </button>

            <button
              id="forecast-overcast-btn"
              onClick={() => setSelectedCondition('overcast')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCondition === 'overcast'
                  ? 'bg-slate-700 text-slate-200 border border-slate-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cloud className="w-3.5 h-3.5 text-slate-300" />
              <span>Overcast</span>
            </button>

            <button
              id="forecast-rain-btn"
              onClick={() => setSelectedCondition('rain')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCondition === 'rain'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span>Rain / Storm</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Engine Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Decision Logic & Autonomous Battery Action (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Dynamic Solar Soak Recommendation Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Autonomous Soak Dispatch Strategy
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Active Rule
                </span>
              </div>

              {/* Strategy Text */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                    {forecast.soakRecommendation}
                  </p>
                </div>
              </div>

              {/* Battery Headroom Split Visualizer */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Overnight 3.9¢ ULO Charge Limit</span>
                  <span className="text-emerald-400 font-bold">{forecast.batteryOvernightHoldPct}% SoC</span>
                </div>
                <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
                  {/* Grid Portion */}
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-mono font-bold text-slate-950"
                    style={{ width: `${forecast.batteryOvernightHoldPct}%` }}
                  >
                    {forecast.batteryOvernightHoldPct > 20 && `ULO ${forecast.batteryOvernightHoldPct}%`}
                  </div>
                  {/* Solar Headroom Portion */}
                  <div
                    className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-mono font-bold text-slate-950"
                    style={{ width: `${100 - forecast.batteryOvernightHoldPct}%` }}
                  >
                    {100 - forecast.batteryOvernightHoldPct > 20 && `Solar Headroom ${100 - forecast.batteryOvernightHoldPct}%`}
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>3.9¢ Grid Top-Up (11 PM - 7 AM)</span>
                  <span className="text-amber-400/90 font-medium">0¢ Free Solar Soak (Daytime)</span>
                </div>
              </div>

              {/* Key Forecast Parameters */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Peak Irradiance</span>
                  <span className="font-mono text-sm font-bold text-slate-200">{forecast.peakIrradianceWpM2} W/m²</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Est. Daily Generation</span>
                  <span className="font-mono text-sm font-bold text-amber-400">{forecast.projectedGenerationKwh} kWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 24-Hour Solar Irradiance Curve & Interval Schedule (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <h3 className="font-display font-bold text-sm text-white">
                      24-Hour Solar Radiation & Inverter Telemetry Curve
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Sunrise {forecast.sunriseTime} • Solar Noon {forecast.solarNoonTime}
                  </span>
                </div>

                {/* Irradiance Bar Curve */}
                <div className="grid grid-cols-8 gap-2 items-end h-36 pt-4 pb-2 px-2 bg-slate-950/80 rounded-xl border border-slate-800/80">
                  {forecast.hourlyIrradiance.map((item, idx) => {
                    const heightPct = Math.max(8, (item.irradiance / 940) * 100);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[9px] font-mono text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.generationKw}kW
                        </span>
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-amber-500/40 via-amber-400 to-amber-300 border-t border-amber-300 transition-all duration-300 hover:brightness-125"
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-[10px] font-mono text-slate-400">{item.hour}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explainer / Protection Guarantee */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong>Zero-Clipping Guarantee:</strong> When rooftop solar exceeds household load during mid-day,
                  Gridpulse directs excess kWh into the battery first, then throttles EV charger speed dynamically to absorb 100% locally with zero export penalty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
