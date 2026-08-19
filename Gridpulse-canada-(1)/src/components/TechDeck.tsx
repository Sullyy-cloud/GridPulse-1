import React, { useState } from 'react';
import {
  Shield,
  Radio,
  Sun,
  Sparkles,
  Power,
  AlertTriangle,
  Lock,
  Unlock,
  BatteryCharging,
  Clock,
  Terminal,
  Leaf,
  Flame,
  CloudSun,
  Cloud,
  CloudRain,
  Info,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { getIesoFuelMix, getSolarWeatherForecast } from '../data/ontarioRates';
import { GuardrailSettings } from '../types';

interface TechDeckProps {
  onOpenWaitlist: () => void;
}

export const TechDeck: React.FC<TechDeckProps> = ({ onOpenWaitlist }) => {
  const [activeTab, setActiveTab] = useState<'guardrails' | 'ieso' | 'solar'>('guardrails');

  // Guardrail settings state (Tab 1)
  const [guardrailSettings, setGuardrailSettings] = useState<GuardrailSettings>({
    autopilotEnabled: true,
    emergencyOverride: false,
    socFloorPct: 50,
    morningDepartureTime: '07:00',
    sleepProtection12v: true,
    preCoolingOffsetDegrees: 2.0,
  });

  const [logs, setLogs] = useState<Array<{ id: string; time: string; level: 'info' | 'success' | 'warn'; message: string }>>([
    { id: '1', time: '16:00:01', level: 'warn', message: 'OEB Peak Window (39.1¢) triggered. Dispatched Powerwall discharge (-4.8 kW). Grid import: 0.0 kW.' },
    { id: '2', time: '16:00:00', level: 'info', message: 'Tesla Fleet Telemetry: Verified EV charging locked during 4-9 PM peak.' },
    { id: '3', time: '15:15:22', level: 'info', message: 'ecobee Smart Thermostat: Completed 15.7¢ pre-cooling cycle (20.5°C reached).' },
    { id: '4', time: '14:00:00', level: 'success', message: 'Auxiliary 12V Sleep-Guard™: Vehicle entered deep sleep state. Passive token cache active.' },
  ]);

  const [overrideNotice, setOverrideNotice] = useState<string | null>(null);

  // Solar Weather state (Tab 3)
  const [solarCondition, setSolarCondition] = useState<'sunny' | 'partly_cloudy' | 'overcast' | 'rain'>('sunny');
  const solarForecast = getSolarWeatherForecast(solarCondition);

  // IESO Fuel mix data (Tab 2)
  const fuelMix = getIesoFuelMix();

  const toggleEmergencyOverride = () => {
    const newState = !guardrailSettings.emergencyOverride;
    setGuardrailSettings((prev) => ({
      ...prev,
      emergencyOverride: newState,
      autopilotEnabled: !newState,
    }));

    const timestamp = new Date().toLocaleTimeString('en-CA', { hour12: false });
    if (newState) {
      setOverrideNotice('EMERGENCY OVERRIDE ENGAGED: All automated peak blocks bypassed. All devices returned to manual control.');
      setLogs((prev) => [
        {
          id: Date.now().toString(),
          time: timestamp,
          level: 'warn',
          message: 'USER OVERRIDE: 1-Click bypass engaged. Charging unblocked immediately.',
        },
        ...prev.slice(0, 5),
      ]);
    } else {
      setOverrideNotice('GridPulse Arbitrage Autopilot Re-engaged.');
      setLogs((prev) => [
        {
          id: Date.now().toString(),
          time: timestamp,
          level: 'success',
          message: 'AUTOPILOT RESUMED: Re-armed ULO 3.9¢ schedule and peak isolation barriers.',
        },
        ...prev.slice(0, 5),
      ]);
    }

    setTimeout(() => {
      setOverrideNotice(null);
    }, 4000);
  };

  const tabs = [
    {
      id: 'guardrails' as const,
      label: 'Safety Guardrails',
      sublabel: '12V Sleep-Guard™ & Bypass',
      icon: Shield,
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
    },
    {
      id: 'ieso' as const,
      label: 'IESO Peaker Telemetry',
      sublabel: 'Fuel Mix & Peaker Carbon',
      icon: Radio,
      color: 'text-cyan-400',
      activeBg: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300',
    },
    {
      id: 'solar' as const,
      label: 'Smart Solar Soak™',
      sublabel: 'Predictive Rooftop Soak',
      icon: Sun,
      color: 'text-amber-400',
      activeBg: 'bg-amber-500/10 border-amber-500/40 text-amber-300',
    },
  ];

  return (
    <section id="tech-deck" className="py-16 md:py-24 border-b border-slate-800/80 bg-[#07090E] relative overflow-hidden scroll-mt-20">
      {/* Anchor for architecture section */}
      <div id="architecture" className="absolute -top-20 left-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>Under The Hood</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              GridPulse Clean-Tech Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
              Explore the 3 core engineering engines powering autonomous Ontario ULO 3.9¢ load-shifting across your devices.
            </p>
          </div>

          <button
            id="techdeck-cta-btn"
            onClick={onOpenWaitlist}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 self-start md:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Priority Beta</span>
          </button>
        </div>

        {/* 3-Tab Switcher Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-8 p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`techdeck-tab-${tab.id}`}
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
        <div className="rounded-3xl border border-slate-800/90 bg-slate-950/60 backdrop-blur-2xl overflow-hidden shadow-2xl p-6 sm:p-8">
          {/* TAB 1: SAFETY GUARDRAILS */}
          {activeTab === 'guardrails' && (
            <div className="space-y-6">
              {/* Override notification banner */}
              {overrideNotice && (
                <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-xl ${
                  guardrailSettings.emergencyOverride
                    ? 'bg-rose-950/90 border border-rose-500 text-rose-200'
                    : 'bg-emerald-950/90 border border-emerald-500 text-emerald-200'
                }`}>
                  <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>{overrideNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Column: Interactive Controls */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
                    {/* Master Autopilot Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${guardrailSettings.autopilotEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                          <Power className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-white">
                            Master Arbitrage Autopilot
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Autonomous whole-home load-shifting across all connected devices
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-auto">
                        <span className={`text-[11px] font-mono font-bold ${guardrailSettings.autopilotEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {guardrailSettings.autopilotEnabled ? 'ACTIVE' : 'PAUSED'}
                        </span>
                        <button
                          type="button"
                          id="autopilot-toggle-btn"
                          onClick={() =>
                            setGuardrailSettings((prev) => ({
                              ...prev,
                              autopilotEnabled: !prev.autopilotEnabled,
                              emergencyOverride: false,
                            }))
                          }
                          className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                            guardrailSettings.autopilotEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                          }`}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                              guardrailSettings.autopilotEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 1-Click Instant Override */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>1-Click Instant Override</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Need emergency full charging right now? Tap to bypass all automated blocks.
                        </p>
                      </div>

                      <button
                        type="button"
                        id="instant-override-btn"
                        onClick={toggleEmergencyOverride}
                        className={`px-3.5 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          guardrailSettings.emergencyOverride
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {guardrailSettings.emergencyOverride ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        <span>{guardrailSettings.emergencyOverride ? 'Override Active (Lock)' : '1-Click Instant Bypass'}</span>
                      </button>
                    </div>

                    {/* Blackout Reserve Floor (SoC) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
                          <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                          Blackout Reserve Floor (Minimum Battery SoC)
                        </span>
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          {guardrailSettings.socFloorPct}% Reserve
                        </span>
                      </div>
                      <input
                        id="soc-reserve-slider"
                        type="range"
                        min="20"
                        max="80"
                        step="5"
                        value={guardrailSettings.socFloorPct}
                        onChange={(e) =>
                          setGuardrailSettings((prev) => ({
                            ...prev,
                            socFloorPct: parseInt(e.target.value, 10),
                          }))
                        }
                        className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>20% (Aggressive Arbitrage)</span>
                        <span>50% (Recommended)</span>
                        <span>80% (High Blackout Reserve)</span>
                      </div>
                    </div>

                    {/* 12V Sleep-Guard™ & Morning Departure Guarantee */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* 12V Sleep-Guard™ */}
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-emerald-400" />
                            12V Sleep-Guard™
                          </span>
                          <button
                            type="button"
                            id="sleep-guard-toggle-btn"
                            onClick={() =>
                              setGuardrailSettings((prev) => ({
                                ...prev,
                                sleepProtection12v: !prev.sleepProtection12v,
                              }))
                            }
                            className={`w-9 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                              guardrailSettings.sleepProtection12v ? 'bg-emerald-500' : 'bg-slate-800'
                            }`}
                          >
                            <div
                              className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                                guardrailSettings.sleepProtection12v ? 'translate-x-4.5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1 block">
                          Prevents vehicle vampire battery drain via passive webhook triggers
                        </span>
                      </div>

                      {/* Morning Departure */}
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                        <label htmlFor="morning-departure-input" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          Departure Guarantee
                        </label>
                        <input
                          id="morning-departure-input"
                          type="time"
                          value={guardrailSettings.morningDepartureTime}
                          onChange={(e) =>
                            setGuardrailSettings((prev) => ({
                              ...prev,
                              morningDepartureTime: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
                        />
                        <span className="text-[9px] text-slate-500 block">
                          100% full by {guardrailSettings.morningDepartureTime} AM using 3.9¢ ULO
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Event Stream & Dispatch Terminal */}
                <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Dispatch Telemetry Stream</span>
                      </div>
                      <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <Radio className="w-2.5 h-2.5 animate-pulse" />
                        Live Sync
                      </span>
                    </div>

                    {/* Log entries */}
                    <div className="space-y-2 font-mono text-xs max-h-64 overflow-y-auto pr-1">
                      {logs.map((log) => (
                        <div
                          key={log.id}
                          className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/80 text-[10px] space-y-0.5"
                        >
                          <div className="flex items-center justify-between text-slate-500">
                            <span className="text-[9px]">[{log.time} EDT]</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold ${
                                log.level === 'warn'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : log.level === 'success'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-cyan-500/20 text-cyan-300'
                              }`}
                            >
                              {log.level}
                            </span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{log.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Hardware Safety Interlocks Active</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Zero Cloud Latency</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IESO PEAKER TELEMETRY */}
          {activeTab === 'ieso' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Ontario Grid Fuel Mix & Peaker Plant Displacement
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    GridPulse isolates your home from 4–9 PM when high-cost natural gas peakers pollute the grid.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                      Daily Clean Impact
                    </span>
                    <span className="text-xs font-bold text-white">
                      Avoided {fuelMix.householdAvoidedCo2TodayKg} kg CO₂ Today
                    </span>
                  </div>
                </div>
              </div>

              {/* 4-Card Fuel Mix Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Nuclear Baseload */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">Nuclear Baseload</span>
                    <span className="text-[10px] font-mono font-bold text-cyan-400">Bruce & Darlington</span>
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
                    <span className="text-[10px] font-mono font-bold text-blue-400">Niagara & St. Lawrence</span>
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
                    <span className="text-[10px] font-mono font-bold text-emerald-400">Renewable Capture</span>
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

              {/* Carbon Callout Banner */}
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
                  <span>IESO 5-Min Telemetry Feed</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SMART SOLAR SOAK™ */}
          {activeTab === 'solar' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Smart Solar Soak™: Zero-Waste Rooftop Absorption
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    GridPulse predicts tomorrow's solar generation and throttles overnight grid charging to leave exact headroom for rooftop solar.
                  </p>
                </div>

                {/* Weather Scenario Switcher */}
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
                  <button
                    type="button"
                    id="solar-sunny-btn"
                    onClick={() => setSolarCondition('sunny')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      solarCondition === 'sunny'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sunny</span>
                  </button>

                  <button
                    type="button"
                    id="solar-partly-btn"
                    onClick={() => setSolarCondition('partly_cloudy')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      solarCondition === 'partly_cloudy'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Partly Cloudy</span>
                  </button>

                  <button
                    type="button"
                    id="solar-overcast-btn"
                    onClick={() => setSolarCondition('overcast')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      solarCondition === 'overcast'
                        ? 'bg-slate-700 text-slate-200 border border-slate-600 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Cloud className="w-3.5 h-3.5 text-slate-300" />
                    <span>Overcast</span>
                  </button>

                  <button
                    type="button"
                    id="solar-rain-btn"
                    onClick={() => setSolarCondition('rain')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      solarCondition === 'rain'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                    <span>Rain / Storm</span>
                  </button>
                </div>
              </div>

              {/* 2-Column Solar Display */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Solar Recommendation & Headroom Limit */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                        Autonomous Solar Soak Strategy
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Active Rule
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                          {solarForecast.soakRecommendation}
                        </p>
                      </div>
                    </div>

                    {/* Battery Headroom Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Overnight 3.9¢ ULO Charge Limit</span>
                        <span className="text-emerald-400 font-bold">{solarForecast.batteryOvernightHoldPct}% SoC</span>
                      </div>
                      <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-mono font-bold text-slate-950"
                          style={{ width: `${solarForecast.batteryOvernightHoldPct}%` }}
                        >
                          {solarForecast.batteryOvernightHoldPct > 20 && `ULO ${solarForecast.batteryOvernightHoldPct}%`}
                        </div>
                        <div
                          className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-mono font-bold text-slate-950"
                          style={{ width: `${100 - solarForecast.batteryOvernightHoldPct}%` }}
                        >
                          {100 - solarForecast.batteryOvernightHoldPct > 20 && `Solar Headroom ${100 - solarForecast.batteryOvernightHoldPct}%`}
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>3.9¢ Grid Top-Up (11 PM - 7 AM)</span>
                        <span className="text-amber-400 font-medium">0¢ Free Solar Soak (Daytime)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Peak Irradiance</span>
                        <span className="font-mono text-sm font-bold text-slate-200">{solarForecast.peakIrradianceWpM2} W/m²</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Est. Daily Generation</span>
                        <span className="font-mono text-sm font-bold text-amber-400">{solarForecast.projectedGenerationKwh} kWh</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Irradiance Curve */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-amber-400" />
                          <h4 className="font-display font-bold text-sm text-white">
                            24-Hour Solar Radiation & Generation Curve
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          Sunrise {solarForecast.sunriseTime} • Solar Noon {solarForecast.solarNoonTime}
                        </span>
                      </div>

                      {/* Hourly Bar Curve */}
                      <div className="grid grid-cols-8 gap-2 items-end h-36 pt-4 pb-2 px-2 bg-slate-950/80 rounded-xl border border-slate-800/80">
                        {solarForecast.hourlyIrradiance.map((item, idx) => {
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

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                      <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed text-[11px]">
                        <strong>Zero-Clipping Guarantee:</strong> When rooftop solar exceeds household load during midday,
                        GridPulse directs excess kWh into the battery first, then throttles EV charger speed dynamically to absorb 100% locally with zero export penalty.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
