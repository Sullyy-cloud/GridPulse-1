import React, { useState } from 'react';
import {
  Zap,
  Shield,
  Sliders,
  CheckCircle2,
  Lock,
  BatteryCharging,
  Radio,
  Cpu,
  Plug,
  Info,
} from 'lucide-react';
import { SMART_EVSE_CHARGERS } from '../data/ontarioRates';
import { SmartEvseDevice } from '../types';

interface EvseFallbackSelectorProps {
  onOpenWaitlist?: () => void;
}

export const EvseFallbackSelector: React.FC<EvseFallbackSelectorProps> = ({ onOpenWaitlist }) => {
  const [controlMode, setControlMode] = useState<'vehicle_api' | 'smart_evse'>('smart_evse');
  const [selectedChargerId, setSelectedChargerId] = useState<string>('tesla_wall_gen3');

  const selectedCharger = SMART_EVSE_CHARGERS.find((c) => c.id === selectedChargerId) || SMART_EVSE_CHARGERS[0];

  return (
    <section id="evse-fallback" className="py-12 border-b border-slate-800 bg-[#07090E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Plug className="w-3 h-3 text-cyan-400" />
                Zero-Vehicle Wakeup Technology
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
              Smart EVSE & Breaker-Level Hardware Fallback
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Prefer not to share vehicle telematics or have an older EV? Gridpulse communicates directly with your Level 2 wall connector to block 4–9 PM peak charging without waking the car's computer.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              id="mode-smart-evse-btn"
              onClick={() => setControlMode('smart_evse')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                controlMode === 'smart_evse'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plug className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart Wall Charger Mode</span>
            </button>

            <button
              id="mode-vehicle-api-btn"
              onClick={() => setControlMode('vehicle_api')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                controlMode === 'vehicle_api'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vehicle Fleet Telematics</span>
            </button>
          </div>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Charger Selector Grid (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
              Certified Canadian L2 Wall Connectors & Smart Breakers
            </span>

            <div className="space-y-2">
              {SMART_EVSE_CHARGERS.map((charger) => {
                const isSelected = selectedChargerId === charger.id;
                return (
                  <button
                    key={charger.id}
                    id={`select-charger-${charger.id}`}
                    onClick={() => setSelectedChargerId(charger.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-500/5'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs sm:text-sm text-white">
                          {charger.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                          {charger.ratingKw} kW (48A)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {charger.description}
                      </p>
                    </div>

                    <div className="shrink-0 ml-3 flex flex-col items-end gap-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {charger.connectionType}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Charger Protocol & Telemetry Card (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">
                        {selectedCharger.name} Protocol Profile
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        Firmware: {selectedCharger.firmware}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold uppercase">
                    {selectedCharger.status}
                  </span>
                </div>

                {/* Dispatch Mechanism Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Contactor Relay Control</span>
                    <span className="font-mono text-emerald-400 font-bold">4:00 PM – 9:00 PM Hard Open (0.0 kW)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Scheduled 3.9¢ ULO Trigger</span>
                    <span className="font-mono text-cyan-400 font-bold">11:00:01 PM Contactor Closed (48A Fast Charge)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">12V Car Sleep Protection</span>
                    <span className="font-mono text-emerald-400 font-bold">100% Car ECU Deep Sleep (Zero Drain)</span>
                  </div>
                </div>

                {/* Info Note */}
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-2.5 text-[11px] text-cyan-200">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Electrician-Free Automation:</strong> Gridpulse controls the charger through your home Wi-Fi or local IoT hub. When you plug in your vehicle at 5:30 PM after work, the charger holds voltage at zero until 11:00 PM sharp.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                id="link-evse-charger-btn"
                onClick={onOpenWaitlist}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <span>Enroll {selectedCharger.brand} in Beta Cohort</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
