import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  File,
  Maximize2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Label } from "@acme/ui/label";
import { RadioGroup, RadioGroupItem } from "@acme/ui/radio-group";
import { Separator } from "@acme/ui/separator";
import { Skeleton } from "@acme/ui/skeleton";
import { Slider } from "@acme/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import { useToast } from "~/hooks/use-toast";
import { MovingBorder } from "./moving-border";

interface Room {
  id: string;
  name: string;
  dimensions: {
    width: number;
    length: number;
    height: number;
    area: number;
    volume: number;
  };
}

interface SpatialAnalysis {
  propertyId: number;
  roomDimensions: Record<
    string,
    {
      width: number;
      length: number;
      height: number;
      area: number;
      volume: number;
    }
  >;
  totalArea: number;
  totalVolume: number;
  floorPlanPath: string;
  pointCloudPath?: string;
  processedAt: Date;
}

interface SpatialViewerProps {
  propertyId: number;
  onClose?: () => void;
}

export function SpatialViewer({ propertyId, onClose }: SpatialViewerProps) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<SpatialAnalysis | null>(null);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // Fetch spatial analysis data
  useEffect(() => {
    async function fetchSpatialData() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/spatial/property/${propertyId}/analysis`,
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError(
              "No spatial analysis available for this property. Upload a walkthrough video to generate a floor plan.",
            );
          } else {
            setError("Failed to load spatial data");
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setAnalysis(data);

        // Set the first room as active by default
        const roomNames = Object.keys(data.roomDimensions);
        if (roomNames.length > 0) {
          setActiveRoom(roomNames[0]);
        }
      } catch (err) {
        console.error("Error fetching spatial data:", err);
        setError("Failed to load spatial data");
      } finally {
        setLoading(false);
      }
    }

    fetchSpatialData();
  }, [propertyId]);

  // Handle zoom in/out
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  // Handle rotation
  const handleRotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    if (imageRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        imageRef.current.requestFullscreen();
      }
    }
  };

  // Handle room selection
  const handleRoomSelect = (roomName: string) => {
    setActiveRoom(roomName);

    toast({
      title: `${roomName} Selected`,
      description: `Viewing details for ${roomName}`,
    });
  };

  // Format dimensions as readable text
  const formatDimension = (value: number) => {
    return `${value.toFixed(1)} m`;
  };

  const formatArea = (value: number) => {
    return `${value.toFixed(1)} m²`;
  };

  const formatVolume = (value: number) => {
    return `${value.toFixed(1)} m³`;
  };

  // Render room details
  const renderRoomDetails = () => {
    if (!analysis || !activeRoom || !analysis.roomDimensions[activeRoom]) {
      return null;
    }

    const room = analysis.roomDimensions[activeRoom];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{activeRoom} Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Dimensions</p>
            <p className="font-medium">
              {formatDimension(room.width)} × {formatDimension(room.length)} ×{" "}
              {formatDimension(room.height)}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Area</p>
            <p className="font-medium">{formatArea(room.area)}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Volume</p>
            <p className="font-medium">{formatVolume(room.volume)}</p>
          </div>
        </div>
      </div>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-1/2" />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <div className="w-full space-y-2">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Property Spatial Data</CardTitle>
          <CardDescription>3D visualization and measurements</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="space-y-4 text-center">
            <File className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="text-lg font-medium">No Spatial Data Available</h3>
            <p className="max-w-md text-sm text-muted-foreground">{error}</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no analysis data is available
  if (!analysis) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Property Spatial Data</CardTitle>
          <CardDescription>3D visualization and measurements</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="space-y-4 text-center">
            <File className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="text-lg font-medium">
              No Spatial Analysis Available
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Upload a walkthrough video to generate a floor plan and 3D model
              of this property.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const rooms = Object.keys(analysis.roomDimensions).map((name) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    dimensions: analysis.roomDimensions[name],
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Property Spatial Analysis</CardTitle>
        <CardDescription>
          Interactive floor plan and 3D visualization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="floor-plan" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="floor-plan" className="flex-1">
              Floor Plan
            </TabsTrigger>
            <TabsTrigger value="3d-model" className="flex-1">
              3D Model
            </TabsTrigger>
            <TabsTrigger value="dimensions" className="flex-1">
              Dimensions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="floor-plan" className="mt-4">
            <div className="relative flex h-[400px] items-center justify-center overflow-hidden rounded-lg border bg-slate-50 dark:bg-slate-900">
              <MovingBorder
                className="pointer-events-none absolute inset-0 z-10"
                borderRadius="0.5rem"
              >
                <div className="absolute inset-0"></div>
              </MovingBorder>

              <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                <img
                  ref={imageRef}
                  src={`/api/spatial/property/${propertyId}/floor-plan`}
                  alt="Floor Plan"
                  className="object-contain transition-all duration-200"
                  style={{
                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRotateCounterClockwise}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRotateClockwise}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFullscreen}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <h3 className="font-medium">Select a Room</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {rooms.map((room) => (
                  <Button
                    key={room.id}
                    variant={activeRoom === room.name ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleRoomSelect(room.name)}
                  >
                    {room.name}
                  </Button>
                ))}
              </div>

              {activeRoom && (
                <div className="mt-4 rounded-lg border p-4">
                  {renderRoomDetails()}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="3d-model" className="mt-4">
            <div className="flex flex-col items-center justify-center rounded-lg border py-10">
              <div className="space-y-4 text-center">
                <h3 className="text-lg font-medium">3D Model Viewer</h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  3D model viewer is currently under development. Check back
                  soon for interactive 3D models of your properties.
                </p>
                <div className="mx-auto max-w-sm">
                  <Button variant="outline" className="w-full">
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dimensions" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Property Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Area
                      </span>
                      <span className="font-medium">
                        {formatArea(analysis.totalArea)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Volume
                      </span>
                      <span className="font-medium">
                        {formatVolume(analysis.totalVolume)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Rooms
                      </span>
                      <span className="font-medium">{rooms.length}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Room Comparison</h3>
                  <div className="space-y-2">
                    {rooms.map((room) => (
                      <div key={room.id} className="flex justify-between">
                        <span className="text-sm">{room.name}</span>
                        <span className="font-medium">
                          {formatArea(room.dimensions.area)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-4 font-medium">Detailed Measurements</h3>
                <div className="space-y-6">
                  {rooms.map((room) => (
                    <div key={room.id} className="space-y-2">
                      <h4 className="text-sm font-medium">{room.name}</h4>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <div>
                          <span className="block text-xs text-muted-foreground">
                            Width
                          </span>
                          <span>{formatDimension(room.dimensions.width)}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-muted-foreground">
                            Length
                          </span>
                          <span>{formatDimension(room.dimensions.length)}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-muted-foreground">
                            Height
                          </span>
                          <span>{formatDimension(room.dimensions.height)}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-muted-foreground">
                            Area
                          </span>
                          <span>{formatArea(room.dimensions.area)}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-muted-foreground">
                            Volume
                          </span>
                          <span>{formatVolume(room.dimensions.volume)}</span>
                        </div>
                      </div>
                      {room.id !== rooms[rooms.length - 1].id && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button>Download Floor Plan</Button>
      </CardFooter>
    </Card>
  );
}
