import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Clock, Send, CheckCircle2, Landmark, Compass, AlertTriangle, Loader2 } from 'lucide-react';
import { saveFirestoreLead } from '../services/firebaseService';
import { LeadSubmission } from '../utils/security';
import { trackWhatsAppClick, trackPhoneClick } from '../utils/analytics';
import { UserProfile } from '../types';

interface ContactScreenProps {
  user?: UserProfile | null;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [service, setService] = useState('Luxury Property Search');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync / Autofill if user profile loads or updates
  useEffect(() => {
    if (user) {
      if (!name && user.name) setName(user.name);
      if (!email && user.email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFormValid =
    name.trim().length >= 2 &&
    cleanPhone.length >= 10 &&
    emailRegex.test(email.trim()) &&
    service.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation: Name, 10-digit phone, valid email, and purpose are mandatory; Message is optional
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Phone or WhatsApp number.');
      return;
    }

    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    if (!service.trim()) {
      setErrorMessage('Please select an inquiry purpose.');
      return;
    }

    try {
      setIsSubmitting(true);
      const contactLead: LeadSubmission = {
        id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
        propertyId: 'contact-desk',
        propertyTitle: service ? `Concierge: ${service}` : 'Concierge Desk Inquiry',
        buyerName: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        preferredTime: message.trim() ? `Requirements: ${message.trim().slice(0, 150)}` : 'Direct Advisory Consultation',
        timestamp: new Date().toLocaleString()
      };

      await saveFirestoreLead(contactLead);
      setSent(true);
      if (!user) {
        setName('');
        setEmail('');
        setPhone('');
      }
      setMessage('');
      setService('Luxury Property Search');
      setTimeout(() => {
        setSent(false);
      }, 5000);
    } catch (err) {
      console.error('Failed to submit contact request:', err);
      setErrorMessage('Failed to send request. Please check your internet connection or try WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F382C]/10 text-[#0F382C] text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-[#0F382C]" />
            <span>Private Concierge Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#0F382C]">
            Connect With Our Agra Advisory
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Schedule a confidential consultation, request a private architectural chauffeur tour, or discuss bespoke estate acquisitions in Agra.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Col: Contact Info & Direct Concierge Desk (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#0F382C] text-white p-6 sm:p-8 rounded-2xl border border-[#164E3D] shadow-lg space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#164E3D]">
                <div className="w-10 h-10 rounded-lg bg-[#E4D5B7] flex items-center justify-center text-[#0F382C]">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-brand-title font-bold text-lg text-white">Royal Agra Estate</h3>
                  <span className="text-xs text-[#E4D5B7]">Managed by Shrey Gupta & Abhishek Singh Jadon</span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#C5A869] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Co-Owner Direct Lines:</strong>
                    <div className="flex flex-col gap-1 mt-1">
                      <a href="tel:+919149079913" onClick={() => trackPhoneClick()} className="text-gray-300 hover:text-white underline">
                        Shrey Gupta (+91 9149079913)
                      </a>
                      <a href="tel:+919557138449" onClick={() => trackPhoneClick()} className="text-gray-300 hover:text-white underline">
                        Abhishek Singh Jadon (+91 9557138449)
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C5A869] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Confidential Desk:</strong>
                    <a href="mailto:concierge@royalagraestate.in" className="text-gray-300 hover:text-white underline">
                      concierge@royalagraestate.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C5A869] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Advisory Hours:</strong>
                    <span className="text-gray-300">
                      Mon – Sat: 9:30 AM – 7:30 PM (IST)<br />
                      Sunday Site Visits by Prior Appointment
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#164E3D]">
                <a
                  href="https://wa.me/919149079913?text=Hello%20Royal%20Agra%20Estate,%20I%20would%20like%20to%20inquire%20about%20luxury%20properties."
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackWhatsAppClick('Contact Screen Concierge')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Direct WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Clear Title Advisory Guarantee */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs text-xs text-gray-600 space-y-1">
              <span className="font-bold text-[#0F382C] block">Clear-Title Assurance</span>
              <p>All portfolio transactions undergo strict 30-year chain title searches, municipal mutation verification, and clean deed execution.</p>
            </div>

          </div>

          {/* Right Col: Consultation Booking Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200/80 shadow-md">
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F382C] mb-2">
                Book a Private Consultation
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-6">
                Please complete the form below. A Senior Portfolio Partner will contact you within 2 hours.
              </p>

              {sent ? (
                <div className="p-8 bg-emerald-50 text-emerald-900 rounded-xl text-center border border-emerald-200 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-serif-luxury font-bold">Consultation Booked Successfully</h3>
                  <p className="text-xs text-emerald-800">
                    Our Senior Advisory desk has received your request and will reach out to you promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {user && (
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Autofilled contact details from your <strong>{user.name}</strong> account.</span>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="font-medium">{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-full-name" className="block text-xs font-bold text-gray-700 uppercase mb-1 cursor-pointer">
                        Your Full Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        id="contact-full-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="e.g. Seth Shanti Prasad"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className="w-full p-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#0F382C]"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-bold text-gray-700 uppercase mb-1 cursor-pointer">
                        Phone / WhatsApp <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className="w-full p-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#0F382C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold text-gray-700 uppercase mb-1 cursor-pointer">
                        Email Address <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="vip@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className="w-full p-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#0F382C]"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-purpose" className="block text-xs font-bold text-gray-700 uppercase mb-1 cursor-pointer">
                        Inquiry Purpose <span className="text-red-500 font-bold">*</span>
                      </label>
                      <select
                        id="contact-purpose"
                        name="service"
                        required
                        value={service}
                        onChange={(e) => {
                          setService(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className="w-full p-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#0F382C]"
                      >
                        <option value="Luxury Property Search">Buying a Luxury Villa / Home</option>
                        <option value="Post Property Listing">Selling / Leasing My Estate</option>
                        <option value="Chauffeur Site Visit">Booking a Private Site Tour</option>
                        <option value="Legal & Title Check">Clear Legal Title & Registry Check</option>
                        <option value="NRI Advisory">NRI Investment Portfolio</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="contact-message" className="block text-xs font-bold text-gray-700 uppercase cursor-pointer">
                        Specific Requirements / Message
                      </label>
                      <span className="text-[11px] text-gray-400 font-medium">Optional (leave blank if preferred)</span>
                    </div>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={3}
                      placeholder="Please mention preferred Agra localities (e.g. Fatehabad Rd, Dayalbagh), budget, or questions (optional)..."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      className="w-full p-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#0F382C]"
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-contact-form-btn"
                    disabled={!isFormValid || isSubmitting}
                    className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      !isFormValid || isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 shadow-none'
                        : 'bg-[#0F382C] hover:bg-[#164E3D] text-white cursor-pointer shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Consultation Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
