import React, { useState, useEffect, useRef } from 'react';
import { Property, PropertyType, UserProfile } from '../types';
import { AGRA_LOCALITIES, PROPERTY_TYPES } from '../data/mockData';
import { isAdmin, isPlotOrLand } from '../utils/security';
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
  Star,
  Trash2,
  Plus,
  Compass,
  Lock,
  ExternalLink,
  Clock
} from 'lucide-react';

interface PostPropertyScreenProps {
  onSuccessNavigate: () => void;
  user?: UserProfile | null;
  onPropertyCreated?: (property: Property) => void;
  onNavigateDashboard?: () => void;
  onOpenLogin?: (message?: string) => void;
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
  const [locality, setLocality] = useState<string>('Fatehabad Road');
  const [customLocality, setCustomLocality] = useState<string>('');
  const [projectTitle, setProjectTitle] = useState('');
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  
  // Specifications
  const [superArea, setSuperArea] = useState<string>('3500');
  const [areaUnit, setAreaUnit] = useState<'Sq.Ft' | 'Sq.Yards'>('Sq.Ft');
  const [bedrooms, setBedrooms] = useState<string>('4');
  const [bathrooms, setBathrooms] = useState<string>('4');
  const [askingPrice, setAskingPrice] = useState<string>('28500000');
  const [furnishing, setFurnishing] = useState('Fully Furnished');
  const [facing, setFacing] = useState('North-East (Vastu)');
  const [possession, setPossession] = useState('Ready to Move');
  
