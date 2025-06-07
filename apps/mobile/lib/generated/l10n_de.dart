// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for German (`de`).
class AppLocalizationsDe extends AppLocalizations {
  AppLocalizationsDe([String locale = 'de']) : super(locale);

  @override
  String get appTitle => 'Menem DE';

  @override
  String get dashboard => 'Dashboard DE';

  @override
  String get manageProperties => 'Verwalten Sie Ihre Immobilien effektiv DE';

  @override
  String get quickAccess => 'Schnellzugriff DE';

  @override
  String get properties => 'Immobilien DE';

  @override
  String get tenants => 'Mieter DE';

  @override
  String get payments => 'Zahlungen DE';

  @override
  String get tasks => 'Aufgaben DE';

  @override
  String get summaryStatistics => 'Zusammenfassende Statistiken DE';

  @override
  String get totalProperties => 'Gesamtzahl Immobilien DE';

  @override
  String occupancyRate(Object rate) {
    return 'Auslastung: $rate DE';
  }

  @override
  String get monthlyCashflow => 'Monatlicher Cashflow DE';

  @override
  String pendingPayments(Object count) {
    return 'Ausstehende Zahlungen: $count DE';
  }

  @override
  String get pendingTasks => 'Ausstehende Aufgaben DE';

  @override
  String tasksThisWeek(Object count) {
    return '$count diese Woche DE';
  }

  @override
  String get propertyDetailTitle => 'Immobiliendetails DE';

  @override
  String get propertyDetailOverviewTab => 'Übersicht DE';

  @override
  String get propertyDetailFeaturesTab => 'Merkmale DE';

  @override
  String get propertyDetailLocationTab => 'Standort DE';

  @override
  String get propertyDetailGalleryTab => 'Galerie DE';

  @override
  String get propertyDetailId => 'ID DE';

  @override
  String get propertyDetailNumber => 'Immobiliennummer DE';

  @override
  String get propertyDetailTitleField => 'Titel DE';

  @override
  String get propertyDetailDescription => 'Beschreibung DE';

  @override
  String get propertyDetailType => 'Typ DE';

  @override
  String get propertyDetailStatus => 'Status DE';

  @override
  String get propertyDetailCategory => 'Kategorie DE';

  @override
  String get propertyDetailCondition => 'Zustand DE';

  @override
  String get propertyDetailMarketValue => 'Marktwert DE';

  @override
  String get propertyDetailBedrooms => 'Schlafzimmer DE';

  @override
  String get propertyDetailBathrooms => 'Badezimmer DE';

  @override
  String get propertyDetailYearBuilt => 'Baujahr DE';

  @override
  String get propertyDetailFeatures => 'Merkmale DE';

  @override
  String get propertyDetailAmenities => 'Ausstattung DE';

  @override
  String get propertyDetailAddress => 'Adresse DE';

  @override
  String get propertyDetailCity => 'Stadt DE';

  @override
  String get propertyDetailState => 'Bundesland DE';

  @override
  String get propertyDetailCountry => 'Land DE';

  @override
  String get propertyDetailZipCode => 'Postleitzahl DE';

  @override
  String get propertyDetailCoordinates => 'Koordinaten DE';

  @override
  String get propertyDetailNoFeatures =>
      'Keine Merkmale oder Ausstattungen verfügbar DE';

  @override
  String get propertyDetailNoLocation =>
      'Keine Standortinformationen verfügbar DE';

  @override
  String get propertyDetailGalleryPlaceholder =>
      'Galerieansicht (Implementierung mit GridView von Bildern) DE';

  @override
  String get propertyDetailDeleteConfirm =>
      'Sind Sie sicher, dass Sie diese Immobilie löschen möchten? DE';

  @override
  String get propertyDetailDeleteSuccess => 'Immobilie erfolgreich gelöscht DE';

  @override
  String propertyDetailDeleteFailed(Object error) {
    return 'Löschen der Immobilie fehlgeschlagen: $error DE';
  }

  @override
  String get propertyDetailContactAgent => 'Makler kontaktieren DE';

  @override
  String get propertyDetailPrice => 'Preis DE';

  @override
  String get propertyDetailLoading => 'Immobiliendetails werden geladen... DE';

  @override
  String get propertyDetailNotFound => 'Immobilie nicht gefunden. DE';

  @override
  String get totalTenants => 'Gesamtzahl Mieter DE';

  @override
  String newTenants(Object count) {
    return 'Neue Mieter: $count DE';
  }

  @override
  String get homeLabel => 'Startseite DE';

  @override
  String get favoritesEmpty => 'Noch keine Favoriten DE';

  @override
  String get favoritesError => 'Fehler beim Laden der Favoriten DE';

  @override
  String get favoritesRetry => 'Wiederholen DE';

  @override
  String get emptyStateRetry => 'Wiederholen DE';

  @override
  String get listings => 'Meine Immobilien DE';

  @override
  String get listingsEmpty => 'Noch keine Inserate DE';

  @override
  String get listingsRetry => 'Wiederholen DE';

  @override
  String get filterPropertiesTitle => 'Immobilien filtern DE';

  @override
  String get filterPropertiesApply => 'Anwenden DE';

  @override
  String get filterPropertiesCancel => 'Abbrechen DE';

  @override
  String get messagesLabel => 'Nachrichten DE';

  @override
  String get notificationsLabel => 'Benachrichtigungen DE';

  @override
  String get notificationsEmpty => 'Noch keine Benachrichtigungen DE';

  @override
  String get paymentsLabel => 'Zahlungen DE';

  @override
  String get settingsLabel => 'Einstellungen DE';

  @override
  String get settingsAppearance => 'Erscheinungsbild DE';

  @override
  String get settingsDarkMode => 'Dunkelmodus DE';

  @override
  String get filterTasksTitle => 'Aufgaben filtern DE';

  @override
  String get filterTasksStatus => 'Status DE';

  @override
  String get filterTasksPriority => 'Priorität DE';

  @override
  String get filterTasksType => 'Typ DE';

  @override
  String get filterTasksDueDate => 'Fälligkeitsdatum DE';

  @override
  String get filterTasksApply => 'Anwenden DE';

