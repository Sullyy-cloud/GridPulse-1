import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Building2,
  Zap,
  ShieldCheck,
  Award,
  QrCode,
  Share2,
  Car,
  BatteryCharging,
  Sun,
  Thermometer,
  Layers,
} from 'lucide-react';
import { ONTARIO_UTILITIES, lookupOntarioPostalCode } from '../data/ontarioRates';
import { WaitlistSubmission } from '../types';

interface WaitlistFormProps {
  initialEstimatedSavings?: number;
  initialPostalCode?: string;
  initialEmail?: string;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({
  initialEstimatedSavings = 2840,
  initialPostalCode = '',
  initialEmail = '',
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [postalCode, setPostalCode] = useState(initialPostalCode);
  const [utilityId, setUtilityId] = useState('toronto_hydro');

  // React to prop changes if user submits from Hero quick form
  React.useEffect(() => {
    if (initialPostalCode) setPostalCode(initialPostalCode);
    if (initialEmail) setEmail(initialEmail);
  }, [initialPostalCode, initialEmail]);
  const [selectedHardware, setSelectedHardware] = useState<string[]>([
    'Tesla Powerwall / ESS',
    'Electric Vehicle (Tesla/Ford/GM)',
    'Smart Thermostat (ecobee/Nest)',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<WaitlistSubmission | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Hardware options
  const hardwareOptions = [
    { id: 'Tesla Powerwall / ESS', label: 'Tesla Powerwall / Home ESS', icon: BatteryCharging },
    { id: 'Electric Vehicle (Tesla/Ford/GM)', label: 'Electric Vehicle (EV)', icon: Car },
    { id: 'EcoFlow / Bluetti Portable Battery', label: 'EcoFlow / Bluetti (Portable)', icon: Sun },
    { id: 'Smart Thermostat (ecobee/Nest)', label: 'Smart Thermostat (ecobee/Nest)', icon: Thermometer },
    { id: 'Smart Plugs & Breakers (Shelly/Emporia)', label: 'Smart Plugs / Heavy Circuits', icon: Zap },
    { id: 'DIY / Custom Inverter Rig', label: 'DIY Battery / Custom Inverter', icon: Layers },
  ];

  // Dynamic postal code feeder lookup
  const feederInfo = lookupOntarioPostalCode(postalCode);

  // Auto-format Ontario Postal Code (e.g., L1H 7K4)
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (val.length > 6) val = val.slice(0, 6);
    if (val.length > 3) {
      val = `${val.slice(0, 3)} ${val.slice(3)}`;
    }
    setPostalCode(val);
  };

  const toggleHardware = (item: string) => {
    if (selectedHardware.includes(item)) {
      setSelectedHardware(selectedHardware.filter((h) => h !== item));
    } else {
      setSelectedHardware([...selectedHardware, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !postalCode) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const randomQueue = Math.floor(Math.random() * 450) + 1280;
      const refCode = `VOLT-ON-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const newSubmission: WaitlistSubmission = {
        id: Date.now().toString(),
        fullName,
        email,
        postalCode: postalCode.toUpperCase(),
        feederZone: feederInfo.feederZone,
        selectedHardware,
        utilityId,
        timestamp: new Date().toISOString(),
        queueNumber: randomQueue,
        referralCode: refCode,
        estimatedAnnualSavings: initialEstimatedSavings,
      };

      setSubmittedData(newSubmission);
      setIsSubmitting(false);

      // Trigger celebration confetti
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#34D399', '#38BDF8'],
      });
    }, 1200);
  };

  const copyReferralLink = () => {
    if (!submittedData) return;
    const link = `https://gridpulse.ca/join?ref=${submittedData.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <section id="waitlist" className="py-12 md:py-16 border-t border-slate-800/60 relative scroll-mt-20">
      {/* Anchor for waitlist-section */}
      <div id="waitlist-section" className="absolute -top-20 left-0 pointer-events-none" />

      {/* Background ambient lighting */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!submittedData ? (
          <div className="bg-slate-900/40 rounded-2xl p-5 sm:p-8 border border-slate-800 shadow-2xl relative backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>Priority Ontario Onboarding Cohort</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Claim Your Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Gridpulse Beta Pass</span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
                  Onboarding Ontario homes in rolling cohorts grouped by Local Distribution Company (LDC) feeder zones. Zero credit card required.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="fullname-input" className="text-[11px] font-semibold text-slate-300 block">
                    Full Name
                  </label>
                  <input
                    id="fullname-input"
                    type="text"
                    required
                    placeholder="e.g. Sarah Tremblay"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label htmlFor="email-input" className="text-[11px] font-semibold text-slate-300 block">
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="e.g. sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Postal Code with Auto LDC Resolver */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <label htmlFor="postalcode-input" className="font-semibold text-slate-300">
                      Ontario Postal Code
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {feederInfo.isValidOntario ? feederInfo.utilityName : 'Auto-resolves Substation'}
                    </span>
                  </div>
                  <input
                    id="postalcode-input"
                    type="text"
                    required
                    maxLength={7}
                    placeholder="e.g. L1H 7K4"
                    value={postalCode}
                    onChange={handlePostalCodeChange}
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 uppercase font-mono focus:outline-none focus:border-emerald-400"
                  />
                  {postalCode.length >= 3 && (
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Substation: {feederInfo.feederZone}
                    </span>
                  )}
                </div>

                {/* Local Utility Dropdown */}
                <div className="space-y-1">
                  <label htmlFor="form-utility-select" className="text-[11px] font-semibold text-slate-300 block">
                    Electric Utility (LDC)
                  </label>
                  <select
                    id="form-utility-select"
                    value={utilityId}
                    onChange={(e) => setUtilityId(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  >
                    {ONTARIO_UTILITIES.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hardware Owned Selection */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Select Connected Devices Currently in Your Home:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {hardwareOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isChecked = selectedHardware.includes(opt.id);
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => toggleHardware(opt.id)}
                        className={`p-2.5 rounded-lg text-left border text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isChecked ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span className="truncate">{opt.label}</span>
                        </div>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  id="submit-waitlist-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Ontario Feeder Node...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Lock In Priority Cohort Pass (Free)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Regulatory Notice */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Free Beta • Zero Electrician Required • Bank-Grade 256-bit API Encryption</span>
              </div>
            </form>
          </div>
        ) : (
          /* Personalized Digital Priority Pass State */
          <div className="bg-slate-900/40 rounded-2xl p-6 sm:p-8 border border-emerald-500/50 shadow-2xl relative space-y-4 text-center backdrop-blur-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Priority Pass Confirmed • Cohort #4</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Welcome to the Gridpulse Network, {submittedData.fullName.split(' ')[0]}!
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Your home node has been queued for autonomous ULO load-shifting under{' '}
              <strong className="text-white">{submittedData.feederZone}</strong>.
            </p>

            {/* Digital Pass Card */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/40 text-left shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                    GRIDPULSE CANADA PASS
                  </span>
                  <span className="font-display font-bold text-white text-sm">
                    {submittedData.fullName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 uppercase block font-mono">Queue Position</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-base">
                    #{submittedData.queueNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block">Postal Feeder</span>
                  <span className="text-slate-200 font-bold text-xs">{submittedData.postalCode}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block">Est. Annual Yield</span>
                  <span className="text-emerald-400 font-bold text-xs">+${submittedData.estimatedAnnualSavings}/yr</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                <span className="block text-slate-500 text-[9px] uppercase font-mono mb-1">
                  Connected Hardware Assets ({submittedData.selectedHardware.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {submittedData.selectedHardware.map((hw, idx) => (
                    <span key={idx} className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded text-[9px] border border-slate-800">
                      {hw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Referral Sharing Strip */}
            <div className="max-w-md mx-auto space-y-2 pt-1">
              <div className="text-xs text-slate-400">
                Move up 50 spots in line for every Ontario neighbor you invite:
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                <input
                  id="referral-link-input"
                  readOnly
                  value={`https://gridpulse.ca/join?ref=${submittedData.referralCode}`}
                  className="bg-transparent text-xs text-slate-300 px-2 font-mono flex-1 outline-none truncate"
                />
                <button
                  id="copy-ref-link-btn"
                  onClick={copyReferralLink}
                  className="px-2.5 py-1 rounded-md text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
