// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a it locale. All the
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
  String get localeName => 'it';

  static String m0(count) =>
      "${Intl.plural(count, zero: 'Nessun account trovato', one: '1 account trovato', other: '${count} account trovati')}";

  static String m2(name) => "Bentornato, ${name}";

  static String m3(name) => "Chat con ${name}";

  static String m5(count) => "Nuovi inquilini: ${count}";

  static String m6(rate) => "Tasso di occupazione: ${rate}";

  static String m7(count) => "Pagamenti in sospeso: ${count}";

  static String m9(count) => "${count} questa settimana";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountsFound": m0,
    "agent_activity_title": MessageLookupByLibrary.simpleMessage(
      "Attività recente",
    ),
    "agent_address_label": MessageLookupByLibrary.simpleMessage("Indirizzo"),
    "agent_agency_label": MessageLookupByLibrary.simpleMessage("Agenzia"),
    "agent_contact_information_title": MessageLookupByLibrary.simpleMessage(
      "Informazioni di contatto",
    ),
    "agent_created_at_label": MessageLookupByLibrary.simpleMessage("Creato il"),
    "agent_email_label": MessageLookupByLibrary.simpleMessage("Email"),
    "agent_is_active_label": MessageLookupByLibrary.simpleMessage("È attivo"),
    "agent_last_active_label": MessageLookupByLibrary.simpleMessage(
      "Ultimo accesso",
    ),
    "agent_phone_label": MessageLookupByLibrary.simpleMessage("Telefono"),
    "agent_professional_information_title":
        MessageLookupByLibrary.simpleMessage("Informazioni professionali"),
    "agent_specialities_label": MessageLookupByLibrary.simpleMessage(
      "Specialità",
    ),
    "agent_status_label": MessageLookupByLibrary.simpleMessage("Stato"),
    "agent_website_label": MessageLookupByLibrary.simpleMessage("Sito web"),
    "amenitiesSectionTitle": MessageLookupByLibrary.simpleMessage("Servizi"),
    "appTitle": MessageLookupByLibrary.simpleMessage("Menem"),
    "authSignIn": MessageLookupByLibrary.simpleMessage("Accedi con Google"),
    "authSignOut": MessageLookupByLibrary.simpleMessage("Esci"),
    "authWelcomeBack": m2,
    "chatBack": MessageLookupByLibrary.simpleMessage("Indietro"),
    "chatBackToList": MessageLookupByLibrary.simpleMessage("Torna all\'elenco"),
    "chatChattingWith": m3,
    "chatConnectWithUsers": MessageLookupByLibrary.simpleMessage(
      "Connettiti con gli utenti e ottieni supporto",
    ),
    "chatConnectionError": MessageLookupByLibrary.simpleMessage(
      "Connessione al server di chat non riuscita. Riprova.",
    ),
    "chatContactSupport": MessageLookupByLibrary.simpleMessage(
      "Contatta l\'assistenza",
    ),
    "chatError": MessageLookupByLibrary.simpleMessage("Errore"),
    "chatErrorMarkAsRead": MessageLookupByLibrary.simpleMessage(
      "Impossibile contrassegnare i messaggi come letti",
    ),
    "chatErrorSendMessage": MessageLookupByLibrary.simpleMessage(
      "Invio del messaggio non riuscito",
    ),
    "chatErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "Devi effettuare l\'accesso per eseguire questa azione",
    ),
    "chatMessageSendError": MessageLookupByLibrary.simpleMessage(
      "Invio del messaggio non riuscito. Riprova più tardi.",
    ),
    "chatMessages": MessageLookupByLibrary.simpleMessage("Messaggi"),
    "chatNewMessage": MessageLookupByLibrary.simpleMessage("Nuovo messaggio"),
    "chatSearchUsers": MessageLookupByLibrary.simpleMessage("Cerca utenti..."),
    "chatSend": MessageLookupByLibrary.simpleMessage("Invia"),
    "chatTypeMessage": MessageLookupByLibrary.simpleMessage(
      "Scrivi il tuo messaggio...",
    ),
    "chatWelcomeDescription": MessageLookupByLibrary.simpleMessage(
      "Inizia una conversazione con altri utenti o contatta l\'assistenza per aiuto",
    ),
    "chatWelcomeToChat": MessageLookupByLibrary.simpleMessage(
      "Benvenuto in Chat",
    ),
    "common_no": MessageLookupByLibrary.simpleMessage("No"),
    "common_not_available": MessageLookupByLibrary.simpleMessage(
      "Non disponibile",
    ),
    "common_save": MessageLookupByLibrary.simpleMessage("Salva"),
    "common_yes": MessageLookupByLibrary.simpleMessage("Sì"),
    "dashboard": MessageLookupByLibrary.simpleMessage("Cruscotto"),
    "defaultUser": MessageLookupByLibrary.simpleMessage("Utente predefinito"),
    "edit_agent_tooltip": MessageLookupByLibrary.simpleMessage(
      "Modifica agente",
    ),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage(
      "Ottieni indicazioni",
    ),
    "homeLabel": MessageLookupByLibrary.simpleMessage("Home"),
    "indexDescription": MessageLookupByLibrary.simpleMessage(
      "La tua soluzione per la gestione immobiliare",
    ),
    "indexPropertyManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Gestisci le tue proprietà in modo efficiente con la nostra suite completa di strumenti.",
    ),
    "indexPropertyManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Gestione della proprietà",
    ),
    "indexTitle": MessageLookupByLibrary.simpleMessage("Benvenuto in Menem"),
    "indexWaterManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Traccia e ottimizza l\'utilizzo dell\'acqua nelle tue proprietà.",
    ),
    "indexWaterManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Gestione dell\'acqua",
    ),
    "listings": MessageLookupByLibrary.simpleMessage("Le mie proprietà"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage("Posizione"),
    "loggingout": MessageLookupByLibrary.simpleMessage("Uscita in corso..."),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("Esci"),
    "manageProperties": MessageLookupByLibrary.simpleMessage(
      "Gestisci le tue proprietà in modo efficace",
    ),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage(
      "Consegnato",
    ),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("Letto"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("Inviato"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("Messaggi"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage(
      "Flusso di cassa mensile",
    ),
    "nav_analytics": MessageLookupByLibrary.simpleMessage("Analisi"),
    "nav_expenses": MessageLookupByLibrary.simpleMessage("Spese"),
    "nav_facilities": MessageLookupByLibrary.simpleMessage("Servizi"),
    "nav_help": MessageLookupByLibrary.simpleMessage("Aiuto"),
    "nav_helpdesk": MessageLookupByLibrary.simpleMessage("Centro assistenza"),
    "nav_home": MessageLookupByLibrary.simpleMessage("Home"),
    "nav_logout": MessageLookupByLibrary.simpleMessage("Esci"),
    "nav_messages": MessageLookupByLibrary.simpleMessage("Messaggi"),
    "nav_notifications": MessageLookupByLibrary.simpleMessage("Notifiche"),
    "nav_payments": MessageLookupByLibrary.simpleMessage("Pagamenti"),
    "nav_profile": MessageLookupByLibrary.simpleMessage("Profilo"),
    "nav_properties": MessageLookupByLibrary.simpleMessage("Proprietà"),
    "nav_settings": MessageLookupByLibrary.simpleMessage("Impostazioni"),
    "nav_subscription": MessageLookupByLibrary.simpleMessage("Abbonamento"),
    "nav_tasks": MessageLookupByLibrary.simpleMessage("Compiti"),
    "nav_tenants": MessageLookupByLibrary.simpleMessage("Inquilini"),
    "nav_viewAll": MessageLookupByLibrary.simpleMessage("Visualizza tutto"),
    "newTenants": m5,
    "noAmenitiesListed": MessageLookupByLibrary.simpleMessage(
      "Nessun servizio elencato",
    ),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage("Notifiche"),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage(
      "Nessuna notifica ancora",
    ),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("Pagamenti"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("Pagamenti"),
    "pendingPayments": m7,
    "pendingTasks": MessageLookupByLibrary.simpleMessage("Compiti in sospeso"),
    "postsCancel": MessageLookupByLibrary.simpleMessage("Annulla"),
    "postsContent": MessageLookupByLibrary.simpleMessage("Contenuto"),
    "postsCreate": MessageLookupByLibrary.simpleMessage("Crea post"),
    "postsDelete": MessageLookupByLibrary.simpleMessage("Elimina"),
    "postsEdit": MessageLookupByLibrary.simpleMessage("Modifica"),
    "postsErrorCreatePost": MessageLookupByLibrary.simpleMessage(
      "Creazione del post non riuscita",
    ),
    "postsErrorDeletePost": MessageLookupByLibrary.simpleMessage(
      "Eliminazione del post non riuscita",
    ),
    "postsErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "Devi effettuare l\'accesso per eseguire questa azione",
    ),
    "postsErrorUpdatePost": MessageLookupByLibrary.simpleMessage(
      "Aggiornamento del post non riuscito",
    ),
    "postsLoading": MessageLookupByLibrary.simpleMessage("Caricamento post..."),
    "postsNoPostsYet": MessageLookupByLibrary.simpleMessage(
      "Nessun post ancora",
    ),
    "postsSave": MessageLookupByLibrary.simpleMessage("Salva"),
    "postsTitle": MessageLookupByLibrary.simpleMessage("Titolo"),
    "profileLabel": MessageLookupByLibrary.simpleMessage("Profilo"),
    "properties": MessageLookupByLibrary.simpleMessage("Proprietà"),
    "quickAccess": MessageLookupByLibrary.simpleMessage("Accesso rapido"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("Impostazioni"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("RentalProc"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage(
      "Statistiche di riepilogo",
    ),
    "tasks": MessageLookupByLibrary.simpleMessage("Compiti"),
    "tasksThisWeek": m9,
    "tenants": MessageLookupByLibrary.simpleMessage("Inquilini"),
    "totalProperties": MessageLookupByLibrary.simpleMessage("Proprietà totali"),
    "totalTenants": MessageLookupByLibrary.simpleMessage("Totale inquilini"),
    "unknownTime": MessageLookupByLibrary.simpleMessage("Ora sconosciuta"),
  };
}
