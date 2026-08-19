import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Shield,
  AlertTriangle,
  Clock,
  BatteryCharging,
  Power,
  RefreshCw,
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
  Terminal,
  Activity,
  Zap,
} from 'lucide-react';
import { GuardrailSettings } from '../types';

interface HardwareDashboardProps {
  onOpenWaitlist: () => void;
}

export const HardwareDashboard: React.FC<HardwareDashboardProps> = ({ onOpenWaitlist }) => {
  const [settings, setSettings] = useState<GuardrailSettings>({
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
    { id: '4', time: '14:00:00', level: 'success', message: 'Auxiliary 12V Sleep-Guard: Vehicle entered deep sleep state. Passive token cache active.' },
  ]);

  const [overrideNotice, setOverrideNotice] = useState<string | null>(null);

  const toggleEmergencyOverride = () => {
    const newState = !settings.emergencyOverride;
    setSettings((prev) => ({
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
      setOverrideNotice('Gridpulse Arbitrage Autopilot Re-engaged.');
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

  return (
    <section id="controls" className="py-12 md:py-16 border-t border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
              <Shield className="w-3 h-3" />
              <span>Hardware Guardrails & Safety Controls</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ironclad Hardware Protection. Zero Guesswork.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              You retain total control. Our intelligent dispatch engine enforces hard reserve floors, sleep telemetry protection, and instant emergency overrides.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-mono text-[11px]">Dispatch Relay: <strong className="text-emerald-400">100% Operational</strong></span>
          </div>
        </div>

        {/* Override Notification Banner */}
        {overrideNotice && (
          <div className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-xl ${settings.emergencyOverride ? 'bg-rose-950/90 border border-rose-500 text-rose-200' : 'bg-emerald-950/90 border border-emerald-500 text-emerald-200'}`}>
            <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
            <span>{overrideNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left Column: Interactive Safety Controls */}
          <div className="lg:col-span-7 space-y-4">
            {/* Master Autopilot Card */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-4 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${settings.autopilotEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Power className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">
                      Master Arbitrage Autopilot
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Autonomous whole-home load-shifting across all connected devices
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <span className={`text-[11px] font-mono font-bold ${settings.autopilotEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {settings.autopilotEnabled ? 'ACTIVE' : 'PAUSED'}
                  </span>
                  <button
                    id="master-autopilot-btn"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        autopilotEnabled: !prev.autopilotEnabled,
                        emergencyOverride: false,
                      }))
                    }
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                      settings.autopilotEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                        settings.autopilotEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Instant Emergency Override Button */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Emergency Instant Override</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Need immediate unthrottled peak charge? Tap to bypass all automated blocks.
                  </p>
                </div>

                <button
                  id="emergency-override-btn"
                  onClick={toggleEmergencyOverride}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    settings.emergencyOverride
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {settings.emergencyOverride ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{settings.emergencyOverride ? 'Override Active (Lock)' : 'Instant 1-Click Bypass'}</span>
                </button>
              </div>

              {/* SoC Floor Slider */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    Battery Emergency Reserve Floor (SoC)
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    {settings.socFloorPct}% Reserve
                  </span>
                </div>
                <input
                  id="soc-floor-slider"
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={settings.socFloorPct}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      socFloorPct: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>20% (Aggressive)</span>
                  <span>50% (Recommended)</span>
                  <span>80% (High Blackout Reserve)</span>
                </div>
              </div>

              {/* Morning Departure Guarantee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <label htmlFor="departure-time-input" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Departure Ready Guarantee
                  </label>
                  <input
                    id="departure-time-input"
                    type="time"
                    value={settings.morningDepartureTime}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        morningDepartureTime: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[9px] text-slate-500 block">
                    EV 100% full by {settings.morningDepartureTime} AM using 3.9¢ ULO power
                  </span>
                </div>

                {/* 12V Sleep Protection Toggle */}
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      12V Sleep-Guard
                    </span>
                    <button
                      id="sleep-guard-toggle"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          sleepProtection12v: !prev.sleepProtection12v,
                        }))
                      }
                      className={`w-9 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                        settings.sleepProtection12v ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                          settings.sleepProtection12v ? 'translate-x-4.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 block">
                    Prevents vehicle vampire battery drain via passive webhook triggers
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Event Stream & Dispatch Terminal */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between backdrop-blur-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Autonomous Dispatch Telemetry</span>
                </div>
                <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  Live Sync
                </span>
              </div>

              {/* Log items */}
              <div className="space-y-2 font-mono text-xs max-h-64 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded bg-slate-950/80 border border-slate-800/80 text-[10px] space-y-0.5"
                  >
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-[9px]">[{log.time} EDT]</span>
                      <span
                        className={`px-1 rounded text-[8px] uppercase font-bold ${
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
                    <p className="text-slate-300 leading-normal">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom hardware summary */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300 text-[11px] font-medium">Hardware Safety Interlocks Active</span>
                </div>
                <button
                  id="dash-waitlist-btn"
                  onClick={onOpenWaitlist}
                  className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  Join Beta →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
