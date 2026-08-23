import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Property, PropertyType } from '../types';
import { PropertyCard } from './PropertyCard';
import { PropertySkeletonGrid } from './PropertyCardSkeleton';
import { Sparkles, Award } from 'lucide-react';

interface FeaturedPropertiesProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onToggleSave: (id: string) => void;
  savedIds: string[];
  onBookVisit: (property: Property) => void;
  onExploreAll: () => void;
  onToggleCompare?: (property: Property) => void;
  compareList?: Property[];
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  properties,
  onSelectProperty,
  onToggleSave,
  savedIds,
  onBookVisit,
  onExploreAll,
  onToggleCompare,
  compareList = []
}) => {
  const [selectedFilter, setSelectedFilter] = useState<PropertyType>('All');
  const [isLoading, setIsLoading] = useState(false);

  const filterTabs: { label: string; type: PropertyType }[] = [
    { label: 'All Featured', type: 'All' }
  ];

  const handleTabChange = (type: PropertyType) => {
    if (type === selectedFilter) return;
    setIsLoading(true);
    setSelectedFilter(type);
    setTimeout(() => {
      setIsLoading(false);
    }, 240);
  };

  const filteredProperties = selectedFilter === 'All'
    ? properties
    : properties.filter(p => p.propertyType === selectedFilter);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 pb-6 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F382C]/10 text-[#0F382C] text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5 text-[#0F382C]" />
              <span>Handpicked Portfolio</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#0F382C]">
              Featured Luxury Estates in Agra
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
              Strictly verified clear-title residences offering distinguished architecture, private amenities, and prime connectivity in Agra.
            </p>
          </div>
        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.type;
            return (
              <button
                key={tab.type}
                id={`featured-tab-${tab.type.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => handleTabChange(tab.type)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0F382C] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Properties Grid with Skeleton Loading */}
        {isLoading ? (
          <PropertySkeletonGrid count={3} viewMode="grid" />
        ) : filteredProperties.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
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
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Sparkles className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-serif-luxury font-bold text-gray-800">No properties in this category right now</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">View our full collection across all Agra localities.</p>
            <button
              type="button"
              onClick={() => handleTabChange('All')}
              className="px-4 py-2 bg-[#0F382C] text-white text-xs font-semibold rounded-lg"
            >
              Reset Category
            </button>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#0F382C] to-[#0B2B22] rounded-2xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#164E3D]">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-[#C5A869] font-bold">
              Personalized Private Property Matchmaking
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white">
              Looking for a confidential off-market estate in Agra?
            </h3>
            <p className="text-sm text-gray-300 max-w-xl">
              Many of Agra's most prestigious heritage estates and premium villas are handled discreetly without public listings.
            </p>
          </div>

          <button
            type="button"
            id="featured-vip-advisory-btn"
            onClick={onExploreAll}
            className="bg-[#E4D5B7] hover:bg-[#FAF8F5] text-[#0F382C] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all shrink-0"
          >
            Request Private Advisory
          </button>
        </div>

      </div>
    </section>
  );
};
