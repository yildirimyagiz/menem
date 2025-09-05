import type {
  Photo,
  PropertyAmenities,
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@reservatior/db";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MarkerItem {
  id: string;
  title: string;
  address: string;
  coordinates: Coordinates;
  position: Coordinates;
  price: number;
  currency: string;
  propertyType: PropertyType;
  propertyStatus: PropertyStatus;
  category: PropertyCategory;
  condition: PropertyCondition;
  features: PropertyFeatures[];
  amenities: PropertyAmenities[];
  photos: Photo[];
  bedrooms?: number;
  bathrooms?: number;
}

// Types for Points of Interest (POI)
export type POIType = 
  | 'school'
  | 'bank'
  | 'restaurant'
  | 'cafe'
  | 'hospital'
  | 'pharmacy'
  | 'supermarket'
  | 'park'
  | 'gym'
  | 'shopping_mall';

export interface POI {
  id: string;
  type: POIType;
  name: string;
  coordinates: Coordinates;
  icon?: string;
  rating?: number;
  userRatingsTotal?: number;
  address?: string;
  isOpen?: boolean;
}

export interface MapContainerProps {
  /**
   * Currently hovered marker ID
   */
  currentHoverID?: string;
  
  /**
   * Array of marker items to display on the map
   */
  markers?: MarkerItem[];
  
  /**
   * Alternative to markers prop (legacy support)
   */
  locations?: MarkerItem[];
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Lightweight input; internally adapted to MarkerItem
   */
  points?: {
    id: string;
    coordinates: Coordinates;
    title?: string;
    address?: string;
    price?: number;
    currency?: string;
    photos?: { url?: string }[];
    bedrooms?: number;
    bathrooms?: number;
  }[];
  
  /**
   * Whether to automatically fit the map bounds to show all markers
   * @default true
   */
  autoFit?: boolean;
  
  /**
   * POI Settings
   */
  showPOIs?: boolean;
  enabledPOITypes?: POIType[];
  onPOIClick?: (poi: POI) => void;
  customPOIIcons?: Partial<Record<POIType, string>>;
  
  /**
   * Callback when a marker is clicked
   */
  onMarkerClick?: (marker: MarkerItem) => void;
  
  /**
   * Callback when a marker is hovered
   */
  onMarkerHover?: (markerId: string | null) => void;
  
  /**
   * Custom marker renderer
   */
  renderMarker?: (marker: MarkerItem, isHovered: boolean) => React.ReactNode;
  
  /**
   * Custom info window renderer
   */
  renderInfoWindow?: (marker: MarkerItem) => React.ReactNode;
  
  /**
   * Google Maps API key
   */
  googleMapsApiKey?: string;
  
  /**
   * Default map center (used when no markers are provided)
   */
  defaultCenter?: Coordinates;
  
  /**
   * Default zoom level
   * @default 12
   */
  defaultZoom?: number;
  
  /**
   * Minimum zoom level
   */
  minZoom?: number;
  
  /**
   * Maximum zoom level
   */
  maxZoom?: number;
  
  /**
   * Enable/disable map controls
   * @default {
   *   zoomControl: true,
   *   mapTypeControl: true,
   *   scaleControl: true,
   *   streetViewControl: true,
   *   rotateControl: true,
   *   fullscreenControl: true
   * }
   */
  controls?: {
    zoomControl?: boolean;
    mapTypeControl?: boolean;
    scaleControl?: boolean;
    streetViewControl?: boolean;
    rotateControl?: boolean;
    fullscreenControl?: boolean;
  };
  
  /**
   * Custom map styles
   */
  styles?: google.maps.MapTypeStyle[];
  
  /**
   * Map type
   * @default 'roadmap'
   */
  mapTypeId?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  
  /**
   * Enable/disable gesture handling
   * @default 'greedy'
   */
  gestureHandling?: 'greedy' | 'cooperative' | 'auto' | 'none';
  
  /**
   * Enable/disable marker clustering
   * @default true
   */
  enableClustering?: boolean;
  
  /**
   * Cluster options
   */
  clusterOptions?: {
    /**
     * Grid size of the cluster in pixels
     * @default 60
     */
    gridSize?: number;
    
    /**
     * Maximum zoom level to cluster points on
     * @default 20
     */
    maxZoom?: number;
    
    /**
     * Minimum number of points to form a cluster
     * @default 2
     */
    minimumClusterSize?: number;
    
    /**
     * Custom cluster renderer
     */
    renderer?: {
      /**
       * Render function for cluster marker
       */
      render: (cluster: {
        count: number;
        markers: google.maps.Marker[];
        position: google.maps.LatLng;
      }) => google.maps.OverlayView | null;
    };
  };
  
  /**
   * Loading component
   */
  loadingComponent?: React.ReactNode;
  
  /**
   * Error component
   */
  errorComponent?: (error: Error) => React.ReactNode;
  
  /**
   * No markers component
   */
  noMarkersComponent?: React.ReactNode;
}
