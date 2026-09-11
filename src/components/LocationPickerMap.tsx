import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  CheckCircle2, 
  RotateCcw, 
  Crosshair, 
  Search, 
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Info
} from 'lucide-react';

// Preset neighborhood centers for Agra
export const AGRA_LOCALITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Fatehabad Road': { lat: 27.1585, lng: 78.0494 },
  'Dayalbagh': { lat: 27.2284, lng: 78.0125 },
  'Tajganj': { lat: 27.1658, lng: 78.0421 },
  'Civil Lines': { lat: 27.1994, lng: 78.0039 },
  'Sanjay Place': { lat: 27.2023, lng: 77.9972 },
  'Shastripuram': { lat: 27.2081, lng: 77.9429 },
  'Kamla Nagar': { lat: 27.2215, lng: 78.0267 },
  'Khandari': { lat: 27.2142, lng: 77.9892 },
  'Sikandra': { lat: 27.2206, lng: 77.9504 },
  'Shamshabad Road': { lat: 27.1350, lng: 78.0315 },
  'Agra Cantonment': { lat: 27.1589, lng: 78.0089 },
  'Delhi-Agra NH-19': { lat: 27.2341, lng: 77.9189 },
  'Other / Custom Agra Locality': { lat: 27.1767, lng: 78.0081 }
};

interface LocationPickerMapProps {
  selectedLocality: string;
  coordinates: { lat: number; lng: number };
  onChangeCoordinates: (coords: { lat: number; lng: number }) => void;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  selectedLocality,
  coordinates,
  onChangeCoordinates,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(16);
  const [pasteInput, setPasteInput] = useState<string>('');
  const [pasteSuccess, setPasteSuccess] = useState<boolean>(false);
  const [showCoordinateInputs, setShowCoordinateInputs] = useState<boolean>(false);

  // Auto-pan to selected neighborhood when locality changes
  useEffect(() => {
    if (selectedLocality) {
      const matchedKey = Object.keys(AGRA_LOCALITY_COORDINATES).find(
        k => k.toLowerCase() === selectedLocality.toLowerCase() || 
             selectedLocality.toLowerCase().includes(k.toLowerCase())
      );
      if (matchedKey && AGRA_LOCALITY_COORDINATES[matchedKey]) {
        onChangeCoordinates(AGRA_LOCALITY_COORDINATES[matchedKey]);
      }
    }
  }, [selectedLocality]);

  // Use current live device GPS
  const handleUseCurrentLocation = () => {
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        onChangeCoordinates({
          lat: parseFloat(position.coords.latitude.toFixed(6)),
          lng: parseFloat(position.coords.longitude.toFixed(6)),
        });
      },
      (error) => {
        setIsLocating(false);
        setGeoError('Unable to retrieve your location. Please drop pin manually on map.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fine-tune nudge coordinates
  const handleNudge = (deltaLat: number, deltaLng: number) => {
    onChangeCoordinates({
      lat: parseFloat((coordinates.lat + deltaLat).toFixed(6)),
      lng: parseFloat((coordinates.lng + deltaLng).toFixed(6))
    });
  };

  // Reset to default locality center
  const handleResetToLocality = () => {
    const matchedKey = Object.keys(AGRA_LOCALITY_COORDINATES).find(
      k => k.toLowerCase() === selectedLocality.toLowerCase() || 
           selectedLocality.toLowerCase().includes(k.toLowerCase())
    );
    if (matchedKey && AGRA_LOCALITY_COORDINATES[matchedKey]) {
      onChangeCoordinates(AGRA_LOCALITY_COORDINATES[matchedKey]);
    } else {
      onChangeCoordinates({ lat: 27.1767, lng: 78.0081 });
    }
  };

  // Parse pasted link or coordinates (e.g. 27.1585, 78.0494 or Google Maps URLs)
  const handleParsePastedLocation = () => {
    if (!pasteInput.trim()) return;
    setPasteSuccess(false);

    // Try parsing lat, lng directly (e.g., "27.1585, 78.0494" or "27.1585 78.0494")
    const coordMatch = pasteInput.match(/(-?\d+\.\d+)[\s,]+(-?\d+\.\d+)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        onChangeCoordinates({ lat, lng });
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 3000);
        setPasteInput('');
        return;
      }
    }

    // Try parsing @lat,lng from Google Maps URLs
    const urlMatch = pasteInput.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (urlMatch) {
      const lat = parseFloat(urlMatch[1]);
      const lng = parseFloat(urlMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        onChangeCoordinates({ lat, lng });
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 3000);
        setPasteInput('');
        return;
      }
    }

