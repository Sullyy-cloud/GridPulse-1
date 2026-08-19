import React, { useState } from 'react';
import {
  Car,
  BatteryCharging,
  Sun,
  Thermometer,
  Zap,
  CheckCircle2,
  Sliders,
  Shield,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { SUPPORTED_HARDWARE_DEVICES } from '../data/ontarioRates';
import { AssetCategory, HardwareDevice } from '../types';

interface EcosystemGridProps {
  onOpenWaitlist: () => void;
}

export const EcosystemGrid: React.FC<EcosystemGridProps> = ({ onOpenWaitlist }) => {
  const [activeFilter, setActiveFilter] = useState<AssetCategory | 'all'>('all');
  const [deviceList, setDeviceList] = useState<HardwareDevice[]>(SUPPORTED_HARDWARE_DEVICES);
  const [simulatedFeedback, setSimulatedFeedback] = useState<string | null>(null);

  const categories: { id: AssetCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All 5 Asset Classes', icon: Layers },
    { id: 'ev', label: 'Electric Vehicles', icon: Car },
    { id: 'battery', label: 'Home Batteries (ESS)', icon: BatteryCharging },
    { id: 'solar_generator', label: 'Solar Generators & Renter Portable', icon: Sun },
    { id: 'thermostat', label: 'Smart Thermostats', icon: Thermometer },
    { id: 'smart_plug', label: 'Heavy Plugs & Circuits', icon: Zap },
  ];

  const filteredDevices = activeFilter === 'all'
    ? deviceList
    : deviceList.filter((d) => d.category === activeFilter);

  const handleSimulateAction = (device: HardwareDevice) => {
    let message = '';
    if (device.category === 'ev') {
      message = `⚡ Triggered Tesla Fleet API handshake. 4-9 PM Peak charge lock verified. 11 PM 3.9¢ queue armed.`;
    } else if (device.category === 'battery') {
      message = `🔋 Dispatched Powerwall local gateway command. Islanded subpanel into 100% self-powered mode.`;
    } else if (device.category === 'thermostat') {
      message = `🌡️ ecobee API triggered pre-cooling cycle to 20.5°C before 4:00 PM peak.`;
    } else if (device.category === 'solar_generator') {
      message = `☀️ EcoFlow IoT SDK commanded 1.2kW inverter passthrough to office circuits.`;
    } else {
      message = `🔌 Shelly Pro breaker shifted pool pump schedule to 11:00 PM ULO window.`;
    }

    setSimulatedFeedback(message);
    setTimeout(() => {
      setSimulatedFeedback(null);
    }, 4500);
  };

  const getCategoryIcon = (category: AssetCategory) => {
    switch (category) {
      case 'ev':
        return <Car className="w-4 h-4 text-cyan-400" />;
      case 'battery':
        return <BatteryCharging className="w-4 h-4 text-emerald-400" />;
      case 'solar_generator':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'thermostat':
        return <Thermometer className="w-4 h-4 text-rose-400" />;
      default:
        return <Zap className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <section id="ecosystem" className="py-12 md:py-16 border-t border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
              <Cpu className="w-3 h-3" />
              <span>Universal Hardware Ecosystem</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Whole-Home Clean-Tech Orchestration Fleet.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Gridpulse connects directly to existing smart energy devices via official manufacturer APIs and local gateways to deliver synchronized ULO load shifting. Zero proprietary hardware required.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto shrink-0">
            <span>Supported Brands: </span>
            <span className="font-bold text-white">Tesla, Ford, ecobee, EcoFlow, Shelly + more</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 border cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Simulation Action Feedback Toast */}
        {simulatedFeedback && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-spin" />
            <div className="flex-1 font-mono font-medium">{simulatedFeedback}</div>
          </div>
        )}

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => {
            return (
              <div
                key={device.id}
                id={`device-card-${device.id}`}
                className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700 flex flex-col justify-between group backdrop-blur-xl"
              >
                <div>
                  {/* Top bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform">
                        {getCategoryIcon(device.category)}
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                          {device.brand}
                        </span>
                        <h4 className="font-display font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                          {device.name}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 block">
                        +${device.annualSavingsEstimate}/yr
                      </span>
                    </div>
                  </div>

                  {/* Device Telemetry Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-mono">Protocol</span>
                      <span className="font-mono text-slate-300 truncate block text-[11px]">
                        {device.connectionProtocol}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-mono">Firmware</span>
                      <span className="font-mono text-slate-300 block text-[11px]">
                        {device.firmwareVersion}
                      </span>
                    </div>

                    {device.capacityKwh && (
                      <div className="col-span-2 pt-1.5 mt-0.5 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Capacity:</span>
                        <span className="font-mono font-bold text-slate-200 text-xs">{device.capacityKwh} kWh</span>
                      </div>
                    )}
                  </div>

                  {/* Active Gridpulse Action */}
                  <div className="mb-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Autonomous Mode
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {device.currentAction}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-1 mb-3">
                    {device.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    id={`test-handshake-${device.id}`}
                    onClick={() => handleSimulateAction(device)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>Test Handshake</span>
                  </button>

                  <button
                    id={`connect-hw-${device.id}`}
                    onClick={onOpenWaitlist}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all cursor-pointer"
                    title="Connect this device"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* DIY & Custom Inverter Callout */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-white">
                Have a Sol-Ark, EG4, Home Assistant, or DIY Battery Rig?
              </h4>
              <p className="text-xs text-slate-400">
                Gridpulse provides open MQTT and Home Assistant integrations for custom solar inverters and battery builders in Ontario.
              </p>
            </div>
          </div>

          <button
            id="custom-hw-btn"
            onClick={onOpenWaitlist}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 whitespace-nowrap cursor-pointer"
          >
            Connect Custom Setup
          </button>
        </div>
      </div>
    </section>
  );
};
