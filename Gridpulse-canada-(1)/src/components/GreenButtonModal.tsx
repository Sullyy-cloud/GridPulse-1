import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Zap,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { ONTARIO_UTILITIES, generateGreenButtonAudit } from '../data/ontarioRates';
import { GreenButtonAuditResult } from '../types';

interface GreenButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySavings?: (savings: number) => void;
  onOpenWaitlist?: () => void;
  selectedUtilityId?: string;
}

type CmdStep = 'select_utility' | 'authorizing' | 'auditing' | 'results';

export const GreenButtonModal: React.FC<GreenButtonModalProps> = ({
  isOpen,
  onClose,
  onApplySavings,
  onOpenWaitlist,
  selectedUtilityId = 'toronto_hydro',
}) => {
  const [step, setStep] = useState<CmdStep>('select_utility');
  const [activeUtility, setActiveUtility] = useState<string>(selectedUtilityId);
  const [auditResult, setAuditResult] = useState<GreenButtonAuditResult | null>(null);

  if (!isOpen) return null;

  const handleStartAuth = () => {
    setStep('authorizing');
    setTimeout(() => {
      setStep('auditing');
      setTimeout(() => {
        const audit = generateGreenButtonAudit(activeUtility);
        setAuditResult(audit);
        setStep('results');
      }, 1500);
    }, 1200);
  };

  const handleReset = () => {
    setStep('select_utility');
    setAuditResult(null);
  };

  const utilityObj = ONTARIO_UTILITIES.find((u) => u.id === activeUtility) || ONTARIO_UTILITIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0A0D15] border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative text-slate-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  Ontario Green Button™ Smart Meter Sync
                </h3>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold uppercase">
                  CMD v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official Ontario Energy Board (OEB) standard interval telemetry audit
              </p>
            </div>
          </div>

          <button
            id="close-green-button-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {/* STEP 1: Select Utility & Authorize CMD */}
          {step === 'select_utility' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Select Your Ontario Local Distribution Company (LDC)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ONTARIO_UTILITIES.map((util) => (
                    <button
                      key={util.id}
                      type="button"
                      onClick={() => setActiveUtility(util.id)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        activeUtility === util.id
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{util.name}</span>
                      {activeUtility === util.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Scope Explainer */}
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Authorized Green Button "Connect My Data" Scopes:</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-400">
                  <li className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>15-Minute Interval Smart Meter Reads</span>
                  </li>
                  <li className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Historical 12-Month Bill & TOU Tier Data</span>
                  </li>
                  <li className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Peak 4-9 PM Surge Hour Profiling</span>
                  </li>
                  <li className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Zero Credit Card / Read-Only Telemetry</span>
                  </li>
                </ul>
              </div>

              <button
                id="cmd-start-auth-btn"
                type="button"
                onClick={handleStartAuth}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Authorize & Sync {utilityObj.name} Data</span>
              </button>
            </div>
          )}

          {/* STEP 2: Authorizing & Token Exchange */}
          {step === 'authorizing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-white">
                  Establishing OAuth 2.0 Handshake with {utilityObj.name}
                </h4>
                <p className="text-xs text-slate-400">
                  Exchanging secure OEB cryptographic tokens via Green Button Alliance gateway...
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Auditing 35,040 intervals */}
          {step === 'auditing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-white">
                  Parsing 35,040 Historical 15-Min Energy Intervals
                </h4>
                <p className="text-xs text-slate-400">
                  Isolating 4–9 PM on-peak kWh surges and simulating autonomous 3.9¢ ULO load-shifting...
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Full Audit Results */}
          {step === 'results' && auditResult && (
            <div className="space-y-5">
              {/* Green Header Banner */}
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-200">
                    Smart Meter Telemetry Verified: {auditResult.utilityName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {auditResult.accountNumberMasked}
                </span>
              </div>

              {/* Key Metric Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">
                    Historical Annual Bill
                  </span>
                  <span className="font-mono text-xl font-bold text-slate-200">
                    ${auditResult.historicalAnnualCost}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {auditResult.historicalAnnualKwh.toLocaleString()} kWh @ Std TOU
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-emerald-400 block">
                    Gridpulse ULO Projected
                  </span>
                  <span className="font-mono text-xl font-bold text-emerald-400">
                    ${auditResult.projectedUloAnnualCost}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 block">
                    3.9¢ Arbitrage Optimization
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/80 to-teal-950/40 border border-emerald-500/50 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-emerald-300 block font-bold">
                    Net Annual Savings
                  </span>
                  <span className="font-mono text-2xl font-extrabold text-white">
                    +${auditResult.projectedAnnualSavings}
                  </span>
                  <span className="text-[10px] text-emerald-300 block font-semibold">
                    64.6% Bill Reduction
                  </span>
                </div>
              </div>

              {/* Peak Waste Detected Box */}
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Peak Hour Waste Detected (4:00 PM – 9:00 PM Weekdays)</span>
                  </div>
                  <span className="font-mono text-xs text-rose-300 font-bold">
                    ${auditResult.peakCostBurned}/yr Waste
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Your smart meter burned <strong>{auditResult.peakKwhBurned.toLocaleString()} kWh</strong> directly inside Ontario's highest 39.1¢/kWh peak pricing bracket.
                </p>

                {/* Waste breakdown items */}
                <div className="space-y-1.5 pt-1">
                  {auditResult.topWasteSources.map((source, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] flex items-center justify-between">
                      <span className="text-slate-300">{source.name}</span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-400 text-[10px]">{source.kwh} kWh</span>
                        <span className="text-rose-400 font-bold">${source.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  id="apply-audit-savings-btn"
                  onClick={() => {
                    if (onApplySavings) onApplySavings(auditResult.projectedAnnualSavings);
                    onClose();
                  }}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply Audit to Calculator</span>
                </button>

                <button
                  id="enroll-audited-node-btn"
                  onClick={() => {
                    onClose();
                    if (onOpenWaitlist) onOpenWaitlist();
                  }}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Lock in ${auditResult.projectedAnnualSavings}/yr Beta Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
