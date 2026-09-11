import React, { useState, useEffect, useRef } from 'react';
import { Property, PropertyType } from '../types';
import { AGRA_LOCALITIES, PROPERTY_TYPES } from '../data/mockData';
import { X, Building2, Image as ImageIcon, IndianRupee, Save, Trash2, Plus, Upload, Star, Loader2, Check } from 'lucide-react';

interface EditPropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProperty: Property) => void;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  property,
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState(property?.title || '');
  const [tagline, setTagline] = useState(property?.tagline || '');
  const [price, setPrice] = useState<number>(property?.price || 0);
  const [propertyType, setPropertyType] = useState<PropertyType>(property?.propertyType || 'Luxury Villa');
  const [locality, setLocality] = useState(property?.locality || 'Fatehabad Road');
  const [address, setAddress] = useState(property?.address || '');
  const [superAreaSqFt, setSuperAreaSqFt] = useState(property?.superAreaSqFt || 0);
  const [bedrooms, setBedrooms] = useState(property?.bedrooms || 0);
  const [bathrooms, setBathrooms] = useState(property?.bathrooms || 0);
  const [furnishing, setFurnishing] = useState(property?.furnishing || 'Fully Furnished');
  const [possession, setPossession] = useState(property?.possession || 'Ready to Move');
  const [coverImage, setCoverImage] = useState(property?.coverImage || '');
  const [images, setImages] = useState<string[]>(
    property?.images && property.images.length > 0 
      ? property.images 
      : (property?.coverImage ? [property.coverImage] : [])
  );
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Property['status']>(property?.status || 'Active');
  const [verified, setVerified] = useState<boolean>(property?.verified ?? true);
  const [verifiedBy, setVerifiedBy] = useState<string>(property?.verifiedBy || 'Agra Development Authority (ADA)');
  const [verificationNumber, setVerificationNumber] = useState<string>(property?.verificationNumber || '');

  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setTagline(property.tagline);
      setPrice(property.price);
      setPropertyType(property.propertyType);
      setLocality(property.locality);
      setAddress(property.address);
      setSuperAreaSqFt(property.superAreaSqFt);
      setBedrooms(property.bedrooms);
      setBathrooms(property.bathrooms);
      setFurnishing(property.furnishing);
      setPossession(property.possession);
      const initialImages = property.images && property.images.length > 0
        ? property.images
        : (property.coverImage ? [property.coverImage] : []);
      setImages(initialImages);
      setCoverImage(property.coverImage || initialImages[0] || '');
      setStatus(property.status || 'Active');
      setVerified(property.verified ?? true);
      setVerifiedBy(property.verifiedBy || 'Agra Development Authority (ADA)');
      setVerificationNumber(property.verificationNumber || '');
      setImageError('');
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const formatPriceDisplay = (amt: number, type: 'Sale' | 'Rent') => {
    if (type === 'Rent') {
      if (amt >= 100000) return `₹${(amt / 100000).toFixed(2)} Lac/mo`;
      return `₹${amt.toLocaleString('en-IN')}/mo`;
    }
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(2)} Cr`;
    return `₹${(amt / 100000).toFixed(2)} Lacs`;
  };

  const MAX_PHOTOS = 10;
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxDimension = 1400;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.70);
            resolve(compressedDataUrl);
          } else {
            resolve(readerEvent.target?.result as string);
          }
        };
        img.onerror = () => {
          resolve(readerEvent.target?.result as string);
        };
        img.src = readerEvent.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPictures = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= MAX_PHOTOS) {
      setImageError(`Maximum ${MAX_PHOTOS} photos allowed per property. Please delete an existing photo first.`);
      return;
    }

    const remainingSlots = MAX_PHOTOS - images.length;
    let validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setImageError('Only photo uploads (JPEG, PNG, WebP, HEIC) are allowed.');
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setImageError(`"${file.name}" exceeds the maximum 10 MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > remainingSlots) {
      setImageError(`Maximum ${MAX_PHOTOS} photos allowed. Only the first ${remainingSlots} photo(s) were added.`);
      validFiles = validFiles.slice(0, remainingSlots);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const newImages: string[] = [];
      for (const file of validFiles) {
        const compressed = await compressImage(file);
        newImages.push(compressed);
      }

      if (newImages.length > 0) {
        setImages((prev) => {
          const updated = [...prev, ...newImages];
          if (!coverImage && updated.length > 0) {
            setCoverImage(updated[0]);
          }
          return updated;
        });
      }
    } catch (err) {
      console.error('Failed to process image uploads:', err);
      setImageError('Failed to process one or more images. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setImageError('');
    if (images.length <= 1) {
      setImageError('A property must have at least one photo. Upload a replacement before deleting this one.');
      return;
    }
    const targetUrl = images[indexToDelete];
    const updated = images.filter((_, idx) => idx !== indexToDelete);
    setImages(updated);

    if (coverImage === targetUrl) {
      setCoverImage(updated[0] || '');
    }
  };

  const handleSetCoverImage = (imgUrl: string) => {
    setCoverImage(imgUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCover = coverImage || images[0] || property.coverImage || '';
    const finalImages = images.length > 0 ? images : (finalCover ? [finalCover] : []);

    const updated: Property = {
      ...property,
      title,
      tagline,
      price,
      priceDisplay: formatPriceDisplay(price, property.listingType),
      pricePerSqFt: superAreaSqFt > 0 ? Math.round(price / superAreaSqFt) : property.pricePerSqFt,
      propertyType,
      locality,
      location: `${locality}, Agra`,
      address: address.trim() || property.address || `${locality}, Agra`,
      superAreaSqFt,
      bedrooms,
      bathrooms,
      furnishing,
      possession,
      coverImage: finalCover,
      images: finalImages,
      status,
      isApproved: status === 'published' || status === 'Active' || Boolean(property.isApproved),
      isDeleted: false,
      verified,
      verificationStatus: verified ? 'Verified' : 'Not Verified',
      verifiedBy: verified ? verifiedBy : 'Not Verified / Independent Private Registry',
      verificationNumber: verificationNumber.trim() || undefined
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative my-8">
        
        {/* Header */}
        <div className="bg-[#0F382C] text-white p-6 flex items-center justify-between border-b border-[#164E3D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E4D5B7] text-[#0F382C] flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-white">
                Edit Property Listing
              </h3>
              <p className="text-xs text-[#E4D5B7]">
                Update details, pricing, and media for #{property.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-[#164E3D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status Selection */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Listing Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Active', 'Sold', 'Rented'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st === 'Active' ? 'published' : st)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    status === st || (st === 'Active' && status === 'published')
                      ? st === 'Active'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {st === 'Active' ? '● Active Listing' : st === 'Sold' ? '✓ Mark as Sold' : '✓ Mark as Rented'}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Property Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Tagline / Short Highlights
              </label>
              <textarea
                rows={2}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
              />
            </div>
          </div>

          {/* Pricing & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Asking Price (₹ INR)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono focus:bg-white focus:border-[#0F382C]"
              />
              <span className="text-[11px] text-gray-500 font-mono mt-1 block">
                Preview: {formatPriceDisplay(price, property.listingType)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Super Area (Sq.Ft)
              </label>
              <input
                type="number"
                required
                value={superAreaSqFt}
                onChange={(e) => setSuperAreaSqFt(Number(e.target.value))}
                className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
              />
            </div>
          </div>

          {/* Property Type & Locality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white"
              >
                {PROPERTY_TYPES.filter(t => t !== 'All').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Agra Locality
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white"
              >
                {AGRA_LOCALITIES.filter(l => l !== 'All Localities').map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Complete Exact Address (Admin Editable) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center justify-between">
              <span>Complete Exact Address / House No. & Plot *</span>
              <span className="text-[10px] text-amber-700 font-semibold">
                🔒 Confidential: Visible only to Admins
              </span>
            </label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Plot 18, Royal Enclave, Near Hotel ITC Mughal, Fatehabad Road, Agra"
              className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C]"
            />
          </div>

          {/* Bedrooms, Bathrooms, Furnishing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bedrooms</label>
              <input
                type="number"
                min="0"
                max="20"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bathrooms</label>
              <input
                type="number"
                min="0"
                max="20"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Furnishing</label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value as any)}
                className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              >
                <option value="Designer Fitted">Designer Fitted</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Legal & Authority Verification */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Legal & Authority Approval Status
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVerified(true)}
                  className={`px-3 py-1 text-xs rounded-md font-bold transition-all ${
                    verified
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ✓ Verified
                </button>
                <button
                  type="button"
                  onClick={() => setVerified(false)}
                  className={`px-3 py-1 text-xs rounded-md font-bold transition-all ${
                    !verified
                      ? 'bg-gray-800 text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ✕ Independent / Not ADA
                </button>
              </div>
            </div>

            {verified && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Approved / Verified By
                  </label>
                  <select
                    value={verifiedBy}
                    onChange={(e) => setVerifiedBy(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 font-medium"
                  >
                    <option value="Agra Development Authority (ADA)">Agra Development Authority (ADA)</option>
                    <option value="UP RERA (Real Estate Regulatory Authority)">UP RERA (Real Estate Regulatory Authority)</option>
                    <option value="Tehsil Registry / Sub-Registrar Agra">Tehsil Registry / Sub-Registrar Agra</option>
                    <option value="Nagar Nigam Agra (Municipal Corporation)">Nagar Nigam Agra (Municipal Corporation)</option>
                    <option value="Royal Agra Legal Advisory Cell">Royal Agra Legal Advisory Cell</option>
                    <option value="Agra Cantonment Board">Agra Cantonment Board</option>
                    <option value="Nationalized / Private Bank (Home Loan Approved)">Nationalized / Private Bank (Home Loan Approved)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Approval / Sanction / RERA Reference No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ADA/2024/782 or UPRERA"
                    value={verificationNumber}
                    onChange={(e) => setVerificationNumber(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Property Photos Management */}
          <div className="space-y-3 bg-gray-50/80 p-4 sm:p-5 rounded-xl border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#0F382C]" />
                  <span>Property Photo Gallery ({images.length}/{MAX_PHOTOS})</span>
                </label>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  HD Quality • Max 10 Photos, up to 10 MB each. Click any thumbnail to set it as cover.
                </p>
              </div>
              {images.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0F382C] hover:bg-[#164E3D] text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Optimizing HD Photo...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Photo ({MAX_PHOTOS - images.length} left)</span>
                    </>
                  )}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleAddPictures}
              />
            </div>

            {imageError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {imageError}
              </div>
            )}

            {/* Image Grid - Showing ONLY photos for this specific property */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => {
                  const isCover = coverImage === img || (!coverImage && idx === 0);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSetCoverImage(img)}
                      className={`group relative rounded-xl overflow-hidden border-2 bg-gray-100 aspect-[4/3] flex flex-col justify-between transition-all cursor-pointer ${
                        isCover 
                          ? 'border-emerald-600 ring-3 ring-emerald-500/30 shadow-md scale-[1.02]' 
                          : 'border-gray-200 hover:border-gray-400 hover:shadow-xs'
                      }`}
                      title={isCover ? 'Currently active cover photo' : 'Click to set this photo as cover'}
                    >
                      <img
                        src={img}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Hover Overlay */}
                      <div className={`absolute inset-0 bg-black/30 transition-opacity pointer-events-none ${isCover ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />

                      {/* Top Badges & Controls */}
                      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10">
                        {isCover ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                            <Star className="w-3 h-3 fill-current" />
                            <span>★ Active Cover</span>
                          </span>
                        ) : (
                          <span className="bg-black/60 group-hover:bg-emerald-700 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs transition-colors opacity-0 group-hover:opacity-100">
                            Click to set cover
                          </span>
                        )}

                        {/* Delete / Trash Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(idx);
                          }}
                          className="w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer hover:scale-110 ml-auto"
                          title="Delete photo from property"
                          aria-label="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Bottom Photo Index tag */}
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono backdrop-blur-xs">
                        #{idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#0F382C] transition-colors cursor-pointer bg-white"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">No photos remaining</p>
                <p className="text-[11px] text-gray-500 mt-1">Click to upload photos from your device</p>
              </div>
            )}

            {/* Active Photo Preview Area (Updating dynamically based on selections) */}
            {(coverImage || images[0] || property.coverImage) && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Active Photo Preview (Primary Cover)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    ✓ Selected Cover Photo
                  </span>
                </div>
                <div className="relative h-44 sm:h-56 w-full rounded-xl overflow-hidden border-2 border-emerald-600/50 shadow-md bg-gray-900 group">
                  <img
                    src={coverImage || images[0] || property.coverImage}
                    alt="Active Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium border border-white/10">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Active Cover Preview: This image will display as the main cover on search cards and public listings.</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-property-edit-btn"
              className="bg-[#0F382C] hover:bg-[#164E3D] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Listing</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
