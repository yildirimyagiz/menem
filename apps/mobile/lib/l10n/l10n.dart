import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;
import 'package:mobile/generated/l10n_ar.dart';
import 'package:mobile/generated/l10n_en.dart';
import 'package:mobile/generated/l10n_de.dart';
import 'package:mobile/generated/l10n_es.dart';
import 'package:mobile/generated/l10n_fa.dart';
import 'package:mobile/generated/l10n_fr.dart';
import 'package:mobile/generated/l10n_hi.dart';
import 'package:mobile/generated/l10n_it.dart';
import 'package:mobile/generated/l10n_ja.dart';
import 'package:mobile/generated/l10n_ru.dart';
import 'package:mobile/generated/l10n_tr.dart';
import 'package:mobile/generated/l10n_zh.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/l10n.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('de'),
    Locale('en'),
    Locale('es'),
    Locale('fa'),
    Locale('fr'),
    Locale('hi'),
    Locale('it'),
    Locale('ja'),
    Locale('ru'),
    Locale('tr'),
    Locale('zh')
  ];

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'Menem'**
  String get appTitle;

  /// No description provided for @dashboard.
  ///
  /// In en, this message translates to:
  /// **'Dashboard'**
  String get dashboard;

  /// No description provided for @manageProperties.
  ///
  /// In en, this message translates to:
  /// **'Manage your properties effectively'**
  String get manageProperties;

  /// No description provided for @quickAccess.
  ///
  /// In en, this message translates to:
  /// **'Quick Access'**
  String get quickAccess;

  /// No description provided for @properties.
  ///
  /// In en, this message translates to:
  /// **'Properties'**
  String get properties;

  /// No description provided for @tenants.
  ///
  /// In en, this message translates to:
  /// **'Tenants'**
  String get tenants;

  /// No description provided for @payments.
  ///
  /// In en, this message translates to:
  /// **'Payments'**
  String get payments;

  /// No description provided for @tasks.
  ///
  /// In en, this message translates to:
  /// **'Tasks'**
  String get tasks;

  /// No description provided for @summaryStatistics.
  ///
  /// In en, this message translates to:
  /// **'Summary Statistics'**
  String get summaryStatistics;

  /// No description provided for @totalProperties.
  ///
  /// In en, this message translates to:
  /// **'Total Properties'**
  String get totalProperties;

  /// No description provided for @occupancyRate.
  ///
  /// In en, this message translates to:
  /// **'Occupancy Rate: {rate}'**
  String occupancyRate(Object rate);

  /// No description provided for @monthlyCashflow.
  ///
  /// In en, this message translates to:
  /// **'Monthly Cashflow'**
  String get monthlyCashflow;

  /// No description provided for @pendingPayments.
  ///
  /// In en, this message translates to:
  /// **'Pending Payments: {count}'**
  String pendingPayments(Object count);

  /// No description provided for @pendingTasks.
  ///
  /// In en, this message translates to:
  /// **'Pending Tasks'**
  String get pendingTasks;

  /// No description provided for @tasksThisWeek.
  ///
  /// In en, this message translates to:
  /// **'{count} this week'**
  String tasksThisWeek(Object count);

  /// No description provided for @totalTenants.
  ///
  /// In en, this message translates to:
  /// **'Total Tenants'**
  String get totalTenants;

  /// No description provided for @newTenants.
  ///
  /// In en, this message translates to:
  /// **'New Tenants: {count}'**
  String newTenants(Object count);

  /// No description provided for @homeLabel.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get homeLabel;

  /// No description provided for @favorites.
  ///
  /// In en, this message translates to:
  /// **'Favorites'**
  String get favorites;

  /// No description provided for @listings.
  ///
  /// In en, this message translates to:
  /// **'My Properties'**
  String get listings;

  /// No description provided for @messagesLabel.
  ///
  /// In en, this message translates to:
  /// **'Messages'**
  String get messagesLabel;

  /// No description provided for @notificationsLabel.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notificationsLabel;

  /// No description provided for @paymentsLabel.
  ///
  /// In en, this message translates to:
  /// **'Payments'**
  String get paymentsLabel;

  /// No description provided for @settingsLabel.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settingsLabel;

  /// No description provided for @profileLabel.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get profileLabel;

  /// No description provided for @logoutLabel.
  ///
  /// In en, this message translates to:
  /// **'Logout'**
  String get logoutLabel;

  /// No description provided for @loggingout.
  ///
  /// In en, this message translates to:
  /// **'Logging out...'**
  String get loggingout;

  /// No description provided for @sitetitle.
  ///
  /// In en, this message translates to:
  /// **'RentalProc'**
  String get sitetitle;

  /// No description provided for @nav_home.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get nav_home;

  /// No description provided for @nav_properties.
  ///
  /// In en, this message translates to:
  /// **'Properties'**
  String get nav_properties;

  /// No description provided for @nav_payments.
  ///
  /// In en, this message translates to:
  /// **'Payments'**
  String get nav_payments;

  /// No description provided for @nav_tasks.
  ///
  /// In en, this message translates to:
  /// **'Tasks'**
  String get nav_tasks;

  /// No description provided for @nav_messages.
  ///
  /// In en, this message translates to:
  /// **'Messages'**
  String get nav_messages;

  /// No description provided for @nav_notifications.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get nav_notifications;

  /// No description provided for @nav_helpdesk.
  ///
  /// In en, this message translates to:
  /// **'Help Desk'**
  String get nav_helpdesk;

  /// No description provided for @nav_subscription.
  ///
  /// In en, this message translates to:
  /// **'Subscription'**
  String get nav_subscription;

  /// No description provided for @nav_settings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get nav_settings;

  /// No description provided for @nav_tenants.
  ///
  /// In en, this message translates to:
  /// **'Tenants'**
  String get nav_tenants;

  /// No description provided for @nav_expenses.
  ///
  /// In en, this message translates to:
  /// **'Expenses'**
  String get nav_expenses;

  /// No description provided for @nav_facilities.
  ///
  /// In en, this message translates to:
  /// **'Facilities'**
  String get nav_facilities;

  /// No description provided for @nav_analytics.
  ///
  /// In en, this message translates to:
  /// **'Analytics'**
  String get nav_analytics;

  /// No description provided for @nav_help.
  ///
  /// In en, this message translates to:
  /// **'Help'**
  String get nav_help;

  /// No description provided for @nav_logout.
  ///
  /// In en, this message translates to:
  /// **'Logout'**
  String get nav_logout;

  /// No description provided for @nav_profile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get nav_profile;

  /// No description provided for @nav_viewAll.
  ///
  /// In en, this message translates to:
  /// **'View All'**
  String get nav_viewAll;

  /// No description provided for @indexTitle.
  ///
  /// In en, this message translates to:
  /// **'Welcome to Menem'**
  String get indexTitle;

  /// No description provided for @indexDescription.
  ///
  /// In en, this message translates to:
  /// **'Your property management solution'**
  String get indexDescription;

  /// No description provided for @indexPropertyManagementTitle.
  ///
  /// In en, this message translates to:
  /// **'Property Management'**
  String get indexPropertyManagementTitle;

  /// No description provided for @indexPropertyManagementDescription.
  ///
  /// In en, this message translates to:
  /// **'Manage your properties efficiently with our comprehensive suite of tools.'**
  String get indexPropertyManagementDescription;

  /// No description provided for @indexWaterManagementTitle.
  ///
  /// In en, this message translates to:
  /// **'Water Management'**
  String get indexWaterManagementTitle;

  /// No description provided for @indexWaterManagementDescription.
  ///
  /// In en, this message translates to:
  /// **'Track and optimize water usage across your properties.'**
  String get indexWaterManagementDescription;

  /// No description provided for @authSignIn.
  ///
  /// In en, this message translates to:
  /// **'Sign in with Google'**
  String get authSignIn;

  /// No description provided for @authSignOut.
  ///
  /// In en, this message translates to:
  /// **'Sign out'**
  String get authSignOut;

  /// No description provided for @authWelcomeBack.
  ///
  /// In en, this message translates to:
  /// **'Welcome back, {name}'**
  String authWelcomeBack(Object name);

  /// No description provided for @postsCreate.
  ///
  /// In en, this message translates to:
  /// **'Create Post'**
  String get postsCreate;

  /// No description provided for @postsTitle.
  ///
  /// In en, this message translates to:
  /// **'Title'**
  String get postsTitle;

  /// No description provided for @postsContent.
  ///
  /// In en, this message translates to:
  /// **'Content'**
  String get postsContent;

  /// No description provided for @postsLoading.
  ///
  /// In en, this message translates to:
  /// **'Loading posts...'**
  String get postsLoading;

  /// No description provided for @postsSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get postsSave;

  /// No description provided for @postsCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get postsCancel;

  /// No description provided for @postsEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get postsEdit;

  /// No description provided for @postsDelete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get postsDelete;

  /// No description provided for @postsNoPostsYet.
  ///
  /// In en, this message translates to:
  /// **'No posts yet'**
  String get postsNoPostsYet;

  /// No description provided for @postsErrorUnauthorized.
  ///
  /// In en, this message translates to:
  /// **'You must be logged in to perform this action'**
  String get postsErrorUnauthorized;

  /// No description provided for @postsErrorCreatePost.
  ///
  /// In en, this message translates to:
  /// **'Failed to create post'**
  String get postsErrorCreatePost;

  /// No description provided for @postsErrorUpdatePost.
  ///
  /// In en, this message translates to:
  /// **'Failed to update post'**
  String get postsErrorUpdatePost;

  /// No description provided for @postsErrorDeletePost.
  ///
  /// In en, this message translates to:
  /// **'Failed to delete post'**
  String get postsErrorDeletePost;

  /// No description provided for @chatMessages.
  ///
  /// In en, this message translates to:
  /// **'Messages'**
  String get chatMessages;

  /// No description provided for @chatChattingWith.
  ///
  /// In en, this message translates to:
  /// **'Chatting with {name}'**
  String chatChattingWith(Object name);

  /// No description provided for @chatConnectWithUsers.
  ///
  /// In en, this message translates to:
  /// **'Connect with users and get support'**
  String get chatConnectWithUsers;

  /// No description provided for @chatBackToList.
  ///
  /// In en, this message translates to:
  /// **'Back to List'**
  String get chatBackToList;

  /// No description provided for @chatWelcomeToChat.
  ///
  /// In en, this message translates to:
  /// **'Welcome to Chat'**
  String get chatWelcomeToChat;

  /// No description provided for @chatWelcomeDescription.
  ///
  /// In en, this message translates to:
  /// **'Start a conversation with other users or contact support for assistance'**
  String get chatWelcomeDescription;

  /// No description provided for @chatNewMessage.
  ///
  /// In en, this message translates to:
  /// **'New Message'**
  String get chatNewMessage;

  /// No description provided for @chatContactSupport.
  ///
  /// In en, this message translates to:
  /// **'Contact Support'**
  String get chatContactSupport;

  /// No description provided for @chatBack.
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get chatBack;

  /// No description provided for @chatSearchUsers.
  ///
  /// In en, this message translates to:
  /// **'Search users...'**
  String get chatSearchUsers;

  /// No description provided for @chatTypeMessage.
  ///
  /// In en, this message translates to:
  /// **'Type your message...'**
  String get chatTypeMessage;

  /// No description provided for @chatSend.
  ///
  /// In en, this message translates to:
  /// **'Send'**
  String get chatSend;

  /// No description provided for @chatErrorUnauthorized.
  ///
  /// In en, this message translates to:
  /// **'You must be logged in to perform this action'**
  String get chatErrorUnauthorized;

  /// No description provided for @chatErrorSendMessage.
  ///
  /// In en, this message translates to:
  /// **'Failed to send message'**
  String get chatErrorSendMessage;

  /// No description provided for @chatErrorMarkAsRead.
  ///
  /// In en, this message translates to:
  /// **'Failed to mark messages as read'**
  String get chatErrorMarkAsRead;

  /// No description provided for @chatError.
  ///
  /// In en, this message translates to:
  /// **'Error'**
  String get chatError;

  /// No description provided for @chatConnectionError.
  ///
  /// In en, this message translates to:
  /// **'Failed to connect to chat server. Please try again.'**
  String get chatConnectionError;

  /// No description provided for @chatMessageSendError.
  ///
  /// In en, this message translates to:
  /// **'Failed to send your message. Please try again later.'**
  String get chatMessageSendError;

  /// No description provided for @notifications_placeholder.
  ///
  /// In en, this message translates to:
  /// **'No notifications yet'**
  String get notifications_placeholder;

  /// No description provided for @common_timeAgo.
  ///
  /// In en, this message translates to:
  /// **'{time} ago'**
  String common_timeAgo(Object time);

  /// No description provided for @common_success.
  ///
  /// In en, this message translates to:
  /// **'Success'**
  String get common_success;

  /// No description provided for @common_error.
  ///
  /// In en, this message translates to:
  /// **'Error'**
  String get common_error;

  /// No description provided for @common_warning.
  ///
  /// In en, this message translates to:
  /// **'Warning'**
  String get common_warning;

  /// No description provided for @common_info.
  ///
  /// In en, this message translates to:
  /// **'Information'**
  String get common_info;

  /// No description provided for @common_loading.
  ///
  /// In en, this message translates to:
  /// **'Loading...'**
  String get common_loading;

  /// No description provided for @common_save.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get common_save;

  /// No description provided for @common_cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get common_cancel;

  /// No description provided for @common_delete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get common_delete;

  /// No description provided for @common_edit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get common_edit;

  /// No description provided for @common_create.
  ///
  /// In en, this message translates to:
  /// **'Create'**
  String get common_create;

  /// No description provided for @common_view.
  ///
  /// In en, this message translates to:
  /// **'View'**
  String get common_view;

  /// No description provided for @common_previous.
  ///
  /// In en, this message translates to:
  /// **'Previous'**
  String get common_previous;

  /// No description provided for @common_next.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get common_next;

  /// No description provided for @common_back.
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get common_back;

  /// No description provided for @common_confirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get common_confirm;

  /// No description provided for @common_actions.
  ///
  /// In en, this message translates to:
  /// **'Actions'**
  String get common_actions;

  /// No description provided for @common_search.
  ///
  /// In en, this message translates to:
  /// **'Search'**
  String get common_search;

  /// No description provided for @common_filter.
  ///
  /// In en, this message translates to:
  /// **'Filter'**
  String get common_filter;

  /// No description provided for @common_sort.
  ///
  /// In en, this message translates to:
  /// **'Sort'**
  String get common_sort;

  /// No description provided for @common_noData.
  ///
  /// In en, this message translates to:
  /// **'No data available'**
  String get common_noData;

  /// No description provided for @edit_agent_tooltip.
  ///
  /// In en, this message translates to:
  /// **'Edit Agent'**
  String get edit_agent_tooltip;

  /// No description provided for @agent_contact_information_title.
  ///
  /// In en, this message translates to:
  /// **'Contact Information'**
  String get agent_contact_information_title;

  /// No description provided for @agent_email_label.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get agent_email_label;

  /// No description provided for @agent_phone_label.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get agent_phone_label;

  /// No description provided for @agent_address_label.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get agent_address_label;

  /// No description provided for @agent_website_label.
  ///
  /// In en, this message translates to:
  /// **'Website'**
  String get agent_website_label;

  /// No description provided for @agent_professional_information_title.
  ///
  /// In en, this message translates to:
  /// **'Professional Information'**
  String get agent_professional_information_title;

  /// No description provided for @agent_status_label.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get agent_status_label;

  /// No description provided for @agent_agency_label.
  ///
  /// In en, this message translates to:
  /// **'Agency'**
  String get agent_agency_label;

  /// No description provided for @agent_specialities_label.
  ///
  /// In en, this message translates to:
  /// **'Specialities'**
  String get agent_specialities_label;

  /// No description provided for @agent_activity_title.
  ///
  /// In en, this message translates to:
  /// **'Recent Activity'**
  String get agent_activity_title;

  /// No description provided for @agent_last_active_label.
  ///
  /// In en, this message translates to:
  /// **'Last Active'**
  String get agent_last_active_label;

  /// No description provided for @agent_is_active_label.
  ///
  /// In en, this message translates to:
  /// **'Is Active'**
  String get agent_is_active_label;

  /// No description provided for @agent_created_at_label.
  ///
  /// In en, this message translates to:
  /// **'Created At'**
  String get agent_created_at_label;

  /// No description provided for @amenitiesSectionTitle.
  ///
  /// In en, this message translates to:
  /// **'Amenities'**
  String get amenitiesSectionTitle;

  /// No description provided for @noAmenitiesListed.
  ///
  /// In en, this message translates to:
  /// **'No amenities listed'**
  String get noAmenitiesListed;

  /// No description provided for @locationSectionTitle.
  ///
  /// In en, this message translates to:
  /// **'Location'**
  String get locationSectionTitle;

  /// No description provided for @getDirectionsButton.
  ///
  /// In en, this message translates to:
  /// **'Get Directions'**
  String get getDirectionsButton;

  /// No description provided for @messageStatusRead.
  ///
  /// In en, this message translates to:
  /// **'Read'**
  String get messageStatusRead;

  /// No description provided for @messageStatusDelivered.
  ///
  /// In en, this message translates to:
  /// **'Delivered'**
  String get messageStatusDelivered;

  /// No description provided for @messageStatusSent.
  ///
  /// In en, this message translates to:
  /// **'Sent'**
  String get messageStatusSent;

  /// No description provided for @defaultUser.
  ///
  /// In en, this message translates to:
  /// **'Default User'**
  String get defaultUser;

  /// No description provided for @unknownTime.
  ///
  /// In en, this message translates to:
  /// **'Unknown time'**
  String get unknownTime;

  /// No description provided for @common_yes.
  ///
  /// In en, this message translates to:
  /// **'Yes'**
  String get common_yes;

  /// No description provided for @common_no.
  ///
  /// In en, this message translates to:
  /// **'No'**
  String get common_no;

  /// No description provided for @common_not_available.
  ///
  /// In en, this message translates to:
  /// **'Not available'**
  String get common_not_available;

  String? get analyticsTypeListingView => null;

  String? get analyticsTypeBookingConversion => null;

  /// No description provided for @accountsFound.
  ///
  /// In en, this message translates to:
  /// **'{count,plural, =0{No accounts found} =1{1 account found} other{{count} accounts found}}'**
  String accountsFound(num count);

  /// No description provided for @localeName.
  ///
  /// In en, this message translates to:
  /// **'English'**
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>[
        'ar',
        'de',
        'en',
        'es',
        'fa',
        'fr',
        'hi',
        'it',
        'ja',
        'ru',
        'tr',
        'zh'
      ].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

// NOTE: Return type is dynamic to avoid analyzer errors when returning generated subclasses.
dynamic lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'de':
      return AppLocalizationsDe();
    case 'en':
      return AppLocalizationsEn(); // Assuming AppLocalizationsEn implements AppLocalizations
    case 'es':
      return AppLocalizationsEs();
    case 'fa':
      return AppLocalizationsFa();
    case 'fr':
      return AppLocalizationsFr();
    case 'hi': // Assuming AppLocalizationsHi implements AppLocalizations
      return AppLocalizationsHi();
    case 'it':
      return AppLocalizationsIt();
    case 'ja':
      return AppLocalizationsJa(); // Assuming AppLocalizationsJa implements AppLocalizations
    case 'ru':
      return AppLocalizationsRu();
    case 'tr':
      return AppLocalizationsTr();
    case 'zh':
      return AppLocalizationsZh();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
