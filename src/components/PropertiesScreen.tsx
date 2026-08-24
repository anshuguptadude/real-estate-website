import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Property, FilterState, PropertyType, ListingType } from '../types';
import { PropertyCard } from './PropertyCard';
import { PropertySkeletonGrid } from './PropertyCardSkeleton';
import { AGRA_LOCALITIES, PROPERTY_TYPES } from '../data/mockData';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Map, 
  X, 
  IndianRupee, 
  RotateCcw,
  Sparkles,
  MapPin,
  Building,
  Check
} from 'lucide-react';

interface PropertiesScreenProps {
  properties: Property[];
  filterState: FilterState;
  onUpdateFilters: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onSelectProperty: (property: Property) => void;
  onToggleSave: (id: string) => void;
  savedIds: string[];
  onBookVisit: (property: Property) => void;
  onToggleCompare: (property: Property) => void;
  compareList: Property[];
  onOpenCompareModal: () => void;
  onInquireContact?: (property: Property) => void;
  isAdminUser?: boolean;
  onDeleteProperty?: (id: string) => void;
}

export const PropertiesScreen: React.FC<PropertiesScreenProps> = ({
  properties,
  filterState,
  onUpdateFilters,
  onResetFilters,
  onSelectProperty,
  onToggleSave,
  savedIds,
  onBookVisit,
  onToggleCompare,
  compareList,
  onOpenCompareModal,
  onInquireContact,
  isAdminUser,
  onDeleteProperty
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger skeleton loading briefly when filters or search query changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [
    filterState.searchQuery,
    filterState.locality,
    filterState.propertyType,
    filterState.listingType,
    filterState.priceRange?.[0],
    filterState.priceRange?.[1],
    filterState.bhk,
    filterState.possession,
    filterState.furnishing,
    filterState.sortBy
  ]);

  // Filtered properties computation
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // 1. Search Query
      if (filterState.searchQuery) {
        const query = filterState.searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchLocation = item.location.toLowerCase().includes(query);
        const matchLocality = item.locality.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        if (!matchTitle && !matchLocation && !matchLocality && !matchDesc) return false;
      }

      // 2. Listing Type
      if (filterState.listingType === 'Rent' && item.listingType !== 'Rent') return false;
      if (filterState.listingType === 'Buy' && item.listingType !== 'Sale') return false;
      if (filterState.listingType === 'Commercial' && item.propertyType !== 'Commercial / Retail') return false;
      if (filterState.listingType === 'Plots' && item.propertyType !== 'Gated Township Plot') return false;

      // 3. Locality
      if (filterState.locality && filterState.locality !== 'All Localities') {
        if (!item.locality.toLowerCase().includes(filterState.locality.toLowerCase()) &&
            !item.location.toLowerCase().includes(filterState.locality.toLowerCase())) {
          return false;
        }
      }

      // 4. Property Type
      if (filterState.propertyType && filterState.propertyType !== 'All') {
        if (item.propertyType !== filterState.propertyType) return false;
      }

      // 5. Price Range
      if (filterState.priceRange) {
        const [min, max] = filterState.priceRange;
        if (item.price < min || item.price > max) return false;
      }

      // 6. BHK
      if (filterState.bhk) {
        const bhkNum = parseInt(filterState.bhk, 10);
        if (!isNaN(bhkNum)) {
          if (bhkNum >= 5 ? item.bedrooms < 5 : item.bedrooms !== bhkNum) return false;
        }
      }

      // 7. Possession
      if (filterState.possession && filterState.possession !== 'all') {
        if (!item.possession.toLowerCase().includes(filterState.possession.toLowerCase())) return false;
      }

      // 8. Furnishing
      if (filterState.furnishing && filterState.furnishing !== 'all') {
        if (item.furnishing !== filterState.furnishing) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-asc') return a.price - b.price;
      if (filterState.sortBy === 'price-desc') return b.price - a.price;
      if (filterState.sortBy === 'area-desc') return b.superAreaSqFt - a.superAreaSqFt;
      if (filterState.sortBy === 'newest') return b.yearBuilt - a.yearBuilt;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [properties, filterState]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#0F382C]">
                Exclusive Agra Property Portfolio
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Showing <strong className="text-[#0F382C]">{filteredProperties.length}</strong> luxury properties in Agra with verified clear titles.
              </p>
            </div>

            {/* Quick Actions / Compare Bar Trigger */}
            <div className="flex items-center gap-3">
              {compareList.length > 0 && (
                <button
                  type="button"
                  id="open-compare-bar-btn"
                  onClick={onOpenCompareModal}
                  className="bg-[#0F382C] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:bg-[#164E3D] flex items-center gap-2"
                >
                  <Building className="w-4 h-4 text-[#E4D5B7]" />
                  <span>Compare ({compareList.length}/3)</span>
                </button>
              )}

              {/* View Layout Toggle */}
              <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-2xs">
                <button
                  type="button"
                  id="view-grid-btn"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#0F382C] text-white' : 'text-gray-500 hover:text-[#0F382C]'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  id="view-list-btn"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#0F382C] text-white' : 'text-gray-500 hover:text-[#0F382C]'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  id="view-map-btn"
                  onClick={() => setViewMode('map')}
                  className={`p-1.5 rounded ${viewMode === 'map' ? 'bg-[#0F382C] text-white' : 'text-gray-500 hover:text-[#0F382C]'}`}
                  title="Interactive Map"
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Trigger */}
              <button
                type="button"
                id="mobile-filter-open-btn"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden bg-white border border-gray-200 text-[#0F382C] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Quick Search & Sort Bar */}
          <div className="mt-6 bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Search input */}
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                id="properties-search-input"
                placeholder="Search by title, location, landmark (e.g. Fatehabad, Pool, Taj)..."
                value={filterState.searchQuery}
                onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-[#0F382C] focus:ring-1 focus:ring-[#0F382C]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Quick Listing Type Pills */}
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto no-scrollbar">
              {(['Buy', 'Rent', 'Commercial', 'Plots'] as ListingType[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onUpdateFilters({ listingType: tab })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    filterState.listingType === tab
                      ? 'bg-[#0F382C] text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'Plots' ? 'Plots / Land' : tab}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Sort:</span>
              <select
                id="properties-sort-select"
                value={filterState.sortBy}
                onChange={(e) => onUpdateFilters({ sortBy: e.target.value as any })}
                className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-gray-800 focus:ring-1 focus:ring-[#0F382C]"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="area-desc">Area: Largest First</option>
                <option value="newest">Newest Constructed</option>
              </select>
            </div>

          </div>
        </div>

        {/* Main Layout Grid: Sidebar Filters + Property Cards List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-2xs space-y-6 sticky top-24">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#0F382C]" />
                  <h3 className="font-serif-luxury font-bold text-base text-[#0F382C]">Filters</h3>
                </div>
                <button
                  type="button"
                  id="reset-filters-sidebar-btn"
                  onClick={onResetFilters}
                  className="text-xs text-gray-500 hover:text-[#0F382C] font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 1. Locality in Agra */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Agra Locality
                </label>
                <select
                  value={filterState.locality}
                  onChange={(e) => onUpdateFilters({ locality: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-800 focus:bg-white focus:border-[#0F382C]"
                >
                  {AGRA_LOCALITIES.map((loc) => (
                    <option key={loc} value={loc === 'All Localities' ? '' : loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Property Type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Property Type
                </label>
                <div className="space-y-1">
                  {PROPERTY_TYPES.map((type) => {
                    const isChecked = (type === 'All' && filterState.propertyType === 'All') || filterState.propertyType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => onUpdateFilters({ propertyType: type as PropertyType })}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium flex items-center justify-between transition-colors ${
                          isChecked ? 'bg-[#0F382C] text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{type}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-[#E4D5B7]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. BHK Bedrooms */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Bedrooms / BHK
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['', '2', '3', '4', '5'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => onUpdateFilters({ bhk: b })}
                      className={`py-1.5 text-xs font-bold rounded border transition-all ${
                        filterState.bhk === b
                          ? 'bg-[#0F382C] text-white border-[#0F382C]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {b === '' ? 'Any' : b === '5' ? '5+' : `${b}BHK`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Possession Status */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Possession
                </label>
                <select
                  value={filterState.possession}
                  onChange={(e) => onUpdateFilters({ possession: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-800 focus:bg-white"
                >
                  <option value="all">Any Possession</option>
                  <option value="Ready to Move">Ready to Move</option>
                  <option value="Immediate">Immediate</option>
                  <option value="Under Construction">Under Construction</option>
                </select>
              </div>

              {/* 5. Furnishing */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Furnishing
                </label>
                <select
                  value={filterState.furnishing}
                  onChange={(e) => onUpdateFilters({ furnishing: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-800 focus:bg-white"
                >
                  <option value="all">Any Furnishing</option>
                  <option value="Designer Fitted">Designer Fitted</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

            </div>
          </aside>

          {/* MAIN PROPERTIES CONTENT */}
          <main className="lg:col-span-3">
            
            {/* View Mode: Map View */}
            {viewMode === 'map' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden p-4 mb-6 shadow-sm">
                <div className="relative aspect-[16/9] bg-emerald-950 rounded-lg overflow-hidden flex items-center justify-center border border-[#164E3D]">
                  
                  {/* Decorative Map Vector Representation with plotted Agra Pins */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C5A869_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
                  
                  {/* Agra Landmarks on Map */}
                  <div className="absolute top-1/4 left-1/3 text-center pointer-events-none">
                    <div className="px-2 py-1 bg-amber-500/20 border border-amber-400 rounded text-[10px] text-amber-300 font-bold">
                      🏛️ Taj Mahal Heritage Corridor
                    </div>
                  </div>

                  <div className="absolute bottom-1/3 right-1/4 text-center pointer-events-none">
                    <div className="px-2 py-1 bg-emerald-500/20 border border-emerald-400 rounded text-[10px] text-emerald-300 font-bold">
                      🛣️ Fatehabad Road Prime Strip
                    </div>
                  </div>

                  <div className="absolute top-1/3 right-1/3 text-center pointer-events-none">
                    <div className="px-2 py-1 bg-blue-500/20 border border-blue-400 rounded text-[10px] text-blue-300 font-bold">
                      🌊 Yamuna Riverfront (Dayalbagh)
                    </div>
                  </div>

                  {/* Interactive Property Pin Markers */}
                  <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 p-6 max-w-lg text-center">
                    {filteredProperties.slice(0, 4).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelectProperty(p)}
                        className="bg-white hover:bg-[#E4D5B7] text-[#0F382C] px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5 border border-[#0F382C]"
                      >
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        <span>{p.title.split(' ')[0]} ({p.priceDisplay})</span>
                      </button>
                    ))}
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] px-3 py-1.5 rounded-md">
                    📍 Agra Metro Corridor & Prime Real Estate Map
                  </div>
                </div>
              </div>
            )}

            {/* View Mode: List View or Grid View with Skeleton Loading */}
            {isLoading ? (
              <PropertySkeletonGrid count={6} viewMode={viewMode === 'list' ? 'list' : 'grid'} />
            ) : filteredProperties.length > 0 ? (
              <motion.div 
                layout
                className={
                  viewMode === 'list'
                    ? 'space-y-6'
                    : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                }
              >
                <AnimatePresence mode="popLayout">
                  {filteredProperties.map((property) => (
                    <motion.div
                      layout
                      key={property.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <PropertyCard
                        property={property}
                        onSelect={onSelectProperty}
                        onToggleSave={onToggleSave}
                        isSaved={savedIds.includes(property.id)}
                        onBookVisit={onBookVisit}
                        onToggleCompare={onToggleCompare}
                        isComparing={compareList.some(p => p.id === property.id)}
                        onInquireContact={onInquireContact}
                        isAdminUser={isAdminUser}
                        onDeleteProperty={onDeleteProperty}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-serif-luxury font-bold text-[#0F382C]">
                  No matching luxury properties found
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                  Try broadening your search criteria, switching localities, or adjusting your price filters.
                </p>
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="mt-5 px-5 py-2.5 bg-[#0F382C] text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-[#164E3D]"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
};
