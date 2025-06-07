// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a en locale. All the
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
  String get localeName => 'en';

  static String m0(count) =>
      "${Intl.plural(count, zero: 'No accounts found', one: '1 account found', other: '${count} accounts found')}";

  static String m1(name) =>
      "Are you sure you want to delete ${name}? This action cannot be undone.";

  static String m2(name) => "Welcome back, ${name}";

  static String m3(name) => "Chatting with ${name}";

  static String m4(time) => "${time} ago";

  static String m5(count) => "New Tenants: ${count}";

  static String m6(rate) => "Occupancy Rate: ${rate}";

  static String m7(count) => "Pending Payments: ${count}";

  static String m11(count) => "${count} properties found";

  static String m8(error) => "Failed to delete property: ${error}";

  static String m9(count) => "${count} this week";

  static String m10(tenant) =>
      "Are you sure you want to delete the tenant ${tenant}? This action cannot be undone.";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountFilter_type_BANK": MessageLookupByLibrary.simpleMessage(
      "Bank Account",
    ),
    "accountFilter_type_CREDIT_CARD": MessageLookupByLibrary.simpleMessage(
      "Credit Card",
    ),
    "accountFilter_type_INVESTMENT": MessageLookupByLibrary.simpleMessage(
      "Investment Account",
    ),
    "accountFilter_type_LOAN": MessageLookupByLibrary.simpleMessage(
      "Loan Account",
    ),
    "accountFilter_type_OTHER": MessageLookupByLibrary.simpleMessage(
      "Other Account",
    ),
    "accountFilter_type_SAVINGS": MessageLookupByLibrary.simpleMessage(
      "Savings Account",
    ),
    "accountFilter_type_credentials": MessageLookupByLibrary.simpleMessage(
      "Credentials",
    ),
    "accountFilter_type_email": MessageLookupByLibrary.simpleMessage("Email"),
    "accountFilter_type_facebook": MessageLookupByLibrary.simpleMessage(
      "Facebook",
    ),
    "accountFilter_type_google": MessageLookupByLibrary.simpleMessage("Google"),
    "accountFilter_type_oauth": MessageLookupByLibrary.simpleMessage("OAuth"),
    "accountFilter_type_oidc": MessageLookupByLibrary.simpleMessage("OIDC"),
    "accountStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "accountType": MessageLookupByLibrary.simpleMessage("Type"),
    "account_id": MessageLookupByLibrary.simpleMessage("Account ID"),
    "account_provider": MessageLookupByLibrary.simpleMessage("Provider"),
    "account_type": MessageLookupByLibrary.simpleMessage("Type"),
    "accountsFound": m0,
    "actionCardAddProperty": MessageLookupByLibrary.simpleMessage(
      "Add Property",
    ),
    "actionCardAddTask": MessageLookupByLibrary.simpleMessage("Add Task"),
    "actionCardAddTenant": MessageLookupByLibrary.simpleMessage("Add Tenant"),
    "actionCardAnalytics": MessageLookupByLibrary.simpleMessage("Analytics"),
    "actionCardCommunicateWithTenants": MessageLookupByLibrary.simpleMessage(
      "Communicate with tenants",
    ),
    "actionCardComposeMessage": MessageLookupByLibrary.simpleMessage(
      "Compose Message",
    ),
    "actionCardCreateAMaintenanceTask": MessageLookupByLibrary.simpleMessage(
      "Create a maintenance task",
    ),
    "actionCardCreateANewPropertyListing": MessageLookupByLibrary.simpleMessage(
      "Create a new property listing",
    ),
    "actionCardCreateAPropertyEvent": MessageLookupByLibrary.simpleMessage(
      "Create a property event",
    ),
    "actionCardCreateDocument": MessageLookupByLibrary.simpleMessage(
      "Create Document",
    ),
    "actionCardGenerateANewDocument": MessageLookupByLibrary.simpleMessage(
      "Generate a new document",
    ),
    "actionCardGetAssistanceWhenNeeded": MessageLookupByLibrary.simpleMessage(
      "Get assistance when needed",
    ),
    "actionCardGetStarted": MessageLookupByLibrary.simpleMessage("Get Started"),
    "actionCardHelpDesk": MessageLookupByLibrary.simpleMessage("Help Desk"),
    "actionCardManageMaintenanceTasks": MessageLookupByLibrary.simpleMessage(
      "Manage maintenance tasks",
    ),
    "actionCardManageTenantInformation": MessageLookupByLibrary.simpleMessage(
      "Manage tenant information",
    ),
    "actionCardManageYourPropertyPortfolio":
        MessageLookupByLibrary.simpleMessage("Manage your property portfolio"),
    "actionCardMessages": MessageLookupByLibrary.simpleMessage("Messages"),
    "actionCardNewThisMonth": MessageLookupByLibrary.simpleMessage(
      "New This Month",
    ),
    "actionCardPayments": MessageLookupByLibrary.simpleMessage("Payments"),
    "actionCardProperties": MessageLookupByLibrary.simpleMessage("Properties"),
    "actionCardRecordARentPayment": MessageLookupByLibrary.simpleMessage(
      "Record a rent payment",
    ),
    "actionCardRecordPayment": MessageLookupByLibrary.simpleMessage(
      "Record Payment",
    ),
    "actionCardRegisterANewTenant": MessageLookupByLibrary.simpleMessage(
      "Register a new tenant",
    ),
    "actionCardScheduleEvent": MessageLookupByLibrary.simpleMessage(
      "Schedule Event",
    ),
    "actionCardSendAMessageToTenants": MessageLookupByLibrary.simpleMessage(
      "Send a message to tenants",
    ),
    "actionCardTasks": MessageLookupByLibrary.simpleMessage("Tasks"),
    "actionCardTenants": MessageLookupByLibrary.simpleMessage("Tenants"),
    "actionCardTrackFinancialRecords": MessageLookupByLibrary.simpleMessage(
      "Track financial records",
    ),
    "actionCardViewReportsAndAnalytics": MessageLookupByLibrary.simpleMessage(
      "View reports and analytics",
    ),
    "adminAgencies": MessageLookupByLibrary.simpleMessage("Agencies"),
    "adminAgents": MessageLookupByLibrary.simpleMessage("Agents"),
    "adminAnalytics": MessageLookupByLibrary.simpleMessage("Analytics"),
    "adminDashboard": MessageLookupByLibrary.simpleMessage("Dashboard"),
    "adminMessages": MessageLookupByLibrary.simpleMessage("Messages"),
    "adminNotifications": MessageLookupByLibrary.simpleMessage("Notifications"),
    "adminOwners": MessageLookupByLibrary.simpleMessage("Owners"),
    "adminProperties": MessageLookupByLibrary.simpleMessage("Properties"),
    "adminReports": MessageLookupByLibrary.simpleMessage("Reports"),
    "adminSettings": MessageLookupByLibrary.simpleMessage("Settings"),
    "adminTenants": MessageLookupByLibrary.simpleMessage("Tenants"),
    "agenciesActions": MessageLookupByLibrary.simpleMessage("Actions"),
    "agenciesAdd": MessageLookupByLibrary.simpleMessage("Add Agency"),
    "agenciesAddress": MessageLookupByLibrary.simpleMessage("Address"),
    "agenciesAgents": MessageLookupByLibrary.simpleMessage("Agents"),
    "agenciesCancel": MessageLookupByLibrary.simpleMessage("Cancel"),
    "agenciesConfirmDeleteDesc": m1,
    "agenciesCreate": MessageLookupByLibrary.simpleMessage("Create"),
    "agenciesCreated": MessageLookupByLibrary.simpleMessage("Created"),
    "agenciesCreatedMsg": MessageLookupByLibrary.simpleMessage("Created!"),
    "agenciesCreating": MessageLookupByLibrary.simpleMessage("Creating..."),
    "agenciesDelete": MessageLookupByLibrary.simpleMessage("Delete"),
    "agenciesDeletedMsg": MessageLookupByLibrary.simpleMessage(
      "Agency deleted successfully.",
    ),
    "agenciesDeleting": MessageLookupByLibrary.simpleMessage("Deleting..."),
    "agenciesDescription": MessageLookupByLibrary.simpleMessage(
      "Manage your agencies and their settings.",
    ),
    "agenciesEdit": MessageLookupByLibrary.simpleMessage("Edit"),
    "agenciesEmail": MessageLookupByLibrary.simpleMessage("Email"),
    "agenciesErrorCreate": MessageLookupByLibrary.simpleMessage(
      "Failed to create.",
    ),
    "agenciesErrorDelete": MessageLookupByLibrary.simpleMessage(
      "Failed to delete.",
    ),
    "agenciesErrorLoad": MessageLookupByLibrary.simpleMessage(
      "Failed to load details.",
    ),
    "agenciesErrorUpdate": MessageLookupByLibrary.simpleMessage(
      "Failed to update.",
    ),
    "agenciesGetStarted": MessageLookupByLibrary.simpleMessage(
      "Get started by adding a new agency",
    ),
    "agenciesInvalidEmail": MessageLookupByLibrary.simpleMessage(
      "Invalid email address.",
    ),
    "agenciesInvalidUrl": MessageLookupByLibrary.simpleMessage("Invalid URL."),
    "agenciesLogoUrl": MessageLookupByLibrary.simpleMessage("Logo URL"),
    "agenciesNa": MessageLookupByLibrary.simpleMessage("N/A"),
    "agenciesName": MessageLookupByLibrary.simpleMessage("Agency Name"),
    "agenciesNone": MessageLookupByLibrary.simpleMessage(
      "No agencies match your search. Try different filters.",
    ),
    "agenciesPhoneNumber": MessageLookupByLibrary.simpleMessage("Phone Number"),
    "agenciesProperties": MessageLookupByLibrary.simpleMessage("Properties"),
    "agenciesRequired": MessageLookupByLibrary.simpleMessage(
      "This field is required.",
    ),
    "agenciesSave": MessageLookupByLibrary.simpleMessage("Save"),
    "agenciesSaving": MessageLookupByLibrary.simpleMessage("Saving..."),
    "agenciesSearch": MessageLookupByLibrary.simpleMessage(
      "Search agencies...",
    ),
    "agenciesStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "agenciesStatusValuesPending": MessageLookupByLibrary.simpleMessage(
      "Pending",
    ),
    "agenciesStatusValuesRejected": MessageLookupByLibrary.simpleMessage(
      "Rejected",
    ),
    "agenciesStatusValuesVerified": MessageLookupByLibrary.simpleMessage(
      "Verified",
    ),
    "agenciesTitle": MessageLookupByLibrary.simpleMessage("Agencies"),
    "agenciesUpdated": MessageLookupByLibrary.simpleMessage("Updated"),
    "agenciesUpdatedMsg": MessageLookupByLibrary.simpleMessage("Updated!"),
    "agenciesView": MessageLookupByLibrary.simpleMessage("View"),
    "agenciesWebsite": MessageLookupByLibrary.simpleMessage("Website"),
    "agentActivityTitle": MessageLookupByLibrary.simpleMessage(
      "Recent Activity",
    ),
    "agentAdditionalInformationTitle": MessageLookupByLibrary.simpleMessage(
      "Additional Information",
    ),
    "agentAddressLabel": MessageLookupByLibrary.simpleMessage("Address"),
    "agentAgencyIdLabel": MessageLookupByLibrary.simpleMessage("Agency ID"),
    "agentAgencyLabel": MessageLookupByLibrary.simpleMessage("Agency"),
    "agentBioLabel": MessageLookupByLibrary.simpleMessage("Bio"),
    "agentContactInformationTitle": MessageLookupByLibrary.simpleMessage(
      "Contact Information",
    ),
    "agentCreatedAtLabel": MessageLookupByLibrary.simpleMessage("Created At"),
    "agentDeletedAtLabel": MessageLookupByLibrary.simpleMessage("Deleted At"),
    "agentEmailLabel": MessageLookupByLibrary.simpleMessage("Email"),
    "agentExternalIdLabel": MessageLookupByLibrary.simpleMessage("External ID"),
    "agentIntegrationLabel": MessageLookupByLibrary.simpleMessage(
      "Integration",
    ),
    "agentIsActiveLabel": MessageLookupByLibrary.simpleMessage("Is Active"),
    "agentLastActiveLabel": MessageLookupByLibrary.simpleMessage("Last Active"),
    "agentOwnerIdLabel": MessageLookupByLibrary.simpleMessage("Owner ID"),
    "agentPhoneLabel": MessageLookupByLibrary.simpleMessage("Phone"),
    "agentProfessionalInformationTitle": MessageLookupByLibrary.simpleMessage(
      "Professional Information",
    ),
    "agentSettingsLabel": MessageLookupByLibrary.simpleMessage("Settings"),
    "agentSpecialitiesLabel": MessageLookupByLibrary.simpleMessage(
      "Specialities",
    ),
    "agentStatusLabel": MessageLookupByLibrary.simpleMessage("Status"),
    "agentWebsiteLabel": MessageLookupByLibrary.simpleMessage("Website"),
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
    "authErrorBackToLogin": MessageLookupByLibrary.simpleMessage(
      "Back to Login",
    ),
    "authErrorOauthAccountNotLinked": MessageLookupByLibrary.simpleMessage(
      "An account with this email already exists. Please sign in with the original authentication method.",
    ),
    "authErrorOauthCallbackError": MessageLookupByLibrary.simpleMessage(
      "An error occurred during the OAuth callback process.",
    ),
    "authErrorOauthCreateAccountError": MessageLookupByLibrary.simpleMessage(
      "Failed to create a new account. Please try again.",
    ),
    "authErrorOauthSignInError": MessageLookupByLibrary.simpleMessage(
      "Error signing in with the selected provider. Please try again.",
    ),
    "authErrorSomethingWentWrong": MessageLookupByLibrary.simpleMessage(
      "Something went wrong during authentication. Please try again.",
    ),
    "authErrorTitle": MessageLookupByLibrary.simpleMessage(
      "Authentication Error",
    ),
    "authSignIn": MessageLookupByLibrary.simpleMessage("Sign in with Google"),
    "authSignOut": MessageLookupByLibrary.simpleMessage("Sign out"),
    "authWelcomeBack": m2,
    "availability_available_units": MessageLookupByLibrary.simpleMessage(
      "Available Units",
    ),
    "availability_base_price": MessageLookupByLibrary.simpleMessage(
      "Base Price",
    ),
    "availability_blocked": MessageLookupByLibrary.simpleMessage("Blocked"),
    "availability_blocked_units": MessageLookupByLibrary.simpleMessage(
      "Blocked Units",
    ),
    "availability_booked": MessageLookupByLibrary.simpleMessage("Booked"),
    "availability_booked_units": MessageLookupByLibrary.simpleMessage(
      "Booked Units",
    ),
    "availability_current_price": MessageLookupByLibrary.simpleMessage(
      "Current Price",
    ),
    "availability_date": MessageLookupByLibrary.simpleMessage("Date"),
    "availability_discount_settings_json": MessageLookupByLibrary.simpleMessage(
      "Discount Settings (JSON)",
    ),
    "availability_edit_title": MessageLookupByLibrary.simpleMessage(
      "Edit Availability",
    ),
    "availability_max_guests": MessageLookupByLibrary.simpleMessage(
      "Maximum Guests",
    ),
    "availability_max_nights": MessageLookupByLibrary.simpleMessage(
      "Maximum Nights",
    ),
    "availability_min_nights": MessageLookupByLibrary.simpleMessage(
      "Minimum Nights",
    ),
    "availability_not_set": MessageLookupByLibrary.simpleMessage("Not set"),
    "availability_price_settings_json": MessageLookupByLibrary.simpleMessage(
      "Price Settings (JSON)",
    ),
    "availability_pricing_rule_id": MessageLookupByLibrary.simpleMessage(
      "Pricing Rule ID",
    ),
    "availability_property_id": MessageLookupByLibrary.simpleMessage(
      "Property ID",
    ),
    "availability_reservation_id": MessageLookupByLibrary.simpleMessage(
      "Reservation ID",
    ),
    "availability_seasonal_multiplier": MessageLookupByLibrary.simpleMessage(
      "Seasonal Multiplier",
    ),
    "availability_special_pricing_json": MessageLookupByLibrary.simpleMessage(
      "Special Pricing (JSON)",
    ),
    "availability_total_units": MessageLookupByLibrary.simpleMessage(
      "Total Units",
    ),
    "availability_weekday_multiplier": MessageLookupByLibrary.simpleMessage(
      "Weekday Multiplier",
    ),
    "availability_weekday_rate": MessageLookupByLibrary.simpleMessage(
      "Weekday Rate",
    ),
    "availability_weekend_multiplier": MessageLookupByLibrary.simpleMessage(
      "Weekend Multiplier",
    ),
    "availability_weekend_rate": MessageLookupByLibrary.simpleMessage(
      "Weekend Rate",
    ),
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
    "commonActions": MessageLookupByLibrary.simpleMessage("Actions"),
    "commonBack": MessageLookupByLibrary.simpleMessage("Back"),
    "commonCancel": MessageLookupByLibrary.simpleMessage("Cancel"),
    "commonConfirm": MessageLookupByLibrary.simpleMessage("Confirm"),
    "commonCreate": MessageLookupByLibrary.simpleMessage("Create"),
    "commonDelete": MessageLookupByLibrary.simpleMessage("Delete"),
    "commonEdit": MessageLookupByLibrary.simpleMessage("Edit"),
    "commonError": MessageLookupByLibrary.simpleMessage("Error"),
    "commonFilter": MessageLookupByLibrary.simpleMessage("Filter"),
    "commonInfo": MessageLookupByLibrary.simpleMessage("Information"),
    "commonLoading": MessageLookupByLibrary.simpleMessage("Loading..."),
    "commonNext": MessageLookupByLibrary.simpleMessage("Next"),
    "commonNo": MessageLookupByLibrary.simpleMessage("No"),
    "commonNoData": MessageLookupByLibrary.simpleMessage("No data available"),
    "commonNotAvailable": MessageLookupByLibrary.simpleMessage("Not available"),
    "commonPrevious": MessageLookupByLibrary.simpleMessage("Previous"),
    "commonSave": MessageLookupByLibrary.simpleMessage("Save"),
    "commonSearch": MessageLookupByLibrary.simpleMessage("Search"),
    "commonSort": MessageLookupByLibrary.simpleMessage("Sort"),
    "commonSuccess": MessageLookupByLibrary.simpleMessage("Success"),
    "commonTimeAgo": m4,
    "commonView": MessageLookupByLibrary.simpleMessage("View"),
    "commonWarning": MessageLookupByLibrary.simpleMessage("Warning"),
    "commonYes": MessageLookupByLibrary.simpleMessage("Yes"),
    "common_no": MessageLookupByLibrary.simpleMessage("No"),
    "common_not_available": MessageLookupByLibrary.simpleMessage(
      "Not available",
    ),
    "common_save": MessageLookupByLibrary.simpleMessage("Save"),
    "common_yes": MessageLookupByLibrary.simpleMessage("Yes"),
    "complianceRecordCustomFields": MessageLookupByLibrary.simpleMessage(
      "Custom Fields",
    ),
    "complianceRecordDetailTitle": MessageLookupByLibrary.simpleMessage(
      "Compliance Record Details",
    ),
    "complianceRecordMetadata": MessageLookupByLibrary.simpleMessage(
      "Metadata",
    ),
    "complianceRecordStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "complianceRecordType": MessageLookupByLibrary.simpleMessage("Type"),
    "complianceStatusApproved": MessageLookupByLibrary.simpleMessage(
      "Approved",
    ),
    "complianceStatusExpired": MessageLookupByLibrary.simpleMessage("Expired"),
    "complianceStatusPending": MessageLookupByLibrary.simpleMessage("Pending"),
    "complianceStatusRejected": MessageLookupByLibrary.simpleMessage(
      "Rejected",
    ),
    "complianceTypeCertification": MessageLookupByLibrary.simpleMessage(
      "Certification",
    ),
    "complianceTypeInsurance": MessageLookupByLibrary.simpleMessage(
      "Insurance",
    ),
    "complianceTypeLicense": MessageLookupByLibrary.simpleMessage("License"),
    "complianceTypeOther": MessageLookupByLibrary.simpleMessage("Other"),
    "complianceTypePermit": MessageLookupByLibrary.simpleMessage("Permit"),
    "contractAgencyIdLabel": MessageLookupByLibrary.simpleMessage("Agency ID"),
    "contractCancelledAtLabel": MessageLookupByLibrary.simpleMessage(
      "Cancelled At",
    ),
    "contractCancelledByLabel": MessageLookupByLibrary.simpleMessage(
      "Cancelled By",
    ),
    "contractConditionsLabel": MessageLookupByLibrary.simpleMessage(
      "Conditions:",
    ),
    "contractCreatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Created At",
    ),
    "contractCurrencyLabel": MessageLookupByLibrary.simpleMessage("Currency"),
    "contractDeletedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Deleted At",
    ),
    "contractDescriptionLabel": MessageLookupByLibrary.simpleMessage(
      "Description",
    ),
    "contractDetailTitle": MessageLookupByLibrary.simpleMessage(
      "Contract Details",
    ),
    "contractEndDateLabel": MessageLookupByLibrary.simpleMessage("End Date"),
    "contractIdLabel": MessageLookupByLibrary.simpleMessage("ID"),
    "contractLandlordIdLabel": MessageLookupByLibrary.simpleMessage(
      "Landlord ID",
    ),
    "contractNameLabel": MessageLookupByLibrary.simpleMessage("Name"),
    "contractNoticePeriodLabel": MessageLookupByLibrary.simpleMessage(
      "Notice Period",
    ),
    "contractOwnerIdLabel": MessageLookupByLibrary.simpleMessage("Owner ID"),
    "contractPropertyIdLabel": MessageLookupByLibrary.simpleMessage(
      "Property ID",
    ),
    "contractRentAmountLabel": MessageLookupByLibrary.simpleMessage(
      "Rent Amount",
    ),
    "contractSignedAtLabel": MessageLookupByLibrary.simpleMessage("Signed At"),
    "contractSignedByLabel": MessageLookupByLibrary.simpleMessage("Signed By"),
    "contractStartDateLabel": MessageLookupByLibrary.simpleMessage(
      "Start Date",
    ),
    "contractStatusArchived": MessageLookupByLibrary.simpleMessage("Archived"),
    "contractStatusDraft": MessageLookupByLibrary.simpleMessage("Draft"),
    "contractStatusExpired": MessageLookupByLibrary.simpleMessage("Expired"),
    "contractStatusLabel": MessageLookupByLibrary.simpleMessage("Status"),
    "contractStatusPending": MessageLookupByLibrary.simpleMessage("Pending"),
    "contractStatusRenewed": MessageLookupByLibrary.simpleMessage("Renewed"),
    "contractStatusTerminated": MessageLookupByLibrary.simpleMessage(
      "Terminated",
    ),
    "contractTenantIdLabel": MessageLookupByLibrary.simpleMessage("Tenant ID"),
    "contractTerminatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Terminated At",
    ),
    "contractTerminatedByLabel": MessageLookupByLibrary.simpleMessage(
      "Terminated By",
    ),
    "contractTermsLabel": MessageLookupByLibrary.simpleMessage("Terms:"),
    "contractTypeCommission": MessageLookupByLibrary.simpleMessage(
      "Commission",
    ),
    "contractTypeLabel": MessageLookupByLibrary.simpleMessage("Type"),
    "contractTypeManagement": MessageLookupByLibrary.simpleMessage(
      "Management",
    ),
    "contractTypeRental": MessageLookupByLibrary.simpleMessage("Rental"),
    "contractTypeSale": MessageLookupByLibrary.simpleMessage("Sale"),
    "contractTypeService": MessageLookupByLibrary.simpleMessage("Service"),
    "contractUpdatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Updated At",
    ),
    "createPropertyTitle": MessageLookupByLibrary.simpleMessage(
      "Create New Property",
    ),
    "dashboard": MessageLookupByLibrary.simpleMessage("Dashboard"),
    "dateRangeSelectApply": MessageLookupByLibrary.simpleMessage("Apply"),
    "dateRangeSelectCancel": MessageLookupByLibrary.simpleMessage("Cancel"),
    "dateRangeSelectTitle": MessageLookupByLibrary.simpleMessage(
      "Select Date Range",
    ),
    "defaultUser": MessageLookupByLibrary.simpleMessage("Default User"),
    "editAgentTooltip": MessageLookupByLibrary.simpleMessage("Edit Agent"),
    "edit_agent_tooltip": MessageLookupByLibrary.simpleMessage("Edit Agent"),
    "emptyStateRetry": MessageLookupByLibrary.simpleMessage("Retry"),
    "errorScreenGoBack": MessageLookupByLibrary.simpleMessage("Go Back"),
    "errorScreenTitle": MessageLookupByLibrary.simpleMessage("Error"),
    "eventAttendees": MessageLookupByLibrary.simpleMessage("Attendees"),
    "eventDate": MessageLookupByLibrary.simpleMessage("Date"),
    "eventGallery": MessageLookupByLibrary.simpleMessage("Gallery"),
    "eventListTitle": MessageLookupByLibrary.simpleMessage("Events"),
    "eventProperty": MessageLookupByLibrary.simpleMessage("Property"),
    "eventStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "eventType": MessageLookupByLibrary.simpleMessage("Type"),
    "facilityDetailCreatedAt": MessageLookupByLibrary.simpleMessage(
      "Created At",
    ),
    "facilityDetailCreatedBy": MessageLookupByLibrary.simpleMessage(
      "Created By",
    ),
    "facilityDetailDeletedAt": MessageLookupByLibrary.simpleMessage(
      "Deleted At",
    ),
    "facilityDetailDescription": MessageLookupByLibrary.simpleMessage(
      "Description",
    ),
    "facilityDetailId": MessageLookupByLibrary.simpleMessage("ID"),
    "facilityDetailLocation": MessageLookupByLibrary.simpleMessage("Location"),
    "facilityDetailMetadata": MessageLookupByLibrary.simpleMessage("Metadata"),
    "facilityDetailName": MessageLookupByLibrary.simpleMessage("Name"),
    "facilityDetailPropertyId": MessageLookupByLibrary.simpleMessage(
      "Property ID",
    ),
    "facilityDetailStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "facilityDetailTitle": MessageLookupByLibrary.simpleMessage(
      "Facility Details",
    ),
    "facilityDetailType": MessageLookupByLibrary.simpleMessage("Type"),
    "facilityDetailUpdatedAt": MessageLookupByLibrary.simpleMessage(
      "Updated At",
    ),
    "facilityDetailUpdatedBy": MessageLookupByLibrary.simpleMessage(
      "Updated By",
    ),
    "facilityStatusAvailable": MessageLookupByLibrary.simpleMessage(
      "Available",
    ),
    "facilityStatusMaintenance": MessageLookupByLibrary.simpleMessage(
      "Maintenance",
    ),
    "facilityStatusUnavailable": MessageLookupByLibrary.simpleMessage(
      "Unavailable",
    ),
    "facilityTypeElevator": MessageLookupByLibrary.simpleMessage("Elevator"),
    "facilityTypeGym": MessageLookupByLibrary.simpleMessage("Gym"),
    "facilityTypeLaundry": MessageLookupByLibrary.simpleMessage("Laundry"),
    "facilityTypeOther": MessageLookupByLibrary.simpleMessage("Other"),
    "facilityTypeParkingLot": MessageLookupByLibrary.simpleMessage(
      "Parking Lot",
    ),
    "facilityTypePool": MessageLookupByLibrary.simpleMessage("Pool"),
    "facilityTypeSecurity": MessageLookupByLibrary.simpleMessage("Security"),
    "favoritesEmpty": MessageLookupByLibrary.simpleMessage("No favorites yet"),
    "favoritesError": MessageLookupByLibrary.simpleMessage(
      "Error loading favorites",
    ),
    "favoritesRetry": MessageLookupByLibrary.simpleMessage("Retry"),
    "filterPropertiesApply": MessageLookupByLibrary.simpleMessage("Apply"),
    "filterPropertiesCancel": MessageLookupByLibrary.simpleMessage("Cancel"),
    "filterPropertiesTitle": MessageLookupByLibrary.simpleMessage(
      "Filter Properties",
    ),
    "filterTasksApply": MessageLookupByLibrary.simpleMessage("Apply"),
    "filterTasksCancel": MessageLookupByLibrary.simpleMessage("Cancel"),
    "filterTasksDueDate": MessageLookupByLibrary.simpleMessage("Due Date"),
    "filterTasksPriority": MessageLookupByLibrary.simpleMessage("Priority"),
    "filterTasksStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "filterTasksTitle": MessageLookupByLibrary.simpleMessage("Filter Tasks"),
    "filterTasksType": MessageLookupByLibrary.simpleMessage("Type"),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage(
      "Get Directions",
    ),
    "guestPhoneNumber": MessageLookupByLibrary.simpleMessage("Phone Number"),
    "guestStatus": MessageLookupByLibrary.simpleMessage("Status"),
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
    "listingsEmpty": MessageLookupByLibrary.simpleMessage("No listings yet"),
    "listingsRetry": MessageLookupByLibrary.simpleMessage("Retry"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage("Location"),
    "loggingout": MessageLookupByLibrary.simpleMessage("Logging out..."),
    "loginPageDontHaveAccount": MessageLookupByLibrary.simpleMessage(
      "Don\'t have an account?",
    ),
    "loginPageEmail": MessageLookupByLibrary.simpleMessage("Email"),
    "loginPageErrorInvalidCredentials": MessageLookupByLibrary.simpleMessage(
      "Invalid email or password",
    ),
    "loginPageErrorSessionExpired": MessageLookupByLibrary.simpleMessage(
      "Your session has expired. Please sign in again.",
    ),
    "loginPageErrorSomethingWentWrong": MessageLookupByLibrary.simpleMessage(
      "Something went wrong. Please try again.",
    ),
    "loginPageForgotPassword": MessageLookupByLibrary.simpleMessage(
      "Forgot password?",
    ),
    "loginPageOrContinueWith": MessageLookupByLibrary.simpleMessage(
      "Or continue with",
    ),
    "loginPagePassword": MessageLookupByLibrary.simpleMessage("Password"),
    "loginPageRememberMe": MessageLookupByLibrary.simpleMessage("Remember me"),
    "loginPageSignIn": MessageLookupByLibrary.simpleMessage("Sign In"),
    "loginPageSignUp": MessageLookupByLibrary.simpleMessage("Sign up"),
    "loginPageTitle": MessageLookupByLibrary.simpleMessage("Sign In"),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("Logout"),
    "manageProperties": MessageLookupByLibrary.simpleMessage(
      "Manage your properties effectively",
    ),
    "mentionStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "mentionType": MessageLookupByLibrary.simpleMessage("Type"),
    "messageStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage("Delivered"),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("Read"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("Sent"),
    "messageType": MessageLookupByLibrary.simpleMessage("Type"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("Messages"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage("Monthly Cashflow"),
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
    "notificationStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "notificationType": MessageLookupByLibrary.simpleMessage("Type"),
    "notificationsEmpty": MessageLookupByLibrary.simpleMessage(
      "No notifications yet",
    ),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage("Notifications"),
    "notificationsPlaceholder": MessageLookupByLibrary.simpleMessage(
      "No notifications yet",
    ),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage(
      "No notifications yet",
    ),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("Payments"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("Payments"),
    "pendingPayments": m7,
    "pendingTasks": MessageLookupByLibrary.simpleMessage("Pending Tasks"),
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
    "pricingRuleConditions": MessageLookupByLibrary.simpleMessage("Conditions"),
    "pricingRuleCreatedAt": MessageLookupByLibrary.simpleMessage("Created At"),
    "pricingRuleDeletedAt": MessageLookupByLibrary.simpleMessage("Deleted At"),
    "pricingRuleFixedPrice": MessageLookupByLibrary.simpleMessage(
      "Fixed Price",
    ),
    "pricingRuleIsActive": MessageLookupByLibrary.simpleMessage("Is Active"),
    "pricingRuleMultiplier": MessageLookupByLibrary.simpleMessage("Multiplier"),
    "pricingRuleName": MessageLookupByLibrary.simpleMessage("Name"),
    "pricingRuleProperty": MessageLookupByLibrary.simpleMessage("Property"),
    "pricingRulePropertyId": MessageLookupByLibrary.simpleMessage(
      "Property ID",
    ),
    "pricingRuleStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "pricingRuleType": MessageLookupByLibrary.simpleMessage("Type"),
    "pricingRuleUpdatedAt": MessageLookupByLibrary.simpleMessage("Updated At"),
    "profileLabel": MessageLookupByLibrary.simpleMessage("Profile"),
    "properties": MessageLookupByLibrary.simpleMessage("Properties"),
    "propertiesFound": m11,
    "propertyAddProperty": MessageLookupByLibrary.simpleMessage("Add Property"),
    "propertyBackToProperties": MessageLookupByLibrary.simpleMessage(
      "Back to Properties",
    ),
    "propertyConfirmDeleteCancel": MessageLookupByLibrary.simpleMessage(
      "Cancel",
    ),
    "propertyConfirmDeleteConfirm": MessageLookupByLibrary.simpleMessage(
      "Confirm Delete",
    ),
    "propertyConfirmDeleteDescription": MessageLookupByLibrary.simpleMessage(
      "This action cannot be undone. All data associated with this property will be permanently removed.",
    ),
    "propertyConfirmDeleteTitle": MessageLookupByLibrary.simpleMessage(
      "Are you sure you want to delete this property?",
    ),
    "propertyCreateProperty": MessageLookupByLibrary.simpleMessage(
      "Create Property",
    ),
    "propertyCreatedError": MessageLookupByLibrary.simpleMessage(
      "Failed to create property",
    ),
    "propertyCreatedSuccess": MessageLookupByLibrary.simpleMessage(
      "Property created successfully",
    ),
    "propertyDebugInfo": MessageLookupByLibrary.simpleMessage("Debug info:"),
    "propertyDeleteProperty": MessageLookupByLibrary.simpleMessage(
      "Delete Property",
    ),
    "propertyDetailAddress": MessageLookupByLibrary.simpleMessage("Address"),
    "propertyDetailAmenities": MessageLookupByLibrary.simpleMessage(
      "Amenities",
    ),
    "propertyDetailBathrooms": MessageLookupByLibrary.simpleMessage(
      "Bathrooms",
    ),
    "propertyDetailBedrooms": MessageLookupByLibrary.simpleMessage("Bedrooms"),
    "propertyDetailCategory": MessageLookupByLibrary.simpleMessage("Category"),
    "propertyDetailCity": MessageLookupByLibrary.simpleMessage("City"),
    "propertyDetailCondition": MessageLookupByLibrary.simpleMessage(
      "Condition",
    ),
    "propertyDetailContactAgent": MessageLookupByLibrary.simpleMessage(
      "Contact Agent",
    ),
    "propertyDetailCoordinates": MessageLookupByLibrary.simpleMessage(
      "Coordinates",
    ),
    "propertyDetailCountry": MessageLookupByLibrary.simpleMessage("Country"),
    "propertyDetailDeleteConfirm": MessageLookupByLibrary.simpleMessage(
      "Are you sure you want to delete this property?",
    ),
    "propertyDetailDeleteFailed": m8,
    "propertyDetailDeleteSuccess": MessageLookupByLibrary.simpleMessage(
      "Property deleted successfully",
    ),
    "propertyDetailDescription": MessageLookupByLibrary.simpleMessage(
      "Description",
    ),
    "propertyDetailFeatures": MessageLookupByLibrary.simpleMessage("Features"),
    "propertyDetailFeaturesTab": MessageLookupByLibrary.simpleMessage(
      "Features",
    ),
    "propertyDetailGalleryPlaceholder": MessageLookupByLibrary.simpleMessage(
      "Gallery View (Implement with GridView of Images)",
    ),
    "propertyDetailGalleryTab": MessageLookupByLibrary.simpleMessage("Gallery"),
    "propertyDetailId": MessageLookupByLibrary.simpleMessage("ID"),
    "propertyDetailLoading": MessageLookupByLibrary.simpleMessage(
      "Loading property details...",
    ),
    "propertyDetailLocationTab": MessageLookupByLibrary.simpleMessage(
      "Location",
    ),
    "propertyDetailMarketValue": MessageLookupByLibrary.simpleMessage(
      "Market Value",
    ),
    "propertyDetailNoFeatures": MessageLookupByLibrary.simpleMessage(
      "No features or amenities available",
    ),
    "propertyDetailNoLocation": MessageLookupByLibrary.simpleMessage(
      "No location information available",
    ),
    "propertyDetailNotFound": MessageLookupByLibrary.simpleMessage(
      "Property not found.",
    ),
    "propertyDetailNumber": MessageLookupByLibrary.simpleMessage(
      "Property Number",
    ),
    "propertyDetailOverviewTab": MessageLookupByLibrary.simpleMessage(
      "Overview",
    ),
    "propertyDetailPrice": MessageLookupByLibrary.simpleMessage("Price"),
    "propertyDetailState": MessageLookupByLibrary.simpleMessage("State"),
    "propertyDetailStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "propertyDetailTitle": MessageLookupByLibrary.simpleMessage(
      "Property Details",
    ),
    "propertyDetailTitleField": MessageLookupByLibrary.simpleMessage("Title"),
    "propertyDetailType": MessageLookupByLibrary.simpleMessage("Type"),
    "propertyDetailYearBuilt": MessageLookupByLibrary.simpleMessage(
      "Year Built",
    ),
    "propertyDetailZipCode": MessageLookupByLibrary.simpleMessage("ZIP Code"),
    "propertyEditProperty": MessageLookupByLibrary.simpleMessage(
      "Edit Property",
    ),
    "propertyErrorCreate": MessageLookupByLibrary.simpleMessage(
      "Failed to create property",
    ),
    "propertyErrorDelete": MessageLookupByLibrary.simpleMessage(
      "Failed to delete property",
    ),
    "propertyErrorFetch": MessageLookupByLibrary.simpleMessage(
      "Failed to fetch property details",
    ),
    "propertyErrorUpdate": MessageLookupByLibrary.simpleMessage(
      "Failed to update property",
    ),
    "propertyFieldsAddress": MessageLookupByLibrary.simpleMessage("Address"),
    "propertyFieldsAgency": MessageLookupByLibrary.simpleMessage("Agency"),
    "propertyFieldsAgent": MessageLookupByLibrary.simpleMessage("Agent"),
    "propertyFieldsBathrooms": MessageLookupByLibrary.simpleMessage(
      "Bathrooms",
    ),
    "propertyFieldsBedrooms": MessageLookupByLibrary.simpleMessage("Bedrooms"),
    "propertyFieldsBuildingClass": MessageLookupByLibrary.simpleMessage(
      "Building Class",
    ),
    "propertyFieldsCategory": MessageLookupByLibrary.simpleMessage("Category"),
    "propertyFieldsCity": MessageLookupByLibrary.simpleMessage("City"),
    "propertyFieldsCondition": MessageLookupByLibrary.simpleMessage(
      "Condition",
    ),
    "propertyFieldsContactEmail": MessageLookupByLibrary.simpleMessage(
      "Contact Email",
    ),
    "propertyFieldsContactPhone": MessageLookupByLibrary.simpleMessage(
      "Contact Phone",
    ),
    "propertyFieldsCoordinates": MessageLookupByLibrary.simpleMessage(
      "Coordinates",
    ),
    "propertyFieldsCountry": MessageLookupByLibrary.simpleMessage("Country"),
    "propertyFieldsCreated": MessageLookupByLibrary.simpleMessage("Created"),
    "propertyFieldsDescription": MessageLookupByLibrary.simpleMessage(
      "Description",
    ),
    "propertyFieldsLatitude": MessageLookupByLibrary.simpleMessage("Latitude"),
    "propertyFieldsListed": MessageLookupByLibrary.simpleMessage("Listed"),
    "propertyFieldsLongitude": MessageLookupByLibrary.simpleMessage(
      "Longitude",
    ),
    "propertyFieldsOwner": MessageLookupByLibrary.simpleMessage("Owner"),
    "propertyFieldsPostalCode": MessageLookupByLibrary.simpleMessage(
      "Postal Code",
    ),
    "propertyFieldsPropertyType": MessageLookupByLibrary.simpleMessage(
      "Property Type",
    ),
    "propertyFieldsSize": MessageLookupByLibrary.simpleMessage("Size (m²)"),
    "propertyFieldsStateProvince": MessageLookupByLibrary.simpleMessage(
      "State/Province",
    ),
    "propertyFieldsStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "propertyFieldsTitle": MessageLookupByLibrary.simpleMessage("Title"),
    "propertyFieldsUpdated": MessageLookupByLibrary.simpleMessage("Updated"),
    "propertyFieldsYearBuilt": MessageLookupByLibrary.simpleMessage(
      "Year Built",
    ),
    "propertyLoading": MessageLookupByLibrary.simpleMessage(
      "Loading property...",
    ),
    "propertyNoAmenities": MessageLookupByLibrary.simpleMessage(
      "No amenities listed",
    ),
    "propertyNoCoordinates": MessageLookupByLibrary.simpleMessage(
      "No coordinates available",
    ),
    "propertyNoFeatures": MessageLookupByLibrary.simpleMessage(
      "No features listed",
    ),
    "propertyNotFound": MessageLookupByLibrary.simpleMessage(
      "Property not found.",
    ),
    "propertySectionsAmenities": MessageLookupByLibrary.simpleMessage(
      "Amenities",
    ),
    "propertySectionsBasicInfo": MessageLookupByLibrary.simpleMessage(
      "Basic Information",
    ),
    "propertySectionsContactInfo": MessageLookupByLibrary.simpleMessage(
      "Contact Information",
    ),
    "propertySectionsFeatures": MessageLookupByLibrary.simpleMessage(
      "Features",
    ),
    "propertySectionsLocationInfo": MessageLookupByLibrary.simpleMessage(
      "Location Information",
    ),
    "propertySectionsMetadata": MessageLookupByLibrary.simpleMessage(
      "Metadata",
    ),
    "propertySectionsPhysicalCharacteristics":
        MessageLookupByLibrary.simpleMessage("Physical Characteristics"),
    "propertySectionsRelatedEntities": MessageLookupByLibrary.simpleMessage(
      "Related Entities",
    ),
    "propertySuccessCreated": MessageLookupByLibrary.simpleMessage(
      "Property created successfully",
    ),
    "propertySuccessDeleted": MessageLookupByLibrary.simpleMessage(
      "Property deleted successfully",
    ),
    "propertySuccessUpdated": MessageLookupByLibrary.simpleMessage(
      "Property updated successfully",
    ),
    "propertyTabsAmenities": MessageLookupByLibrary.simpleMessage("Amenities"),
    "propertyTabsDocuments": MessageLookupByLibrary.simpleMessage("Documents"),
    "propertyTabsFeatures": MessageLookupByLibrary.simpleMessage("Features"),
    "propertyTabsHistory": MessageLookupByLibrary.simpleMessage("History"),
    "propertyTabsLocation": MessageLookupByLibrary.simpleMessage("Location"),
    "propertyTabsOverview": MessageLookupByLibrary.simpleMessage("Overview"),
    "propertyTitle": MessageLookupByLibrary.simpleMessage("Property Details"),
    "propertyViewingEventsTitle": MessageLookupByLibrary.simpleMessage(
      "Viewing Events",
    ),
    "propertyViewingSchedule": MessageLookupByLibrary.simpleMessage(
      "Schedule Viewing",
    ),
    "quickAccess": MessageLookupByLibrary.simpleMessage("Quick Access"),
    "registerAlreadyHaveAccount": MessageLookupByLibrary.simpleMessage(
      "Already have an account? Login",
    ),
    "registerForgotPassword": MessageLookupByLibrary.simpleMessage(
      "Forgot Password?",
    ),
    "reviewStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "reviewType": MessageLookupByLibrary.simpleMessage("Type"),
    "settingsAppearance": MessageLookupByLibrary.simpleMessage("Appearance"),
    "settingsDarkMode": MessageLookupByLibrary.simpleMessage("Dark Mode"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("Settings"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("RentalProc"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage(
      "Summary Statistics",
    ),
    "taskAssignedTo": MessageLookupByLibrary.simpleMessage("Assigned To"),
    "taskCreatedAt": MessageLookupByLibrary.simpleMessage("Created At"),
    "taskDeletedAt": MessageLookupByLibrary.simpleMessage("Deleted At"),
    "taskPriority": MessageLookupByLibrary.simpleMessage("Priority"),
    "taskStatus": MessageLookupByLibrary.simpleMessage("Status"),
    "taskType": MessageLookupByLibrary.simpleMessage("Type"),
    "taskUpdatedAt": MessageLookupByLibrary.simpleMessage("Updated At"),
    "tasks": MessageLookupByLibrary.simpleMessage("Tasks"),
    "tasksThisWeek": m9,
    "taxRecordAny": MessageLookupByLibrary.simpleMessage("Any"),
    "taxRecordPaid": MessageLookupByLibrary.simpleMessage("Paid"),
    "taxRecordUnpaid": MessageLookupByLibrary.simpleMessage("Unpaid"),
    "taxRecordsTitle": MessageLookupByLibrary.simpleMessage("Tax Records"),
    "tenants": MessageLookupByLibrary.simpleMessage("Tenants"),
    "tenantsActionsColumn": MessageLookupByLibrary.simpleMessage("Actions"),
    "tenantsAddTenant": MessageLookupByLibrary.simpleMessage("Add Tenant"),
    "tenantsAllProperties": MessageLookupByLibrary.simpleMessage(
      "All Properties",
    ),
    "tenantsAllStatuses": MessageLookupByLibrary.simpleMessage("All Statuses"),
    "tenantsCancel": MessageLookupByLibrary.simpleMessage("Cancel"),
    "tenantsConfirmDeletionDesc": m10,
    "tenantsConfirmDeletionTitle": MessageLookupByLibrary.simpleMessage(
      "Confirm Deletion",
    ),
    "tenantsContactColumn": MessageLookupByLibrary.simpleMessage("Contact"),
    "tenantsDelete": MessageLookupByLibrary.simpleMessage("Delete"),
    "tenantsDeleting": MessageLookupByLibrary.simpleMessage("Deleting..."),
    "tenantsDescription": MessageLookupByLibrary.simpleMessage(
      "Manage tenant information and leases across your properties",
    ),
    "tenantsEdit": MessageLookupByLibrary.simpleMessage("Edit"),
    "tenantsGetStartedAddTenant": MessageLookupByLibrary.simpleMessage(
      "Get started by adding a new tenant",
    ),
    "tenantsIdLabel": MessageLookupByLibrary.simpleMessage("ID"),
    "tenantsLeaseFrom": MessageLookupByLibrary.simpleMessage("From"),
    "tenantsLeasePeriodColumn": MessageLookupByLibrary.simpleMessage(
      "Lease Period",
    ),
    "tenantsLeaseTo": MessageLookupByLibrary.simpleMessage("To"),
    "tenantsNext": MessageLookupByLibrary.simpleMessage("Next"),
    "tenantsNoTenantsFound": MessageLookupByLibrary.simpleMessage(
      "No tenants found",
    ),
    "tenantsNotAssigned": MessageLookupByLibrary.simpleMessage("Not assigned"),
    "tenantsNotAvailable": MessageLookupByLibrary.simpleMessage("N/A"),
    "tenantsPaymentStatusFilter": MessageLookupByLibrary.simpleMessage(
      "Payment Status",
    ),
    "tenantsPrevious": MessageLookupByLibrary.simpleMessage("Previous"),
    "tenantsPropertyFilter": MessageLookupByLibrary.simpleMessage("Property"),
    "tenantsPropertyUnitColumn": MessageLookupByLibrary.simpleMessage(
      "Property / Unit",
    ),
    "tenantsStatusCancelled": MessageLookupByLibrary.simpleMessage("Cancelled"),
    "tenantsStatusColumn": MessageLookupByLibrary.simpleMessage("Status"),
    "tenantsStatusOverdue": MessageLookupByLibrary.simpleMessage("Overdue"),
    "tenantsStatusPaid": MessageLookupByLibrary.simpleMessage("Paid"),
    "tenantsStatusPartiallyPaid": MessageLookupByLibrary.simpleMessage(
      "Partially Paid",
    ),
    "tenantsStatusRefunded": MessageLookupByLibrary.simpleMessage("Refunded"),
    "tenantsStatusUnpaid": MessageLookupByLibrary.simpleMessage("Unpaid"),
    "tenantsTenantColumn": MessageLookupByLibrary.simpleMessage("Tenant"),
    "tenantsTitle": MessageLookupByLibrary.simpleMessage("Tenants"),
    "tenantsViewDetails": MessageLookupByLibrary.simpleMessage("View Details"),
    "totalProperties": MessageLookupByLibrary.simpleMessage("Total Properties"),
    "totalTenants": MessageLookupByLibrary.simpleMessage("Total Tenants"),
    "unknownTime": MessageLookupByLibrary.simpleMessage("Unknown time"),
  };
}
