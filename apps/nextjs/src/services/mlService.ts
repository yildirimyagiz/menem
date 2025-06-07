// Type definition for processed image from ML service
import { api } from "~/trpc/react";

export interface ProcessedImage {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  width: number; // Top-level width, potentially redundant if always same as metadata.dimensions.width
  height: number; // Top-level height, potentially redundant if always same as metadata.dimensions.height
  format: string; // Top-level format, potentially redundant if always same as metadata.format
  metadata: {
    dimensions: {
      width: number;
      height: number;
    };
    format: string; // e.g., 'jpeg', 'png'
    // Potentially other metadata from the ML service
  };
}

// Define types for other API interactions
export interface PropertyAnalysisData {
  propertyId: string;
  score: number; // Example field
  tags: string[]; // Example field
  // ... other relevant analysis data from your API
}

export interface AnalysisSettings {
  enableAutoTagging?: boolean; // Example setting
  qualityThreshold?: number; // Example setting
  // ... define the structure of your settings object
}

export interface UpdateSettingsResponse {
  success: boolean;
  message?: string;
  updatedSettings?: AnalysisSettings; // Optional: return the updated settings
}

/**
 * Analyze property photos using the ML service
 *
 * @param coverImage - Main property image
 * @param additionalImages - Additional property images
 * @returns Array of processed images
 */
export async function analyzePropertyPhotos(
  coverImage: File,
  additionalImages: File[] = [],
): Promise<ProcessedImage[]> {
  try {
    // Create form data with files
    const formData = new FormData();
    formData.append("cover_image", coverImage);

    additionalImages.forEach((image, index) => {
      formData.append(`additional_image_${index}`, image);
    });

    // Assuming your api mutation `ml.analyzePhotos` is set up to accept FormData.
    // The backend api procedure would use a library like `zod-form-data`
    // or expect `z.instanceof(FormData)` and parse it.
    // Ensure your api client link is configured for credentials if needed (was 'include' in fetch).
    // Use property router for ML analytics
    const result = await api.property.photo.analyzePhotos.mutate(formData);
    return result;
  } catch (error) {
    // api errors are typically apiClientError instances.
    // Log the error and re-throw it so the caller can handle it.
    console.error("Error analyzing property photos (api):", error);
    throw error;
  }
}

/**
 * Get ML analysis for a specific property
 * @param propertyId - The ID of the property
 * @returns The analysis data for the property
 */
export async function getPropertyAnalysis(
  propertyId: string,
): Promise<PropertyAnalysisData> {
  try {
    // Assumes a api query like `api.properties.getAnalysis`
    // Use property router for ML analytics
    const result = await api.property.photo.getAnalysis.fetch({ propertyId });
    return result;
  } catch (error) {
    console.error(
      `Error fetching analysis for property ${propertyId} (api):`,
      error,
    );
    throw error;
  }
}

/**
 * Update property analysis settings
 * @param settings - The new settings to apply
 * @returns Confirmation or the updated settings
 */
export async function updateAnalysisSettings(
  settings: AnalysisSettings,
): Promise<UpdateSettingsResponse> {
  try {
    // Assumes a api mutation like `api.ml.updateSettings`
    // Use property router for ML analytics
    const result = await api.property.photo.updatePhotoAnalysisData.mutate(
      settings,
    );
    return result;
  } catch (error) {
    console.error("Error updating analysis settings (api):", error);
    throw error;
  }
}
