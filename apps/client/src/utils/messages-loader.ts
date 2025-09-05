// Messages loader utility
// This file is auto-generated from export summary

export const EXPORT_SUMMARY = {"total_files": 76, "exported_files": ["chat.json", "mortgage.json", "property-filter.json", "ui-components.json", "tenants.json", "nav.json", "auth-error.json", "subscription.json", "logout.json", "client-section.json", "reviews.json", "sidebar.json", "agencies.json", "report.json", "settings.json", "services.json", "events.json", "app.json", "dashboard-page.json", "search.json", "analytics.json", "footer.json", "trpc.json", "types.json", "taxRecords.json", "commissionRule.json", "welcome.json", "common.json", "messages.json", "places.json", "client-home.json", "checkout.json", "ml.json", "properties.json", "agents.json", "commission-rule.json", "facility.json", "shared.json", "become-agency.json", "account.json", "become-agent.json", "dashboard.json", "author.json", "mobile-menu.json", "payments.json", "listing.json", "notifications.json", "my-listings.json", "context.json", "notification.json", "hooks.json", "guest.json", "posts.json", "contact.json", "reservation.json", "language-dropdown.json", "admin.json", "about.json", "favorites.json", "home-components.json", "helpers.json", "agency.json", "tasks.json", "property.json", "quick-actions.json", "help.json", "compliance.json", "index.json", "home.json", "navbar.json", "client.json", "quick-access.json", "pages.json", "enums.json", "profile.json", "contract.json"], "export_timestamp": "/Users/yildirimy/Downloads/ReservatiorM", "source_directory": "/Users/yildirimy/Downloads/ReservatiorM/apps/client/locales/en"} as const;
export const SUPPORTED_LOCALES = ["en", "tr", "es", "fr", "de", "it", "ru", "ja", "zh", "ar", "hi", "th", "fa"] as const;
export const JSON_FILES = ["chat.json", "mortgage.json", "property-filter.json", "ui-components.json", "tenants.json", "nav.json", "auth-error.json", "subscription.json", "logout.json", "client-section.json", "reviews.json", "sidebar.json", "agencies.json", "report.json", "settings.json", "services.json", "events.json", "app.json", "dashboard-page.json", "search.json", "analytics.json", "footer.json", "trpc.json", "types.json", "taxRecords.json", "commissionRule.json", "welcome.json", "common.json", "messages.json", "places.json", "client-home.json", "checkout.json", "ml.json", "properties.json", "agents.json", "commission-rule.json", "facility.json", "shared.json", "become-agency.json", "account.json", "become-agent.json", "dashboard.json", "author.json", "mobile-menu.json", "payments.json", "listing.json", "notifications.json", "my-listings.json", "context.json", "notification.json", "hooks.json", "guest.json", "posts.json", "contact.json", "reservation.json", "language-dropdown.json", "admin.json", "about.json", "favorites.json", "home-components.json", "helpers.json", "agency.json", "tasks.json", "property.json", "quick-actions.json", "help.json", "compliance.json", "index.json", "home.json", "navbar.json", "client.json", "quick-access.json", "pages.json", "enums.json", "profile.json", "contract.json"] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];
export type MessagesRecord = Record<string, unknown>;

export interface MessagesLoader {
  loadMessagesForLocale(locale: SupportedLocale): Promise<MessagesRecord>;
  getMessagesForLocaleSync(locale: SupportedLocale): MessagesRecord;
  preloadAllMessages(): Promise<void>;
}

export class DynamicMessagesLoader implements MessagesLoader {
  private messagesCache: Record<SupportedLocale, MessagesRecord> = {} as Record<SupportedLocale, MessagesRecord>;

  async loadMessagesForLocale(locale: SupportedLocale): Promise<MessagesRecord> {
    if (this.messagesCache[locale]) {
      return this.messagesCache[locale];
    }
    
    const messages: MessagesRecord = {};
    
    try {
      for (const file of JSON_FILES) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const importedModule = await import(`../locales/${locale}/${file}`);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          Object.assign(messages, importedModule.default);
        } catch (error) {
          console.warn(`Failed to load ${file} for locale ${locale}:`, error);
        }
      }
    } catch (error) {
      console.error(`Failed to load messages for locale ${locale}:`, error);
    }
    
    this.messagesCache[locale] = messages;
    return messages;
  }

  getMessagesForLocaleSync(locale: SupportedLocale): MessagesRecord {
    if (!SUPPORTED_LOCALES.includes(locale)) {
      locale = 'en' as SupportedLocale;
    }
    
    // For SSR, return essential messages only
    return {};
  }

  async preloadAllMessages(): Promise<void> {
    const promises = SUPPORTED_LOCALES.map(locale => this.loadMessagesForLocale(locale));
    await Promise.all(promises);
  }
}

export const messagesLoader = new DynamicMessagesLoader();
