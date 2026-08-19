import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CompatibilityRibbon } from './components/CompatibilityRibbon';
import { HowItWorks } from './components/HowItWorks';
import { SavingsCalculator } from './components/SavingsCalculator';
import { AdvancedArchitectureTabs } from './components/AdvancedArchitectureTabs';
import { WaitlistForm } from './components/WaitlistForm';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { GreenButtonModal } from './components/GreenButtonModal';

export default function App() {
  const [selectedUtilityId, setSelectedUtilityId] = useState<string>('toronto_hydro');
  const [isGreenButtonModalOpen, setIsGreenButtonModalOpen] = useState<boolean>(false);
  const [estimatedSavings, setEstimatedSavings] = useState<number>(2840);
  const [prefilledPostalCode, setPrefilledPostalCode] = useState<string>('');
  const [prefilledEmail, setPrefilledEmail] = useState<string>('');

  const scrollToSection = (id: string) => {
    const cleanId = id.replace('#', '');
    let el = document.getElementById(cleanId);
    if (!el && (cleanId === 'waitlist' || cleanId === 'waitlist-section')) {
      el = document.getElementById('waitlist') || document.getElementById('waitlist-section');
    }
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroQuickSubmit = (data?: { postalCode?: string; email?: string }) => {
    if (data?.postalCode) setPrefilledPostalCode(data.postalCode);
    if (data?.email) setPrefilledEmail(data.email);
    scrollToSection('waitlist');
  };

  return (
    <div className="min-h-screen bg-[#06080D] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 flex flex-col font-sans overflow-x-hidden">
      {/* Top Sticky Header with Live Ontario Grid HUD & Green Button Trigger */}
      <Header
        onOpenWaitlist={() => scrollToSection('waitlist')}
        onOpenGreenButtonModal={() => setIsGreenButtonModalOpen(true)}
        onNavigate={scrollToSection}
        selectedUtilityId={selectedUtilityId}
        onSelectUtility={setSelectedUtilityId}
      />

      {/* Main Content Stream: 5-Section Progressive Disclosure */}
      <main className="flex-1">
        {/* Section 1: Simplified Hero Section (Above the fold) */}
        <Hero
          onOpenWaitlist={handleHeroQuickSubmit}
          onEstimateSavings={() => scrollToSection('calculator')}
        />

        {/* Section 2: Device & Utility Compatibility Ribbon */}
        <CompatibilityRibbon />

        {/* Section 3: "How It Works" in 3 Frictionless Steps */}
        <HowItWorks onOpenWaitlist={() => scrollToSection('waitlist')} />

        {/* Section 4: Streamlined 2-Slider Savings Calculator */}
        <SavingsCalculator onOpenWaitlist={() => scrollToSection('waitlist')} />

        {/* Section 5: Consolidated "Under the Hood" Tabbed Module */}
        <AdvancedArchitectureTabs onOpenWaitlist={() => scrollToSection('waitlist')} />

        {/* Section 6: Priority Beta Cohort Waitlist Form */}
        <WaitlistForm
          initialEstimatedSavings={estimatedSavings}
          initialPostalCode={prefilledPostalCode}
          initialEmail={prefilledEmail}
        />

        {/* Section 7: Frequently Answered Questions Accordion */}
        <FAQSection />
      </main>

      {/* Trust & Regulatory Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenWaitlist={() => scrollToSection('waitlist')}
      />

      {/* Ontario Green Button CMD OAuth 2.0 Audit Simulator Modal */}
      <GreenButtonModal
        isOpen={isGreenButtonModalOpen}
        onClose={() => setIsGreenButtonModalOpen(false)}
        selectedUtilityId={selectedUtilityId}
        onApplySavings={(savings) => {
          setEstimatedSavings(savings);
          setIsGreenButtonModalOpen(false);
          scrollToSection('waitlist');
        }}
      />
    </div>
  );
}