  @override
  String get filterTasksCancel => 'Abbrechen DE';

  @override
  String get profileLabel => 'Profil DE';

  @override
  String get logoutLabel => 'Abmelden DE';

  @override
  String get loggingout => 'Abmelden... DE';

  @override
  String get sitetitle => 'RentalProc DE';

  @override
  String get nav_home => 'Startseite DE';

  @override
  String get nav_properties => 'Immobilien DE';

  @override
  String get nav_payments => 'Zahlungen DE';

  @override
  String get nav_tasks => 'Aufgaben DE';

  @override
  String get nav_messages => 'Nachrichten DE';

  @override
  String get nav_notifications => 'Benachrichtigungen DE';

  @override
  String get nav_helpdesk => 'Helpdesk DE';

  @override
  String get nav_subscription => 'Abonnement DE';

  @override
  String get nav_settings => 'Einstellungen DE';

  @override
  String get nav_tenants => 'Mieter DE';

  @override
  String get nav_expenses => 'Ausgaben DE';

  @override
  String get nav_facilities => 'Einrichtungen DE';

  @override
  String get nav_analytics => 'Analysen DE';

  @override
  String get nav_help => 'Hilfe DE';

  @override
  String get nav_logout => 'Abmelden DE';

  @override
  String get nav_profile => 'Profil DE';

  @override
  String get nav_viewAll => 'Alle anzeigen DE';

  @override
  String get indexTitle => 'Willkommen bei Menem DE';

  @override
  String get indexDescription => 'Ihre Immobilienverwaltungslösung DE';

  @override
  String get indexPropertyManagementTitle => 'Immobilienverwaltung DE';

  @override
  String get indexPropertyManagementDescription =>
      'Verwalten Sie Ihre Immobilien effizient mit unserer umfassenden Tool-Suite. DE';

  @override
  String get indexWaterManagementTitle => 'Wasserwirtschaft DE';

  @override
  String get indexWaterManagementDescription =>
      'Verfolgen und optimieren Sie den Wasserverbrauch Ihrer Immobilien. DE';

  @override
  String get authSignIn => 'Mit Google anmelden DE';

  @override
  String get authSignOut => 'Abmelden DE';

  @override
  String get createPropertyTitle => 'Neue Immobilie erstellen DE';

  @override
  String get propertyCreatedSuccess => 'Immobilie erfolgreich erstellt DE';

  @override
  String get propertyCreatedError =>
      'Erstellen der Immobilie fehlgeschlagen DE';

  @override
  String get registerAlreadyHaveAccount =>
      'Haben Sie bereits ein Konto? Anmelden DE';

  @override
  String get registerForgotPassword => 'Passwort vergessen? DE';

  @override
  String get propertyViewingEventsTitle => 'Besichtigungstermine DE';

  @override
  String get propertyViewingSchedule => 'Besichtigung vereinbaren DE';

  @override
  String authWelcomeBack(Object name) {
    return 'Willkommen zurück, $name DE';
  }

  @override
  String get postsCreate => 'Beitrag erstellen DE';

  @override
  String get postsTitle => 'Titel DE';

  @override
  String get postsContent => 'Inhalt DE';

  @override
  String get postsLoading => 'Beiträge werden geladen... DE';

  @override
  String get postsSave => 'Speichern DE';

  @override
  String get postsCancel => 'Abbrechen DE';

  @override
  String get postsEdit => 'Bearbeiten DE';

  @override
  String get postsDelete => 'Löschen DE';

  @override
  String get postsNoPostsYet => 'Noch keine Beiträge DE';

  @override
  String get postsErrorUnauthorized =>
      'Sie müssen angemeldet sein, um diese Aktion auszuführen DE';

  @override
  String get postsErrorCreatePost => 'Erstellen des Beitrags fehlgeschlagen DE';

  @override
  String get postsErrorUpdatePost =>
      'Aktualisieren des Beitrags fehlgeschlagen DE';

  @override
  String get postsErrorDeletePost => 'Löschen des Beitrags fehlgeschlagen DE';

  @override
  String get chatMessages => 'Nachrichten DE';

  @override
  String chatChattingWith(Object name) {
    return 'Chatten mit $name DE';
  }

  @override
  String get chatConnectWithUsers =>
      'Verbinden Sie sich mit Benutzern und erhalten Sie Support DE';

  @override
  String get chatBackToList => 'Zurück zur Liste DE';

  @override
  String get chatWelcomeToChat => 'Willkommen im Chat DE';

  @override
  String get chatWelcomeDescription =>
      'Starten Sie ein Gespräch mit anderen Benutzern oder kontaktieren Sie den Support für Unterstützung DE';

  @override
  String get chatNewMessage => 'Neue Nachricht DE';

  @override
  String get chatContactSupport => 'Support kontaktieren DE';

  @override
  String get chatBack => 'Zurück DE';

  @override
  String get chatSearchUsers => 'Benutzer suchen... DE';

  @override
  String get chatTypeMessage => 'Nachricht eingeben... DE';

  @override
  String get chatSend => 'Senden DE';

  @override
  String get chatErrorUnauthorized =>
      'Sie müssen angemeldet sein, um diese Aktion auszuführen DE';

  @override
  String get chatErrorSendMessage => 'Senden der Nachricht fehlgeschlagen DE';

  @override
  String get chatErrorMarkAsRead =>
      'Markieren von Nachrichten als gelesen fehlgeschlagen DE';

  @override
  String get chatError => 'Fehler DE';

  @override
  String get chatConnectionError =>
      'Verbindung zum Chat-Server fehlgeschlagen. Bitte versuchen Sie es erneut. DE';

  @override
  String get chatMessageSendError =>
      'Senden Ihrer Nachricht fehlgeschlagen. Bitte versuchen Sie es später erneut. DE';

  @override
  String get notifications_placeholder => 'Noch keine Benachrichtigungen DE';

  @override
  String get notificationsPlaceholder => 'Noch keine Benachrichtigungen DE';

  @override
  String commonTimeAgo(Object time) {
    return 'vor $time DE';
  }

  @override
  String get commonSuccess => 'Erfolg DE';

