import React, { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue with bundlers (Vite/Webpack)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface MapPickerProps {
  latitude: string;
  longitude: string;
  onChange: (lat: string, lng: string) => void;
}

function RecenterMap({ center }: { center: L.LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function LocationMarker({
  position,
  onChange,
}: {
  position: L.LatLng;
  onChange: (pos: L.LatLng) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          onChange(marker.getLatLng());
        }
      },
    }),
    [onChange]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    ></Marker>
  );
}

export function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
  const latVal = parseFloat(latitude) || -6.2088;
  const lngVal = parseFloat(longitude) || 106.8456;
  const position = new L.LatLng(latVal, lngVal);

  const handlePositionChange = (pos: L.LatLng) => {
    onChange(pos.lat.toFixed(6), pos.lng.toFixed(6));
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={position} />
        <LocationMarker position={position} onChange={handlePositionChange} />
      </MapContainer>
    </div>
  );
}
