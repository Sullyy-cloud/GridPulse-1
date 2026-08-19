import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Zap,
  Sun,
  Snowflake,
  Flame,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { lookupOntarioPostalCode } from '../data/ontarioRates';

interface HeroProps {
  onOpenWaitlist: (prefill?: { postalCode?: string; email?: string }) => void;
  onEstimateSavings: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenWaitlist, onEstimateSavings }) => {
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [seasonMode, setSeasonMode] = useState<'summer' | 'winter'>('summer');

  // Dynamic postal code lookup
  const feederInfo = lookupOntarioPostalCode(postalCode);

  // Auto-format Ontario Postal Code (e.g. L1H 7K4)
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (val.length > 6) val = val.slice(0, 6);
    if (val.length > 3) {
      val = `${val.slice(0, 3)} ${val.slice(3)}`;
    }
    setPostalCode(val);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenWaitlist({ postalCode, email });
  };

  // Seasonal numbers
  const isSummer = seasonMode === 'summer';
  const standardBill = isSummer ? 348 : 384;
  const gridpulseBill = isSummer ? 112 : 128;
  const monthlySavings = standardBill - gridpulseBill; // $236 or $256
  const annualSavings = monthlySavings * 12; // $2,832 or $3,072

  return (
    <section id="hero" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden bg-[#06080D]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[300px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Core Value Prop & Inline Quick Waitlist Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Small Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
              <span>ONTARIO ULO ARBITRAGE ENGINE • 3.9¢ VS 39.1¢</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-white leading-[1.12] tracking-tight">
              Cut Your Ontario Hydro Bill by up to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                $3,400/Year.
              </span>{' '}
              On Autopilot.
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-2xl">
              The free whole-home software that shifts your EV charging, home battery, and thermostat away from expensive 39.1¢ peak hours to the 3.9¢ overnight rate. $0 hardware. Zero electrician visits.
            </p>

            {/* Inline Quick Waitlist Form */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-3.5 max-w-xl">
              <form onSubmit={handleQuickSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Postal Code Input */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-300">
                      <label htmlFor="hero-postal-code">Ontario Postal Code</label>
                      {feederInfo.isValidOntario && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          {feederInfo.utilityName.split(' ')[0]} Feeder
                        </span>
                      )}
                    </div>
                    <input
                      id="hero-postal-code"
                      type="text"
                      required
                      maxLength={7}
                      placeholder="e.g. L1H 7K4"
                      value={postalCode}
                      onChange={handlePostalCodeChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white uppercase font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label htmlFor="hero-email" className="text-[11px] font-semibold text-slate-300 block">
                      Email Address
                    </label>
                    <input
                      id="hero-email"
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>
                </div>

                {/* High Contrast Emerald CTA Button */}
                <button
                  id="hero-check-savings-btn"
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.55)] flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Check My Savings & Join Beta</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </form>

              {/* Micro-Trust Note */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free • No Credit Card • Bank-Grade Encryption</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek "Before vs. After Monthly Hydro Bill" Glass Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-slate-900/60 border border-slate-800/90 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-6 overflow-hidden">
              {/* Subtle top ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header with Animated Season Switcher */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                    HYDRO BILL IMPACT
                  </span>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white">
                    Before vs. After Gridpulse
                  </h2>
                </div>

                {/* Summer / Winter Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <button
                    id="season-summer-btn"
                    onClick={() => setSeasonMode('summer')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      isSummer
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>Summer AC</span>
                  </button>
                  <button
                    id="season-winter-btn"
                    onClick={() => setSeasonMode('winter')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      !isSummer
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Snowflake className="w-3 h-3 text-cyan-400" />
                    <span>Winter Heat</span>
                  </button>
                </div>
              </div>

              {/* Comparison Tiles */}
              <div className="space-y-3">
                {/* Standard Ontario Flat Bill */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Standard Ontario Flat Bill</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                      Unmanaged Peak Draw
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-300 font-mono">
                      ${standardBill}
                      <span className="text-xs text-slate-500 font-normal">/mo</span>
                    </span>
                    <span className="text-[11px] font-mono text-rose-400">
                      39.1¢ Peak Exposure
                    </span>
                  </div>
                </div>

                {/* With Gridpulse ULO */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1 relative overflow-hidden shadow-lg shadow-emerald-950/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      With Gridpulse ULO
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      Shifted to 3.9¢ ULO
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                      ${gridpulseBill}
                      <span className="text-xs text-emerald-300/80 font-normal">/mo</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      -68% Hydro Cost
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Monthly Savings Pill & Annual Summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                    Net Monthly Arbitrage
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                    +${monthlySavings}
                    <span className="text-xs text-emerald-400 font-normal">/mo</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                    Est. Annual Savings
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-display">
                    +${annualSavings.toLocaleString()}
                    <span className="text-xs text-emerald-300 font-mono"> CAD</span>
                  </div>
                </div>
              </div>

              {/* Tariff Rate Spread Micro-Bar */}
              <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Overnight: <strong className="text-slate-200">3.9¢/kWh</strong>
                </span>
                <span className="text-slate-600">vs</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  On-Peak: <strong className="text-slate-200">39.1¢/kWh</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
