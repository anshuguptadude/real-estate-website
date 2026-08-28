import React, { useState, useEffect, useRef } from 'react';
import { Property, PropertyType, UserProfile } from '../types';
import { AGRA_LOCALITIES, PROPERTY_TYPES } from '../data/mockData';
import { isAdmin } from '../utils/security';
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
  LayoutDashboard,
  Camera,
  Video,
  Image as ImageIcon,
  Trash2,
  Play,
  Film,
  FileText,
  AlertCircle
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
  const [ownerEmail, setOwnerEmail] = useState(user?.email || 'shrey@royalagraestate.in');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Swimming Pool',
    '100% Power Backup',
    '24/7 Security',
    'Private Garden'
  ]);

  // Media Upload States (Files, Videos, Live Camera, DataURLs)
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>(
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
  );
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>('image');
  const [mediaName, setMediaName] = useState<string>('default-villa-cover.jpg');
  const [mediaSize, setMediaSize] = useState<string>('1.8 MB');
  const [isDragging, setIsDragging] = useState(false);
  const [mediaError, setMediaError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
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

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const handleProcessFile = (file: File) => {
    setMediaError('');
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/mov'];
    
    const isImage = validImageTypes.includes(file.type) || file.type.startsWith('image/');
    const isVideo = validVideoTypes.includes(file.type) || file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mov') || file.name.toLowerCase().endsWith('.mp4');

    if (!isImage && !isVideo) {
      setMediaError('Unsupported format. Please upload JPEG, PNG, WEBP, MP4, or MOV files.');
      return;
    }

    // Size limit check (50MB for video, 20MB for image)
    const maxBytes = isVideo ? 50 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      setMediaError(`File is too large. Maximum size is ${isVideo ? '50MB for video' : '20MB for images'}.`);
      return;
    }

    setMediaFile(file);
    setMediaName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setMediaSize(`${sizeInMB} MB`);
    setMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setMediaPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
    setMediaType(null);
    setMediaName('');
    setMediaSize('');
    setMediaError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
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

    const finalCover = mediaPreview || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80';

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
      verificationStatus: isAdmin(user) ? resolvedVerificationStatus : 'In Process',
      verifiedBy: resolvedAuthorityName,
      verificationNumber: verificationDocNumber.trim() || undefined,
      status: isAdmin(user) ? 'Active' : 'Pending Approval',
      isUserListing: true,
      ownerId: user?.id || 'RAE-OWNER-01',
      ownerName: ownerName || user?.name || 'Property Owner',
      ownerContact: ownerPhone || user?.phone || '+91 91490 79913',
      images: [
        finalCover,
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: finalCover,
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
        email: 'shrey@royalagraestate.in',
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
            Showcase your exclusive property directly to verified HNI buyers and elite investors across Uttar Pradesh and Delhi NCR.
          </p>
        </div>

        {/* Multi-step Navigation Stepper */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Basic Details' },
              { num: 2, label: 'Area & Price' },
              { num: 3, label: 'Amenities & Media' },
              { num: 4, label: 'Legal & Owner' }
            ].map((s) => (
              <div 
                key={s.num} 
                onClick={() => {
                  if (s.num < step) setStep(s.num as any);
                }}
                className={`flex items-center gap-2 cursor-pointer transition-all ${
                  step === s.num 
                    ? 'text-[#0F382C] font-bold' 
                    : step > s.num 
                    ? 'text-emerald-700 font-semibold' 
                    : 'text-gray-400 font-medium'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num 
                    ? 'bg-[#0F382C] text-white ring-4 ring-[#0F382C]/10' 
                    : step > s.num 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className="hidden sm:inline text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-md border border-gray-200/90">
          {submitted ? (
            /* SUCCESS STATE AFTER SUBMISSION */
            <div className="text-center py-12 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F382C]">
                Property Registered Successfully!
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                Thank you, <strong>{ownerName || 'Property Owner'}</strong>. Your luxury listing in <strong>{locality}</strong> has been registered with reference ID <strong>#{createdPropertyRef || 'RAE-892140'}</strong>.
              </p>
              
              <div className="bg-emerald-50 rounded-xl p-4 max-w-md mx-auto border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold">Next Steps:</p>
                <p>1. Your listing is now saved to your owner portfolio dashboard.</p>
                <p>2. Our legal diligence advisory cell will review the property verification status within 4 hours.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {onNavigateDashboard && (
                  <button
                    type="button"
                    onClick={onNavigateDashboard}
                    className="w-full sm:w-auto bg-[#0F382C] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#164E3D] flex items-center justify-center gap-2 shadow-md"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to My Dashboard</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onSuccessNavigate}
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  Explore Property Showcase
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* STEP 1: Basic Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F382C]">
                    Step 1: Property Type & Agra Location
                  </h3>

                  {/* Intent Switcher: Sale vs Rent */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Listing Intent</label>
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      <button
                        type="button"
                        onClick={() => setListingIntent('Sale')}
                        className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                          listingIntent === 'Sale' 
                            ? 'bg-[#0F382C] text-white border-[#0F382C] shadow-sm' 
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Sell Property (Capital Sale)
                      </button>
                      <button
                        type="button"
                        onClick={() => setListingIntent('Rent')}
                        className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                          listingIntent === 'Rent' 
                            ? 'bg-[#0F382C] text-white border-[#0F382C] shadow-sm' 
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Lease / Rent Property
                      </button>
                    </div>
                  </div>

                  {/* Property Category */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Property Typology</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {PROPERTY_TYPES.filter(t => t !== 'All').map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setPropertyType(type)}
                          className={`p-3 rounded-lg border text-xs font-semibold text-left transition-all ${
                            propertyType === type
                              ? 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-1 ring-emerald-500/20'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Locality in Agra */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Primary Agra Locality</label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                    >
                      {AGRA_LOCALITIES.filter(l => l !== 'All Localities').map((l) => (
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

              {/* STEP 3: Amenities & Photos / Videos Upload */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F382C]">
                    Step 3: Select Amenities & Media Upload
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

                  {/* DEDICATED MEDIA UPLOAD COMPONENT (Photos & Videos) */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-700 uppercase">
                        Property Cover Media (Photo / Walkthrough Video)
                      </label>
                      <span className="text-[11px] text-gray-500 font-medium">
                        JPEG, PNG, WEBP, MP4, MOV (Up to 50MB)
                      </span>
                    </div>

                    {/* Hidden Native File Inputs */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/webp,image/jpg,video/mp4,video/quicktime,video/mov,image/*,video/*"
                      className="hidden"
                    />
                    <input
                      type="file"
                      ref={cameraInputRef}
                      onChange={handleFileChange}
                      accept="image/*,video/*"
                      capture="environment"
                      className="hidden"
                    />

                    {mediaError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{mediaError}</span>
                      </div>
                    )}

                    {/* MEDIA PREVIEW CARD IF SELECTED */}
                    {mediaPreview ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-[#0F382C]/20 bg-gray-900 shadow-md">
                        <div className="aspect-[16/9] w-full max-h-[360px] flex items-center justify-center overflow-hidden bg-black">
                          {mediaType === 'video' ? (
                            <video
                              src={mediaPreview}
                              controls
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <img
                              src={mediaPreview}
                              alt="Property Cover Preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* Top Overlay Badge & Actions */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                          <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold border border-white/20">
                            {mediaType === 'video' ? (
                              <>
                                <Film className="w-3.5 h-3.5 text-[#E4D5B7]" />
                                <span>Video Preview</span>
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-3.5 h-3.5 text-[#E4D5B7]" />
                                <span>Cover Image Preview</span>
                              </>
                            )}
                            {mediaSize && (
                              <span className="text-[10px] text-gray-300 ml-1">({mediaSize})</span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={handleRemoveMedia}
                            className="pointer-events-auto bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-1 text-xs font-bold"
                            title="Remove Selected Media"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline pr-1">Remove</span>
                          </button>
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="p-3 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                          <div className="text-xs text-gray-600 truncate max-w-[280px]">
                            <strong>Selected:</strong> {mediaName || 'Custom Uploaded Media'}
                          </div>
                          
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Replace File</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => cameraInputRef.current?.click()}
                              className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Camera className="w-3.5 h-3.5 text-[#E4D5B7]" />
                              <span>Retake Photo/Video</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* INTERACTIVE DRAG & DROP DROPZONE */
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                          isDragging
                            ? 'border-emerald-600 bg-emerald-50/70 scale-[1.01]'
                            : 'border-gray-300 hover:border-[#0F382C] bg-gray-50/60 hover:bg-white'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100/70 text-[#0F382C] flex items-center justify-center mx-auto mb-4 shadow-xs">
                          <Upload className="w-8 h-8 text-[#0F382C]" />
                        </div>
                        <h4 className="text-base font-serif-luxury font-bold text-[#0F382C]">
                          Drag & drop your property photos or walk-through video here
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 mb-6 max-w-sm mx-auto">
                          Directly upload high-resolution property photos or video walkthroughs from your computer, mobile gallery, or live camera.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full sm:w-auto px-5 py-2.5 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all"
                          >
                            <Upload className="w-4 h-4 text-[#E4D5B7]" />
                            <span>Browse Files (Laptop / Mobile)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-gray-100 text-[#0F382C] border border-[#0F382C]/30 rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs flex items-center justify-center gap-2 transition-all"
                          >
                            <Camera className="w-4 h-4 text-[#0F382C]" />
                            <span>Live Camera Capture</span>
                          </button>
                        </div>
                      </div>
                    )}
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

                    {/* Custom Authority Verification */}
                    {isVerified !== 'no' && (
                      <div className="pt-3 border-t border-gray-200/80 space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                            Approved / Verified By Authority
                          </label>
                          <input
                            type="text"
                            value={customAuthority || verifiedByAuthority}
                            onChange={(e) => {
                              setCustomAuthority(e.target.value);
                              setVerifiedByAuthority(e.target.value);
                            }}
                            placeholder="e.g., ADA Approved, RERA Verified, Agra Cantonment Board"
                            className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 font-medium focus:border-[#0F382C] focus:ring-1 focus:ring-[#0F382C]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                            Sanction / RERA / Approval File Reference Number (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. ADA/2024/9912 or UPRERAAGT2024"
                            value={verificationDocNumber}
                            onChange={(e) => setVerificationDocNumber(e.target.value)}
                            className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Owner Contact Information */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Confidential Owner / Developer Contact
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Owner Name</label>
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Owner Contact Phone</label>
                        <input
                          type="tel"
                          required
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-lg"
                        />
                      </div>
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
                      id="submit-property-listing-btn"
                      className="bg-[#0F382C] hover:bg-[#164E3D] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <span>Publish Property Listing</span>
                      <Sparkles className="w-4 h-4 text-[#E4D5B7]" />
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
