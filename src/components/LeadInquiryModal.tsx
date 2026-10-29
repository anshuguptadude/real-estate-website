import React, { useState, useEffect } from 'react';
import { Property, UserProfile } from '../types';
import { X, Calendar, CheckCircle2, ShieldCheck, User, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { LeadSubmission } from '../utils/security';

interface LeadInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onLeadSubmitted: (lead: LeadSubmission) => void;
  user?: UserProfile | null;
}

export const LeadInquiryModal: React.FC<LeadInquiryModalProps> = ({
  isOpen,
  onClose,
  property,
  onLeadSubmitted,
  user
}) => {
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync / Autofill if user profile loads or changes
  useEffect(() => {
    if (user) {
      if (!buyerName && user.name) setBuyerName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
      if (!email && user.email) setEmail(user.email);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFormValid =
    buyerName.trim().length >= 2 &&
    cleanPhone.length >= 10 &&
    emailRegex.test(email.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    const newLead: LeadSubmission = {
      id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: property ? property.id : 'general-inquiry',
      propertyTitle: property ? property.title : 'General Portfolio Inquiry',
      buyerName: buyerName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      preferredTime: message.trim()
        ? `Message: ${message.trim().slice(0, 150)}${preferredTime ? ` | Time: ${preferredTime}` : ''}`
        : (preferredTime ? `Time: ${preferredTime}` : 'Direct Property Inquiry'),
      timestamp: new Date().toLocaleString(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    onLeadSubmitted(newLead);
    setSubmitted(true);

    // Connect to WhatsApp with sender details
    try {
      const waText = encodeURIComponent(
        `🏰 *Royal Agra Estate — Property Inquiry*\n\n` +
        `👤 *Client:* ${newLead.buyerName}\n` +
        `📱 *Mobile:* ${newLead.phone}\n` +
        `📧 *Email:* ${newLead.email}\n` +
        `📍 *Property:* ${newLead.propertyTitle} (ID: #${newLead.propertyId})\n` +
        (message.trim() ? `💬 *Requirements:* ${message.trim()}\n` : '') +
        (preferredTime ? `🗓️ *Preferred Slot:* ${preferredTime}\n` : '') +
        `\nHello Royal Agra Estate, I would like more details on this property.`
      );
      window.open(`https://wa.me/919149079913?text=${waText}`, '_blank');
    } catch {}

    setTimeout(() => {
      setSubmitted(false);
      setIsSubmitting(false);
      if (!user) {
        setBuyerName('');
        setPhone('');
        setEmail('');
      }
      setMessage('');
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
                Thank you, <strong>{buyerName}</strong>! Your inquiry with mobile <strong>{phone}</strong> has been received. Our advisory desk will reach out shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {user && (
                <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Autofilled details from your <strong>{user.name}</strong> account.</span>
                </div>
              )}

              <div>
                <label htmlFor="lead-buyer-name" className="block text-xs font-bold text-gray-700 uppercase mb-1 cursor-pointer">
                  Full Name <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    id="lead-buyer-name"
                    name="name"
                    autoComplete="name"
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
                <label htmlFor="lead-buyer-phone" className="block text-xs font-bold text-gray-700 uppercase mb-1 cursor-pointer">
                  Phone / WhatsApp Number <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    id="lead-buyer-phone"
                    name="phone"
                    autoComplete="tel"
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
                <label htmlFor="lead-buyer-email" className="block text-xs font-bold text-gray-700 uppercase mb-1 cursor-pointer">
                  Email Address <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    id="lead-buyer-email"
                    name="email"
                    autoComplete="email"
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
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="lead-buyer-message" className="block text-xs font-bold text-gray-700 uppercase cursor-pointer">
                    Specific Requirements / Message
                  </label>
                  <span className="text-[11px] text-gray-400 font-medium">Optional (leave blank if preferred)</span>
                </div>
                <textarea
                  id="lead-buyer-message"
                  name="message"
                  rows={2}
                  placeholder="Mention preferred localities, budget, or questions (optional)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="lead-preferred-time" className="block text-xs font-bold text-gray-700 uppercase cursor-pointer">
                    Preferred Visit Time
                  </label>
                  <span className="text-[11px] text-gray-400 font-medium">Optional</span>
                </div>
                <div className="relative">
                  <input
                    id="lead-preferred-time"
                    name="preferredTime"
                    type="datetime-local"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Strict confidentiality guaranteed for all HNI buyers</span>
              </div>

              <button
                type="submit"
                id="submit-lead-inquiry-btn"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  !isFormValid || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 shadow-none'
                    : 'bg-[#0F382C] hover:bg-[#164E3D] text-white cursor-pointer shadow-md hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    <span>Submit Inquiry & Connect</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
