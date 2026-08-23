import React from 'react';

interface PropertyCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

export const PropertyCardSkeleton: React.FC<PropertyCardSkeletonProps> = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200/80 shadow-xs flex flex-col sm:flex-row animate-pulse">
        {/* Media Placeholder */}
        <div className="relative sm:w-72 md:w-80 aspect-[16/10] sm:aspect-auto bg-gray-200 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
          
          {/* Top-Left Price Badge */}
          <div className="absolute top-3 left-3 w-24 h-7 rounded-md bg-gray-300/80" />
          
          {/* Top-Right Favorite Button */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-300/80" />
          
          {/* Bottom Badges */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            <div className="w-16 h-5 rounded bg-gray-300/80" />
            <div className="w-20 h-5 rounded bg-gray-300/80" />
          </div>
        </div>

        {/* Content Placeholder */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Location */}
            <div className="w-36 h-3.5 rounded bg-gray-200 mb-2.5" />
            
            {/* Title */}
            <div className="w-3/5 h-5 rounded bg-gray-300 mb-2" />
            
            {/* Tagline */}
            <div className="space-y-1.5 mb-4">
              <div className="w-full h-3 rounded bg-gray-200" />
              <div className="w-4/5 h-3 rounded bg-gray-200" />
            </div>

            {/* Key Specs Strip */}
            <div className="grid grid-cols-3 gap-3 py-3 border-y border-gray-100 mb-3 max-w-md">
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
            </div>

            {/* Mini Pills */}
            <div className="flex items-center gap-2">
              <div className="w-20 h-5 rounded bg-gray-100" />
              <div className="w-24 h-5 rounded bg-gray-100" />
              <div className="w-16 h-5 rounded bg-gray-100" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="w-16 h-7 rounded bg-gray-100" />
            <div className="flex items-center gap-2">
              <div className="w-20 h-7 rounded bg-gray-200" />
              <div className="w-16 h-7 rounded bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200/80 shadow-xs flex flex-col h-full animate-pulse">
      {/* Media Placeholder */}
      <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
        
        {/* Top-Left Price Badge */}
        <div className="absolute top-3 left-3 w-24 h-7 rounded-md bg-gray-300/80" />
        
        {/* Top-Right Favorite Button */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-300/80" />
        
        {/* Bottom Badges */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
          <div className="w-16 h-5 rounded bg-gray-300/80" />
          <div className="w-20 h-5 rounded bg-gray-300/80" />
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="w-32 h-3.5 rounded bg-gray-200 mb-2.5" />
          
          {/* Title */}
          <div className="w-4/5 h-5 rounded bg-gray-300 mb-2" />
          
          {/* Tagline */}
          <div className="space-y-1.5 mb-4">
            <div className="w-full h-3 rounded bg-gray-200" />
            <div className="w-3/4 h-3 rounded bg-gray-200" />
          </div>

          {/* Key Specs Strip */}
          <div className="grid grid-cols-3 gap-2 py-3 my-2 border-y border-gray-100">
            <div className="h-4 rounded bg-gray-200" />
            <div className="h-4 rounded bg-gray-200" />
            <div className="h-4 rounded bg-gray-200" />
          </div>

          {/* Mini Pills */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-16 h-5 rounded bg-gray-100" />
            <div className="w-20 h-5 rounded bg-gray-100" />
            <div className="w-16 h-5 rounded bg-gray-100" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="w-16 h-7 rounded bg-gray-100" />
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-18 h-7 rounded bg-gray-200" />
            <div className="w-16 h-7 rounded bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface PropertySkeletonGridProps {
  count?: number;
  viewMode?: 'grid' | 'list';
}

export const PropertySkeletonGrid: React.FC<PropertySkeletonGridProps> = ({ 
  count = 6, 
  viewMode = 'grid' 
}) => {
  return (
    <div 
      className={
        viewMode === 'list'
          ? 'space-y-6'
          : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
      }
    >
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} viewMode={viewMode} />
      ))}
    </div>
  );
};
