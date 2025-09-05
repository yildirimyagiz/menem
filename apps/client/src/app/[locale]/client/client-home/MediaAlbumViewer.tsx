import { useTranslations } from 'next-intl';
import Image from "next/image";
import { useEffect, useState } from "react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@reservatior/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Separator } from "@reservatior/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";

import { useToast } from "~/hooks/use-toast";

// Define types locally since the API module is missing
export interface Album {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: string;
  isPublic: boolean;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  url: string;
  type: string;
  originalFilename: string;
  category: string;
  subCategories?: string[];
  isCover?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MediaAlbumViewerProps {
  propertyId: string;
  albumId: string;
  onSharingLinkGenerated?: (shareUrl: string) => void;
}

// Mock API functions since the actual API module is missing
const getAlbumDetails = async (propertyId: string, albumId: string) => {
  // Mock implementation - replace with actual API call
  return {
    album: {
      id: albumId,
      name: "Sample Album",
      description: "Sample album description",
      category: "living_room",
      type: "image",
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Album,
    media: [] as MediaItem[],
    coverImage: null as MediaItem | null,
  };
};

const generateSharingLink = async (propertyId: string, albumId: string) => {
  // Mock implementation - replace with actual API call
  return {
    shareUrl: `/share/albums/${albumId}`,
  };
};

export function MediaAlbumViewer({
  propertyId,
  albumId,
  onSharingLinkGenerated,
}: MediaAlbumViewerProps) {
  const t = useTranslations('clientHome.property');
  const [album, setAlbum] = useState<Album | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [coverImage, setCoverImage] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (propertyId && albumId) {
      fetchAlbumDetails();
    }
    // eslint-disable-next-line
  }, [propertyId, albumId]);

  const fetchAlbumDetails = async () => {
    try {
      setIsLoading(true);
      const data = await getAlbumDetails(propertyId, albumId);
      setAlbum(data.album);
      setMediaItems(data.media);
      if (data.coverImage) setCoverImage(data.coverImage);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load album details",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleGenerateSharingLink = async () => {
    try {
      setIsLoading(true);
      const data = await generateSharingLink(propertyId, albumId);
      setShareUrl(data.shareUrl);
      onSharingLinkGenerated?.(data.shareUrl);
      toast({
        title: "Sharing Link Created",
        description: "Album sharing link has been generated",
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate sharing link",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleCopyShareLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(`${window.location.origin}${shareUrl}`);
      toast({
        title: "Link Copied",
        description: "Sharing link copied to clipboard",
      });
    }
  };

  const openLightbox = (index: number) => {
    setCurrentMediaIndex(index);
    setIsLightboxOpen(true);
  };

  const navigateLightbox = (direction: "next" | "prev") => {
    setCurrentMediaIndex((prev) => {
      if (direction === "next")
        return prev === mediaItems.length - 1 ? 0 : prev + 1;
      else return prev === 0 ? mediaItems.length - 1 : prev - 1;
    });
  };

  const filteredMediaItems = mediaItems.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "images") return item.type === "image";
    if (activeTab === "videos") return item.type === "video";
    if (activeTab === "floor_plans") return item.type === "floor_plan";
    return (
      item.subCategories?.includes(activeTab) || item.category === activeTab
    );
  });

