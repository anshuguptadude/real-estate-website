import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  X, 
  Landmark, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Phone, 
  Mail, 
  User, 
  Building,
  Sparkles,
  KeyRound,
  Compass,
  MapPin,
  Briefcase
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
  initialRole?: 'buyer' | 'owner';
  promptMessage?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  initialRole = 'buyer',
  promptMessage
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'buyer' | 'owner'>(initialRole);
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Sign up fields
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupInterest, setSignupInterest] = useState('Buying');
  const [signupBudgetType, setSignupBudgetType] = useState('');
  const [signupCurrentAddress, setSignupCurrentAddress] = useState('');
  const [signupDob, setSignupDob] = useState('');
  const [signupProfession, setSignupProfession] = useState('');
  
  // Errors & Flow steps
  const [authError, setAuthError] = useState('');
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otp, setOtp] = useState(['5', '8', '2', '1']);
  const [activeUserTemp, setActiveUserTemp] = useState<UserProfile | null>(null);

  useEffect(() => {
    setAuthMode(initialMode);
    setRole(initialRole);
    setStep('form');
    setAuthError('');
  }, [initialMode, initialRole, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const identifier = loginIdentifier.trim().toLowerCase();
    const enteredPassword = loginPassword.trim();

    if (!identifier || !enteredPassword) {
      setAuthError('Please enter both email/mobile and password.');
      return;
    }

    // Retrieve saved accounts from localStorage
    let savedAccounts: any[] = [];
    try {
      const stored = localStorage.getItem('royal_agra_accounts_v1');
      if (stored) savedAccounts = JSON.parse(stored);
    } catch {
      savedAccounts = [];
    }

    // Find account by email or phone
    const matchedAccount = savedAccounts.find(
      (acc: any) => (acc.email && acc.email.toLowerCase() === identifier) || acc.phone === identifier
    );

    if (matchedAccount) {
      if (matchedAccount.password === enteredPassword) {
        const userToAuth: UserProfile = {
          id: matchedAccount.id,
          name: matchedAccount.name,
          email: matchedAccount.email,
          phone: matchedAccount.phone,
          role: matchedAccount.role || role,
          avatar: matchedAccount.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          memberSince: matchedAccount.memberSince || '2024',
          preferredLocality: matchedAccount.preferredLocality || 'Agra'
        };
        setActiveUserTemp(userToAuth);
        setStep('otp');
        return;
      } else {
        setAuthError('Incorrect password. Please try again.');
        return;
      }
    }

    // Check demo accounts as fallback
    if (identifier === 'shrey@royalagraestate.in' || identifier === '+91 91490 79913') {
      const demoUser: UserProfile = {
        id: 'RAE-OWNER-01',
        name: 'Shrey Gupta',
        email: 'shrey@royalagraestate.in',
        phone: '+91 91490 79913',
        role: role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        memberSince: '2023',
        preferredLocality: 'Fatehabad Road, Agra'
      };
      setActiveUserTemp(demoUser);
      setStep('otp');
      return;
    }

    setAuthError('Account not found with this email/mobile. Please sign up to create a new account.');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!signupEmail || !signupPassword) {
      setAuthError('Please fill in your Email and Create a Password.');
      return;
    }

    const emailFormatted = signupEmail.trim().toLowerCase();

    // Retrieve saved accounts from localStorage
    let savedAccounts: any[] = [];
    try {
      const stored = localStorage.getItem('royal_agra_accounts_v1');
      if (stored) savedAccounts = JSON.parse(stored);
    } catch {
      savedAccounts = [];
    }

    // Check if account already exists
    const exists = savedAccounts.some((acc: any) => acc.email && acc.email.toLowerCase() === emailFormatted);
    if (exists) {
      setAuthError('An account with this email already exists. Please log in.');
      return;
    }

    const newUserAccount = {
      id: `RAE-${Math.floor(1000 + Math.random() * 9000)}`,
      name: signupName.trim() || 'Distinguished Member',
      phone: signupPhone.trim() || '+91 91490 79913',
      email: emailFormatted,
      password: signupPassword.trim(),
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      memberSince: new Date().getFullYear().toString(),
      preferredLocality: 'Taj Ganj, Agra',
      primaryInterest: signupInterest,
      preferredBudget: signupBudgetType.trim(),
      address: signupCurrentAddress.trim(),
      dob: signupDob,
      profession: signupProfession.trim()
    };

    savedAccounts.push(newUserAccount);
    try {
      localStorage.setItem('royal_agra_accounts_v1', JSON.stringify(savedAccounts));
    } catch {
      // ignore
    }

    const newUserProfile: UserProfile = {
      id: newUserAccount.id,
      name: newUserAccount.name,
      email: newUserAccount.email,
      phone: newUserAccount.phone,
      role: newUserAccount.role,
      avatar: newUserAccount.avatar,
      memberSince: newUserAccount.memberSince,
      preferredLocality: newUserAccount.preferredLocality,
      primaryInterest: newUserAccount.primaryInterest,
      preferredBudget: newUserAccount.preferredBudget,
      address: newUserAccount.address,
      dob: newUserAccount.dob,
      profession: newUserAccount.profession
    };

    setActiveUserTemp(newUserProfile);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    setTimeout(() => {
      if (activeUserTemp) {
        onLoginSuccess(activeUserTemp);
      }
      onClose();
      setStep('form');
    }, 1500);
  };

  const handleQuickDemoLogin = (targetRole: 'buyer' | 'owner') => {
    const demoUser: UserProfile = {
      id: targetRole === 'owner' ? 'RAE-OWNER-01' : 'RAE-BUYER-01',
      name: targetRole === 'owner' ? 'Shrey Gupta (Property Owner)' : 'Vikram Sharma (Premium Buyer)',
      phone: targetRole === 'owner' ? '+91 91490 79913' : '+91 95571 38449',
      email: targetRole === 'owner' ? 'shrey@royalagraestate.in' : 'vikram.investments@agravip.in',
      role: targetRole,
      avatar: targetRole === 'owner'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      memberSince: '2023',
      preferredLocality: 'Fatehabad Road, Agra'
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative my-6">
        
        {/* Header with Emerald background */}
        <div className="bg-[#0F382C] text-white p-6 text-center relative border-b border-[#164E3D]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-[#164E3D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-xl bg-[#E4D5B7] text-[#0F382C] flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="font-brand-title font-bold text-xl text-white">
            Royal Agra Estate
          </h3>
          <p className="text-xs text-[#E4D5B7] mt-0.5">
            Client & Property Owner Portal
          </p>
        </div>

        {/* Prompt Notice if redirected from Post Property or restricted action */}
        {promptMessage && step === 'form' && (
          <div className="bg-[#FAF8F5] border-b border-[#E4D5B7]/50 px-6 py-2.5 flex items-center gap-2 text-xs text-[#0F382C] font-medium">
            <Sparkles className="w-4 h-4 text-[#C5A869] shrink-0" />
            <span>{promptMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          
          {step === 'form' && (
            <div className="space-y-5">
              
              {/* Tab Switcher: Log In vs Create Account */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  id="tab-auth-login"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'login' 
                      ? 'bg-[#0F382C] text-white shadow-xs' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  id="tab-auth-signup"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'signup' 
                      ? 'bg-[#0F382C] text-white shadow-xs' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Create Account / Sign Up
                </button>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all text-center ${
                      role === 'buyer'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-1 ring-emerald-500/20'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Buyer / Investor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all text-center ${
                      role === 'owner'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-1 ring-emerald-500/20'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Property Owner / Seller
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs font-medium">
                  {authError}
                </div>
              )}

              {/* LOG IN FORM */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Mobile Number or Email
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="shrey@royalagraestate.in or +91 91490 79913"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Secure encrypted authentication</span>
                  </div>

                  <button
                    type="submit"
                    id="submit-login-btn"
                    className="w-full py-3 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* SIGN UP FORM */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shrey Gupta"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                      />
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                        placeholder="shrey@royalagraestate.in"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Create Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Create a secure password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="+91 91490 79913"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                      />
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Primary Interest */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Primary Interest
                    </label>
                    <select
                      value={signupInterest}
                      onChange={(e) => setSignupInterest(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                    >
                      <option value="Buying">Buying / Investing</option>
                      <option value="Selling/Listing">Selling / Listing Property</option>
                      <option value="Renting">Renting</option>
                    </select>
                  </div>

                  {/* Preferred Budget / Property Type */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Preferred Budget & Property Type
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹2.5 Cr+ Gated Villa"
                        value={signupBudgetType}
                        onChange={(e) => setSignupBudgetType(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                      />
                      <Compass className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Current Living Address */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Address Living In
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dayalbagh, Agra"
                        value={signupCurrentAddress}
                        onChange={(e) => setSignupCurrentAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                      />
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      value={signupDob}
                      onChange={(e) => setSignupDob(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                    />
                  </div>

                  {/* Profession / Earning occupation */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Profession / Occupation
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Medical Consultant"
                        value={signupProfession}
                        onChange={(e) => setSignupProfession(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                      />
                      <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="submit-signup-btn"
                    className="w-full py-3 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 shrink-0"
                  >
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          )}

          {/* OTP STEP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-800 font-serif-luxury">
                  Enter 4-Digit Security Code
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Sent to {activeUserTemp?.phone || activeUserTemp?.email || '+91 91490 79913'}
                </p>
              </div>

              <div className="flex justify-center gap-3 my-4">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={otp[idx]}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                      if (e.target.value && idx < 3) {
                        const nextInput = document.getElementById(`otp-input-${idx + 1}`);
                        nextInput?.focus();
                      }
                    }}
                    id={`otp-input-${idx}`}
                    className="w-12 h-12 text-center text-lg font-bold bg-gray-50 border border-gray-300 rounded-xl focus:border-[#0F382C] focus:bg-white text-gray-900"
                  />
                ))}
              </div>

              <button
                type="submit"
                id="verify-otp-btn"
                className="w-full py-3 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                Verify & Enter Royal Agra Estate
              </button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-xs text-gray-500 hover:text-[#0F382C] underline block mx-auto mt-2"
              >
                Change details or re-send OTP
              </button>
            </form>
          )}

          {/* SUCCESS STEP */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-serif-luxury font-bold text-[#0F382C]">
                Authentication Verified
              </h4>
              <p className="text-xs text-gray-600">
                Welcome, <strong>{activeUserTemp?.name}</strong>! Access granted to your Portfolio & Dashboard.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
