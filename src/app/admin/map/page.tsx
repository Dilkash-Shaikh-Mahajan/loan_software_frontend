"use client";
import React from "react";
import dynamic from "next/dynamic";

// Leaflet relies on window, so we must load it dynamically with SSR disabled
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <p className="text-center p-10 text-gray-500">Loading Map...</p>
  ),
});

export default function AdminMapPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Live User Locations
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time tracking of all active field agents/users.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
          <MapComponent />
        </div>
      </div>
    </div>
  );
}
