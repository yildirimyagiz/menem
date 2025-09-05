"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Download,
  ExternalLink,
  Filter,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Star,
  X,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Separator } from "@reservatior/ui/separator";

import { useToast } from "~/hooks/use-toast";

interface FacilitySearchResult {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  type?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  source: "google" | "yelp" | "foursquare" | "manual";
  selected?: boolean;
}

interface FacilitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (facilities: FacilitySearchResult[]) => void;
}

const FacilitySearchModal = ({
  isOpen,
  onClose,
  onImport,
}: FacilitySearchModalProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [searchType, setSearchType] = useState<"nearby" | "query">("nearby");
  const [facilityType, setFacilityType] = useState("");
  const [radius, setRadius] = useState("5000");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<FacilitySearchResult[]>([]);
  const [selectedResults, setSelectedResults] = useState<
    FacilitySearchResult[]
  >([]);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Mock search results for demonstration
  const mockSearchResults: FacilitySearchResult[] = [
    {
      id: "1",
      name: "Downtown Business Center",
      description: "Modern office complex with state-of-the-art facilities",
      address: "123 Main Street",
      city: "New York",
      country: "USA",
      phone: "+1 (555) 123-4567",
      email: "info@downtownbc.com",
      website: "https://downtownbc.com",
      rating: 4.5,
      type: "OFFICE",
      category: "Business Center",
      latitude: 40.7128,
      longitude: -74.006,
      source: "google",
    },
    {
      id: "2",
      name: "Central Park Gym",
      description: "24/7 fitness center with swimming pool and yoga classes",
      address: "456 Park Avenue",
      city: "New York",
      country: "USA",
      phone: "+1 (555) 987-6543",
      email: "hello@centralparkgym.com",
      website: "https://centralparkgym.com",
      rating: 4.2,
      type: "GYM",
      category: "Fitness Center",
      latitude: 40.7589,
      longitude: -73.9851,
      source: "yelp",
    },
    {
      id: "3",
      name: "Tech Hub Co-working",
      description: "Innovative co-working space for startups and entrepreneurs",
      address: "789 Innovation Drive",
      city: "New York",
      country: "USA",
      phone: "+1 (555) 456-7890",
      email: "contact@techhub.com",
      website: "https://techhub.com",
      rating: 4.8,
      type: "OFFICE",
      category: "Co-working Space",
      latitude: 40.7505,
      longitude: -73.9934,
      source: "foursquare",
    },
    {
      id: "4",
      name: "Riverside Conference Center",
      description:
        "Professional conference and event venue with modern amenities",
      address: "321 River Road",
      city: "New York",
      country: "USA",
      phone: "+1 (555) 321-0987",
      email: "events@riversidecc.com",
      website: "https://riversidecc.com",
      rating: 4.6,
      type: "CONFERENCE_HALL",
      category: "Event Venue",
      latitude: 40.7614,
      longitude: -73.9776,
      source: "google",
    },
    {
      id: "5",
      name: "Green Valley Sports Complex",
      description: "Multi-sport facility with indoor and outdoor courts",
      address: "654 Sports Lane",
      city: "New York",
      country: "USA",
      phone: "+1 (555) 654-3210",
      email: "info@greenvalleysports.com",
      website: "https://greenvalleysports.com",
      rating: 4.3,
      type: "FITNESS",
      category: "Sports Complex",
      latitude: 40.7829,
      longitude: -73.9654,
      source: "yelp",
    },
  ];

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          toast({
            title: "Location Access",
            description:
              "Unable to get your current location. Please enter a location manually.",
            variant: "destructive",
          });
        },
      );
    }
  }, [toast]);

  const handleSearch = async () => {
    if (!searchQuery && !location && !currentLocation) {
      toast({
        title: "Search Error",
        description: "Please enter a search query or location",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Use mock results for demonstration
      // In a real implementation, you would call actual APIs here
      const searchResults = mockSearchResults.filter((result) => {
        if (searchQuery) {
          return (
            result.name.toLowerCase().includes(searchQuery.toLowerCase()) ??
            result.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ??
            result.category
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ??
            result.address?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return true;
      });

      setResults(searchResults);
      setSelectedResults([]);

      toast({
        title: "Search Complete",
        description: `Found ${searchResults.length} facilities`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search for facilities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: FacilitySearchResult) => {
    setSelectedResults((prev) => {
      const isSelected = prev.some((r) => r.id === result.id);
      if (isSelected) {
        return prev.filter((r) => r.id !== result.id);
      } else {
        return [...prev, { ...result, selected: true }];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedResults.length === results.length) {
      setSelectedResults([]);
    } else {
      setSelectedResults(results.map((r) => ({ ...r, selected: true })));
    }
  };

  const handleImport = () => {
    if (selectedResults.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one facility to import",
        variant: "destructive",
      });
      return;
    }

    onImport(selectedResults);
    toast({
      title: "Import Successful",
      description: `Imported ${selectedResults.length} facilities`,
    });
    onClose();
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "google":
        return <Globe className="h-4 w-4 text-blue-600" />;
      case "yelp":
        return <Star className="h-4 w-4 text-yellow-600" />;
      case "foursquare":
        return <MapPin className="h-4 w-4 text-purple-600" />;
      default:
        return <Building2 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "google":
        return "Google Places";
      case "yelp":
        return "Yelp";
      case "foursquare":
        return "Foursquare";
      default:
        return "Manual";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Import Facilities
          </DialogTitle>
          <DialogDescription>
            Search for facilities from web sources and import them to your
            database
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-full flex-col">
          {/* Search Controls */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Search Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="search-type">Search Type</Label>
                  <Select
                    value={searchType}
                    onValueChange={(value: "nearby" | "query") =>
                      setSearchType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nearby">Nearby Facilities</SelectItem>
                      <SelectItem value="query">Search by Query</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facility-type">Facility Type</Label>
                  <Select value={facilityType} onValueChange={setFacilityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="OFFICE">Office</SelectItem>
                      <SelectItem value="GYM">Gym</SelectItem>
                      <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                      <SelectItem value="HOTEL">Hotel</SelectItem>
                      <SelectItem value="CONFERENCE_HALL">
                        Conference Hall
                      </SelectItem>
                      <SelectItem value="FITNESS">Fitness Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {searchType === "nearby" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="Enter city, address, or use current location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {currentLocation && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setLocation(
                            `${currentLocation.lat}, ${currentLocation.lng}`,
                          )
                        }
                      >
                        Use Current Location
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="radius">Search Radius</Label>
                    <Select value={radius} onValueChange={setRadius}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">1 km</SelectItem>
                        <SelectItem value="5000">5 km</SelectItem>
                        <SelectItem value="10000">10 km</SelectItem>
                        <SelectItem value="25000">25 km</SelectItem>
                        <SelectItem value="50000">50 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {searchType === "query" && (
                <div className="space-y-2">
                  <Label htmlFor="search-query">Search Query</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search-query"
                      placeholder="Search for facilities, businesses, or services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Facilities
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="flex-1 overflow-hidden">
            {results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Search Results</h3>
                    <Badge variant="secondary">{results.length} found</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {selectedResults.length === results.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={selectedResults.length === 0}
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Import Selected ({selectedResults.length})
                    </Button>
                  </div>
                </div>

                <div className="grid max-h-96 gap-4 overflow-y-auto">
                  {results.map((result) => {
                    const isSelected = selectedResults.some(
                      (r) => r.id === result.id,
                    );
                    return (
                      <Card
                        key={result.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected
                            ? "bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-900/20"
                            : ""
                        }`}
                        onClick={() => handleSelectResult(result)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                    <Building2 className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="mb-1 flex items-center gap-2">
                                    <h4 className="truncate font-semibold text-gray-900 dark:text-gray-100">
                                      {result.name}
                                    </h4>
                                    {result.rating && (
                                      <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {result.rating}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                    {result.description}
                                  </p>

                                  <div className="mb-3 flex flex-wrap gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {result.category}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      {getSourceIcon(result.source)}
                                      {getSourceLabel(result.source)}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 dark:text-gray-400 md:grid-cols-2">
                                    {result.address && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate">
                                          {result.address}
                                        </span>
                                      </div>
                                    )}
                                    {result.phone && (
                                      <div className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        <span>{result.phone}</span>
                                      </div>
                                    )}
                                    {result.email && (
                                      <div className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate">
                                          {result.email}
                                        </span>
                                      </div>
                                    )}
                                    {result.website && (
                                      <div className="flex items-center gap-1">
                                        <ExternalLink className="h-3 w-3" />
                                        <span className="truncate">
                                          {result.website}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="ml-4 flex-shrink-0">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {isSelected && (
                                  <CheckCircle className="h-4 w-4 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {results.length === 0 && !isSearching && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <Search className="mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    No Search Results
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search criteria or location
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FacilitySearchModal;
