declare module "leaflet" {
  export default L;
}

declare module "react-leaflet" {
  import type { ComponentType } from "react";

  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export interface MarkerProps {
    position: [number, number];
    icon?: any;
    children?: React.ReactNode;
  }

  export interface TileLayerProps {
    url: string;
    attribution?: string;
  }

  export interface PopupProps {
    children?: React.ReactNode;
  }

  export const MapContainer: ComponentType<MapContainerProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const Popup: ComponentType<PopupProps>;
  export const TileLayer: ComponentType<TileLayerProps>;
}
