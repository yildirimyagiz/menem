export const locales = ["en", "tr", "fa", "es", "fr", "de", "ru", "zh", "ar", "pt", "it"] as const;
export const defaultLocale = "en" as const;

export const localeConfig = [
  { id: "en", name: "English", description: "English", href: "/en", active: false },
  { id: "tr", name: "Türkçe", description: "Turkish", href: "/tr", active: false },
  { id: "fa", name: "فارسی", description: "Farsi", href: "/fa", active: false },
  { id: "es", name: "Español", description: "Spanish", href: "/es", active: false },
  { id: "fr", name: "Français", description: "French", href: "/fr", active: false },
  { id: "de", name: "Deutsch", description: "German", href: "/de", active: false },
  { id: "ru", name: "Русский", description: "Russian", href: "/ru", active: false },
  { id: "zh", name: "中文", description: "Chinese", href: "/zh", active: false },
  { id: "ar", name: "العربية", description: "Arabic", href: "/ar", active: false },
  { id: "pt", name: "Português", description: "Portuguese", href: "/pt", active: false },
  { id: "it", name: "Italiano", description: "Italian", href: "/it", active: false },
] as const;

export type Locale = typeof locales[number];