  @override
  String get commonError => 'Fehler DE';

  @override
  String propertiesFound(Object count) {
    return '$count Immobilien gefunden DE';
  }

  @override
  String get errorScreenTitle => 'Fehler DE';

  @override
  String get errorScreenGoBack => 'Zurück DE';

  @override
  String get dateRangeSelectTitle => 'Datumsbereich auswählen DE';

  @override
  String get dateRangeSelectApply => 'Anwenden DE';

  @override
  String get dateRangeSelectCancel => 'Abbrechen DE';

  @override
  String get commonWarning => 'Warnung DE';

  @override
  String get commonInfo => 'Information DE';

  @override
  String get commonLoading => 'Laden... DE';

  @override
  String get commonSave => 'Speichern DE';

  @override
  String get commonCancel => 'Abbrechen DE';

  @override
  String get commonDelete => 'Löschen DE';

  @override
  String get commonEdit => 'Bearbeiten DE';

  @override
  String get commonCreate => 'Erstellen DE';

  @override
  String get commonView => 'Anzeigen DE';

  @override
  String get commonPrevious => 'Zurück DE';

  @override
  String get commonNext => 'Weiter DE';

  @override
  String get commonBack => 'Zurück DE';

  @override
  String get commonConfirm => 'Bestätigen DE';

  @override
  String get commonActions => 'Aktionen DE';

  @override
  String get commonSearch => 'Suchen DE';

  @override
  String get commonFilter => 'Filter DE';

  @override
  String get commonSort => 'Sortieren DE';

  @override
  String get commonNoData => 'Keine Daten verfügbar DE';

  @override
  String get editAgentTooltip => 'Makler bearbeiten DE';

  @override
  String get agentContactInformationTitle => 'Kontaktinformationen DE';

  @override
  String get agentEmailLabel => 'E-Mail DE';

  @override
  String get agentPhoneLabel => 'Telefon DE';

  @override
  String get agentAddressLabel => 'Adresse DE';

  @override
  String get agentWebsiteLabel => 'Webseite DE';

  @override
  String get agentProfessionalInformationTitle => 'Berufliche Informationen DE';

  @override
  String get agentStatusLabel => 'Status DE';

  @override
  String get agentAgencyLabel => 'Agentur DE';

  @override
  String get agentSpecialitiesLabel => 'Spezialgebiete DE';

  @override
  String get agentActivityTitle => 'Letzte Aktivität DE';

  @override
  String get agentLastActiveLabel => 'Zuletzt aktiv DE';

  @override
  String get agentIsActiveLabel => 'Ist aktiv DE';

  @override
  String get agentCreatedAtLabel => 'Erstellt am DE';

  @override
  String get agentAdditionalInformationTitle => 'Zusätzliche Informationen DE';

  @override
  String get agentBioLabel => 'Bio DE';

  @override
  String get agentExternalIdLabel => 'Externe ID DE';

  @override
  String get agentSettingsLabel => 'Einstellungen DE';

  @override
  String get agentIntegrationLabel => 'Integration DE';

  @override
  String get agentOwnerIdLabel => 'Eigentümer-ID DE';

  @override
  String get agentAgencyIdLabel => 'Agentur-ID DE';

  @override
  String get agentDeletedAtLabel => 'Gelöscht am DE';

  @override
  String get amenitiesSectionTitle => 'Ausstattung DE';

  @override
  String get noAmenitiesListed => 'Keine Ausstattung aufgeführt DE';

  @override
  String get locationSectionTitle => 'Standort DE';

  @override
  String get getDirectionsButton => 'Route berechnen DE';

  @override
  String get messageStatusRead => 'Gelesen DE';

  @override
  String get messageStatusDelivered => 'Zugestellt DE';

  @override
  String get messageStatusSent => 'Gesendet DE';

  @override
  String get defaultUser => 'Standardbenutzer DE';

  @override
  String get unknownTime => 'Unbekannte Zeit DE';

  @override
  String get commonNotAvailable => 'Nicht verfügbar DE';

