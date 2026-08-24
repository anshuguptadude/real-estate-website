import React from 'react';
import { Property } from '../types';
import { Bed, Bath, Maximize, MapPin, ShieldCheck, Heart, Sparkles, Eye, Calendar, ArrowRight, MessageSquare } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
  onBookVisit: (property: Property) => void;
  onToggleCompare?: (property: Property) => void;
  isComparing?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onToggleSave,
  isSaved,
  onBookVisit,
  onToggleCompare,
  isComparing
}) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      
      {/* Media & Badges Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={property.coverImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Subtle Gradient Overlays for top and bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

        {/* Top-Left: Price Tag Badge + Optional Exclusive tags + Status */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 pointer-events-none z-10">
          {property.status && property.status !== 'Active' ? (
            <div className="bg-amber-600 text-white px-3 py-1 rounded-md shadow-md text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span>{property.status === 'Sold' ? 'SOLD OUT' : 'RENTED OUT'}</span>
            </div>
          ) : (
            /* Main Price Tag Badge */
            <div className="bg-white text-[#0F382C] px-3.5 py-1.5 rounded-lg shadow-lg border border-gray-100 flex items-center gap-1">
              <span className="text-sm sm:text-base font-sans font-black tracking-normal text-[#0F382C]">
                {property.priceDisplay}
              </span>
            </div>
          )}

          {/* Secondary Badge if exclusive */}
          {property.isExclusive && (
            <span className="px-2 py-0.5 rounded bg-[#C5A869] text-[#0F382C] text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#0F382C]" />
              Exclusive
            </span>
          )}
        </div>

        {/* Top-Right: Favorite Button */}
        <button
          type="button"
          id={`fav-btn-${property.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(property.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 flex items-center justify-center shadow-md transition-transform hover:scale-110 pointer-events-auto z-10"
          aria-label="Save property"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
        </button>

        {/* Floating Quick Inquiry WhatsApp Button */}
        <a
          href={`https://wa.me/919149079913?text=${encodeURIComponent(
            `Hello Shrey & Abhishek, I am interested in inquiring about the property: "${property.title}" (ID: ${property.id}). Please share more details.`
          )}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute bottom-11 right-3 flex items-center gap-1 px-2.5 py-1.5 bg-[#25D366] hover:bg-[#1ebd54] text-white rounded-full shadow-lg transition-all hover:scale-105 pointer-events-auto z-20 text-[9px] font-bold uppercase tracking-wider"
          title="Quick WhatsApp Inquiry with Founders"
        >
          <MessageSquare className="w-3 h-3 text-white fill-white" />
          <span>Quick Inquiry</span>
        </a>

        {/* Bottom Image Info: Property Type & Rate / Sq.Ft cleanly docked */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white z-10 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[#E4D5B7] border border-white/10">
              {property.propertyType}
            </span>
            {property.verified ? (
              <span 
                className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-emerald-950/85 backdrop-blur-xs text-emerald-300 border border-emerald-500/30 flex items-center gap-1" 
                title={property.verifiedBy ? `Verified by ${property.verifiedBy}` : 'Verified Title'}
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {property.verifiedBy ? (property.verifiedBy.includes('ADA') ? 'ADA Verified' : property.verifiedBy.includes('RERA') ? 'RERA' : 'Verified') : 'Verified'}
              </span>
            ) : property.verificationStatus === 'In Process' ? (
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-amber-950/85 backdrop-blur-xs text-amber-300 border border-amber-500/30 flex items-center gap-1">
                In Process
              </span>
            ) : null}
          </div>

          <span className="text-[11px] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-gray-200 border border-white/10 font-mono">
            ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Location Line */}
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0F382C] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Property Title */}
          <h3
            id={`prop-title-${property.id}`}
            onClick={() => onSelect(property)}
            className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F382C] hover:text-[#164E3D] cursor-pointer line-clamp-1 transition-colors"
          >
            {property.title}
          </h3>

          {/* Subtitle / Tagline */}
          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
            {property.tagline}
          </p>

          {/* Key Specs Strip */}
          <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-gray-100 text-gray-700">
            {property.bedrooms > 0 ? (
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Bed className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{property.bedrooms} Beds</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Commercial</span>
              </div>
            )}

            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Bath className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Maximize className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{property.superAreaSqFt.toLocaleString('en-IN')} sq.ft</span>
            </div>
          </div>

          {/* Highlights Mini Pills */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#FAF8F5] text-[#0F382C] border border-[#0F382C]/10">
              {property.possession}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">
              {property.furnishing}
            </span>
            {property.gatedSecurity && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                24/7 Gated
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="space-y-2 pt-3 mt-2 border-t border-gray-100">
          
          {/* Dual WhatsApp Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <a
              href={`https://wa.me/919149079913?text=${encodeURIComponent(`Hi Shrey, I am interested in Property ID ${property.id}`)}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="py-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded font-bold border border-emerald-200 flex items-center justify-center gap-1 transition-colors truncate"
              title="Contact Shrey Gupta on WhatsApp"
            >
              <span>💬 Contact Shrey</span>
            </a>
            <a
              href={`https://wa.me/919557138449?text=${encodeURIComponent(`Hi Abhishek, I am interested in Property ID ${property.id}`)}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="py-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded font-bold border border-emerald-200 flex items-center justify-center gap-1 transition-colors truncate"
              title="Contact Abhishek Singh on WhatsApp"
            >
              <span>💬 Contact Abhishek</span>
            </a>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            {onToggleCompare && (
              <button
                type="button"
                id={`compare-btn-${property.id}`}
                onClick={() => onToggleCompare(property)}
                className={`text-xs font-medium px-2.5 py-1.5 rounded transition-colors ${
                  isComparing
                    ? 'bg-[#0F382C] text-white font-semibold'
                    : 'text-gray-600 hover:text-[#0F382C] hover:bg-gray-100'
                }`}
              >
                {isComparing ? '✓ Comparing' : '+ Compare'}
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                id={`book-tour-btn-${property.id}`}
                onClick={() => onBookVisit(property)}
                className="text-xs font-semibold text-[#0F382C] hover:text-[#164E3D] px-2.5 py-1.5 rounded border border-[#0F382C]/30 hover:bg-[#0F382C]/5 transition-colors flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Tour</span>
              </button>

              <button
                type="button"
                id={`view-details-btn-${property.id}`}
                onClick={() => onSelect(property)}
                className="text-xs font-semibold bg-[#0F382C] hover:bg-[#164E3D] text-white px-3.5 py-1.5 rounded shadow-xs hover:shadow-sm transition-all flex items-center gap-1"
              >
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
