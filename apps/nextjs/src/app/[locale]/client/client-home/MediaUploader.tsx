import { useRef, useState } from "react";
import Image from "next/image";

// No Album type needed; albums are not a backend entity. Group by propertyId if grouping is required.

import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Checkbox } from "@acme/ui/checkbox";
import { Label } from "@acme/ui/label";
import { Progress } from "@acme/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@acme/ui/tabs";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

// MediaItem type based on SanitizedPhoto from backend
export interface MediaItem {
  id: string;
  url: string;
  type: string;
  caption?: string | null;
  featured?: boolean;
  width?: number | null;
  height?: number | null;
  fileSize?: number | null;
  mimeType?: string | null;
  dominantColor?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date | null;
  userId?: string | null;
  agencyId?: string | null;
  propertyId?: string | null;
  agentId?: string | null;
  postId?: string | null;
}

interface MediaUploaderProps {
  propertyId: string;
  listingId?: string;
  onUploadComplete?: (media: MediaItem[]) => void;
}

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


export function MediaUploader({
  propertyId,
  listingId,
  onUploadComplete,
}: MediaUploaderProps) {
  // FIXME: This workaround disables type safety. You should:
  // 1. Ensure your backend TRPC router exposes a `create` mutation for photo.
  // 2. Regenerate your frontend TRPC client so that `api.photo.create.useMutation` is properly typed.
  // 3. Remove all uses of `any` and optional chaining here for full type safety.
  const uploadPhoto = (api.photo as any)?.create?.useMutation?.();
  // Removed selectedAlbum state; albums are not a backend entity.
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState("images");
  const [categories, setCategories] = useState<string[]>([]);
  const [setCoverImage, setSetCoverImage] = useState<"first" | "none">("first");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      let validFiles: File[] = [];
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
      setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
      const newUrls = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newUrls]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    const url = previewUrls[index];
    if (typeof url === "string") URL.revokeObjectURL(url);
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const handleCategoryToggle = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);
    setProgress(0);
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setProgress(progress);
      if (progress >= 90) clearInterval(progressInterval);
    }, 200);
    try {
      const uploaded: MediaItem[] = [];
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("propertyId", propertyId);
        if (listingId) formData.append("listingId", listingId);
        if (categories.length > 0)
          formData.append("categories", JSON.stringify(categories));
        if (!uploadPhoto || typeof uploadPhoto.mutateAsync !== 'function') {
          throw new Error("Photo upload mutation is not defined. Check your TRPC router and client.");
        }
        const result = await uploadPhoto.mutateAsync(formData as any);
        // Type guard: ensure result is a MediaItem
        if (result && typeof result === 'object' && 'id' in result && 'url' in result) {
          uploaded.push(result as MediaItem);
        }
      }
      clearInterval(progressInterval);
      setProgress(100);
      setUploadedMedia(uploaded);
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (onUploadComplete) onUploadComplete(uploaded);
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${uploaded.length} files`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

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
                            src={typeof previewUrls[index] === "string" ? previewUrls[index] : ""}
                            alt={`Preview ${index}`}
                            width={120}
                            height={96}
                            className="h-24 w-full rounded-md object-cover"
                          />
                        ) : file.type.startsWith("video/") ? (
                          <div className="flex h-24 w-full items-center justify-center rounded-md bg-gray-200">
                            [Video Icon]
                          </div>
                        ) : (
                          <div className="flex h-24 w-full items-center justify-center rounded-md bg-gray-200">
                            [Other Icon]
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
                    <h4 className="mb-2 font-medium">Categorization</h4>
                    <p className="mb-3 text-sm text-gray-500">
                      Select categories that apply to these files
                    </p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {(activeTab === "images"
                        ? ROOM_TYPES
                        : activeTab === "videos"
                          ? [...ROOM_TYPES, ...VIEW_TYPES]
                          : ROOM_TYPES
                      ).map((category) => (
                        <div
                          key={category.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={category.value}
                            checked={categories.includes(category.value)}
                            onCheckedChange={() =>
                              handleCategoryToggle(category.value)
                            }
                            disabled={isUploading}
                          />
                          <Label
                            htmlFor={category.value}
                            className="cursor-pointer text-sm"
                          >
                            {category.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Cover Image</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="use-first-as-cover"
                        checked={setCoverImage === "first"}
                        onCheckedChange={(checked) =>
                          setSetCoverImage(checked ? "first" : "none")
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
                Uploading... {progress}%
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
                  {media.type === "image" ? (
                    <Image
                      src={typeof media.url === "string" ? media.url : ""}
                      alt={typeof media.url === "string" ? media.url : ""}
                      width={120}
                      height={96}
                      className="h-24 w-full rounded-md object-cover"
                    />
                  ) : media.type === "video" ? (
                    <div className="flex h-24 w-full items-center justify-center rounded-md bg-gray-200">
                      [Video Icon]
                    </div>
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center rounded-md bg-gray-200">
                      [Other Icon]
                    </div>
                  )}
                  <p className="mt-1 truncate text-xs">{media.url}</p>
                  {media.featured && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                      Cover
                    </span>
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
