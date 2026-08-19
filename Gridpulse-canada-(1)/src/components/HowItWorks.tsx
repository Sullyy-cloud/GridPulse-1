import React from 'react';
import {
  Link2,
  Cpu,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BatteryCharging,
} from 'lucide-react';

interface HowItWorksProps {
  onOpenWaitlist: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenWaitlist }) => {
  const steps = [
    {
      number: '01',
      title: 'Connect in 30 Seconds',
      description:
        'Link your electric vehicle, home battery, or smart thermostat via official manufacturer cloud logins. $0 hardware to purchase, zero electrician visits, and no permits needed.',
      badge: 'Zero Hardware Required',
      icon: Link2,
      accentColor: 'from-cyan-500/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
      tag: 'OAuth 2.0 Cloud Sync',
    },
    {
      number: '02',
      title: 'Autopilot Shifts the Load',
      description:
        'Gridpulse runs 24/7 in the background, automatically isolating your home from 4:00 PM – 9:00 PM peak rates (39.1¢/kWh) and triggering heavy charging at 11:00 PM (3.9¢/kWh).',
      badge: '100% Autonomous',
      icon: Cpu,
      accentColor: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      tag: 'OEB ULO Tariff Engine',
    },
    {
      number: '03',
      title: 'Wake Up Charged & Save',
      description:
        'Enjoy guaranteed 100% vehicle and home battery readiness every morning by 7:00 AM while cutting your overall Ontario electricity bills by up to 65% on autopilot.',
      badge: 'Guaranteed 7:00 AM Ready',
      icon: BatteryCharging,
      accentColor: 'from-teal-500/20 to-teal-500/5',
      borderColor: 'border-teal-500/30',
      iconColor: 'text-teal-400',
      tag: 'Up to $3,400/yr Saved',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 border-b border-slate-800/80 bg-[#06080D] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Frictionless 3-Step Setup</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            How Gridpulse Works in 3 Steps
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            No electricians. No wall rewiring. No proprietary boxes. Gridpulse coordinates your existing clean-tech assets through secure cloud APIs.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`relative rounded-2xl bg-gradient-to-b ${step.accentColor} p-6 sm:p-7 border ${step.borderColor} flex flex-col justify-between backdrop-blur-xl shadow-xl transition-all duration-300 hover:translate-y-[-2px]`}
              >
                <div>
                  {/* Step Top Bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shadow-inner">
                        <Icon className={`w-5 h-5 ${step.iconColor}`} />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800 text-slate-300">
                        {step.tag}
                      </span>
                    </div>

                    <span className="font-mono text-2xl font-black text-slate-700/80">
                      {step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg text-white mb-2 tracking-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Card Footer Badge */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{step.badge}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Action Prompt */}
        <div className="mt-12 text-center">
          <button
            id="how-it-works-cta-btn"
            onClick={onOpenWaitlist}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer"
          >
            <span>Check My Ontario Postal Code & Join Beta</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
