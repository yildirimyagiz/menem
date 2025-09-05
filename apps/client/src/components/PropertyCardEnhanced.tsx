"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { PropertyWithRelations } from "../app/[locale]/client/property/components/types";

interface PropertyCardEnhancedProps {
  property: PropertyWithRelations;
  className?: string;
  onHover?: (id: string | null) => void;
  isHovered?: boolean;
}

const PropertyCardEnhanced: React.FC<PropertyCardEnhancedProps> = ({
  property,
  className = "",
  onHover,
  isHovered = false
}) => {
  const locale = useLocale();

  // Get the first photo or use a placeholder
  const mainPhoto = property.Photo && property.Photo.length > 0
    ? property.Photo[0]?.url ?? "/images/placeholder.jpg"
    : "/images/placeholder.jpg";
  
  // Format price
  const formattedPrice = typeof property.marketValue === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(property.marketValue)
    : "Price on request";
  
  // Format property type for display
  const formatPropertyType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  // Format property status for display
  const formatPropertyStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  // Get location display text
  const getLocationText = () => {
    if (!property.Location) return "";
    
    const parts = [
      property.Location.address,
      property.Location.city,
      property.Location.country,
    ].filter(Boolean);
    
    return parts.join(", ");
  };
  
  // Handle mouse enter for map integration
  const handleMouseEnter = () => {
    if (onHover) {
      onHover(property.id);
    }
  };
  
  // Handle mouse leave for map integration
  const handleMouseLeave = () => {
    if (onHover) {
      onHover(null);
    }
  };
  
  return (
    <Link
      href={`/${locale}/client/property/${property.id}`}
      className={`block h-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={property.title ? `View details for ${property.title}` : "View property details"}
    >
      <div 
        className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 h-full flex flex-col ${isHovered ? 'ring-2 ring-blue-500' : ''}`}
        data-property-id={property.id}
      >
        <div className="relative h-48 w-full">
          <Image
            src={mainPhoto}
            alt={property.title ?? "Property image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback to placeholder on image error
              e.currentTarget.src = "/images/placeholder.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="text-white text-sm font-medium truncate">
              View Details
            </div>
          </div>
          {property.featured && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
              Featured
            </div>
          )}
          {property.propertyStatus && (
            <div className="absolute top-2 right-2 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded">
              {formatPropertyStatus(property.propertyStatus)}
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded">
            {formattedPrice}
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
              {property.title ?? "Untitled Property"}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm mt-1 truncate flex-1">
            {getLocationText()}
          </p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {property.bedrooms != null && (
              <span className="text-sm text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">{property.bedrooms}</span>
              </span>
            )}
            {property.bathrooms != null && (
              <span className="text-sm text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{property.bathrooms}</span>
              </span>
            )}
            {property.size != null && (
              <span className="text-sm text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                </svg>
                <span className="font-medium">{property.size}</span> m²
              </span>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1">
            {property.propertyType && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {formatPropertyType(property.propertyType)}
              </span>
            )}
            {property.category && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {property.category.replace(/_/g, " ").toLowerCase()}
              </span>
            )}
            {property.amenities?.slice(0, 2).map((amenity) => (
              <span 
                key={amenity}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {amenity.replace(/_/g, " ").toLowerCase()}
              </span>
            ))}
            {property.amenities && property.amenities.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                +{property.amenities.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCardEnhanced;
