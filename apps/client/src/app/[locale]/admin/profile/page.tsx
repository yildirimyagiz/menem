"use client";

import {
  Building,
  Calendar,
  Camera,
  Edit,
  MapPin,
  Save,
  Shield,
  User,
  X
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@reservatior/ui/popover";
import { ScrollArea } from "@reservatior/ui/scroll-area";
import { Separator } from "@reservatior/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";

import { useAuth } from "~/hooks/use-auth";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  locale: string;
  timezone: string;
  currencyId: string;
  notificationEmail: boolean;
  notificationInApp: boolean;
  notificationSMS: boolean;
  preferences: Record<string, any>;
}

export default function AdminProfilePage() {
  const t = useTranslations("Profile");
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phoneNumber: (user as any)?.phoneNumber ?? "",
    displayName: (user as any)?.displayName ?? "",
    firstName: (user as any)?.firstName || "",
    lastName: (user as any)?.lastName ?? "",
    profilePicture: ((user as any)?.profilePicture ?? (user as any)?.image) ?? "",
    locale: (user as any)?.locale ?? "en",
    timezone: (user as any)?.timezone ?? "UTC",
    currencyId: (user as any)?.currencyId ?? "usd",
    notificationEmail: (user as any)?.notificationEmail ?? true,
    notificationInApp: (user as any)?.notificationInApp ?? true,
    notificationSMS: (user as any)?.notificationSMS ?? false,
    preferences: (user as any)?.preferences ?? {},
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [showPhotoPopover, setShowPhotoPopover] = useState(false);

  // Update user mutation
  const updateUser = (api.user as any)?.update?.useMutation?.({
    onSuccess: async () => {
      // Refresh the page to get updated user data
      window.location.reload();
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message ?? "Failed to update profile",
      });
    },
  }) ?? { mutateAsync: async () => {}, isPending: false };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      await updateUser.mutateAsync({
        id: user.id,
        ...formData,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phoneNumber: (user as any)?.phoneNumber ?? "",
      displayName: (user as any)?.displayName ?? "",
      firstName: (user as any)?.firstName ?? "",
      lastName: (user as any)?.lastName ?? "",
      profilePicture:
        (user as any)?.profilePicture ?? (user as any)?.image ?? "",
      locale: (user as any)?.locale ?? "en",
      timezone: (user as any)?.timezone ?? "UTC",
      currencyId: (user as any)?.currencyId ?? "usd",
      notificationEmail: (user as any)?.notificationEmail ?? true,
      notificationInApp: (user as any)?.notificationInApp ?? true,
      notificationSMS: (user as any)?.notificationSMS ?? false,
      preferences: (user as any)?.preferences ?? {},
    });
    setIsEditing(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return "destructive";
      case "AGENCY":
      case "AGENCY_ADMIN":
        return "default";
      case "AGENT":
      case "AGENT_ADMIN":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setGallery((prev) => [...prev, ...urls]);
    if (urls[0]) setFormData({ ...formData, profilePicture: urls[0] });
  };
  const handleRemovePhoto = (url: string) => {
    setGallery((prev) => prev.filter((u) => u !== url));
    if (formData.profilePicture === url)
      setFormData({ ...formData, profilePicture: "" });
  };

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">User not found</h3>
          <p className="text-muted-foreground">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("title", { defaultValue: "Profile Settings" })}
          </h1>
          <p className="text-muted-foreground">
            {t("description", { defaultValue: "Manage your account settings and profile information" })}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                {t("cancel", { defaultValue: "Cancel" })}
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? t("loading", { defaultValue: "Saving..." }) : t("saveChanges", { defaultValue: "Save Changes" })}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              {t("editProfile", { defaultValue: "Edit Profile" })}
            </Button>
          )}
        </div>
      </div>
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6 flex w-full justify-center gap-4">
          <TabsTrigger value="personal">{t("personalInfo", { defaultValue: "Personal Info" })}</TabsTrigger>
          <TabsTrigger value="photos">{t("photos", { defaultValue: "Photos" })}</TabsTrigger>
          <TabsTrigger value="account">{t("account", { defaultValue: "Account" })}</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-primary/10 shadow-xl">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                      <AvatarImage src={formData.profilePicture} />
                      <AvatarFallback className="text-lg">
                        {getUserInitials(formData.name || user.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">
                    {formData.displayName || formData.name || user.name}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <div className="flex justify-center">
                    <Badge variant={getRoleBadgeVariant(user.role || "")}>
                      {(user.role || "").replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {t("memberSince", { defaultValue: "Member since" })}{" "}
                      {new Date(
                        (user as any)?.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  {(user as any)?.lastLogin && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {t("lastLogin", { defaultValue: "Last login" })}:{" "}
                        {new Date((user as any).lastLogin).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {(user as any)?.Agency && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{(user as any).Agency.name}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-primary/10 shadow-xl">
                <CardHeader>
                  <CardTitle>{t("personalInfo", { defaultValue: "Personal Information" })}</CardTitle>
                  <CardDescription>
                    {t("personalInfoDescription", { defaultValue: "Update your personal details and contact information" })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("firstName", { defaultValue: "First Name" })}</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        placeholder={t("firstNamePlaceholder", { defaultValue: "Enter your first name" })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("lastName", { defaultValue: "Last Name" })}</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder={t("lastNamePlaceholder", { defaultValue: "Enter your last name" })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">{t("displayName", { defaultValue: "Display Name" })}</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayName: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      placeholder={t("displayNamePlaceholder", { defaultValue: "Enter your display name" })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email", { defaultValue: "Email Address" })}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder={t("emailPlaceholder", { defaultValue: "Enter your email address" })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">{t("phoneNumber", { defaultValue: "Phone Number" })}</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      placeholder={t("phoneNumberPlaceholder", { defaultValue: "Enter your phone number" })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profilePicture">{t("profilePicture", { defaultValue: "Profile Picture URL" })}</Label>
                    <Input
                      id="profilePicture"
                      value={formData.profilePicture}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profilePicture: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      placeholder={t("profilePicturePlaceholder", { defaultValue: "Enter profile picture URL" })}
                    />
                  </div>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="locale">{t("language", { defaultValue: "Language" })}</Label>
                      <select
                        id="locale"
                        value={formData.locale}
                        onChange={(e) =>
                          setFormData({ ...formData, locale: e.target.value })
                        }
                        disabled={!isEditing}
                        aria-label="Select language"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                        <option value="de">Deutsch</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">{t("timezone", { defaultValue: "Timezone" })}</Label>
                      <select
                        id="timezone"
                        value={formData.timezone}
                        onChange={(e) =>
                          setFormData({ ...formData, timezone: e.target.value })
                        }
                        disabled={!isEditing}
                        aria-label="Select timezone"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">
                          Pacific Time
                        </option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Preferred Currency</Label>
                      <select
                        id="currency"
                        value={formData.currencyId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currencyId: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        aria-label="Select currency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="usd">USD - US Dollar</option>
                        <option value="eur">EUR - Euro</option>
                        <option value="gbp">GBP - British Pound</option>
                        <option value="jpy">JPY - Japanese Yen</option>
                        <option value="try">TRY - Turkish Lira</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Notification Preferences</Label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.notificationEmail}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                notificationEmail: e.target.checked,
                              })
                            }
                            disabled={!isEditing}
                          />
                          Email Notifications
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.notificationInApp}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                notificationInApp: e.target.checked,
                              })
                            }
                            disabled={!isEditing}
                          />
                          In-App Notifications
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.notificationSMS}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                notificationSMS: e.target.checked,
                              })
                            }
                            disabled={!isEditing}
                          />
                          SMS Notifications
                        </label>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="preferences">Other Preferences</Label>
                    <Input
                      id="preferences"
                      value={JSON.stringify(formData.preferences)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferences: JSON.parse(e.target.value || "{}"),
                        })
                      }
                      disabled={!isEditing}
                      placeholder="{{}} (JSON)"
                      title="Other preferences as JSON"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="photos">
          <div className="flex flex-col items-center gap-8">
            <Card className="w-full max-w-lg border-2 border-primary/10 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle>Profile Photos</CardTitle>
                <CardDescription>
                  Manage your profile and gallery photos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarImage src={formData.profilePicture} />
                    <AvatarFallback className="text-lg">
                      {getUserInitials(formData.name || user.name || "User")}
                    </AvatarFallback>
                  </Avatar>
                  <Popover
                    open={showPhotoPopover}
                    onOpenChange={setShowPhotoPopover}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full border border-primary/30 shadow-lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-4">
                      <div className="mb-2 font-semibold">
                        Upload Profile Photo
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="mb-2"
                        onChange={handlePhotoUpload}
                        multiple
                        title="Upload profile photo(s)"
                        placeholder="Upload profile photo(s)"
                      />
                      <ScrollArea className="h-24 w-full">
                        <div className="flex gap-2">
                          {gallery.map((url) => (
                            <div key={url} className="group relative">
                              <img
                                src={url}
                                alt="Gallery"
                                className="h-16 w-16 rounded border border-primary/20 object-cover"
                              />
                              <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -right-2 -top-2 h-6 w-6 opacity-80 group-hover:opacity-100"
                                onClick={() => handleRemovePhoto(url)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="account">
          <div className="flex flex-col items-center gap-8">
            <Card className="mt-6 w-full max-w-lg border-2 border-primary/10 shadow">
              <CardHeader>
                <CardTitle>Account & Security</CardTitle>
                <CardDescription>
                  Review your account status and security details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <div className="font-medium">Email Verification</div>
                      <div className="text-sm text-muted-foreground">
                        {(user as any)?.emailVerified
                          ? "Email is verified"
                          : "Email is not verified"}
                      </div>
                    </div>
                    <Badge
                      variant={
                        (user as any)?.emailVerified ? "default" : "secondary"
                      }
                    >
                      {(user as any)?.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <div className="font-medium">Account Status</div>
                      <div className="text-sm text-muted-foreground">
                        {(user as any)?.isActive
                          ? "Account is active"
                          : "Account is inactive"}
                      </div>
                    </div>
                    <Badge
                      variant={
                        (user as any)?.isActive ? "default" : "destructive"
                      }
                    >
                      {(user as any)?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-purple-500" />
                    <div className="flex-1">
                      <div className="font-medium">Account Type</div>
                      <div className="text-sm text-muted-foreground">
                        {(user as any)?.type ?? "EMAIL"}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {(user as any)?.type ?? "EMAIL"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
