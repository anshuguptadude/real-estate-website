import React from 'react';
import { Property } from '../types';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';

interface SavedPropertiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onRemove: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const SavedPropertiesDrawer: React.FC<SavedPropertiesDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onRemove,
  onSelectProperty
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-5 bg-[#0F382C] text-white flex items-center justify-between border-b border-[#164E3D]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#E4D5B7] fill-[#E4D5B7]" />
            <h3 className="font-serif-luxury font-bold text-lg text-white">
              Saved Favorites ({savedProperties.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-[#164E3D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {savedProperties.length === 0 ? (
            <div className="text-center py-16 text-gray-500 space-y-2">
              <Heart className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-semibold text-sm">No saved properties yet</p>
              <p className="text-xs text-gray-400">Click the heart icon on any estate card to save for later.</p>
            </div>
          ) : (
            savedProperties.map((p) => (
              <div
                key={p.id}
                className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex gap-3 items-center group relative hover:bg-gray-100/80 transition-colors"
              >
                <img src={p.coverImage} alt={p.title} className="w-20 h-16 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      onSelectProperty(p);
                      onClose();
                    }}
                    className="text-xs font-bold text-[#0F382C] hover:underline truncate cursor-pointer"
                  >
                    {p.title}
                  </h4>
                  <span className="text-[11px] text-gray-500 block truncate">{p.locality}</span>
                  <span className="text-xs font-serif-luxury font-bold text-gray-900 block mt-0.5">{p.priceDisplay}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#0F382C] hover:bg-[#164E3D] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
          >
            Continue Browsing
          </button>
        </div>

      </div>
    </div>
  );
};
