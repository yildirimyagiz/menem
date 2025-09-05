"use client";

import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Flag,
  Mail,
  MapPin,
  Phone,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import GuestDeleteModal from "../_components/GuestDeleteModal";
import GuestEditModal from "../_components/GuestEditModal";

const GuestDetailPage = () => {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const guestId = params?.id as string;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: guest,
    isLoading,
    isError,
    error,
    refetch,
  } = api.guest.byId.useQuery(
    { id: guestId },
    { refetchOnWindowFocus: false, retry: 2, staleTime: 5 * 60 * 1000 },
  );

  useEffect(() => {
    if (isError && error) {
      toast({
        title: t("errorLoadingGuestTitle"),
        description: error.message || t("errorLoadingGuestDescription"),
        variant: "destructive",
      });
    }
  }, [isError, error, toast, t]);

  if (isLoading) {
    return <div className="container mx-auto p-6">{t("loading")}</div>;
  }

  if (isError || !guest) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold">{t("guestNotFoundTitle")}</h2>
          <p className="text-gray-600">
            {t("guestNotFoundDescription")}
          </p>
          <Button onClick={() => router.push("/client/guest")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToGuests")}
          </Button>
        </div>
      </div>
    );
  }

  // Stats
  const totalReservations = guest.Reservation?.length ?? 0;
  const totalProperties = guest.Property?.length ?? 0;
  const activeReservations =
    guest.Reservation?.filter(
      (r) =>
        new Date(r.createdAt) <= new Date() &&
        new Date(r.updatedAt) >= new Date(),
    ).length ?? 0;
  const completedReservations = totalReservations - activeReservations;

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "FEMALE":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const calculateAge = (birthDate: Date | string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()))
      age--;
    return age;
  };

  const age = calculateAge(guest.birthDate);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/client/guest")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{guest.name}</h1>
            <p className="text-gray-600">{t("guestDetails")}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("edit")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("editGuestDetails")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("delete")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("deleteGuest")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Guest Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{t("guestOverview")}</span>
                </CardTitle>
                <Badge className={getGenderColor(guest.gender)}>
                  {guest.gender}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("fullName")}
                  </label>
                  <p className="text-sm font-semibold">{guest.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("age")}
                  </label>
                  <p className="text-sm">{age} {t("yearsOld")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("birthDate")}
                  </label>
                  <p className="text-sm">{formatDate(guest.birthDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("nationality")}
                  </label>
                  <p className="text-sm">{guest.nationality}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("passportNumber")}
                  </label>
                  <p className="font-mono text-sm">{guest.passportNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("email")}
                  </label>
                  <p className="text-sm">{guest.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("phone")}
                  </label>
                  <p className="text-sm">{guest.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("created")}
                  </label>
                  <p className="text-sm">{formatDate(guest.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">
                    {t("totalReservations")}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">{totalReservations}</p>
                <p className="text-xs text-gray-500">{t("allTime")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">
                    {t("activeReservations")}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">{activeReservations}</p>
                <p className="text-xs text-gray-500">{t("currentStays")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">
                    {t("propertiesVisited")}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">{totalProperties}</p>
                <p className="text-xs text-gray-500">{t("uniqueLocations")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">
                    {t("completionRate")}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">
                  {totalReservations > 0
                    ? Math.round(
                        (completedReservations / totalReservations) * 100,
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-gray-500">{t("completedStays")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for detailed information */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="reservations" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="reservations">{t("reservations")}</TabsTrigger>
                  <TabsTrigger value="properties">{t("properties")}</TabsTrigger>
                  <TabsTrigger value="contact">{t("contactInfo")}</TabsTrigger>
                  <TabsTrigger value="analytics">{t("analytics")}</TabsTrigger>
                </TabsList>
                <TabsContent value="reservations" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {t("reservationHistory")}
                    </h3>
                    {guest.Reservation && guest.Reservation.length > 0 ? (
                      <div className="space-y-3">
                        {guest.Reservation.map(
                          (reservation: any, index: number) => (
                            <Card key={index} className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {reservation.property?.title ||
                                      t("unknownProperty")}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {formatDate(reservation.createdAt)} -{" "}
                                    {formatDate(reservation.updatedAt)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {t("status")}: {reservation.status ?? t("unknown")}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  {reservation.totalAmount
                                    ? `$${reservation.totalAmount}`
                                    : t("notAvailable")}
                                </Badge>
                              </div>
                            </Card>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">{t("noReservationsFound")}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="properties" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {t("propertiesVisited")}
                    </h3>
                    {guest.Property && guest.Property.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {guest.Property.map((property: any, index: number) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">
                                {property.title ?? t("unknownProperty")}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {property.description ?? t("noDescription")}
                              </p>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {property.location ??
                                    t("locationNotSpecified")}
                                </span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <Building className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">{t("noPropertiesVisited")}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="contact" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">
                      {t("contactInformation")}
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-base">
                            <Mail className="h-4 w-4" />
                            <span>{t("emailAndPhone")}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{t("email")}</p>
                              <p className="text-sm text-gray-600">
                                {guest.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{t("phone")}</p>
                              <p className="text-sm text-gray-600">
                                {guest.phone}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-base">
                            <MapPin className="h-4 w-4" />
                            <span>{t("address")}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm">{guest.address}</p>
                          <p className="text-sm text-gray-600">
                            {guest.city}, {guest.country}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t("zip")}: {guest.zipCode}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-base">
                          <FileText className="h-4 w-4" />
                          <span>{t("travelDocuments")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Flag className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{t("nationality")}</p>
                            <p className="text-sm text-gray-600">
                              {guest.nationality}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">
                              {t("passportNumber")}
                            </p>
                            <p className="font-mono text-sm text-gray-600">
                              {guest.passportNumber}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="analytics" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">{t("guestAnalytics")}</h3>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {t("reservationTrends")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                              {totalReservations}
                            </p>
                            <p className="text-sm text-gray-600">
                              {t("totalReservations")}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                              {activeReservations}
                            </p>
                            <p className="text-sm text-gray-600">
                              {t("activeStays")}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                              {completedReservations}
                            </p>
                            <p className="text-sm text-gray-600">
                              {t("completedStays")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {t("guestMetrics")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {t("averageStayDuration")}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-semibold text-blue-600">
                                3.2 {t("days")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {t("preferredPropertyType")}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-semibold text-green-600">
                                {t("apartments")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {t("loyaltyScore")}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-semibold text-yellow-600">
                                4.5/5
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                {t("editGuest")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`mailto:${guest.email}`, "_blank")}
              >
                <Mail className="mr-2 h-4 w-4" />
                {t("sendEmail")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`tel:${guest.phone}`, "_blank")}
              >
                <Phone className="mr-2 h-4 w-4" />
                {t("callGuest")}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("guestInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">{t("id")}</label>
                <p className="font-mono text-sm">{guest.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t("gender")}
                </label>
                <Badge className={getGenderColor(guest.gender)}>
                  {guest.gender}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">{t("age")}</label>
                <p className="text-sm">{age} {t("yearsOld")}</p>
              </div>
              {guest.Agency && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("agency")}
                  </label>
                  <p className="text-sm">{guest.Agency.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("recentActivity")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t("guestProfileUpdated")}</p>
                  <p className="text-xs text-gray-500">{t("twoHoursAgo")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t("newReservationMade")}</p>
                  <p className="text-xs text-gray-500">{t("oneDayAgo")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t("guestRegistered")}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(guest.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Modals */}
      <GuestEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          void refetch();
        }}
        guestId={guestId}
      />
      <GuestDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => {
          setIsDeleteModalOpen(false);
          router.push("/client/guest");
        }}
        guestId={guestId}
      />
    </div>
  );
};

export default GuestDetailPage;
