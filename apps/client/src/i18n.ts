import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { routing } from './i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  type Locale = (typeof routing.locales)[number];
  const requestedStr = (requested ?? '');
  const isSupported = (routing.locales as readonly string[]).includes(requestedStr);
  const locale: Locale = (isSupported ? requestedStr : routing.defaultLocale) as Locale;

  try {
    // Base messages (site-wide)
    const indexModule: unknown = await import(`../locales/${locale}/index.json`);
    const baseMessages: Record<string, unknown> =
      typeof indexModule === 'object' && indexModule !== null && 'default' in (indexModule as Record<string, unknown>) &&
      typeof (indexModule as { default: unknown }).default === 'object' &&
      (indexModule as { default: unknown }).default !== null
        ? ((indexModule as { default: unknown }).default as Record<string, unknown>)
        : {};

    // Attempt to merge Admin Tickets messages (flat keys, no prefixes)
    let ticketsMessages: Record<string, unknown> = {};
    try {
      const ticketsModule: unknown = await import(`../locales/${locale}/admin/tickets.json`);
      ticketsMessages =
        typeof ticketsModule === 'object' && ticketsModule !== null && 'default' in (ticketsModule as Record<string, unknown>) &&
        typeof (ticketsModule as { default: unknown }).default === 'object' &&
        (ticketsModule as { default: unknown }).default !== null
          ? ((ticketsModule as { default: unknown }).default as Record<string, unknown>)
          : {};
    } catch {
      // Optional: tickets bundle may not exist for all locales; ignore
      ticketsMessages = {};
    }

    // Optionally, place to merge more bundles as needed in future
    const messages: Record<string, unknown> = {
      ...baseMessages,
      ...ticketsMessages,
    };

    return {
      locale,
      messages,
    };
  } catch (_unusedError) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // If the locale file doesn't exist, redirect to 404
    notFound();
  }
});
