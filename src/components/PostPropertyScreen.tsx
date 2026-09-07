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
  const [propertyType, setPropertyType] = useState<string>('Luxury Villa');
  const [customPropertyType, setCustomPropertyType] = useState<string>('');
  const [isOtherPropertyType, setIsOtherPropertyType] = useState<boolean>(false);
  const [locality, setLocality] = useState<string>('Fatehabad Road');
  const [customLocality, setCustomLocality] = useState<string>('');
  const [isOtherLocality, setIsOtherLocality] = useState<boolean>(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [address, setAddress] = useState('');
  const [superArea, setSuperArea] = useState<string>('3500');
  const [areaUnit, setAreaUnit] = useState<'Sq.Ft' | 'Sq.Yard'>('Sq.Ft');
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
    '24/7 Security',
    'Private Garden'
  ]);

  // Media Upload States (Multiple files supported with NO size limit)
  const [uploadedMediaList, setUploadedMediaList] = useState<{
    url: string;
    type: 'image' | 'video';
    name: string;
    size: string;
  }[]>([]);
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
    '24/7 Security',
    'Home Theater',
    'Private Gym / Spa',
    'EV Charging Point'
  ];

  const formatINRCommas = (numStr: string): string => {
    const clean = numStr.replace(/[^0-9]/g, '');
    const num = parseFloat(clean);
    if (isNaN(num)) return '';
    return num.toLocaleString('en-IN');
  };

  const convertNumberToIndianWords = (num: number): string => {
    if (num <= 0 || isNaN(num)) return '';
    let result = '';
    const crore = Math.floor(num / 10000000);
    let remainder = num % 10000000;
    const lakh = Math.floor(remainder / 100000);
    remainder = remainder % 100000;
    const thousand = Math.floor(remainder / 1000);
    remainder = remainder % 1000;
    const hundred = Math.floor(remainder / 100);
    remainder = remainder % 100;

    if (crore > 0) result += `${crore} Crore `;
    if (lakh > 0) result += `${lakh} Lakh `;
    if (thousand > 0) result += `${thousand} Thousand `;
    if (hundred > 0) result += `${hundred} Hundred `;
    if (remainder > 0) result += `${remainder} `;
    
    return result.trim() + ' Rupees';
  };

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const handleProcessFiles = (files: FileList | File[]) => {
    setMediaError('');
    const fileArray = Array.from(files);
    
    fileArray.forEach((file) => {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/mov'];
      
      const isImage = validImageTypes.includes(file.type) || file.type.startsWith('image/');
      const isVideo = validVideoTypes.includes(file.type) || file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mov') || file.name.toLowerCase().endsWith('.mp4');

      if (!isImage && !isVideo) {
        setMediaError('Some files were skipped due to unsupported format. Please upload JPEG, PNG, WEBP, MP4, or MOV files.');
        return;
      }

      // No file size limit! Any size picture or video is allowed.
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setUploadedMediaList((prev) => [
            ...prev,
            {
              url: reader.result as string,
              type: isVideo ? 'video' : 'image',
              name: file.name,
              size: `${sizeInMB} MB`
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFiles(e.target.files);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setUploadedMediaList((prev) => prev.filter((_, idx) => idx !== index));
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
    const finalLocality = isOtherLocality ? (customLocality.trim() || 'Custom Locality') : locality;
    const numPrice = Number(askingPrice.replace(/[^0-9]/g, '')) || 25000000;
    const rawArea = Number(superArea) || 3000;
    const numSuperArea = areaUnit === 'Sq.Yard' ? Math.round(rawArea * 9) : rawArea;

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

    const uploadedUrls = uploadedMediaList.map(m => m.url);
    const finalCover = uploadedUrls[0] || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80';
    const finalImages = uploadedUrls.length > 0 ? uploadedUrls : [
      finalCover,
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ];

    const newProperty: Property = {
      id: generatedId,
      title: projectTitle.trim() || `Luxury ${propertyType} in ${finalLocality}`,
      tagline: `Exclusive ${furnishing} estate (${titleType}) with prime connectivity on ${finalLocality}, Agra.`,
      propertyType,
      listingType: listingIntent,
      price: numPrice,
      priceDisplay: formatPriceDisplay(numPrice, listingIntent),
      pricePerSqFt: Math.round(numPrice / numSuperArea),
      location: `${finalLocality}, Agra`,
      locality: finalLocality,
      address: address.trim() || `${finalLocality}, Agra, Uttar Pradesh`,
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
      status: 'pending_verification',
      isUserListing: true,
      ownerId: user?.id || 'RAE-OWNER-01',
      ownerName: ownerName || user?.name || 'Property Owner',
      ownerContact: ownerPhone || user?.phone || '+91 91490 79913',
      images: finalImages,
      coverImage: finalCover,
      description: `Spectacular ${propertyType} situated in the prestigious enclave of ${finalLocality}, Agra. Designed for distinguished living with spacious layouts, high ceilings, premium fittings, and comprehensive security infrastructure.`,
      highlights: [
        `${furnishing} with bespoke craftsmanship`,
        '100% Vastu Compliant Orientation',
        'High-Speed Connectivity to Expressway & Taj Corridor',
        'Multi-car covered garage & 24/7 power backup'
      ],
      amenities: selectedAmenities,
      landmarks: [
        { name: `${finalLocality} Metro Station`, distance: '1.2 km', travelTime: '3 mins' },
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
                      {['Luxury Villa', 'Penthouse', 'Heritage Haveli', 'Apartment', 'Gated Township Plot', 'Commercial / Retail', 'House'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setPropertyType(type);
                            setIsOtherPropertyType(false);
                            setCustomPropertyType('');
                          }}
                          className={`p-3 rounded-lg border text-xs font-semibold text-left transition-all ${
                            !isOtherPropertyType && propertyType === type
                              ? 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-1 ring-emerald-500/20'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setIsOtherPropertyType(true);
                          setPropertyType(customPropertyType || 'Other Typology');
                        }}
                        className={`p-3 rounded-lg border text-xs font-semibold text-left transition-all ${
                          isOtherPropertyType
                            ? 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-1 ring-emerald-500/20'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Other (Specify Custom)
                      </button>
                    </div>

                    {isOtherPropertyType && (
                      <div className="mt-2.5">
                        <input
                          type="text"
                          required
                          placeholder="Type custom property type (e.g. Row House, Studio, Farmhouse)"
                          value={customPropertyType}
                          onChange={(e) => {
                            setCustomPropertyType(e.target.value);
                            setPropertyType(e.target.value);
                          }}
                          className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Locality in Agra */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Primary Agra Locality</label>
                    <select
                      value={isOtherLocality ? 'Other' : locality}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Other') {
                          setIsOtherLocality(true);
                          setLocality(customLocality);
                        } else {
                          setIsOtherLocality(false);
                          setLocality(val);
                        }
                      }}
                      className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                    >
                      {AGRA_LOCALITIES.filter(l => l !== 'All Localities').map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                      <option value="Other">Other (Specify Custom Locality)</option>
                    </select>

                    {isOtherLocality && (
                      <div className="mt-2">
                        <input
                          type="text"
                          required
                          placeholder="Enter custom Agra locality name (e.g. Dayalbagh, Bodla)"
                          value={customLocality}
                          onChange={(e) => {
                            setCustomLocality(e.target.value);
                            setLocality(e.target.value);
                          }}
                          className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                        />
                      </div>
                    )}
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
                    {/* Super Area + Unit Selector */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-gray-700 uppercase">Super Area</label>
                        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-md border border-gray-200 text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={() => setAreaUnit('Sq.Ft')}
                            className={`px-2 py-0.5 rounded transition-all ${
                              areaUnit === 'Sq.Ft' ? 'bg-[#0F382C] text-white' : 'text-gray-600 hover:text-black'
                            }`}
                          >
                            Sq.Ft
                          </button>
                          <button
                            type="button"
                            onClick={() => setAreaUnit('Sq.Yard')}
                            className={`px-2 py-0.5 rounded transition-all ${
                              areaUnit === 'Sq.Yard' ? 'bg-[#0F382C] text-white' : 'text-gray-600 hover:text-black'
                            }`}
                          >
                            Sq.Yard
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          value={superArea}
                          onChange={(e) => setSuperArea(e.target.value)}
                          placeholder="e.g. 3500"
                          className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                        />
                        <span className="absolute right-3 top-3 text-xs text-gray-400 font-semibold pointer-events-none">
                          {areaUnit}
                        </span>
                      </div>
                    </div>

                    {/* Bedrooms (BHK) */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">Bedrooms (BHK)</label>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white"
                      >
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4 BHK</option>
                        <option value="5">5+ BHK Mansion</option>
                        <option value="0">Commercial Plot / Floor</option>
                      </select>
                    </div>

                    {/* Bathrooms */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">Bathrooms</label>
                      <select
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white"
                      >
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="3">3 Bathrooms</option>
                        <option value="4">4 Bathrooms</option>
                        <option value="5">5+ Bathrooms</option>
                        <option value="0">Not Applicable</option>
                      </select>
                    </div>

                    {/* Furnishing Status */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">Furnishing Status</label>
                      <select
                        value={furnishing}
                        onChange={(e) => setFurnishing(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white"
                      >
                        <option value="Designer Fitted">Designer Fitted</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>

                    {/* Asking Price with Comma Format & Word Breakdown */}
                    <div className="space-y-2 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">
                        {listingIntent === 'Sale' ? 'Expected Sale Price (₹ INR)' : 'Expected Monthly Rent (₹ INR)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={askingPrice}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          setAskingPrice(raw);
                        }}
                        placeholder="e.g. 28500000"
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-mono focus:bg-white focus:border-[#0F382C]"
                      />

                      {askingPrice && Number(askingPrice) > 0 && (
                        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between text-emerald-950 font-mono font-bold">
                            <span>Formatted Amount (INR):</span>
                            <span className="text-sm">₹ {formatINRCommas(askingPrice)}</span>
                          </div>
                          <div className="text-emerald-900 font-medium text-[11px] capitalize">
                            <strong>Amount in Words:</strong> {convertNumberToIndianWords(Number(askingPrice))}
                          </div>
                        </div>
                      )}
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
                        Property Photos & Videos ({uploadedMediaList.length} Uploaded)
                      </label>
                      <span className="text-[11px] text-gray-500 font-medium">
                        JPEG, PNG, WEBP, MP4, MOV (Multiple files, No size limit)
                      </span>
                    </div>

                    {/* Hidden Native File Inputs */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                    />
                    <input
                      type="file"
                      ref={cameraInputRef}
                      onChange={handleFileChange}
                      accept="image/*,video/*"
                      capture="environment"
                      multiple
                      className="hidden"
                    />

                    {mediaError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{mediaError}</span>
                      </div>
                    )}

                    {/* MULTIPLE MEDIA PREVIEW GALLERY IF SELECTED */}
                    {uploadedMediaList.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {uploadedMediaList.map((item, idx) => (
                            <div
                              key={idx}
                              className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-900 group aspect-[4/3]"
                            >
                              {item.type === 'video' ? (
                                <video
                                  src={item.url}
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={item.url}
                                  alt={`Upload ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}

                              {/* Index Badge */}
                              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
                                {idx === 0 ? 'Cover Photo' : `#${idx + 1}`}
                              </div>

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveMedia(idx)}
                                className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-full shadow-md transition-transform hover:scale-110"
                                title="Remove File"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded truncate">
                                {item.name} ({item.size})
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Additional Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <span className="text-xs text-gray-600 font-medium">
                            First photo will be used as the primary listing cover.
                          </span>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex-1 sm:flex-initial px-4 py-2 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5 text-[#E4D5B7]" />
                              <span>Upload More Pictures</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => cameraInputRef.current?.click()}
                              className="flex-1 sm:flex-initial px-4 py-2 bg-white hover:bg-gray-100 text-[#0F382C] border border-[#0F382C]/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Camera className="w-3.5 h-3.5 text-[#0F382C]" />
                              <span>Camera Capture</span>
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
                          Drag & drop multiple property photos or video walkthroughs here
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 mb-6 max-w-sm mx-auto">
                          Upload high-resolution property photos or video walkthroughs without any size limits. Select multiple files at once.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full sm:w-auto px-5 py-2.5 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all"
                          >
                            <Upload className="w-4 h-4 text-[#E4D5B7]" />
                            <span>Select Multiple Files</span>
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
