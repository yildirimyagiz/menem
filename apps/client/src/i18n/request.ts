import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Load messages from the new locales directory structure
  let messages = {};
  
  try {
    // Import all JSON files from the locale directory
    const adminMessages = (await import(`../../locales/${locale}/admin.json`)).default;
    const commonMessages = (await import(`../../locales/${locale}/common.json`)).default;
    const clientMessages = (await import(`../../locales/${locale}/client.json`)).default;
    const dashboardMessages = (await import(`../../locales/${locale}/dashboard.json`)).default;
    
    // Try to import places.json if it exists
    let placesMessages = {};
    try {
      placesMessages = (await import(`../../locales/${locale}/places.json`)).default;
    } catch (e) {
      // places.json doesn't exist for all locales, that's okay
    }
    
    // Merge all messages
    messages = { ...adminMessages, ...commonMessages, ...clientMessages, ...dashboardMessages, ...placesMessages };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to English if locale not found
    const enAdminMessages = (await import(`../../locales/en/admin.json`)).default;
    const enCommonMessages = (await import(`../../locales/en/common.json`)).default;
    const enClientMessages = (await import(`../../locales/en/client.json`)).default;
    const enDashboardMessages = (await import(`../../locales/en/dashboard.json`)).default;
    const enPlacesMessages = (await import(`../../locales/en/places.json`)).default;
    
    messages = { ...enAdminMessages, ...enCommonMessages, ...enClientMessages, ...enDashboardMessages, ...enPlacesMessages };
  }
  console.log("[i18n/request] Loaded locale:", locale);
  console.log("[i18n/request] Loaded messages keys:", Object.keys(messages));

  return {
    locale,
    messages,
  };
});
