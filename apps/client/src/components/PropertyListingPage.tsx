"use client";

import React, { useState } from "react";
import PropertyFilters from "~/app/[locale]/client/prop2/PropertyFilters";
import type { PropertyWithRelations } from "~/app/[locale]/client/property/components/types";
import MapContainer from "./MapContainer";
import PropertyCardEnhanced from "./PropertyCardEnhanced";

interface PropertyListingPageProps {
  initialProperties: PropertyWithRelations[];
}

const PropertyListingPage: React.FC<PropertyListingPageProps> = ({ initialProperties }) => {
  const [_properties, _setProperties] = useState<PropertyWithRelations[]>(initialProperties);
  const [filteredProperties, setFilteredProperties] = useState<PropertyWithRelations[]>(initialProperties);
  const [currentView, setCurrentView] = useState<'grid' | 'map'>('grid');
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  
  // Handle property hover for map integration
  const handlePropertyHover = (propertyId: string | null) => {
    setHoveredPropertyId(propertyId);
  };
  
  // Handle filter changes
  const handleFilterChange = (_filters: Record<string, any>) => {
    // In a real app, this would filter properties based on the filters
    // For now, we'll just set the filtered properties to all properties
    setFilteredProperties(initialProperties);
  };
  
  // Convert properties to marker items for the map
  const markerItems = filteredProperties.map(property => ({
    id: property.id,
    title: property.title ?? '',
    address: property.Location?.address ?? '',
    coordinates: property.Location?.coordinates ? {
      lat: (property.Location.coordinates as { lat: number; lng: number }).lat,
      lng: (property.Location.coordinates as { lat: number; lng: number }).lng
    } : { lat: 0, lng: 0 },
    position: property.Location?.coordinates ? {
      lat: (property.Location.coordinates as { lat: number; lng: number }).lat,
      lng: (property.Location.coordinates as { lat: number; lng: number }).lng
    } : { lat: 0, lng: 0 },
    price: property.marketValue ?? 0,
    currency: 'USD',
    propertyType: property.propertyType,
    propertyStatus: property.propertyStatus,
    category: property.category,
    condition: property.condition ?? 'UNKNOWN',
    features: property.features ?? [],
    amenities: property.amenities ?? [],
    photos: property.Photo ?? [],
    bedrooms: property.bedrooms ?? undefined,
    bathrooms: property.bathrooms ?? undefined
  }));
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Listings</h1>
        <p className="text-gray-600">Discover your perfect property from our curated collection</p>
      </div>
      
      <PropertyFilters onFilterChange={handleFilterChange} />
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-700">
          Showing <span className="font-semibold">{filteredProperties.length}</span> properties
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentView('grid')}
            className={`px-4 py-2 rounded-lg flex items-center ${currentView === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid View
          </button>
          <button
            onClick={() => setCurrentView('map')}
            className={`px-4 py-2 rounded-lg flex items-center ${currentView === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Map View
          </button>
        </div>
      </div>
      
      {currentView === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCardEnhanced 
              key={property.id} 
              property={property} 
              onHover={handlePropertyHover}
              isHovered={hoveredPropertyId === property.id}
            />
          ))}
        </div>
      ) : (
        <div className="h-screen relative">
          <MapContainer 
            markers={markerItems} 
            currentHoverID={hoveredPropertyId ?? undefined}
          />
        </div>
      )}
    </div>
  );
};

export default PropertyListingPage;
