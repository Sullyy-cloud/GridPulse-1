import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Zap,
  Battery,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { FAQS } from '../data/ontarioRates';

export const FAQSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'hardware', label: 'Hardware & Setup' },
    { id: 'rates', label: 'Ontario ULO Rates' },
    { id: 'safety', label: 'Battery & 12V Safety' },
    { id: 'renters', label: 'Renters & Condos' },
  ];

  const filteredFaqs = filterCategory === 'all'
    ? FAQS
    : FAQS.filter((f) => f.category === filterCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="py-12 md:py-16 border-t border-slate-800/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
              <HelpCircle className="w-3 h-3" />
              <span>Knowledge Base & FAQs</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ontario ULO & Fleet Architecture FAQ
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
              Key details about autonomous ULO load shifting, warranty safety, and utility rate switching.
            </p>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`faq-filter-${cat.id}`}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion list */}
        <div className="space-y-2.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className={`bg-slate-900/40 rounded-xl border transition-all overflow-hidden backdrop-blur-xl ${
                  isOpen ? 'border-emerald-500/40 bg-slate-900/80' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  id={`faq-toggle-${faq.id}`}
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="font-display font-semibold text-xs sm:text-sm text-white">
                    {faq.question}
                  </span>
                  <div className={`p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-emerald-400 border-emerald-500/30' : ''}`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3.5 sm:px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
