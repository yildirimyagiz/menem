// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a de locale. All the
// messages from the main program should be duplicated here with the same
// function name.

// Ignore issues from commonly used lints in this file.
// ignore_for_file:unnecessary_brace_in_string_interps, unnecessary_new
// ignore_for_file:prefer_single_quotes,comment_references, directives_ordering
// ignore_for_file:annotate_overrides,prefer_generic_function_type_aliases
// ignore_for_file:unused_import, file_names, avoid_escaping_inner_quotes
// ignore_for_file:unnecessary_string_interpolations, unnecessary_string_escapes

import 'package:intl/intl.dart';
import 'package:intl/message_lookup_by_library.dart';

final messages = new MessageLookup();

typedef String MessageIfAbsent(String messageStr, List<dynamic> args);

class MessageLookup extends MessageLookupByLibrary {
  String get localeName => 'de';

  static String m0(count) =>
      "${Intl.plural(count, zero: 'No accounts found', one: '1 account found', other: '${count} accounts found')}";

  static String m2(name) => "Willkommen zurück, ${name}";

  static String m3(name) => "Chat mit ${name}";

  static String m5(count) => "Neue Mieter: ${count}";

  static String m6(rate) => "Belegungsquote: ${rate}";

  static String m7(count) => "Ausstehende Zahlungen: ${count}";

