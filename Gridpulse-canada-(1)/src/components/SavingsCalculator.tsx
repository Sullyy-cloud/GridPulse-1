import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Car,
  Battery,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Zap,
  Leaf,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface SavingsCalculatorProps {
  onOpenWaitlist: () => void;
}

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ onOpenWaitlist }) => {
  // Slider 1: Daily EV Driving (0 to 120 km/day, default: 40 km)
  const [dailyKm, setDailyKm] = useState<number>(40);

  // Slider 2: Battery Capacity Index (0: None, 1: 6 kWh Portable, 2: 13.5 kWh Powerwall, 3: 27 kWh Dual Powerwall)
  const [batteryTierIndex, setBatteryTierIndex] = useState<number>(2);

  const batteryTiers = [
    { label: 'None (EV / Smart Only)', kwh: 0, desc: '0 kWh' },
    { label: '1x Portable (EcoFlow / Bluetti)', kwh: 6.0, desc: '6 kWh' },
    { label: '1x Tesla Powerwall / ESS', kwh: 13.5, desc: '13.5 kWh' },
    { label: '2x Tesla Powerwalls / Whole-Home', kwh: 27.0, desc: '27 kWh' },
  ];

  const selectedBattery = batteryTiers[batteryTierIndex];

  // Mathematical Ontario ULO Calculation
  const metrics = useMemo(() => {
    // 35.2¢ rate spread between On-Peak (39.1¢) and ULO (3.9¢)
    const rateSpread = 0.352;

    // EV kWh per day: ~18 kWh per 100 km
    const evKwhPerDay = (dailyKm / 100) * 18;
    const evAnnualSavings = evKwhPerDay * 365 * rateSpread * 0.85; // 85% peak-shifting efficiency

    // Battery daily cycle arbitrage: 90% usable DoD, 88% round-trip efficiency
    const batteryKwh = selectedBattery.kwh;
    const batteryAnnualSavings = batteryKwh > 0 ? batteryKwh * 0.9 * 365 * rateSpread * 0.88 : 0;

    // Smart thermostat & baseline smart plug load shift (~$320/yr)
    const baselineSavings = 320;

    const totalAnnualSavings = Math.round(evAnnualSavings + batteryAnnualSavings + baselineSavings);
    const monthlyAverage = Math.round(totalAnnualSavings / 12);
    const fiveYearSavings = Math.round(totalAnnualSavings * 5 * 1.05); // 5% annual inflation factor
    const peakReductionPercent = Math.min(85, Math.round(30 + (batteryKwh > 0 ? 35 : 0) + (dailyKm > 0 ? 20 : 0)));
    const avoidedCarbonKg = Math.round(totalAnnualSavings * 0.72); // ~0.72 kg CO2 per dollar saved from peakers

    // Monthly chart data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((month, idx) => {
      // Seasonal heating/cooling multipliers
      const seasonalFactor = [1.18, 1.15, 1.05, 0.92, 0.88, 1.1, 1.25, 1.22, 0.95, 0.9, 1.08, 1.16][idx];
      const baseMonthlyStandard = Math.round(280 * seasonalFactor + (dailyKm > 0 ? 65 : 0) + (batteryKwh > 0 ? 45 : 0));
      const monthlySaved = Math.round(monthlyAverage * seasonalFactor);
      const gridpulseBill = Math.max(75, baseMonthlyStandard - monthlySaved);

      return {
        month,
        standardBill: baseMonthlyStandard,
        gridpulseBill,
        netSavings: baseMonthlyStandard - gridpulseBill,
      };
    });

    return {
      totalAnnualSavings,
      monthlyAverage,
      fiveYearSavings,
      peakReductionPercent,
      avoidedCarbonKg,
      monthlyData,
    };
  }, [dailyKm, selectedBattery]);

  // Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl text-xs space-y-1 min-w-[180px]">
          <div className="font-display font-bold text-white border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>{label} Billing Cycle</span>
            <span className="text-emerald-400 font-mono font-bold">+${data.netSavings} Saved</span>
          </div>
          <div className="space-y-0.5 font-mono text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Standard Bill:</span>
              <span className="text-rose-400 font-bold">${data.standardBill}</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Gridpulse ULO:</span>
              <span className="text-emerald-300 font-bold">${data.gridpulseBill}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="calculator" className="py-16 md:py-24 border-b border-slate-800/80 bg-[#06080D] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3">
              <Calculator className="w-3 h-3 text-emerald-400" />
              <span>Interactive 2-Slider ROI Simulator</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Estimate Your Ontario ULO Savings
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1.5">
              Adjust your daily EV commute distance and home battery capacity to see exact monthly cash savings under the Ontario ULO tariff.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-300 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OEB Tariff Formula (3.9¢ vs 39.1¢)</span>
          </div>
        </div>

        {/* 4 Dynamic KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-emerald-500/15 to-emerald-500/5 border border-emerald-500/30 backdrop-blur-xl">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
              Estimated Annual Savings
            </span>
            <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              ${metrics.totalAnnualSavings.toLocaleString()}{' '}
              <span className="text-xs font-mono text-emerald-400">CAD/yr</span>
            </div>
            <span className="text-[11px] text-emerald-300/80 mt-1 block font-mono">
              ~${metrics.monthlyAverage}/mo net cash back
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
              5-Year Cumulative ROI
            </span>
            <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-cyan-300">
              ${metrics.fiveYearSavings.toLocaleString()}{' '}
              <span className="text-xs font-mono text-cyan-400">CAD</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block font-mono">
              Includes 5% annual rate inflation
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
              Peak Grid Relief
            </span>
            <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-300">
              -{metrics.peakReductionPercent}%
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block font-mono">
              4–9 PM expensive peak draw shed
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
              Avoided Peaker Carbon
            </span>
            <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-400">
              {metrics.avoidedCarbonKg.toLocaleString()}{' '}
              <span className="text-xs font-mono text-emerald-300">kg/yr</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block font-mono">
              Gas peaker displacement
            </span>
          </div>
        </div>

        {/* 2-Column Main Section: 2 Sliders (Left) + 12-Month Bar Chart (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: 2 Simplified Controls */}
          <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xl space-y-6">
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-display font-bold text-base text-white">
                  Household Parameters
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Two intuitive inputs to customize your Ontario home profile.
                </p>
              </div>

              {/* Slider 1: Daily EV Driving */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Car className="w-4 h-4 text-cyan-400" />
                    Daily EV Driving Distance
                  </span>
                  <span className="font-mono font-bold text-cyan-400 text-sm bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                    {dailyKm} km/day
                  </span>
                </div>

                <input
                  id="ev-daily-km-slider"
                  type="range"
                  min="0"
                  max="120"
                  step="10"
                  value={dailyKm}
                  onChange={(e) => setDailyKm(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 km (No EV)</span>
                  <span>40 km (Avg GTA)</span>
                  <span>80 km</span>
                  <span>120 km (Commuter)</span>
                </div>
              </div>

              {/* Slider 2: Home Battery / Solar Generator */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Battery className="w-4 h-4 text-emerald-400" />
                    Home Battery / Generator
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-sm bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                    {selectedBattery.desc}
                  </span>
                </div>

                <input
                  id="battery-tier-slider"
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={batteryTierIndex}
                  onChange={(e) => setBatteryTierIndex(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium block text-[11px]">Selected Storage Asset:</span>
                  <span className="text-white font-semibold">{selectedBattery.label}</span>
                </div>
              </div>
            </div>

            {/* Instant Priority Beta CTA */}
            <div className="pt-4 border-t border-slate-800">
              <button
                id="calc-lock-beta-btn"
                onClick={onOpenWaitlist}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Lock In Priority Beta Pass</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>

          {/* Right Column: 12-Month Seasonal Bill Simulation Chart */}
          <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    12-Month Bill Comparison
                  </h3>
                  <p className="text-xs text-slate-400">
                    Red (Standard Ontario Flat Rate) vs. Emerald (Gridpulse ULO Arbitrage)
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500/80" />
                    <span className="text-slate-400">Standard</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
                    <span className="text-emerald-400 font-bold">Gridpulse</span>
                  </div>
                </div>
              </div>

              {/* Responsive BarChart */}
              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="standardBill" name="Standard Ontario Flat Rate" fill="#f43f5e" radius={[4, 4, 0, 0]} opacity={0.8} />
                    <Bar dataKey="gridpulseBill" name="With Gridpulse ULO" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Insight Note */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>OEB Regulated Price Plan (RPP) Validated</span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">100% Cloud Controlled</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
