"use client";

import { Tab } from "@headlessui/react";
import {
  Building2,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  Crown,
  Edit,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  Star,
  Users,
  X
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { useState } from "react";

import GallerySlider from "@/components/GallerySlider";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";
import Image from "next/image";
import Avatar from "~/shared/Avatar";

import { api } from "~/trpc/react";

// Type definitions based on agency schema
interface AgencyData {
  id: string;
  name: string;
  description?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    Agent: number;
    Property: number;
    User: number;
    Subscription: number;
  };
  Agent?: AgentData[];
  Property?: PropertyData[];
  Subscription?: SubscriptionData[];
}

interface AgentData {
  id: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  address?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  isActive?: boolean;
  _count?: {
    Property: number;
    Reservation: number;
    Review: number;
  };
  Property?: PropertyData[];
}

interface PhotoLike { url: string; caption?: string }

interface PropertyData {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  // Supports both legacy string[] and new Photo[] { id, url, caption, ... }
  images?: (string | PhotoLike)[];
  location?: string;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

interface SubscriptionData {
  id: string;
  status: string;
  createdAt: Date;
  expiresAt?: Date;
}

interface AgencyFormData {
  name: string;
  description: string;
  email: string;
  phoneNumber: string;
  address: string;
  website: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  isActive: boolean;
}

// Agency Edit Modal Component
const AgencyEditModal = ({ 
  isOpen, 
  onClose, 
  agencyData, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  agencyData: AgencyData | null; 
  onSave: (data: AgencyFormData) => Promise<void>; 
}) => {
  const _t = useTranslations("Agencies.profile");
  const [formData, setFormData] = useState<AgencyFormData>({
    name: agencyData?.name ?? "",
    description: agencyData?.description ?? "",
    email: agencyData?.email ?? "",
    phoneNumber: agencyData?.phoneNumber ?? "",
    address: agencyData?.address ?? "",
    website: agencyData?.website ?? "",
    status: agencyData?.status ?? "PENDING",
    isActive: agencyData?.isActive ?? true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof AgencyFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving agency:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="agency-modal-overlay">
      <div className="agency-modal-content">
        <div className="agency-modal-header">
          <h2 className="agency-modal-title">{_t('editProfile')}</h2>
          <button onClick={onClose} className="agency-modal-close">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="agency-modal-form">
          <div className="agency-form-grid">
            <div className="agency-form-field">
              <Label htmlFor="name">{_t('editModal.fields.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={_t('editModal.fields.namePlaceholder')}
                required
              />
            </div>

            <div className="agency-form-field">
              <Label htmlFor="email">{_t('editModal.fields.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={_t('editModal.fields.emailPlaceholder')}
              />
            </div>

            <div className="agency-form-field">
              <Label htmlFor="phone">{_t('editModal.fields.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder={_t('editModal.fields.phonePlaceholder')}
              />
            </div>

            <div className="agency-form-field">
              <Label htmlFor="website">{_t('editModal.fields.website')}</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder={_t('editModal.fields.websitePlaceholder')}
              />
            </div>

            <div className="agency-form-field">
              <Label htmlFor="status">{_t('editModal.fields.status')}</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as "PENDING" | "ACTIVE" | "SUSPENDED")}>
                <SelectTrigger>
                  <SelectValue placeholder={_t('editModal.fields.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">{_t('statusOptions.PENDING')}</SelectItem>
                  <SelectItem value="ACTIVE">{_t('statusOptions.ACTIVE')}</SelectItem>
                  <SelectItem value="SUSPENDED">{_t('statusOptions.SUSPENDED')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="agency-form-field">
              <Label htmlFor="isActive">{_t('editModal.fields.activeStatus')}</Label>
              <Select value={formData.isActive ? "true" : "false"} onValueChange={(value) => handleInputChange('isActive', value === "true")}>
                <SelectTrigger>
                  <SelectValue placeholder={_t('editModal.fields.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">{_t('editModal.fields.active')}</SelectItem>
                  <SelectItem value="false">{_t('editModal.fields.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="agency-form-field col-span-2">
              <Label htmlFor="address">{_t('editModal.fields.address')}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder={_t('editModal.fields.addressPlaceholder')}
              />
            </div>

            <div className="agency-form-field col-span-2">
              <Label htmlFor="description">{_t('editModal.fields.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={_t('editModal.fields.descriptionPlaceholder')}
                rows={4}
              />
            </div>
          </div>

          <div className="agency-modal-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              {_t('actions.cancel')}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  {_t('loading.saving')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {_t('actions.save')}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// About Us Section Component
const AboutUsSection = ({ agencyData }: { agencyData: AgencyData | null }) => {
  const t = useTranslations("Agencies.profile");
  const [_isEditing, _setIsEditing] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsPhotoUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Photo uploaded:', file.name);
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsPhotoUploading(false);
    }
  };

  const handleEditToggle = () => {
    setIsModalOpen(true);
  };

  const handleSaveAgency = async (formData: AgencyFormData) => {
    console.log('Saving agency data:', formData);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <>
      <Card className="agency-about-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Agency Photo */}
            <div className="relative group">
              <Avatar
                sizeClass="w-28 h-28 text-3xl"
                imgUrl={agencyData?.logoUrl ?? ""}
                hasChecked={agencyData?.isActive}
                hasCheckedClass="w-6 h-6 -top-1 right-1"
              />
              {/* Photo Change Overlay */}
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPhotoUploading}
                  className="text-white text-sm font-medium hover:text-gray-200 transition-colors"
                >
                  {isPhotoUploading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* Agency Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {agencyData?.name ?? t('card.title')}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      4.5 (112 {t('reviews')})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={agencyData?.isActive ? "default" : "secondary"}>
                      {agencyData?.status ?? t('active')}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {t('tier.basic')}
                    </Badge>
                  </div>
                </div>
                <Button onClick={handleEditToggle} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  {t('editProfile')}
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{agencyData?._count?.Property ?? 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('properties')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{agencyData?._count?.Agent ?? 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('agents')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{agencyData?._count?.User ?? 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('users')}</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agencyData?.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{agencyData.email}</span>
                  </div>
                )}
                {agencyData?.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{agencyData.phoneNumber}</span>
                  </div>
                )}
                {agencyData?.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={agencyData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      {t('website')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {agencyData?.address && (
                  <div className="flex items-center gap-2 text-sm sm:col-span-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{agencyData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agency Edit Modal */}
      <AgencyEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agencyData={agencyData}
        onSave={handleSaveAgency}
      />
    </>
  );
};

export default function AgencyProfilePage() {
  const t = useTranslations("Agencies.profile");
  const params = useParams();
  const agencyId = params?.id as string;

  const { data: agencyData, isLoading: isLoadingAgency } = (api as any).agency.byId.useQuery(
    { id: agencyId },
    { enabled: !!agencyId }
  );

  const { data: propertiesResponse, isLoading: _isLoadingProperties } = (api as any).property.all.useQuery(
    { agencyId: agencyId },
    { enabled: !!agencyId }
  );

  const { data: agentsResponse, isLoading: _isLoadingAgents } = (api as any).agent.all.useQuery(
    { agencyId: agencyId },
    { enabled: !!agencyId }
  );

  const { data: reviewsResponse, isLoading: _isLoadingReviews } = (api as any).review.all.useQuery(
    { agencyId: agencyId },
    { enabled: !!agencyId }
  );

  // Extract data from responses with proper typing
  const properties = (propertiesResponse as { data: PropertyData[] })?.data ?? [];
  const agents = (agentsResponse as { data: AgentData[] })?.data ?? [];
  const reviews = (reviewsResponse as { data: any[] })?.data ?? [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{t('active')}</Badge>;
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{t('pending')}</Badge>;
      case "SUSPENDED":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">{t('suspended')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "BASIC":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{t('basic')}</Badge>;
      case "PRO":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">{t('pro')}</Badge>;
      case "ENTERPRISE":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">{t('enterprise')}</Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  if (isLoadingAgency) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!agencyData) {
  return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('notFound')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('notFoundDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* About Us Section */}
      <AboutUsSection agencyData={agencyData} />

      {/* Agency Description */}
      <Card className="agency-description-card">
        <CardContent className="p-6">
          <div className="agency-description-content">
            <h3 className="agency-description-title">{t('about')}</h3>
            <p className="agency-description-text">
              {agencyData.description ?? t('noDataDescription')}
            </p>
                    </div>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      <Card className="agency-subscription-card">
        <CardHeader className="pb-4">
          <div className="agency-subscription-header">
            <div className="agency-subscription-title">
              <Crown className="agency-subscription-icon" />
              <span>{t('subscriptionStatus')}</span>
                    </div>
            {getTierBadge(agencyData.tier ?? "BASIC")}
                    </div>
        </CardHeader>
        <CardContent>
          <div className="agency-subscription-content">
            <div className="agency-subscription-grid">
              <div className="agency-subscription-item">
                <Calendar className="agency-subscription-date-icon" />
                <div className="agency-subscription-date-text">
                  <span className="agency-subscription-label">{t('started')}</span>
                  <span className="agency-subscription-value">
                    {agencyData.createdAt ? new Date(agencyData.createdAt).toLocaleDateString() : t('notAvailable')}
                  </span>
                </div>
              </div>
              <div className="agency-subscription-item">
                <Clock className="agency-subscription-date-icon" />
                <div className="agency-subscription-date-text">
                  <span className="agency-subscription-label">{t('expires')}</span>
                  <span className="agency-subscription-value">
                    {agencyData.expiresAt ? new Date(agencyData.expiresAt).toLocaleDateString() : t('notAvailable')}
                  </span>
                  </div>
              </div>
            </div>
            <div className="agency-subscription-auto-renew-yes">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('autoRenew')}</span>
            </div>
          </div>
                </CardContent>
              </Card>

      {/* Tabs */}
      <div className="agency-tabs-container">
        <Tab.Group>
          <Tab.List className="agency-tabs-list">
            <Tab className="agency-tabs-trigger">
              {({ selected }) => (
                <span className={selected ? "agency-tabs-trigger-active" : ""}>
                  {t('portfolio')} ({properties.length})
                </span>
              )}
            </Tab>
            <Tab className="agency-tabs-trigger">
              {({ selected }) => (
                <span className={selected ? "agency-tabs-trigger-active" : ""}>
                  {t('agents')} ({agents.length})
                </span>
              )}
            </Tab>
            <Tab className="agency-tabs-trigger">
              {({ selected }) => (
                <span className={selected ? "agency-tabs-trigger-active" : ""}>
                  {t('reviews')} ({reviews.length})
                </span>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className="agency-tabs-panels">
            <Tab.Panel>
              <AgencyPortfolioSection properties={properties} />
            </Tab.Panel>
            <Tab.Panel>
              <AgencyAgentsSection agents={agents} />
            </Tab.Panel>
            <Tab.Panel>
              <AgencyReviewsSection reviews={reviews} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
          </div>
                  </div>
  );
}

// Agency Portfolio Section
const AgencyPortfolioSection = ({ properties }: { properties: PropertyData[] }) => {
  const t = useTranslations("Agencies.profile");

  if (properties.length === 0) {
    return (
      <div className="agency-empty-state">
        <Building2 className="agency-empty-state-icon" />
        <p className="agency-empty-state-text">{t('noProperties')}</p>
                  </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="agency-portfolio-header">
        <h3 className="agency-portfolio-title">{t('portfolio')}</h3>
        <p className="agency-portfolio-description">{t('portfolioDescription')}</p>
                </div>

      <div className="agency-portfolio-grid">
        {properties.map((property: PropertyData) => (
          <PropertyCard key={property.id} property={property} />
        ))}
                    </div>
                  </div>
  );
};

// Property Card Component
const PropertyCard = ({ property }: { property: PropertyData }) => {
  const t = useTranslations("Agencies.profile");
  
  return (
    <Card className="agency-property-card">
      <div className="agency-property-image-container relative">
        <GallerySlider
          className="w-full"
          photos={(property.images ?? []).length > 0
            ? (property.images!).map((it) => {
                const src = typeof it === "string" ? it : it.url;
                const alt = (typeof it !== "string" ? it.caption : undefined) ?? property.title || t('properties');
                return { src, alt };
              })
            : [{ src: "/images/placeholder.jpg", alt: property.title || t('properties') }]}
          ratioClass="aspect-w-4 aspect-h-3"
          imageClass="rounded-xl"
          galleryClass="rounded-xl"
          navigation={true}
          href="#"
          uniqueID={property.id}
        />
        <div className="agency-property-badge">
          <Badge variant="default">{property.status || t('available')}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h4 className="agency-property-title">{property.title || t('properties')}</h4>
        <p className="agency-property-location">{property.location ?? t('card.address')}</p>
        <div className="agency-property-details">
          <span className="agency-property-price">{property.price ?? t('price')}</span>
          <div className="agency-property-features">
            <span>{property.bedrooms ?? 0} {t('property.bedrooms')}</span>
            <span>{property.bathrooms ?? 0} {t('property.bathrooms')}</span>
            <span>{property.area ?? 0} {t('property.area')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
  );
};

// Agency Agents Section
const AgencyAgentsSection = ({ agents }: { agents: AgentData[] }) => {
  const t = useTranslations("Agencies.profile");

  if (agents.length === 0) {
    return (
      <div className="agency-empty-state">
        <Users className="agency-empty-state-icon" />
        <p className="agency-empty-state-text">{t('noAgents')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="agency-agents-header">
        <h3 className="agency-agents-title">{t('agents')}</h3>
        <p className="agency-agents-description">{t('agentsDescription')}</p>
      </div>
      
      <div className="agency-agents-grid">
        {agents.map((agent: AgentData) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

// Agent Card Component
const AgentCard = ({ agent }: { agent: AgentData }) => {
  const t = useTranslations("Agencies.profile");
  
  return (
    <Card className="agency-agent-card">
      <CardContent className="p-6">
        <div className="agency-agent-header">
          <Avatar
            sizeClass="h-14 w-14 text-lg"
            imgUrl={agent?.logoUrl ?? ""}
            hasChecked={agent?.isActive}
            hasCheckedClass="w-5 h-5 -top-1 right-1"
          />
          <div className="agency-agent-info">
            <h4 className="agency-agent-name">
              {agent.name}
            </h4>
            <p className="agency-agent-email">{agent.email}</p>
            <div className="agency-agent-badges">
              <Badge variant="outline" className="text-xs">
                {t('agent')}
              </Badge>
              {agent.isActive && (
                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                  {t('active')}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="agency-agent-stats">
          <div className="agency-agent-stat">
            <span className="agency-agent-stat-value">{agent._count?.Property ?? 0}</span>
            <span className="agency-agent-stat-label">{t('properties')}</span>
          </div>
          <div className="agency-agent-stat">
            <span className="agency-agent-stat-value">{agent._count?.Reservation ?? 0}</span>
            <span className="agency-agent-stat-label">{t('reservations')}</span>
          </div>
          <div className="agency-agent-stat">
            <span className="agency-agent-stat-value">{agent._count?.Review ?? 0}</span>
            <span className="agency-agent-stat-label">{t('reviews')}</span>
          </div>
        </div>
        
        <div className="agency-agent-portfolio">
          <h5 className="agency-agent-portfolio-title">{t('agentPortfolio')}</h5>
          <div className="agency-agent-portfolio-grid">
            {agent.Property?.slice(0, 3).map((property: PropertyData) => (
              <div key={property.id} className="agency-agent-portfolio-item">
                <Image
                  src={
                    typeof property.images?.[0] === 'string'
                      ? (property.images?.[0])
                      : (property.images?.[0])?.url ?? "/images/placeholder.jpg"
                  }
                  alt={property.title || t('properties')}
                  width={80}
                  height={60}
                  className="agency-agent-portfolio-image"
                />
                <div className="agency-agent-portfolio-info">
                  <span className="agency-agent-portfolio-title">{property.title || t('properties')}</span>
                  <span className="agency-agent-portfolio-price">{property.price ?? t('price')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Agency Reviews Section
const AgencyReviewsSection = ({ reviews }: { reviews: any[] }) => {
  const t = useTranslations("Agencies.profile");

  if (reviews.length === 0) {
    return (
      <div className="agency-empty-state">
        <Star className="agency-empty-state-icon" />
        <p className="agency-empty-state-text">{t('noReviews')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="agency-reviews-header">
        <h3 className="agency-reviews-title">{t('reviews')}</h3>
        <p className="agency-reviews-description">{t('reviewsDescription')}</p>
      </div>
      
      <div className="agency-reviews-list">
        {reviews.map((review: any) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }: { review: any }) => {
  const t = useTranslations("Agencies.profile");
  
  return (
    <Card className="agency-review-card">
      <CardContent className="p-4">
        <div className="agency-review-header">
          <div className="agency-review-user">
            <Avatar
              sizeClass="h-10 w-10 text-base"
              imgUrl={review.user?.profilePicture ?? review.user?.image}
            />
            <div className="agency-review-user-info">
              <span className="agency-review-user-name">
                {(review.user?.name ?? review.user?.displayName) ?? t('review.anonymous')}
              </span>
              <div className="agency-review-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < (review.rating ?? 0) ? "text-yellow-500 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <span className="agency-review-date">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="agency-review-comment">{review.comment ?? review.content}</p>
      </CardContent>
    </Card>
  );
};