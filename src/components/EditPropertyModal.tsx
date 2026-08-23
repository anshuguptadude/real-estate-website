import React, { useState, useEffect } from 'react';
import { Property, PropertyType } from '../types';
import { AGRA_LOCALITIES, PROPERTY_TYPES } from '../data/mockData';
import { X, Building2, Image as ImageIcon, Sparkles, Check, IndianRupee, Save } from 'lucide-react';

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
  const [status, setStatus] = useState<'Active' | 'Sold' | 'Rented'>(property?.status || 'Active');
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
      setCoverImage(property.coverImage);
      setStatus(property.status || 'Active');
      setVerified(property.verified ?? true);
      setVerifiedBy(property.verifiedBy || 'Agra Development Authority (ADA)');
      setVerificationNumber(property.verificationNumber || '');
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

  const handleImagePreset = (url: string) => {
    setCoverImage(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      address,
      superAreaSqFt,
      bedrooms,
      bathrooms,
      furnishing,
      possession,
      coverImage,
      status,
      verified,
      verificationStatus: verified ? 'Verified' : 'Not Verified',
      verifiedBy: verified ? verifiedBy : 'Not Verified / Independent Private Registry',
      verificationNumber: verificationNumber.trim() || undefined
    };
    onSave(updated);
    onClose();
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  ];

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
                  onClick={() => setStatus(st)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    status === st
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

          {/* Cover Image URL / Re-upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Cover Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white"
              />
            </div>

            {/* Quick Image Preview & Presets */}
            <div className="mt-3 flex items-center gap-3 overflow-x-auto py-1">
              <span className="text-[11px] text-gray-500 font-semibold uppercase shrink-0">Sample Presets:</span>
              {sampleImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleImagePreset(img)}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    coverImage === img ? 'border-[#0F382C] scale-105 shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {coverImage && (
              <div className="mt-3 w-full h-36 rounded-xl overflow-hidden border border-gray-200 relative">
                <img src={coverImage} alt="Current Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                  Active Photo Preview
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
