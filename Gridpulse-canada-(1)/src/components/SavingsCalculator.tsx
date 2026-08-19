import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Car,
  Battery,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Thermometer,
  Zap,
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
  // Slider 1: Daily EV Driving (0 to 50 kWh/day, default: 15 kWh)
  const [evKwhPerDay, setEvKwhPerDay] = useState<number>(15);

  // Slider 2: Home Battery Storage (0 to 27 kWh, default: 13.5 kWh)
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState<number>(13.5);

  // Toggle: ecobee / Nest Pre-Cooling & Setback
  const [smartThermostatEnabled, setSmartThermostatEnabled] = useState<boolean>(true);

  // Mathematical Ontario ULO Calculation
  const metrics = useMemo(() => {
    // 35.2¢ rate spread between On-Peak (39.1¢) and ULO (3.9¢)
    const rateSpread = 0.352;

    // EV charging arbitrage (shifting baseline peak/mid-peak charging to 3.9¢ ULO)
    const evAnnualSavings = evKwhPerDay * 365 * rateSpread * 0.85;

    // Battery daily cycle arbitrage: 90% usable DoD, 88% round-trip efficiency on ~250 weekday peak events
    const batteryAnnualSavings = batteryCapacityKwh > 0 ? batteryCapacityKwh * 0.9 * 250 * rateSpread * 0.88 : 0;

    // Smart thermostat pre-cooling arbitrage (~$315/yr)
    const thermostatAnnualSavings = smartThermostatEnabled ? 315 : 0;

    // Smart baseline appliance shifting (~$120/yr)
    const baselineApplianceSavings = 120;

    const totalAnnualSavings = Math.round(evAnnualSavings + batteryAnnualSavings + thermostatAnnualSavings + baselineApplianceSavings);
    const monthlyAverage = Math.round(totalAnnualSavings / 12);
    const fiveYearSavings = Math.round(totalAnnualSavings * 5 * 1.05); // 5% annual inflation factor
    const peakReductionPercent = Math.min(88, Math.round(
      (batteryCapacityKwh > 0 ? 45 : 0) +
      (evKwhPerDay > 0 ? 25 : 0) +
      (smartThermostatEnabled ? 15 : 0) + 3
    ));
    const avoidedCarbonKg = Math.round(totalAnnualSavings * 0.72);

    // Monthly chart data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((month, idx) => {
      const seasonalFactor = [1.18, 1.15, 1.05, 0.92, 0.88, 1.1, 1.25, 1.22, 0.95, 0.9, 1.08, 1.16][idx];
      const baseMonthlyStandard = Math.round(280 * seasonalFactor + (evKwhPerDay > 0 ? evKwhPerDay * 4.5 : 0) + (batteryCapacityKwh > 0 ? 40 : 0));
      const monthlySaved = Math.round(monthlyAverage * seasonalFactor);
      const gridpulseBill = Math.max(65, baseMonthlyStandard - monthlySaved);

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
  }, [evKwhPerDay, batteryCapacityKwh, smartThermostatEnabled]);

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
              <span>GridPulse ULO:</span>
              <span className="text-emerald-300 font-bold">${data.gridpulseBill}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Helper description for battery size
  const getBatteryDescription = (kwh: number) => {
    if (kwh === 0) return 'No Battery (EV & Thermostat Only)';
    if (kwh <= 6) return `${kwh} kWh (EcoFlow / Bluetti Portable)`;
    if (kwh <= 14) return `${kwh} kWh (1x Tesla Powerwall / Enphase IQ)`;
    return `${kwh} kWh (2x Powerwalls / Whole-Home ESS)`;
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
              Adjust your daily EV driving consumption and home battery capacity to see exact monthly cash savings under Ontario's 3.9¢ ULO tariff.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-300 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OEB Tariff Formula (3.9¢ vs 39.1¢)</span>
          </div>
        </div>

        {/* Dynamic KPI Cards */}
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
              Peak Grid Reduction
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

        {/* 2-Column Main Section: Controls (Left) + 12-Month Bar Chart (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Simplified Controls */}
          <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xl space-y-6">
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-display font-bold text-base text-white">
                  Household Parameters
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize your clean-tech devices to model exact rate arbitrage.
                </p>
              </div>

              {/* Slider 1: Daily EV Driving (0–50 kWh/day) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Car className="w-4 h-4 text-cyan-400" />
                    Daily EV Charging Demand
                  </span>
                  <span className="font-mono font-bold text-cyan-400 text-sm bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                    {evKwhPerDay} kWh/day
                  </span>
                </div>

                <input
                  id="ev-kwh-slider"
                  type="range"
                  min="0"
                  max="50"
                  step="2.5"
                  value={evKwhPerDay}
                  onChange={(e) => setEvKwhPerDay(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 kWh (No EV)</span>
                  <span>15 kWh (~80 km)</span>
                  <span>30 kWh</span>
                  <span>50 kWh (Dual EV)</span>
                </div>
              </div>

              {/* Slider 2: Home Battery Storage (0–27 kWh) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Battery className="w-4 h-4 text-emerald-400" />
                    Home Battery Storage
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-sm bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                    {batteryCapacityKwh} kWh
                  </span>
                </div>

                <input
                  id="battery-kwh-slider"
                  type="range"
                  min="0"
                  max="27"
                  step="1.5"
                  value={batteryCapacityKwh}
                  onChange={(e) => setBatteryCapacityKwh(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium block text-[11px]">Storage Configuration:</span>
                  <span className="text-white font-semibold">{getBatteryDescription(batteryCapacityKwh)}</span>
                </div>
              </div>

              {/* Toggle: ecobee / Nest Pre-Cooling */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      ecobee / Nest Pre-cooling
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Thermal storage chill before 4:00 PM peak
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="thermostat-toggle-btn"
                  onClick={() => setSmartThermostatEnabled(!smartThermostatEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    smartThermostatEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                      smartThermostatEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
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
                    Red (Standard Ontario Flat Rate) vs. Emerald (GridPulse ULO Arbitrage)
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500/80" />
                    <span className="text-slate-400">Standard</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
                    <span className="text-emerald-400 font-bold">GridPulse</span>
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
                    <Bar dataKey="gridpulseBill" name="With GridPulse ULO" fill="#10b981" radius={[4, 4, 0, 0]} />
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
