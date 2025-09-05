"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import * as Leaflet from "leaflet";

// Configure default marker icons without touching private fields
if (typeof window !== "undefined") {
  const iconDefault = (Leaflet as unknown as {
    Icon?: { Default?: { mergeOptions?: (opts: { iconRetinaUrl: string; iconUrl: string; shadowUrl: string }) => void } };
  }).Icon?.Default;
  if (iconDefault?.mergeOptions) {
    iconDefault.mergeOptions({
      iconRetinaUrl: "/images/marker-icon-2x.png",
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
    });
  }
}

// Removed dynamic internal imports; the page lazily loads this component with ssr: false.

interface MapProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  center: [number, number];
  zoom: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  scrollWheelZoom?: boolean;
}

export function Map({
  center,
  zoom,
  children,
  className = "",
  style = { height: "400px", width: "100%" },
  scrollWheelZoom = true,
  ...props
}: MapProps) {
  const [mounted, setMounted] = useState(false);

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server
  if (typeof window === "undefined" || !mounted) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={style}
        {...props}
      >
        <div className="animate-pulse text-gray-500">Loading map...</div>
      </div>
    );
  }

  // Extract container props to avoid passing them to MapContainer
  const containerProps = {
    className: `${className || ""} relative`,
    style: style,
  };

  return (
    <div {...containerProps}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={scrollWheelZoom}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {children}
      </MapContainer>
    </div>
  );
}

// No re-exports; keep this file focused on the Map wrapper component.
export default Map;