  // Owner info
  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone || '+91 91490 79913');
  const [ownerEmail, setOwnerEmail] = useState(user?.email || 'shrey@royalagraestate.in');
  
  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Swimming Pool',
    '100% Power Backup',
    '24/7 Security',
    'Private Garden'
  ]);

  // Nearby Areas & Landmarks
  const [landmarks, setLandmarks] = useState<{ name: string; distance: string; travelTime: string }[]>([
    { name: 'Taj Mahal (East Gate)', distance: '4.5 km', travelTime: '10 mins' },
    { name: 'Agra Metro Station', distance: '1.2 km', travelTime: '3 mins' },
    { name: 'Agra-Lucknow Expressway', distance: '5.8 km', travelTime: '12 mins' }
  ]);
  const [customLandmarkName, setCustomLandmarkName] = useState('');
  const [customLandmarkDist, setCustomLandmarkDist] = useState('');
  const [customLandmarkTime, setCustomLandmarkTime] = useState('');

  // Multi-Image Upload & Display Cover selection (starts clean with 0 images)
  const [images, setImages] = useState<string[]>([]);
  const [selectedDisplayIndex, setSelectedDisplayIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Verification states
  const [isVerified, setIsVerified] = useState<'yes' | 'no' | 'in_process'>('yes');
  const [verifiedByAuthority, setVerifiedByAuthority] = useState<string>('Agra Development Authority (ADA)');
  const [customAuthority, setCustomAuthority] = useState<string>('');
  const [verificationDocNumber, setVerificationDocNumber] = useState<string>('');

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

  const AGRA_LANDMARK_PRESETS = [
    { name: 'Taj Mahal (East Gate)', distance: '4.5 km', travelTime: '10 mins' },
    { name: 'Agra Metro Station (Taj East Gate / Fatehabad Rd)', distance: '1.2 km', travelTime: '3 mins' },
    { name: 'Agra-Lucknow Expressway Toll Plaza', distance: '5.8 km', travelTime: '12 mins' },
    { name: 'Agra Cantt Railway Station', distance: '7.5 km', travelTime: '18 mins' },
    { name: 'Dayalbagh Educational Institute & Heritage Zone', distance: '6.2 km', travelTime: '15 mins' },
    { name: 'Inner Ring Road (Delhi-Agra Access)', distance: '3.4 km', travelTime: '8 mins' },
    { name: 'Sanjay Place Commercial Hub & Civil Lines', distance: '5.0 km', travelTime: '12 mins' },
    { name: 'Agra Domestic Airport (Kheria Civil Terminal)', distance: '11.0 km', travelTime: '25 mins' },
    { name: 'Sikandra Heritage Complex / NH-19', distance: '8.0 km', travelTime: '20 mins' },
    { name: 'Kamla Nagar Commercial Market', distance: '4.8 km', travelTime: '12 mins' }
  ];

  const toggleLandmarkPreset = (preset: { name: string; distance: string; travelTime: string }) => {
    const exists = landmarks.some(l => l.name === preset.name);
    if (exists) {
      setLandmarks(landmarks.filter(l => l.name !== preset.name));
    } else {
      setLandmarks([...landmarks, { ...preset }]);
    }
  };

  const handleAddCustomLandmark = () => {
    if (!customLandmarkName.trim()) return;
    const newL = {
      name: customLandmarkName.trim(),
      distance: customLandmarkDist.trim() || 'Nearby',
      travelTime: customLandmarkTime.trim() || '5-10 mins'
    };
    setLandmarks(prev => [...prev, newL]);
    setCustomLandmarkName('');
    setCustomLandmarkDist('');
    setCustomLandmarkTime('');
  };

  const handleRemoveLandmark = (index: number) => {
    setLandmarks(landmarks.filter((_, idx) => idx !== index));
  };

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  // Safe canvas image compression to guarantee < 500 KB payload safety
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const fallbackPlaceholder = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
      const timer = setTimeout(() => resolve(fallbackPlaceholder), 10000);
      const blobUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        clearTimeout(timer);
        URL.revokeObjectURL(blobUrl);
        try {
          const runCanvasCompression = (maxDim: number, quality: number): string => {
            let width = img.naturalWidth || img.width || 1200;
            let height = img.naturalHeight || img.height || 800;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return fallbackPlaceholder;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            return canvas.toDataURL('image/jpeg', quality);
          };

          let resultDataUrl = runCanvasCompression(1200, 0.65);
          if (resultDataUrl.length > 70000) {
            resultDataUrl = runCanvasCompression(900, 0.52);
          }
          resolve(resultDataUrl);
        } catch {
          resolve(fallbackPlaceholder);
        }
      };

      img.onerror = () => {
        clearTimeout(timer);
        URL.revokeObjectURL(blobUrl);
        resolve(fallbackPlaceholder);
      };

      img.src = blobUrl;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_PHOTOS = 10;
    if (images.length >= MAX_PHOTOS) {
      setImageError(`Maximum ${MAX_PHOTOS} photos allowed. Please delete a photo first.`);
      return;
    }

    const remainingSlots = MAX_PHOTOS - images.length;
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setImageError('Please select valid image files (JPEG, PNG, WebP).');
        continue;
      }
      validFiles.push(file);
    }

    const filesToProcess = validFiles.slice(0, remainingSlots);
    if (filesToProcess.length === 0) return;

    setIsUploading(true);
    try {
      const newCompressedImages: string[] = [];
      for (const f of filesToProcess) {
        const compressed = await compressImage(f);
        newCompressedImages.push(compressed);
      }

      setImages(prev => {
        const updated = [...prev, ...newCompressedImages];
        return updated;
      });
    } catch {
      setImageError('Failed to process image uploads. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setImageError('');
    if (images.length <= 1) {
      setImageError('A property listing must have at least one photo.');
      return;
    }
    const updated = images.filter((_, idx) => idx !== indexToDelete);
    setImages(updated);
    if (selectedDisplayIndex >= updated.length) {
      setSelectedDisplayIndex(0);
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
    const numInputArea = Number(superArea) || (areaUnit === 'Sq.Yards' ? 300 : 3000);
    const numSuperAreaSqFt = areaUnit === 'Sq.Yards' ? Math.round(numInputArea * 9) : numInputArea;
    const numSuperAreaSqYards = areaUnit === 'Sq.Yards' ? numInputArea : Math.round(numSuperAreaSqFt / 9);
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

    const resolvedPropertyType = propertyType === 'Other (Custom Type)'
      ? (customPropertyType.trim() || 'Custom Property')
      : propertyType;

    const resolvedLocality = locality === 'Other'
      ? (customLocality.trim() || 'Agra')
      : locality;

    const defaultPlaceholder = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80';
    const propertyImages = images.length > 0 ? images : [defaultPlaceholder];
    const validDisplayIndex = (selectedDisplayIndex >= 0 && selectedDisplayIndex < propertyImages.length)
      ? selectedDisplayIndex
      : 0;
    const primaryCoverPhoto = propertyImages[validDisplayIndex];
    const isPlot = isPlotOrLand(resolvedPropertyType);
    const finalBedrooms = isPlot ? 0 : (Number(bedrooms) || 0);
    const finalBathrooms = isPlot ? 0 : (Number(bathrooms) || 0);
    const finalFurnishing = isPlot ? 'Unfurnished' : furnishing;
    const finalFacing = facing.trim() || 'North-East (Vastu)';

    const newProperty: Property = {
      id: generatedId,
      title: projectTitle.trim() || `Luxury ${resolvedPropertyType} in ${resolvedLocality}`,
      tagline: isPlot 
        ? `Prime ${resolvedPropertyType} with exceptional road connectivity in ${resolvedLocality}, Agra.` 
        : `Exclusive ${finalFurnishing} estate with prime connectivity on ${resolvedLocality}, Agra.`,
      propertyType: resolvedPropertyType,
      listingType: listingIntent,
      price: numPrice,
      priceDisplay: formatPriceDisplay(numPrice, listingIntent),
      pricePerSqFt: Math.round(numPrice / numSuperAreaSqFt),
      location: `${resolvedLocality}, Agra`,
      locality: resolvedLocality,
      customLocality: locality === 'Other' ? customLocality.trim() : undefined,
      primaryAgraLocality: `${resolvedLocality}, Agra`,
      address: `${resolvedLocality}, Agra`,
      fullAddress: address.trim() || `${projectTitle ? projectTitle + ', ' : ''}${resolvedLocality}, Agra`,
      buildingName: projectTitle.trim() || undefined,
      plotNumber: undefined,
      mapUrl: mapUrl.trim() || undefined,
      locationLink: mapUrl.trim() || undefined,
      googleMapsPinUrl: mapUrl.trim() || undefined,
      bedrooms: finalBedrooms,
      bathrooms: finalBathrooms,
      balconies: isPlot ? 0 : 2,
      superAreaSqFt: numSuperAreaSqFt,
      superAreaSqYards: numSuperAreaSqYards,
      areaUnit: areaUnit,
      carpetAreaSqFt: Math.round(numSuperAreaSqFt * 0.78),
      furnishing: finalFurnishing as any,
      facing: finalFacing,
      reraId: verificationDocNumber.trim() || (isLegallyVerified ? `UPRERA-AGR-${Math.floor(1000 + Math.random() * 9000)}` : 'N/A'),
      possession: possession as any,
      featured: true,
      isExclusive: true,
      verified: isLegallyVerified,
      isApproved: isAdmin(user),
      verificationStatus: isAdmin(user) ? resolvedVerificationStatus : 'In Process',
      verifiedBy: resolvedAuthorityName,
      verificationNumber: verificationDocNumber.trim() || undefined,
      status: isAdmin(user) ? 'Active' : 'Pending Approval',
      isUserListing: true,
      ownerId: user?.id || 'RAE-OWNER-01',
      ownerName: ownerName || user?.name || 'Property Owner',
      ownerContact: ownerPhone || user?.phone || '+91 91490 79913',
      ownerEmail: ownerEmail || user?.email || 'owner@royalagraestate.in',
      images: propertyImages,
      coverImage: primaryCoverPhoto,
      description: `Spectacular ${resolvedPropertyType} situated in the prestigious enclave of ${resolvedLocality}, Agra. Designed for distinguished living with spacious layouts, high ceilings, premium fittings, and comprehensive security infrastructure.`,
      highlights: [
        `${furnishing} with bespoke craftsmanship`,
        '100% Vastu Compliant Orientation',
        'High-Speed Connectivity to Expressway & Taj Corridor',
        'Multi-car covered garage & 24/7 power backup'
      ],
      amenities: selectedAmenities,
      landmarks: landmarks,
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
      coordinates: { lat: 27.1767, lng: 78.0081 },
      postedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
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
              { num: 1, title: 'Basic Info & Location' },
              { num: 2, title: 'Specs & Price' },
              { num: 3, title: 'Amenities, Nearby & Photos' },
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
                {isAdmin(user) ? 'Property Published Live to Portfolio!' : 'Property Submitted for Admin Review!'}
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                {isAdmin(user) ? (
                  <>Thank you, <strong>{ownerName || 'Admin'}</strong>. Your luxury listing in <strong>{locality}</strong> is active with reference ID <strong>#{createdPropertyRef || 'RAE-892140'}</strong>.</>
                ) : (
                  <>Thank you, <strong>{ownerName || 'Property Owner'}</strong>. Your listing in <strong>{locality}</strong> has been registered with reference ID <strong>#{createdPropertyRef || 'RAE-892140'}</strong>. It is currently in <strong>Pending Approval</strong> status and will be reviewed and published by our admin team shortly. Location privacy is strictly protected: only <strong>{locality}, Agra</strong> is visible publicly.</>
                )}
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
              
              {/* STEP 1: Basic Info & Location */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F382C]">
                    Step 1: Property Type & Agra Location
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

                  {/* Property Type Dropdown + Custom Input Option */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Property Type</label>
                    <select
                      id="property-type-select"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium focus:bg-white focus:border-[#0F382C]"
                    >
                      {PROPERTY_TYPES.filter(t => t !== 'All').map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    {/* Dynamic custom property type text box */}
                    {propertyType === 'Other (Custom Type)' && (
                      <div className="p-3 bg-emerald-50/60 border border-emerald-300 rounded-xl space-y-1.5 mt-2 animate-fadeIn">
                        <label className="block text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Write Your Custom Property Type:</span>
                        </label>
                        <input
                          type="text"
                          id="custom-property-type-input"
                          required
                          placeholder="e.g. Colonial Heritage Bungalow, Triplex Villa, Agricultural Farmland, Executive Suite"
                          value={customPropertyType}
                          onChange={(e) => setCustomPropertyType(e.target.value)}
                          className="w-full p-2.5 text-xs sm:text-sm bg-white border border-emerald-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        />
                        <p className="text-[11px] text-emerald-800">
                          This custom type will be displayed on your listing card and detail dossier.
                        </p>
                      </div>
                    )}
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
                      <option value="Other">Other (Write Custom Locality)</option>
                    </select>

                    {/* Dynamic custom locality text box */}
                    {locality === 'Other' && (
                      <div className="p-3 bg-emerald-50/60 border border-emerald-300 rounded-xl space-y-1.5 mt-2 animate-fadeIn">
                        <label className="block text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Write Your Custom Agra Locality / Sector:</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Khandari, Runakta, Kuberpur, Rohta Gwalior Road, Balkeshwar"
                          value={customLocality}
                          onChange={(e) => setCustomLocality(e.target.value)}
                          className="w-full p-2.5 text-xs sm:text-sm bg-white border border-emerald-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        />
                        <p className="text-[11px] text-emerald-800">
                          This custom locality will be displayed on your listing card and detail dossier.
                        </p>
                      </div>
                    )}

                    <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Public Privacy: Regular website visitors will only see <strong>{locality === 'Other' ? (customLocality.trim() || 'Custom Locality') : locality}, Agra</strong>.</span>
                    </p>
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
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-700 uppercase">Full Exact Address (Confidential)</label>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                        🔒 CEO & Admin Only
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Plot 14, Royal Enclave, Near ITC Mughal, Fatehabad Road, Agra"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                    />
                    <p className="text-[11px] text-gray-500">
                      Your exact house/plot address is strictly private. It is never displayed publicly on the live website and is only visible to CEO and Admin accounts.
                    </p>
                  </div>

                  {/* Confidential Google Maps Share Pin / URL Box */}
                  <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-amber-950 uppercase flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-700" />
                        <span>Property Location Pin (Google Maps Share Link)</span>
                      </label>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-800" />
                        <span>Admin & CEO Only</span>
                      </span>
                    </div>
                    <input
                      type="url"
                      id="property-map-url-input"
                      placeholder="e.g. https://maps.app.goo.gl/... or paste your Google Maps location pin"
                      value={mapUrl}
                      onChange={(e) => setMapUrl(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-white border border-amber-300 rounded-lg text-gray-900 focus:border-[#0F382C] focus:ring-1 focus:ring-[#0F382C]"
                    />
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      Share your exact Google Maps pin location for private chauffeur tour navigation. <strong>Privacy Guarantee:</strong> This map link is 100% confidential and is <strong>only visible to Royal Agra Estate Admins and CEO</strong>. Public visitors on the live website will only see the general locality ({locality}, Agra).
                    </p>
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
                    {/* Area with Unit Selector (Sq. Ft vs Sq. Yards) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-gray-700 uppercase">
                          Super Area ({areaUnit === 'Sq.Yards' ? 'Sq. Yards / Gaj' : 'Sq. Ft.'})
                        </label>
                        <div className="inline-flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-[11px] font-bold">
                          <button
                            type="button"
                            onClick={() => {
                              if (areaUnit === 'Sq.Yards') {
                                const current = Number(superArea) || 0;
                                setSuperArea(current ? String(Math.round(current * 9)) : '3500');
                              }
                              setAreaUnit('Sq.Ft');
                            }}
                            className={`px-2.5 py-1 rounded-md transition-all ${
                              areaUnit === 'Sq.Ft' 
                                ? 'bg-[#0F382C] text-white shadow-xs' 
                                : 'text-gray-600 hover:text-black'
                            }`}
                          >
                            Sq. Ft.
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (areaUnit === 'Sq.Ft') {
                                const current = Number(superArea) || 0;
                                setSuperArea(current ? String(Math.round(current / 9)) : '388');
                              }
                              setAreaUnit('Sq.Yards');
                            }}
                            className={`px-2.5 py-1 rounded-md transition-all ${
                              areaUnit === 'Sq.Yards' 
                                ? 'bg-[#0F382C] text-white shadow-xs' 
                                : 'text-gray-600 hover:text-black'
                            }`}
                          >
                            Sq. Yards (Gaj)
                          </button>
                        </div>
                      </div>
                      <input
                        type="number"
                        required
                        value={superArea}
                        onChange={(e) => setSuperArea(e.target.value)}
                        placeholder={areaUnit === 'Sq.Yards' ? 'e.g. 350' : 'e.g. 3150'}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                      />
                      <span className="text-[11px] text-gray-500 font-mono block">
                        {areaUnit === 'Sq.Yards'
                          ? `≈ ${(Number(superArea) || 0) * 9} Sq. Ft.`
                          : `≈ ${Math.round((Number(superArea) || 0) / 9)} Sq. Yards (Gaj)`}
                      </span>
                    </div>

                    {/* Conditional: For Non-Plots, ask Bedrooms, Bathrooms, Furnishing */}
                    {!isPlotOrLand(propertyType === 'Other (Custom Type)' ? customPropertyType : propertyType) ? (
                      <>
                        {/* Bedrooms (BHK) */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase">Bedrooms (BHK)</label>
                          <select
                            value={bedrooms}
                            onChange={(e) => setBedrooms(e.target.value)}
                            className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                          >
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4">4 BHK</option>
                            <option value="5">5+ BHK Mansion</option>
                          </select>
                        </div>

                        {/* Bathrooms */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase">Bathrooms</label>
                          <select
                            value={bathrooms}
                            onChange={(e) => setBathrooms(e.target.value)}
                            className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                          >
                            <option value="1">1 Bathroom</option>
                            <option value="2">2 Bathrooms</option>
                            <option value="3">3 Bathrooms</option>
                            <option value="4">4 Bathrooms</option>
                            <option value="5">5+ Luxury Baths</option>
                          </select>
                        </div>

                        {/* Furnishing Status */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase">Furnishing Status</label>
                          <select
                            value={furnishing}
                            onChange={(e) => setFurnishing(e.target.value)}
                            className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                          >
                            <option value="Designer Fitted">Designer Fitted</option>
                            <option value="Fully Furnished">Fully Furnished</option>
                            <option value="Semi-Furnished">Semi-Furnished</option>
                            <option value="Unfurnished">Unfurnished</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 sm:col-span-2 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span><strong>Plot / Land Detected:</strong> Room, washroom, and furnishing fields are automatically omitted for plots.</span>
                      </div>
                    )}

                    {/* Property Facing */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-[#0F382C]" />
                        <span>Property Facing</span>
                      </label>
                      <select
                        value={facing}
                        onChange={(e) => setFacing(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                      >
                        <option value="North-East (Vastu)">North-East (Vastu)</option>
                        <option value="East">East</option>
                        <option value="North">North</option>
                        <option value="North-West">North-West</option>
                        <option value="South">South</option>
                        <option value="South-East">South-East</option>
                        <option value="South-West">South-West</option>
                        <option value="West">West</option>
                        <option value="Park Facing">Park Facing</option>
                        <option value="Taj View (South-East)">Taj View (South-East)</option>
                      </select>
                    </div>

                    {/* Construction / Possession Status */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0F382C]" />
                        <span>Construction / Possession Status</span>
                      </label>
                      <select
                        value={possession}
                        onChange={(e) => setPossession(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-[#0F382C]"
                      >
                        <option value="Ready to Move">Ready to Move</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="Newly Launched">Newly Launched</option>
                        <option value="Immediate Possession">Immediate Possession</option>
                        <option value="Ready for Construction / Registry">Ready for Construction / Registry</option>
                        <option value="Immediate Registry">Immediate Registry</option>
                      </select>
                    </div>

                    {/* Price */}
                    <div className="space-y-2 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">
                        {listingIntent === 'Sale' ? 'Expected Sale Price (₹ INR)' : 'Expected Monthly Rent (₹ INR)'}
                      </label>
                      <input
                        type="number"
                        required
                        value={askingPrice}
                        onChange={(e) => setAskingPrice(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-mono focus:bg-white focus:border-[#0F382C]"
                      />
                      <span className="text-[11px] text-gray-500 font-mono block">
                        ≈ {formatPriceDisplay(Number(askingPrice) || 0, listingIntent)}
                      </span>
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
                      <span>Continue to Amenities, Nearby & Photos</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Amenities, Nearby Areas & Photos */}
              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-serif-luxury font-bold text-[#0F382C]">
                      Step 3: Amenities, Nearby Areas & Photos
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Select property amenities, highlight nearby landmarks for the public website, and upload photos with a primary display cover image.
                    </p>
                  </div>

                  {/* 1. Amenities */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
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

                  {/* 2. Nearby Areas of Property to show on live website */}
                  <div className="p-5 bg-gray-50/90 rounded-2xl border border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-[#0F382C] uppercase tracking-wider flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-[#0F382C]" />
                          <span>Nearby Areas & Landmarks (Shown on Live Website)</span>
                        </label>
                        <p className="text-[11px] text-gray-600 mt-0.5">
                          Choose transit points, monuments, and hubs near your property to show prospective buyers on the live website.
                        </p>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {landmarks.length} Selected
                      </span>
                    </div>

                    {/* Quick Preset Badges */}
                    <div>
                      <span className="text-[11px] font-bold text-gray-600 block mb-2">Quick Select Agra Landmarks:</span>
                      <div className="flex flex-wrap gap-2">
                        {AGRA_LANDMARK_PRESETS.map((preset) => {
                          const isSelected = landmarks.some(l => l.name === preset.name);
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => toggleLandmarkPreset(preset)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-[#0F382C] text-[#E4D5B7] border-[#0F382C] shadow-xs'
                                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <span>{preset.name}</span>
                              <span className="text-[10px] opacity-75">({preset.distance})</span>
                              {isSelected ? <Check className="w-3 h-3 text-[#E4D5B7]" /> : <Plus className="w-3 h-3 text-gray-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Nearby Area Input */}
                    <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                      <span className="text-[11px] font-bold text-gray-700 block">Add Custom Nearby Location:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="e.g. St. Conrad's School or Heritage Mall"
                          value={customLandmarkName}
                          onChange={(e) => setCustomLandmarkName(e.target.value)}
                          className="sm:col-span-2 p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Distance (e.g. 1.5 km)"
                          value={customLandmarkDist}
                          onChange={(e) => setCustomLandmarkDist(e.target.value)}
                          className="p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomLandmark}
                          className="px-3 py-2 bg-[#0F382C] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#164E3D] flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Area</span>
                        </button>
                      </div>
                    </div>

                    {/* Selected Nearby Areas Chips */}
                    {landmarks.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-gray-500 block">Current Selected Landmarks for Live Display:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {landmarks.map((l, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg text-xs shadow-2xs">
                              <div className="flex items-center gap-2 truncate">
                                <MapPin className="w-3.5 h-3.5 text-[#0F382C] shrink-0" />
                                <span className="font-semibold text-gray-900 truncate">{l.name}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-mono text-gray-500 text-[11px]">{l.distance}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLandmark(idx)}
                                  className="text-gray-400 hover:text-red-500 p-0.5"
                                  title="Remove nearby area"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Photo Upload & Primary Display Cover Selector */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-[#0F382C] uppercase tracking-wider">
                          Upload Property Photos & Select Display Cover
                        </label>
                        <p className="text-[11px] text-gray-600 mt-0.5">
                          Upload photos from your computer or phone. Choose which image is the main display photo shown on search cards.
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500">
                        {images.length}/10 Photos
                      </span>
                    </div>

                    {imageError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
                        <span>{imageError}</span>
                        <button type="button" onClick={() => setImageError('')} className="font-bold text-sm">✕</button>
                      </div>
                    )}

                    {/* Upload Drag & Drop Box */}
                    <div
                      id="upload-property-photos-dropzone"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#0F382C]/30 hover:border-[#0F382C] bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all hover:bg-emerald-50/20 group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="w-12 h-12 bg-emerald-100 group-hover:bg-emerald-200 text-[#0F382C] rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                        <Upload className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-[#0F382C]">
                        {isUploading ? 'Processing & Compressing Photos...' : 'Click to Upload Property Images from Your Device'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                        JPEG, PNG, WebP supported. High-resolution images are automatically compressed for cloud storage safety.
                      </p>
                    </div>

                    {/* Empty state notice */}
                    {images.length === 0 && (
                      <div className="p-4 bg-emerald-50/60 border border-dashed border-emerald-300 rounded-xl text-center space-y-1 animate-fadeIn">
                        <p className="text-xs font-bold text-[#0F382C]">
                          📸 No property photos uploaded yet
                        </p>
                        <p className="text-[11px] text-gray-600">
                          Click the box above to choose photos from your phone or computer. You can upload up to 10 photos and pick any photo as the main display cover image.
                        </p>
                      </div>
                    )}

                    {/* Uploaded Photos Grid with Primary Display Selector */}
                    {images.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-700 uppercase">
                            Property Photos ({images.length})
                          </span>
                          <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>Click ⭐ to set an image as the main Display Cover</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {images.map((img, idx) => {
                            const isDisplayCover = idx === selectedDisplayIndex;
                            return (
                              <div
                                key={idx}
                                className={`relative rounded-xl overflow-hidden border-2 bg-gray-900 group transition-all ${
                                  isDisplayCover
                                    ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-md scale-[1.02]'
                                    : 'border-gray-200 hover:border-gray-400'
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`Property Photo ${idx + 1}`}
                                  className="w-full h-28 object-cover"
                                />

                                {/* Display Cover Tag or Button */}
                                {isDisplayCover ? (
                                  <div className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                                    <span>Display Cover</span>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedDisplayIndex(idx)}
                                    className="absolute top-2 left-2 bg-black/70 hover:bg-emerald-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                    title="Set as display cover photo"
                                  >
                                    <Star className="w-3 h-3" />
                                    <span>Set as Cover</span>
                                  </button>
                                )}

                                {/* Delete photo button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteImage(idx)}
                                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete photo"
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}
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
                      <span>Continue to Legal & Contact</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Legal Verification & Owner Contact (Title & Land Conversion Removed) */}
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
                          placeholder="owner@royalagraestate.in"
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
