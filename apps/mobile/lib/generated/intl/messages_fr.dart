// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a fr locale. All the
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
  String get localeName => 'fr';

  static String m0(count) =>
      "${Intl.plural(count, zero: 'No accounts found', one: '1 account found', other: '${count} accounts found')}";

  static String m2(name) => "Welcome back, ${name}";

  static String m3(name) => "Chatting with ${name}";

  static String m5(count) => "Nouveaux locataires : ${count}";

  static String m6(rate) => "Taux d\'occupation : ${rate}";

  static String m7(count) => "Paiements en attente : ${count}";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountsFound": m0,
    "agent_activity_title": MessageLookupByLibrary.simpleMessage(
      "Recent Activity",
    ),
    "agent_address_label": MessageLookupByLibrary.simpleMessage("Address"),
    "agent_agency_label": MessageLookupByLibrary.simpleMessage("Agency"),
    "agent_contact_information_title": MessageLookupByLibrary.simpleMessage(
      "Contact Information",
    ),
    "agent_created_at_label": MessageLookupByLibrary.simpleMessage(
      "Created At",
    ),
    "agent_email_label": MessageLookupByLibrary.simpleMessage("Email"),
    "agent_is_active_label": MessageLookupByLibrary.simpleMessage("Is Active"),
    "agent_last_active_label": MessageLookupByLibrary.simpleMessage(
      "Last Active",
    ),
    "agent_phone_label": MessageLookupByLibrary.simpleMessage("Phone"),
    "agent_professional_information_title":
        MessageLookupByLibrary.simpleMessage("Professional Information"),
    "agent_specialities_label": MessageLookupByLibrary.simpleMessage(
      "Specialities",
    ),
    "agent_status_label": MessageLookupByLibrary.simpleMessage("Status"),
    "agent_website_label": MessageLookupByLibrary.simpleMessage("Website"),
    "amenitiesSectionTitle": MessageLookupByLibrary.simpleMessage("Amenities"),
    "appTitle": MessageLookupByLibrary.simpleMessage("Menem"),
    "authSignIn": MessageLookupByLibrary.simpleMessage("Sign in with Google"),
    "authSignOut": MessageLookupByLibrary.simpleMessage("Sign out"),
    "authWelcomeBack": m2,
    "chatBack": MessageLookupByLibrary.simpleMessage("Back"),
    "chatBackToList": MessageLookupByLibrary.simpleMessage("Back to List"),
    "chatChattingWith": m3,
    "chatConnectWithUsers": MessageLookupByLibrary.simpleMessage(
      "Connect with users and get support",
    ),
    "chatConnectionError": MessageLookupByLibrary.simpleMessage(
      "Failed to connect to chat server. Please try again.",
    ),
    "chatContactSupport": MessageLookupByLibrary.simpleMessage(
      "Contact Support",
    ),
    "chatError": MessageLookupByLibrary.simpleMessage("Error"),
    "chatErrorMarkAsRead": MessageLookupByLibrary.simpleMessage(
      "Failed to mark messages as read",
    ),
    "chatErrorSendMessage": MessageLookupByLibrary.simpleMessage(
      "Failed to send message",
    ),
    "chatErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "You must be logged in to perform this action",
    ),
    "chatMessageSendError": MessageLookupByLibrary.simpleMessage(
      "Failed to send your message. Please try again later.",
    ),
    "chatMessages": MessageLookupByLibrary.simpleMessage("Messages"),
    "chatNewMessage": MessageLookupByLibrary.simpleMessage("New Message"),
    "chatSearchUsers": MessageLookupByLibrary.simpleMessage("Search users..."),
    "chatSend": MessageLookupByLibrary.simpleMessage("Send"),
    "chatTypeMessage": MessageLookupByLibrary.simpleMessage(
      "Type your message...",
    ),
    "chatWelcomeDescription": MessageLookupByLibrary.simpleMessage(
      "Start a conversation with other users or contact support for assistance",
    ),
    "chatWelcomeToChat": MessageLookupByLibrary.simpleMessage(
      "Welcome to Chat",
    ),
    "common_no": MessageLookupByLibrary.simpleMessage("No"),
    "common_not_available": MessageLookupByLibrary.simpleMessage(
      "Not available",
    ),
    "common_save": MessageLookupByLibrary.simpleMessage("Save"),
    "common_yes": MessageLookupByLibrary.simpleMessage("Yes"),
    "dashboard": MessageLookupByLibrary.simpleMessage("Dashboard"),
    "defaultUser": MessageLookupByLibrary.simpleMessage("Default User"),
    "edit_agent_tooltip": MessageLookupByLibrary.simpleMessage("Edit Agent"),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage(
      "Get Directions",
    ),
    "homeLabel": MessageLookupByLibrary.simpleMessage("Home"),
    "indexDescription": MessageLookupByLibrary.simpleMessage(
      "Your property management solution",
    ),
    "indexPropertyManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Manage your properties efficiently with our comprehensive suite of tools.",
    ),
    "indexPropertyManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Property Management",
    ),
    "indexTitle": MessageLookupByLibrary.simpleMessage("Welcome to Menem"),
    "indexWaterManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Track and optimize water usage across your properties.",
    ),
    "indexWaterManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Water Management",
    ),
    "listings": MessageLookupByLibrary.simpleMessage("My Properties"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage("Location"),
    "loggingout": MessageLookupByLibrary.simpleMessage("Logging out..."),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("Logout"),
    "manageProperties": MessageLookupByLibrary.simpleMessage(
      "Gérez vos propriétés efficacement",
    ),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage("Delivered"),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("Read"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("Sent"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("Messages"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage(
      "Flux de trésorerie mensuel",
    ),
    "nav_analytics": MessageLookupByLibrary.simpleMessage("Analytics"),
    "nav_expenses": MessageLookupByLibrary.simpleMessage("Expenses"),
    "nav_facilities": MessageLookupByLibrary.simpleMessage("Facilities"),
    "nav_help": MessageLookupByLibrary.simpleMessage("Help"),
    "nav_helpdesk": MessageLookupByLibrary.simpleMessage("Help Desk"),
    "nav_home": MessageLookupByLibrary.simpleMessage("Home"),
    "nav_logout": MessageLookupByLibrary.simpleMessage("Logout"),
    "nav_messages": MessageLookupByLibrary.simpleMessage("Messages"),
    "nav_notifications": MessageLookupByLibrary.simpleMessage("Notifications"),
    "nav_payments": MessageLookupByLibrary.simpleMessage("Payments"),
    "nav_profile": MessageLookupByLibrary.simpleMessage("Profile"),
    "nav_properties": MessageLookupByLibrary.simpleMessage("Properties"),
    "nav_settings": MessageLookupByLibrary.simpleMessage("Settings"),
    "nav_subscription": MessageLookupByLibrary.simpleMessage("Subscription"),
    "nav_tasks": MessageLookupByLibrary.simpleMessage("Tasks"),
    "nav_tenants": MessageLookupByLibrary.simpleMessage("Tenants"),
    "nav_viewAll": MessageLookupByLibrary.simpleMessage("View All"),
    "newTenants": m5,
    "noAmenitiesListed": MessageLookupByLibrary.simpleMessage(
      "No amenities listed",
    ),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage("Notifications"),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage(
      "No notifications yet",
    ),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("Paiements"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("Payments"),
    "pendingPayments": m7,
    "postsCancel": MessageLookupByLibrary.simpleMessage("Cancel"),
    "postsContent": MessageLookupByLibrary.simpleMessage("Content"),
    "postsCreate": MessageLookupByLibrary.simpleMessage("Create Post"),
    "postsDelete": MessageLookupByLibrary.simpleMessage("Delete"),
    "postsEdit": MessageLookupByLibrary.simpleMessage("Edit"),
    "postsErrorCreatePost": MessageLookupByLibrary.simpleMessage(
      "Failed to create post",
    ),
    "postsErrorDeletePost": MessageLookupByLibrary.simpleMessage(
      "Failed to delete post",
    ),
    "postsErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "You must be logged in to perform this action",
    ),
    "postsErrorUpdatePost": MessageLookupByLibrary.simpleMessage(
      "Failed to update post",
    ),
    "postsLoading": MessageLookupByLibrary.simpleMessage("Loading posts..."),
    "postsNoPostsYet": MessageLookupByLibrary.simpleMessage("No posts yet"),
    "postsSave": MessageLookupByLibrary.simpleMessage("Save"),
    "postsTitle": MessageLookupByLibrary.simpleMessage("Title"),
    "profileLabel": MessageLookupByLibrary.simpleMessage("Profile"),
    "properties": MessageLookupByLibrary.simpleMessage("Properties"),
    "quickAccess": MessageLookupByLibrary.simpleMessage("Quick Access"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("Settings"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("RentalProc"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage(
      "Statistiques de synthèse",
    ),
    "tasks": MessageLookupByLibrary.simpleMessage("Tâches"),
    "tenants": MessageLookupByLibrary.simpleMessage("Locataires"),
    "totalProperties": MessageLookupByLibrary.simpleMessage(
      "Nombre total de propriétés",
    ),
    "totalTenants": MessageLookupByLibrary.simpleMessage(
      "Nombre total de locataires",
    ),
    "unknownTime": MessageLookupByLibrary.simpleMessage("Unknown time"),
  };
}
