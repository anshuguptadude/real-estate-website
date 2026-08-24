import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Clock, Send, CheckCircle2, Landmark, Compass } from 'lucide-react';

export const ContactScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Luxury Property Search');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 4000);
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
          <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-[#0F382C] font-semibold">
            Royal Agra Estate – Managed by Shrey Gupta (+91 9149079913) & Abhishek Singh Jadon (+91 9557138449)
          </div>
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
                      <a href="tel:+919149079913" className="text-gray-300 hover:text-white underline">
                        Shrey Gupta (+91 9149079913)
                      </a>
                      <a href="tel:+919557138449" className="text-gray-300 hover:text-white underline">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Seth Shanti Prasad"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#0F382C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#0F382C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="vip@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#0F382C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Inquiry Purpose</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
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
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Specific Requirements / Message</label>
                    <textarea
                      rows={3}
                      placeholder="Please mention preferred Agra localities (e.g. Fatehabad Rd, Dayalbagh), budget, or questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#0F382C]"
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-contact-form-btn"
                    className="w-full py-3 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Consultation Request</span>
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
