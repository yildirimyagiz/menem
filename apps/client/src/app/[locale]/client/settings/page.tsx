"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Switch } from "@reservatior/ui/switch";

import { useAuth } from "~/hooks/use-auth";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export default function ClientSettingsPage() {
  const t = useTranslations("Settings");
  const { user } = useAuth();
  const updateUser = api.user.update.useMutation();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    locale: user?.locale ?? "en",
    timezone: user?.timezone ?? "UTC",
    notificationEmail: (user?.preferences as any)?.notificationEmail ?? true,
    notificationInApp: (user?.preferences as any)?.notificationInApp ?? true,
    notificationSMS: (user?.preferences as any)?.notificationSMS ?? false,
  });

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center ios-layout android-layout">
        <div className="mobile-card mobile-fade-in text-center rounded-xl border border-blue-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
          <h3 className="mb-2 mobile-text-lg font-semibold">{t("userNotFound", { defaultValue: "User not found" })}</h3>
          <p className="mobile-text-base text-muted-foreground">
            {t("loginToViewSettings", { defaultValue: "Please log in to view your settings." })}
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateUser.mutateAsync({
        id: user.id,
        name: form.name,
        email: form.email,
        locale: form.locale,
        timezone: form.timezone,
        preferences: {
          notificationEmail: form.notificationEmail,
          notificationInApp: form.notificationInApp,
          notificationSMS: form.notificationSMS,
        },
      });
      toast({
        title: t("settingsUpdated", { defaultValue: "Settings updated" }),
        description: t("settingsUpdatedDescription", { defaultValue: "Your settings have been saved." }),
      });
    } catch (e) {
      toast({
        title: t("updateFailed", { defaultValue: "Update failed" }),
        description: t("updateFailedDescription", { defaultValue: "Could not update settings." }),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950 ios-layout android-layout">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mobile-fade-in mb-8 text-center">
          <h1 className="mb-4 mobile-text-xl font-bold lg:text-3xl text-gray-900 dark:text-white">
            {t("title", { defaultValue: "Account Settings" })}
          </h1>
          <p className="mobile-text-base text-gray-600 dark:text-gray-300">
            {t("description", { defaultValue: "Manage your account preferences and notification settings" })}
          </p>
        </div>

        <Card className="mobile-card mobile-fade-in border border-blue-200 bg-white shadow-xl dark:border-blue-700 dark:bg-blue-900 ios-mobile-menu android-mobile-menu">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="text-white">{t("profileInformation", { defaultValue: "Profile Information" })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <Label htmlFor="name">{t("name", { defaultValue: "Name" })}</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mobile-input"
              />
            </div>
            <div>
              <Label htmlFor="email">{t("email", { defaultValue: "Email" })}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mobile-input"
              />
            </div>
            <div>
              <Label htmlFor="locale">{t("language", { defaultValue: "Language" })}</Label>
              <Input
                id="locale"
                name="locale"
                value={form.locale}
                onChange={handleChange}
                className="mobile-input"
              />
            </div>
            <div>
              <Label htmlFor="timezone">{t("timezone", { defaultValue: "Timezone" })}</Label>
              <Input
                id="timezone"
                name="timezone"
                value={form.timezone}
                onChange={handleChange}
                className="mobile-input"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mobile-card mobile-fade-in mt-6 border border-blue-200 bg-white shadow-xl dark:border-blue-700 dark:bg-blue-900 ios-mobile-menu android-mobile-menu">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle className="text-white">{t("notificationSettings", { defaultValue: "Notification Settings" })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notificationEmail">{t("emailNotifications", { defaultValue: "Email Notifications" })}</Label>
                <p className="mobile-text-sm text-gray-600 dark:text-gray-300">
                  {t("emailNotificationsDescription", { defaultValue: "Receive notifications via email" })}
                </p>
              </div>
              <Switch
                id="notificationEmail"
                checked={form.notificationEmail}
                onCheckedChange={(checked) => handleSwitchChange("notificationEmail", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notificationInApp">{t("inAppNotifications", { defaultValue: "In-App Notifications" })}</Label>
                <p className="mobile-text-sm text-gray-600 dark:text-gray-300">
                  {t("inAppNotificationsDescription", { defaultValue: "Receive notifications within the app" })}
                </p>
              </div>
              <Switch
                id="notificationInApp"
                checked={form.notificationInApp}
                onCheckedChange={(checked) => handleSwitchChange("notificationInApp", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notificationSMS">{t("smsNotifications", { defaultValue: "SMS Notifications" })}</Label>
                <p className="mobile-text-sm text-gray-600 dark:text-gray-300">
                  {t("smsNotificationsDescription", { defaultValue: "Receive notifications via SMS" })}
                </p>
              </div>
              <Switch
                id="notificationSMS"
                checked={form.notificationSMS}
                onCheckedChange={(checked) => handleSwitchChange("notificationSMS", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mobile-fade-in mt-8 text-center">
          <Button 
            onClick={handleSave} 
            disabled={updateUser.isPending}
            className="mobile-button"
          >
            {updateUser.isPending ? t("saving", { defaultValue: "Saving..." }) : t("saveSettings", { defaultValue: "Save Settings" })}
          </Button>
        </div>
      </div>
    </div>
  );
}
