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

// Module-scoped helpers for safe unknown access
const isRecord = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object';
const getArrayData = (x: unknown): unknown[] => {
  if (isRecord(x) && Array.isArray((x as { data?: unknown }).data)) {
    return (x as { data: unknown[] }).data;
  }
  return [];
};
const asNumber = (v: unknown, fallback: number): number => (typeof v === 'number' ? v : fallback);

// Type definitions based on schemas
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
  createdAt: Date | string | number;
  updatedAt: Date;
  expiresAt?: Date | string | number;
  tier?: "BASIC" | "PRO" | "ENTERPRISE";
  agency?: {
    id: string;
    name: string;
    isActive: boolean;
    status: string;
    logoUrl?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    website?: string | null;
  } | null;
  _count?: {
    Property: number;
    Reservation: number;
    Review: number;
  };
  Property?: PropertyData[];
}

interface ReviewUser {
  profilePicture?: string | null;
  image?: string | null;
  name?: string | null;
  displayName?: string | null;
}

interface Review {
  id: string;
  rating?: number | null;
  createdAt: string | number | Date;
  comment?: string | null;
  content?: string | null;
  user?: ReviewUser | null;
}

interface PropertyData {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  images?: string[];
  location?: string;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

interface AgentFormData {
  name: string;
  bio: string;
  email: string;
  phoneNumber: string;
  address: string;
  website: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  isActive: boolean;
}

// Agent Edit Modal Component
const AgentEditModal = ({ 
  isOpen, 
  onClose, 
  agentData, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  agentData: AgentData | null; 
  onSave: (data: AgentFormData) => Promise<void>; 
}) => {
  const _t = useTranslations("agent.profile");
  const [formData, setFormData] = useState<AgentFormData>({
    name: agentData?.name ?? "",
    bio: agentData?.bio ?? "",
    email: agentData?.email ?? "",
    phoneNumber: agentData?.phoneNumber ?? "",
    address: agentData?.address ?? "",
    website: agentData?.website ?? "",
    status: agentData?.status ?? "PENDING",
    isActive: agentData?.isActive ?? true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof AgentFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving agent:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="agent-modal-overlay">
      <div className="agent-modal-content">
        <div className="agent-modal-header">
          <h2 className="agent-modal-title">{_t('editProfile')}</h2>
          <button onClick={onClose} className="agent-modal-close">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="agent-modal-form">
          <div className="agent-form-grid">
            <div className="agent-form-field">
              <Label htmlFor="name">{_t('editModal.fields.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={_t('editModal.fields.namePlaceholder')}
                required
              />
            </div>

            <div className="agent-form-field">
              <Label htmlFor="email">{_t('editModal.fields.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={_t('editModal.fields.emailPlaceholder')}
              />
            </div>

            <div className="agent-form-field">
              <Label htmlFor="phoneNumber">{_t('editModal.fields.phone')}</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder={_t('editModal.fields.phonePlaceholder')}
              />
            </div>

            <div className="agent-form-field">
              <Label htmlFor="website">{_t('editModal.fields.website')}</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder={_t('editModal.fields.websitePlaceholder')}
              />
            </div>

            <div className="agent-form-field">
              <Label htmlFor="status">{_t('editModal.fields.status')}</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as "PENDING" | "ACTIVE" | "SUSPENDED")}>
                <SelectTrigger>
                  <SelectValue placeholder={_t('editModal.fields.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">{_t('editModal.fields.statusOptions.PENDING')}</SelectItem>
                  <SelectItem value="ACTIVE">{_t('editModal.fields.statusOptions.ACTIVE')}</SelectItem>
                  <SelectItem value="SUSPENDED">{_t('editModal.fields.statusOptions.SUSPENDED')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="agent-form-field">
              <Label htmlFor="isActive">{_t('editModal.fields.isActive')}</Label>
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

            <div className="agent-form-field col-span-2">
              <Label htmlFor="address">{_t('editModal.fields.address')}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder={_t('editModal.fields.addressPlaceholder')}
              />
            </div>

            <div className="agent-form-field col-span-2">
              <Label htmlFor="bio">{_t('editModal.fields.bio')}</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder={_t('editModal.fields.bioPlaceholder')}
                rows={4}
              />
            </div>
          </div>

          <div className="agent-modal-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              {_t('editModal.actions.cancel')}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  {_t('editModal.actions.saving')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {_t('editModal.actions.saveChanges')}
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
const AboutUsSection = ({ agentData }: { agentData: AgentData | null }) => {
  const t = useTranslations("agent.profile");
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

  const handleSaveAgent = async (formData: AgentFormData) => {
    console.log('Saving agent data:', formData);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <>
      <Card className="agent-about-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Agent Photo */}
            <div className="relative group">
              <Avatar
                sizeClass="w-28 h-28 text-3xl"
                imgUrl={agentData?.logoUrl ?? ""}
                hasChecked={agentData?.isActive}
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

            {/* Agent Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {agentData?.name ?? "Orlando Lesch"}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      4.5 (112 {t('reviews')})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={agentData?.isActive ? "default" : "secondary"}>
                      {agentData?.status ?? "ACTIVE"}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {t('basic')}
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
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{agentData?._count?.Property ?? 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('properties')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{agentData?._count?.Reservation ?? 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('clients')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{agentData?._count?.Review ?? 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('reviews')}</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agentData?.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{agentData.email}</span>
                  </div>
                )}
                {agentData?.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{agentData.phoneNumber}</span>
                  </div>
                )}
                {agentData?.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={agentData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      {t('website')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {agentData?.address && (
                  <div className="flex items-center gap-2 text-sm sm:col-span-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{agentData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Edit Modal */}
      <AgentEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agentData={agentData}
        onSave={handleSaveAgent}
      />
    </>
  );
};

export default function AgentProfilePage() {
  const t = useTranslations("agent.profile");
  const params = useParams();
  const agentId = params?.id as string;

  const agentQuery = (api as unknown as { agent: { byId: { useQuery: (...args: unknown[]) => { data?: unknown; isLoading?: boolean } } } }).agent.byId.useQuery(
    { id: agentId },
    { enabled: !!agentId }
  );
  const agentData = agentQuery.data as AgentData | undefined;
  const isLoadingAgent = agentQuery.isLoading ?? false;

  const propertiesQuery = (api as unknown as { property: { all: { useQuery: (...args: unknown[]) => { data?: unknown; isLoading?: boolean } } } }).property.all.useQuery(
    { agentId: agentId },
    { enabled: !!agentId }
  );
  const propertiesResponse = propertiesQuery.data;

  const agentsQuery = (api as unknown as { agent: { all: { useQuery: (...args: unknown[]) => { data?: unknown; isLoading?: boolean } } } }).agent.all.useQuery(
    { agencyId: agentData?.agency?.id },
    { enabled: !!agentData?.agency?.id }
  );
  const agentsResponse = agentsQuery.data;

  const reviewsQuery = (api as unknown as { review: { all: { useQuery: (...args: unknown[]) => { data?: unknown; isLoading?: boolean } } } }).review.all.useQuery(
    { agentId: agentId },
    { enabled: !!agentId }
  );
  const reviewsResponse = reviewsQuery.data;

  // Extract data from responses with proper typing
  const properties = getArrayData(propertiesResponse) as PropertyData[];
  const agents = getArrayData(agentsResponse) as AgentData[];
  const reviews = getArrayData(reviewsResponse) as Review[];

  const _getStatusBadge = (status: string) => {
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

  if (isLoadingAgent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!agentData) {
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
      <AboutUsSection agentData={agentData} />

      {/* Agent Description */}
      <Card className="agent-description-card">
        <CardContent className="p-6">
          <div className="agent-description-content">
            <h3 className="agent-description-title">{t('about')}</h3>
            <p className="agent-description-text">
              {agentData.bio ?? t('noDataDescription')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      <Card className="agent-subscription-card">
        <CardHeader className="pb-4">
          <div className="agent-subscription-header">
            <div className="agent-subscription-title">
              <Crown className="agent-subscription-icon" />
              <span>{t('subscriptionStatus')}</span>
            </div>
            {getTierBadge(agentData.tier ?? "BASIC")}
          </div>
        </CardHeader>
        <CardContent>
          <div className="agent-subscription-content">
            <div className="agent-subscription-grid">
              <div className="agent-subscription-item">
                <Calendar className="agent-subscription-date-icon" />
                <div className="agent-subscription-date-text">
                  <span className="agent-subscription-label">{t('started')}</span>
                  <span className="agent-subscription-value">
                    {agentData.createdAt ? new Date(agentData.createdAt).toLocaleDateString() : t('notAvailable')}
                  </span>
                </div>
              </div>
              <div className="agent-subscription-item">
                <Clock className="agent-subscription-date-icon" />
                <div className="agent-subscription-date-text">
                  <span className="agent-subscription-label">{t('expires')}</span>
                  <span className="agent-subscription-value">
                    {agentData.expiresAt ? new Date(agentData.expiresAt).toLocaleDateString() : t('notAvailable')}
                  </span>
                </div>
              </div>
            </div>
            <div className="agent-subscription-auto-renew-yes">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('autoRenew')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="agent-tabs-container">
        <Tab.Group>
          <Tab.List className="agent-tabs-list">
            <Tab className="agent-tabs-trigger">
              {({ selected }) => (
                <span className={selected ? "agent-tabs-trigger-active" : ""}>
                  {t('portfolio')} ({properties.length})
                </span>
              )}
            </Tab>
            <Tab className="agent-tabs-trigger">
              {({ selected }) => (
                <span className={selected ? "agent-tabs-trigger-active" : ""}>
                  {t('agents')} ({agents.length})
                </span>
              )}
            </Tab>
            <Tab className="agent-tabs-trigger">
              {({ selected }) => (
                <span className={selected ? "agent-tabs-trigger-active" : ""}>
                  {t('reviews')} ({reviews.length})
                </span>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className="agent-tabs-panels">
            <Tab.Panel>
              <AgentPortfolioSection properties={properties} />
            </Tab.Panel>
            <Tab.Panel>
              <AgentAgentsSection agents={agents} />
            </Tab.Panel>
            <Tab.Panel>
              <AgentReviewsSection reviews={reviews} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

// Agent Portfolio Section
const AgentPortfolioSection = ({ properties }: { properties: PropertyData[] }) => {
  const t = useTranslations("agent.profile");

  if (properties.length === 0) {
    return (
      <div className="agent-empty-state">
        <Building2 className="agent-empty-state-icon" />
        <p className="agent-empty-state-text">{t('noProperties')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="agent-portfolio-header">
        <h3 className="agent-portfolio-title">{t('portfolio')}</h3>
        <p className="agent-portfolio-description">{t('portfolioDescription')}</p>
      </div>

      <div className="agent-portfolio-grid">
        {properties.map((property: PropertyData) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property }: { property: PropertyData }) => {
  const _t = useTranslations("agent.profile");
  
  return (
    <Card className="agent-property-card">
      <div className="agent-property-image-container">
        <Image
          src={property.images?.[0] ?? "/placeholder-property.jpg"}
          alt={property.title}
          width={300}
          height={200}
          className="agent-property-image"
        />
        <div className="agent-property-badge">
          <Badge variant="default">{property.status}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h4 className="agent-property-title">{property.title}</h4>
        <p className="agent-property-location">{property.location ?? "Location"}</p>
        <div className="agent-property-details">
          <span className="agent-property-price">{property.price ?? "$0"}</span>
          <div className="agent-property-features">
            <span>{property.bedrooms ?? 0} beds</span>
            <span>{property.bathrooms ?? 0} baths</span>
            <span>{property.area ?? 0} sqft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Agent Agents Section
const AgentAgentsSection = ({ agents }: { agents: AgentData[] }) => {
  const t = useTranslations("agent.profile");

  if (agents.length === 0) {
    return (
      <div className="agent-empty-state">
        <Users className="agent-empty-state-icon" />
        <p className="agent-empty-state-text">{t('noAgents')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="agent-agents-header">
        <h3 className="agent-agents-title">{t('agents')}</h3>
        <p className="agent-agents-description">{t('agentsDescription')}</p>
      </div>
      
      <div className="agent-agents-grid">
        {agents.map((agent: AgentData) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

// Agent Card Component
const AgentCard = ({ agent }: { agent: AgentData }) => {
  const t = useTranslations("agent.profile");
  
  return (
    <Card className="agent-agent-card">
      <CardContent className="p-6">
        <div className="agent-agent-header">
          <Avatar
            sizeClass="h-14 w-14 text-lg"
            imgUrl={agent.logoUrl ?? ""}
            hasChecked={agent.isActive}
            hasCheckedClass="w-5 h-5 -top-1 right-1"
          />
          <div className="agent-agent-info">
            <h4 className="agent-agent-name">
              {agent.name}
            </h4>
            <p className="agent-agent-email">{agent.email}</p>
            <div className="agent-agent-badges">
              <Badge variant="outline" className="text-xs">
                AGENT
              </Badge>
              {agent.isActive && (
                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                  {t('active')}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="agent-agent-stats">
          <div className="agent-agent-stat">
            <span className="agent-agent-stat-value">{agent._count?.Property ?? 0}</span>
            <span className="agent-agent-stat-label">{t('properties')}</span>
          </div>
          <div className="agent-agent-stat">
            <span className="agent-agent-stat-value">{agent._count?.Reservation ?? 0}</span>
            <span className="agent-agent-stat-label">{t('sales')}</span>
          </div>
          <div className="agent-agent-stat">
            <span className="agent-agent-stat-value">{agent._count?.Review ?? 0}</span>
            <span className="agent-agent-stat-label">{t('rating')}</span>
          </div>
        </div>
        
        <div className="agent-agent-portfolio">
          <h5 className="agent-agent-portfolio-title">{t('agentPortfolio')}</h5>
          <div className="agent-agent-portfolio-grid">
            {agent.Property?.slice(0, 3).map((property: PropertyData) => (
              <div key={property.id} className="agent-agent-portfolio-item">
                <Image
                  src={property.images?.[0] ?? "/placeholder-property.jpg"}
                  alt={property.title}
                  width={80}
                  height={60}
                  className="agent-agent-portfolio-image"
                />
                <div className="agent-agent-portfolio-info">
                  <span className="agent-agent-portfolio-title">{property.title}</span>
                  <span className="agent-agent-portfolio-price">{property.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Agent Reviews Section
const AgentReviewsSection = ({ reviews }: { reviews: Review[] }) => {
  const t = useTranslations("agent.profile");

  if (reviews.length === 0) {
    return (
      <div className="agent-empty-state">
        <Star className="agent-empty-state-icon" />
        <p className="agent-empty-state-text">{t('noReviews')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="agent-reviews-header">
        <h3 className="agent-reviews-title">{t('reviews')}</h3>
        <p className="agent-reviews-description">{t('reviewsDescription')}</p>
      </div>
      
      <div className="agent-reviews-list">
        {reviews.map((review: Review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }: { review: Review }) => {
  const _t = useTranslations("agent.profile");
  
  return (
    <Card className="agent-review-card">
      <CardContent className="p-4">
        <div className="agent-review-header">
          <div className="agent-review-user">
            <Avatar
              sizeClass="h-10 w-10 text-base"
              imgUrl={review.user?.profilePicture ?? review.user?.image ?? undefined}
            />
            <div className="agent-review-user-info">
              <span className="agent-review-user-name">
                {(review.user?.name ?? review.user?.displayName) ?? "Anonymous"
}
              </span>
              <div className="agent-review-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < asNumber(review.rating, 0) ? "text-yellow-500 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <span className="agent-review-date">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="agent-review-comment">{review.comment ?? review.content ?? ''}</p>
      </CardContent>
    </Card>
  );
};
