import React, { useState } from 'react';
import { ActiveScreen, Property } from '../types';
import { 
  Home, 
  Building, 
  Eye, 
  BookOpen, 
  PlusCircle, 
  Layers, 
  Landmark, 
  PhoneCall, 
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  X,
  Compass
} from 'lucide-react';

interface ScreenNavigatorProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  hasSelectedProperty: boolean;
  onOpenSampleDetail: () => void;
}

export const ScreenNavigator: React.FC<ScreenNavigatorProps> = ({
  activeScreen,
  onNavigate,
  hasSelectedProperty,
  onOpenSampleDetail
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const screens: { id: ActiveScreen; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'home', label: 'Hero / Home', icon: Home, desc: 'Hero search & featured estates' },
    { id: 'properties', label: 'Properties', icon: Building, desc: 'Advanced filters, grid/map view' },
    { id: 'property-detail', label: 'Property Detail', icon: Eye, desc: 'Gallery, specs & tour booking' },
    { id: 'sell-rent', label: 'Sell / Rent', icon: PlusCircle, desc: 'Multi-step listing submission' },
    { id: 'projects', label: 'New Projects', icon: Layers, desc: 'Townships & construction updates' },
    { id: 'dashboard', label: 'My Dashboard', icon: SlidersHorizontal, desc: 'Manage listings & user profile' },
    { id: 'about', label: 'About Us', icon: Landmark, desc: 'Agra heritage & managing partners' },
    { id: 'contact', label: 'Contact', icon: PhoneCall, desc: 'Private consultation & concierge' }
  ];

  const handleItemClick = (screenId: ActiveScreen) => {
    if (screenId === 'property-detail') {
      onOpenSampleDetail();
    } else {
      onNavigate(screenId);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          id="screen-navigator-toggle-btn"
          onClick={() => setIsOpen(true)}
          className="bg-[#0F382C] text-white hover:bg-[#164E3D] px-4 py-2.5 rounded-full shadow-2xl border border-[#C5A869]/50 flex items-center gap-2.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105 group"
        >
          <div className="w-2 h-2 rounded-full bg-[#C5A869] animate-pulse" />
          <Compass className="w-4 h-4 text-[#E4D5B7] group-hover:rotate-45 transition-transform" />
          <span>Screen Navigator</span>
          <ChevronUp className="w-4 h-4 text-white/70" />
        </button>
      )}

      {/* Expanded Navigator Drawer / Modal */}
      {isOpen && (
        <div className="bg-[#0B2B22] text-white w-[320px] sm:w-[420px] rounded-2xl shadow-2xl border-2 border-[#164E3D] p-4 sm:p-5 animate-fadeIn">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#164E3D]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C5A869]" />
              <span className="font-brand-title font-bold text-sm text-[#E4D5B7]">
                Royal Agra Screen Navigator
              </span>
            </div>
            <button
              type="button"
              id="close-screen-nav-btn"
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-[#164E3D]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dark Green (#0B2B22) Drawer Grid Tiles as specified */}
          <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto no-scrollbar py-1">
            {screens.map((s) => {
              const Icon = s.icon;
              const isActive = activeScreen === s.id;
              return (
                <button
                  key={s.id}
                  id={`nav-tile-${s.id}`}
                  type="button"
                  onClick={() => handleItemClick(s.id)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#0F382C] border-[#C5A869] shadow-md'
                      : 'bg-[#0B2B22] border-[#164E3D] hover:border-[#0F382C] hover:bg-[#0F382C]/60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A869]' : 'text-gray-300'}`} />
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold text-[#E4D5B7] bg-[#164E3D] px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {s.label}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                      {s.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer status */}
          <div className="mt-3 pt-2 border-t border-[#164E3D] flex items-center justify-between text-[11px] text-gray-400">
            <span>Pixel-Perfect Design Lock</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#E4D5B7] hover:underline font-medium"
            >
              Minimize
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
