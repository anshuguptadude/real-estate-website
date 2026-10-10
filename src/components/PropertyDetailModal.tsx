import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MapComponent } from './MapComponent';
import { formatAgraLocality } from '../utils/security';
import {
  X,

  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  IndianRupee, 
  Compass, 
  Car, 
  Zap, 
  CheckCircle,
  Building,
  ArrowRight,
  Calculator,
  Heart,
  Share2
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onBookVisit: (property: Property) => void;
  onOpenEmiCalc: (price: number) => void;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
  isAdminUser?: boolean;
  onApproveProperty?: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onBookVisit,
  onOpenEmiCalc,
  onToggleSave,
  isSaved,
  isAdminUser,
  onApproveProperty
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryDate, setInquiryDate] = useState('');
  const [chauffeurReq, setChauffeurReq] = useState(true);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [approvedSuccess, setApprovedSuccess] = useState(false);

  useEffect(() => {
    if (property) {
      setActiveImageIndex(0);
      setInquirySubmitted(false);
      setCopied(false);
      setApprovedSuccess(false);
    }
  }, [property?.id]);

  if (!property) return null;

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}?property=${property.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      onClose();
    }, 2500);
  };

  const handleApprove = () => {
    if (onApproveProperty && property) {
      onApproveProperty(property.id);
      setApprovedSuccess(true);
      setTimeout(() => setApprovedSuccess(false), 3000);
    }
  };

  const displayLocality = formatAgraLocality(property.primaryAgraLocality || property.locality || property.location);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      
      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
        className="bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh]"
      >
        
        {/* Modal Top Sticky Header */}
        <div className="px-6 py-4 bg-[#0F382C] text-white flex items-center justify-between border-b border-[#164E3D] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#E4D5B7] font-semibold">
              {property.propertyType} • {property.listingType === 'Rent' ? 'Rental Lease' : 'Freehold Sale'}
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#C5A869]" />
            {isAdminUser ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Admin View Active
              </span>
            ) : (
              <span className="hidden sm:inline-block text-xs text-gray-300 font-medium">
                Verified Clean Title
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="detail-copy-link-btn"
              onClick={handleCopyLink}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-[#164E3D] transition-all flex items-center gap-1 focus:outline-none"
              title="Copy property link to share"
            >
              <Share2 className="w-5 h-5 text-[#E4D5B7]" />
              {copied ? (
                <span className="text-[9px] bg-[#C5A869] text-[#0F382C] font-bold px-1.5 py-0.5 rounded">Copied!</span>
              ) : null}
            </button>
            <button
              type="button"
              id="detail-save-btn"
              onClick={() => onToggleSave(property.id)}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-[#164E3D] transition-colors"
              title="Save to favorites"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              type="button"
              id="detail-close-btn"
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-[#164E3D] transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8 flex-1">
          
          {/* Main Gallery Section */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-900">
              <img
                src={property.images[activeImageIndex] || property.coverImage}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-md bg-[#0F382C] text-[#E4D5B7] text-xs font-bold uppercase tracking-wider shadow-md">
                  {property.possession}
                </span>
                {property.status === 'Pending Approval' ? (
                  <span className="px-3 py-1 rounded-md bg-amber-600 text-white text-xs font-bold tracking-wider shadow-md flex items-center gap-1">
                    <span>⏳ Pending Admin Approval</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-md bg-white/90 text-[#0F382C] text-xs font-bold tracking-wider shadow-md flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verified Clear Title
                  </span>
                )}
              </div>
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded backdrop-blur-xs font-mono">
                {activeImageIndex + 1} / {property.images.length} Photos
              </div>
            </div>

            {/* Thumbnails list */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#0F382C] scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Title & Price Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between pb-6 border-b border-gray-200 gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold bg-gray-100 px-2.5 py-1 rounded-md">
                  <MapPin className="w-4 h-4 text-[#0F382C]" />
                  <span>{displayLocality}</span>
                </div>

                {/* Verification Authority Badge */}
                {property.verified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified by {property.verifiedBy || 'ADA / Regulatory Authority'}</span>
                  </span>
                ) : property.verificationStatus === 'In Process' || property.status === 'Pending Approval' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                    <span>⏳ Verification In Process ({property.verifiedBy || 'Applied'})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-xs font-medium">
                    <span>Independent Private Registry (Self-Declared)</span>
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F382C]">
                {property.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {property.tagline}
              </p>
            </div>

            <div className="text-left md:text-right shrink-0 bg-[#FAF8F5] p-4 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500 font-semibold uppercase block">Price Guide</span>
              <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F382C] block">
                {property.priceDisplay}
              </span>
              <span className="text-xs text-gray-500 font-mono block mt-0.5">
                ₹{property.pricePerSqFt.toLocaleString('en-IN')} per sq.ft
              </span>
              <button
                type="button"
                onClick={() => onOpenEmiCalc(property.price)}
                className="mt-2 text-xs font-semibold text-[#0F382C] hover:underline flex items-center gap-1"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate Mortgage EMI</span>
              </button>
            </div>
          </div>

          {/* Admin Action Bar (if property is pending and user is admin) */}
          {isAdminUser && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-bold text-amber-900 uppercase">
                  Admin Listing Controls: Status is {property.status || 'Active'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {property.status === 'Pending Approval' && onApproveProperty && (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Publish Listing</span>
                  </button>
                )}
                {approvedSuccess && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg">
                    ✓ Listing Published Live!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-5 bg-[#FAF8F5] rounded-xl border border-gray-200/80">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">Configuration</span>
              <span className="text-sm font-bold text-[#0F382C] mt-0.5 block">
                {property.bedrooms > 0 ? `${property.bedrooms} BHK (${property.bathrooms} Baths)` : 'Commercial Suite'}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">Super Built-up Area</span>
              <span className="text-sm font-bold text-[#0F382C] mt-0.5 block">
                {property.superAreaSqFt.toLocaleString('en-IN')} sq.ft
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">Facing / Orientation</span>
              <span className="text-sm font-bold text-[#0F382C] mt-0.5 block">
                {property.facing}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">Furnishing Status</span>
              <span className="text-sm font-bold text-[#0F382C] mt-0.5 block">
                {property.furnishing}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">Posted / Listed On</span>
              <span className="text-sm font-bold text-[#0F382C] mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C5A869]" />
                <span>{property.postedDate || '09 Oct 2024'}</span>
              </span>
            </div>
          </div>

          {/* Admin View Dossier Box (ADMIN ONLY) */}
          {isAdminUser ? (
            <div className="p-6 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    🔐
                  </div>
                  <div>
                    <h3 className="font-serif-luxury font-bold text-base text-amber-950">
                      Admin View: Full Address & Confidential Dossier
                    </h3>
                    <p className="text-[11px] text-amber-800">
                      This private section is visible only to authenticated Royal Agra Estate administrators.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-200 text-amber-900 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Admin Only
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Full Street Address</span>
                  <p className="font-semibold text-gray-900 leading-snug">
                    {property.fullAddress || property.address || 'Address on file with admin'}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Building / Project Name</span>
                  <p className="font-semibold text-gray-900">
                    {property.buildingName || property.title}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">House / Plot / Unit Number</span>
                  <p className="font-semibold text-gray-900">
                    {property.plotNumber || 'Plot on record'}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Agra Locality / Sector</span>
                  <p className="font-semibold text-gray-900">
                    {displayLocality}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Owner / Lister Name</span>
                  <p className="font-semibold text-gray-900">
                    {property.ownerName || property.agent?.name || 'Managing Partner'}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Direct Owner Contact</span>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-emerald-800">
                      {property.ownerContact || property.agent?.phone || '+91 91490 79913'}
                    </p>
                    <a
                      href={`tel:${property.ownerContact || property.agent?.phone || '+919149079913'}`}
                      className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded font-bold hover:bg-emerald-800"
                    >
                      Call
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Submission / Posted Date</span>
                  <p className="font-semibold text-gray-900 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>{property.postedDate || '09 Oct 2024'}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Privacy Protected Notice for Non-Admin Public Visitors */
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-950">
                  Location Privacy & Confidentiality Protocol
                </h4>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  To protect seller security and exclusive discretion, only the primary Agra locality ({displayLocality}) is shown publicly. Exact house/plot numbers, full street addresses, and private access directions are shared exclusively during confirmed site tours coordinated by our senior advisors.
                </p>
              </div>
            </div>
          )}

          {/* Highlights & Description */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Description + Highlights + Amenities + Landmarks */}
            <div className="lg:col-span-2 space-y-6">
              
              <div>
                <h3 className="text-lg font-serif-luxury font-bold text-[#0F382C] mb-2">
                  Architectural & Residence Overview
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Key Highlights */}
              <div>
                <h4 className="text-sm font-bold text-[#0F382C] uppercase tracking-wider mb-3">
                  Distinguished Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <Sparkles className="w-4 h-4 text-[#C5A869] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-sm font-bold text-[#0F382C] uppercase tracking-wider mb-3">
                  Luxury Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-100 text-xs font-medium flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nearby Landmarks & Connectivity */}
              {property.landmarks && property.landmarks.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[#0F382C] uppercase tracking-wider mb-3">
                    Connectivity & Agra Landmarks
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.landmarks.map((l, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#0F382C]" />
                          <span className="font-semibold text-gray-800">{l.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-gray-600 block">{l.distance}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold">{l.travelTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              <div>
                <h4 className="text-sm font-bold text-[#0F382C] uppercase tracking-wider mb-3">
                  Property Locality Map ({displayLocality})
                </h4>
                <MapComponent lat={property.coordinates.lat} lng={property.coordinates.lng} />
              </div>

            </div>

            {/* Right 1 Col: Schedule Tour Form only */}
            <div className="lg:col-span-1 space-y-6">

              {/* Schedule Private Viewing Form */}
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-gray-200 shadow-2xs">
                <h4 className="text-sm font-serif-luxury font-bold text-[#0F382C] mb-1">
                  Schedule Private Site Tour
                </h4>
                <p className="text-[11px] text-gray-500 mb-4">
                  Complimentary luxury chauffeur transfer available for Agra site visits.
                </p>

                {inquirySubmitted ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-xs text-center border border-emerald-200">
                    <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <p className="font-bold">Tour Requested Successfully!</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">Our Senior Advisor will contact you within 15 minutes.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Singhania"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full p-2 text-xs bg-white border border-gray-300 rounded-md focus:border-[#0F382C] focus:ring-1 focus:ring-[#0F382C]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        className="w-full p-2 text-xs bg-white border border-gray-300 rounded-md focus:border-[#0F382C] focus:ring-1 focus:ring-[#0F382C]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={inquiryDate}
                        onChange={(e) => setInquiryDate(e.target.value)}
                        className="w-full p-2 text-xs bg-white border border-gray-300 rounded-md focus:border-[#0F382C] focus:ring-1 focus:ring-[#0F382C]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="chauffeur-opt"
                        checked={chauffeurReq}
                        onChange={(e) => setChauffeurReq(e.target.checked)}
                        className="rounded text-[#0F382C] focus:ring-[#0F382C]"
                      />
                      <label htmlFor="chauffeur-opt" className="text-[11px] text-gray-700">
                        Include luxury chauffeur pick-up in Agra
                      </label>
                    </div>

                    <button
                      type="submit"
                      id="submit-tour-inquiry-btn"
                      className="w-full py-2.5 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                    >
                      Book Site Tour
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </motion.div>
  );
};
