import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface MapComponentProps {
  lat: number;
  lng: number;
}

export const MapComponent: React.FC<MapComponentProps> = ({ lat, lng }) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="relative h-64 w-full rounded-xl overflow-hidden border border-gray-200 shadow-xs">
        <iframe
          title="Property Location Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`}
        />
        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-white/95 hover:bg-white text-[#0F382C] text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md border border-gray-200 backdrop-blur-xs transition-colors flex items-center gap-1"
        >
          <span>Open in Google Maps ↗</span>
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
