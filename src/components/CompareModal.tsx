import React, { useState } from 'react';
import { Property } from '../types';
import { 
  X, Check, Minus, Bed, Bath, Maximize, MapPin, IndianRupee, 
  Trash2, ShieldCheck, Sparkles, Navigation, Layers, Compass, 
  Car, Clock, Calendar, CheckCircle2, ArrowRight, Eye
} from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareList: Property[];
  onRemoveFromCompare: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

// Common luxury amenities to compare across properties
const COMPARISON_AMENITIES = [
  'Private Swimming Pool',
  '24/7 Security & CCTV',
  '100% Power Backup',
  'Clubhouse & Gymnasium',
  'Vastu Compliant',
  'Private Lift / Elevator',
  'Landscaped Garden / Terrace',
  'Italian Marble Flooring',
  'Smart Home Automation',
  'Chauffeur & Servant Quarters',
  'Taj Mahal / Heritage View',
  'EV Charging Station'
];

// Key Agra Landmarks to compare proximity
const KEY_LANDMARKS = [
  'Taj Mahal (East Gate)',
  'Fatehabad Road Luxury Hub',
  'Agra Airport (Civil Enclave)',
  'Agra Cantt Railway Station',
  'Agra Metro Station'
];

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareList,
  onRemoveFromCompare,
  onSelectProperty
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'specs' | 'amenities' | 'landmarks'>('all');

  if (!isOpen) return null;

  // Calculate Stamp Duty in UP (~7%)
  const calculateStampDuty = (price: number) => {
    const duty = Math.round(price * 0.07);
    if (duty >= 10000000) {
      return `₹${(duty / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(duty / 100000).toFixed(2)} Lakh`;
  };

  // Helper to check if property has amenity (case-insensitive fuzzy match)
  const hasAmenity = (property: Property, amenityName: string) => {
    const list = [...property.amenities, ...property.highlights, property.description];
    const needle = amenityName.toLowerCase();
    
    // Custom check for specific amenities
    if (needle.includes('taj')) {
      return property.facing.includes('Taj') || property.description.toLowerCase().includes('taj');
    }
    if (needle.includes('pool')) {
      return list.some(a => a.toLowerCase().includes('pool'));
    }
    if (needle.includes('security')) {
      return property.gatedSecurity || list.some(a => a.toLowerCase().includes('security') || a.toLowerCase().includes('cctv'));
    }
    if (needle.includes('power')) {
      return property.powerBackup || list.some(a => a.toLowerCase().includes('power') || a.toLowerCase().includes('backup'));
    }
    if (needle.includes('vastu')) {
      return property.facing.includes('Vastu') || list.some(a => a.toLowerCase().includes('vastu'));
    }
    if (needle.includes('lift') || needle.includes('elevator')) {
      return list.some(a => a.toLowerCase().includes('lift') || a.toLowerCase().includes('elevator'));
    }
    if (needle.includes('marble')) {
      return list.some(a => a.toLowerCase().includes('marble') || a.toLowerCase().includes('italian'));
    }
    if (needle.includes('smart')) {
      return list.some(a => a.toLowerCase().includes('smart') || a.toLowerCase().includes('automation'));
    }
    if (needle.includes('garden') || needle.includes('terrace')) {
      return list.some(a => a.toLowerCase().includes('garden') || a.toLowerCase().includes('terrace') || a.toLowerCase().includes('lawn'));
    }
    if (needle.includes('clubhouse') || needle.includes('gym')) {
      return list.some(a => a.toLowerCase().includes('club') || a.toLowerCase().includes('gym'));
    }
    if (needle.includes('servant') || needle.includes('chauffeur')) {
      return list.some(a => a.toLowerCase().includes('servant') || a.toLowerCase().includes('quarter') || a.toLowerCase().includes('driver'));
    }
    if (needle.includes('ev')) {
      return list.some(a => a.toLowerCase().includes('ev') || a.toLowerCase().includes('electric'));
    }
    
    return list.some(a => a.toLowerCase().includes(needle));
  };

  // Helper to get landmark distance info
  const getLandmarkInfo = (property: Property, landmarkName: string) => {
    const found = property.landmarks.find(l => 
      l.name.toLowerCase().includes(landmarkName.toLowerCase().split(' ')[0])
    );
    if (found) {
      return `${found.distance} (${found.travelTime})`;
    }
    // Fallback based on locality
    if (landmarkName.includes('Taj')) {
      return property.locality.includes('Taj') ? '1.2 km (4 mins)' : '6.5 km (15 mins)';
    }
    if (landmarkName.includes('Fatehabad')) {
      return property.locality.includes('Fatehabad') ? '0.5 km (2 mins)' : '5.0 km (12 mins)';
    }
    if (landmarkName.includes('Airport')) {
      return '11.5 km (25 mins)';
    }
    if (landmarkName.includes('Cantt')) {
      return '7.0 km (18 mins)';
    }
    if (landmarkName.includes('Metro')) {
      return '1.8 km (5 mins)';
    }
    return '10-15 mins';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#0F382C] text-white px-6 py-4 flex items-center justify-between border-b border-[#164E3D] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E4D5B7]/10 border border-[#C5A869]/30 flex items-center justify-center text-[#E4D5B7]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-lg sm:text-xl text-white tracking-wide">
                Detailed Property Comparison Matrix
              </h3>
              <p className="text-xs text-[#E4D5B7]">
                Side-by-side analysis of specifications, amenities, and landmark proximities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#164E3D] text-[#E4D5B7] text-xs font-semibold">
              {compareList.length} {compareList.length === 1 ? 'Estate' : 'Estates'} Selected
            </span>
            <button
              type="button"
              id="close-compare-modal-btn"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-[#164E3D] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Section Filter Tabs */}
        {compareList.length > 0 && (
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSection('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeSection === 'all'
                    ? 'bg-[#0F382C] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                All Details
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('specs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeSection === 'specs'
                    ? 'bg-[#0F382C] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                Area Specs & Financials
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('amenities')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeSection === 'amenities'
                    ? 'bg-[#0F382C] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                Luxury Amenities ({COMPARISON_AMENITIES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('landmarks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeSection === 'landmarks'
                    ? 'bg-[#0F382C] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                Landmark Proximities
              </button>
            </div>
            
            <p className="text-[11px] text-gray-500 hidden md:block italic">
              Scroll horizontally to compare all selected columns
            </p>
          </div>
        )}

        {/* Content Table Container */}
        <div className="p-4 sm:p-6 overflow-x-auto flex-1 bg-white">
          {compareList.length === 0 ? (
            <div className="text-center py-16 text-gray-500 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#0F382C]/10 text-[#0F382C] mx-auto flex items-center justify-center mb-4">
                <Layers className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-serif-luxury font-bold text-gray-900 mb-2">No Estates in Comparison</h4>
              <p className="text-sm text-gray-600 mb-6">
                Select properties from the portfolio or home screen by clicking the comparison button to evaluate them side-by-side.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#0F382C] text-white rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-[#164E3D]"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="min-w-[800px] pb-6">
              
              {/* PROPERTY CARDS ROW */}
              <div className={`grid gap-4 pb-6 border-b-2 border-gray-200 ${
                compareList.length === 1 ? 'grid-cols-2' :
                compareList.length === 2 ? 'grid-cols-3' :
                compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
              }`}>
                {/* Column 0: Category Label Header */}
                <div className="flex flex-col justify-end p-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Properties
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Comparing specifications across Agra's finest real estate.
                  </p>
                </div>

                {/* Property Columns */}
                {compareList.map((p) => (
                  <div key={p.id} className="relative bg-[#FAF8F5] rounded-xl border border-[#C5A869]/30 p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <button
                      type="button"
                      onClick={() => onRemoveFromCompare(p.id)}
                      className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 rounded-full bg-white/90 shadow-sm transition-colors z-10"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="relative h-28 rounded-lg overflow-hidden mb-2.5 bg-gray-200">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1.5 left-1.5 bg-[#0F382C]/90 text-[#FAF8F5] px-2 py-0.5 rounded text-[10px] font-bold">
                        {p.propertyType}
                      </div>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-[#0F382C] line-clamp-1 mb-1">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-[#C5A869]" />
                      <span className="truncate">{p.locality}</span>
                    </p>

                    <div className="mt-auto pt-2 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-sm font-serif-luxury font-bold text-gray-900">
                        {p.priceDisplay}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProperty(p);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* TABLE BODY */}
              <div className="divide-y divide-gray-100 text-xs">

                {/* 1. FINANCIALS & PRICING */}
                {(activeSection === 'all' || activeSection === 'specs') && (
                  <>
                    <div className="py-2.5 bg-gray-50/80 px-2 font-bold text-[#0F382C] uppercase tracking-wider text-[11px] flex items-center gap-2 mt-4 rounded">
                      <IndianRupee className="w-3.5 h-3.5 text-[#C5A869]" />
                      <span>Financials & Registration</span>
                    </div>

                    <div className={`grid gap-4 py-3 items-center ${
                      compareList.length === 1 ? 'grid-cols-2' :
                      compareList.length === 2 ? 'grid-cols-3' :
                      compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                    }`}>
                      <span className="font-bold text-gray-600 px-2">Total Price</span>
                      {compareList.map(p => (
                        <span key={p.id} className="font-serif-luxury font-bold text-sm text-gray-900 px-2">{p.priceDisplay}</span>
                      ))}
                    </div>

                    <div className={`grid gap-4 py-3 items-center ${
                      compareList.length === 1 ? 'grid-cols-2' :
                      compareList.length === 2 ? 'grid-cols-3' :
                      compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                    }`}>
                      <span className="font-bold text-gray-600 px-2">Rate per Sq.Ft</span>
                      {compareList.map(p => (
                        <span key={p.id} className="font-mono text-gray-900 font-semibold px-2">₹{p.pricePerSqFt.toLocaleString('en-IN')}/sq.ft</span>
                      ))}
                    </div>

                    <div className={`grid gap-4 py-3 items-center ${
                      compareList.length === 1 ? 'grid-cols-2' :
                      compareList.length === 2 ? 'grid-cols-3' :
                      compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                    }`}>
                      <span className="font-bold text-gray-600 px-2">Est. UP Stamp Duty (7%)</span>
                      {compareList.map(p => (
                        <span key={p.id} className="text-gray-700 px-2">{calculateStampDuty(p.price)}</span>
                      ))}
                    </div>

                    <div className={`grid gap-4 py-3 items-center ${
                      compareList.length === 1 ? 'grid-cols-2' :
                      compareList.length === 2 ? 'grid-cols-3' :
                      compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                    }`}>
                      <span className="font-bold text-gray-600 px-2">Authority Verification</span>
                      {compareList.map(p => (
                        <div key={p.id} className="px-2">
                          {p.verified ? (
                            <span className="font-medium text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block">
                              ✓ {p.verifiedBy || 'ADA / Authority'}
                            </span>
                          ) : p.verificationStatus === 'In Process' ? (
                            <span className="font-medium text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block">
                              ⏳ In Process
                            </span>
                          ) : (
                            <span className="font-medium text-[11px] text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded inline-block">
                              Independent Registry
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 2. AREA & ARCHITECTURAL SPECS */}
                {(activeSection === 'all' || activeSection === 'specs') && (
                  <>
                    <div className="py-2.5 bg-gray-50/80 px-2 font-bold text-[#0F382C] uppercase tracking-wider text-[11px] flex items-center gap-2 mt-4 rounded">
                      <Maximize className="w-3.5 h-3.5 text-[#C5A869]" />
                      <span>Area & Space Specifications</span>
                    </div>

                    <div className={`grid gap-4 py-3 items-center ${
                      compareList.length === 1 ? 'grid-cols-2' :
                      compareList.length === 2 ? 'grid-cols-3' :
                      compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                    }`}>
                      <span className="font-bold text-gray-600 px-2">Super Built-up Area</span>
                      {compareList.map(p => (
                        <span key={p.id} className="font-mono font-bold text-gray-900 px-2">
                          {p.superAreaSqFt.toLocaleString('en-IN')} sq.ft
                        </span>
                      ))}
                    </div>

                    <div className={`grid gap-4 py-3 items-center ${
                      compareList.length === 1 ? 'grid-cols-2' :
                      compareList.length === 2 ? 'grid-cols-3' :
                      compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                    }`}>
                      <span className="font-bold text-gray-600 px-2">Carpet Area</span>
                      {compareList.map(p => (
                        <span key={p.id} className="font-mono text-gray-800 px-2">
                          {p.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft
                        </span>
                      ))}
                    </div>

                    <div className={`grid gap-4 py-3 items-center ${
                      compareList.length === 1 ? 'grid-cols-2' :
                      compareList.length === 2 ? 'grid-cols-3' :
                      compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                    }`}>
                      <span className="font-bold text-gray-600 px-2">Configuration</span>
                      {compareList.map(p => (
                        <span key={p.id} className="text-gray-900 font-semibold px-2">
                          {p.bedrooms} BHK ({p.bathrooms} Baths, {p.balconies} Balconies)
                        </span>
                      ))}
                    </div>

                    <div className={`grid gap-4 py-3 items-center ${
                      compareList.length === 1 ? 'grid-cols-2' :
                      compareList.length === 2 ? 'grid-cols-3' :
                      compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                    }`}>
                      <span className="font-bold text-gray-600 px-2">Furnishing Status</span>
                      {compareList.map(p => (
                        <span key={p.id} className="text-gray-800 px-2">{p.furnishing}</span>
                      ))}
                    </div>

                    <div className={`grid gap-4 py-3 items-center ${
                      compareList.length === 1 ? 'grid-cols-2' :
                      compareList.length === 2 ? 'grid-cols-3' :
                      compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                    }`}>
                      <span className="font-bold text-gray-600 px-2">Orientation / Facing</span>
                      {compareList.map(p => (
                        <span key={p.id} className="text-gray-800 px-2">{p.facing}</span>
                      ))}
                    </div>

                    <div className={`grid gap-4 py-3 items-center ${
                      compareList.length === 1 ? 'grid-cols-2' :
                      compareList.length === 2 ? 'grid-cols-3' :
                      compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                    }`}>
                      <span className="font-bold text-gray-600 px-2">Possession Status</span>
                      {compareList.map(p => (
                        <span key={p.id} className="text-emerald-700 font-semibold px-2">{p.possession}</span>
                      ))}
                    </div>

                    <div className={`grid gap-4 py-3 items-center ${
                      compareList.length === 1 ? 'grid-cols-2' :
                      compareList.length === 2 ? 'grid-cols-3' :
                      compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                    }`}>
                      <span className="font-bold text-gray-600 px-2">Dedicated Parking</span>
                      {compareList.map(p => (
                        <span key={p.id} className="text-gray-800 px-2">{p.parkingSpots} Covered Bays</span>
                      ))}
                    </div>
                  </>
                )}

                {/* 3. LUXURY AMENITIES MATRIX */}
                {(activeSection === 'all' || activeSection === 'amenities') && (
                  <>
                    <div className="py-2.5 bg-gray-50/80 px-2 font-bold text-[#0F382C] uppercase tracking-wider text-[11px] flex items-center gap-2 mt-4 rounded">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A869]" />
                      <span>Luxury Amenities Checklist</span>
                    </div>

                    {COMPARISON_AMENITIES.map((amenity) => (
                      <div key={amenity} className={`grid gap-4 py-2.5 items-center ${
                        compareList.length === 1 ? 'grid-cols-2' :
                        compareList.length === 2 ? 'grid-cols-3' :
                        compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                      }`}>
                        <span className="font-medium text-gray-700 px-2">{amenity}</span>
                        {compareList.map(p => {
                          const available = hasAmenity(p, amenity);
                          return (
                            <div key={p.id} className="px-2 flex items-center">
                              {available ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                  <span>Included</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-gray-400 text-xs px-2 py-0.5">
                                  <Minus className="w-3.5 h-3.5 text-gray-300" />
                                  <span>—</span>
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </>
                )}

                {/* 4. PROXIMITY TO AGRA LANDMARKS */}
                {(activeSection === 'all' || activeSection === 'landmarks') && (
                  <>
                    <div className="py-2.5 bg-gray-50/80 px-2 font-bold text-[#0F382C] uppercase tracking-wider text-[11px] flex items-center gap-2 mt-4 rounded">
                      <Navigation className="w-3.5 h-3.5 text-[#C5A869]" />
                      <span>Proximity to Agra Landmarks & Transit</span>
                    </div>

                    {KEY_LANDMARKS.map((landmark) => (
                      <div key={landmark} className={`grid gap-4 py-2.5 items-center ${
                        compareList.length === 1 ? 'grid-cols-2' :
                        compareList.length === 2 ? 'grid-cols-3' :
                        compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                      }`}>
                        <span className="font-medium text-gray-700 px-2">{landmark}</span>
                        {compareList.map(p => (
                          <div key={p.id} className="px-2">
                            <span className="inline-flex items-center gap-1 text-gray-800 text-xs font-medium">
                              <Clock className="w-3 h-3 text-[#C5A869]" />
                              {getLandmarkInfo(p, landmark)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                )}

                {/* ACTION ROW */}
                <div className={`grid gap-4 py-4 items-center bg-gray-50/50 mt-4 rounded-xl ${
                  compareList.length === 1 ? 'grid-cols-2' :
                  compareList.length === 2 ? 'grid-cols-3' :
                  compareList.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
                }`}>
                  <span className="font-bold text-[#0F382C] px-2 text-xs uppercase tracking-wider">
                    Next Steps
                  </span>
                  {compareList.map(p => (
                    <div key={p.id} className="px-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProperty(p);
                          onClose();
                        }}
                        className="w-full py-2 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-lg text-xs font-bold tracking-wide shadow-sm hover:shadow flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>Full Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
