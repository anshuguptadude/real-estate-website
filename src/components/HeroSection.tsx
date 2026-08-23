import React, { useState } from 'react';
import { PropertyType, FilterState } from '../types';
import { AGRA_LOCALITIES, PROPERTY_TYPES } from '../data/mockData';
import { Search, MapPin, Home, IndianRupee, Sparkles, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (filters: Partial<FilterState>) => void;
  onSelectLocality: (locality: string) => void;
  onExploreProjects: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
}) => {
  const [locality, setLocality] = useState<string>('All Localities');
  const [propertyType, setPropertyType] = useState<PropertyType>('Luxury Villa');
  const [budgetRange, setBudgetRange] = useState<string>('all');

  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let priceMin = 0;
    let priceMax = 250000000;

    if (budgetRange === 'under-25l') {
      priceMin = 0;
      priceMax = 2500000;
    } else if (budgetRange === '25l-50l') {
      priceMin = 2500000;
      priceMax = 5000000;
    } else if (budgetRange === '50l-1cr') {
      priceMin = 5000000;
      priceMax = 10000000;
    } else if (budgetRange === 'under-1cr') {
      priceMin = 0;
      priceMax = 10000000;
    } else if (budgetRange === '1cr-3cr') {
      priceMin = 10000000;
      priceMax = 30000000;
    } else if (budgetRange === '3cr-5cr') {
      priceMin = 30000000;
      priceMax = 50000000;
    } else if (budgetRange === '5cr-10cr') {
      priceMin = 50000000;
      priceMax = 100000000;
    } else if (budgetRange === '10cr-plus') {
      priceMin = 100000000;
      priceMax = 250000000;
    }

    onSearch({
      listingType: 'Buy',
      locality: locality === 'All Localities' ? '' : locality,
      propertyType: propertyType === 'All' ? 'All' : propertyType,
      priceRange: [priceMin, priceMax],
    });
  };

  return (
    <section className="relative min-h-[500px] lg:min-h-[560px] bg-[#0A261E] overflow-hidden flex flex-col justify-center">
      
      {/* Background Image: High-resolution atmospheric Taj Mahal at dusk with deep dark emerald gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2400&q=90"
          alt="Taj Mahal Agra Heritage Architecture at Dusk"
          className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-105"
        />
        {/* Dark emerald green overlay (#0F382C) for crisp readability */}
        <div className="absolute inset-0 bg-[#0F382C]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A261E] via-[#0F382C]/70 to-[#0F382C]/85" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 w-full">
        
        {/* Top Badges & Headings */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4D5B7]/15 border border-[#C5A869]/30 text-[#E4D5B7] text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A869]" />
            <span>The Premier Luxury Realty Portal in Agra</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-white tracking-tight leading-[1.15] drop-shadow-md">
            Discover Agra’s Most Exclusive Residences
          </h1>
        </div>

        {/* HERO SEARCH CONTAINER: Crisp, clean 3 inline fields with vertical divider lines & dark emerald green Search button */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-2xl sm:rounded-full shadow-2xl p-2 sm:p-2.5 border border-gray-100/90 transition-all">
            <form onSubmit={handleExecuteSearch} className="flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
              
              {/* Field 1: Location */}
              <div className="w-full sm:flex-1 px-4 py-3 sm:py-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0F382C]" />
                  <span>Location</span>
                </label>
                <div className="relative">
                  <select
                    id="hero-locality-select"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none appearance-none cursor-pointer pr-5"
                  >
                    <option value="All Localities">Taj Ganj, Sikandra, Fatehabad...</option>
                    {AGRA_LOCALITIES.filter(l => l !== 'All Localities').map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Field 2: Property Type */}
              <div className="w-full sm:flex-1 px-4 py-3 sm:py-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#0F382C]" />
                  <span>Property Type</span>
                </label>
                <div className="relative">
                  <select
                    id="hero-type-select"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none appearance-none cursor-pointer pr-5"
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type === 'All' ? 'All Property Types' : type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Field 3: Budget */}
              <div className="w-full sm:flex-1 px-4 py-3 sm:py-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-[#0F382C]" />
                  <span>Budget</span>
                </label>
                <div className="relative">
                  <select
                    id="hero-budget-select"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none appearance-none cursor-pointer pr-5"
                  >
                    <option value="all">Any Budget</option>
                    <option value="under-25l">Under ₹25 Lakh</option>
                    <option value="25l-50l">₹25 Lakh – ₹50 Lakh</option>
                    <option value="50l-1cr">₹50 Lakh – ₹1.00 Cr</option>
                    <option value="1cr-3cr">₹1.00 Cr – ₹3.00 Cr</option>
                    <option value="3cr-5cr">₹3.00 Cr – ₹5.00 Cr</option>
                    <option value="5cr-10cr">₹5.00 Cr – ₹10.00 Cr</option>
                    <option value="10cr-plus">₹10.00 Cr+ (Luxury)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Far-Right Search Button: Solid dark emerald green rounded button */}
              <div className="w-full sm:w-auto p-1.5 sm:p-0">
                <button
                  type="submit"
                  id="hero-submit-search-btn"
                  className="w-full sm:w-auto bg-[#0F382C] hover:bg-[#164E3D] text-white px-8 py-3.5 sm:py-3.5 rounded-xl sm:rounded-full font-bold text-sm tracking-wide shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4 text-[#E4D5B7]" />
                  <span>Search</span>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

    </section>
  );
};
