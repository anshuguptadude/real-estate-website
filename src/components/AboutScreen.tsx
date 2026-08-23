import React from 'react';
import { Landmark, ShieldCheck, Users, Compass, CheckCircle2, FileCheck, Scale, Phone } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  const trustPillars = [
    {
      icon: FileCheck,
      title: '100% Clear Title Focus',
      description: 'Thorough verification of property documentation, ownership chains, and legal status across ADA, RERA, and registrar records before presentation.'
    },
    {
      icon: Users,
      title: 'Direct Founder Access',
      description: 'Personalized advisory directly with Shrey and Abhishek. Work with dedicated decision-makers without dealing with commission-driven third-party middlemen.'
    },
    {
      icon: Scale,
      title: 'Transparent Valuation',
      description: 'Fair market pricing backed by real corridor analytics and honest consultation, safeguarding interests for both discerning buyers and property owners.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#0F382C]/10 text-[#0F382C] text-xs font-bold uppercase tracking-wider mb-3">
            <Landmark className="w-3.5 h-3.5 text-[#0F382C]" />
            <span>LUXURY REAL ESTATE ADVISORY • AGRA</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#0F382C] tracking-tight">
            Modern Real Estate Built on Discretion & Absolute Trust
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed font-medium">
            Founded by Shrey Gupta and Abhishek Singh Jadon, Royal Agra Estate was built to bring institutional-grade transparency, clear-title verification, and seamless property acquisitions to Agra.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-md grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#C5A869] font-bold">Our Philosophy</span>
            <h2 className="text-2xl font-serif-luxury font-bold text-[#0F382C]">
              A Modern, Advisory-First Approach to Agra Real Estate
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Traditional real estate in Agra is often burdened by fragmented titles, hidden intermediaries, and opaque pricing. Royal Agra Estate was founded with a singular purpose: to replace uncertainty with modern, tech-enabled advisory and institutional rigor.
            </p>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Whether you are acquiring a signature villa along Fatehabad Road, a prime estate in Dayalbagh, or high-growth commercial land near the Agra Metro and Expressway corridors, we provide verified insights and end-to-end legal diligence with absolute client confidentiality.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"
              alt="Agra Heritage and Prime Corridors"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B22]/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-semibold text-[#E4D5B7] block">Agra Prime Residential & Commercial Corridors</span>
              <p className="text-[11px] text-gray-300">Curating verified estates with bespoke client discretion</p>
            </div>
          </div>
        </div>

        {/* Trust Pillars */}
        <div>
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-[#C5A869] font-bold">Core Foundations</span>
            <h3 className="text-2xl font-serif-luxury font-bold text-[#0F382C] mt-1">
              The Royal Agra Estate Trust Standard
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200/90 shadow-xs hover:border-[#C5A869]/50 hover:shadow-md transition-all flex flex-col"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#0F382C]/5 border border-[#0F382C]/10 flex items-center justify-center mb-4 text-[#0F382C]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-serif-luxury font-bold text-[#0F382C] mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leadership Team */}
        <div>
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-[#C5A869] font-bold">Leadership</span>
            <h3 className="text-2xl font-serif-luxury font-bold text-[#0F382C] mt-1">
              Founding Partners
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1: Shrey Gupta */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center flex flex-col items-center hover:border-[#C5A869]/60 transition-all">
              <div className="relative mb-5 group">
                <div className="w-28 h-28 rounded-full bg-[#0F382C]/5 border-2 border-[#C5A869] flex flex-col items-center justify-center text-[#0F382C] overflow-hidden shadow-inner">
                  <Users className="w-10 h-10 text-[#0F382C]/40 mb-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A869]">Photo</span>
                </div>
              </div>
              <h4 className="text-xl font-serif-luxury font-bold text-[#0F382C]">Shrey Gupta</h4>
              <span className="text-xs font-bold text-[#C5A869] uppercase tracking-wider block mt-1 mb-3">Managing Partner & Co-Founder</span>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm mb-4">
                Leading strategic client relations, luxury residential acquisitions, and high-value property portfolios across Agra's prime corridors.
              </p>
              <div className="mt-auto pt-4 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-xs font-semibold text-[#0F382C]">
                <span>Direct:</span>
                <a href="tel:+919149079913" className="text-[#0F382C] hover:text-[#C5A869] underline">
                  +91 91490 79913
                </a>
              </div>
            </div>

            {/* Card 2: Abhishek Singh Jadon */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center flex flex-col items-center hover:border-[#C5A869]/60 transition-all">
              <div className="relative mb-5 group">
                <div className="w-28 h-28 rounded-full bg-[#0F382C]/5 border-2 border-[#C5A869] flex flex-col items-center justify-center text-[#0F382C] overflow-hidden shadow-inner">
                  <Users className="w-10 h-10 text-[#0F382C]/40 mb-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A869]">Photo</span>
                </div>
              </div>
              <h4 className="text-xl font-serif-luxury font-bold text-[#0F382C]">Abhishek Singh Jadon</h4>
              <span className="text-xs font-bold text-[#C5A869] uppercase tracking-wider block mt-1 mb-3">Managing Partner & Co-Founder</span>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm mb-4">
                Overseeing commercial real estate developments, clear-title legal verifications, and strategic property investments in Agra.
              </p>
              <div className="mt-auto pt-4 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-xs font-semibold text-[#0F382C]">
                <span>Direct:</span>
                <a href="tel:+919557138449" className="text-[#0F382C] hover:text-[#C5A869] underline">
                  +91 95571 38449
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

