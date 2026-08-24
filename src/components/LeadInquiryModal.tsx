import React, { useState } from 'react';
import { Property } from '../types';
import { X, Calendar, CheckCircle2, ShieldCheck, User, Phone, Mail, Clock } from 'lucide-react';
import { LeadSubmission } from '../utils/security';

interface LeadInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onLeadSubmitted: (lead: LeadSubmission) => void;
}

export const LeadInquiryModal: React.FC<LeadInquiryModalProps> = ({
  isOpen,
  onClose,
  property,
  onLeadSubmitted
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !phone || !email || !preferredTime) return;

    const newLead: LeadSubmission = {
      id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: property ? property.id : 'general-inquiry',
      propertyTitle: property ? property.title : 'General Portfolio Inquiry',
      buyerName: buyerName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      preferredTime: preferredTime.trim(),
      timestamp: new Date().toLocaleString()
    };

    onLeadSubmitted(newLead);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setBuyerName('');
      setPhone('');
      setEmail('');
      setPreferredTime('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative">
        
        {/* Header */}
        <div className="bg-[#0F382C] text-white p-6 relative border-b border-[#164E3D]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-[#164E3D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#E4D5B7] text-xs uppercase tracking-wider font-semibold mb-1">
            <Calendar className="w-4 h-4" />
            <span>Royal Agra Estate Concierge</span>
          </div>
          <h3 className="font-brand-title font-bold text-lg text-white">
            {property ? `Inquire / Book Tour: ${property.title}` : 'Private Inquiry & Tour Booking'}
          </h3>
          {property && (
            <p className="text-xs text-gray-300 mt-0.5 line-clamp-1">
              {property.priceDisplay} • {property.location}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-serif-luxury font-bold text-[#0F382C]">
                Inquiry Saved Successfully
              </h4>
              <p className="text-xs text-gray-600">
                Thank you, <strong>{buyerName}</strong>! Your tour request has been routed to our admin desk. Our co-founders will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="vikram@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Preferred Visit Time
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    required
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Strict confidentiality guaranteed for all HNI buyers</span>
              </div>

              <button
                type="submit"
                id="submit-lead-inquiry-btn"
                className="w-full py-3 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                Submit Inquiry & Book Tour
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
