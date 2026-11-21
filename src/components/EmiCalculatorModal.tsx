import React, { useState, useEffect } from 'react';
import { X, Calculator, IndianRupee, PieChart, ShieldCheck, Building2, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { LeadSubmission } from '../utils/security';
import { saveFirestoreLead } from '../services/firebaseService';

interface EmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
  user?: UserProfile | null;
  onLeadSubmitted?: (lead: LeadSubmission) => void;
}

export const EmiCalculatorModal: React.FC<EmiCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialPrice = 28500000,
  user,
  onLeadSubmitted
}) => {
  const [loanAmount, setLoanAmount] = useState<number>(Math.round(initialPrice * 0.8));
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  // Home Loan Lead Capture Form State
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone ? user.phone.replace(/[^0-9]/g, '').slice(-10) : '');
  const [email, setEmail] = useState(user?.email || '');
  const [preferredBank, setPreferredBank] = useState('SBI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastWaUrl, setLastWaUrl] = useState('');

  useEffect(() => {
    if (initialPrice) {
      setLoanAmount(Math.round(initialPrice * 0.8));
    }
  }, [initialPrice, isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (user?.name) setFullName(user.name);
      if (user?.phone) setPhone(user.phone.replace(/[^0-9]/g, '').slice(-10));
      if (user?.email) setEmail(user.email);
      setErrorMessage('');
      setSubmittedSuccess(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = Math.max(1, tenureYears * 12);
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const emi = monthlyRate > 0 && factor > 1
    ? Math.round((loanAmount * monthlyRate * factor) / (factor - 1))
    : Math.round(loanAmount / totalMonths);

  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = phone.replace(/[^0-9]/g, '');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }
    if (fullName.toLowerCase().includes('prospective buyer')) {
      setErrorMessage('Please enter your genuine legal name for banking pre-approval.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number starting with 6-9.');
      return;
    }
    if (cleanPhone.endsWith('9149079913') || cleanPhone.endsWith('9557138449')) {
      setErrorMessage('Please enter your own personal mobile number for loan pre-approval.');
      return;
    }

    try {
      setIsSubmitting(true);
      const leadId = `LEAD-${Date.now()}`;
      const loanCr = ((loanAmount || 0) / 10000000).toFixed(2);
      const formattedLoan = (loanAmount || 0) >= 10000000
        ? `₹${loanCr} Cr`
        : `₹${(((loanAmount || 0) / 100000)).toFixed(2)} Lacs`;
      const formattedEmi = isNaN(emi) ? '0' : emi.toLocaleString('en-IN');
      const cleanEmail = email.trim().toLowerCase();

      const lead: LeadSubmission = {
        id: leadId,
        propertyId: 'home-loan-dsa',
        propertyTitle: `Home Loan Pre-Approval: ${preferredBank} (${formattedLoan})`,
        buyerName: fullName.trim(),
        phone: cleanPhone,
        email: cleanEmail,
        preferredTime: `Pre-Approved Loan: ${preferredBank} | Loan: ${formattedLoan} | EMI: ₹${formattedEmi}/mo | Tenure: ${tenureYears} Yrs`,
        timestamp: new Date().toLocaleString(),
        createdAt: new Date().toISOString(),
        status: 'new',
        inquiryType: 'Home Loan Assistance',
        loanAmount,
        tenureYears,
        interestRate,
        calculatedEmi: emi,
        preferredBank
      };

      // Prepare WhatsApp concierge URL
      const waText = encodeURIComponent(
        `🏦 *Royal Agra Estate — Home Loan Pre-Approval Application*\n\n` +
        `👤 *Applicant:* ${lead.buyerName}\n` +
        `📱 *Mobile:* ${lead.phone}\n` +
        (lead.email ? `📧 *Email:* ${lead.email}\n` : '') +
        `🏛️ *Preferred Bank:* ${preferredBank}\n` +
        `💰 *Loan Amount:* ${formattedLoan} (₹${(loanAmount || 0).toLocaleString('en-IN')})\n` +
        `📊 *Tenure:* ${tenureYears} Years (${totalMonths} Months)\n` +
        `📈 *Interest Rate:* ${interestRate}% p.a.\n` +
        `💳 *Estimated Monthly EMI:* ₹${formattedEmi} / month\n\n` +
        `Hello Royal Agra Estate Advisory Desk, I have applied for home loan pre-approval. Please assist with my application.`
      );
      const waUrl = `https://wa.me/919149079913?text=${waText}`;
      setLastWaUrl(waUrl);

      // Open WhatsApp synchronously within user interaction tick to prevent browser popup blockers
      try {
        window.open(waUrl, '_blank');
      } catch (err) {
        console.warn('Failed to open WhatsApp window:', err);
      }

      // Persist lead directly to Hostinger API without duplicating requests
      if (onLeadSubmitted) {
        onLeadSubmitted(lead);
      } else {
        await saveFirestoreLead(lead);
      }

      setSubmittedSuccess(true);
    } catch (err) {
      console.error('Failed to submit loan lead:', err);
      setErrorMessage('Failed to submit application. Please check connection or contact WhatsApp desk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-100 relative">
        
        {/* Header */}
        <div className="bg-[#0F382C] text-white p-5 flex items-center justify-between border-b border-[#164E3D] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#E4D5B7]" />
            <h3 className="font-serif-luxury font-bold text-lg text-white">
              Agra Luxury Home Loan EMI Calculator
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-[#164E3D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="space-y-4">
            
            {/* Loan Amount Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Loan Amount</span>
                <span className="font-mono text-[#0F382C] text-sm font-extrabold">
                  {(loanAmount || 0) >= 10000000 ? `₹${((loanAmount || 0) / 10000000).toFixed(2)} Cr` : `₹${(((loanAmount || 0) / 100000)).toFixed(2)} Lacs`} (₹{(loanAmount || 0).toLocaleString('en-IN')})
                </span>
              </div>
              <input
                id="emi-loan-amount"
                name="loanAmount"
                aria-label="Loan Amount in Rupees"
                type="range"
                min="500000"
                max={Math.max(100000000, loanAmount || 0)}
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-[#0F382C] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>₹5 Lacs</span>
                <span>₹5.00 Cr</span>
                <span>₹{Math.max(10, Math.ceil((loanAmount || 0) / 10000000)).toFixed(2)} Cr</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Interest Rate (% per annum)</span>
                <span className="font-mono text-[#0F382C] text-sm font-extrabold">
                  {interestRate}% p.a.
                </span>
              </div>
              <input
                id="emi-interest-rate"
                name="interestRate"
                aria-label="Interest Rate Percentage"
                type="range"
                min="6.5"
                max="12.0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#0F382C] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>6.5%</span>
                <span>9.0%</span>
                <span>12.0%</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Loan Tenure (Years)</span>
                <span className="font-mono text-[#0F382C] text-sm font-extrabold">
                  {tenureYears} Years ({totalMonths} Months)
                </span>
              </div>
              <input
                id="emi-tenure-years"
                name="tenureYears"
                aria-label="Loan Tenure in Years"
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-[#0F382C] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>1 Yr</span>
                <span>15 Yrs</span>
                <span>30 Yrs</span>
              </div>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="bg-[#FAF8F5] p-5 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">Monthly EMI</span>
              <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F382C] font-mono block mt-1">
                ₹{isNaN(emi) ? 0 : emi.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-gray-400">per month</span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">Total Interest</span>
              <span className="text-sm font-bold text-amber-900 font-mono block mt-1.5">
                ₹{isNaN(totalInterest) ? 0 : totalInterest.toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">Total Payable</span>
              <span className="text-sm font-bold text-gray-900 font-mono block mt-1.5">
                ₹{isNaN(totalPayment) ? 0 : totalPayment.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Home Loan Pre-Approval Lead Capture Section */}
          {submittedSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3 animate-fadeIn">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-luxury font-bold text-base text-[#0F382C]">
                  Home Loan Pre-Approval Submitted!
                </h4>
                <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                  Thank you, <span className="font-bold text-gray-900">{fullName}</span>. Your pre-approval inquiry for <span className="font-bold text-emerald-800">{(loanAmount || 0) >= 10000000 ? `₹${((loanAmount || 0) / 10000000).toFixed(2)} Cr` : `₹${(((loanAmount || 0) / 100000)).toFixed(2)} Lacs`}</span> ({preferredBank}) has been securely recorded. Our banking advisory concierge has opened WhatsApp to finalize your documentation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {lastWaUrl && (
                  <a
                    href={lastWaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#25D366] hover:bg-[#1ebd54] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Connect on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedSuccess(false);
                    setShowLoanForm(false);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Calculate Another Loan
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2 bg-[#0F382C] text-white rounded-lg text-xs font-semibold hover:bg-[#164E3D]"
                >
                  Done
                </button>
              </div>
            </div>
          ) : showLoanForm ? (
            <div className="bg-[#FAF8F5] border border-[#0F382C]/20 rounded-xl p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0F382C]" />
                    <h4 className="font-serif-luxury font-bold text-sm text-[#0F382C]">
                      Apply for Pre-Approved Home Loan
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Fast-track mortgage sanction via Royal Agra Estate banking advisory desk
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoanForm(false);
                    setErrorMessage('');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-800 underline"
                >
                  Hide Form
                </button>
              </div>

              {/* Pre-filled Loan Highlights */}
              <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-gray-500 text-[10px] uppercase font-semibold block">Requested Loan</span>
                  <span className="font-mono font-bold text-[#0F382C]">
                    ₹{((loanAmount || 0) / 10000000).toFixed(2)} Cr
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase font-semibold block">Estimated Monthly EMI</span>
                  <span className="font-mono font-bold text-emerald-800">
                    ₹{isNaN(emi) ? 0 : emi.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase font-semibold block">Tenure</span>
                  <span className="font-mono font-bold text-gray-800">
                    {tenureYears} Yrs @ {interestRate}% p.a.
                  </span>
                </div>
              </div>

              <form onSubmit={handleLoanSubmit} className="space-y-3.5">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="loan-full-name" className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="loan-full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh Singhal"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F382C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="loan-phone" className="block text-xs font-semibold text-gray-700 mb-1">
                      WhatsApp / Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-gray-400 font-mono">+91</span>
                      <input
                        id="loan-phone"
                        type="tel"
                        required
                        maxLength={10}
                        value={phone.replace(/[^0-9]/g, '').slice(-10)}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F382C] font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="loan-email" className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="loan-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F382C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="loan-preferred-bank" className="block text-xs font-semibold text-gray-700 mb-1">
                      Preferred Lending Bank
                    </label>
                    <select
                      id="loan-preferred-bank"
                      value={preferredBank}
                      onChange={(e) => setPreferredBank(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F382C] bg-white"
                    >
                      <option value="SBI">State Bank of India (SBI) — from 8.50%</option>
                      <option value="HDFC">HDFC Bank — from 8.65%</option>
                      <option value="ICICI">ICICI Bank — from 8.70%</option>
                      <option value="Kotak">Kotak Mahindra Bank — from 8.75%</option>
                      <option value="Best Rate Available">Best Available Multi-Bank Offer</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Strict confidentiality guaranteed • Zero spam
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setShowLoanForm(false)}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="submit-loan-application-btn"
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#0F382C] hover:bg-[#164E3D] text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit & Connect on WhatsApp</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="pt-1">
              <button
                type="button"
                id="apply-home-loan-btn"
                onClick={() => setShowLoanForm(true)}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-[#0F382C] via-[#164E3D] to-[#0F382C] text-[#E4D5B7] font-serif-luxury font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 border border-[#C5A880]/40 group cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#E4D5B7] shrink-0" />
                <span>Apply for Pre-Approved Home Loan (Lowest ROI from 8.4%)</span>
                <ArrowRight className="w-4 h-4 text-[#E4D5B7] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-gray-500 mt-2 text-center">
                <span>⚡ 0% Processing Fee</span>
                <span>•</span>
                <span>SBI, HDFC, ICICI, Kotak Tie-ups</span>
                <span>•</span>
                <span>24h In-Principle Sanction</span>
              </div>
            </div>
          )}

          {/* Footer Bar */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Pre-approved bank tie-ups: SBI, HDFC, ICICI, Kotak
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#0F382C] text-white font-semibold rounded-lg text-xs hover:bg-[#164E3D]"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
