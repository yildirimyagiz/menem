import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "zh", "es", "ar", "hi", "fr", "tr", "fa", "de", "ja", "it", "ru"],

  // Used when no locale matches
  defaultLocale: "en",
});
