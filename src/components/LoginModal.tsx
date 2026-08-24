import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { ADMIN_CREDENTIALS } from '../utils/security';
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
  Sparkles,
  KeyRound,
  Compass,
  MapPin,
  Briefcase,
  HelpCircle
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
  initialRole?: 'buyer' | 'owner';
  promptMessage?: string;
}

const SECURITY_QUESTIONS = [
  'What is your favorite Agra monument?',
  'What was your first car or bike model?',
  'What is your mother maiden name?',
  'What city were you born in?'
];

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  initialRole = 'buyer',
  promptMessage
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [role, setRole] = useState<'buyer' | 'owner'>(initialRole);
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Sign up fields (1. Name/Phone at top, 2. Security Q&A in middle, 3. Email/Password/Confirm at bottom)
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupSecurityQuestion, setSignupSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [signupSecurityAnswer, setSignupSecurityAnswer] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupInterest, setSignupInterest] = useState('Buying');
  const [signupBudgetType, setSignupBudgetType] = useState('');
  const [signupCurrentAddress, setSignupCurrentAddress] = useState('');
  const [signupDob, setSignupDob] = useState('');
  const [signupProfession, setSignupProfession] = useState('');
  
  // Forgot Password fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotAnswer, setForgotAnswer] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);

  // Errors & Success
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setAuthMode(initialMode);
    setRole(initialRole);
    setAuthError('');
    setSuccessMsg('');
    setForgotStep(1);
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

    // Check default admin accounts
    const foundAdmin = ADMIN_CREDENTIALS.find(
      adm => (adm.email.toLowerCase() === identifier || adm.phone === identifier) && adm.password === enteredPassword
    );
    if (foundAdmin) {
      const adminUserProfile: UserProfile = {
        id: foundAdmin.id,
        name: foundAdmin.name,
        email: foundAdmin.email,
        phone: foundAdmin.phone,
        role: 'admin',
        avatar: foundAdmin.email.includes('shrey')
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        memberSince: '2023',
        preferredLocality: 'Fatehabad Road, Agra'
      };
      onLoginSuccess(adminUserProfile);
      onClose();
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
        onLoginSuccess(userToAuth);
        onClose();
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
      onLoginSuccess(demoUser);
      onClose();
      return;
    }

    setAuthError('Account not found with this email/mobile. Please sign up to create a new account.');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!signupName || !signupPhone || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match');
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
      name: signupName.trim(),
      phone: signupPhone.trim(),
      email: emailFormatted,
      password: signupPassword.trim(),
      securityQuestion: signupSecurityQuestion,
      securityAnswer: signupSecurityAnswer.trim().toLowerCase(),
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

    onLoginSuccess(newUserProfile);
    onClose();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    let savedAccounts: any[] = [];
    try {
      const stored = localStorage.getItem('royal_agra_accounts_v1');
      if (stored) savedAccounts = JSON.parse(stored);
    } catch {
      savedAccounts = [];
    }

    const emailF = forgotEmail.trim().toLowerCase();
    const account = savedAccounts.find((acc: any) => acc.email && acc.email.toLowerCase() === emailF);

    if (!account) {
      setAuthError('No account found with this email address.');
      return;
    }

    if (forgotStep === 1) {
      if (!forgotAnswer || forgotAnswer.trim().toLowerCase() !== (account.securityAnswer || '')) {
        setAuthError('Incorrect security question answer.');
        return;
      }
      setForgotStep(2);
      return;
    }

    if (forgotStep === 2) {
      if (!forgotNewPassword) {
        setAuthError('Please enter a new password.');
        return;
      }
      account.password = forgotNewPassword.trim();
      try {
        localStorage.setItem('royal_agra_accounts_v1', JSON.stringify(savedAccounts));
      } catch {}
      setSuccessMsg('Password reset successfully! You can now log in.');
      setTimeout(() => {
        setAuthMode('login');
        setSuccessMsg('');
        setForgotStep(1);
      }, 2000);
    }
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
        {promptMessage && authMode !== 'forgot' && (
          <div className="bg-[#FAF8F5] border-b border-[#E4D5B7]/50 px-6 py-2.5 flex items-center gap-2 text-xs text-[#0F382C] font-medium">
            <Sparkles className="w-4 h-4 text-[#C5A869] shrink-0" />
            <span>{promptMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          
          {/* Tab Switcher: Log In vs Create Account */}
          {authMode !== 'forgot' && (
            <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
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
          )}

          {/* Role Selection */}
          {authMode !== 'forgot' && (
            <div className="mb-5">
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
          )}

          {/* Error Alert */}
          {authError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs font-medium">
              {authError}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
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
                    placeholder="shrey123@gmail.com or +91 9149079913"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setAuthError('');
                      setForgotStep(1);
                    }}
                    className="text-[11px] text-[#0F382C] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
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
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 max-h-[385px] overflow-y-auto pr-1">
              
              {/* 1. Full Name & Phone Number at the top */}
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
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+91 9149079913"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* 2. Security Question dropdown & Answer field in the middle */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Security Question (For Password Recovery)
                </label>
                <div className="relative">
                  <select
                    value={signupSecurityQuestion}
                    onChange={(e) => setSignupSecurityQuestion(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  >
                    {SECURITY_QUESTIONS.map((q, idx) => (
                      <option key={idx} value={q}>{q}</option>
                    ))}
                  </select>
                  <HelpCircle className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Security Answer
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taj Mahal"
                  value={signupSecurityAnswer}
                  onChange={(e) => setSignupSecurityAnswer(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                />
              </div>

              {/* Additional optional fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Primary Interest</label>
                  <select
                    value={signupInterest}
                    onChange={(e) => setSignupInterest(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  >
                    <option value="Buying">Buying / Investing</option>
                    <option value="Selling/Listing">Selling Property</option>
                    <option value="Renting">Renting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Target Budget</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹2.5 Cr+"
                    value={signupBudgetType}
                    onChange={(e) => setSignupBudgetType(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>
              </div>

              {/* 3. Email, Password, and Confirm Password fields at the very bottom */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
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
                      placeholder="Create password"
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        if (authError === 'Passwords do not match') setAuthError('');
                      }}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Confirm password"
                      value={signupConfirmPassword}
                      onChange={(e) => {
                        setSignupConfirmPassword(e.target.value);
                        if (authError === 'Passwords do not match') setAuthError('');
                      }}
                      className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border rounded-lg text-gray-900 focus:bg-white ${
                        signupConfirmPassword && signupPassword !== signupConfirmPassword
                          ? 'border-red-500 bg-red-50/30'
                          : 'border-gray-200 focus:border-[#0F382C]'
                      }`}
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  {signupConfirmPassword && signupPassword !== signupConfirmPassword && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">Passwords do not match</p>
                  )}
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

          {/* FORGOT PASSWORD FORM */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="text-center mb-2">
                <h4 className="text-sm font-bold text-[#0F382C]">Password Recovery</h4>
                <p className="text-xs text-gray-500">Verify your registered email and security answer.</p>
              </div>

              {forgotStep === 1 ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Registered Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. shrey123@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Security Question Answer</label>
                    <input
                      type="text"
                      required
                      placeholder="Answer provided during signup"
                      value={forgotAnswer}
                      onChange={(e) => setForgotAnswer(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0F382C] text-white rounded-lg font-bold text-xs uppercase tracking-wider"
                  >
                    Verify Security Answer
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter new password"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0F382C] text-white rounded-lg font-bold text-xs uppercase tracking-wider"
                  >
                    Reset Password
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className="text-xs text-gray-500 hover:text-[#0F382C] underline block mx-auto mt-2"
              >
                Back to Login
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
