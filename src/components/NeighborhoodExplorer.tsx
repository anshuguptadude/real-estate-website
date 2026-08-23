import React from 'react';
import { Neighborhood } from '../types';
import { NEIGHBORHOODS_DATA } from '../data/mockData';
import { MapPin, TrendingUp, ArrowRight, Building, Sparkles } from 'lucide-react';

interface NeighborhoodExplorerProps {
  onSelectLocality: (locality: string) => void;
}

export const NeighborhoodExplorer: React.FC<NeighborhoodExplorerProps> = ({
  onSelectLocality
}) => {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F382C]/10 text-[#0F382C] text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#0F382C]" />
            <span>Agra Micro-Market Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#0F382C]">
            Explore Agra’s Prime Neighborhoods
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            From the 5-star hospitality corridor of Fatehabad Road to the peaceful riverfront of Dayalbagh, discover the unique character, capital appreciation, and luxury residences in each sector.
          </p>
        </div>

        {/* Neighborhoods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {NEIGHBORHOODS_DATA.map((hood) => (
            <div
              key={hood.id}
              className="bg-[#FAF8F5] rounded-xl overflow-hidden border border-gray-200/80 hover:border-[#0F382C]/30 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Image with Tag & Price Overlay */}
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-200">
                <img
                  src={hood.image}
                  alt={hood.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B22]/90 via-[#0B2B22]/30 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-semibold text-[#E4D5B7] uppercase tracking-wider block">
                    {hood.totalListings} Active Luxury Listings
                  </span>
                  <h3 className="text-lg font-serif-luxury font-bold text-white drop-shadow-sm">
                    {hood.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#0F382C] font-semibold mb-2 bg-[#0F382C]/5 px-2.5 py-1 rounded inline-block">
                    <TrendingUp className="w-3.5 h-3.5 inline mr-1 text-[#0F382C]" />
                    Avg: {hood.avgPriceSqFt}
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-3">
                    {hood.description}
                  </p>

                  {/* Key Features Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hood.keyFeatures.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700 font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explore CTA */}
                <button
                  type="button"
                  id={`explore-hood-${hood.id}`}
                  onClick={() => onSelectLocality(hood.name.split(' ')[0])}
                  className="w-full py-2.5 text-xs font-bold text-[#0F382C] hover:text-white bg-white hover:bg-[#0F382C] border border-[#0F382C]/20 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs group"
                >
                  <span>Explore {hood.name.split(' ')[0]} Properties</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
