import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Power,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  Flame,
} from 'lucide-react';

interface ControlDeckProps {
  onOpenEvseModal?: () => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({ onOpenEvseModal }) => {
  const [autopilotEnabled, setAutopilotEnabled] = useState<boolean>(true);
  const [socFloorPercent, setSocFloorPercent] = useState<number>(30); // 30% reserve
  const [departureTime, setDepartureTime] = useState<string>('07:00');
  const [evTargetSoc, setEvTargetSoc] = useState<number>(85);
  const [isOverrideActive, setIsOverrideActive] = useState<boolean>(false);
  const [overrideDurationHrs, setOverrideDurationHrs] = useState<number>(2);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleAutopilot = () => {
    const nextState = !autopilotEnabled;
    setAutopilotEnabled(nextState);
    triggerToast(
      nextState
        ? 'Autopilot Armed: Autonomous ULO arbitrage & peak defense active.'
        : 'Autopilot Disarmed: Devices returned to local schedules.'
    );
  };

  const handleInstantOverride = () => {
    if (isOverrideActive) {
      setIsOverrideActive(false);
      triggerToast('Emergency Override cancelled. Normal arbitrage resumed.');
    } else {
      setIsOverrideActive(true);
      triggerToast(
        `Emergency Force Charge Armed: Charging at max rate for ${overrideDurationHrs} hours regardless of tariff.`
      );
    }
  };

  return (
    <section id="control-deck" className="py-12 md:py-16 border-t border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-xl animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
              <Sliders className="w-3 h-3" />
              <span>Guardrails & Automation Deck</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Autopilot Controls & Resiliency Floors.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Configure battery outage reserves, daily EV departure readiness, and safety overrides so arbitrage never compromises comfort.
            </p>
          </div>

          {/* Master Switch Status Pill */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Autopilot Engine</span>
              <span className={`text-xs font-bold ${autopilotEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                {autopilotEnabled ? 'Autonomous Arbitrage Active' : 'Manual Fallback Mode'}
              </span>
            </div>
            <button
              id="autopilot-master-toggle"
              onClick={handleToggleAutopilot}
              className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autopilotEnabled ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  autopilotEnabled ? 'translate-x-8 text-emerald-600' : 'translate-x-0 text-slate-400'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>

        {/* 4-Card Control Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Card 1: SoC Floor Guardrail */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase font-mono">SoC Floor Reserve</h3>
                    <span className="text-[10px] text-slate-400">Outage Buffer</span>
                  </div>
                </div>
                <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {socFloorPercent}%
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Protects a minimum energy reserve during peak discharge for Ontario ice storms or local substation cuts.
              </p>

              <div className="space-y-2">
                <input
                  id="soc-floor-slider"
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={socFloorPercent}
                  onChange={(e) => setSocFloorPercent(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>20% (Aggressive)</span>
                  <span>50%</span>
                  <span>80% (High Reserve)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Arbitrage Depth</span>
              <span className="text-emerald-400 font-bold">{100 - socFloorPercent}% Usable Daily</span>
            </div>
          </div>

          {/* Card 2: Morning Departure Target */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase font-mono">Morning Target</h3>
                    <span className="text-[10px] text-slate-400">EV Readiness</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {departureTime} EDT
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Guarantees vehicle is pre-conditioned and charged to target before the 3.9¢ ULO window closes at 7:00 AM.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="departure-time-picker" className="text-[10px] text-slate-400 font-mono block mb-1">Departure Time</label>
                  <input
                    id="departure-time-picker"
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label htmlFor="target-soc-select" className="text-[10px] text-slate-400 font-mono block mb-1">Target EV SoC</label>
                  <select
                    id="target-soc-select"
                    value={evTargetSoc}
                    onChange={(e) => setEvTargetSoc(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value={70}>70% (~350 km)</option>
                    <option value={80}>80% (~400 km)</option>
                    <option value={85}>85% (~430 km)</option>
                    <option value={90}>90% (~460 km)</option>
                    <option value={100}>100% (Trip)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>ULO Window</span>
              <span className="text-cyan-400 font-bold">11:00 PM – 7:00 AM</span>
            </div>
          </div>

          {/* Card 3: Instant Override / Force Charge */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase font-mono">Instant Override</h3>
                    <span className="text-[10px] text-slate-400">Emergency Trip</span>
                  </div>
                </div>
                {isOverrideActive && (
                  <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 animate-pulse uppercase">
                    Armed
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Bypasses all tariff schedules and commands immediate 48A full-speed charging for unscheduled hospital or emergency trips.
              </p>

              <button
                id="instant-override-btn"
                onClick={handleInstantOverride}
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isOverrideActive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-slate-950 border border-rose-500/40 hover:border-rose-400 text-rose-300'
                }`}
              >
                {isOverrideActive ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Cancel Override</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>Force Full Charge (Now)</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Auto-Revert</span>
              <span className="text-slate-300">After 2 Hours</span>
            </div>
          </div>

          {/* Card 4: Hardware Fallback Protocol */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase font-mono">EVSE Fallback</h3>
                    <span className="text-[10px] text-slate-400">Local Hardware</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-bold uppercase">
                  OCPP 1.6J
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                For non-connected EVs (Hyundai, Chevy, Ford), switch charging schedules directly at the wallbox hardware level.
              </p>

              {onOpenEvseModal && (
                <button
                  id="open-evse-selector-btn"
                  onClick={onOpenEvseModal}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-purple-500/30 hover:border-purple-400 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure EVSE Charger</span>
                </button>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Supported EVSEs</span>
              <span className="text-purple-300 font-bold">Tesla, Wallbox, Emporia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
