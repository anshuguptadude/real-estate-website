import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface MapComponentProps {
  lat: number;
  lng: number;
  locationLink?: string;
  title?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ lat, lng, locationLink, title }) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
  const directMapsUrl = locationLink && locationLink.trim() ? locationLink.trim() : `https://www.google.com/maps?q=${lat},${lng}`;

  if (!apiKey) {
    return (
      <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-gray-200 shadow-xs group">
        <iframe
          title={title ? `${title} Location Map` : "Property Location Map"}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`}
        />
        <a
          href={directMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2.5 right-2.5 bg-[#0F382C] hover:bg-[#164E3D] text-[#E4D5B7] text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border border-[#E4D5B7]/30 backdrop-blur-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Open Exact Google Maps Pin ↗</span>
        </a>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-64 w-full rounded-lg overflow-hidden">
        <Map
          defaultCenter={{ lat, lng }}
          defaultZoom={15}
          mapId="DEMO_MAP_ID"
        >
          <AdvancedMarker position={{ lat, lng }}>
            <Pin background={'#C5A869'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
};
