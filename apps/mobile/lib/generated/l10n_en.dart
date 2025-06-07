// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'Menem';

  @override
  String get dashboard => 'Dashboard';

  @override
  String get manageProperties => 'Manage your properties effectively';

  @override
  String get quickAccess => 'Quick Access';

  @override
  String get properties => 'Properties';

  @override
  String get tenants => 'Tenants';

  @override
  String get payments => 'Payments';

  @override
  String get tasks => 'Tasks';

  @override
  String get summaryStatistics => 'Summary Statistics';

  @override
  String get totalProperties => 'Total Properties';

  @override
  String occupancyRate(Object rate) {
    return 'Occupancy Rate: $rate';
  }

  @override
  String get monthlyCashflow => 'Monthly Cashflow';

  @override
  String pendingPayments(Object count) {
    return 'Pending Payments: $count';
  }

  @override
  String get pendingTasks => 'Pending Tasks';

  @override
  String tasksThisWeek(Object count) {
    return '$count this week';
  }

  @override
  String get propertyDetailTitle => 'Property Details';

  @override
  String get propertyDetailOverviewTab => 'Overview';

  @override
  String get propertyDetailFeaturesTab => 'Features';

  @override
  String get propertyDetailLocationTab => 'Location';

  @override
  String get propertyDetailGalleryTab => 'Gallery';

  @override
  String get propertyDetailId => 'ID';

  @override
  String get propertyDetailNumber => 'Property Number';

  @override
  String get propertyDetailTitleField => 'Title';

  @override
  String get propertyDetailDescription => 'Description';

  @override
  String get propertyDetailType => 'Type';

  @override
  String get propertyDetailStatus => 'Status';

  @override
  String get propertyDetailCategory => 'Category';

  @override
  String get propertyDetailCondition => 'Condition';

  @override
  String get propertyDetailMarketValue => 'Market Value';

  @override
  String get propertyDetailBedrooms => 'Bedrooms';

  @override
  String get propertyDetailBathrooms => 'Bathrooms';

  @override
  String get propertyDetailYearBuilt => 'Year Built';

  @override
  String get propertyDetailFeatures => 'Features';

  @override
  String get propertyDetailAmenities => 'Amenities';

  @override
  String get propertyDetailAddress => 'Address';

  @override
  String get propertyDetailCity => 'City';

  @override
  String get propertyDetailState => 'State';

  @override
  String get propertyDetailCountry => 'Country';

  @override
  String get propertyDetailZipCode => 'ZIP Code';

  @override
  String get propertyDetailCoordinates => 'Coordinates';

  @override
  String get propertyDetailNoFeatures => 'No features or amenities available';

  @override
  String get propertyDetailNoLocation => 'No location information available';

  @override
  String get propertyDetailGalleryPlaceholder =>
      'Gallery View (Implement with GridView of Images)';

  @override
  String get propertyDetailDeleteConfirm =>
      'Are you sure you want to delete this property?';

  @override
  String get propertyDetailDeleteSuccess => 'Property deleted successfully';

  @override
  String propertyDetailDeleteFailed(Object error) {
    return 'Failed to delete property: $error';
  }

  @override
  String get propertyDetailContactAgent => 'Contact Agent';

  @override
  String get propertyDetailPrice => 'Price';

  @override
  String get propertyDetailLoading => 'Loading property details...';

  @override
  String get propertyDetailNotFound => 'Property not found.';

  @override
  String get totalTenants => 'Total Tenants';

  @override
  String newTenants(Object count) {
    return 'New Tenants: $count';
  }

  @override
  String get homeLabel => 'Home';

  @override
  String get favoritesEmpty => 'No favorites yet';

  @override
  String get favoritesError => 'Error loading favorites';

  @override
  String get favoritesRetry => 'Retry';

  @override
  String get emptyStateRetry => 'Retry';

  @override
  String get listings => 'My Properties';

  @override
  String get listingsEmpty => 'No listings yet';

  @override
  String get listingsRetry => 'Retry';

  @override
  String get filterPropertiesTitle => 'Filter Properties';

  @override
  String get filterPropertiesApply => 'Apply';

  @override
  String get filterPropertiesCancel => 'Cancel';

  @override
  String get messagesLabel => 'Messages';

  @override
  String get notificationsLabel => 'Notifications';

  @override
  String get notificationsEmpty => 'No notifications yet';

  @override
  String get paymentsLabel => 'Payments';

  @override
  String get settingsLabel => 'Settings';

  @override
  String get settingsAppearance => 'Appearance';

  @override
  String get settingsDarkMode => 'Dark Mode';

  @override
  String get filterTasksTitle => 'Filter Tasks';

  @override
  String get filterTasksStatus => 'Status';

  @override
  String get filterTasksPriority => 'Priority';

  @override
  String get filterTasksType => 'Type';

  @override
  String get filterTasksDueDate => 'Due Date';

  @override
  String get filterTasksApply => 'Apply';

  @override
  String get filterTasksCancel => 'Cancel';

  @override
  String get profileLabel => 'Profile';

  @override
  String get logoutLabel => 'Logout';

  @override
  String get loggingout => 'Logging out...';

  @override
  String get sitetitle => 'RentalProc';

  @override
  String get nav_home => 'Home';

  @override
  String get nav_properties => 'Properties';

  @override
  String get nav_payments => 'Payments';

  @override
  String get nav_tasks => 'Tasks';

  @override
  String get nav_messages => 'Messages';

  @override
  String get nav_notifications => 'Notifications';

  @override
  String get nav_helpdesk => 'Help Desk';

  @override
  String get nav_subscription => 'Subscription';

  @override
  String get nav_settings => 'Settings';

  @override
  String get nav_tenants => 'Tenants';

  @override
  String get nav_expenses => 'Expenses';

  @override
  String get nav_facilities => 'Facilities';

  @override
  String get nav_analytics => 'Analytics';

  @override
  String get nav_help => 'Help';

  @override
  String get nav_logout => 'Logout';

  @override
  String get nav_profile => 'Profile';

  @override
  String get nav_viewAll => 'View All';

  @override
  String get indexTitle => 'Welcome to Menem';

  @override
  String get indexDescription => 'Your property management solution';

  @override
  String get indexPropertyManagementTitle => 'Property Management';

  @override
  String get indexPropertyManagementDescription =>
      'Manage your properties efficiently with our comprehensive suite of tools.';

  @override
  String get indexWaterManagementTitle => 'Water Management';

  @override
  String get indexWaterManagementDescription =>
      'Track and optimize water usage across your properties.';

  @override
  String get authSignIn => 'Sign in with Google';

  @override
  String get authSignOut => 'Sign out';

  @override
  String get createPropertyTitle => 'Create New Property';

  @override
  String get propertyCreatedSuccess => 'Property created successfully';

  @override
  String get propertyCreatedError => 'Failed to create property';

  @override
  String get registerAlreadyHaveAccount => 'Already have an account? Login';

  @override
  String get registerForgotPassword => 'Forgot Password?';

  @override
  String get propertyViewingEventsTitle => 'Viewing Events';

  @override
  String get propertyViewingSchedule => 'Schedule Viewing';

  @override
  String authWelcomeBack(Object name) {
    return 'Welcome back, $name';
  }

  @override
  String get postsCreate => 'Create Post';

  @override
  String get postsTitle => 'Title';

  @override
  String get postsContent => 'Content';

  @override
  String get postsLoading => 'Loading posts...';

  @override
  String get postsSave => 'Save';

  @override
  String get postsCancel => 'Cancel';

  @override
  String get postsEdit => 'Edit';

  @override
  String get postsDelete => 'Delete';

  @override
  String get postsNoPostsYet => 'No posts yet';

  @override
  String get postsErrorUnauthorized =>
      'You must be logged in to perform this action';

  @override
  String get postsErrorCreatePost => 'Failed to create post';

  @override
  String get postsErrorUpdatePost => 'Failed to update post';

  @override
  String get postsErrorDeletePost => 'Failed to delete post';

  @override
  String get chatMessages => 'Messages';

  @override
  String chatChattingWith(Object name) {
    return 'Chatting with $name';
  }

  @override
  String get chatConnectWithUsers => 'Connect with users and get support';

  @override
  String get chatBackToList => 'Back to List';

  @override
  String get chatWelcomeToChat => 'Welcome to Chat';

  @override
  String get chatWelcomeDescription =>
      'Start a conversation with other users or contact support for assistance';

  @override
  String get chatNewMessage => 'New Message';

  @override
  String get chatContactSupport => 'Contact Support';

  @override
  String get chatBack => 'Back';

  @override
  String get chatSearchUsers => 'Search users...';

  @override
  String get chatTypeMessage => 'Type your message...';

  @override
  String get chatSend => 'Send';

  @override
  String get chatErrorUnauthorized =>
      'You must be logged in to perform this action';

  @override
  String get chatErrorSendMessage => 'Failed to send message';

  @override
  String get chatErrorMarkAsRead => 'Failed to mark messages as read';

  @override
  String get chatError => 'Error';

  @override
  String get chatConnectionError =>
      'Failed to connect to chat server. Please try again.';

  @override
  String get chatMessageSendError =>
      'Failed to send your message. Please try again later.';

  @override
  String get notifications_placeholder => 'No notifications yet';

  @override
  String get notificationsPlaceholder => 'No notifications yet';

  @override
  String commonTimeAgo(Object time) {
    return '$time ago';
  }

  @override
  String get commonSuccess => 'Success';

  @override
  String get commonError => 'Error';

  @override
  String propertiesFound(Object count) {
    return '$count properties found';
  }

  @override
  String get errorScreenTitle => 'Error';

  @override
  String get errorScreenGoBack => 'Go Back';

  @override
  String get dateRangeSelectTitle => 'Select Date Range';

  @override
  String get dateRangeSelectApply => 'Apply';

  @override
  String get dateRangeSelectCancel => 'Cancel';

  @override
  String get commonWarning => 'Warning';

  @override
  String get commonInfo => 'Information';

  @override
  String get commonLoading => 'Loading...';

  @override
  String get commonSave => 'Save';

  @override
  String get commonCancel => 'Cancel';

  @override
  String get commonDelete => 'Delete';

  @override
  String get commonEdit => 'Edit';

  @override
  String get commonCreate => 'Create';

  @override
  String get commonView => 'View';

  @override
  String get commonPrevious => 'Previous';

  @override
  String get commonNext => 'Next';

  @override
  String get commonBack => 'Back';

  @override
  String get commonConfirm => 'Confirm';

  @override
  String get commonActions => 'Actions';

  @override
  String get commonSearch => 'Search';

  @override
  String get commonFilter => 'Filter';

  @override
  String get commonSort => 'Sort';

  @override
  String get commonNoData => 'No data available';

  @override
  String get editAgentTooltip => 'Edit Agent';

  @override
  String get agentContactInformationTitle => 'Contact Information';

  @override
  String get agentEmailLabel => 'Email';

  @override
  String get agentPhoneLabel => 'Phone';

  @override
  String get agentAddressLabel => 'Address';

  @override
  String get agentWebsiteLabel => 'Website';

  @override
  String get agentProfessionalInformationTitle => 'Professional Information';

  @override
  String get agentStatusLabel => 'Status';

  @override
  String get agentAgencyLabel => 'Agency';

  @override
  String get agentSpecialitiesLabel => 'Specialities';

  @override
  String get agentActivityTitle => 'Recent Activity';

  @override
  String get agentLastActiveLabel => 'Last Active';

  @override
  String get agentIsActiveLabel => 'Is Active';

  @override
  String get agentCreatedAtLabel => 'Created At';

  @override
  String get agentAdditionalInformationTitle => 'Additional Information';

  @override
  String get agentBioLabel => 'Bio';

  @override
  String get agentExternalIdLabel => 'External ID';

  @override
  String get agentSettingsLabel => 'Settings';

  @override
  String get agentIntegrationLabel => 'Integration';

  @override
  String get agentOwnerIdLabel => 'Owner ID';

  @override
  String get agentAgencyIdLabel => 'Agency ID';

  @override
  String get agentDeletedAtLabel => 'Deleted At';

  @override
  String get amenitiesSectionTitle => 'Amenities';

  @override
  String get noAmenitiesListed => 'No amenities listed';

  @override
  String get locationSectionTitle => 'Location';

  @override
  String get getDirectionsButton => 'Get Directions';

  @override
  String get messageStatusRead => 'Read';

  @override
  String get messageStatusDelivered => 'Delivered';

  @override
  String get messageStatusSent => 'Sent';

  @override
  String get defaultUser => 'Default User';

  @override
  String get unknownTime => 'Unknown time';

  @override
  String get commonNotAvailable => 'Not available';

  @override
  String accountsFound(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count accounts found',
      one: '1 account found',
      zero: 'No accounts found',
    );
    return '$_temp0';
  }

  @override
  String get actionCardProperties => 'Properties';

  @override
  String get actionCardTenants => 'Tenants';

  @override
  String get actionCardAnalytics => 'Analytics';

  @override
  String get actionCardPayments => 'Payments';

  @override
  String get actionCardTasks => 'Tasks';

  @override
  String get actionCardMessages => 'Messages';

  @override
  String get actionCardHelpDesk => 'Help Desk';

  @override
  String get actionCardManageYourPropertyPortfolio =>
      'Manage your property portfolio';

  @override
  String get actionCardManageTenantInformation => 'Manage tenant information';

  @override
  String get actionCardViewReportsAndAnalytics => 'View reports and analytics';

  @override
  String get actionCardTrackFinancialRecords => 'Track financial records';

  @override
  String get actionCardManageMaintenanceTasks => 'Manage maintenance tasks';

  @override
  String get actionCardCommunicateWithTenants => 'Communicate with tenants';

  @override
  String get actionCardGetAssistanceWhenNeeded => 'Get assistance when needed';

  @override
  String get actionCardAddProperty => 'Add Property';

  @override
  String get actionCardCreateANewPropertyListing =>
      'Create a new property listing';

  @override
  String get actionCardAddTenant => 'Add Tenant';

  @override
  String get actionCardRegisterANewTenant => 'Register a new tenant';

  @override
  String get actionCardRecordPayment => 'Record Payment';

  @override
  String get actionCardRecordARentPayment => 'Record a rent payment';

  @override
  String get actionCardAddTask => 'Add Task';

  @override
  String get actionCardCreateAMaintenanceTask => 'Create a maintenance task';

  @override
  String get actionCardScheduleEvent => 'Schedule Event';

  @override
  String get actionCardCreateAPropertyEvent => 'Create a property event';

  @override
  String get actionCardComposeMessage => 'Compose Message';

  @override
  String get actionCardSendAMessageToTenants => 'Send a message to tenants';

  @override
  String get actionCardCreateDocument => 'Create Document';

  @override
  String get actionCardGenerateANewDocument => 'Generate a new document';

  @override
  String get actionCardGetStarted => 'Get Started';

  @override
  String get actionCardNewThisMonth => 'New This Month';

  @override
  String get tenantsTitle => 'Tenants';

  @override
  String get tenantsDescription =>
      'Manage tenant information and leases across your properties';

  @override
  String get tenantsAddTenant => 'Add Tenant';

  @override
  String get tenantsPropertyFilter => 'Property';

  @override
  String get tenantsAllProperties => 'All Properties';

  @override
  String get tenantsPaymentStatusFilter => 'Payment Status';

  @override
  String get tenantsAllStatuses => 'All Statuses';

  @override
  String get tenantsTenantColumn => 'Tenant';

  @override
  String get tenantsStatusColumn => 'Status';

  @override
  String get tenantsPropertyUnitColumn => 'Property / Unit';

  @override
  String get tenantsContactColumn => 'Contact';

  @override
  String get tenantsLeasePeriodColumn => 'Lease Period';

  @override
  String get tenantsActionsColumn => 'Actions';

  @override
  String get tenantsIdLabel => 'ID';

  @override
  String get tenantsNotAssigned => 'Not assigned';

  @override
  String get tenantsNotAvailable => 'N/A';

  @override
  String get tenantsLeaseFrom => 'From';

  @override
  String get tenantsLeaseTo => 'To';

  @override
  String get tenantsViewDetails => 'View Details';

  @override
  String get tenantsEdit => 'Edit';

  @override
  String get tenantsDelete => 'Delete';

  @override
  String get tenantsNoTenantsFound => 'No tenants found';

  @override
  String get tenantsGetStartedAddTenant => 'Get started by adding a new tenant';

  @override
  String get tenantsConfirmDeletionTitle => 'Confirm Deletion';

  @override
  String tenantsConfirmDeletionDesc(Object tenant) {
    return 'Are you sure you want to delete the tenant $tenant? This action cannot be undone.';
  }

  @override
  String get tenantsCancel => 'Cancel';

  @override
  String get tenantsDeleting => 'Deleting...';

  @override
  String get tenantsPrevious => 'Previous';

  @override
  String get tenantsNext => 'Next';

  @override
  String get tenantsStatusUnpaid => 'Unpaid';

  @override
  String get tenantsStatusPartiallyPaid => 'Partially Paid';

  @override
  String get tenantsStatusPaid => 'Paid';

  @override
  String get tenantsStatusRefunded => 'Refunded';

  @override
  String get tenantsStatusOverdue => 'Overdue';

  @override
  String get tenantsStatusCancelled => 'Cancelled';

  @override
  String get agenciesTitle => 'Agencies';

  @override
  String get agenciesDescription => 'Manage your agencies and their settings.';

  @override
  String get agenciesSearch => 'Search agencies...';

  @override
  String get agenciesStatus => 'Status';

  @override
  String get agenciesStatusValuesPending => 'Pending';

  @override
  String get agenciesStatusValuesVerified => 'Verified';

  @override
  String get agenciesStatusValuesRejected => 'Rejected';

  @override
  String get agenciesAdd => 'Add Agency';

  @override
  String get agenciesEdit => 'Edit';

  @override
  String get agenciesDelete => 'Delete';

  @override
  String agenciesConfirmDeleteDesc(Object name) {
    return 'Are you sure you want to delete $name? This action cannot be undone.';
  }

  @override
  String get agenciesDeletedMsg => 'Agency deleted successfully.';

  @override
  String get agenciesNone =>
      'No agencies match your search. Try different filters.';

  @override
  String get agenciesNa => 'N/A';

  @override
  String get agenciesAgents => 'Agents';

  @override
  String get agenciesView => 'View';

  @override
  String get agenciesName => 'Agency Name';

  @override
  String get agenciesEmail => 'Email';

  @override
  String get agenciesPhoneNumber => 'Phone Number';

  @override
  String get agenciesAddress => 'Address';

  @override
  String get agenciesWebsite => 'Website';

  @override
  String get agenciesLogoUrl => 'Logo URL';

  @override
  String get agenciesCreated => 'Created';

  @override
  String get agenciesUpdated => 'Updated';

  @override
  String get agenciesProperties => 'Properties';

  @override
  String get agenciesActions => 'Actions';

  @override
  String get agenciesCancel => 'Cancel';

  @override
  String get agenciesDeleting => 'Deleting...';

  @override
  String get agenciesCreating => 'Creating...';

  @override
  String get agenciesSaving => 'Saving...';

  @override
  String get agenciesSave => 'Save';

  @override
  String get agenciesCreate => 'Create';

  @override
  String get agenciesGetStarted => 'Get started by adding a new agency';

  @override
  String get agenciesRequired => 'This field is required.';

  @override
  String get agenciesInvalidEmail => 'Invalid email address.';

  @override
  String get agenciesInvalidUrl => 'Invalid URL.';

  @override
  String get agenciesUpdatedMsg => 'Updated!';

  @override
  String get agenciesCreatedMsg => 'Created!';

  @override
  String get agenciesErrorLoad => 'Failed to load details.';

  @override
  String get agenciesErrorCreate => 'Failed to create.';

  @override
  String get agenciesErrorUpdate => 'Failed to update.';

  @override
  String get agenciesErrorDelete => 'Failed to delete.';

  @override
  String get loginPageTitle => 'Sign In';

  @override
  String get loginPageEmail => 'Email';

  @override
  String get loginPagePassword => 'Password';

  @override
  String get loginPageRememberMe => 'Remember me';

  @override
  String get loginPageForgotPassword => 'Forgot password?';

  @override
  String get loginPageSignIn => 'Sign In';

  @override
  String get loginPageOrContinueWith => 'Or continue with';

  @override
  String get loginPageDontHaveAccount => 'Don\'t have an account?';

  @override
  String get loginPageSignUp => 'Sign up';

  @override
  String get loginPageErrorInvalidCredentials => 'Invalid email or password';

  @override
  String get loginPageErrorSomethingWentWrong =>
      'Something went wrong. Please try again.';

  @override
  String get loginPageErrorSessionExpired =>
      'Your session has expired. Please sign in again.';

  @override
  String get authErrorTitle => 'Authentication Error';

  @override
  String get authErrorSomethingWentWrong =>
      'Something went wrong during authentication. Please try again.';

  @override
  String get authErrorOauthAccountNotLinked =>
      'An account with this email already exists. Please sign in with the original authentication method.';

  @override
  String get authErrorOauthCallbackError =>
      'An error occurred during the OAuth callback process.';

  @override
  String get authErrorOauthCreateAccountError =>
      'Failed to create a new account. Please try again.';

  @override
  String get authErrorOauthSignInError =>
      'Error signing in with the selected provider. Please try again.';

  @override
  String get authErrorBackToLogin => 'Back to Login';

  @override
  String get propertyTitle => 'Property Details';

  @override
  String get propertyBackToProperties => 'Back to Properties';

  @override
  String get propertyEditProperty => 'Edit Property';

  @override
  String get propertyDeleteProperty => 'Delete Property';

  @override
  String get propertyCreateProperty => 'Create Property';

  @override
  String get propertyAddProperty => 'Add Property';

  @override
  String get propertyLoading => 'Loading property...';

  @override
  String get propertyNotFound => 'Property not found.';

  @override
  String get propertyDebugInfo => 'Debug info:';

  @override
  String get propertyConfirmDeleteTitle =>
      'Are you sure you want to delete this property?';

  @override
  String get propertyConfirmDeleteDescription =>
      'This action cannot be undone. All data associated with this property will be permanently removed.';

  @override
  String get propertyConfirmDeleteCancel => 'Cancel';

  @override
  String get propertyConfirmDeleteConfirm => 'Confirm Delete';

  @override
  String get propertyTabsOverview => 'Overview';

  @override
  String get propertyTabsFeatures => 'Features';

  @override
  String get propertyTabsAmenities => 'Amenities';

  @override
  String get propertyTabsLocation => 'Location';

  @override
  String get propertyTabsDocuments => 'Documents';

  @override
  String get propertyTabsHistory => 'History';

  @override
  String get propertySectionsBasicInfo => 'Basic Information';

  @override
  String get propertySectionsPhysicalCharacteristics =>
      'Physical Characteristics';

  @override
  String get propertySectionsContactInfo => 'Contact Information';

  @override
  String get propertySectionsRelatedEntities => 'Related Entities';

  @override
  String get propertySectionsMetadata => 'Metadata';

  @override
  String get propertySectionsFeatures => 'Features';

  @override
  String get propertySectionsAmenities => 'Amenities';

  @override
  String get propertySectionsLocationInfo => 'Location Information';

  @override
  String get propertyFieldsTitle => 'Title';

  @override
  String get propertyFieldsDescription => 'Description';

  @override
  String get propertyFieldsPropertyType => 'Property Type';

  @override
  String get propertyFieldsStatus => 'Status';

  @override
  String get propertyFieldsCategory => 'Category';

  @override
  String get propertyFieldsBuildingClass => 'Building Class';

  @override
  String get propertyFieldsCondition => 'Condition';

  @override
  String get propertyFieldsSize => 'Size (m²)';

  @override
  String get propertyFieldsBedrooms => 'Bedrooms';

  @override
  String get propertyFieldsBathrooms => 'Bathrooms';

  @override
  String get propertyFieldsYearBuilt => 'Year Built';

  @override
  String get propertyFieldsContactEmail => 'Contact Email';

  @override
  String get propertyFieldsContactPhone => 'Contact Phone';

  @override
  String get propertyFieldsOwner => 'Owner';

  @override
  String get propertyFieldsAgent => 'Agent';

  @override
  String get propertyFieldsAgency => 'Agency';

  @override
  String get propertyFieldsCreated => 'Created';

  @override
  String get propertyFieldsUpdated => 'Updated';

  @override
  String get propertyFieldsListed => 'Listed';

  @override
  String get propertyFieldsAddress => 'Address';

  @override
  String get propertyFieldsCity => 'City';

  @override
  String get propertyFieldsStateProvince => 'State/Province';

  @override
  String get propertyFieldsPostalCode => 'Postal Code';

  @override
  String get propertyFieldsCountry => 'Country';

  @override
  String get propertyFieldsCoordinates => 'Coordinates';

  @override
  String get propertyFieldsLatitude => 'Latitude';

  @override
  String get propertyFieldsLongitude => 'Longitude';

  @override
  String get propertyNoFeatures => 'No features listed';

  @override
  String get propertyNoAmenities => 'No amenities listed';

  @override
  String get propertyNoCoordinates => 'No coordinates available';

  @override
  String get propertySuccessDeleted => 'Property deleted successfully';

  @override
  String get propertySuccessCreated => 'Property created successfully';

  @override
  String get propertySuccessUpdated => 'Property updated successfully';

  @override
  String get propertyErrorDelete => 'Failed to delete property';

  @override
  String get propertyErrorCreate => 'Failed to create property';

  @override
  String get propertyErrorUpdate => 'Failed to update property';

  @override
  String get propertyErrorFetch => 'Failed to fetch property details';

  @override
  String get adminDashboard => 'Dashboard';

  @override
  String get adminProperties => 'Properties';

  @override
  String get adminAgents => 'Agents';

  @override
  String get adminAgencies => 'Agencies';

  @override
  String get adminOwners => 'Owners';

  @override
  String get adminTenants => 'Tenants';

  @override
  String get adminPayments => 'Payments';

  @override
  String get adminTasks => 'Tasks';

  @override
  String get adminMessages => 'Messages';

  @override
  String get adminReports => 'Reports';

  @override
  String get adminAnalytics => 'Analytics';

  @override
  String get adminSettings => 'Settings';

  @override
  String get adminNotifications => 'Notifications';

  @override
  String get account_id => 'Account ID';

  @override
  String get account_type => 'Type';

  @override
  String get account_provider => 'Provider';

  @override
  String get accountFilter_type_BANK => 'Bank Account';

  @override
  String get accountFilter_type_CREDIT_CARD => 'Credit Card';

  @override
  String get accountFilter_type_INVESTMENT => 'Investment Account';

  @override
  String get accountFilter_type_SAVINGS => 'Savings Account';

  @override
  String get accountFilter_type_LOAN => 'Loan Account';

  @override
  String get accountFilter_type_OTHER => 'Other Account';

  @override
  String get facilityDetailTitle => 'Facility Details';

  @override
  String get facilityDetailId => 'ID';

  @override
  String get facilityDetailName => 'Name';

  @override
  String get facilityDetailDescription => 'Description';

  @override
  String get facilityDetailType => 'Type';

  @override
  String get facilityDetailStatus => 'Status';

  @override
  String get facilityDetailPropertyId => 'Property ID';

  @override
  String get facilityDetailLocation => 'Location';

  @override
  String get facilityDetailMetadata => 'Metadata';

  @override
  String get facilityDetailCreatedBy => 'Created By';

  @override
  String get facilityDetailUpdatedBy => 'Updated By';

  @override
  String get facilityDetailCreatedAt => 'Created At';

  @override
  String get facilityDetailUpdatedAt => 'Updated At';

  @override
  String get facilityDetailDeletedAt => 'Deleted At';

  @override
  String get complianceRecordDetailTitle => 'Compliance Record Details';

  @override
  String get complianceRecordType => 'Type';

  @override
  String get complianceRecordStatus => 'Status';

  @override
  String get complianceRecordMetadata => 'Metadata';

  @override
  String get complianceRecordCustomFields => 'Custom Fields';

  @override
  String get analyticsDetailTitle => 'Analytics Details';

  @override
  String get analyticsType => 'Type';

  @override
  String get analyticsEntityType => 'Entity Type';

  @override
  String get analyticsEntityId => 'Entity ID';

  @override
  String get analyticsTimestamp => 'Timestamp';

  @override
  String get analyticsPropertyId => 'Property ID';

  @override
  String get analyticsUserId => 'User ID';

  @override
  String get analyticsAgentId => 'Agent ID';

  @override
  String get analyticsAgencyId => 'Agency ID';

  @override
  String get analyticsReservationId => 'Reservation ID';

  @override
  String get analyticsTaskId => 'Task ID';

  @override
  String get analyticsDeletedAt => 'Deleted At';

  @override
  String get analyticsCreatedAt => 'Created At';

  @override
  String get analyticsUpdatedAt => 'Updated At';

  @override
  String get analyticsData => 'Data';

  @override
  String get analyticsAgency => 'Agency';

  @override
  String get analyticsAgent => 'Agent';

  @override
  String get analyticsTypeListingView => 'Listing View';

  @override
  String get analyticsTypeBookingConversion => 'Booking Conversion';

  @override
  String get analyticsTypeUserEngagement => 'User Engagement';

  @override
  String get analyticsTypeRevenue => 'Revenue';

  @override
  String get analyticsTypePerformance => 'Performance';

  @override
  String get analyticsTypeAgentPerformance => 'Agent Performance';

  @override
  String get analyticsTypeAgencyPerformance => 'Agency Performance';

  @override
  String get analyticsTypeView => 'View';

  @override
  String get contractDetailTitle => 'Contract Details';

  @override
  String get contractIdLabel => 'ID';

  @override
  String get contractNameLabel => 'Name';

  @override
  String get contractDescriptionLabel => 'Description';

  @override
  String get contractTypeLabel => 'Type';

  @override
  String get contractStatusLabel => 'Status';

  @override
  String get contractCurrencyLabel => 'Currency';

  @override
  String get contractRentAmountLabel => 'Rent Amount';

  @override
  String get contractNoticePeriodLabel => 'Notice Period';

  @override
  String get contractPropertyIdLabel => 'Property ID';

  @override
  String get contractTenantIdLabel => 'Tenant ID';

  @override
  String get contractLandlordIdLabel => 'Landlord ID';

  @override
  String get contractOwnerIdLabel => 'Owner ID';

  @override
  String get contractAgencyIdLabel => 'Agency ID';

  @override
  String get contractStartDateLabel => 'Start Date';

  @override
  String get contractEndDateLabel => 'End Date';

  @override
  String get contractCreatedAtLabel => 'Created At';

  @override
  String get contractUpdatedAtLabel => 'Updated At';

  @override
  String get contractDeletedAtLabel => 'Deleted At';

  @override
  String get contractSignedByLabel => 'Signed By';

  @override
  String get contractSignedAtLabel => 'Signed At';

  @override
  String get contractTerminatedByLabel => 'Terminated By';

  @override
  String get contractTerminatedAtLabel => 'Terminated At';

  @override
  String get contractCancelledByLabel => 'Cancelled By';

  @override
  String get contractCancelledAtLabel => 'Cancelled At';

  @override
  String get contractTermsLabel => 'Terms:';

  @override
  String get contractConditionsLabel => 'Conditions:';

  @override
  String get contractTypeRental => 'Rental';

  @override
  String get contractTypeSale => 'Sale';

  @override
  String get contractTypeManagement => 'Management';

  @override
  String get contractTypeCommission => 'Commission';

  @override
  String get contractTypeService => 'Service';

  @override
  String get contractStatusDraft => 'Draft';

  @override
  String get contractStatusActive => 'Active';

  @override
  String get contractStatusExpired => 'Expired';

  @override
  String get contractStatusTerminated => 'Terminated';

  @override
  String get contractStatusRenewed => 'Renewed';

  @override
  String get contractStatusPending => 'Pending';

  @override
  String get contractStatusArchived => 'Archived';

  @override
  String get taxRecordAny => 'Any';

  @override
  String get taxRecordPaid => 'Paid';

  @override
  String get taxRecordUnpaid => 'Unpaid';

  @override
  String get taxRecordsTitle => 'Tax Records';

  @override
  String get eventType => 'Type';

  @override
  String get eventStatus => 'Status';

  @override
  String get eventProperty => 'Property';

  @override
  String get eventAttendees => 'Attendees';

  @override
  String get eventDate => 'Date';

  @override
  String get eventListTitle => 'Events';

  @override
  String get eventGallery => 'Gallery';

  @override
  String get pricingRuleName => 'Name';

  @override
  String get pricingRuleType => 'Type';

  @override
  String get pricingRuleStatus => 'Status';

  @override
  String get pricingRuleMultiplier => 'Multiplier';

  @override
  String get pricingRuleFixedPrice => 'Fixed Price';

  @override
  String get pricingRuleIsActive => 'Is Active';

  @override
  String get pricingRulePropertyId => 'Property ID';

  @override
  String get pricingRuleCreatedAt => 'Created At';

  @override
  String get pricingRuleUpdatedAt => 'Updated At';

  @override
  String get pricingRuleDeletedAt => 'Deleted At';

  @override
  String get pricingRuleConditions => 'Conditions';

  @override
  String get pricingRuleProperty => 'Property';

  @override
  String get mentionType => 'Type';

  @override
  String get mentionStatus => 'Status';

  @override
  String get taskType => 'Type';

  @override
  String get taskStatus => 'Status';

  @override
  String get taskPriority => 'Priority';

  @override
  String get taskAssignedTo => 'Assigned To';

  @override
  String get taskCreatedAt => 'Created At';

  @override
  String get taskUpdatedAt => 'Updated At';

  @override
  String get taskDeletedAt => 'Deleted At';

  @override
  String get guestStatus => 'Status';

  @override
  String get guestPhoneNumber => 'Phone Number';

  @override
  String get reviewType => 'Type';

  @override
  String get reviewStatus => 'Status';

  @override
  String get notificationType => 'Type';

  @override
  String get notificationStatus => 'Status';

  @override
  String get messageType => 'Type';

  @override
  String get messageStatus => 'Status';

  @override
  String get accountType => 'Type';

  @override
  String get accountStatus => 'Status';

  @override
  String get complianceTypeLicense => 'License';

  @override
  String get complianceTypeCertification => 'Certification';

  @override
  String get complianceTypeInsurance => 'Insurance';

  @override
  String get complianceTypePermit => 'Permit';

  @override
  String get complianceTypeOther => 'Other';

  @override
  String get complianceStatusPending => 'Pending';

  @override
  String get complianceStatusApproved => 'Approved';

  @override
  String get complianceStatusRejected => 'Rejected';

  @override
  String get complianceStatusExpired => 'Expired';

  @override
  String get commonYes => 'Yes';

  @override
  String get commonNo => 'No';

  @override
  String get accountFilter_type_oauth => 'OAuth';

  @override
  String get accountFilter_type_email => 'Email';

  @override
  String get accountFilter_type_oidc => 'OIDC';

  @override
  String get accountFilter_type_credentials => 'Credentials';

  @override
  String get accountFilter_type_google => 'Google';

  @override
  String get adminUsers => 'Users';

  @override
  String get adminExpenses => 'Expenses';

  @override
  String get adminFacilities => 'Facilities';

  @override
  String get adminHelpdesk => 'Help Desk';

  @override
  String get adminSubscriptions => 'Subscriptions';

  @override
  String get adminContracts => 'Contracts';

  @override
  String get adminGuests => 'Guests';

  @override
  String get adminCompliance => 'Compliance';

  @override
  String get adminPricingRules => 'Pricing Rules';

  @override
  String get adminReviews => 'Reviews';

  @override
  String get accountFilter_type_facebook => 'Facebook';

  @override
  String get edit_agent_tooltip => 'Edit Agent';

  @override
  String get agent_contact_information_title => 'Contact Information';

  @override
  String get agent_email_label => 'Email';

  @override
  String get agent_phone_label => 'Phone';

  @override
  String get agent_address_label => 'Address';

  @override
  String get agent_website_label => 'Website';

  @override
  String get agent_professional_information_title => 'Professional Information';

  @override
  String get agent_status_label => 'Status';

  @override
  String get agent_agency_label => 'Agency';

  @override
  String get agent_specialities_label => 'Specialities';

  @override
  String get agent_activity_title => 'Recent Activity';

  @override
  String get agent_last_active_label => 'Last Active';

  @override
  String get agent_is_active_label => 'Is Active';

  @override
  String get agent_created_at_label => 'Created At';

  @override
  String get common_not_available => 'Not available';

  @override
  String get common_yes => 'Yes';

  @override
  String get common_no => 'No';

  @override
  String get availability_edit_title => 'Edit Availability';

  @override
  String get common_save => 'Save';

  @override
  String get availability_date => 'Date';

  @override
  String get availability_not_set => 'Not set';

  @override
  String get availability_blocked => 'Blocked';

  @override
  String get availability_booked => 'Booked';

  @override
  String get availability_property_id => 'Property ID';

  @override
  String get availability_reservation_id => 'Reservation ID';

  @override
  String get availability_pricing_rule_id => 'Pricing Rule ID';

  @override
  String get availability_total_units => 'Total Units';

  @override
  String get availability_available_units => 'Available Units';

  @override
  String get availability_booked_units => 'Booked Units';

  @override
  String get availability_blocked_units => 'Blocked Units';

  @override
  String get availability_base_price => 'Base Price';

  @override
  String get availability_current_price => 'Current Price';

  @override
  String get availability_special_pricing_json => 'Special Pricing (JSON)';

  @override
  String get availability_price_settings_json => 'Price Settings (JSON)';

  @override
  String get availability_min_nights => 'Minimum Nights';

  @override
  String get availability_max_nights => 'Maximum Nights';

  @override
  String get availability_max_guests => 'Maximum Guests';

  @override
  String get availability_discount_settings_json => 'Discount Settings (JSON)';

  @override
  String get availability_weekend_rate => 'Weekend Rate';

  @override
  String get availability_weekday_rate => 'Weekday Rate';

  @override
  String get availability_weekend_multiplier => 'Weekend Multiplier';

  @override
  String get availability_weekday_multiplier => 'Weekday Multiplier';

  @override
  String get availability_seasonal_multiplier => 'Seasonal Multiplier';

  @override
  String get facilityTypeGym => 'Gym';

  @override
  String get facilityTypePool => 'Pool';

  @override
  String get facilityTypeParkingLot => 'Parking Lot';

  @override
  String get facilityTypeLaundry => 'Laundry';

  @override
  String get facilityTypeElevator => 'Elevator';

  @override
  String get facilityTypeSecurity => 'Security';

  @override
  String get facilityTypeOther => 'Other';

  @override
  String get facilityStatusAvailable => 'Available';

  @override
  String get facilityStatusUnavailable => 'Unavailable';

  @override
  String get facilityStatusMaintenance => 'Maintenance';
}
