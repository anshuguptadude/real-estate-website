import React from 'react';
import { ActiveScreen } from '../types';
import { Landmark, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (screen: ActiveScreen) => void;
  onOpenPostProperty?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const navLinks: { label: string; screen: ActiveScreen }[] = [
    { label: 'Buy', screen: 'properties' },
    { label: 'Sell/Rent', screen: 'sell-rent' },
    { label: 'Projects', screen: 'projects' },
    { label: 'About', screen: 'about' },
    { label: 'Contact', screen: 'contact' }
  ];

  return (
    <footer className="bg-[#0B2B22] text-white border-t border-[#164E3D] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-8 border-b border-[#164E3D]/70 text-center md:text-left">
          
          {/* Brand Identity & Location */}
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E4D5B7] flex items-center justify-center text-[#0F382C] shadow-sm">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-xl font-brand-title font-bold text-white tracking-wide">
                Royal Agra Estate
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Curated luxury residences, heritage estates, and prime developments across Agra. Managed by Shrey Gupta & Abhishek Singh Jadon.
            </p>
          </div>

          {/* Essential Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-gray-300">
            {navLinks.map((link) => (
              <a
                key={link.screen}
                href={`?screen=${link.screen}`}
                id={`footer-link-${link.screen}`}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate(link.screen);
                  }
                }}
                className="hover:text-white transition-colors hover:underline underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Core Contact Info with clean dual lines */}
          <div className="text-xs text-gray-300 space-y-1.5 flex flex-col items-center md:items-end">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C5A869]" />
              <a href="tel:+919149079913" className="hover:text-white transition-colors">
                Shrey Gupta: +91 9149079913
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C5A869]" />
              <a href="tel:+919557138449" className="hover:text-white transition-colors">
                Abhishek Singh Jadon: +91 9557138449
              </a>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Mail className="w-3.5 h-3.5 text-[#C5A869]" />
              <span>concierge@royalagraestate.in</span>
            </div>
          </div>

        </div>

        {/* Popular Agra Real Estate Searches (Google Crawl Links) */}
        <div className="py-6 border-b border-[#164E3D]/50 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-[#E4D5B7] uppercase tracking-wider">
              Popular Real Estate Searches in Agra
            </span>
            <span className="text-[11px] text-gray-400">
              Verified Title Deeds • Direct Builder Contact
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-gray-300">
            <a href="/plots-in-fatehabad-road-agra" className="hover:text-[#E4D5B7] transition-colors">
              Plots in Fatehabad Road Agra
            </a>
            <span className="text-[#164E3D] hidden sm:inline">•</span>
            <a href="/ada-approved-plots-in-agra" className="hover:text-[#E4D5B7] transition-colors">
              ADA Approved Plots in Agra
            </a>
            <span className="text-[#164E3D] hidden sm:inline">•</span>
            <a href="/buy-house-in-agra" className="hover:text-[#E4D5B7] transition-colors">
              House for Sale in Agra
            </a>
            <span className="text-[#164E3D] hidden sm:inline">•</span>
            <a href="/luxury-villas-in-agra" className="hover:text-[#E4D5B7] transition-colors">
              Luxury Villas in Agra
            </a>
            <span className="text-[#164E3D] hidden sm:inline">•</span>
            <a href="/flats-for-rent-in-agra" className="hover:text-[#E4D5B7] transition-colors">
              Flats for Rent in Agra
            </a>
            <span className="text-[#164E3D] hidden sm:inline">•</span>
            <a href="/commercial-property-in-agra" className="hover:text-[#E4D5B7] transition-colors">
              Commercial Property in Agra
            </a>
            <span className="text-[#164E3D] hidden sm:inline">•</span>
            <a href="/sell-property-in-agra" className="hover:text-[#E4D5B7] transition-colors">
              Sell Property in Agra
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3 text-center sm:text-left">
          <span>
            © {new Date().getFullYear()} Royal Agra Estate. Managed by Shrey Gupta & Abhishek Singh Jadon. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
};
