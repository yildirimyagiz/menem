import type {
  ArchitecturalStyle,
  BuildingClass,
  ConstructionType,
  CoolingType,
  EnergyEfficiencyRating,
  EnergyRating,
  GreenCertification,
  HeatingType,
  ParkingType,
  PropertyAmenities,
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@prisma/client";
import React from "react";
import {
  AlertCircle,
  Award,
  Building2,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  DollarSign,
  Home,
  Info,
  MapPin,
  Shield,
  Snowflake,
  Star,
  TreePine,
  TrendingUp,
  Users,
  Wifi,
  Zap,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Progress } from "@reservatior/ui/progress";

import type { PropertyAnalysis, RecognitionResult } from "~/services/mlService";
import { mlUtils } from "~/services/mlService";

interface PropertyAnalysisCardProps {
  analysis: PropertyAnalysis;
  recognition?: RecognitionResult[];
  onViewDetails?: () => void;
  onSaveAnalysis?: () => void;
  onUpdateProperty?: (propertyData: any) => void;
  className?: string;
}

const PropertyAnalysisCard: React.FC<PropertyAnalysisCardProps> = ({
  analysis,
  recognition = [],
  onViewDetails,
  onSaveAnalysis,
  onUpdateProperty,
  className = "",
}) => {
  const propertyEmoji = mlUtils.getPropertyTypeEmoji(analysis.property_type);
  const confidenceColor = mlUtils.getConfidenceColor(analysis.confidence_level);
  const formattedPrice = mlUtils.formatPrice(analysis.estimated_price);

  const features = analysis.property_features;
  const locationInsights = analysis.location_insights;

  // Map ML analysis to property schema enums
  const mapPropertyType = (mlType: string): PropertyType => {
    const typeMap: Record<string, PropertyType> = {
      apartment: "APARTMENT",
      house: "HOUSE",
      condo: "CONDO",
      villa: "VILLA",
      studio: "STUDIO",
      townhouse: "TOWNHOUSE",
      mansion: "MANSION",
      penthouse: "PENTHOUSE",
    };
    return typeMap[mlType] || "APARTMENT";
  };

  const mapPropertyCondition = (quality: number): PropertyCondition => {
    if (quality >= 0.8) return "EXCELLENT";
    if (quality >= 0.6) return "GOOD";
    if (quality >= 0.4) return "FAIR";
    return "NEEDS_RENOVATION";
  };

  const mapConstructionType = (modernity: number): ConstructionType => {
    if (modernity >= 0.8) return "CONCRETE";
    if (modernity >= 0.6) return "STEEL";
    if (modernity >= 0.4) return "BRICK";
    return "WOOD_FRAME";
  };

  const mapEnergyRating = (efficiency: number): EnergyRating => {
    if (efficiency >= 0.9) return "A";
    if (efficiency >= 0.7) return "B";
    if (efficiency >= 0.5) return "C";
    if (efficiency >= 0.3) return "D";
    return "E";
  };

  const mapBuildingClass = (score: number): BuildingClass => {
    if (score >= 0.8) return "LUXURY";
    if (score >= 0.6) return "CLASS_A";
    if (score >= 0.4) return "CLASS_B";
    return "CLASS_C";
  };

  const handleUpdateProperty = () => {
    if (onUpdateProperty) {
      const propertyData = {
        propertyType: mapPropertyType(analysis.property_type),
        condition: mapPropertyCondition(features.interior_quality),
        constructionType: mapConstructionType(features.modernity_score),
        energyRating: mapEnergyRating(features.lighting_quality),
        buildingClass: mapBuildingClass(analysis.overall_score),
        marketValue: analysis.estimated_price,
        mlScore: analysis.overall_score,
        features: analysis.detected_rooms
          .map(
            (room) => room.toUpperCase().replace("_", "") as PropertyFeatures,
          )
          .filter(Boolean),
        amenities: analysis.detected_amenities
          .map(
            (amenity) =>
              amenity.toUpperCase().replace("_", "") as PropertyAmenities,
          )
          .filter(Boolean),
      };
      onUpdateProperty(propertyData);
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{propertyEmoji}</span>
            <div>
              <CardTitle className="text-xl font-bold">
                {analysis.property_type.charAt(0).toUpperCase() +
                  analysis.property_type.slice(1)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                AI Analysis •{" "}
                {new Date(analysis.analysis_timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${confidenceColor}`}>
              {Math.round(analysis.confidence_level * 100)}% Confidence
            </div>
            <Badge variant="secondary" className="mt-1">
              {analysis.overall_score.toFixed(2)} Score
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Price Estimation */}
        <div className="mb-6">
          <div className="mb-2 flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Estimated Value</h3>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formattedPrice}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on property features and market analysis
          </p>
        </div>

        {/* Property Features */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center text-lg font-semibold">
            <Building2 className="mr-2 h-5 w-5" />
            Property Features
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Interior Quality</span>
                <span className="font-medium">
                  {Math.round(features.interior_quality * 100)}%
                </span>
              </div>
              <Progress
                value={features.interior_quality * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Modernity</span>
                <span className="font-medium">
                  {Math.round(features.modernity_score * 100)}%
                </span>
              </div>
              <Progress
                value={features.modernity_score * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Space Utilization</span>
                <span className="font-medium">
                  {Math.round(features.space_utilization * 100)}%
                </span>
              </div>
              <Progress
                value={features.space_utilization * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Cleanliness</span>
                <span className="font-medium">
                  {Math.round(features.cleanliness * 100)}%
                </span>
              </div>
              <Progress value={features.cleanliness * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Property Classification */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center text-lg font-semibold">
            <Award className="mr-2 h-5 w-5" />
            AI Classification
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Property Type</span>
                <Badge variant="outline">
                  {mapPropertyType(analysis.property_type)}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Condition</span>
                <Badge variant="outline">
                  {mapPropertyCondition(features.interior_quality)}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Construction</span>
                <Badge variant="outline">
                  {mapConstructionType(features.modernity_score)}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Energy Rating</span>
                <Badge variant="outline">
                  {mapEnergyRating(features.lighting_quality)}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Building Class</span>
                <Badge variant="outline">
                  {mapBuildingClass(analysis.overall_score)}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>ML Score</span>
                <Badge variant="secondary">
                  {analysis.overall_score.toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Detected Rooms & Amenities */}
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 flex items-center font-semibold">
                <Home className="mr-2 h-4 w-4" />
                Detected Rooms
              </h4>
              <div className="flex flex-wrap gap-1">
                {analysis.detected_rooms.map((room, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {room.replace("_", " ").toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 flex items-center font-semibold">
                <Star className="mr-2 h-4 w-4" />
                Amenities
              </h4>
              <div className="flex flex-wrap gap-1">
                {analysis.detected_amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity.replace("_", " ").toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location Insights */}
        {locationInsights && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <MapPin className="mr-2 h-5 w-5" />
              Location Insights
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Neighborhood Quality</span>
                  <span className="font-medium">
                    {Math.round(locationInsights.neighborhood_quality * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Safety Score</span>
                  <span className="font-medium">
                    {Math.round(locationInsights.safety_score * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Walkability</span>
                  <span className="font-medium">
                    {Math.round(locationInsights.walkability * 100)}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Noise Level</span>
                  <span className="font-medium capitalize">
                    {locationInsights.noise_level}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Transportation</span>
                  <span className="font-medium">
                    {Math.round(locationInsights.transportation_rating * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Accessibility</span>
                  <span className="font-medium">
                    {Math.round(locationInsights.accessibility_score * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Recognition Results */}
        {recognition.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <TrendingUp className="mr-2 h-5 w-5" />
              AI Recognition
            </h3>
            <div className="space-y-2">
              {recognition.slice(0, 5).map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="capitalize">
                    {result.object.replace("_", " ")}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="h-1.5 w-16 rounded-full bg-gray-200">
                      <div
                        className="h-1.5 rounded-full bg-blue-600"
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 border-t pt-4">
          {onViewDetails && (
            <Button
              variant="outline"
              onClick={onViewDetails}
              className="flex-1"
            >
              <Info className="mr-2 h-4 w-4" />
              View Details
            </Button>
          )}
          {onUpdateProperty && (
            <Button
              variant="outline"
              onClick={handleUpdateProperty}
              className="flex-1"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Update Property
            </Button>
          )}
          {onSaveAnalysis && (
            <Button onClick={onSaveAnalysis} className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Save Analysis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyAnalysisCard;
