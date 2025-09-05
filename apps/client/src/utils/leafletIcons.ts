import L from 'leaflet';

export const createCustomIcon = (type: string) => {
  // Define colors for different place types
  const typeColors: Record<string, string> = {
    restaurant: '#FF6B6B',
    school: '#4ECDC4',
    facility: '#45B7D1',
    sport: '#96CEB4',
    default: '#FFEEAD',
  };

  // Get the appropriate color based on the place type
  const getColorForType = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('restaurant') || lowerType.includes('cafe') || lowerType.includes('bar')) {
      return typeColors.restaurant;
    } else if (lowerType.includes('school') || lowerType.includes('university') || lowerType.includes('college')) {
      return typeColors.school;
    } else if (lowerType.includes('facility') || lowerType.includes('center') || lowerType.includes('community')) {
      return typeColors.facility;
    } else if (lowerType.includes('sport') || lowerType.includes('gym') || lowerType.includes('stadium')) {
      return typeColors.sport;
    }
    return typeColors.default;
  };

  const color = getColorForType(type);
  
  // Create a custom HTML element for the marker
  const html = `
    <div style="
      background: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
      ">
        ${type.charAt(0).toUpperCase()}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Default icon configuration
const defaultIconConfig = {
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number],
  shadowAnchor: [12, 41] as [number, number]
};

// Create a proper L.Icon instance for the default icon
export const DefaultIcon = typeof window !== 'undefined' 
  ? new L.Icon(defaultIconConfig)
  : L.Icon.Default.prototype;

// Set the default icon for all markers (client-side only)
if (typeof window !== 'undefined') {
  // Only set the default icon if it's not already set
  if (!L.Marker.prototype.options.icon) {
    L.Marker.prototype.options.icon = DefaultIcon;
  }
}
