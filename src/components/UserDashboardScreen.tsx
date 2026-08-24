import React, { useState } from 'react';
import { UserProfile, Property, UserDashboardTab } from '../types';
import { isAdmin, LeadSubmission } from '../utils/security';
import { 
  Building2, 
  User, 
  Heart, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Bed, 
  Bath, 
  Maximize, 
  Eye, 
  Camera, 
  Save,
  Clock,
  ArrowRight
} from 'lucide-react';

interface UserDashboardScreenProps {
  user: UserProfile | null;
  userProperties: Property[];
  savedProperties: Property[];
  leads?: LeadSubmission[];
  onUpdateProfile: (updated: UserProfile) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (propertyId: string) => void;
  onTogglePropertyStatus: (propertyId: string) => void;
  onViewProperty: (property: Property) => void;
  onNavigatePostProperty: () => void;
  onNavigateProperties: () => void;
  onLogout: () => void;
  onDeleteLead?: (leadId: string) => void;
  initialTab?: UserDashboardTab;
}

export const UserDashboardScreen: React.FC<UserDashboardScreenProps> = ({
  user,
  userProperties,
  savedProperties,
  leads,
  onUpdateProfile,
  onEditProperty,
  onDeleteProperty,
  onTogglePropertyStatus,
  onViewProperty,
  onNavigatePostProperty,
  onNavigateProperties,
  onLogout,
  onDeleteLead,
  initialTab = 'listings'
}) => {
  const [activeTab, setActiveTab] = useState<UserDashboardTab>(initialTab);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Profile form state
  const [name, setName] = useState(user?.name || 'Valued Client');
  const [phone, setPhone] = useState(user?.phone || '+91 91490 79913');
  const [email, setEmail] = useState(user?.email || 'client@royalagraestate.in');
  const [role, setRole] = useState<'buyer' | 'owner'>(user?.role || 'owner');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const [preferredLocality, setPreferredLocality] = useState(user?.preferredLocality || 'Fatehabad Road, Agra');
  const [primaryInterest, setPrimaryInterest] = useState(user?.primaryInterest || 'Buying');
  const [preferredBudget, setPreferredBudget] = useState(user?.preferredBudget || '');
  const [address, setAddress] = useState(user?.address || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [profession, setProfession] = useState(user?.profession || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Sync state with user when user changes
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
      setRole(user.role);
      setAvatar(user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
      setPreferredLocality(user.preferredLocality || 'Fatehabad Road, Agra');
      setPrimaryInterest(user.primaryInterest || 'Buying');
      setPreferredBudget(user.preferredBudget || '');
      setAddress(user.address || '');
      setDob(user.dob || '');
      setProfession(user.profession || '');
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      name,
      phone,
      email,
      role,
      avatar,
      preferredLocality,
      primaryInterest,
      preferredBudget,
      address,
      dob,
      profession
    };
    onUpdateProfile(updated);
    setProfileSuccessMsg(true);
    setTimeout(() => {
      setProfileSuccessMsg(false);
    }, 3000);
  };

  const activeCount = userProperties.filter(p => (p.status || 'Active') === 'Active').length;
  const soldCount = userProperties.filter(p => p.status === 'Sold' || p.status === 'Rented').length;

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Member Banner */}
        <div className="bg-gradient-to-r from-[#0F382C] via-[#0F382C] to-[#164E3D] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-[#164E3D] relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#C5A869]/15 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* Left: User Avatar & Greetings */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={user?.avatar || avatar}
                  alt={user?.name || 'User'}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#C5A869] shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#C5A869] text-[#0F382C] p-1 rounded-full text-[10px] font-bold shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white">
                    {user?.name || 'Client'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E4D5B7] text-[#0F382C] shadow-xs">
                    {isAdmin(user) ? 'Administrator & Co-Founder' : user?.role === 'owner' ? 'Property Owner / Seller' : 'Buyer / Investor'}
                  </span>
                </div>
                {isAdmin(user) && (
                  <p className="text-xs text-[#E4D5B7] font-semibold mt-1">
                    Royal Agra Estate - Managed by Shrey Gupta & Abhishek Singh Jadon
                  </p>
                )}
                <p className="text-xs text-gray-300 mt-1 flex items-center gap-3">
                  <span>ID: #{user?.id || 'RAE-Client'}</span>
                  <span>•</span>
                  <span>Member since {user?.memberSince || '2024'}</span>
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-300 mt-2">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#C5A869]" />
                    {user?.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#C5A869]" />
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons & Stats */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                id="dashboard-post-new-btn"
                onClick={onNavigatePostProperty}
                className="bg-white hover:bg-[#FAF8F5] text-[#0F382C] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#0F382C]" />
                <span>Post New Property</span>
              </button>
              
              <button
                type="button"
                id="dashboard-logout-btn"
                onClick={onLogout}
                className="bg-[#0B2B22] hover:bg-black/40 text-gray-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/20 transition-all"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="bg-[#0B2B22]/60 backdrop-blur-xs p-3.5 rounded-xl border border-white/5">
              <span className="text-[11px] uppercase tracking-wider text-gray-300 block">Total Listed</span>
              <span className="text-xl font-bold text-white font-serif-luxury mt-0.5 block">{userProperties.length}</span>
            </div>
            <div className="bg-[#0B2B22]/60 backdrop-blur-xs p-3.5 rounded-xl border border-white/5">
              <span className="text-[11px] uppercase tracking-wider text-gray-300 block">Active Live</span>
              <span className="text-xl font-bold text-emerald-400 font-serif-luxury mt-0.5 block">{activeCount}</span>
            </div>
            <div className="bg-[#0B2B22]/60 backdrop-blur-xs p-3.5 rounded-xl border border-white/5">
              <span className="text-[11px] uppercase tracking-wider text-gray-300 block">Sold / Rented</span>
              <span className="text-xl font-bold text-[#E4D5B7] font-serif-luxury mt-0.5 block">{soldCount}</span>
            </div>
            <div className="bg-[#0B2B22]/60 backdrop-blur-xs p-3.5 rounded-xl border border-white/5">
              <span className="text-[11px] uppercase tracking-wider text-gray-300 block">Saved Estates</span>
              <span className="text-xl font-bold text-rose-300 font-serif-luxury mt-0.5 block">{savedProperties.length}</span>
            </div>
          </div>

          {/* Detailed Lead Profile Metrics */}
          {(user?.profession || user?.preferredBudget || user?.primaryInterest || user?.address || user?.dob) ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
              {user.primaryInterest ? (
                <div className="p-2.5 bg-[#0B2B22]/40 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Lead Interest</span>
                  <span className="font-bold text-[#E4D5B7] mt-0.5 block">{user.primaryInterest}</span>
                </div>
              ) : null}
              {user.preferredBudget ? (
                <div className="p-2.5 bg-[#0B2B22]/40 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Target Budget</span>
                  <span className="font-bold text-[#E4D5B7] mt-0.5 block">{user.preferredBudget}</span>
                </div>
              ) : null}
              {user.profession ? (
                <div className="p-2.5 bg-[#0B2B22]/40 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Profession</span>
                  <span className="font-bold text-[#E4D5B7] mt-0.5 block">{user.profession}</span>
                </div>
              ) : null}
              {user.address ? (
                <div className="p-2.5 bg-[#0B2B22]/40 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Home Town</span>
                  <span className="font-bold text-[#E4D5B7] mt-0.5 block">{user.address}</span>
                </div>
              ) : null}
              {user.dob ? (
                <div className="p-2.5 bg-[#0B2B22]/40 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Date of Birth</span>
                  <span className="font-bold text-[#E4D5B7] mt-0.5 block">{user.dob}</span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
          <button
            type="button"
            id="tab-my-listings"
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'bg-[#0F382C] text-white shadow-md'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>My Listed Properties</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full ${
              activeTab === 'listings' ? 'bg-[#E4D5B7] text-[#0F382C]' : 'bg-gray-200 text-gray-700'
            }`}>
              {userProperties.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-profile-settings"
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#0F382C] text-white shadow-md'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

          <button
            type="button"
            id="tab-saved-estates"
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-[#0F382C] text-white shadow-md'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Estates</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full ${
              activeTab === 'saved' ? 'bg-[#E4D5B7] text-[#0F382C]' : 'bg-gray-200 text-gray-700'
            }`}>
              {savedProperties.length}
            </span>
          </button>

          {isAdmin(user) && (
            <button
              type="button"
              id="tab-admin-leads"
              onClick={() => setActiveTab('leads')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'leads'
                  ? 'bg-[#0F382C] text-white shadow-md'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Incoming Leads</span>
              <span className={`px-2 py-0.5 text-[10px] rounded-full ${
                activeTab === 'leads' ? 'bg-[#E4D5B7] text-[#0F382C]' : 'bg-gray-200 text-gray-700'
              }`}>
                {leads?.length || 0}
              </span>
            </button>
          )}
        </div>

        {/* TAB 1: My Listed Properties */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif-luxury font-bold text-[#0F382C]">
                  My Listed Properties ({userProperties.length})
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Manage live status, edit pricing/photos, or remove listings from the Royal Agra network.
                </p>
              </div>

              <button
                type="button"
                id="add-listing-cta-btn"
                onClick={onNavigatePostProperty}
                className="inline-flex items-center gap-2 bg-[#0F382C] hover:bg-[#164E3D] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Another Property</span>
              </button>
            </div>

            {userProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-[#0F382C] flex items-center justify-center mx-auto">
                  <Building2 className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-lg font-serif-luxury font-bold text-[#0F382C]">
                  You Haven't Listed Any Properties Yet
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  List your luxury villa, penthouse, apartment, or commercial plot to connect directly with verified buyers in Agra.
                </p>
                <button
                  type="button"
                  onClick={onNavigatePostProperty}
                  className="bg-[#0F382C] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#164E3D]"
                >
                  Create Your First Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProperties.map((prop) => {
                  const isSoldOrRented = prop.status === 'Sold' || prop.status === 'Rented';
                  return (
                    <div
                      key={prop.id}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      {/* Media container */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 group">
                        <img
                          src={prop.coverImage}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Status Banner */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                          {isSoldOrRented ? (
                            <span className="px-3 py-1 rounded-md bg-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {prop.status === 'Sold' ? 'SOLD OUT' : 'RENTED OUT'}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-md bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                              ACTIVE LISTING
                            </span>
                          )}

                          <span className="px-2.5 py-0.5 rounded bg-[#0F382C]/90 text-[#FAF8F5] text-xs font-serif-luxury font-bold shadow-xs">
                            {prop.priceDisplay}
                          </span>
                        </div>

                        {/* Top-right property type */}
                        <div className="absolute top-3 right-3 z-10">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[#E4D5B7] border border-white/20">
                            {prop.propertyType}
                          </span>
                        </div>

                        {/* Bottom overlay: Location */}
                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs z-10 pointer-events-none">
                          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                            <MapPin className="w-3 h-3 text-[#E4D5B7]" />
                            <span className="truncate max-w-[200px]">{prop.locality}</span>
                          </div>
                          <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-mono">
                            #{prop.id}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 
                            onClick={() => onViewProperty(prop)}
                            className="text-base font-serif-luxury font-bold text-[#0F382C] line-clamp-1 hover:underline cursor-pointer"
                          >
                            {prop.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {prop.tagline}
                          </p>

                          {/* Verification Authority Tag */}
                          <div className="mt-2 flex items-center gap-1.5">
                            {prop.verified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Verified: {prop.verifiedBy || 'ADA / Authority Approved'}</span>
                              </span>
                            ) : prop.verificationStatus === 'In Process' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                                <span>⏳ Approval In Process</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 text-[11px] font-medium">
                                <span>Independent Registry (Not ADA)</span>
                              </span>
                            )}
                          </div>

                          {/* Quick specs */}
                          <div className="grid grid-cols-3 gap-2 py-2.5 my-3 border-y border-gray-100 text-xs text-gray-700 font-medium">
                            <div className="flex items-center gap-1">
                              <Bed className="w-3.5 h-3.5 text-gray-400" />
                              <span>{prop.bedrooms > 0 ? `${prop.bedrooms} BHK` : 'Comm.'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="w-3.5 h-3.5 text-gray-400" />
                              <span>{prop.bathrooms} Baths</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Maximize className="w-3.5 h-3.5 text-gray-400" />
                              <span>{prop.superAreaSqFt} sq.ft</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons Toolbar as required */}
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          
                          {/* Row 1: Mark as Sold/Rented toggle + View */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              id={`toggle-status-btn-${prop.id}`}
                              onClick={() => onTogglePropertyStatus(prop.id)}
                              className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                                isSoldOrRented
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isSoldOrRented ? 'Reactivate' : 'Mark Sold/Rent'}</span>
                            </button>

                            <button
                              type="button"
                              id={`view-public-btn-${prop.id}`}
                              onClick={() => onViewProperty(prop)}
                              className="py-2 px-2.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Public</span>
                            </button>
                          </div>

                          {/* Row 2: Edit Property + Delete Listing */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              id={`edit-property-btn-${prop.id}`}
                              onClick={() => onEditProperty(prop)}
                              className="py-2 px-3 rounded-lg text-xs font-bold bg-[#0F382C] hover:bg-[#164E3D] text-white flex items-center justify-center gap-1.5 shadow-xs transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Property</span>
                            </button>

                            <button
                              type="button"
                              id={`delete-listing-btn-${prop.id}`}
                              onClick={() => setDeleteConfirmId(prop.id)}
                              className="py-2 px-3 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10 max-w-3xl">
            <div className="mb-6">
              <h2 className="text-xl font-serif-luxury font-bold text-[#0F382C]">
                Personal Profile & Contact Settings
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Keep your confidential contact details and Agra investment preferences updated.
              </p>
            </div>

            {profileSuccessMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">Profile details saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-5">
                  <img
                    src={avatar}
                    alt="Current Avatar"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C5A869] shadow-sm"
                  />
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="Enter photo image URL..."
                      className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 font-medium">Presets:</span>
                      {avatarPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(preset)}
                          className={`w-7 h-7 rounded-lg overflow-hidden border ${
                            avatar === preset ? 'border-[#0F382C] ring-2 ring-[#0F382C]/30' : 'border-gray-200 opacity-70'
                          }`}
                        >
                          <img src={preset} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Full Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Account Type / Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-left ${
                      role === 'buyer'
                        ? 'bg-[#0F382C] text-white border-[#0F382C] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="block font-bold">Buyer / Investor</span>
                    <span className="text-[11px] opacity-80 font-normal">Exploring luxury estates & villas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-left ${
                      role === 'owner'
                        ? 'bg-[#0F382C] text-white border-[#0F382C] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="block font-bold">Property Owner / Seller</span>
                    <span className="text-[11px] opacity-80 font-normal">Listing & managing Agra properties</span>
                  </button>
                </div>
              </div>

              {/* Preferred Locality */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Primary Agra Locality / Focus Area
                </label>
                <input
                  type="text"
                  value={preferredLocality}
                  onChange={(e) => setPreferredLocality(e.target.value)}
                  placeholder="e.g. Fatehabad Road, Dayalbagh, Civil Lines"
                  className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                />
              </div>

              {/* Primary Interest */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Primary Interest / Intended Action
                </label>
                <select
                  value={primaryInterest}
                  onChange={(e) => setPrimaryInterest(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                >
                  <option value="Buying">Buying / Investing</option>
                  <option value="Selling/Listing">Selling / Listing Property</option>
                  <option value="Renting">Renting</option>
                </select>
              </div>

              {/* Preferred Budget & Profession */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Preferred Budget & Property Type
                  </label>
                  <input
                    type="text"
                    value={preferredBudget}
                    onChange={(e) => setPreferredBudget(e.target.value)}
                    placeholder="e.g. ₹2.5 Cr+ Luxury Villa"
                    className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Profession / Occupation
                  </label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Senior Medical Consultant"
                    className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                </div>
              </div>

              {/* Address & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Address Living In
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Taj Ganj, Agra"
                    className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  id="save-profile-btn"
                  className="bg-[#0F382C] hover:bg-[#164E3D] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: Saved Estates */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif-luxury font-bold text-[#0F382C]">
                  My Saved Estates ({savedProperties.length})
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Properties bookmarked for private tours and valuation reviews.
                </p>
              </div>

              <button
                type="button"
                onClick={onNavigateProperties}
                className="text-xs font-bold text-[#0F382C] hover:underline flex items-center gap-1"
              >
                <span>Browse All Estates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {savedProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-3">
                <Heart className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-gray-700">No Saved Properties</h4>
                <p className="text-xs text-gray-500">Tap the heart icon on any property to save it to your dashboard.</p>
                <button
                  type="button"
                  onClick={onNavigateProperties}
                  className="bg-[#0F382C] text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Explore Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((prop) => (
                  <div key={prop.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={prop.coverImage} alt={prop.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-[#0F382C] text-white px-2 py-0.5 rounded text-xs font-serif-luxury font-bold">
                        {prop.priceDisplay}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-serif-luxury font-bold text-[#0F382C] line-clamp-1">{prop.title}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0F382C]" />
                        <span>{prop.location}</span>
                      </p>
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-mono">{prop.superAreaSqFt} sq.ft</span>
                        <button
                          type="button"
                          onClick={() => onViewProperty(prop)}
                          className="text-xs font-bold text-[#0F382C] hover:underline"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Incoming Leads & Inquiries (Admin Only) */}
        {activeTab === 'leads' && isAdmin(user) && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-[#0F382C]">
                Incoming Leads & Tour Inquiries ({leads?.length || 0})
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                All tour bookings and quick inquiries captured from potential buyers across the platform.
              </p>
            </div>

            {(!leads || leads.length === 0) ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-gray-700">No Leads Captured Yet</h4>
                <p className="text-xs text-gray-500">Inquiries submitted via 'Quick Inquiry' or 'Book Tour' will appear here.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0F382C] text-white uppercase text-[10px] tracking-wider">
                        <th className="p-4">Lead ID & Date</th>
                        <th className="p-4">Buyer Name & Contact</th>
                        <th className="p-4">Property Reference</th>
                        <th className="p-4">Preferred Visit Time</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-4 font-mono">
                            <span className="font-bold text-[#0F382C] block">#{lead.id}</span>
                            <span className="text-[10px] text-gray-400">{lead.timestamp}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-gray-900 block">{lead.buyerName}</span>
                            <span className="text-emerald-700 font-medium block">{lead.phone}</span>
                            <span className="text-gray-500 block">{lead.email}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-[#0F382C] block">{lead.propertyTitle}</span>
                            <span className="text-[10px] font-mono text-gray-400">ID: {lead.propertyId}</span>
                          </td>
                          <td className="p-4 font-medium text-gray-700">
                            {lead.preferredTime ? new Date(lead.preferredTime).toLocaleString() : 'Not Specified'}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${lead.buyerName}, regarding your inquiry for Royal Agra Estate...`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px]"
                              >
                                WhatsApp
                              </a>
                              {onDeleteLead && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteLead(lead.id)}
                                  className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded"
                                  title="Delete lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 text-center space-y-4 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif-luxury font-bold text-gray-900">
              Delete Property Listing?
            </h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to permanently remove this property listing (#{deleteConfirmId})? This action will remove it from both your dashboard and the public property grid.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-delete-listing-btn"
                onClick={() => {
                  onDeleteProperty(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