  @override
  String accountsFound(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count Konten gefunden',
      one: '1 Konto gefunden',
      zero: 'Keine Konten gefunden',
    );
    return '$_temp0 DE';
  }

  @override
  String get actionCardProperties => 'Immobilien DE';

  @override
  String get actionCardTenants => 'Mieter DE';

  @override
  String get actionCardAnalytics => 'Analysen DE';

  @override
  String get actionCardPayments => 'Zahlungen DE';

  @override
  String get actionCardTasks => 'Aufgaben DE';

  @override
  String get actionCardMessages => 'Nachrichten DE';

  @override
  String get actionCardHelpDesk => 'Helpdesk DE';

  @override
  String get actionCardManageYourPropertyPortfolio =>
      'Verwalten Sie Ihr Immobilienportfolio DE';

  @override
  String get actionCardManageTenantInformation =>
      'Mieterinformationen verwalten DE';

  @override
  String get actionCardViewReportsAndAnalytics =>
      'Berichte und Analysen anzeigen DE';

  @override
  String get actionCardTrackFinancialRecords => 'Finanzunterlagen verfolgen DE';

  @override
  String get actionCardManageMaintenanceTasks =>
      'Wartungsaufgaben verwalten DE';

  @override
  String get actionCardCommunicateWithTenants => 'Mit Mietern kommunizieren DE';

  @override
  String get actionCardGetAssistanceWhenNeeded =>
      'Hilfe erhalten, wenn nötig DE';

  @override
  String get actionCardAddProperty => 'Immobilie hinzufügen DE';

  @override
  String get actionCardCreateANewPropertyListing =>
      'Neues Immobilieninserat erstellen DE';

  @override
  String get actionCardAddTenant => 'Mieter hinzufügen DE';

  @override
  String get actionCardRegisterANewTenant => 'Neuen Mieter registrieren DE';

  @override
  String get actionCardRecordPayment => 'Zahlung erfassen DE';

  @override
  String get actionCardRecordARentPayment => 'Mietzahlung erfassen DE';

  @override
  String get actionCardAddTask => 'Aufgabe hinzufügen DE';

  @override
  String get actionCardCreateAMaintenanceTask => 'Wartungsaufgabe erstellen DE';

  @override
  String get actionCardScheduleEvent => 'Ereignis planen DE';

  @override
  String get actionCardCreateAPropertyEvent =>
      'Immobilienereignis erstellen DE';

  @override
  String get actionCardComposeMessage => 'Nachricht verfassen DE';

  @override
  String get actionCardSendAMessageToTenants => 'Nachricht an Mieter senden DE';

  @override
  String get actionCardCreateDocument => 'Dokument erstellen DE';

  @override
  String get actionCardGenerateANewDocument => 'Neues Dokument generieren DE';

  @override
  String get actionCardGetStarted => 'Loslegen DE';

  @override
  String get actionCardNewThisMonth => 'Neu diesen Monat DE';

  @override
  String get tenantsTitle => 'Mieter DE';

  @override
  String get tenantsDescription =>
      'Verwalten Sie Mieterinformationen und Mietverträge für Ihre Immobilien DE';

  @override
  String get tenantsAddTenant => 'Mieter hinzufügen DE';

  @override
  String get tenantsPropertyFilter => 'Immobilie DE';

  @override
  String get tenantsAllProperties => 'Alle Immobilien DE';

  @override
  String get tenantsPaymentStatusFilter => 'Zahlungsstatus DE';

  @override
  String get tenantsAllStatuses => 'Alle Status DE';

  @override
  String get tenantsTenantColumn => 'Mieter DE';

  @override
  String get tenantsStatusColumn => 'Status DE';

  @override
  String get tenantsPropertyUnitColumn => 'Immobilie / Einheit DE';

  @override
  String get tenantsContactColumn => 'Kontakt DE';

  @override
  String get tenantsLeasePeriodColumn => 'Mietzeitraum DE';

  @override
  String get tenantsActionsColumn => 'Aktionen DE';

  @override
  String get tenantsIdLabel => 'ID DE';

  @override
  String get tenantsNotAssigned => 'Nicht zugewiesen DE';

  @override
  String get tenantsNotAvailable => 'N. z. DE';

  @override
  String get tenantsLeaseFrom => 'Von DE';

  @override
  String get tenantsLeaseTo => 'Bis DE';

  @override
  String get tenantsViewDetails => 'Details anzeigen DE';

  @override
  String get tenantsEdit => 'Bearbeiten DE';

  @override
  String get tenantsDelete => 'Löschen DE';

  @override
  String get tenantsNoTenantsFound => 'Keine Mieter gefunden DE';

  @override
  String get tenantsGetStartedAddTenant =>
      'Beginnen Sie mit dem Hinzufügen eines neuen Mieters DE';

  @override
  String get tenantsConfirmDeletionTitle => 'Löschung bestätigen DE';

  @override
  String tenantsConfirmDeletionDesc(Object tenant) {
    return 'Sind Sie sicher, dass Sie den Mieter $tenant löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden. DE';
  }

  @override
  String get tenantsCancel => 'Abbrechen DE';

  @override
  String get tenantsDeleting => 'Wird gelöscht... DE';

  @override
  String get tenantsPrevious => 'Zurück DE';

  @override
  String get tenantsNext => 'Weiter DE';

  @override
  String get tenantsStatusUnpaid => 'Unbezahlt DE';

  @override
  String get tenantsStatusPartiallyPaid => 'Teilweise bezahlt DE';

  @override
  String get tenantsStatusPaid => 'Bezahlt DE';

  @override
  String get tenantsStatusRefunded => 'Erstattet DE';

  @override
  String get tenantsStatusOverdue => 'Überfällig DE';

  @override
  String get tenantsStatusCancelled => 'Storniert DE';

  @override
  String get agenciesTitle => 'Agenturen DE';

  @override
  String get agenciesDescription =>
      'Verwalten Sie Ihre Agenturen und deren Einstellungen. DE';

  @override
  String get agenciesSearch => 'Agenturen suchen... DE';

  @override
  String get agenciesStatus => 'Status DE';

  @override
  String get agenciesStatusValuesPending => 'Ausstehend DE';

  @override
  String get agenciesStatusValuesVerified => 'Verifiziert DE';

  @override
  String get agenciesStatusValuesRejected => 'Abgelehnt DE';

  @override
  String get agenciesAdd => 'Agentur hinzufügen DE';

  @override
  String get agenciesEdit => 'Bearbeiten DE';

  @override
  String get agenciesDelete => 'Löschen DE';

  @override
  String agenciesConfirmDeleteDesc(Object name) {
    return 'Sind Sie sicher, dass Sie $name löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden. DE';
  }

  @override
  String get agenciesDeletedMsg => 'Agentur erfolgreich gelöscht. DE';

  @override
  String get agenciesNone =>
      'Keine Agenturen entsprechen Ihrer Suche. Versuchen Sie andere Filter. DE';

  @override
  String get agenciesNa => 'N. z. DE';

  @override
  String get agenciesAgents => 'Makler DE';

  @override
  String get agenciesView => 'Anzeigen DE';

  @override
  String get agenciesName => 'Name der Agentur DE';

  @override
  String get agenciesEmail => 'E-Mail DE';

  @override
  String get agenciesPhoneNumber => 'Telefonnummer DE';

  @override
  String get agenciesAddress => 'Adresse DE';

  @override
  String get agenciesWebsite => 'Webseite DE';

  @override
  String get agenciesLogoUrl => 'Logo-URL DE';

  @override
  String get agenciesCreated => 'Erstellt DE';

  @override
  String get agenciesUpdated => 'Aktualisiert DE';

  @override
  String get agenciesProperties => 'Immobilien DE';

  @override
  String get agenciesActions => 'Aktionen DE';

  @override
  String get agenciesCancel => 'Abbrechen DE';

  @override
  String get agenciesDeleting => 'Wird gelöscht... DE';

  @override
  String get agenciesCreating => 'Wird erstellt... DE';

  @override
  String get agenciesSaving => 'Wird gespeichert... DE';

  @override
  String get agenciesSave => 'Speichern DE';

  @override
  String get agenciesCreate => 'Erstellen DE';

  @override
  String get agenciesGetStarted =>
      'Beginnen Sie mit dem Hinzufügen einer neuen Agentur DE';

  @override
  String get agenciesRequired => 'Dieses Feld ist erforderlich. DE';

  @override
  String get agenciesInvalidEmail => 'Ungültige E-Mail-Adresse. DE';

  @override
  String get agenciesInvalidUrl => 'Ungültige URL. DE';

  @override
  String get agenciesUpdatedMsg => 'Aktualisiert! DE';

  @override
  String get agenciesCreatedMsg => 'Erstellt! DE';

  @override
  String get agenciesErrorLoad => 'Laden der Details fehlgeschlagen. DE';

  @override
  String get agenciesErrorCreate => 'Erstellen fehlgeschlagen. DE';

  @override
  String get agenciesErrorUpdate => 'Aktualisieren fehlgeschlagen. DE';

  @override
  String get agenciesErrorDelete => 'Löschen fehlgeschlagen. DE';

  @override
  String get loginPageTitle => 'Anmelden DE';

  @override
  String get loginPageEmail => 'E-Mail DE';

  @override
  String get loginPagePassword => 'Passwort DE';

  @override
  String get loginPageRememberMe => 'Angemeldet bleiben DE';

  @override
  String get loginPageForgotPassword => 'Passwort vergessen? DE';

  @override
  String get loginPageSignIn => 'Anmelden DE';

  @override
  String get loginPageOrContinueWith => 'Oder fortfahren mit DE';

  @override
  String get loginPageDontHaveAccount => 'Haben Sie noch kein Konto? DE';

  @override
  String get loginPageSignUp => 'Registrieren DE';

  @override
  String get loginPageErrorInvalidCredentials =>
      'Ungültige E-Mail-Adresse oder Passwort DE';

  @override
  String get loginPageErrorSomethingWentWrong =>
      'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut. DE';

  @override
  String get loginPageErrorSessionExpired =>
      'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an. DE';

  @override
  String get authErrorTitle => 'Authentifizierungsfehler DE';

  @override
  String get authErrorSomethingWentWrong =>
      'Bei der Authentifizierung ist etwas schiefgelaufen. Bitte versuchen Sie es erneut. DE';

  @override
  String get authErrorOauthAccountNotLinked =>
      'Ein Konto mit dieser E-Mail-Adresse existiert bereits. Bitte melden Sie sich mit der ursprünglichen Authentifizierungsmethode an. DE';

  @override
  String get authErrorOauthCallbackError =>
      'Während des OAuth-Callback-Prozesses ist ein Fehler aufgetreten. DE';

  @override
  String get authErrorOauthCreateAccountError =>
      'Erstellen eines neuen Kontos fehlgeschlagen. Bitte versuchen Sie es erneut. DE';

  @override
  String get authErrorOauthSignInError =>
      'Fehler beim Anmelden mit dem ausgewählten Anbieter. Bitte versuchen Sie es erneut. DE';

  @override
  String get authErrorBackToLogin => 'Zurück zum Login DE';

  @override
  String get propertyTitle => 'Immobiliendetails DE';

  @override
  String get propertyBackToProperties => 'Zurück zu den Immobilien DE';

  @override
  String get propertyEditProperty => 'Immobilie bearbeiten DE';

  @override
  String get propertyDeleteProperty => 'Immobilie löschen DE';

  @override
  String get propertyCreateProperty => 'Immobilie erstellen DE';

  @override
  String get propertyAddProperty => 'Immobilie hinzufügen DE';

  @override
  String get propertyLoading => 'Immobilie wird geladen... DE';

  @override
  String get propertyNotFound => 'Immobilie nicht gefunden. DE';

  @override
  String get propertyDebugInfo => 'Debug-Informationen: DE';

  @override
  String get propertyConfirmDeleteTitle =>
      'Sind Sie sicher, dass Sie diese Immobilie löschen möchten? DE';

  @override
  String get propertyConfirmDeleteDescription =>
      'Diese Aktion kann nicht rückgängig gemacht werden. Alle mit dieser Immobilie verbundenen Daten werden dauerhaft entfernt. DE';

  @override
  String get propertyConfirmDeleteCancel => 'Abbrechen DE';

  @override
  String get propertyConfirmDeleteConfirm => 'Löschen bestätigen DE';

  @override
  String get propertyTabsOverview => 'Übersicht DE';

  @override
  String get propertyTabsFeatures => 'Merkmale DE';

  @override
  String get propertyTabsAmenities => 'Ausstattung DE';

  @override
  String get propertyTabsLocation => 'Standort DE';

  @override
  String get propertyTabsDocuments => 'Dokumente DE';

  @override
  String get propertyTabsHistory => 'Verlauf DE';

  @override
  String get propertySectionsBasicInfo => 'Grundlegende Informationen DE';

  @override
  String get propertySectionsPhysicalCharacteristics =>
      'Physische Eigenschaften DE';

  @override
  String get propertySectionsContactInfo => 'Kontaktinformationen DE';

  @override
  String get propertySectionsRelatedEntities => 'Verwandte Entitäten DE';

  @override
  String get propertySectionsMetadata => 'Metadaten DE';

  @override
  String get propertySectionsFeatures => 'Merkmale DE';

  @override
  String get propertySectionsAmenities => 'Ausstattung DE';

  @override
  String get propertySectionsLocationInfo => 'Standortinformationen DE';

  @override
  String get propertyFieldsTitle => 'Titel DE';

  @override
  String get propertyFieldsDescription => 'Beschreibung DE';

  @override
  String get propertyFieldsPropertyType => 'Immobilientyp DE';

  @override
  String get propertyFieldsStatus => 'Status DE';

  @override
  String get propertyFieldsCategory => 'Kategorie DE';

  @override
  String get propertyFieldsBuildingClass => 'Gebäudeklasse DE';

  @override
  String get propertyFieldsCondition => 'Zustand DE';

  @override
  String get propertyFieldsSize => 'Größe (m²) DE';

  @override
  String get propertyFieldsBedrooms => 'Schlafzimmer DE';

  @override
  String get propertyFieldsBathrooms => 'Badezimmer DE';

  @override
  String get propertyFieldsYearBuilt => 'Baujahr DE';

  @override
  String get propertyFieldsContactEmail => 'Kontakt-E-Mail DE';

  @override
  String get propertyFieldsContactPhone => 'Kontakttelefon DE';

  @override
  String get propertyFieldsOwner => 'Eigentümer DE';

  @override
  String get propertyFieldsAgent => 'Makler DE';

  @override
  String get propertyFieldsAgency => 'Agentur DE';

  @override
  String get propertyFieldsCreated => 'Erstellt DE';

  @override
  String get propertyFieldsUpdated => 'Aktualisiert DE';

  @override
  String get propertyFieldsListed => 'Gelistet DE';

  @override
  String get propertyFieldsAddress => 'Adresse DE';

  @override
  String get propertyFieldsCity => 'Stadt DE';

  @override
  String get propertyFieldsStateProvince => 'Bundesland/Provinz DE';

  @override
  String get propertyFieldsPostalCode => 'Postleitzahl DE';

  @override
  String get propertyFieldsCountry => 'Land DE';

  @override
  String get propertyFieldsCoordinates => 'Koordinaten DE';

  @override
  String get propertyFieldsLatitude => 'Breitengrad DE';

  @override
  String get propertyFieldsLongitude => 'Längengrad DE';

  @override
  String get propertyNoFeatures => 'Keine Merkmale aufgeführt DE';

  @override
  String get propertyNoAmenities => 'Keine Ausstattung aufgeführt DE';

  @override
  String get propertyNoCoordinates => 'Keine Koordinaten verfügbar DE';

  @override
  String get propertySuccessDeleted => 'Immobilie erfolgreich gelöscht DE';

  @override
  String get propertySuccessCreated => 'Immobilie erfolgreich erstellt DE';

  @override
  String get propertySuccessUpdated => 'Immobilie erfolgreich aktualisiert DE';

  @override
  String get propertyErrorDelete => 'Löschen der Immobilie fehlgeschlagen DE';

  @override
  String get propertyErrorCreate => 'Erstellen der Immobilie fehlgeschlagen DE';

  @override
  String get propertyErrorUpdate =>
      'Aktualisieren der Immobilie fehlgeschlagen DE';

  @override
  String get propertyErrorFetch =>
      'Abrufen der Immobiliendetails fehlgeschlagen DE';

  @override
  String get adminDashboard => 'Dashboard DE';

  @override
  String get adminProperties => 'Immobilien DE';

  @override
  String get adminAgents => 'Makler DE';

  @override
  String get adminAgencies => 'Agenturen DE';

  @override
  String get adminOwners => 'Eigentümer DE';

  @override
  String get adminTenants => 'Mieter DE';

  @override
  String get adminPayments => 'Zahlungen DE';

  @override
  String get adminTasks => 'Aufgaben DE';

  @override
  String get adminMessages => 'Nachrichten DE';

  @override
  String get adminReports => 'Berichte DE';

  @override
  String get adminAnalytics => 'Analysen DE';

  @override
  String get adminSettings => 'Einstellungen DE';

  @override
  String get adminNotifications => 'Benachrichtigungen DE';

  @override
  String get account_id => 'Konto-ID DE';

  @override
  String get account_type => 'Typ DE';

  @override
  String get account_provider => 'Anbieter DE';

  @override
  String get accountFilter_type_BANK => 'Bankkonto DE';

  @override
  String get accountFilter_type_CREDIT_CARD => 'Kreditkarte DE';

  @override
  String get accountFilter_type_INVESTMENT => 'Anlagekonto DE';

  @override
  String get accountFilter_type_SAVINGS => 'Sparkonto DE';

  @override
  String get accountFilter_type_LOAN => 'Darlehenskonto DE';

  @override
  String get accountFilter_type_OTHER => 'Anderes Konto DE';

  @override
  String get facilityDetailTitle => 'Einrichtungsdetails DE';

  @override
  String get facilityDetailId => 'ID DE';

  @override
  String get facilityDetailName => 'Name DE';

  @override
  String get facilityDetailDescription => 'Beschreibung DE';

  @override
  String get facilityDetailType => 'Typ DE';

  @override
  String get facilityDetailStatus => 'Status DE';

  @override
  String get facilityDetailPropertyId => 'Immobilien-ID DE';

  @override
  String get facilityDetailLocation => 'Standort DE';

  @override
  String get facilityDetailMetadata => 'Metadaten DE';

  @override
  String get facilityDetailCreatedBy => 'Erstellt von DE';

  @override
  String get facilityDetailUpdatedBy => 'Aktualisiert von DE';

  @override
  String get facilityDetailCreatedAt => 'Erstellt am DE';

  @override
  String get facilityDetailUpdatedAt => 'Aktualisiert am DE';

  @override
  String get facilityDetailDeletedAt => 'Gelöscht am DE';

  @override
  String get complianceRecordDetailTitle =>
      'Details zum Compliance-Datensatz DE';

  @override
  String get complianceRecordType => 'Typ DE';

  @override
  String get complianceRecordStatus => 'Status DE';

  @override
  String get complianceRecordMetadata => 'Metadaten DE';

  @override
  String get complianceRecordCustomFields => 'Benutzerdefinierte Felder DE';

  @override
  String get analyticsDetailTitle => 'Analysedetails DE';

  @override
  String get analyticsType => 'Typ DE';

  @override
  String get analyticsEntityType => 'Entitätstyp DE';

  @override
  String get analyticsEntityId => 'Entitäts-ID DE';

  @override
  String get analyticsTimestamp => 'Zeitstempel DE';

  @override
  String get analyticsPropertyId => 'Immobilien-ID DE';

  @override
  String get analyticsUserId => 'Benutzer-ID DE';

  @override
  String get analyticsAgentId => 'Makler-ID DE';

  @override
  String get analyticsAgencyId => 'Agentur-ID DE';

  @override
  String get analyticsReservationId => 'Reservierungs-ID DE';

  @override
  String get analyticsTaskId => 'Aufgaben-ID DE';

  @override
  String get analyticsDeletedAt => 'Gelöscht am DE';

  @override
  String get analyticsCreatedAt => 'Erstellt am DE';

  @override
  String get analyticsUpdatedAt => 'Aktualisiert am DE';

  @override
  String get analyticsData => 'Daten DE';

  @override
  String get analyticsAgency => 'Agentur DE';

  @override
  String get analyticsAgent => 'Makler DE';

  @override
  String get analyticsTypeListingView => 'Inseratsansicht DE';

  @override
  String get analyticsTypeBookingConversion => 'Buchungskonversion DE';

  @override
  String get analyticsTypeUserEngagement => 'Benutzerinteraktion DE';

  @override
  String get analyticsTypeRevenue => 'Umsatz DE';

  @override
  String get analyticsTypePerformance => 'Leistung DE';

  @override
  String get analyticsTypeAgentPerformance => 'Maklerleistung DE';

  @override
  String get analyticsTypeAgencyPerformance => 'Agenturleistung DE';

  @override
  String get analyticsTypeView => 'Ansicht DE';

  @override
  String get contractDetailTitle => 'Vertragsdetails DE';

  @override
  String get contractIdLabel => 'ID DE';

  @override
  String get contractNameLabel => 'Name DE';

  @override
  String get contractDescriptionLabel => 'Beschreibung DE';

  @override
  String get contractTypeLabel => 'Typ DE';

  @override
  String get contractStatusLabel => 'Status DE';

  @override
  String get contractCurrencyLabel => 'Währung DE';

  @override
  String get contractRentAmountLabel => 'Mietbetrag DE';

  @override
  String get contractNoticePeriodLabel => 'Kündigungsfrist DE';

  @override
  String get contractPropertyIdLabel => 'Immobilien-ID DE';

  @override
  String get contractTenantIdLabel => 'Mieter-ID DE';

  @override
  String get contractLandlordIdLabel => 'Vermieter-ID DE';

  @override
  String get contractOwnerIdLabel => 'Eigentümer-ID DE';

  @override
  String get contractAgencyIdLabel => 'Agentur-ID DE';

  @override
  String get contractStartDateLabel => 'Startdatum DE';

  @override
  String get contractEndDateLabel => 'Enddatum DE';

  @override
  String get contractCreatedAtLabel => 'Erstellt am DE';

  @override
  String get contractUpdatedAtLabel => 'Aktualisiert am DE';

  @override
  String get contractDeletedAtLabel => 'Gelöscht am DE';

  @override
  String get contractSignedByLabel => 'Unterzeichnet von DE';

  @override
  String get contractSignedAtLabel => 'Unterzeichnet am DE';

  @override
  String get contractTerminatedByLabel => 'Gekündigt von DE';

  @override
  String get contractTerminatedAtLabel => 'Gekündigt am DE';

  @override
  String get contractCancelledByLabel => 'Storniert von DE';

  @override
  String get contractCancelledAtLabel => 'Storniert am DE';

  @override
  String get contractTermsLabel => 'Bedingungen: DE';

  @override
  String get contractConditionsLabel => 'Konditionen: DE';

  @override
  String get contractTypeRental => 'Miete DE';

  @override
  String get contractTypeSale => 'Verkauf DE';

  @override
  String get contractTypeManagement => 'Verwaltung DE';

  @override
  String get contractTypeCommission => 'Provision DE';

  @override
  String get contractTypeService => 'Dienstleistung DE';

  @override
  String get contractStatusDraft => 'Entwurf DE';

  @override
  String get contractStatusActive => 'Aktiv DE';

  @override
  String get contractStatusExpired => 'Abgelaufen DE';

  @override
  String get contractStatusTerminated => 'Gekündigt DE';

  @override
  String get contractStatusRenewed => 'Verlängert DE';

  @override
  String get contractStatusPending => 'Ausstehend DE';

  @override
  String get contractStatusArchived => 'Archiviert DE';

  @override
  String get taxRecordAny => 'Beliebig DE';

  @override
  String get taxRecordPaid => 'Bezahlt DE';

  @override
  String get taxRecordUnpaid => 'Unbezahlt DE';

  @override
  String get taxRecordsTitle => 'Steuerunterlagen DE';

  @override
  String get eventType => 'Typ DE';

  @override
  String get eventStatus => 'Status DE';

  @override
  String get eventProperty => 'Immobilie DE';

  @override
  String get eventAttendees => 'Teilnehmer DE';

  @override
  String get eventDate => 'Datum DE';

  @override
  String get eventListTitle => 'Ereignisse DE';

  @override
  String get eventGallery => 'Galerie DE';

  @override
  String get pricingRuleName => 'Name DE';

  @override
  String get pricingRuleType => 'Typ DE';

  @override
  String get pricingRuleStatus => 'Status DE';

  @override
  String get pricingRuleMultiplier => 'Multiplikator DE';

  @override
  String get pricingRuleFixedPrice => 'Festpreis DE';

  @override
  String get pricingRuleIsActive => 'Ist aktiv DE';

  @override
  String get pricingRulePropertyId => 'Immobilien-ID DE';

  @override
  String get pricingRuleCreatedAt => 'Erstellt am DE';

  @override
  String get pricingRuleUpdatedAt => 'Aktualisiert am DE';

  @override
  String get pricingRuleDeletedAt => 'Gelöscht am DE';

  @override
  String get pricingRuleConditions => 'Bedingungen DE';

  @override
  String get pricingRuleProperty => 'Immobilie DE';

  @override
  String get mentionType => 'Typ DE';

  @override
  String get mentionStatus => 'Status DE';

  @override
  String get taskType => 'Typ DE';

  @override
  String get taskStatus => 'Status DE';

  @override
  String get taskPriority => 'Priorität DE';

  @override
  String get taskAssignedTo => 'Zugewiesen an DE';

  @override
  String get taskCreatedAt => 'Erstellt am DE';

  @override
  String get taskUpdatedAt => 'Aktualisiert am DE';

  @override
  String get taskDeletedAt => 'Gelöscht am DE';

  @override
  String get guestStatus => 'Status DE';

  @override
  String get guestPhoneNumber => 'Telefonnummer DE';

  @override
  String get reviewType => 'Typ DE';

  @override
  String get reviewStatus => 'Status DE';

  @override
  String get notificationType => 'Typ DE';

  @override
  String get notificationStatus => 'Status DE';

  @override
  String get messageType => 'Typ DE';

  @override
  String get messageStatus => 'Status DE';

  @override
  String get accountType => 'Typ DE';

  @override
  String get accountStatus => 'Status DE';

  @override
  String get complianceTypeLicense => 'Lizenz DE';

  @override
  String get complianceTypeCertification => 'Zertifizierung DE';

  @override
  String get complianceTypeInsurance => 'Versicherung DE';

  @override
  String get complianceTypePermit => 'Genehmigung DE';

  @override
  String get complianceTypeOther => 'Andere DE';

  @override
  String get complianceStatusPending => 'Ausstehend DE';

  @override
  String get complianceStatusApproved => 'Genehmigt DE';

  @override
  String get complianceStatusRejected => 'Abgelehnt DE';

  @override
  String get complianceStatusExpired => 'Abgelaufen DE';

  @override
  String get commonYes => 'Ja DE';

  @override
  String get commonNo => 'Nein DE';

  @override
  String get accountFilter_type_oauth => 'OAuth DE';

  @override
  String get accountFilter_type_email => 'E-Mail DE';

  @override
  String get accountFilter_type_oidc => 'OIDC DE';

  @override
  String get accountFilter_type_credentials => 'Anmeldeinformationen DE';

  @override
  String get accountFilter_type_google => 'Google DE';

  @override
  String get adminUsers => 'Benutzer DE';

  @override
  String get adminExpenses => 'Ausgaben DE';

  @override
  String get adminFacilities => 'Einrichtungen DE';

  @override
  String get adminHelpdesk => 'Helpdesk DE';

  @override
  String get adminSubscriptions => 'Abonnements DE';

  @override
  String get adminContracts => 'Verträge DE';

  @override
  String get adminGuests => 'Gäste DE';

  @override
  String get adminCompliance => 'Compliance DE';

  @override
  String get adminPricingRules => 'Preisregeln DE';

  @override
  String get adminReviews => 'Bewertungen DE';

  @override
  String get accountFilter_type_facebook => 'Facebook DE';

  @override
  String get edit_agent_tooltip => 'Makler bearbeiten DE';

  @override
  String get agent_contact_information_title => 'Kontaktinformationen DE';

  @override
  String get agent_email_label => 'E-Mail DE';

  @override
  String get agent_phone_label => 'Telefon DE';

  @override
  String get agent_address_label => 'Adresse DE';

  @override
  String get agent_website_label => 'Webseite DE';

  @override
  String get agent_professional_information_title =>
      'Berufliche Informationen DE';

  @override
  String get agent_status_label => 'Status DE';

  @override
  String get agent_agency_label => 'Agentur DE';

  @override
  String get agent_specialities_label => 'Spezialgebiete DE';

  @override
  String get agent_activity_title => 'Letzte Aktivität DE';

  @override
  String get agent_last_active_label => 'Zuletzt aktiv DE';

  @override
  String get agent_is_active_label => 'Ist aktiv DE';

  @override
  String get agent_created_at_label => 'Erstellt am DE';

  @override
  String get common_not_available => 'Nicht verfügbar DE';

  @override
  String get common_yes => 'Ja DE';

  @override
  String get common_no => 'Nein DE';

  @override
  String get availability_edit_title => 'Verfügbarkeit bearbeiten DE';

  @override
  String get common_save => 'Speichern DE';

  @override
  String get availability_date => 'Datum DE';

  @override
  String get availability_not_set => 'Nicht festgelegt DE';

  @override
  String get availability_blocked => 'Blockiert DE';

  @override
  String get availability_booked => 'Gebucht DE';

  @override
  String get availability_property_id => 'Immobilien-ID DE';

  @override
  String get availability_reservation_id => 'Reservierungs-ID DE';

  @override
  String get availability_pricing_rule_id => 'Preisregel-ID DE';

  @override
  String get availability_total_units => 'Gesamteinheiten DE';

  @override
  String get availability_available_units => 'Verfügbare Einheiten DE';

  @override
  String get availability_booked_units => 'Gebuchte Einheiten DE';

  @override
  String get availability_blocked_units => 'Blockierte Einheiten DE';

  @override
  String get availability_base_price => 'Grundpreis DE';

  @override
  String get availability_current_price => 'Aktueller Preis DE';

  @override
  String get availability_special_pricing_json => 'Sonderpreise (JSON) DE';

  @override
  String get availability_price_settings_json => 'Preiseinstellungen (JSON) DE';

  @override
  String get availability_min_nights => 'Mindestnächte DE';

  @override
  String get availability_max_nights => 'Maximale Nächte DE';

  @override
  String get availability_max_guests => 'Maximale Gäste DE';

  @override
  String get availability_discount_settings_json =>
      'RABATTEINSTELLUNGEN (JSON) DE';

  @override
  String get availability_weekend_rate => 'Wochenendtarif DE';

  @override
  String get availability_weekday_rate => 'Wochentagstarif DE';

  @override
  String get availability_weekend_multiplier => 'Wochenendmultiplikator DE';

  @override
  String get availability_weekday_multiplier => 'Wochentagsmultiplikator DE';

  @override
  String get availability_seasonal_multiplier => 'Saisonaler Multiplikator DE';

  @override
  String get facilityTypeGym => 'Fitnessstudio DE';

  @override
  String get facilityTypePool => 'Schwimmbad DE';

  @override
  String get facilityTypeParkingLot => 'Parkplatz DE';

  @override
  String get facilityTypeLaundry => 'Wäscherei DE';

  @override
  String get facilityTypeElevator => 'Aufzug DE';

  @override
  String get facilityTypeSecurity => 'Sicherheit DE';

  @override
  String get facilityTypeOther => 'Andere DE';

  @override
  String get facilityStatusAvailable => 'Verfügbar DE';

  @override
  String get facilityStatusUnavailable => 'Nicht verfügbar DE';

  @override
  String get facilityStatusMaintenance => 'Wartung DE';
}