    setGeoError('Could not parse coordinates. Format as "27.1767, 78.0081" or paste a Google Maps link.');
  };

  return (
    <div className="space-y-3 bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-2xs">
      
      {/* Header & Geolocation CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#0F382C]" />
            <span>Select Exact Location On Google Map</span>
          </label>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Position the pin on your exact plot, villa, or building in {selectedLocality || 'Agra'}.
          </p>
        </div>

        {/* Action Button: GPS Location */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0F382C] border border-emerald-300 rounded-lg text-xs font-bold transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Use device GPS to locate property"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isLocating ? 'Locating GPS...' : 'Use My Live GPS'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetToLocality}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Reset pin to neighborhood center"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {geoError && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-red-500" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Interactive Map Canvas Embed */}
      <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-gray-300 bg-gray-100 shadow-inner group">
        <iframe
          key={`${coordinates.lat}-${coordinates.lng}-${zoomLevel}`}
          title="Property Location Picker Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src={`https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&hl=en&z=${zoomLevel}&output=embed`}
        />

        {/* Top-Left Live Coordinate Tag */}
        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 z-10 border border-white/20 pointer-events-none">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>GPS Pin: {coordinates.lat.toFixed(5)}°N, {coordinates.lng.toFixed(5)}°E</span>
        </div>

        {/* Top-Right Quick Zoom Controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(19, prev + 1))}
            className="w-7 h-7 bg-white/90 hover:bg-white text-gray-800 font-bold rounded-md shadow-md flex items-center justify-center text-sm transition-colors border border-gray-200 cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(12, prev - 1))}
            className="w-7 h-7 bg-white/90 hover:bg-white text-gray-800 font-bold rounded-md shadow-md flex items-center justify-center text-sm transition-colors border border-gray-200 cursor-pointer"
            title="Zoom Out"
          >
            -
          </button>
        </div>

        {/* Fine-Tuning Compass D-Pad Overlay (Bottom Left) */}
        <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs p-1.5 rounded-lg shadow-md flex flex-col items-center gap-1 z-10 border border-white/20">
          <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider">Nudge Pin</span>
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              type="button"
              onClick={() => handleNudge(0.0005, 0)}
              className="p-1 bg-white/20 hover:bg-white/40 text-white rounded flex items-center justify-center cursor-pointer transition-colors"
              title="Move North"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <div />
            <button
              type="button"
              onClick={() => handleNudge(0, -0.0005)}
              className="p-1 bg-white/20 hover:bg-white/40 text-white rounded flex items-center justify-center cursor-pointer transition-colors"
              title="Move West"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="p-1 flex items-center justify-center text-amber-300">
              <Crosshair className="w-3.5 h-3.5" />
            </div>
            <button
              type="button"
              onClick={() => handleNudge(0, 0.0005)}
              className="p-1 bg-white/20 hover:bg-white/40 text-white rounded flex items-center justify-center cursor-pointer transition-colors"
              title="Move East"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <div />
            <button
              type="button"
              onClick={() => handleNudge(-0.0005, 0)}
              className="p-1 bg-white/20 hover:bg-white/40 text-white rounded flex items-center justify-center cursor-pointer transition-colors"
              title="Move South"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div />
          </div>
        </div>

        {/* Bottom Right Direct Link */}
        <a
          href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-white/95 hover:bg-white text-[#0F382C] text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md border border-gray-200 backdrop-blur-xs transition-colors flex items-center gap-1 z-10"
        >
          <span>Open Full Map ↗</span>
        </a>
      </div>

      {/* Paste Coordinates or Google Maps Link */}
      <div className="bg-gray-50/80 p-3 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Paste Google Maps URL or Coordinates (e.g. 27.1585, 78.0494)"
            value={pasteInput}
            onChange={(e) => setPasteInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleParsePastedLocation())}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:border-[#0F382C] focus:ring-1 focus:ring-[#0F382C]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
        </div>
        <button
          type="button"
          onClick={handleParsePastedLocation}
          className="w-full sm:w-auto px-3 py-1.5 bg-[#0F382C] hover:bg-[#164E3D] text-white text-xs font-bold rounded-md transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          Apply Pin
        </button>
      </div>

      {pasteSuccess && (
        <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Coordinates updated successfully!</span>
        </p>
      )}

      {/* Toggle Manual Lat/Lng Direct Inputs */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowCoordinateInputs(!showCoordinateInputs)}
          className="text-[11px] text-[#0F382C] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>{showCoordinateInputs ? '▲ Hide Exact Coordinate Inputs' : '▼ Advanced: Enter Exact Latitude / Longitude Manually'}</span>
        </button>

        {showCoordinateInputs && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">Latitude (°N)</label>
              <input
                type="number"
                step="0.000001"
                value={coordinates.lat}
                onChange={(e) => onChangeCoordinates({ ...coordinates, lat: parseFloat(e.target.value) || coordinates.lat })}
                className="w-full p-2 text-xs bg-white border border-gray-300 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">Longitude (°E)</label>
              <input
                type="number"
                step="0.000001"
                value={coordinates.lng}
                onChange={(e) => onChangeCoordinates({ ...coordinates, lng: parseFloat(e.target.value) || coordinates.lng })}
                className="w-full p-2 text-xs bg-white border border-gray-300 rounded-md font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold">Privacy Guarantee:</strong> This exact map location will remain <strong className="underline">confidential</strong> and visible strictly to you (the property owner) and platform administrators. Public buyers only see the general locality until verified site tours are arranged.
        </p>
      </div>

    </div>
  );
};
