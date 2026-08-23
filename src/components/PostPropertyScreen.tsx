import React, { useState, useEffect } from 'react';
import { Property, PropertyType, UserProfile } from '../types';
import { AGRA_LOCALITIES, PROPERTY_TYPES } from '../data/mockData';
import { 
  Building, 
  MapPin, 
  IndianRupee, 
  Upload, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck,
  Check,
  LayoutDashboard
} from 'lucide-react';

interface PostPropertyScreenProps {
  onSuccessNavigate: () => void;
  user?: UserProfile | null;
  onPropertyCreated?: (property: Property) => void;
  onNavigateDashboard?: () => void;
}

export const PostPropertyScreen: React.FC<PostPropertyScreenProps> = ({
  onSuccessNavigate,
  user,
  onPropertyCreated,
  onNavigateDashboard
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [listingIntent, setListingIntent] = useState<'Sale' | 'Rent'>('Sale');
  const [propertyType, setPropertyType] = useState<PropertyType>('Luxury Villa');
  const [locality, setLocality] = useState<string>('Fatehabad Road');
  const [projectTitle, setProjectTitle] = useState('');
  const [address, setAddress] = useState('');
  const [superArea, setSuperArea] = useState<string>('3500');
  const [bedrooms, setBedrooms] = useState<string>('4');
  const [bathrooms, setBathrooms] = useState<string>('4');
  const [askingPrice, setAskingPrice] = useState<string>('28500000');
  const [furnishing, setFurnishing] = useState('Fully Furnished');
  const [possession, setPossession] = useState('Ready to Move');
  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone || '+91 91490 79913');
  const [ownerEmail, setOwnerEmail] = useState(user?.email || 'shrey@royalagraestate.com');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Swimming Pool',
    '100% Power Backup',
    '24/7 Security',
    'Private Garden'
  ]);
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
  );
  
  // Verification states
  const [isVerified, setIsVerified] = useState<'yes' | 'no' | 'in_process'>('yes');
  const [verifiedByAuthority, setVerifiedByAuthority] = useState<string>('Agra Development Authority (ADA)');
  const [customAuthority, setCustomAuthority] = useState<string>('');
  const [verificationDocNumber, setVerificationDocNumber] = useState<string>('');
  const [titleType, setTitleType] = useState<string>('Freehold Clear Title');

  const [submitted, setSubmitted] = useState(false);
  const [createdPropertyRef, setCreatedPropertyRef] = useState<string>('');

  useEffect(() => {
    if (user) {
      if (user.name && !ownerName) setOwnerName(user.name);
      if (user.phone && !ownerPhone) setOwnerPhone(user.phone);
      if (user.email && !ownerEmail) setOwnerEmail(user.email);
    }
  }, [user]);

  const amenityOptions = [
    'Swimming Pool',
    'Private Garden',
    '100% Power Backup',
    '24/7 Security',
    'Home Theater',
    'Private Gym / Spa',
    'Servant Quarters',
    'EV Charging Point',
    'Vastu Compliant',
    'Covered Car Garage'
  ];

  const sampleCoverImages = [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  ];

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const formatPriceDisplay = (amt: number, type: 'Sale' | 'Rent') => {
    if (type === 'Rent') {
      if (amt >= 100000) return `₹${(amt / 100000).toFixed(2)} Lac/mo`;
      return `₹${amt.toLocaleString('en-IN')}/mo`;
    }
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(2)} Cr`;
    return `₹${(amt / 100000).toFixed(2)} Lacs`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = Number(askingPrice) || 25000000;
    const numSuperArea = Number(superArea) || 3000;
    const generatedId = `prop-user-${Date.now()}`;
    const refCode = `RAE-${Math.floor(100000 + Math.random() * 900000)}`;
    setCreatedPropertyRef(refCode);

    const isLegallyVerified = isVerified === 'yes';
    const resolvedVerificationStatus: 'Verified' | 'Not Verified' | 'In Process' = 
      isVerified === 'yes' ? 'Verified' : isVerified === 'in_process' ? 'In Process' : 'Not Verified';
    
    let resolvedAuthorityName = 'Not Verified / Independent Registry';
    if (isVerified === 'yes') {
      resolvedAuthorityName = verifiedByAuthority === 'Other Authority (Specify)' 
        ? (customAuthority.trim() || 'Independent Authority') 
        : verifiedByAuthority;
    } else if (isVerified === 'in_process') {
      resolvedAuthorityName = verifiedByAuthority === 'Other Authority (Specify)'
        ? (customAuthority.trim() ? `${customAuthority.trim()} (Applied)` : 'Verification In Process')
        : `${verifiedByAuthority} (Under Review)`;
    }

    const newProperty: Property = {
      id: generatedId,
      title: projectTitle.trim() || `Luxury ${propertyType} in ${locality}`,
      tagline: `Exclusive ${furnishing} estate (${titleType}) with prime connectivity on ${locality}, Agra.`,
      propertyType,
      listingType: listingIntent,
      price: numPrice,
      priceDisplay: formatPriceDisplay(numPrice, listingIntent),
      pricePerSqFt: Math.round(numPrice / numSuperArea),
      location: `${locality}, Agra`,
      locality,
      address: address.trim() || `${locality}, Agra, Uttar Pradesh`,
      bedrooms: Number(bedrooms) || 4,
      bathrooms: Number(bathrooms) || 4,
      balconies: 2,
      superAreaSqFt: numSuperArea,
      carpetAreaSqFt: Math.round(numSuperArea * 0.78),
      furnishing: furnishing as any,
      facing: 'North-East (Vastu)',
      reraId: verificationDocNumber.trim() || (isLegallyVerified ? `UPRERA-AGR-${Math.floor(1000 + Math.random() * 9000)}` : 'N/A'),
      possession: possession as any,
      featured: true,
      isExclusive: true,
      verified: isLegallyVerified,
      verificationStatus: resolvedVerificationStatus,
      verifiedBy: resolvedAuthorityName,
      verificationNumber: verificationDocNumber.trim() || undefined,
      status: 'Active',
      isUserListing: true,
      ownerId: user?.id || 'RAE-OWNER-01',
      ownerName: ownerName || user?.name || 'Property Owner',
      ownerContact: ownerPhone || user?.phone || '+91 91490 79913',
      images: [
        coverImageUrl,
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: coverImageUrl,
      description: `Spectacular ${propertyType} situated in the prestigious enclave of ${locality}, Agra. Designed for distinguished living with spacious layouts, high ceilings, premium fittings, and comprehensive security infrastructure.`,
      highlights: [
        `${furnishing} with bespoke craftsmanship`,
        '100% Vastu Compliant Orientation',
        'High-Speed Connectivity to Expressway & Taj Corridor',
        'Multi-car covered garage & 24/7 power backup'
      ],
      amenities: selectedAmenities,
      landmarks: [
        { name: `${locality} Metro Station`, distance: '1.2 km', travelTime: '3 mins' },
        { name: 'Taj Mahal East Gate', distance: '4.5 km', travelTime: '10 mins' },
        { name: 'Agra-Lucknow Expressway', distance: '5.8 km', travelTime: '12 mins' }
      ],
      agent: {
        name: 'Shrey Gupta',
        role: 'Managing Partner & Co-Founder',
        phone: '+91 91490 79913',
        email: 'shrey@royalagraestate.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        experience: 'Luxury Residential & HNI Advisory'
      },
      yearBuilt: new Date().getFullYear(),
      parkingSpots: 3,
      gatedSecurity: true,
      powerBackup: true,
      coordinates: { lat: 27.1767, lng: 78.0081 }
    };

    if (onPropertyCreated) {
      onPropertyCreated(newProperty);
    }
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F382C]/10 text-[#0F382C] text-xs font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5 text-[#0F382C]" />
            <span>Owner & Developer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#0F382C]">
            List Your Luxury Property in Agra
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Connect directly with verified High-Net-Worth Individuals (HNIs), NRIs, and serious buyers in Agra with complete confidentiality.
          </p>
        </div>

        {/* Multi-step Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-lg overflow-hidden">
          
          {/* Step Progress Bar */}
          <div className="bg-[#0F382C] px-6 py-4 text-white flex items-center justify-between border-b border-[#164E3D]">
            {[
              { num: 1, title: 'Basic Info' },
              { num: 2, title: 'Specs & Price' },
              { num: 3, title: 'Amenities & Media' },
              { num: 4, title: 'Legal & Owner Info' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.num
                    ? 'bg-[#E4D5B7] text-[#0F382C]'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#164E3D] text-gray-400'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline-block text-xs font-medium text-gray-200">
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          {submitted ? (
            <div className="p-10 sm:p-16 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-serif-luxury font-bold text-[#0F382C]">
                Property Published & Added to Dashboard!
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                Thank you, <strong>{ownerName || 'Property Owner'}</strong>. Your luxury listing in <strong>{locality}</strong> has been registered with reference ID <strong>#{createdPropertyRef || 'RAE-892140'}</strong> and is now visible in your dashboard and the property showcase.
              </p>
              
              <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                {onNavigateDashboard && (
                  <button
                    type="button"
                    id="post-view-dashboard-btn"
                    onClick={onNavigateDashboard}
                    className="bg-[#0F382C] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#164E3D] flex items-center gap-2 shadow-md"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>View in My Dashboard</span>
                  </button>
                )}

                <button
                  type="button"
                  id="post-success-home-btn"
                  onClick={onSuccessNavigate}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
              
              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F382C]">
                    Step 1: Property Type & Agra Locality
                  </h3>

                  {/* Intent Switcher */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Listing Intent</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setListingIntent('Sale')}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                          listingIntent === 'Sale'
                            ? 'bg-[#0F382C] text-white border-[#0F382C] shadow-sm'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Sell Property
                      </button>
                      <button
                        type="button"
                        onClick={() => setListingIntent('Rent')}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                          listingIntent === 'Rent'
                            ? 'bg-[#0F382C] text-white border-[#0F382C] shadow-sm'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Lease / Rent Out
                      </button>
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                      className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium focus:bg-white"
                    >
                      {PROPERTY_TYPES.filter(t => t !== 'All').map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Locality */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Agra Locality</label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium focus:bg-white"
                    >
                      {AGRA_LOCALITIES.filter(l => l !== 'All Localities').map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* Property / Project Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Building / House / Project Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The Taj Sovereign Villa or Royal Palms"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                    />
                  </div>

                  {/* Detailed Address */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Full Address & Landmarks in Agra</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Plot 14, Royal Enclave, Near ITC Mughal, Fatehabad Road, Agra"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-[#0F382C] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#164E3D]"
                    >
                      <span>Continue to Specifications</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Specs & Price */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F382C]">
                    Step 2: Area, Configuration & Pricing
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">Super Area (Sq.Ft)</label>
                      <input
                        type="number"
                        required
                        value={superArea}
                        onChange={(e) => setSuperArea(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">Bedrooms (BHK)</label>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                      >
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4 BHK</option>
                        <option value="5">5+ BHK Mansion</option>
                        <option value="0">Commercial Plot / Floor</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">
                        {listingIntent === 'Sale' ? 'Expected Sale Price (₹ INR)' : 'Expected Monthly Rent (₹ INR)'}
                      </label>
                      <input
                        type="number"
                        required
                        value={askingPrice}
                        onChange={(e) => setAskingPrice(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-mono"
                      />
                      <span className="text-[11px] text-gray-500 font-mono">
                        ≈ {formatPriceDisplay(Number(askingPrice) || 0, listingIntent)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">Furnishing Status</label>
                      <select
                        value={furnishing}
                        onChange={(e) => setFurnishing(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                      >
                        <option value="Designer Fitted">Designer Fitted</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-gray-600 px-4 py-2 hover:text-[#0F382C] flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-[#0F382C] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#164E3D]"
                    >
                      <span>Continue to Amenities & Media</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Amenities & Photos */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F382C]">
                    Step 3: Select Amenities & Cover Photo
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-3">
                      Select Property Amenities:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {amenityOptions.map((opt) => {
                        const isChecked = selectedAmenities.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleAmenity(opt)}
                            className={`p-3 rounded-lg border text-xs font-medium text-left flex items-center justify-between transition-all ${
                              isChecked
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <span>{opt}</span>
                            {isChecked && <Check className="w-4 h-4 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Photo Selection / Presets */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Cover Image Photo</label>
                    <input
                      type="url"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white"
                      placeholder="https://images.unsplash.com/..."
                    />

                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-[11px] text-gray-500 font-semibold">Select Architectural Preset:</span>
                      <div className="flex gap-2 overflow-x-auto py-1">
                        {sampleCoverImages.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCoverImageUrl(img)}
                            className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                              coverImageUrl === img ? 'border-[#0F382C] scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt="preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-bold text-gray-600 px-4 py-2 hover:text-[#0F382C] flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="bg-[#0F382C] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#164E3D]"
                    >
                      <span>Continue to Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Legal Verification & Owner Contact */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-serif-luxury font-bold text-[#0F382C]">
                      Step 4: Legal Verification & Owner Contact
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Specify whether your property is approved by ADA or another regulatory authority, or listed as an independent private registry.
                    </p>
                  </div>

                  {/* 1. Verification Status Toggle */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Is this property verified / approved by any authority?
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        id="verify-status-yes"
                        onClick={() => setIsVerified('yes')}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          isVerified === 'yes'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">✓ Verified & Approved</span>
                          {isVerified === 'yes' && <Check className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          Approved by ADA, UP RERA, Nagar Nigam, or Bank Title
                        </p>
                      </button>

                      <button
                        type="button"
                        id="verify-status-process"
                        onClick={() => setIsVerified('in_process')}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          isVerified === 'in_process'
                            ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">⏳ In Process / Applied</span>
                          {isVerified === 'in_process' && <Check className="w-4 h-4 text-amber-600" />}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          Approval / map sanction application submitted
                        </p>
                      </button>

                      <button
                        type="button"
                        id="verify-status-no"
                        onClick={() => setIsVerified('no')}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          isVerified === 'no'
                            ? 'bg-gray-100 border-gray-500 text-gray-900 ring-2 ring-gray-400/20'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">✕ Not ADA / Independent</span>
                          {isVerified === 'no' && <Check className="w-4 h-4 text-gray-700" />}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          Private registry / self-declared freehold title
                        </p>
                      </button>
                    </div>

                    {/* Authority Selection if Verified or In-Process */}
                    {isVerified !== 'no' && (
                      <div className="pt-3 border-t border-gray-200/80 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                              {isVerified === 'yes' ? 'Verified / Approved By Which Authority?' : 'Applied With Which Authority?'}
                            </label>
                            <select
                              id="verified-authority-select"
                              value={verifiedByAuthority}
                              onChange={(e) => setVerifiedByAuthority(e.target.value)}
                              className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 font-medium focus:border-[#0F382C] focus:ring-1 focus:ring-[#0F382C]"
                            >
                              <option value="Agra Development Authority (ADA)">Agra Development Authority (ADA)</option>
                              <option value="UP RERA (Real Estate Regulatory Authority)">UP RERA (Real Estate Regulatory Authority)</option>
                              <option value="Tehsil Registry / Sub-Registrar Agra">Tehsil Registry / Sub-Registrar Agra</option>
                              <option value="Nagar Nigam Agra (Municipal Corporation)">Nagar Nigam Agra (Municipal Corporation)</option>
                              <option value="Royal Agra Legal Advisory Cell">Royal Agra Legal Advisory Cell</option>
                              <option value="Agra Cantonment Board">Agra Cantonment Board</option>
                              <option value="Nationalized / Private Bank (Home Loan Approved)">Nationalized / Private Bank (Home Loan Approved)</option>
                              <option value="Other Authority (Specify)">Other Authority (Specify)</option>
                            </select>
                          </div>

                          {verifiedByAuthority === 'Other Authority (Specify)' && (
                            <div>
                              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                                Specify Authority / Organization Name
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Housing Society, Zila Panchayat, Advocate Cell"
                                value={customAuthority}
                                onChange={(e) => setCustomAuthority(e.target.value)}
                                className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 focus:border-[#0F382C]"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                              Approval / RERA / Khasra Reference No. (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. ADA/2024/782 or UPRERAAGT2024"
                              value={verificationDocNumber}
                              onChange={(e) => setVerificationDocNumber(e.target.value)}
                              className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 font-mono focus:border-[#0F382C]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                              Title & Land Conversion Type
                            </label>
                            <select
                              value={titleType}
                              onChange={(e) => setTitleType(e.target.value)}
                              className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 font-medium focus:border-[#0F382C]"
                            >
                              <option value="Freehold Clear Title">Freehold Clear Title (Registered)</option>
                              <option value="143 Converted (Agri to Residential)">Section 143 Land Converted (Agri to Residential)</option>
                              <option value="ADA Sanctioned Map">ADA Sanctioned Map Approved</option>
                              <option value="Society Allotment / Transfer">Society Allotment / Transfer</option>
                              <option value="Ancestral Heritage Freehold">Ancestral Heritage Freehold</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Owner Contact Details */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Owner & Trustee Contact Details
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Owner / Trustee Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Seth Shanti Prasad"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 91490 79913"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="owner@royalagraestate.com"
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Confidential Discretion Guarantee</span>
                      </div>
                      <p className="text-[11px] text-emerald-700">
                        Your direct contact details are never made public. Inquiries are vetted by our Senior Agra Portfolio Advisors before connecting with you.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs font-bold text-gray-600 px-4 py-2 hover:text-[#0F382C] flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      id="submit-post-property-final-btn"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                    >
                      Publish Property to Dashboard & Network
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