  const allCategories = Array.from(
    new Set(
      mediaItems.flatMap((item) => [
        item.category,
        ...(item.subCategories || []),
      ]),
    ),
  ).filter(Boolean);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      living_room: "Living Room",
      master_bedroom: "Master Bedroom",
      bedroom_1: "Bedroom 1",
      bathroom_1: "Bathroom 1",
      kitchen: "Kitchen",
      dining_room: "Dining Room",
      balcony: "Balcony",
      garden: "Garden",
      entrance: "Entrance",
    };
    return labels[category] || category;
  };

  if (isLoading && !album) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {album && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{album.name}</CardTitle>
                  <CardDescription>
                    {album.description ||
                      `${getCategoryLabel(album.category)} album`}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {album.isPublic && album.shareToken ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={`${window.location.origin}${shareUrl || `/share/albums/${album.shareToken}`}`}
                        readOnly
                        className="max-w-64"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyShareLink}
                      >
                        {t('mediaAlbumViewer.copy')}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateSharingLink}
                      disabled={isLoading}
                    >
                      {isLoading ? t('mediaAlbumViewer.generating') : t('mediaAlbumViewer.shareAlbum')}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    {mediaItems.length} {t('mediaAlbumViewer.items')}
                  </div>
                  <Badge>{getCategoryLabel(album.category)}</Badge>
                  <Badge variant="outline">{album.type}</Badge>
                </div>
                <div className="text-sm text-gray-500">
                  {t('mediaAlbumViewer.created')}: {new Date(album.createdAt).toLocaleDateString()}
                </div>
              </div>
              {coverImage && (
                <div className="mb-6">
                  <h3 className="mb-2 text-sm font-medium">{t('mediaAlbumViewer.albumCover')}</h3>
                  <div
                    className="relative mx-auto w-full max-w-xs cursor-pointer overflow-hidden rounded-md"
                    onClick={() => {
                      const coverIndex = mediaItems.findIndex(
                        (item) => item.id === coverImage.id,
                      );
                      if (coverIndex !== -1) openLightbox(coverIndex);
                    }}
                  >
                    {coverImage.type === "image" ? (
                      <Image
                        src={coverImage.url}
                        alt="Cover"
                        width={400}
                        height={192}
                        className="h-48 w-full object-cover"
                      />
                    ) : coverImage.type === "video" ? (
                      <div className="flex h-48 w-full items-center justify-center bg-gray-200">
                        [Video Icon]
                      </div>
                    ) : (
                      <div className="flex h-48 w-full items-center justify-center bg-gray-200">
                        [Other Icon]
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white">
                      <p className="truncate text-sm">
                        {coverImage.originalFilename}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 flex flex-wrap">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="floor_plans">Floor Plans</TabsTrigger>
                  <Separator orientation="vertical" className="mx-2 h-6" />
                  {allCategories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {getCategoryLabel(category)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={activeTab} className="mt-0">
                  {filteredMediaItems.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-gray-500">
                        No media items found for this filter
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {filteredMediaItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="group relative cursor-pointer"
                          onClick={() =>
                            openLightbox(
                              mediaItems.findIndex((m) => m.id === item.id),
                            )
                          }
                        >
                          {item.type === "image" ? (
                            <Image
                              src={item.url}
                              alt={item.originalFilename}
                              width={200}
                              height={160}
                              className="h-40 w-full rounded-md object-cover"
                            />
                          ) : item.type === "video" ? (
                            <div className="flex h-40 w-full items-center justify-center rounded-md bg-gray-200">
                              [Video Icon]
                            </div>
                          ) : (
                            <div className="flex h-40 w-full items-center justify-center rounded-md bg-gray-200">
                              [Other Icon]
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                            <p className="truncate text-xs">
                              {item.originalFilename}
                            </p>
                          </div>
                          {item.isCover && (
                            <span className="absolute right-2 top-2 rounded-md bg-blue-500 px-2 py-1 text-xs text-white">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          {/* Lightbox Dialog */}
          <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
            <DialogContent className="h-[90vh] w-[95vw] max-w-4xl bg-black p-0">
              <div className="relative flex h-full flex-col">
                <DialogHeader className="absolute left-0 right-0 top-0 z-10 bg-black bg-opacity-75 p-4 text-white">
                  <DialogTitle>
                    {mediaItems[currentMediaIndex]?.originalFilename}
                  </DialogTitle>
                  <div className="text-gray-300">
                    {mediaItems[currentMediaIndex]?.category && (
                      <Badge
                        variant="outline"
                        className="mr-2 border-white text-white"
                      >
                        {getCategoryLabel(
                          mediaItems[currentMediaIndex]?.category,
                        )}
                      </Badge>
                    )}
                    {mediaItems[currentMediaIndex]?.subCategories?.map(
                      (cat: string) => (
                        <Badge
                          key={cat}
                          variant="outline"
                          className="mr-2 border-white text-white"
                        >
                          {getCategoryLabel(cat)}
                        </Badge>
                      ),
                    )}
                  </div>
                </DialogHeader>
                <div className="flex flex-1 items-center justify-center p-12 pt-20">
                  {mediaItems[currentMediaIndex]?.type === "image" ? (
                    <Image
                      src={mediaItems[currentMediaIndex]?.url}
                      alt={mediaItems[currentMediaIndex]?.originalFilename}
                      width={800}
                      height={600}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : mediaItems[currentMediaIndex]?.type === "video" ? (
                    <video
                      src={mediaItems[currentMediaIndex]?.url}
                      controls
                      className="max-h-full max-w-full"
                    />
                  ) : (
                    <iframe
                      src={mediaItems[currentMediaIndex]?.url}
                      className="h-full w-full"
                      title={mediaItems[currentMediaIndex]?.originalFilename}
                    />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 top-0 flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full w-16 rounded-none bg-black bg-opacity-20 text-white hover:bg-opacity-40"
                    onClick={() => navigateLightbox("prev")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Button>
                </div>
                <div className="absolute bottom-0 right-0 top-0 flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full w-16 rounded-none bg-black bg-opacity-20 text-white hover:bg-opacity-40"
                    onClick={() => navigateLightbox("next")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white">
                      {currentMediaIndex + 1} of {mediaItems.length}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLightboxOpen(false)}
                      >
                        Close
                      </Button>
                      {mediaItems[currentMediaIndex]?.type === "image" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = mediaItems[currentMediaIndex]?.url || "";
                            a.download =
                              mediaItems[currentMediaIndex]?.originalFilename ||
                              "download";
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}
                        >
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
