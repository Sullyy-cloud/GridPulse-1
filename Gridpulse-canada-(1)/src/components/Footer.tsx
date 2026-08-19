import React from 'react';
import {
  Zap,
  ShieldCheck,
  Building2,
  Lock,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { ONTARIO_UTILITIES } from '../data/ontarioRates';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenWaitlist: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenWaitlist }) => {
  return (
    <footer className="border-t border-slate-800 bg-[#05070B] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <span className="font-display font-bold text-base text-white">
                Gridpulse<span className="text-emerald-400">.ca</span>
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Ontario ULO OS
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Gridpulse Canada is the autonomous clean-tech energy operating system designed for Ontario homeowners and renters to eliminate peak electricity bills through 3.9¢ Ultra-Low Overnight (ULO) arbitrage.
            </p>

            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OEB Innovation Sandbox Pilot Protocol</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-white uppercase text-[11px] tracking-wider">
              Architecture
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('arbitrage')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  The 10.02x Rate Spread
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ecosystem')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Whole-Home Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('simulator')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Behind-The-Meter HUD
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  12-Month ROI Model
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('controls')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Hardware Guardrails
                </button>
              </li>
            </ul>
          </div>

          {/* Supported LDCs */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-white uppercase text-[11px] tracking-wider">
              Ontario LDCs
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>Toronto Hydro</li>
              <li>Hydro One Networks</li>
              <li>Alectra Utilities</li>
              <li>Hydro Ottawa</li>
              <li>Oakville & Burlington Hydro</li>
              <li>London & Elexicon Energy</li>
              <li>Enova Power Corp</li>
            </ul>
          </div>

          {/* Security & Access */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-white uppercase text-[11px] tracking-wider">
              Join Cohort
            </h4>
            <p className="text-slate-400 text-xs">
              Rollouts active across GTA, Ottawa, Halton, Waterloo, and London feeders.
            </p>
            <button
              id="footer-waitlist-btn"
              onClick={onOpenWaitlist}
              className="w-full py-2 px-3 rounded-lg font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all text-xs cursor-pointer"
            >
              Get Beta Access
            </button>
          </div>
        </div>

        {/* Regulatory & Compliance Disclaimers */}
        <div className="pt-6 border-t border-slate-800/80 space-y-3 text-[10px] text-slate-300 leading-normal">
          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ontario Regulatory & Pilot Framework (OEB Compliance Notice)</span>
            </div>
            <p>
              Gridpulse Canada is an independent software application and clean-tech demand response aggregator operating under the framework of the Ontario Energy Board (OEB) Innovation Sandbox guidelines and Section 57.1 of the Ontario Energy Board Act. Gridpulse communicates with customer-owned behind-the-meter (BTM) equipment via manufacturer authorized telemetry protocols (OAuth 2.0 / REST / WebSockets).
            </p>
            <p>
              All trademarks including Tesla®, Powerwall®, Ford®, FordPass®, Enphase®, EcoFlow®, Bluetti®, ecobee®, Google Nest®, and Shelly® are the properties of their respective trademark holders. Mention does not imply endorsement, affiliation, or direct sponsorship. Electricity rates referenced are published by the Ontario Energy Board (OEB) under the Regulated Price Plan (RPP) Ultra-Low Overnight (ULO) rate structure.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
            <div>
              © {new Date().getFullYear()} Gridpulse Canada Technologies Inc. Proudly engineered in Toronto, ON.
            </div>
            <div className="flex items-center gap-3">
              <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer">OEB Sandbox Notice</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
