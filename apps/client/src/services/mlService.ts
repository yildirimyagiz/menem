import React from "react"; // Added missing import for React

import { api } from "~/trpc/react";

// Enhanced type definitions for ML analysis
export interface ProcessedImage {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  width: number;
  height: number;
  format: string;
  metadata: {
    dimensions: {
      width: number;
      height: number;
    };
    format: string;
  };
}

// Property analysis types
export interface PropertyAnalysis {
  property_type: string;
  detected_rooms: string[];
  detected_amenities: string[];
  property_features: {
    interior_quality: number;
    exterior_condition: number;
    modernity_score: number;
    space_utilization: number;
    lighting_quality: number;
    cleanliness: number;
    maintenance_level: number;
    aesthetic_appeal: number;
  };
  location_insights?: {
    neighborhood_quality: number;
    accessibility_score: number;
    transportation_rating: number;
    safety_score: number;
    noise_level: string;
    walkability: number;
  };
  estimated_price: number;
  overall_score: number;
  confidence_level: number;
  analysis_timestamp: string;
}

export interface RecognitionResult {
  object: string;
  confidence: number;
}

export interface MLAnalysisResponse {
  success: boolean;
  filename: string;
  analysis: PropertyAnalysis;
  recognition: RecognitionResult[];
  image_base64?: string;
  timestamp: string;
}

export interface BatchAnalysisResponse {
  success: boolean;
  results: MLAnalysisResponse[];
  total_processed: number;
  timestamp: string;
}

export interface PropertyAnalysisData {
  propertyId: string;
  score: number;
  tags: string[];
  analysis: PropertyAnalysis;
  recognition: RecognitionResult[];
}

export interface AnalysisSettings {
  enableAutoTagging?: boolean;
  qualityThreshold?: number;
  confidenceThreshold?: number;
  enableLocationAnalysis?: boolean;
  enablePriceEstimation?: boolean;
}

export interface UpdateSettingsResponse {
  success: boolean;
  message?: string;
  updatedSettings?: AnalysisSettings;
}

// ML API endpoints
const ML_API_BASE =
  process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8001";

// Direct API calls for ML analysis
export const mlApi = {
  // Analyze single property photo
  async analyzePropertyPhoto(
    file: File,
    location?: any,
  ): Promise<MLAnalysisResponse> {
    const formData = new FormData();
    formData.append("photo", file);

    if (location) {
      formData.append("location_data", JSON.stringify(location));
    }

    const response = await fetch(`${ML_API_BASE}/api/places/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ML analysis failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Analyze multiple property photos
  async batchAnalyzePhotos(
    files: File[],
    location?: any,
  ): Promise<BatchAnalysisResponse> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("photos", file);
    });

    if (location) {
      formData.append("location_data", JSON.stringify(location));
    }

    const response = await fetch(`${ML_API_BASE}/api/places/batch-analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Batch ML analysis failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Health check
  async healthCheck(): Promise<{
    status: string;
    model_loaded: boolean;
    labels_loaded: boolean;
  }> {
    const response = await fetch(`${ML_API_BASE}/api/places/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Get sample places data
  async getSamplePlaces(): Promise<{
    success: boolean;
    places: any[];
    total: number;
  }> {
    const response = await fetch(`${ML_API_BASE}/api/places/sample-data`);

    if (!response.ok) {
      throw new Error(`Sample data fetch failed: ${response.statusText}`);
    }

    return response.json();
  },
};

// React hooks for ML analysis
export function useMLHealthCheck() {
  const [status, setStatus] = React.useState<{
    status: string;
    model_loaded: boolean;
    labels_loaded: boolean;
  } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const checkHealth = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mlApi.healthCheck();
      setStatus(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Health check failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { status, loading, error, checkHealth };
}

export function usePropertyAnalysis() {
  const [analysis, setAnalysis] = React.useState<MLAnalysisResponse | null>(
    null,
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const analyzeProperty = React.useCallback(
    async (file: File, location?: any) => {
      setLoading(true);
      setError(null);
      try {
        const result = await mlApi.analyzePropertyPhoto(file, location);
        setAnalysis(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Analysis failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { analysis, loading, error, analyzeProperty };
}

export function useBatchPropertyAnalysis() {
  const [analysis, setAnalysis] = React.useState<BatchAnalysisResponse | null>(
    null,
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const analyzeBatch = React.useCallback(
    async (files: File[], location?: any) => {
      setLoading(true);
      setError(null);
      try {
        const result = await mlApi.batchAnalyzePhotos(files, location);
        setAnalysis(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Batch analysis failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { analysis, loading, error, analyzeBatch };
}

// --- tRPC React Hook Wrappers for ML Service ---

/**
 * Hook for analyzing property photos (mutation)
 * Usage: const { mutate, isPending } = useAnalyzePropertyPhotos(options)
 */
export function useAnalyzePropertyPhotos(options = {}) {
  return api.property.photo.analyzePhotos.useMutation(options);
}

/**
 * Hook for fetching ML analysis for a property (query)
 * Usage: const { data, isLoading } = useGetPropertyAnalysis(propertyId, options)
 */
export function useGetPropertyAnalysis(propertyId: string, options = {}) {
  return api.property.photo.getAnalysis.useQuery(
    { propertyId },
    { enabled: !!propertyId, ...options },
  );
}

/**
 * Hook for updating property analysis settings (mutation)
 * Usage: const { mutate, isPending } = useUpdateAnalysisSettings(options)
 */
export function useUpdateAnalysisSettings(options = {}) {
  return api.property.photo.updatePhotoAnalysisData.useMutation(options);
}

// Utility functions for ML analysis
export const mlUtils = {
  // Calculate property score from analysis
  calculatePropertyScore(analysis: PropertyAnalysis): number {
    const features = analysis.property_features;
    const scores = [
      features.interior_quality,
      features.modernity_score,
      features.space_utilization,
      features.lighting_quality,
      features.cleanliness,
      features.aesthetic_appeal,
    ];
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  },

  // Get property type emoji
  getPropertyTypeEmoji(type: string): string {
    const emojiMap: Record<string, string> = {
      apartment: "🏢",
      house: "🏠",
      condo: "🏘️",
      villa: "🏰",
      studio: "🏡",
      townhouse: "🏘️",
    };
    return emojiMap[type] || "🏠";
  },

  // Format price for display
  formatPrice(price: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  // Get confidence level color
  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  },
};
