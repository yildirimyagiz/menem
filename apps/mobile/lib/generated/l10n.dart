import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'l10n_ar.dart';
import 'l10n_de.dart';
import 'l10n_en.dart';
import 'l10n_es.dart';
import 'l10n_fa.dart';
import 'l10n_fr.dart';
import 'l10n_hi.dart';
import 'l10n_it.dart';
import 'l10n_ja.dart';
import 'l10n_ru.dart';
import 'l10n_tr.dart';
import 'l10n_zh.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'generated/l10n.dart';
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

  /// No description provided for @propertyDetailTitle.
  ///
  /// In en, this message translates to:
  /// **'Property Details'**
  String get propertyDetailTitle;

  /// No description provided for @propertyDetailOverviewTab.
  ///
  /// In en, this message translates to:
  /// **'Overview'**
  String get propertyDetailOverviewTab;

  /// No description provided for @propertyDetailFeaturesTab.
  ///
  /// In en, this message translates to:
  /// **'Features'**
  String get propertyDetailFeaturesTab;

  /// No description provided for @propertyDetailLocationTab.
  ///
  /// In en, this message translates to:
  /// **'Location'**
  String get propertyDetailLocationTab;

  /// No description provided for @propertyDetailGalleryTab.
  ///
  /// In en, this message translates to:
  /// **'Gallery'**
  String get propertyDetailGalleryTab;

  /// No description provided for @propertyDetailId.
  ///
  /// In en, this message translates to:
  /// **'ID'**
  String get propertyDetailId;

  /// No description provided for @propertyDetailNumber.
  ///
  /// In en, this message translates to:
  /// **'Property Number'**
  String get propertyDetailNumber;

  /// No description provided for @propertyDetailTitleField.
  ///
  /// In en, this message translates to:
  /// **'Title'**
  String get propertyDetailTitleField;

  /// No description provided for @propertyDetailDescription.
  ///
  /// In en, this message translates to:
  /// **'Description'**
  String get propertyDetailDescription;

  /// No description provided for @propertyDetailType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get propertyDetailType;

  /// No description provided for @propertyDetailStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get propertyDetailStatus;

  /// No description provided for @propertyDetailCategory.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get propertyDetailCategory;

  /// No description provided for @propertyDetailCondition.
  ///
  /// In en, this message translates to:
  /// **'Condition'**
  String get propertyDetailCondition;

  /// No description provided for @propertyDetailMarketValue.
  ///
  /// In en, this message translates to:
  /// **'Market Value'**
  String get propertyDetailMarketValue;

  /// No description provided for @propertyDetailBedrooms.
  ///
  /// In en, this message translates to:
  /// **'Bedrooms'**
  String get propertyDetailBedrooms;

  /// No description provided for @propertyDetailBathrooms.
  ///
  /// In en, this message translates to:
  /// **'Bathrooms'**
  String get propertyDetailBathrooms;

  /// No description provided for @propertyDetailYearBuilt.
  ///
  /// In en, this message translates to:
  /// **'Year Built'**
  String get propertyDetailYearBuilt;

  /// No description provided for @propertyDetailFeatures.
  ///
  /// In en, this message translates to:
  /// **'Features'**
  String get propertyDetailFeatures;

  /// No description provided for @propertyDetailAmenities.
  ///
  /// In en, this message translates to:
  /// **'Amenities'**
  String get propertyDetailAmenities;

  /// No description provided for @propertyDetailAddress.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get propertyDetailAddress;

  /// No description provided for @propertyDetailCity.
  ///
  /// In en, this message translates to:
  /// **'City'**
  String get propertyDetailCity;

  /// No description provided for @propertyDetailState.
  ///
  /// In en, this message translates to:
  /// **'State'**
  String get propertyDetailState;

  /// No description provided for @propertyDetailCountry.
  ///
  /// In en, this message translates to:
  /// **'Country'**
  String get propertyDetailCountry;

  /// No description provided for @propertyDetailZipCode.
  ///
  /// In en, this message translates to:
  /// **'ZIP Code'**
  String get propertyDetailZipCode;

  /// No description provided for @propertyDetailCoordinates.
  ///
  /// In en, this message translates to:
  /// **'Coordinates'**
  String get propertyDetailCoordinates;

  /// No description provided for @propertyDetailNoFeatures.
  ///
  /// In en, this message translates to:
  /// **'No features or amenities available'**
  String get propertyDetailNoFeatures;

  /// No description provided for @propertyDetailNoLocation.
  ///
  /// In en, this message translates to:
  /// **'No location information available'**
  String get propertyDetailNoLocation;

  /// No description provided for @propertyDetailGalleryPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Gallery View (Implement with GridView of Images)'**
  String get propertyDetailGalleryPlaceholder;

  /// No description provided for @propertyDetailDeleteConfirm.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to delete this property?'**
  String get propertyDetailDeleteConfirm;

  /// No description provided for @propertyDetailDeleteSuccess.
  ///
  /// In en, this message translates to:
  /// **'Property deleted successfully'**
  String get propertyDetailDeleteSuccess;

  /// No description provided for @propertyDetailDeleteFailed.
  ///
  /// In en, this message translates to:
  /// **'Failed to delete property: {error}'**
  String propertyDetailDeleteFailed(Object error);

  /// No description provided for @propertyDetailContactAgent.
  ///
  /// In en, this message translates to:
  /// **'Contact Agent'**
  String get propertyDetailContactAgent;

  /// No description provided for @propertyDetailPrice.
  ///
  /// In en, this message translates to:
  /// **'Price'**
  String get propertyDetailPrice;

  /// No description provided for @propertyDetailLoading.
  ///
  /// In en, this message translates to:
  /// **'Loading property details...'**
  String get propertyDetailLoading;

  /// No description provided for @propertyDetailNotFound.
  ///
  /// In en, this message translates to:
  /// **'Property not found.'**
  String get propertyDetailNotFound;

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

  /// Displayed when the favorites list is empty in FavoritesScreen.
  ///
  /// In en, this message translates to:
  /// **'No favorites yet'**
  String get favoritesEmpty;

  /// Displayed when there is an error loading favorites in FavoritesScreen.
  ///
  /// In en, this message translates to:
  /// **'Error loading favorites'**
  String get favoritesError;

  /// Retry button label in FavoritesScreen error state.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get favoritesRetry;

  /// Retry button label in the EmptyState widget.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get emptyStateRetry;

  /// No description provided for @listings.
  ///
  /// In en, this message translates to:
  /// **'My Properties'**
  String get listings;

  /// Displayed when the listings list is empty in MyListingsScreen.
  ///
  /// In en, this message translates to:
  /// **'No listings yet'**
  String get listingsEmpty;

  /// Retry button label in MyListingsScreen error state.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get listingsRetry;

  /// Title for property filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Filter Properties'**
  String get filterPropertiesTitle;

  /// Apply button label in property filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Apply'**
  String get filterPropertiesApply;

  /// Cancel button label in property filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get filterPropertiesCancel;

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

  /// Displayed when the notifications list is empty in NotificationsScreen.
  ///
  /// In en, this message translates to:
  /// **'No notifications yet'**
  String get notificationsEmpty;

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

  /// Section title for appearance settings in SettingsScreen.
  ///
  /// In en, this message translates to:
  /// **'Appearance'**
  String get settingsAppearance;

  /// Switch label for dark mode in SettingsScreen.
  ///
  /// In en, this message translates to:
  /// **'Dark Mode'**
  String get settingsDarkMode;

  /// Title for task filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Filter Tasks'**
  String get filterTasksTitle;

  /// Section title for status filter in task filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get filterTasksStatus;

  /// Section title for priority filter in task filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Priority'**
  String get filterTasksPriority;

  /// Section title for type filter in task filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get filterTasksType;

  /// Section title for due date filter in task filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Due Date'**
  String get filterTasksDueDate;

  /// Apply button label in task filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Apply'**
  String get filterTasksApply;

  /// Cancel button label in task filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get filterTasksCancel;

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

  /// Title for create property screen.
  ///
  /// In en, this message translates to:
  /// **'Create New Property'**
  String get createPropertyTitle;

  /// Snackbar message when property is created successfully.
  ///
  /// In en, this message translates to:
  /// **'Property created successfully'**
  String get propertyCreatedSuccess;

  /// Snackbar message when property creation fails.
  ///
  /// In en, this message translates to:
  /// **'Failed to create property'**
  String get propertyCreatedError;

  /// Prompt for users who already have an account on the registration form.
  ///
  /// In en, this message translates to:
  /// **'Already have an account? Login'**
  String get registerAlreadyHaveAccount;

  /// Button label for forgotten password in registration form.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password?'**
  String get registerForgotPassword;

  /// Title for viewing events section in property viewing event list widget.
  ///
  /// In en, this message translates to:
  /// **'Viewing Events'**
  String get propertyViewingEventsTitle;

  /// Button label for scheduling a viewing in property viewing event list widget.
  ///
  /// In en, this message translates to:
  /// **'Schedule Viewing'**
  String get propertyViewingSchedule;

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

  /// No description provided for @notificationsPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'No notifications yet'**
  String get notificationsPlaceholder;

  /// No description provided for @commonTimeAgo.
  ///
  /// In en, this message translates to:
  /// **'{time} ago'**
  String commonTimeAgo(Object time);

  /// No description provided for @commonSuccess.
  ///
  /// In en, this message translates to:
  /// **'Success'**
  String get commonSuccess;

  /// No description provided for @commonError.
  ///
  /// In en, this message translates to:
  /// **'Error'**
  String get commonError;

  /// No description provided for @propertiesFound.
  ///
  /// In en, this message translates to:
  /// **'{count} properties found'**
  String propertiesFound(Object count);

  /// Title for error screen.
  ///
  /// In en, this message translates to:
  /// **'Error'**
  String get errorScreenTitle;

  /// Button label to go back from error screen.
  ///
  /// In en, this message translates to:
  /// **'Go Back'**
  String get errorScreenGoBack;

  /// Title for date range filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Select Date Range'**
  String get dateRangeSelectTitle;

  /// Apply button label in date range filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Apply'**
  String get dateRangeSelectApply;

  /// Cancel button label in date range filter dialog.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get dateRangeSelectCancel;

  /// No description provided for @commonWarning.
  ///
  /// In en, this message translates to:
  /// **'Warning'**
  String get commonWarning;

  /// No description provided for @commonInfo.
  ///
  /// In en, this message translates to:
  /// **'Information'**
  String get commonInfo;

  /// No description provided for @commonLoading.
  ///
  /// In en, this message translates to:
  /// **'Loading...'**
  String get commonLoading;

  /// No description provided for @commonSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get commonSave;

  /// No description provided for @commonCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get commonCancel;

  /// No description provided for @commonDelete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get commonDelete;

  /// No description provided for @commonEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get commonEdit;

  /// No description provided for @commonCreate.
  ///
  /// In en, this message translates to:
  /// **'Create'**
  String get commonCreate;

  /// No description provided for @commonView.
  ///
  /// In en, this message translates to:
  /// **'View'**
  String get commonView;

  /// No description provided for @commonPrevious.
  ///
  /// In en, this message translates to:
  /// **'Previous'**
  String get commonPrevious;

  /// No description provided for @commonNext.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get commonNext;

  /// No description provided for @commonBack.
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get commonBack;

  /// No description provided for @commonConfirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get commonConfirm;

  /// No description provided for @commonActions.
  ///
  /// In en, this message translates to:
  /// **'Actions'**
  String get commonActions;

  /// No description provided for @commonSearch.
  ///
  /// In en, this message translates to:
  /// **'Search'**
  String get commonSearch;

  /// No description provided for @commonFilter.
  ///
  /// In en, this message translates to:
  /// **'Filter'**
  String get commonFilter;

  /// No description provided for @commonSort.
  ///
  /// In en, this message translates to:
  /// **'Sort'**
  String get commonSort;

  /// No description provided for @commonNoData.
  ///
  /// In en, this message translates to:
  /// **'No data available'**
  String get commonNoData;

  /// No description provided for @editAgentTooltip.
  ///
  /// In en, this message translates to:
  /// **'Edit Agent'**
  String get editAgentTooltip;

  /// No description provided for @agentContactInformationTitle.
  ///
  /// In en, this message translates to:
  /// **'Contact Information'**
  String get agentContactInformationTitle;

  /// No description provided for @agentEmailLabel.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get agentEmailLabel;

  /// No description provided for @agentPhoneLabel.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get agentPhoneLabel;

  /// No description provided for @agentAddressLabel.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get agentAddressLabel;

  /// No description provided for @agentWebsiteLabel.
  ///
  /// In en, this message translates to:
  /// **'Website'**
  String get agentWebsiteLabel;

  /// No description provided for @agentProfessionalInformationTitle.
  ///
  /// In en, this message translates to:
  /// **'Professional Information'**
  String get agentProfessionalInformationTitle;

  /// No description provided for @agentStatusLabel.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get agentStatusLabel;

  /// No description provided for @agentAgencyLabel.
  ///
  /// In en, this message translates to:
  /// **'Agency'**
  String get agentAgencyLabel;

  /// No description provided for @agentSpecialitiesLabel.
  ///
  /// In en, this message translates to:
  /// **'Specialities'**
  String get agentSpecialitiesLabel;

  /// No description provided for @agentActivityTitle.
  ///
  /// In en, this message translates to:
  /// **'Recent Activity'**
  String get agentActivityTitle;

  /// No description provided for @agentLastActiveLabel.
  ///
  /// In en, this message translates to:
  /// **'Last Active'**
  String get agentLastActiveLabel;

  /// No description provided for @agentIsActiveLabel.
  ///
  /// In en, this message translates to:
  /// **'Is Active'**
  String get agentIsActiveLabel;

  /// No description provided for @agentCreatedAtLabel.
  ///
  /// In en, this message translates to:
  /// **'Created At'**
  String get agentCreatedAtLabel;

  /// No description provided for @agentAdditionalInformationTitle.
  ///
  /// In en, this message translates to:
  /// **'Additional Information'**
  String get agentAdditionalInformationTitle;

  /// No description provided for @agentBioLabel.
  ///
  /// In en, this message translates to:
  /// **'Bio'**
  String get agentBioLabel;

  /// No description provided for @agentExternalIdLabel.
  ///
  /// In en, this message translates to:
  /// **'External ID'**
  String get agentExternalIdLabel;

  /// No description provided for @agentSettingsLabel.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get agentSettingsLabel;

  /// No description provided for @agentIntegrationLabel.
  ///
  /// In en, this message translates to:
  /// **'Integration'**
  String get agentIntegrationLabel;

  /// No description provided for @agentOwnerIdLabel.
  ///
  /// In en, this message translates to:
  /// **'Owner ID'**
  String get agentOwnerIdLabel;

  /// No description provided for @agentAgencyIdLabel.
  ///
  /// In en, this message translates to:
  /// **'Agency ID'**
  String get agentAgencyIdLabel;

  /// No description provided for @agentDeletedAtLabel.
  ///
  /// In en, this message translates to:
  /// **'Deleted At'**
  String get agentDeletedAtLabel;

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

  /// No description provided for @commonNotAvailable.
  ///
  /// In en, this message translates to:
  /// **'Not available'**
  String get commonNotAvailable;

  /// No description provided for @accountsFound.
  ///
  /// In en, this message translates to:
  /// **'{count,plural, =0{No accounts found} =1{1 account found} other{{count} accounts found}}'**
  String accountsFound(num count);

  /// No description provided for @actionCardProperties.
  ///
  /// In en, this message translates to:
  /// **'Properties'**
  String get actionCardProperties;

  /// No description provided for @actionCardTenants.
  ///
  /// In en, this message translates to:
  /// **'Tenants'**
  String get actionCardTenants;

  /// No description provided for @actionCardAnalytics.
  ///
  /// In en, this message translates to:
  /// **'Analytics'**
  String get actionCardAnalytics;

  /// No description provided for @actionCardPayments.
  ///
  /// In en, this message translates to:
  /// **'Payments'**
  String get actionCardPayments;

  /// No description provided for @actionCardTasks.
  ///
  /// In en, this message translates to:
  /// **'Tasks'**
  String get actionCardTasks;

  /// No description provided for @actionCardMessages.
  ///
  /// In en, this message translates to:
  /// **'Messages'**
  String get actionCardMessages;

  /// No description provided for @actionCardHelpDesk.
  ///
  /// In en, this message translates to:
  /// **'Help Desk'**
  String get actionCardHelpDesk;

  /// No description provided for @actionCardManageYourPropertyPortfolio.
  ///
  /// In en, this message translates to:
  /// **'Manage your property portfolio'**
  String get actionCardManageYourPropertyPortfolio;

  /// No description provided for @actionCardManageTenantInformation.
  ///
  /// In en, this message translates to:
  /// **'Manage tenant information'**
  String get actionCardManageTenantInformation;

  /// No description provided for @actionCardViewReportsAndAnalytics.
  ///
  /// In en, this message translates to:
  /// **'View reports and analytics'**
  String get actionCardViewReportsAndAnalytics;

  /// No description provided for @actionCardTrackFinancialRecords.
  ///
  /// In en, this message translates to:
  /// **'Track financial records'**
  String get actionCardTrackFinancialRecords;

  /// No description provided for @actionCardManageMaintenanceTasks.
  ///
  /// In en, this message translates to:
  /// **'Manage maintenance tasks'**
  String get actionCardManageMaintenanceTasks;

  /// No description provided for @actionCardCommunicateWithTenants.
  ///
  /// In en, this message translates to:
  /// **'Communicate with tenants'**
  String get actionCardCommunicateWithTenants;

  /// No description provided for @actionCardGetAssistanceWhenNeeded.
  ///
  /// In en, this message translates to:
  /// **'Get assistance when needed'**
  String get actionCardGetAssistanceWhenNeeded;

  /// No description provided for @actionCardAddProperty.
  ///
  /// In en, this message translates to:
  /// **'Add Property'**
  String get actionCardAddProperty;

  /// No description provided for @actionCardCreateANewPropertyListing.
  ///
  /// In en, this message translates to:
  /// **'Create a new property listing'**
  String get actionCardCreateANewPropertyListing;

  /// No description provided for @actionCardAddTenant.
  ///
  /// In en, this message translates to:
  /// **'Add Tenant'**
  String get actionCardAddTenant;

  /// No description provided for @actionCardRegisterANewTenant.
  ///
  /// In en, this message translates to:
  /// **'Register a new tenant'**
  String get actionCardRegisterANewTenant;

  /// No description provided for @actionCardRecordPayment.
  ///
  /// In en, this message translates to:
  /// **'Record Payment'**
  String get actionCardRecordPayment;

  /// No description provided for @actionCardRecordARentPayment.
  ///
  /// In en, this message translates to:
  /// **'Record a rent payment'**
  String get actionCardRecordARentPayment;

  /// No description provided for @actionCardAddTask.
  ///
  /// In en, this message translates to:
  /// **'Add Task'**
  String get actionCardAddTask;

  /// No description provided for @actionCardCreateAMaintenanceTask.
  ///
  /// In en, this message translates to:
  /// **'Create a maintenance task'**
  String get actionCardCreateAMaintenanceTask;

  /// No description provided for @actionCardScheduleEvent.
  ///
  /// In en, this message translates to:
  /// **'Schedule Event'**
  String get actionCardScheduleEvent;

  /// No description provided for @actionCardCreateAPropertyEvent.
  ///
  /// In en, this message translates to:
  /// **'Create a property event'**
  String get actionCardCreateAPropertyEvent;

  /// No description provided for @actionCardComposeMessage.
  ///
  /// In en, this message translates to:
  /// **'Compose Message'**
  String get actionCardComposeMessage;

  /// No description provided for @actionCardSendAMessageToTenants.
  ///
  /// In en, this message translates to:
  /// **'Send a message to tenants'**
  String get actionCardSendAMessageToTenants;

  /// No description provided for @actionCardCreateDocument.
  ///
  /// In en, this message translates to:
  /// **'Create Document'**
  String get actionCardCreateDocument;

  /// No description provided for @actionCardGenerateANewDocument.
  ///
  /// In en, this message translates to:
  /// **'Generate a new document'**
  String get actionCardGenerateANewDocument;

  /// No description provided for @actionCardGetStarted.
  ///
  /// In en, this message translates to:
  /// **'Get Started'**
  String get actionCardGetStarted;

  /// No description provided for @actionCardNewThisMonth.
  ///
  /// In en, this message translates to:
  /// **'New This Month'**
  String get actionCardNewThisMonth;

  /// No description provided for @tenantsTitle.
  ///
  /// In en, this message translates to:
  /// **'Tenants'**
  String get tenantsTitle;

  /// No description provided for @tenantsDescription.
  ///
  /// In en, this message translates to:
  /// **'Manage tenant information and leases across your properties'**
  String get tenantsDescription;

  /// No description provided for @tenantsAddTenant.
  ///
  /// In en, this message translates to:
  /// **'Add Tenant'**
  String get tenantsAddTenant;

  /// No description provided for @tenantsPropertyFilter.
  ///
  /// In en, this message translates to:
  /// **'Property'**
  String get tenantsPropertyFilter;

  /// No description provided for @tenantsAllProperties.
  ///
  /// In en, this message translates to:
  /// **'All Properties'**
  String get tenantsAllProperties;

  /// No description provided for @tenantsPaymentStatusFilter.
  ///
  /// In en, this message translates to:
  /// **'Payment Status'**
  String get tenantsPaymentStatusFilter;

  /// No description provided for @tenantsAllStatuses.
  ///
  /// In en, this message translates to:
  /// **'All Statuses'**
  String get tenantsAllStatuses;

  /// No description provided for @tenantsTenantColumn.
  ///
  /// In en, this message translates to:
  /// **'Tenant'**
  String get tenantsTenantColumn;

  /// No description provided for @tenantsStatusColumn.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get tenantsStatusColumn;

  /// No description provided for @tenantsPropertyUnitColumn.
  ///
  /// In en, this message translates to:
  /// **'Property / Unit'**
  String get tenantsPropertyUnitColumn;

  /// No description provided for @tenantsContactColumn.
  ///
  /// In en, this message translates to:
  /// **'Contact'**
  String get tenantsContactColumn;

  /// No description provided for @tenantsLeasePeriodColumn.
  ///
  /// In en, this message translates to:
  /// **'Lease Period'**
  String get tenantsLeasePeriodColumn;

  /// No description provided for @tenantsActionsColumn.
  ///
  /// In en, this message translates to:
  /// **'Actions'**
  String get tenantsActionsColumn;

  /// No description provided for @tenantsIdLabel.
  ///
  /// In en, this message translates to:
  /// **'ID'**
  String get tenantsIdLabel;

  /// No description provided for @tenantsNotAssigned.
  ///
  /// In en, this message translates to:
  /// **'Not assigned'**
  String get tenantsNotAssigned;

  /// No description provided for @tenantsNotAvailable.
  ///
  /// In en, this message translates to:
  /// **'N/A'**
  String get tenantsNotAvailable;

  /// No description provided for @tenantsLeaseFrom.
  ///
  /// In en, this message translates to:
  /// **'From'**
  String get tenantsLeaseFrom;

  /// No description provided for @tenantsLeaseTo.
  ///
  /// In en, this message translates to:
  /// **'To'**
  String get tenantsLeaseTo;

  /// No description provided for @tenantsViewDetails.
  ///
  /// In en, this message translates to:
  /// **'View Details'**
  String get tenantsViewDetails;

  /// No description provided for @tenantsEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get tenantsEdit;

  /// No description provided for @tenantsDelete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get tenantsDelete;

  /// No description provided for @tenantsNoTenantsFound.
  ///
  /// In en, this message translates to:
  /// **'No tenants found'**
  String get tenantsNoTenantsFound;

  /// No description provided for @tenantsGetStartedAddTenant.
  ///
  /// In en, this message translates to:
  /// **'Get started by adding a new tenant'**
  String get tenantsGetStartedAddTenant;

  /// No description provided for @tenantsConfirmDeletionTitle.
  ///
  /// In en, this message translates to:
  /// **'Confirm Deletion'**
  String get tenantsConfirmDeletionTitle;

  /// No description provided for @tenantsConfirmDeletionDesc.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to delete the tenant {tenant}? This action cannot be undone.'**
  String tenantsConfirmDeletionDesc(Object tenant);

  /// No description provided for @tenantsCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get tenantsCancel;

  /// No description provided for @tenantsDeleting.
  ///
  /// In en, this message translates to:
  /// **'Deleting...'**
  String get tenantsDeleting;

  /// No description provided for @tenantsPrevious.
  ///
  /// In en, this message translates to:
  /// **'Previous'**
  String get tenantsPrevious;

  /// No description provided for @tenantsNext.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get tenantsNext;

  /// No description provided for @tenantsStatusUnpaid.
  ///
  /// In en, this message translates to:
  /// **'Unpaid'**
  String get tenantsStatusUnpaid;

  /// No description provided for @tenantsStatusPartiallyPaid.
  ///
  /// In en, this message translates to:
  /// **'Partially Paid'**
  String get tenantsStatusPartiallyPaid;

  /// No description provided for @tenantsStatusPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get tenantsStatusPaid;

  /// No description provided for @tenantsStatusRefunded.
  ///
  /// In en, this message translates to:
  /// **'Refunded'**
  String get tenantsStatusRefunded;

  /// No description provided for @tenantsStatusOverdue.
  ///
  /// In en, this message translates to:
  /// **'Overdue'**
  String get tenantsStatusOverdue;

  /// No description provided for @tenantsStatusCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get tenantsStatusCancelled;

  /// No description provided for @agenciesTitle.
  ///
  /// In en, this message translates to:
  /// **'Agencies'**
  String get agenciesTitle;

  /// No description provided for @agenciesDescription.
  ///
  /// In en, this message translates to:
  /// **'Manage your agencies and their settings.'**
  String get agenciesDescription;

  /// No description provided for @agenciesSearch.
  ///
  /// In en, this message translates to:
  /// **'Search agencies...'**
  String get agenciesSearch;

  /// No description provided for @agenciesStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get agenciesStatus;

  /// No description provided for @agenciesStatusValuesPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get agenciesStatusValuesPending;

  /// No description provided for @agenciesStatusValuesVerified.
  ///
  /// In en, this message translates to:
  /// **'Verified'**
  String get agenciesStatusValuesVerified;

  /// No description provided for @agenciesStatusValuesRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get agenciesStatusValuesRejected;

  /// No description provided for @agenciesAdd.
  ///
  /// In en, this message translates to:
  /// **'Add Agency'**
  String get agenciesAdd;

  /// No description provided for @agenciesEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get agenciesEdit;

  /// No description provided for @agenciesDelete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get agenciesDelete;

  /// No description provided for @agenciesConfirmDeleteDesc.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to delete {name}? This action cannot be undone.'**
  String agenciesConfirmDeleteDesc(Object name);

  /// No description provided for @agenciesDeletedMsg.
  ///
  /// In en, this message translates to:
  /// **'Agency deleted successfully.'**
  String get agenciesDeletedMsg;

  /// No description provided for @agenciesNone.
  ///
  /// In en, this message translates to:
  /// **'No agencies match your search. Try different filters.'**
  String get agenciesNone;

  /// No description provided for @agenciesNa.
  ///
  /// In en, this message translates to:
  /// **'N/A'**
  String get agenciesNa;

  /// No description provided for @agenciesAgents.
  ///
  /// In en, this message translates to:
  /// **'Agents'**
  String get agenciesAgents;

  /// No description provided for @agenciesView.
  ///
  /// In en, this message translates to:
  /// **'View'**
  String get agenciesView;

  /// No description provided for @agenciesName.
  ///
  /// In en, this message translates to:
  /// **'Agency Name'**
  String get agenciesName;

  /// No description provided for @agenciesEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get agenciesEmail;

  /// No description provided for @agenciesPhoneNumber.
  ///
  /// In en, this message translates to:
  /// **'Phone Number'**
  String get agenciesPhoneNumber;

  /// No description provided for @agenciesAddress.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get agenciesAddress;

  /// No description provided for @agenciesWebsite.
  ///
  /// In en, this message translates to:
  /// **'Website'**
  String get agenciesWebsite;

  /// No description provided for @agenciesLogoUrl.
  ///
  /// In en, this message translates to:
  /// **'Logo URL'**
  String get agenciesLogoUrl;

  /// No description provided for @agenciesCreated.
  ///
  /// In en, this message translates to:
  /// **'Created'**
  String get agenciesCreated;

  /// No description provided for @agenciesUpdated.
  ///
  /// In en, this message translates to:
  /// **'Updated'**
  String get agenciesUpdated;

  /// No description provided for @agenciesProperties.
  ///
  /// In en, this message translates to:
  /// **'Properties'**
  String get agenciesProperties;

  /// No description provided for @agenciesActions.
  ///
  /// In en, this message translates to:
  /// **'Actions'**
  String get agenciesActions;

  /// No description provided for @agenciesCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get agenciesCancel;

  /// No description provided for @agenciesDeleting.
  ///
  /// In en, this message translates to:
  /// **'Deleting...'**
  String get agenciesDeleting;

  /// No description provided for @agenciesCreating.
  ///
  /// In en, this message translates to:
  /// **'Creating...'**
  String get agenciesCreating;

  /// No description provided for @agenciesSaving.
  ///
  /// In en, this message translates to:
  /// **'Saving...'**
  String get agenciesSaving;

  /// No description provided for @agenciesSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get agenciesSave;

  /// No description provided for @agenciesCreate.
  ///
  /// In en, this message translates to:
  /// **'Create'**
  String get agenciesCreate;

  /// No description provided for @agenciesGetStarted.
  ///
  /// In en, this message translates to:
  /// **'Get started by adding a new agency'**
  String get agenciesGetStarted;

  /// No description provided for @agenciesRequired.
  ///
  /// In en, this message translates to:
  /// **'This field is required.'**
  String get agenciesRequired;

  /// No description provided for @agenciesInvalidEmail.
  ///
  /// In en, this message translates to:
  /// **'Invalid email address.'**
  String get agenciesInvalidEmail;

  /// No description provided for @agenciesInvalidUrl.
  ///
  /// In en, this message translates to:
  /// **'Invalid URL.'**
  String get agenciesInvalidUrl;

  /// No description provided for @agenciesUpdatedMsg.
  ///
  /// In en, this message translates to:
  /// **'Updated!'**
  String get agenciesUpdatedMsg;

  /// No description provided for @agenciesCreatedMsg.
  ///
  /// In en, this message translates to:
  /// **'Created!'**
  String get agenciesCreatedMsg;

  /// No description provided for @agenciesErrorLoad.
  ///
  /// In en, this message translates to:
  /// **'Failed to load details.'**
  String get agenciesErrorLoad;

  /// No description provided for @agenciesErrorCreate.
  ///
  /// In en, this message translates to:
  /// **'Failed to create.'**
  String get agenciesErrorCreate;

  /// No description provided for @agenciesErrorUpdate.
  ///
  /// In en, this message translates to:
  /// **'Failed to update.'**
  String get agenciesErrorUpdate;

  /// No description provided for @agenciesErrorDelete.
  ///
  /// In en, this message translates to:
  /// **'Failed to delete.'**
  String get agenciesErrorDelete;

  /// No description provided for @loginPageTitle.
  ///
  /// In en, this message translates to:
  /// **'Sign In'**
  String get loginPageTitle;

  /// No description provided for @loginPageEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get loginPageEmail;

  /// No description provided for @loginPagePassword.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get loginPagePassword;

  /// No description provided for @loginPageRememberMe.
  ///
  /// In en, this message translates to:
  /// **'Remember me'**
  String get loginPageRememberMe;

  /// No description provided for @loginPageForgotPassword.
  ///
  /// In en, this message translates to:
  /// **'Forgot password?'**
  String get loginPageForgotPassword;

  /// No description provided for @loginPageSignIn.
  ///
  /// In en, this message translates to:
  /// **'Sign In'**
  String get loginPageSignIn;

  /// No description provided for @loginPageOrContinueWith.
  ///
  /// In en, this message translates to:
  /// **'Or continue with'**
  String get loginPageOrContinueWith;

  /// No description provided for @loginPageDontHaveAccount.
  ///
  /// In en, this message translates to:
  /// **'Don\'t have an account?'**
  String get loginPageDontHaveAccount;

  /// No description provided for @loginPageSignUp.
  ///
  /// In en, this message translates to:
  /// **'Sign up'**
  String get loginPageSignUp;

  /// No description provided for @loginPageErrorInvalidCredentials.
  ///
  /// In en, this message translates to:
  /// **'Invalid email or password'**
  String get loginPageErrorInvalidCredentials;

  /// No description provided for @loginPageErrorSomethingWentWrong.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong. Please try again.'**
  String get loginPageErrorSomethingWentWrong;

  /// No description provided for @loginPageErrorSessionExpired.
  ///
  /// In en, this message translates to:
  /// **'Your session has expired. Please sign in again.'**
  String get loginPageErrorSessionExpired;

  /// No description provided for @authErrorTitle.
  ///
  /// In en, this message translates to:
  /// **'Authentication Error'**
  String get authErrorTitle;

  /// No description provided for @authErrorSomethingWentWrong.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong during authentication. Please try again.'**
  String get authErrorSomethingWentWrong;

  /// No description provided for @authErrorOauthAccountNotLinked.
  ///
  /// In en, this message translates to:
  /// **'An account with this email already exists. Please sign in with the original authentication method.'**
  String get authErrorOauthAccountNotLinked;

  /// No description provided for @authErrorOauthCallbackError.
  ///
  /// In en, this message translates to:
  /// **'An error occurred during the OAuth callback process.'**
  String get authErrorOauthCallbackError;

  /// No description provided for @authErrorOauthCreateAccountError.
  ///
  /// In en, this message translates to:
  /// **'Failed to create a new account. Please try again.'**
  String get authErrorOauthCreateAccountError;

  /// No description provided for @authErrorOauthSignInError.
  ///
  /// In en, this message translates to:
  /// **'Error signing in with the selected provider. Please try again.'**
  String get authErrorOauthSignInError;

  /// No description provided for @authErrorBackToLogin.
  ///
  /// In en, this message translates to:
  /// **'Back to Login'**
  String get authErrorBackToLogin;

  /// No description provided for @propertyTitle.
  ///
  /// In en, this message translates to:
  /// **'Property Details'**
  String get propertyTitle;

  /// No description provided for @propertyBackToProperties.
  ///
  /// In en, this message translates to:
  /// **'Back to Properties'**
  String get propertyBackToProperties;

  /// No description provided for @propertyEditProperty.
  ///
  /// In en, this message translates to:
  /// **'Edit Property'**
  String get propertyEditProperty;

  /// No description provided for @propertyDeleteProperty.
  ///
  /// In en, this message translates to:
  /// **'Delete Property'**
  String get propertyDeleteProperty;

  /// No description provided for @propertyCreateProperty.
  ///
  /// In en, this message translates to:
  /// **'Create Property'**
  String get propertyCreateProperty;

  /// No description provided for @propertyAddProperty.
  ///
  /// In en, this message translates to:
  /// **'Add Property'**
  String get propertyAddProperty;

  /// No description provided for @propertyLoading.
  ///
  /// In en, this message translates to:
  /// **'Loading property...'**
  String get propertyLoading;

  /// No description provided for @propertyNotFound.
  ///
  /// In en, this message translates to:
  /// **'Property not found.'**
  String get propertyNotFound;

  /// No description provided for @propertyDebugInfo.
  ///
  /// In en, this message translates to:
  /// **'Debug info:'**
  String get propertyDebugInfo;

  /// No description provided for @propertyConfirmDeleteTitle.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to delete this property?'**
  String get propertyConfirmDeleteTitle;

  /// No description provided for @propertyConfirmDeleteDescription.
  ///
  /// In en, this message translates to:
  /// **'This action cannot be undone. All data associated with this property will be permanently removed.'**
  String get propertyConfirmDeleteDescription;

  /// No description provided for @propertyConfirmDeleteCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get propertyConfirmDeleteCancel;

  /// No description provided for @propertyConfirmDeleteConfirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm Delete'**
  String get propertyConfirmDeleteConfirm;

  /// No description provided for @propertyTabsOverview.
  ///
  /// In en, this message translates to:
  /// **'Overview'**
  String get propertyTabsOverview;

  /// No description provided for @propertyTabsFeatures.
  ///
  /// In en, this message translates to:
  /// **'Features'**
  String get propertyTabsFeatures;

  /// No description provided for @propertyTabsAmenities.
  ///
  /// In en, this message translates to:
  /// **'Amenities'**
  String get propertyTabsAmenities;

  /// No description provided for @propertyTabsLocation.
  ///
  /// In en, this message translates to:
  /// **'Location'**
  String get propertyTabsLocation;

  /// No description provided for @propertyTabsDocuments.
  ///
  /// In en, this message translates to:
  /// **'Documents'**
  String get propertyTabsDocuments;

  /// No description provided for @propertyTabsHistory.
  ///
  /// In en, this message translates to:
  /// **'History'**
  String get propertyTabsHistory;

  /// No description provided for @propertySectionsBasicInfo.
  ///
  /// In en, this message translates to:
  /// **'Basic Information'**
  String get propertySectionsBasicInfo;

  /// No description provided for @propertySectionsPhysicalCharacteristics.
  ///
  /// In en, this message translates to:
  /// **'Physical Characteristics'**
  String get propertySectionsPhysicalCharacteristics;

  /// No description provided for @propertySectionsContactInfo.
  ///
  /// In en, this message translates to:
  /// **'Contact Information'**
  String get propertySectionsContactInfo;

  /// No description provided for @propertySectionsRelatedEntities.
  ///
  /// In en, this message translates to:
  /// **'Related Entities'**
  String get propertySectionsRelatedEntities;

  /// No description provided for @propertySectionsMetadata.
  ///
  /// In en, this message translates to:
  /// **'Metadata'**
  String get propertySectionsMetadata;

  /// No description provided for @propertySectionsFeatures.
  ///
  /// In en, this message translates to:
  /// **'Features'**
  String get propertySectionsFeatures;

  /// No description provided for @propertySectionsAmenities.
  ///
  /// In en, this message translates to:
  /// **'Amenities'**
  String get propertySectionsAmenities;

  /// No description provided for @propertySectionsLocationInfo.
  ///
  /// In en, this message translates to:
  /// **'Location Information'**
  String get propertySectionsLocationInfo;

  /// No description provided for @propertyFieldsTitle.
  ///
  /// In en, this message translates to:
  /// **'Title'**
  String get propertyFieldsTitle;

  /// No description provided for @propertyFieldsDescription.
  ///
  /// In en, this message translates to:
  /// **'Description'**
  String get propertyFieldsDescription;

  /// No description provided for @propertyFieldsPropertyType.
  ///
  /// In en, this message translates to:
  /// **'Property Type'**
  String get propertyFieldsPropertyType;

  /// No description provided for @propertyFieldsStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get propertyFieldsStatus;

  /// No description provided for @propertyFieldsCategory.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get propertyFieldsCategory;

  /// No description provided for @propertyFieldsBuildingClass.
  ///
  /// In en, this message translates to:
  /// **'Building Class'**
  String get propertyFieldsBuildingClass;

  /// No description provided for @propertyFieldsCondition.
  ///
  /// In en, this message translates to:
  /// **'Condition'**
  String get propertyFieldsCondition;

  /// No description provided for @propertyFieldsSize.
  ///
  /// In en, this message translates to:
  /// **'Size (m²)'**
  String get propertyFieldsSize;

  /// No description provided for @propertyFieldsBedrooms.
  ///
  /// In en, this message translates to:
  /// **'Bedrooms'**
  String get propertyFieldsBedrooms;

  /// No description provided for @propertyFieldsBathrooms.
  ///
  /// In en, this message translates to:
  /// **'Bathrooms'**
  String get propertyFieldsBathrooms;

  /// No description provided for @propertyFieldsYearBuilt.
  ///
  /// In en, this message translates to:
  /// **'Year Built'**
  String get propertyFieldsYearBuilt;

  /// No description provided for @propertyFieldsContactEmail.
  ///
  /// In en, this message translates to:
  /// **'Contact Email'**
  String get propertyFieldsContactEmail;

  /// No description provided for @propertyFieldsContactPhone.
  ///
  /// In en, this message translates to:
  /// **'Contact Phone'**
  String get propertyFieldsContactPhone;

  /// No description provided for @propertyFieldsOwner.
  ///
  /// In en, this message translates to:
  /// **'Owner'**
  String get propertyFieldsOwner;

  /// No description provided for @propertyFieldsAgent.
  ///
  /// In en, this message translates to:
  /// **'Agent'**
  String get propertyFieldsAgent;

  /// No description provided for @propertyFieldsAgency.
  ///
  /// In en, this message translates to:
  /// **'Agency'**
  String get propertyFieldsAgency;

  /// No description provided for @propertyFieldsCreated.
  ///
  /// In en, this message translates to:
  /// **'Created'**
  String get propertyFieldsCreated;

  /// No description provided for @propertyFieldsUpdated.
  ///
  /// In en, this message translates to:
  /// **'Updated'**
  String get propertyFieldsUpdated;

  /// No description provided for @propertyFieldsListed.
  ///
  /// In en, this message translates to:
  /// **'Listed'**
  String get propertyFieldsListed;

  /// No description provided for @propertyFieldsAddress.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get propertyFieldsAddress;

  /// No description provided for @propertyFieldsCity.
  ///
  /// In en, this message translates to:
  /// **'City'**
  String get propertyFieldsCity;

  /// No description provided for @propertyFieldsStateProvince.
  ///
  /// In en, this message translates to:
  /// **'State/Province'**
  String get propertyFieldsStateProvince;

  /// No description provided for @propertyFieldsPostalCode.
  ///
  /// In en, this message translates to:
  /// **'Postal Code'**
  String get propertyFieldsPostalCode;

  /// No description provided for @propertyFieldsCountry.
  ///
  /// In en, this message translates to:
  /// **'Country'**
  String get propertyFieldsCountry;

  /// No description provided for @propertyFieldsCoordinates.
  ///
  /// In en, this message translates to:
  /// **'Coordinates'**
  String get propertyFieldsCoordinates;

  /// No description provided for @propertyFieldsLatitude.
  ///
  /// In en, this message translates to:
  /// **'Latitude'**
  String get propertyFieldsLatitude;

  /// No description provided for @propertyFieldsLongitude.
  ///
  /// In en, this message translates to:
  /// **'Longitude'**
  String get propertyFieldsLongitude;

  /// No description provided for @propertyNoFeatures.
  ///
  /// In en, this message translates to:
  /// **'No features listed'**
  String get propertyNoFeatures;

  /// No description provided for @propertyNoAmenities.
  ///
  /// In en, this message translates to:
  /// **'No amenities listed'**
  String get propertyNoAmenities;

  /// No description provided for @propertyNoCoordinates.
  ///
  /// In en, this message translates to:
  /// **'No coordinates available'**
  String get propertyNoCoordinates;

  /// No description provided for @propertySuccessDeleted.
  ///
  /// In en, this message translates to:
  /// **'Property deleted successfully'**
  String get propertySuccessDeleted;

  /// No description provided for @propertySuccessCreated.
  ///
  /// In en, this message translates to:
  /// **'Property created successfully'**
  String get propertySuccessCreated;

  /// No description provided for @propertySuccessUpdated.
  ///
  /// In en, this message translates to:
  /// **'Property updated successfully'**
  String get propertySuccessUpdated;

  /// No description provided for @propertyErrorDelete.
  ///
  /// In en, this message translates to:
  /// **'Failed to delete property'**
  String get propertyErrorDelete;

  /// No description provided for @propertyErrorCreate.
  ///
  /// In en, this message translates to:
  /// **'Failed to create property'**
  String get propertyErrorCreate;

  /// No description provided for @propertyErrorUpdate.
  ///
  /// In en, this message translates to:
  /// **'Failed to update property'**
  String get propertyErrorUpdate;

  /// No description provided for @propertyErrorFetch.
  ///
  /// In en, this message translates to:
  /// **'Failed to fetch property details'**
  String get propertyErrorFetch;

  /// No description provided for @adminDashboard.
  ///
  /// In en, this message translates to:
  /// **'Dashboard'**
  String get adminDashboard;

  /// No description provided for @adminProperties.
  ///
  /// In en, this message translates to:
  /// **'Properties'**
  String get adminProperties;

  /// No description provided for @adminAgents.
  ///
  /// In en, this message translates to:
  /// **'Agents'**
  String get adminAgents;

  /// No description provided for @adminAgencies.
  ///
  /// In en, this message translates to:
  /// **'Agencies'**
  String get adminAgencies;

  /// No description provided for @adminOwners.
  ///
  /// In en, this message translates to:
  /// **'Owners'**
  String get adminOwners;

  /// No description provided for @adminTenants.
  ///
  /// In en, this message translates to:
  /// **'Tenants'**
  String get adminTenants;

  /// Label for the admin sidebar payments section
  ///
  /// In en, this message translates to:
  /// **'Payments'**
  String get adminPayments;

  /// No description provided for @adminTasks.
  ///
  /// In en, this message translates to:
  /// **'Tasks'**
  String get adminTasks;

  /// No description provided for @adminMessages.
  ///
  /// In en, this message translates to:
  /// **'Messages'**
  String get adminMessages;

  /// No description provided for @adminReports.
  ///
  /// In en, this message translates to:
  /// **'Reports'**
  String get adminReports;

  /// No description provided for @adminAnalytics.
  ///
  /// In en, this message translates to:
  /// **'Analytics'**
  String get adminAnalytics;

  /// No description provided for @adminSettings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get adminSettings;

  /// No description provided for @adminNotifications.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get adminNotifications;

  /// No description provided for @account_id.
  ///
  /// In en, this message translates to:
  /// **'Account ID'**
  String get account_id;

  /// No description provided for @account_type.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get account_type;

  /// No description provided for @account_provider.
  ///
  /// In en, this message translates to:
  /// **'Provider'**
  String get account_provider;

  /// No description provided for @accountFilter_type_BANK.
  ///
  /// In en, this message translates to:
  /// **'Bank Account'**
  String get accountFilter_type_BANK;

  /// No description provided for @accountFilter_type_CREDIT_CARD.
  ///
  /// In en, this message translates to:
  /// **'Credit Card'**
  String get accountFilter_type_CREDIT_CARD;

  /// No description provided for @accountFilter_type_INVESTMENT.
  ///
  /// In en, this message translates to:
  /// **'Investment Account'**
  String get accountFilter_type_INVESTMENT;

  /// No description provided for @accountFilter_type_SAVINGS.
  ///
  /// In en, this message translates to:
  /// **'Savings Account'**
  String get accountFilter_type_SAVINGS;

  /// No description provided for @accountFilter_type_LOAN.
  ///
  /// In en, this message translates to:
  /// **'Loan Account'**
  String get accountFilter_type_LOAN;

  /// No description provided for @accountFilter_type_OTHER.
  ///
  /// In en, this message translates to:
  /// **'Other Account'**
  String get accountFilter_type_OTHER;

  /// No description provided for @facilityDetailTitle.
  ///
  /// In en, this message translates to:
  /// **'Facility Details'**
  String get facilityDetailTitle;

  /// No description provided for @facilityDetailId.
  ///
  /// In en, this message translates to:
  /// **'ID'**
  String get facilityDetailId;

  /// No description provided for @facilityDetailName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get facilityDetailName;

  /// No description provided for @facilityDetailDescription.
  ///
  /// In en, this message translates to:
  /// **'Description'**
  String get facilityDetailDescription;

  /// No description provided for @facilityDetailType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get facilityDetailType;

  /// No description provided for @facilityDetailStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get facilityDetailStatus;

  /// No description provided for @facilityDetailPropertyId.
  ///
  /// In en, this message translates to:
  /// **'Property ID'**
  String get facilityDetailPropertyId;

  /// No description provided for @facilityDetailLocation.
  ///
  /// In en, this message translates to:
  /// **'Location'**
  String get facilityDetailLocation;

  /// No description provided for @facilityDetailMetadata.
  ///
  /// In en, this message translates to:
  /// **'Metadata'**
  String get facilityDetailMetadata;

  /// No description provided for @facilityDetailCreatedBy.
  ///
  /// In en, this message translates to:
  /// **'Created By'**
  String get facilityDetailCreatedBy;

  /// No description provided for @facilityDetailUpdatedBy.
  ///
  /// In en, this message translates to:
  /// **'Updated By'**
  String get facilityDetailUpdatedBy;

  /// No description provided for @facilityDetailCreatedAt.
  ///
  /// In en, this message translates to:
  /// **'Created At'**
  String get facilityDetailCreatedAt;

  /// No description provided for @facilityDetailUpdatedAt.
  ///
  /// In en, this message translates to:
  /// **'Updated At'**
  String get facilityDetailUpdatedAt;

  /// No description provided for @facilityDetailDeletedAt.
  ///
  /// In en, this message translates to:
  /// **'Deleted At'**
  String get facilityDetailDeletedAt;

  /// No description provided for @complianceRecordDetailTitle.
  ///
  /// In en, this message translates to:
  /// **'Compliance Record Details'**
  String get complianceRecordDetailTitle;

  /// No description provided for @complianceRecordType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get complianceRecordType;

  /// No description provided for @complianceRecordStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get complianceRecordStatus;

  /// No description provided for @complianceRecordMetadata.
  ///
  /// In en, this message translates to:
  /// **'Metadata'**
  String get complianceRecordMetadata;

  /// No description provided for @complianceRecordCustomFields.
  ///
  /// In en, this message translates to:
  /// **'Custom Fields'**
  String get complianceRecordCustomFields;

  /// No description provided for @analyticsDetailTitle.
  ///
  /// In en, this message translates to:
  /// **'Analytics Details'**
  String get analyticsDetailTitle;

  /// No description provided for @analyticsType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get analyticsType;

  /// No description provided for @analyticsEntityType.
  ///
  /// In en, this message translates to:
  /// **'Entity Type'**
  String get analyticsEntityType;

  /// No description provided for @analyticsEntityId.
  ///
  /// In en, this message translates to:
  /// **'Entity ID'**
  String get analyticsEntityId;

  /// No description provided for @analyticsTimestamp.
  ///
  /// In en, this message translates to:
  /// **'Timestamp'**
  String get analyticsTimestamp;

  /// No description provided for @analyticsPropertyId.
  ///
  /// In en, this message translates to:
  /// **'Property ID'**
  String get analyticsPropertyId;

  /// No description provided for @analyticsUserId.
  ///
  /// In en, this message translates to:
  /// **'User ID'**
  String get analyticsUserId;

  /// No description provided for @analyticsAgentId.
  ///
  /// In en, this message translates to:
  /// **'Agent ID'**
  String get analyticsAgentId;

  /// No description provided for @analyticsAgencyId.
  ///
  /// In en, this message translates to:
  /// **'Agency ID'**
  String get analyticsAgencyId;

  /// No description provided for @analyticsReservationId.
  ///
  /// In en, this message translates to:
  /// **'Reservation ID'**
  String get analyticsReservationId;

  /// No description provided for @analyticsTaskId.
  ///
  /// In en, this message translates to:
  /// **'Task ID'**
  String get analyticsTaskId;

  /// No description provided for @analyticsDeletedAt.
  ///
  /// In en, this message translates to:
  /// **'Deleted At'**
  String get analyticsDeletedAt;

  /// No description provided for @analyticsCreatedAt.
  ///
  /// In en, this message translates to:
  /// **'Created At'**
  String get analyticsCreatedAt;

  /// No description provided for @analyticsUpdatedAt.
  ///
  /// In en, this message translates to:
  /// **'Updated At'**
  String get analyticsUpdatedAt;

  /// No description provided for @analyticsData.
  ///
  /// In en, this message translates to:
  /// **'Data'**
  String get analyticsData;

  /// No description provided for @analyticsAgency.
  ///
  /// In en, this message translates to:
  /// **'Agency'**
  String get analyticsAgency;

  /// No description provided for @analyticsAgent.
  ///
  /// In en, this message translates to:
  /// **'Agent'**
  String get analyticsAgent;

  /// No description provided for @analyticsTypeListingView.
  ///
  /// In en, this message translates to:
  /// **'Listing View'**
  String get analyticsTypeListingView;

  /// No description provided for @analyticsTypeBookingConversion.
  ///
  /// In en, this message translates to:
  /// **'Booking Conversion'**
  String get analyticsTypeBookingConversion;

  /// No description provided for @analyticsTypeUserEngagement.
  ///
  /// In en, this message translates to:
  /// **'User Engagement'**
  String get analyticsTypeUserEngagement;

  /// No description provided for @analyticsTypeRevenue.
  ///
  /// In en, this message translates to:
  /// **'Revenue'**
  String get analyticsTypeRevenue;

  /// No description provided for @analyticsTypePerformance.
  ///
  /// In en, this message translates to:
  /// **'Performance'**
  String get analyticsTypePerformance;

  /// No description provided for @analyticsTypeAgentPerformance.
  ///
  /// In en, this message translates to:
  /// **'Agent Performance'**
  String get analyticsTypeAgentPerformance;

  /// No description provided for @analyticsTypeAgencyPerformance.
  ///
  /// In en, this message translates to:
  /// **'Agency Performance'**
  String get analyticsTypeAgencyPerformance;

  /// No description provided for @analyticsTypeView.
  ///
  /// In en, this message translates to:
  /// **'View'**
  String get analyticsTypeView;

  /// No description provided for @contractDetailTitle.
  ///
  /// In en, this message translates to:
  /// **'Contract Details'**
  String get contractDetailTitle;

  /// No description provided for @contractIdLabel.
  ///
  /// In en, this message translates to:
  /// **'ID'**
  String get contractIdLabel;

  /// No description provided for @contractNameLabel.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get contractNameLabel;

  /// No description provided for @contractDescriptionLabel.
  ///
  /// In en, this message translates to:
  /// **'Description'**
  String get contractDescriptionLabel;

  /// No description provided for @contractTypeLabel.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get contractTypeLabel;

  /// No description provided for @contractStatusLabel.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get contractStatusLabel;

  /// No description provided for @contractCurrencyLabel.
  ///
  /// In en, this message translates to:
  /// **'Currency'**
  String get contractCurrencyLabel;

  /// No description provided for @contractRentAmountLabel.
  ///
  /// In en, this message translates to:
  /// **'Rent Amount'**
  String get contractRentAmountLabel;

  /// No description provided for @contractNoticePeriodLabel.
  ///
  /// In en, this message translates to:
  /// **'Notice Period'**
  String get contractNoticePeriodLabel;

  /// No description provided for @contractPropertyIdLabel.
  ///
  /// In en, this message translates to:
  /// **'Property ID'**
  String get contractPropertyIdLabel;

  /// No description provided for @contractTenantIdLabel.
  ///
  /// In en, this message translates to:
  /// **'Tenant ID'**
  String get contractTenantIdLabel;

  /// No description provided for @contractLandlordIdLabel.
  ///
  /// In en, this message translates to:
  /// **'Landlord ID'**
  String get contractLandlordIdLabel;

  /// No description provided for @contractOwnerIdLabel.
  ///
  /// In en, this message translates to:
  /// **'Owner ID'**
  String get contractOwnerIdLabel;

  /// No description provided for @contractAgencyIdLabel.
  ///
  /// In en, this message translates to:
  /// **'Agency ID'**
  String get contractAgencyIdLabel;

  /// No description provided for @contractStartDateLabel.
  ///
  /// In en, this message translates to:
  /// **'Start Date'**
  String get contractStartDateLabel;

  /// No description provided for @contractEndDateLabel.
  ///
  /// In en, this message translates to:
  /// **'End Date'**
  String get contractEndDateLabel;

  /// No description provided for @contractCreatedAtLabel.
  ///
  /// In en, this message translates to:
  /// **'Created At'**
  String get contractCreatedAtLabel;

  /// No description provided for @contractUpdatedAtLabel.
  ///
  /// In en, this message translates to:
  /// **'Updated At'**
  String get contractUpdatedAtLabel;

  /// No description provided for @contractDeletedAtLabel.
  ///
  /// In en, this message translates to:
  /// **'Deleted At'**
  String get contractDeletedAtLabel;

  /// No description provided for @contractSignedByLabel.
  ///
  /// In en, this message translates to:
  /// **'Signed By'**
  String get contractSignedByLabel;

  /// No description provided for @contractSignedAtLabel.
  ///
  /// In en, this message translates to:
  /// **'Signed At'**
  String get contractSignedAtLabel;

  /// No description provided for @contractTerminatedByLabel.
  ///
  /// In en, this message translates to:
  /// **'Terminated By'**
  String get contractTerminatedByLabel;

  /// No description provided for @contractTerminatedAtLabel.
  ///
  /// In en, this message translates to:
  /// **'Terminated At'**
  String get contractTerminatedAtLabel;

  /// No description provided for @contractCancelledByLabel.
  ///
  /// In en, this message translates to:
  /// **'Cancelled By'**
  String get contractCancelledByLabel;

  /// No description provided for @contractCancelledAtLabel.
  ///
  /// In en, this message translates to:
  /// **'Cancelled At'**
  String get contractCancelledAtLabel;

  /// No description provided for @contractTermsLabel.
  ///
  /// In en, this message translates to:
  /// **'Terms:'**
  String get contractTermsLabel;

  /// No description provided for @contractConditionsLabel.
  ///
  /// In en, this message translates to:
  /// **'Conditions:'**
  String get contractConditionsLabel;

  /// No description provided for @contractTypeRental.
  ///
  /// In en, this message translates to:
  /// **'Rental'**
  String get contractTypeRental;

  /// No description provided for @contractTypeSale.
  ///
  /// In en, this message translates to:
  /// **'Sale'**
  String get contractTypeSale;

  /// No description provided for @contractTypeManagement.
  ///
  /// In en, this message translates to:
  /// **'Management'**
  String get contractTypeManagement;

  /// No description provided for @contractTypeCommission.
  ///
  /// In en, this message translates to:
  /// **'Commission'**
  String get contractTypeCommission;

  /// No description provided for @contractTypeService.
  ///
  /// In en, this message translates to:
  /// **'Service'**
  String get contractTypeService;

  /// No description provided for @contractStatusDraft.
  ///
  /// In en, this message translates to:
  /// **'Draft'**
  String get contractStatusDraft;

  /// Status label for active contracts.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get contractStatusActive;

  /// No description provided for @contractStatusExpired.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get contractStatusExpired;

  /// No description provided for @contractStatusTerminated.
  ///
  /// In en, this message translates to:
  /// **'Terminated'**
  String get contractStatusTerminated;

  /// No description provided for @contractStatusRenewed.
  ///
  /// In en, this message translates to:
  /// **'Renewed'**
  String get contractStatusRenewed;

  /// No description provided for @contractStatusPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get contractStatusPending;

  /// No description provided for @contractStatusArchived.
  ///
  /// In en, this message translates to:
  /// **'Archived'**
  String get contractStatusArchived;

  /// No description provided for @taxRecordAny.
  ///
  /// In en, this message translates to:
  /// **'Any'**
  String get taxRecordAny;

  /// No description provided for @taxRecordPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get taxRecordPaid;

  /// No description provided for @taxRecordUnpaid.
  ///
  /// In en, this message translates to:
  /// **'Unpaid'**
  String get taxRecordUnpaid;

  /// No description provided for @taxRecordsTitle.
  ///
  /// In en, this message translates to:
  /// **'Tax Records'**
  String get taxRecordsTitle;

  /// No description provided for @eventType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get eventType;

  /// No description provided for @eventStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get eventStatus;

  /// No description provided for @eventProperty.
  ///
  /// In en, this message translates to:
  /// **'Property'**
  String get eventProperty;

  /// No description provided for @eventAttendees.
  ///
  /// In en, this message translates to:
  /// **'Attendees'**
  String get eventAttendees;

  /// No description provided for @eventDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get eventDate;

  /// No description provided for @eventListTitle.
  ///
  /// In en, this message translates to:
  /// **'Events'**
  String get eventListTitle;

  /// No description provided for @eventGallery.
  ///
  /// In en, this message translates to:
  /// **'Gallery'**
  String get eventGallery;

  /// No description provided for @pricingRuleName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get pricingRuleName;

  /// No description provided for @pricingRuleType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get pricingRuleType;

  /// No description provided for @pricingRuleStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get pricingRuleStatus;

  /// No description provided for @pricingRuleMultiplier.
  ///
  /// In en, this message translates to:
  /// **'Multiplier'**
  String get pricingRuleMultiplier;

  /// No description provided for @pricingRuleFixedPrice.
  ///
  /// In en, this message translates to:
  /// **'Fixed Price'**
  String get pricingRuleFixedPrice;

  /// No description provided for @pricingRuleIsActive.
  ///
  /// In en, this message translates to:
  /// **'Is Active'**
  String get pricingRuleIsActive;

  /// No description provided for @pricingRulePropertyId.
  ///
  /// In en, this message translates to:
  /// **'Property ID'**
  String get pricingRulePropertyId;

  /// No description provided for @pricingRuleCreatedAt.
  ///
  /// In en, this message translates to:
  /// **'Created At'**
  String get pricingRuleCreatedAt;

  /// No description provided for @pricingRuleUpdatedAt.
  ///
  /// In en, this message translates to:
  /// **'Updated At'**
  String get pricingRuleUpdatedAt;

  /// No description provided for @pricingRuleDeletedAt.
  ///
  /// In en, this message translates to:
  /// **'Deleted At'**
  String get pricingRuleDeletedAt;

  /// No description provided for @pricingRuleConditions.
  ///
  /// In en, this message translates to:
  /// **'Conditions'**
  String get pricingRuleConditions;

  /// No description provided for @pricingRuleProperty.
  ///
  /// In en, this message translates to:
  /// **'Property'**
  String get pricingRuleProperty;

  /// No description provided for @mentionType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get mentionType;

  /// No description provided for @mentionStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get mentionStatus;

  /// No description provided for @taskType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get taskType;

  /// No description provided for @taskStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get taskStatus;

  /// No description provided for @taskPriority.
  ///
  /// In en, this message translates to:
  /// **'Priority'**
  String get taskPriority;

  /// No description provided for @taskAssignedTo.
  ///
  /// In en, this message translates to:
  /// **'Assigned To'**
  String get taskAssignedTo;

  /// No description provided for @taskCreatedAt.
  ///
  /// In en, this message translates to:
  /// **'Created At'**
  String get taskCreatedAt;

  /// No description provided for @taskUpdatedAt.
  ///
  /// In en, this message translates to:
  /// **'Updated At'**
  String get taskUpdatedAt;

  /// No description provided for @taskDeletedAt.
  ///
  /// In en, this message translates to:
  /// **'Deleted At'**
  String get taskDeletedAt;

  /// No description provided for @guestStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get guestStatus;

  /// No description provided for @guestPhoneNumber.
  ///
  /// In en, this message translates to:
  /// **'Phone Number'**
  String get guestPhoneNumber;

  /// No description provided for @reviewType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get reviewType;

  /// No description provided for @reviewStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get reviewStatus;

  /// No description provided for @notificationType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get notificationType;

  /// No description provided for @notificationStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get notificationStatus;

  /// No description provided for @messageType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get messageType;

  /// No description provided for @messageStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get messageStatus;

  /// No description provided for @accountType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get accountType;

  /// No description provided for @accountStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get accountStatus;

  /// No description provided for @complianceTypeLicense.
  ///
  /// In en, this message translates to:
  /// **'License'**
  String get complianceTypeLicense;

  /// No description provided for @complianceTypeCertification.
  ///
  /// In en, this message translates to:
  /// **'Certification'**
  String get complianceTypeCertification;

  /// No description provided for @complianceTypeInsurance.
  ///
  /// In en, this message translates to:
  /// **'Insurance'**
  String get complianceTypeInsurance;

  /// No description provided for @complianceTypePermit.
  ///
  /// In en, this message translates to:
  /// **'Permit'**
  String get complianceTypePermit;

  /// No description provided for @complianceTypeOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get complianceTypeOther;

  /// No description provided for @complianceStatusPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get complianceStatusPending;

  /// No description provided for @complianceStatusApproved.
  ///
  /// In en, this message translates to:
  /// **'Approved'**
  String get complianceStatusApproved;

  /// No description provided for @complianceStatusRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get complianceStatusRejected;

  /// No description provided for @complianceStatusExpired.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get complianceStatusExpired;

  /// No description provided for @commonYes.
  ///
  /// In en, this message translates to:
  /// **'Yes'**
  String get commonYes;

  /// No description provided for @commonNo.
  ///
  /// In en, this message translates to:
  /// **'No'**
  String get commonNo;

  /// Filter option for OAuth account type
  ///
  /// In en, this message translates to:
  /// **'OAuth'**
  String get accountFilter_type_oauth;

  /// Filter option for Email account type
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get accountFilter_type_email;

  /// Filter option for OIDC account type
  ///
  /// In en, this message translates to:
  /// **'OIDC'**
  String get accountFilter_type_oidc;

  /// Filter option for Credentials account type
  ///
  /// In en, this message translates to:
  /// **'Credentials'**
  String get accountFilter_type_credentials;

  /// Filter option for Google account type
  ///
  /// In en, this message translates to:
  /// **'Google'**
  String get accountFilter_type_google;

  /// No description provided for @adminUsers.
  ///
  /// In en, this message translates to:
  /// **'Users'**
  String get adminUsers;

  /// No description provided for @adminExpenses.
  ///
  /// In en, this message translates to:
  /// **'Expenses'**
  String get adminExpenses;

  /// No description provided for @adminFacilities.
  ///
  /// In en, this message translates to:
  /// **'Facilities'**
  String get adminFacilities;

  /// No description provided for @adminHelpdesk.
  ///
  /// In en, this message translates to:
  /// **'Help Desk'**
  String get adminHelpdesk;

  /// No description provided for @adminSubscriptions.
  ///
  /// In en, this message translates to:
  /// **'Subscriptions'**
  String get adminSubscriptions;

  /// No description provided for @adminContracts.
  ///
  /// In en, this message translates to:
  /// **'Contracts'**
  String get adminContracts;

  /// No description provided for @adminGuests.
  ///
  /// In en, this message translates to:
  /// **'Guests'**
  String get adminGuests;

  /// No description provided for @adminCompliance.
  ///
  /// In en, this message translates to:
  /// **'Compliance'**
  String get adminCompliance;

  /// No description provided for @adminPricingRules.
  ///
  /// In en, this message translates to:
  /// **'Pricing Rules'**
  String get adminPricingRules;

  /// No description provided for @adminReviews.
  ///
  /// In en, this message translates to:
  /// **'Reviews'**
  String get adminReviews;

  /// Filter option for Facebook account type
  ///
  /// In en, this message translates to:
  /// **'Facebook'**
  String get accountFilter_type_facebook;

  /// Tooltip for editing an agent.
  ///
  /// In en, this message translates to:
  /// **'Edit Agent'**
  String get edit_agent_tooltip;

  /// Title for agent contact information section.
  ///
  /// In en, this message translates to:
  /// **'Contact Information'**
  String get agent_contact_information_title;

  /// Label for agent's email address.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get agent_email_label;

  /// Label for agent's phone number.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get agent_phone_label;

  /// Label for agent's address.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get agent_address_label;

  /// Label for agent's website.
  ///
  /// In en, this message translates to:
  /// **'Website'**
  String get agent_website_label;

  /// Title for agent professional information section.
  ///
  /// In en, this message translates to:
  /// **'Professional Information'**
  String get agent_professional_information_title;

  /// Label for agent's status.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get agent_status_label;

  /// Label for agent's agency.
  ///
  /// In en, this message translates to:
  /// **'Agency'**
  String get agent_agency_label;

  /// Label for agent's specialities/expertise.
  ///
  /// In en, this message translates to:
  /// **'Specialities'**
  String get agent_specialities_label;

  /// Title for agent's recent activity section.
  ///
  /// In en, this message translates to:
  /// **'Recent Activity'**
  String get agent_activity_title;

  /// Label for when the agent was last active.
  ///
  /// In en, this message translates to:
  /// **'Last Active'**
  String get agent_last_active_label;

  /// Label to indicate if the agent is active.
  ///
  /// In en, this message translates to:
  /// **'Is Active'**
  String get agent_is_active_label;

  /// Label for when the agent was created.
  ///
  /// In en, this message translates to:
  /// **'Created At'**
  String get agent_created_at_label;

  /// Label for not available fields or data.
  ///
  /// In en, this message translates to:
  /// **'Not available'**
  String get common_not_available;

  /// Affirmative response, yes.
  ///
  /// In en, this message translates to:
  /// **'Yes'**
  String get common_yes;

  /// Negative response, no.
  ///
  /// In en, this message translates to:
  /// **'No'**
  String get common_no;

  /// Title for the availability edit screen.
  ///
  /// In en, this message translates to:
  /// **'Edit Availability'**
  String get availability_edit_title;

  /// Label for save button.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get common_save;

  /// Label for availability date field.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get availability_date;

  /// Label for when availability date is not set.
  ///
  /// In en, this message translates to:
  /// **'Not set'**
  String get availability_not_set;

  /// Label for blocked availability status.
  ///
  /// In en, this message translates to:
  /// **'Blocked'**
  String get availability_blocked;

  /// Label for booked availability status.
  ///
  /// In en, this message translates to:
  /// **'Booked'**
  String get availability_booked;

  /// Label for property ID field.
  ///
  /// In en, this message translates to:
  /// **'Property ID'**
  String get availability_property_id;

  /// Label for reservation ID field.
  ///
  /// In en, this message translates to:
  /// **'Reservation ID'**
  String get availability_reservation_id;

  /// Label for pricing rule ID field.
  ///
  /// In en, this message translates to:
  /// **'Pricing Rule ID'**
  String get availability_pricing_rule_id;

  /// Label for total units field.
  ///
  /// In en, this message translates to:
  /// **'Total Units'**
  String get availability_total_units;

  /// Label for available units field.
  ///
  /// In en, this message translates to:
  /// **'Available Units'**
  String get availability_available_units;

  /// Label for booked units field.
  ///
  /// In en, this message translates to:
  /// **'Booked Units'**
  String get availability_booked_units;

  /// Label for blocked units field.
  ///
  /// In en, this message translates to:
  /// **'Blocked Units'**
  String get availability_blocked_units;

  /// Label for base price field.
  ///
  /// In en, this message translates to:
  /// **'Base Price'**
  String get availability_base_price;

  /// Label for current price field.
  ///
  /// In en, this message translates to:
  /// **'Current Price'**
  String get availability_current_price;

  /// Label for special pricing JSON field.
  ///
  /// In en, this message translates to:
  /// **'Special Pricing (JSON)'**
  String get availability_special_pricing_json;

  /// Label for price settings JSON field.
  ///
  /// In en, this message translates to:
  /// **'Price Settings (JSON)'**
  String get availability_price_settings_json;

  /// Label for minimum nights field.
  ///
  /// In en, this message translates to:
  /// **'Minimum Nights'**
  String get availability_min_nights;

  /// Label for maximum nights field.
  ///
  /// In en, this message translates to:
  /// **'Maximum Nights'**
  String get availability_max_nights;

  /// Label for maximum guests field.
  ///
  /// In en, this message translates to:
  /// **'Maximum Guests'**
  String get availability_max_guests;

  /// Label for discount settings JSON field.
  ///
  /// In en, this message translates to:
  /// **'Discount Settings (JSON)'**
  String get availability_discount_settings_json;

  /// Label for weekend rate field.
  ///
  /// In en, this message translates to:
  /// **'Weekend Rate'**
  String get availability_weekend_rate;

  /// Label for weekday rate field.
  ///
  /// In en, this message translates to:
  /// **'Weekday Rate'**
  String get availability_weekday_rate;

  /// Label for weekend multiplier field.
  ///
  /// In en, this message translates to:
  /// **'Weekend Multiplier'**
  String get availability_weekend_multiplier;

  /// Label for weekday multiplier field.
  ///
  /// In en, this message translates to:
  /// **'Weekday Multiplier'**
  String get availability_weekday_multiplier;

  /// Label for seasonal multiplier field.
  ///
  /// In en, this message translates to:
  /// **'Seasonal Multiplier'**
  String get availability_seasonal_multiplier;

  /// Facility type: Gym.
  ///
  /// In en, this message translates to:
  /// **'Gym'**
  String get facilityTypeGym;

  /// Facility type: Pool.
  ///
  /// In en, this message translates to:
  /// **'Pool'**
  String get facilityTypePool;

  /// Facility type: Parking Lot.
  ///
  /// In en, this message translates to:
  /// **'Parking Lot'**
  String get facilityTypeParkingLot;

  /// Facility type: Laundry.
  ///
  /// In en, this message translates to:
  /// **'Laundry'**
  String get facilityTypeLaundry;

  /// Facility type: Elevator.
  ///
  /// In en, this message translates to:
  /// **'Elevator'**
  String get facilityTypeElevator;

  /// Facility type: Security.
  ///
  /// In en, this message translates to:
  /// **'Security'**
  String get facilityTypeSecurity;

  /// Facility type: Other.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get facilityTypeOther;

  /// Facility status: Available.
  ///
  /// In en, this message translates to:
  /// **'Available'**
  String get facilityStatusAvailable;

  /// Facility status: Unavailable.
  ///
  /// In en, this message translates to:
  /// **'Unavailable'**
  String get facilityStatusUnavailable;

  /// Facility status: Maintenance.
  ///
  /// In en, this message translates to:
  /// **'Maintenance'**
  String get facilityStatusMaintenance;
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

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'de':
      return AppLocalizationsDe();
    case 'en':
      return AppLocalizationsEn();
    case 'es':
      return AppLocalizationsEs();
    case 'fa':
      return AppLocalizationsFa();
    case 'fr':
      return AppLocalizationsFr();
    case 'hi':
      return AppLocalizationsHi();
    case 'it':
      return AppLocalizationsIt();
    case 'ja':
      return AppLocalizationsJa();
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
