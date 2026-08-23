import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface MapComponentProps {
  lat: number;
  lng: number;
}

export const MapComponent: React.FC<MapComponentProps> = ({ lat, lng }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500">Google Maps API Key required</div>;
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
