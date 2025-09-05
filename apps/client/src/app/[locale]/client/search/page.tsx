"use client";

import { Building, Filter, Home, Search, Star } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";

export default function SearchPage() {
  const t = useTranslations('search');
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [location, setLocation] = useState("");

  const mockProperties = [
    {
      id: "1",
      title: "Modern Downtown Apartment",
      type: "Apartment",
      location: "Downtown, City Center",
      price: 2500,
      currency: "USD",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      rating: 4.8,
      image: "/api/placeholder/400/300",
      status: "FOR_RENT",
    },
    {
      id: "2",
      title: "Luxury Villa with Pool",
      type: "Villa",
      location: "Suburban Area",
      price: 850000,
      currency: "USD",
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      rating: 4.9,
      image: "/api/placeholder/400/300",
      status: "FOR_SALE",
    },
    {
      id: "3",
      title: "Cozy Studio in University District",
      type: "Studio",
      location: "University District",
      price: 1200,
      currency: "USD",
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      rating: 4.5,
      image: "/api/placeholder/400/300",
      status: "FOR_RENT",
    },
  ];

  return (
    <div className="container mx-auto p-6 ios-layout android-layout">
      <div className="mobile-fade-in mb-8">
        <h1 className="mobile-text-xl font-bold lg:text-3xl">{t('title')}</h1>
        <p className="mobile-text-base text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Search Filters */}
      <Card className="mobile-card mobile-fade-in mb-6 ios-mobile-menu android-mobile-menu">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t('filters.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="mobile-text-sm font-medium">{t('filters.search')}</label>
              <Input
                placeholder={t('filters.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-input"
              />
            </div>
            <div className="space-y-2">
              <label className="mobile-text-sm font-medium">{t('filters.location')}</label>
              <Input
                placeholder={t('filters.locationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mobile-input"
              />
            </div>
            <div className="space-y-2">
              <label className="mobile-text-sm font-medium">{t('filters.propertyType')}</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="mobile-input">
                  <SelectValue placeholder={t('filters.propertyTypePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allTypes')}</SelectItem>
                  <SelectItem value="apartment">{t('filters.apartment')}</SelectItem>
                  <SelectItem value="house">{t('filters.house')}</SelectItem>
                  <SelectItem value="villa">{t('filters.villa')}</SelectItem>
                  <SelectItem value="studio">{t('filters.studio')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="mobile-text-sm font-medium">{t('filters.priceRange')}</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="mobile-input">
                  <SelectValue placeholder={t('filters.priceRangePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allPrices')}</SelectItem>
                  <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                  <SelectItem value="1000-3000">$1,000 - $3,000</SelectItem>
                  <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
                  <SelectItem value="5000+">$5,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="mobile-button">
              <Filter className="mr-2 h-4 w-4" />
              {t('filters.applyFilters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mobile-fade-in">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="mobile-text-lg font-semibold">{t('results.title')}</h2>
          <span className="mobile-text-sm text-muted-foreground">
            {t('results.propertiesFound', { count: mockProperties.length })}
          </span>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mobile-card grid w-full grid-cols-2 ios-mobile-menu android-mobile-menu">
            <TabsTrigger value="grid" className="mobile-button">{t('results.gridView')}</TabsTrigger>
            <TabsTrigger value="list" className="mobile-button">{t('results.listView')}</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProperties.map((property) => (
                <Card key={property.id} className="mobile-card mobile-scale-in overflow-hidden ios-mobile-menu android-mobile-menu">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.title}
                      className="h-full w-full object-cover"
                      width={400}
                      height={300}
                    />
                    <div className="absolute right-2 top-2">
                      <Badge variant="secondary" className="mobile-text-xs">
                        {property.status === "FOR_RENT" ? t('results.forRent') : t('results.forSale')}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <div className="rounded-lg bg-white/90 px-3 py-1 backdrop-blur-sm">
                        <span className="mobile-text-lg font-bold text-blue-600">
                          ${property.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mobile-text-lg font-semibold">{property.title}</h3>
                    <p className="mobile-text-sm text-muted-foreground">{property.location}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <span className="mobile-text-sm">{t('results.beds', { count: property.bedrooms })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="mobile-text-sm">{t('results.baths', { count: property.bathrooms })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="mobile-text-sm">{t('results.rating', { rating: property.rating })}</span>
                      </div>
                    </div>
                    <Button className="mobile-button mt-4 w-full">
                      {t('results.viewDetails')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div className="space-y-4">
              {mockProperties.map((property) => (
                <Card key={property.id} className="mobile-card mobile-scale-in ios-mobile-menu android-mobile-menu">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                        <Image
                          src={property.image}
                          alt={property.title}
                          className="h-full w-full object-cover"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="mobile-text-lg font-semibold">{property.title}</h3>
                            <p className="mobile-text-sm text-muted-foreground">{property.location}</p>
                            <div className="mt-2 flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Home className="h-4 w-4 text-muted-foreground" />
                                <span className="mobile-text-sm">{t('results.beds', { count: property.bedrooms })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span className="mobile-text-sm">{t('results.baths', { count: property.bathrooms })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="mobile-text-sm">{t('results.rating', { rating: property.rating })}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="mobile-text-lg font-bold text-blue-600">
                              ${property.price.toLocaleString()}
                            </div>
                            <Badge variant="secondary" className="mobile-text-xs">
                              {property.status === "FOR_RENT" ? t('results.forRent') : t('results.forSale')}
                            </Badge>
                          </div>
                        </div>
                        <Button className="mobile-button mt-4 w-full">
                          {t('results.viewDetails')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
