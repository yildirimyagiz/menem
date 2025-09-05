import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';

import { Button } from "@reservatior/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@reservatior/ui/card";
import { Checkbox } from "@reservatior/ui/checkbox";
import { Label } from "@reservatior/ui/label";
import { Progress } from "@reservatior/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";

import { useToast } from "~/hooks/use-toast";
import { useAnalyzePropertyPhotos } from "~/services/mlService";
import { api } from "~/trpc/react";

// Types - Align with backend's PhotoType enum
type MediaType =
  | "COVER"
  | "GALLERY"
  | "PROFILE"
  | "DOCUMENT"
  | "INTERIOR"
  | "EXTERIOR"
  | "AERIAL"
  | "FLOOR_PLAN";

// Simplified SanitizedPhoto type to match our needs
interface SanitizedPhoto {
  id: string;
  url: string;
  type: MediaType;
  caption: string | null;
  featured: boolean;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  mimeType: string | null;
  dominantColor: string | null;
  propertyId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface MediaItem {
  id: string;
  url: string;
  type: MediaType;
  caption: string | null;
  featured: boolean;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  mimeType: string | null;
  dominantColor: string | null;
  propertyId: string | null; // Changed from ?: string to match backend
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
  analysis: any | null;
}

interface MediaUploaderProps {
  propertyId: string;
  listingId?: string;
  onUploadComplete?: (media: MediaItem[]) => void;
}

// Helper to map file types to our MediaType
const getMediaTypeFromFile = (file: File): MediaType => {
  if (file.type.startsWith("image/")) {
    return "GALLERY";
  } else if (file.type.startsWith("video/")) {
    return "GALLERY";
  }
  return "DOCUMENT";
};

export function MediaUploader({
  propertyId,
  listingId,
  onUploadComplete,
}: MediaUploaderProps) {
  const t = useTranslations('clientHome.property');
  // State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState("images");
  const [coverImageSetting, setCoverImageSetting] = useState<"first" | "none">(
    "first",
  );
  const [analysisResults, setAnalysisResults] = useState<Record<string, any>>(
    {},
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  // Define types for analysis response and variables
  type AnalysisResponse = {
    success: boolean;
    analysis: any;
    filename: string;
  };

  type AnalysisVariables = {
    filename: any;
    propertyId: string;
    coverImage: string;
    data: { filename: string };
  };

  const { mutate: analyzePhoto, isPending: isAnalyzing } =
    useAnalyzePropertyPhotos({
      onSuccess: (data: AnalysisResponse, variables: AnalysisVariables) => {
        // Handle successful analysis
        setAnalysisResults((prev) => ({
          ...prev,
          [variables.data.filename]: data.analysis,
        }));

        // Update the uploaded media with analysis results
        setUploadedMedia((prev) =>
          prev.map((media) =>
            media.url.includes(variables.data.filename)
              ? { ...media, analysis: data.analysis }
              : media,
          ),
        );

        toast({
          title: t('photos.analysisComplete'),
          description: t('photos.analysisCompleteFor', { filename: variables.data.filename }),
        });
      },
      onError: (error: Error, variables: AnalysisVariables) => {
        console.error("Photo analysis failed:", error);
        toast({
          title: t('photos.analysisFailed'),
          description: t('photos.analysisFailedFor', { filename: variables.filename }),
          variant: "destructive",
        });
      },
    });

  // TRPC Mutation for photo upload with retry logic
  const uploadPhotoMutation = api.photo.create.useMutation({
    onSuccess: (data: SanitizedPhoto) => {
      if (!data.id) {
        console.error("Received invalid photo data from server:", data);
        throw new Error("Invalid photo data received from server");
      }

      // Create a MediaItem from the uploaded photo data
      // The analysis field will be updated when the analysis completes
      const mediaItem: MediaItem = {
        ...data,
        url: data.url || "",
        type: data.type || "GALLERY",
        caption: data.caption ?? null,
        featured: data.featured ?? false,
        width: data.width ?? null,
        height: data.height ?? null,
        fileSize: data.fileSize ?? null,
        mimeType: data.mimeType ?? null,
        dominantColor: data.dominantColor ?? null,
        propertyId: data.propertyId ?? null,
        createdAt: data.createdAt ?? new Date(),
        updatedAt: data.updatedAt ?? new Date(),
        deletedAt: data.deletedAt ?? null,
        analysis: null, // Will be updated after analysis completes
      };

      // Trigger analysis for the uploaded image
      if (data.url) {
        analyzePhoto({
          propertyId: propertyId,
          coverImage: data.url,
          data: { filename: data.url.split("/").pop() || "" },
        });
      }

      setUploadedMedia((prev) => [...prev, mediaItem]);
      return mediaItem;
    },
    onError: (error) => {
      console.error("Photo upload failed:", error);
      const errorMessage = error.message || t('photos.uploadFailed');

      toast({
        title: t('photos.uploadFailed'),
        description: errorMessage,
        variant: "destructive",
      });

      throw error; // Re-throw to be caught by the calling function
    },
  });

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleMediaAnalysis = useCallback((file: File) => {
    if (file.type.startsWith("image/")) {
      // Store file info for analysis
      setAnalysisResults((prev) => ({
        ...prev,
        [file.name]: {
          filename: file.name,
          status: "pending",
          timestamp: new Date().toISOString(),
        },
      }));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(analysisResults).length > 0) {
      console.log("ML Analysis Results:", analysisResults);

      // Update uploaded media with analysis results
      setUploadedMedia((prev) =>
        prev.map((media) => ({
          ...media,
          analysis: analysisResults[media.url] || null,
        })),
      );

      // Notify parent component if needed
      if (onUploadComplete) {
        onUploadComplete(uploadedMedia);
      }
    }
  }, [analysisResults, uploadedMedia, onUploadComplete]);

  const handleUploadComplete = useCallback(
    (media: MediaItem[]) => {
      // Process each uploaded media for ML analysis
      media.forEach((item) => {
        const file = selectedFiles.find(
          (f) => f.name === item.url.split("/").pop(),
        );
        if (file) {
          handleMediaAnalysis(file);
        }
      });

      setUploadedMedia((prev) => [...prev, ...media]);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setProgress(0);
      setIsUploading(false);
    },
    [selectedFiles, handleMediaAnalysis],
  );

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const newFiles = Array.from(event.target.files);
    let validFiles: File[] = [];

    // Filter files based on active tab
    if (activeTab === "images") {
      validFiles = newFiles.filter((file) => file.type.startsWith("image/"));
      if (validFiles.length !== newFiles.length) {
        toast({
          title: "Invalid Files",
          description: "Only image files are allowed in this tab",
          variant: "destructive",
        });
      }
    } else if (activeTab === "videos") {
      validFiles = newFiles.filter((file) => file.type.startsWith("video/"));
      if (validFiles.length !== newFiles.length) {
        toast({
          title: "Invalid Files",
          description: "Only video files are allowed in this tab",
          variant: "destructive",
        });
      }
    } else if (activeTab === "floor_plans") {
      validFiles = newFiles.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type === "image/svg+xml" ||
          file.type.startsWith("image/"),
      );
      if (validFiles.length !== newFiles.length) {
        toast({
          title: "Invalid Files",
          description:
            "Only PDF, SVG, or image files are allowed for floor plans",
          variant: "destructive",
        });
      }
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // Handle file removal
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    const urlToRevoke = previewUrls[index];
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
    }
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle the upload process with improved error handling and type safety
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Process files in batches to avoid overwhelming the server
      const BATCH_SIZE = 3;
      const results: MediaItem[] = [];
      const failedUploads: { file: File; error: Error }[] = [];

      // Process files in batches
      for (let i = 0; i < selectedFiles.length; i += BATCH_SIZE) {
        const batch = selectedFiles.slice(i, i + BATCH_SIZE);

        // Update progress for batch start
        setProgress((i / selectedFiles.length) * 90);

        // Process current batch
        const batchPromises = batch.map(async (file, index) => {
          try {
            // Create a preview URL for the file
            const previewUrl = URL.createObjectURL(file);

            // Create a proper File object URL
            const fileUrl = URL.createObjectURL(file);

            const uploadData = {
              url: fileUrl,
              type: getMediaTypeFromFile(file),
              caption: file.name,
              width: file.type.startsWith("image/") ? 0 : undefined, // Provide default width for images
              height: file.type.startsWith("image/") ? 0 : undefined, // Provide default height for images
              fileSize: file.size,
              mimeType: file.type,
              propertyId: propertyId,
              featured: i + index === 0 && coverImageSetting === "first",
              // Server will handle these fields
              userId: undefined,
              agencyId: undefined,
              agentId: undefined,
              postId: listingId,
              // Add required fields with default values
              dominantColor: undefined,
              deletedAt: undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as const;

            const result = await uploadPhotoMutation.mutateAsync(uploadData);

            // Clean up the preview URL after successful upload
            URL.revokeObjectURL(previewUrl);

            return { success: true, data: result } as const;
          } catch (error) {
            console.error(`Failed to upload file ${file.name}:`, error);
            return {
              success: false,
              error: error instanceof Error ? error : new Error(String(error)),
              file,
              data: null,
            } as const;
          }
        });

        // Wait for all uploads in the current batch to complete
        const batchResults = await Promise.all(batchPromises);

        // Process batch results
        for (const result of batchResults) {
          if (result.success && result.data) {
            // Ensure we have a valid MediaItem before pushing
            const mediaItem: MediaItem = {
              ...result.data,
              analysis: null, // Ensure analysis is initialized
            };
            results.push(mediaItem);
          } else if (!result.success) {
            failedUploads.push({
              file: result.file,
              error: result.error,
            });
          }
        }
      }

      // Update progress to 100%
      setProgress(100);

      // Handle upload results
      if (results.length > 0) {
        // Notify parent component of successful uploads
        if (onUploadComplete) {
          onUploadComplete(results);
        }

        // Show success message
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${results.length} file${results.length !== 1 ? "s" : ""}`,
        });

        // Clear successful uploads
        setSelectedFiles((prev) =>
          prev.filter((_, idx) => {
            if (idx >= prev.length) return false;
            const file = prev[idx];
            if (!file) return false;
            return !failedUploads.some((f) => f.file === file);
          }),
        );

        setPreviewUrls((prev) =>
          prev.filter((_, idx) => {
            return idx >= results.length;
          }),
        );
      }

      // Handle failed uploads
      if (failedUploads.length > 0) {
        console.error("Some files failed to upload:", failedUploads);

        // Show error message for failed uploads
        toast({
          title: "Some Uploads Failed",
          description: `${failedUploads.length} file${failedUploads.length !== 1 ? "s" : ""} failed to upload. Please try again.`,
          variant: "destructive",
        });

        // Update state to only keep failed uploads
        setSelectedFiles((prev) => {
          const failedFilePaths = failedUploads.map((f) => f.file.name);
          return prev.filter((file) => failedFilePaths.includes(file.name));
        });
      }

      return { results, failedUploads };
    } catch (error) {
      console.error("Upload process failed:", error);
      toast({
        title: "Upload Process Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  // Constants for room types and view types
  const ROOM_TYPES = [
    { value: "living_room", label: "Living Room" },
    { value: "master_bedroom", label: "Master Bedroom" },
    { value: "bedroom_1", label: "Bedroom 1" },
    { value: "bedroom_2", label: "Bedroom 2" },
    { value: "master_bathroom", label: "Master Bathroom" },
    { value: "bathroom_1", label: "Bathroom 1" },
    { value: "kitchen", label: "Kitchen" },
    { value: "dining_room", label: "Dining Room" },
    { value: "balcony", label: "Balcony" },
    { value: "terrace", label: "Terrace" },
    { value: "garden", label: "Garden" },
    { value: "entrance", label: "Entrance" },
    { value: "hallway", label: "Hallway" },
  ];

  const VIEW_TYPES = [
    { value: "garden_view", label: "Garden View" },
    { value: "sea_view", label: "Sea View" },
    { value: "city_view", label: "City View" },
    { value: "pool_view", label: "Pool View" },
    { value: "mountain_view", label: "Mountain View" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Property Media Upload</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Property Media</CardTitle>
          <CardDescription>Select files to upload</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="floor_plans">Floor Plans</TabsTrigger>
            </TabsList>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
              accept={
                activeTab === "images"
                  ? "image/*"
                  : activeTab === "videos"
                    ? "video/*"
                    : "image/*,application/pdf,image/svg+xml"
              }
              aria-label={`Select ${activeTab === "images" ? "Images" : activeTab === "videos" ? "Videos" : "Floor Plans"}`}
            />

            <div className="my-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full"
              >
                Select{" "}
                {activeTab === "images"
                  ? "Images"
                  : activeTab === "videos"
                    ? "Videos"
                    : "Floor Plans"}
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <>
                <div className="mt-4 rounded-md border p-4">
                  <h4 className="mb-2 font-medium">
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <div className="grid max-h-60 grid-cols-2 gap-4 overflow-y-auto p-2 sm:grid-cols-3 md:grid-cols-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="group relative">
                        {file.type.startsWith("image/") ? (
                          <Image
                            src={previewUrls[index] ?? ""}
                            alt={`Preview ${index}`}
                            width={120}
                            height={96}
                            className="h-24 w-full rounded-md object-cover"
                            unoptimized={
                              previewUrls[index]?.startsWith("blob:") ?? false
                            }
                          />
                        ) : file.type.startsWith("video/") ? (
                          <div className="flex h-24 w-full items-center justify-center rounded-md bg-gray-200">
                            [Video Icon]
                          </div>
                        ) : (
                          <div className="flex h-24 w-full items-center justify-center rounded-md bg-gray-200">
                            [Document Icon]
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          disabled={isUploading}
                        >
                          &times;
                        </button>
                        <p className="mt-1 truncate text-xs">{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="mb-2 font-medium">Cover Image</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="use-first-as-cover"
                        checked={coverImageSetting === "first"}
                        onCheckedChange={(checked) =>
                          setCoverImageSetting(checked ? "first" : "none")
                        }
                        disabled={isUploading}
                      />
                      <Label
                        htmlFor="use-first-as-cover"
                        className="cursor-pointer text-sm"
                      >
                        Use first image as cover
                      </Label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {isUploading && (
            <div className="w-full space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-xs text-gray-500">
                Uploading... {Math.round(progress)}%
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload Media"}
          </Button>
        </CardFooter>
      </Card>

      {uploadedMedia.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Uploaded</CardTitle>
            <CardDescription>
              {uploadedMedia.length} files uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {uploadedMedia.map((media) => (
                <div key={media.id} className="overflow-hidden">
                  {media.mimeType?.startsWith("image/") ? (
                    <Image
                      src={media.url}
                      alt={media.caption || "Uploaded media"}
                      width={120}
                      height={96}
                      className="h-24 w-full rounded-md object-cover"
                      unoptimized={media.url?.startsWith("blob:") ?? false}
                    />
                  ) : media.mimeType?.startsWith("video/") ? (
                    <div className="flex h-24 w-full items-center justify-center rounded-md bg-gray-200">
                      [Video]
                    </div>
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center rounded-md bg-gray-200">
                      [Document]
                    </div>
                  )}
                  <p className="mt-1 truncate text-xs">
                    {media.caption || media.type}
                  </p>
                  {media.featured && (
                    <p className="text-xs text-gray-500">Cover Image</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MediaUploader;