  static String m9(count) => "${count} diese Woche";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountsFound": m0,
    "agent_activity_title": MessageLookupByLibrary.simpleMessage(
      "Recent Activity",
    ),
    "agent_address_label": MessageLookupByLibrary.simpleMessage("Adresse"),
    "agent_agency_label": MessageLookupByLibrary.simpleMessage("Agentur"),
    "agent_contact_information_title": MessageLookupByLibrary.simpleMessage(
      "Kontaktinformationen",
    ),
    "agent_created_at_label": MessageLookupByLibrary.simpleMessage(
      "Erstellt am",
    ),
    "agent_email_label": MessageLookupByLibrary.simpleMessage("E-Mail"),
    "agent_is_active_label": MessageLookupByLibrary.simpleMessage("Aktiv"),
    "agent_last_active_label": MessageLookupByLibrary.simpleMessage(
      "Letzte Aktivität",
    ),
    "agent_phone_label": MessageLookupByLibrary.simpleMessage("Telefon"),
    "agent_professional_information_title":
        MessageLookupByLibrary.simpleMessage("Berufliche Informationen"),
    "agent_specialities_label": MessageLookupByLibrary.simpleMessage(
      "Specialitäten",
    ),
    "agent_status_label": MessageLookupByLibrary.simpleMessage("Status"),
    "agent_website_label": MessageLookupByLibrary.simpleMessage("Website"),
    "amenitiesSectionTitle": MessageLookupByLibrary.simpleMessage(
      "Ausstattung",
    ),
    "analyticsAgency": MessageLookupByLibrary.simpleMessage("Agency"),
    "analyticsAgencyId": MessageLookupByLibrary.simpleMessage("Agency ID"),
    "analyticsAgent": MessageLookupByLibrary.simpleMessage("Agent"),
    "analyticsAgentId": MessageLookupByLibrary.simpleMessage("Agent ID"),
    "analyticsCreatedAt": MessageLookupByLibrary.simpleMessage("Created At"),
    "analyticsData": MessageLookupByLibrary.simpleMessage("Data"),
    "analyticsDeletedAt": MessageLookupByLibrary.simpleMessage("Deleted At"),
    "analyticsDetailTitle": MessageLookupByLibrary.simpleMessage(
      "Analytics Details",
    ),
    "analyticsEntityId": MessageLookupByLibrary.simpleMessage("Entity ID"),
    "analyticsEntityType": MessageLookupByLibrary.simpleMessage("Entity Type"),
    "analyticsPropertyId": MessageLookupByLibrary.simpleMessage("Property ID"),
    "analyticsReservationId": MessageLookupByLibrary.simpleMessage(
      "Reservation ID",
    ),
    "analyticsTaskId": MessageLookupByLibrary.simpleMessage("Task ID"),
    "analyticsTimestamp": MessageLookupByLibrary.simpleMessage("Timestamp"),
    "analyticsType": MessageLookupByLibrary.simpleMessage("Type"),
    "analyticsTypeAgencyPerformance": MessageLookupByLibrary.simpleMessage(
      "Agency Performance",
    ),
    "analyticsTypeAgentPerformance": MessageLookupByLibrary.simpleMessage(
      "Agent Performance",
    ),
    "analyticsTypeBookingConversion": MessageLookupByLibrary.simpleMessage(
      "Booking Conversion",
    ),
    "analyticsTypeListingView": MessageLookupByLibrary.simpleMessage(
      "Listing View",
    ),
    "analyticsTypePerformance": MessageLookupByLibrary.simpleMessage(
      "Performance",
    ),
    "analyticsTypeRevenue": MessageLookupByLibrary.simpleMessage("Revenue"),
    "analyticsTypeUserEngagement": MessageLookupByLibrary.simpleMessage(
      "User Engagement",
    ),
    "analyticsTypeView": MessageLookupByLibrary.simpleMessage("View"),
    "analyticsUpdatedAt": MessageLookupByLibrary.simpleMessage("Updated At"),
    "analyticsUserId": MessageLookupByLibrary.simpleMessage("User ID"),
    "appTitle": MessageLookupByLibrary.simpleMessage("Menem"),
    "authSignIn": MessageLookupByLibrary.simpleMessage("Mit Google anmelden"),
    "authSignOut": MessageLookupByLibrary.simpleMessage("Abmelden"),
    "authWelcomeBack": m2,
    "chatBack": MessageLookupByLibrary.simpleMessage("Zurück"),
    "chatBackToList": MessageLookupByLibrary.simpleMessage("Zurück zur Liste"),
    "chatChattingWith": m3,
    "chatConnectWithUsers": MessageLookupByLibrary.simpleMessage(
      "Verbinden Sie sich mit Nutzern und erhalten Sie Unterstützung",
    ),
    "chatConnectionError": MessageLookupByLibrary.simpleMessage(
      "Verbindung zum Chat-Server fehlgeschlagen. Bitte versuchen Sie es erneut.",
    ),
    "chatContactSupport": MessageLookupByLibrary.simpleMessage(
      "Support kontaktieren",
    ),
    "chatError": MessageLookupByLibrary.simpleMessage("Fehler"),
    "chatErrorMarkAsRead": MessageLookupByLibrary.simpleMessage(
      "Nachrichten konnten nicht als gelesen markiert werden",
    ),
    "chatErrorSendMessage": MessageLookupByLibrary.simpleMessage(
      "Nachricht konnte nicht gesendet werden",
    ),
    "chatErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "Sie müssen angemeldet sein, um diese Aktion auszuführen",
    ),
    "chatMessageSendError": MessageLookupByLibrary.simpleMessage(
      "Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
    ),
    "chatMessages": MessageLookupByLibrary.simpleMessage("Nachrichten"),
    "chatNewMessage": MessageLookupByLibrary.simpleMessage("Neue Nachricht"),
    "chatSearchUsers": MessageLookupByLibrary.simpleMessage("Nutzer suchen..."),
    "chatSend": MessageLookupByLibrary.simpleMessage("Senden"),
    "chatTypeMessage": MessageLookupByLibrary.simpleMessage(
      "Nachricht eingeben...",
    ),
    "chatWelcomeDescription": MessageLookupByLibrary.simpleMessage(
      "Beginnen Sie eine Unterhaltung mit anderen Nutzern oder kontaktieren Sie den Support für Hilfe",
    ),
    "chatWelcomeToChat": MessageLookupByLibrary.simpleMessage(
      "Willkommen im Chat",
    ),
    "common_no": MessageLookupByLibrary.simpleMessage("Nein"),
    "common_not_available": MessageLookupByLibrary.simpleMessage(
      "Nicht verfügbar",
    ),
    "common_save": MessageLookupByLibrary.simpleMessage("Speichern"),
    "common_yes": MessageLookupByLibrary.simpleMessage("Ja"),
    "contractAgencyIdLabel": MessageLookupByLibrary.simpleMessage("Agentur-ID"),
    "contractCancelledAtLabel": MessageLookupByLibrary.simpleMessage(
      "Storniert am",
    ),
    "contractCancelledByLabel": MessageLookupByLibrary.simpleMessage(
      "Storniert von",
    ),
    "contractConditionsLabel": MessageLookupByLibrary.simpleMessage(
      "Konditionen:",
    ),
    "contractCreatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Erstellt am",
    ),
    "contractCurrencyLabel": MessageLookupByLibrary.simpleMessage("Währung"),
    "contractDeletedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Gelöscht am",
    ),
    "contractDescriptionLabel": MessageLookupByLibrary.simpleMessage(
      "Beschreibung",
    ),
    "contractDetailTitle": MessageLookupByLibrary.simpleMessage(
      "Vertragsdetails",
    ),
    "contractEndDateLabel": MessageLookupByLibrary.simpleMessage("Enddatum"),
    "contractIdLabel": MessageLookupByLibrary.simpleMessage("ID"),
    "contractLandlordIdLabel": MessageLookupByLibrary.simpleMessage(
      "Vermieter-ID",
    ),
    "contractNameLabel": MessageLookupByLibrary.simpleMessage("Name"),
    "contractNoticePeriodLabel": MessageLookupByLibrary.simpleMessage(
      "Kündigungsfrist",
    ),
    "contractOwnerIdLabel": MessageLookupByLibrary.simpleMessage(
      "Eigentümer-ID",
    ),
    "contractPropertyIdLabel": MessageLookupByLibrary.simpleMessage(
      "Objekt-ID",
    ),
    "contractRentAmountLabel": MessageLookupByLibrary.simpleMessage(
      "Mietbetrag",
    ),
    "contractSignedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Unterschrieben am",
    ),
    "contractSignedByLabel": MessageLookupByLibrary.simpleMessage(
      "Unterschrieben von",
    ),
    "contractStartDateLabel": MessageLookupByLibrary.simpleMessage(
      "Startdatum",
    ),
    "contractStatusArchived": MessageLookupByLibrary.simpleMessage(
      "Archiviert",
    ),
    "contractStatusDraft": MessageLookupByLibrary.simpleMessage("Entwurf"),
    "contractStatusExpired": MessageLookupByLibrary.simpleMessage("Abgelaufen"),
    "contractStatusLabel": MessageLookupByLibrary.simpleMessage("Status"),
    "contractStatusPending": MessageLookupByLibrary.simpleMessage("Ausstehend"),
    "contractStatusRenewed": MessageLookupByLibrary.simpleMessage("Erneuert"),
    "contractStatusTerminated": MessageLookupByLibrary.simpleMessage("Beendet"),
    "contractTenantIdLabel": MessageLookupByLibrary.simpleMessage("Mieter-ID"),
    "contractTerminatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Beendet am",
    ),
    "contractTerminatedByLabel": MessageLookupByLibrary.simpleMessage(
      "Beendet von",
    ),
    "contractTermsLabel": MessageLookupByLibrary.simpleMessage("Bedingungen:"),
    "contractTypeCommission": MessageLookupByLibrary.simpleMessage("Provision"),
    "contractTypeLabel": MessageLookupByLibrary.simpleMessage("Typ"),
    "contractTypeManagement": MessageLookupByLibrary.simpleMessage(
      "Verwaltung",
    ),
    "contractTypeRental": MessageLookupByLibrary.simpleMessage("Miete"),
    "contractTypeSale": MessageLookupByLibrary.simpleMessage("Verkauf"),
    "contractTypeService": MessageLookupByLibrary.simpleMessage(
      "Dienstleistung",
    ),
    "contractUpdatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Aktualisiert am",
    ),
    "dashboard": MessageLookupByLibrary.simpleMessage("Übersicht"),
    "defaultUser": MessageLookupByLibrary.simpleMessage("Standardbenutzer"),
    "edit_agent_tooltip": MessageLookupByLibrary.simpleMessage(
      "Agent bearbeiten",
    ),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage(
      "Route berechnen",
    ),
    "homeLabel": MessageLookupByLibrary.simpleMessage("Startseite"),
    "indexDescription": MessageLookupByLibrary.simpleMessage(
      "Ihre Lösung für Immobilienverwaltung",
    ),
    "indexPropertyManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Verwalten Sie Ihre Immobilien effizient mit unserer umfassenden Tool-Suite.",
    ),
    "indexPropertyManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Immobilienverwaltung",
    ),
    "indexTitle": MessageLookupByLibrary.simpleMessage("Willkommen bei Menem"),
    "indexWaterManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Verfolgen und optimieren Sie den Wasserverbrauch in Ihren Immobilien.",
    ),
    "indexWaterManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Wassermanagement",
    ),
    "listings": MessageLookupByLibrary.simpleMessage("Meine Immobilien"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage("Standort"),
    "loggingout": MessageLookupByLibrary.simpleMessage("Abmeldung..."),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("Abmelden"),
    "manageProperties": MessageLookupByLibrary.simpleMessage(
      "Verwalten Sie Ihre Immobilien effektiv",
    ),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage(
      "Zugestellt",
    ),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("Gelesen"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("Gesendet"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("Nachrichten"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage(
      "Monatlicher Cashflow",
    ),
    "nav_analytics": MessageLookupByLibrary.simpleMessage("Analysen"),
    "nav_expenses": MessageLookupByLibrary.simpleMessage("Ausgaben"),
    "nav_facilities": MessageLookupByLibrary.simpleMessage("Einrichtungen"),
    "nav_help": MessageLookupByLibrary.simpleMessage("Hilfe"),
    "nav_helpdesk": MessageLookupByLibrary.simpleMessage("Kundendienst"),
    "nav_home": MessageLookupByLibrary.simpleMessage("Startseite"),
    "nav_logout": MessageLookupByLibrary.simpleMessage("Abmelden"),
    "nav_messages": MessageLookupByLibrary.simpleMessage("Nachrichten"),
    "nav_notifications": MessageLookupByLibrary.simpleMessage(
      "Benachrichtigungen",
    ),
    "nav_payments": MessageLookupByLibrary.simpleMessage("Zahlungen"),
    "nav_profile": MessageLookupByLibrary.simpleMessage("Profil"),
    "nav_properties": MessageLookupByLibrary.simpleMessage("Immobilien"),
    "nav_settings": MessageLookupByLibrary.simpleMessage("Einstellungen"),
    "nav_subscription": MessageLookupByLibrary.simpleMessage("Abonnement"),
    "nav_tasks": MessageLookupByLibrary.simpleMessage("Aufgaben"),
    "nav_tenants": MessageLookupByLibrary.simpleMessage("Mieter"),
    "nav_viewAll": MessageLookupByLibrary.simpleMessage("Alle anzeigen"),
    "newTenants": m5,
    "noAmenitiesListed": MessageLookupByLibrary.simpleMessage(
      "Keine Ausstattung aufgeführt",
    ),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage(
      "Benachrichtigungen",
    ),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage(
      "Noch keine Benachrichtigungen",
    ),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("Zahlungen"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("Zahlungen"),
    "pendingPayments": m7,
    "pendingTasks": MessageLookupByLibrary.simpleMessage(
      "Unerledigte Aufgaben",
    ),
    "postsCancel": MessageLookupByLibrary.simpleMessage("Abbrechen"),
    "postsContent": MessageLookupByLibrary.simpleMessage("Inhalt"),
    "postsCreate": MessageLookupByLibrary.simpleMessage("Beitrag erstellen"),
    "postsDelete": MessageLookupByLibrary.simpleMessage("Löschen"),
    "postsEdit": MessageLookupByLibrary.simpleMessage("Bearbeiten"),
    "postsErrorCreatePost": MessageLookupByLibrary.simpleMessage(
      "Beitrag konnte nicht erstellt werden",
    ),
    "postsErrorDeletePost": MessageLookupByLibrary.simpleMessage(
      "Beitrag konnte nicht gelöscht werden",
    ),
    "postsErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "Sie müssen angemeldet sein, um diese Aktion auszuführen",
    ),
    "postsErrorUpdatePost": MessageLookupByLibrary.simpleMessage(
      "Beitrag konnte nicht aktualisiert werden",
    ),
    "postsLoading": MessageLookupByLibrary.simpleMessage(
      "Beiträge werden geladen",
    ),
    "postsNoPostsYet": MessageLookupByLibrary.simpleMessage(
      "Noch keine Beiträge",
    ),
    "postsSave": MessageLookupByLibrary.simpleMessage("Speichern"),
    "postsTitle": MessageLookupByLibrary.simpleMessage("Titel"),
    "profileLabel": MessageLookupByLibrary.simpleMessage("Profil"),
    "properties": MessageLookupByLibrary.simpleMessage("Immobilien"),
    "quickAccess": MessageLookupByLibrary.simpleMessage("Schnellzugriff"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("Einstellungen"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("RentalProc"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage(
      "Zusammenfassende Statistiken",
    ),
    "tasks": MessageLookupByLibrary.simpleMessage("Aufgaben"),
    "tasksThisWeek": m9,
    "tenants": MessageLookupByLibrary.simpleMessage("Mieter"),
    "totalProperties": MessageLookupByLibrary.simpleMessage(
      "Gesamtanzahl Immobilien",
    ),
    "totalTenants": MessageLookupByLibrary.simpleMessage("Gesamtanzahl Mieter"),
    "unknownTime": MessageLookupByLibrary.simpleMessage("Unbekannte Zeit"),
  };
}
