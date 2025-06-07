import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Top languages including Turkish, Farsi, Italian, and Russian
const locales = [
  "en",    // English
  "zh",    // Chinese
  "es",    // Spanish
  "ar",    // Arabic
  "hi",    // Hindi
  "fr",    // French
  "tr",    // Turkish
  "fa",    // Farsi/Persian
  "de",    // German
  "ja",    // Japanese
  "it",    // Italian
  "ru"     // Russian
] as const;

type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  const validLocale = locales.find(l => l === locale);
  if (!validLocale) notFound();

  return {
    locale: validLocale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: "America/Los_Angeles",
  };
});
