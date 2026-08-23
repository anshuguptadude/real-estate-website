import React, { useState, useEffect } from 'react';
import { X, Calculator, IndianRupee, PieChart, ShieldCheck } from 'lucide-react';

interface EmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
}

export const EmiCalculatorModal: React.FC<EmiCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialPrice = 28500000
}) => {
  const [loanAmount, setLoanAmount] = useState<number>(Math.round(initialPrice * 0.8));
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  useEffect(() => {
    if (initialPrice) {
      setLoanAmount(Math.round(initialPrice * 0.8));
    }
  }, [initialPrice, isOpen]);

  if (!isOpen) return null;

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative">
        
        {/* Header */}
        <div className="bg-[#0F382C] text-white p-5 flex items-center justify-between border-b border-[#164E3D]">
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
                  ₹{(loanAmount / 10000000).toFixed(2)} Cr (₹{loanAmount.toLocaleString('en-IN')})
                </span>
              </div>
              <input
                type="range"
                min="1000000"
                max="100000000"
                step="500000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-[#0F382C] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>₹10 Lacs</span>
                <span>₹5.00 Cr</span>
                <span>₹10.00 Cr</span>
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
                type="range"
                min="5"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-[#0F382C] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>5 Yrs</span>
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

          <div className="flex items-center justify-between text-xs text-gray-500">
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
