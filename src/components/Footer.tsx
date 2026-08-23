import React from 'react';
import { ActiveScreen } from '../types';
import { Landmark, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (screen: ActiveScreen) => void;
  onOpenPostProperty: () => void;
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
              Curated luxury residences, heritage estates, and prime developments across Agra.
            </p>
          </div>

          {/* Essential Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-gray-300">
            {navLinks.map((link) => (
              <button
                key={link.screen}
                id={`footer-link-${link.screen}`}
                onClick={() => onNavigate(link.screen)}
                className="hover:text-white transition-colors hover:underline underline-offset-4"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Core Contact Info */}
          <div className="text-xs text-gray-300 space-y-2 flex flex-col items-center md:items-end">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C5A869]" />
              <div className="flex items-center gap-1.5">
                <a href="tel:+919149079913" className="hover:text-white transition-colors">+91 91490 79913</a>
                <span>/</span>
                <a href="tel:+919557138449" className="hover:text-white transition-colors">+91 95571 38449</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#C5A869]" />
              <span>concierge@royalagraestate.com</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3 text-center sm:text-left">
          <span>
            © {new Date().getFullYear()} Royal Agra Estate. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
};
