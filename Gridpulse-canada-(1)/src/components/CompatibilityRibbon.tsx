import React from 'react';
import {
  Car,
  Battery,
  Thermometer,
  Zap,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const CompatibilityRibbon: React.FC = () => {
  const partners = [
    { name: 'Tesla', category: 'EV & Powerwall' },
    { name: 'Ford', category: 'Mach-E & Lightning' },
    { name: 'ecobee', category: 'Smart Thermostats' },
    { name: 'EcoFlow', category: 'Delta Pro & Ultra' },
    { name: 'Nest', category: 'Google Learning' },
    { name: 'Enphase', category: 'IQ Battery & Solar' },
    { name: 'Toronto Hydro', category: 'Ontario LDC' },
    { name: 'Hydro One', category: 'Ontario LDC' },
    { name: 'Alectra', category: 'Ontario LDC' },
  ];

  return (
    <section className="border-y border-slate-800/80 bg-[#06080D]/90 backdrop-blur-xl py-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Label */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Compatible With:
            </span>
          </div>

          {/* Logo / Badge Strip */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 text-xs">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 group cursor-default"
              >
                <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {partner.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono hidden lg:inline">
                  •
                </span>
              </div>
            ))}
          </div>

          {/* OEB / Green Button Compliance Badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono text-emerald-400/90 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>OEB Sandbox & Green Button CMD</span>
          </div>
        </div>
      </div>
    </section>
  );
};
