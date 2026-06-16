import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issues
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

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  label?: string;
  popupText?: string;
}

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
}

function RecenterMap({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function MapView({
  center,
  zoom = 13,
  markers = [],
  height = '100%',
}: MapViewProps) {
  const defaultCenter = center[0] && center[1] ? center : [-6.2088, 106.8456];

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-slate-200 z-0"
      style={{ height }}
    >
      <MapContainer
        center={defaultCenter as L.LatLngExpression}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={center} zoom={zoom} />
        {markers.map((marker) => {
          if (!marker.latitude || !marker.longitude) return null;
          return (
            <Marker
              key={marker.id}
              position={
                [marker.latitude, marker.longitude] as L.LatLngExpression
              }
            >
              {marker.popupText && (
                <Popup>
                  <div className="text-xs font-semibold p-1">
                    {marker.popupText}
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
