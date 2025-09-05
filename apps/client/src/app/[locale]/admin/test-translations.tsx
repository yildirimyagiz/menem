"use client";

import { useTranslations } from "next-intl";

export default function TestTranslations() {
  const t = useTranslations();
  
  return (
    <div className="p-4">
      <h1>Translation Test</h1>
      <div className="space-y-2">
        <p><strong>Admin.title:</strong> {t("Admin.title")}</p>
        <p><strong>Admin.description:</strong> {t("Admin.description")}</p>
        <p><strong>Admin.systemOnline:</strong> {t("Admin.systemOnline")}</p>
        <p><strong>Admin.statistics.totalUsers:</strong> {t("Admin.statistics.totalUsers")}</p>
        <p><strong>Admin.statistics.activeProperties:</strong> {t("Admin.statistics.activeProperties")}</p>
        <p><strong>Admin.statistics.revenue:</strong> {t("Admin.statistics.revenue")}</p>
        <p><strong>Admin.statistics.systemHealth:</strong> {t("Admin.statistics.systemHealth")}</p>
        <p><strong>Admin.recentActivities.title:</strong> {t("Admin.recentActivities.title")}</p>
        <p><strong>Admin.quickActions.title:</strong> {t("Admin.quickActions.title")}</p>
        <p><strong>Admin.systemStatus.title:</strong> {t("Admin.systemStatus.title")}</p>
        <p><strong>Admin.managementSections.title:</strong> {t("Admin.managementSections.title")}</p>
        <p><strong>Admin.sectionGroups.userManagement.title:</strong> {t("Admin.sectionGroups.userManagement.title")}</p>
        <p><strong>Admin.sections.users:</strong> {t("Admin.sections.users")}</p>
        <p><strong>Admin.sections.properties:</strong> {t("Admin.sections.properties")}</p>
      </div>
    </div>
  );
} 