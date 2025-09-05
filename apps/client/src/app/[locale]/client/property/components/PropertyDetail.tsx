import React from 'react';

import { format } from 'date-fns';
import type { PropertyStatus as DBPropertyStatus, Property, PropertyType } from '~/utils/interfaces';

interface PropertyDetailsProps {
  property: Property;
  className?: string;
}

const getStatusColor = (status: DBPropertyStatus) => {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-800';
    case 'UNDER_CONTRACT':
      return 'bg-yellow-100 text-yellow-800';
    case 'SOLD':
    case 'RENTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
const formatPropertyType = (type: PropertyType) => {
  return type.toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header Section */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            <p className="text-gray-600 mt-1">
              {property.locationId && property.Location?.address}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.propertyStatus)}`}>
            {property.propertyStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Property Type</h3>
            <p className="mt-1 text-gray-900">{formatPropertyType(property.propertyType)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
            <p className="mt-1 text-gray-900">{property.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Size</h3>
            <p className="mt-1 text-gray-900">{property.size} m²</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Year Built</h3>
            <p className="mt-1 text-gray-900">{property.yearBuilt}</p>
          </div>
        </div>

        {/* Rooms */}
        {(property.bedrooms != null || property.bathrooms != null) && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rooms</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.bedrooms !== null && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="text-2xl font-semibold">{property.bedrooms}</p>
                </div>
              )}
              {property.bathrooms !== null && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="text-2xl font-semibold">{property.bathrooms}</p>
                </div>
              )}
              {property.floors !== null && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Floors</p>
                  <p className="text-2xl font-semibold">{property.floors}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features & Amenities */}
        {property.features.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {feature.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Details */}
        <div className="space-y-4">
          {property.description && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{property.description}</p>
            </div>
          )}

          {property.specialNotes && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Special Notes</h3>
              <p className="text-yellow-700">{property.specialNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Listed on {format(new Date(property.createdAt), 'MMM d, yyyy')}
          </p>
          {property.marketValue && (
            <p className="text-lg font-semibold text-gray-900">
              ${property.marketValue.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
