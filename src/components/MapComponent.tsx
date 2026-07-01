import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";

// Fix for default marker icons in Leaflet with Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export interface UserLocation {
  userId: string;
  username?: string;
  name?: string;
  lat: number;
  lng: number;
  updatedAt: Date;
}

interface MapComponentProps {
  locations?: Record<string, UserLocation>;
  selectedUserId?: string | null;
}

export default function MapComponent({ locations = {}, selectedUserId }: MapComponentProps) {
  // If a specific user is selected and has a location, center on them, otherwise center on India
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const centerPosition = selectedUserId && locations[selectedUserId]
    ? [locations[selectedUserId].lat, locations[selectedUserId].lng] as [number, number]
    : defaultCenter;

  return (
    <div style={{ height: "100%", width: "100%", minHeight: "400px" }}>
      <MapContainer
        center={centerPosition}
        zoom={selectedUserId ? 14 : 5}
        style={{ height: "100%", width: "100%", borderRadius: "16px" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Google Street">
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google Satellite">
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google Hybrid">
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {Object.values(locations).map((loc) => (
          <Marker key={loc.userId} position={[loc.lat, loc.lng]}>
            <Popup>
              <strong>{loc.name || loc.username || loc.userId}</strong> <br />
              Last seen: {new Date(loc.updatedAt).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
