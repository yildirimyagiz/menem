"use client";

import L from "leaflet";
import {
  MapContainer as LeafletMap,
  Marker,
  Popup,
  TileLayer
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { useCallback, useEffect, useRef } from "react";

// Extend the Window interface to include Leaflet map reference
declare global {
  interface Window {
    L: typeof L;
  }
}


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  className?: string;
  scrollWheelZoom?: boolean;
  zoomControl?: boolean;
  style?: React.CSSProperties;
}

const Map = ({
  center = [51.505, -0.09],
  zoom = 13,
  children,
  className = "",
  scrollWheelZoom = true,
  zoomControl = true,
  style = { height: "100%", width: "100%" },
  ...props
}: MapProps) => {
  return (
    <div className={`relative ${className}`} style={style}>
      <LeafletMap
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%", width: "100%" }}
        {...props}
      >
        {zoomControl && (
          <div className="leaflet-top leaflet-right">
            <div className="leaflet-control-zoom leaflet-bar leaflet-control">
              <a className="leaflet-control-zoom-in" href="#" title="Zoom in">
                +
              </a>
              <a className="leaflet-control-zoom-out" href="#" title="Zoom out">
                -
              </a>
            </div>
          </div>
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </LeafletMap>
    </div>
  );
};

interface ChangeViewProps {
  center: [number, number];
  zoom: number;
}

// Simple component to update the map view when center/zoom changes
const ChangeView = ({ center, zoom }: ChangeViewProps) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom, { animate: true });
    }
  }, [center, zoom]);

  // This is a workaround to access the Leaflet map instance
  // We'll use a more type-safe approach in a real application
  const handleRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      // Access the Leaflet map instance through the DOM node
      const mapInstance = (node as any)._leaflet_map;
      if (mapInstance) {
        mapRef.current = mapInstance as L.Map;
      }
    }
  }, []);

  return <div ref={handleRef} style={{ display: "none" }} />;
};

export { ChangeView, Map, Marker, Popup, TileLayer };

