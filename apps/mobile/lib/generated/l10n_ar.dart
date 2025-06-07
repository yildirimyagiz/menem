// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for Arabic (`ar`).
class AppLocalizationsAr extends AppLocalizations {
  AppLocalizationsAr([String locale = 'ar']) : super(locale);

  @override
  String get appTitle => 'مينيم';

  @override
  String get dashboard => 'لوحة القيادة';

  @override
  String get manageProperties => 'إدارة ممتلكاتك بفعالية';

  @override
  String get quickAccess => 'وصول سريع';

  @override
  String get properties => 'العقارات';

  @override
  String get tenants => 'المستأجرون';

  @override
  String get payments => 'المدفوعات';

  @override
  String get tasks => 'المهام';

  @override
  String get summaryStatistics => 'إحصائيات ملخصة';

  @override
  String get totalProperties => 'إجمالي العقارات';

  @override
  String occupancyRate(Object rate) {
    return 'معدل الإشغال: $rate';
  }

  @override
  String get monthlyCashflow => 'التدفق النقدي الشهري';

  @override
  String pendingPayments(Object count) {
    return 'المدفوعات المعلقة: $count';
  }

  @override
  String get pendingTasks => 'المهام المعلقة';

  @override
  String tasksThisWeek(Object count) {
    return '$count هذا الأسبوع';
  }

  @override
  String get propertyDetailTitle => 'تفاصيل العقار';

  @override
  String get propertyDetailOverviewTab => 'نظرة عامة';

  @override
  String get propertyDetailFeaturesTab => 'الميزات';

  @override
  String get propertyDetailLocationTab => 'الموقع';

  @override
  String get propertyDetailGalleryTab => 'المعرض';

  @override
  String get propertyDetailId => 'المعرف';

  @override
  String get propertyDetailNumber => 'رقم العقار';

  @override
  String get propertyDetailTitleField => 'العنوان';

  @override
  String get propertyDetailDescription => 'الوصف';

  @override
  String get propertyDetailType => '';

  @override
  String get propertyDetailStatus => '';

  @override
  String get propertyDetailCategory => '';

  @override
  String get propertyDetailCondition => 'الحالة';

  @override
  String get propertyDetailMarketValue => 'القيمة السوقية';

  @override
  String get propertyDetailBedrooms => 'غرف النوم';

  @override
  String get propertyDetailBathrooms => 'الحمامات';

  @override
  String get propertyDetailYearBuilt => 'سنة الإنشاء';

  @override
  String get propertyDetailFeatures => 'الميزات';

  @override
  String get propertyDetailAmenities => 'المرافق';

  @override
  String get propertyDetailAddress => 'العنوان';

  @override
  String get propertyDetailCity => 'المدينة';

  @override
  String get propertyDetailState => 'الولاية';

  @override
  String get propertyDetailCountry => 'الدولة';

  @override
  String get propertyDetailZipCode => 'الرمز البريدي';

  @override
  String get propertyDetailCoordinates => 'الإحداثيات';

  @override
  String get propertyDetailNoFeatures => 'لا توجد ميزات أو مرافق متوفرة';

  @override
  String get propertyDetailNoLocation => 'لا توجد معلومات عن الموقع';

  @override
  String get propertyDetailGalleryPlaceholder =>
      'عرض المعرض (تنفيذ باستخدام GridView للصور)';

  @override
  String get propertyDetailDeleteConfirm =>
      'هل أنت متأكد أنك تريد حذف هذا العقار؟';

  @override
  String get propertyDetailDeleteSuccess => '';

  @override
  String propertyDetailDeleteFailed(Object error) {
    return 'فشل حذف العقار: $error';
  }

  @override
  String get propertyDetailContactAgent => 'اتصل بالوكيل';

  @override
  String get propertyDetailPrice => 'السعر';

  @override
  String get propertyDetailLoading => 'جاري تحميل تفاصيل العقار...';

  @override
  String get propertyDetailNotFound => 'لم يتم العثور على العقار.';

  @override
  String get totalTenants => 'إجمالي المستأجرين';

  @override
  String newTenants(Object count) {
    return 'المستأجرون الجدد: $count';
  }

  @override
  String get homeLabel => 'الرئيسية';

  @override
  String get favoritesEmpty => '';

  @override
  String get favoritesError => '';

  @override
  String get favoritesRetry => '';

  @override
  String get emptyStateRetry => '';

  @override
  String get listings => 'عقاراتي';

  @override
  String get listingsEmpty => '';

  @override
  String get listingsRetry => '';

  @override
  String get filterPropertiesTitle => '';

  @override
  String get filterPropertiesApply => '';

  @override
  String get filterPropertiesCancel => '';

  @override
  String get messagesLabel => 'الرسائل';

  @override
  String get notificationsLabel => 'الإشعارات';

  @override
  String get notificationsEmpty => '';

  @override
  String get paymentsLabel => 'المدفوعات';

  @override
  String get settingsLabel => 'الإعدادات';

  @override
  String get settingsAppearance => '';

  @override
  String get settingsDarkMode => '';

  @override
  String get filterTasksTitle => '';

  @override
  String get filterTasksStatus => '';

  @override
  String get filterTasksPriority => '';

  @override
  String get filterTasksType => '';

  @override
  String get filterTasksDueDate => '';

  @override
  String get filterTasksApply => '';

  @override
  String get filterTasksCancel => '';

  @override
  String get profileLabel => 'الملف الشخصي';

  @override
  String get logoutLabel => 'تسجيل الخروج';

  @override
  String get loggingout => '...جار تسجيل الخروج';

  @override
  String get sitetitle => 'رينتالبروك';

  @override
  String get nav_home => 'الرئيسية';

  @override
  String get nav_properties => 'العقارات';

  @override
  String get nav_payments => '';

  @override
  String get nav_tasks => '';

  @override
  String get nav_messages => '';

  @override
  String get nav_notifications => '';

  @override
  String get nav_helpdesk => '';

  @override
  String get nav_subscription => '';

  @override
  String get nav_settings => '';

  @override
  String get nav_tenants => '';

  @override
  String get nav_expenses => '';

  @override
  String get nav_facilities => '';

  @override
  String get nav_analytics => '';

  @override
  String get nav_help => '';

  @override
  String get nav_logout => '';

  @override
  String get nav_profile => '';

  @override
  String get nav_viewAll => '';

  @override
  String get indexTitle => 'مرحباً بكم في مينيم';

  @override
  String get indexDescription => 'حلول إدارة العقارات الخاصة بك';

  @override
  String get indexPropertyManagementTitle => 'إدارة العقارات';

  @override
  String get indexPropertyManagementDescription =>
      'إدارة عقاراتك بفعالية مع مجموعة أدواتنا الشاملة.';

  @override
  String get indexWaterManagementTitle => 'إدارة المياه';

  @override
  String get indexWaterManagementDescription =>
      'تتبع وتحسين استخدام المياه عبر عقاراتك.';

  @override
  String get authSignIn => 'تسجيل الدخول مع جوجل';

  @override
  String get authSignOut => 'تسجيل الخروج';

  @override
  String get createPropertyTitle => '';

  @override
  String get propertyCreatedSuccess => '';

  @override
  String get propertyCreatedError => '';

  @override
  String get registerAlreadyHaveAccount => '';

  @override
  String get registerForgotPassword => '';

  @override
  String get propertyViewingEventsTitle => '';

  @override
  String get propertyViewingSchedule => '';

  @override
  String authWelcomeBack(Object name) {
    return 'مرحباً بعودتك، $name';
  }

  @override
  String get postsCreate => '';

  @override
  String get postsTitle => '';

  @override
  String get postsContent => '';

  @override
  String get postsLoading => '';

  @override
  String get postsSave => '';

  @override
  String get postsCancel => '';

  @override
  String get postsEdit => '';

  @override
  String get postsDelete => '';

  @override
  String get postsNoPostsYet => '';

  @override
  String get postsErrorUnauthorized => '';

  @override
  String get postsErrorCreatePost => '';

  @override
  String get postsErrorUpdatePost => '';

  @override
  String get postsErrorDeletePost => '';

  @override
  String get chatMessages => '';

  @override
  String chatChattingWith(Object name) {
    return 'الدردشة مع $name';
  }

  @override
  String get chatConnectWithUsers => 'تواصل مع المستخدمين واحصل على الدعم';

  @override
  String get chatBackToList => '';

  @override
  String get chatWelcomeToChat => '';

  @override
  String get chatWelcomeDescription => '';

  @override
  String get chatNewMessage => '';

  @override
  String get chatContactSupport => '';

  @override
  String get chatBack => '';

  @override
  String get chatSearchUsers => '';

  @override
  String get chatTypeMessage => '';

  @override
  String get chatSend => '';

  @override
  String get chatErrorUnauthorized => '';

  @override
  String get chatErrorSendMessage => '';

  @override
  String get chatErrorMarkAsRead => '';

  @override
  String get chatError => '';

  @override
  String get chatConnectionError =>
      'فشل الاتصال بخادم الدردشة. الرجاء معاودة المحاولة.';

  @override
  String get chatMessageSendError =>
      'فشل إرسال رسالتك. يرجى المحاولة مرة أخرى في وقت لاحق.';

  @override
  String get notifications_placeholder => '';

  @override
  String get notificationsPlaceholder => 'لا توجد إشعارات حتى الآن';

  @override
  String commonTimeAgo(Object time) {
    return 'منذ $time';
  }

  @override
  String get commonSuccess => 'نجاح';

  @override
  String get commonError => 'خطأ';

  @override
  String propertiesFound(Object count) {
    return '';
  }

  @override
  String get errorScreenTitle => '';

  @override
  String get errorScreenGoBack => '';

  @override
  String get dateRangeSelectTitle => '';

  @override
  String get dateRangeSelectApply => '';

  @override
  String get dateRangeSelectCancel => '';

  @override
  String get commonWarning => 'تحذير';

  @override
  String get commonInfo => 'معلومات';

  @override
  String get commonLoading => 'جاري التحميل...';

  @override
  String get commonSave => 'حفظ';

  @override
  String get commonCancel => 'إلغاء';

  @override
  String get commonDelete => 'حذف';

  @override
  String get commonEdit => 'تعديل';

  @override
  String get commonCreate => 'إنشاء';

  @override
  String get commonView => 'عرض';

  @override
  String get commonPrevious => 'السابق';

  @override
  String get commonNext => 'التالي';

  @override
  String get commonBack => 'العودة';

  @override
  String get commonConfirm => 'تأكيد';

  @override
  String get commonActions => 'إجراءات';

  @override
  String get commonSearch => 'بحث';

  @override
  String get commonFilter => 'تصفية';

  @override
  String get commonSort => 'ترتيب';

  @override
  String get commonNoData => 'لا توجد بيانات';

  @override
  String get editAgentTooltip => '';

  @override
  String get agentContactInformationTitle => '';

  @override
  String get agentEmailLabel => '';

  @override
  String get agentPhoneLabel => '';

  @override
  String get agentAddressLabel => '';

  @override
  String get agentWebsiteLabel => '';

  @override
  String get agentProfessionalInformationTitle => '';

  @override
  String get agentStatusLabel => '';

  @override
  String get agentAgencyLabel => '';

  @override
  String get agentSpecialitiesLabel => '';

  @override
  String get agentActivityTitle => '';

  @override
  String get agentLastActiveLabel => '';

  @override
  String get agentIsActiveLabel => '';

  @override
  String get agentCreatedAtLabel => '';

  @override
  String get agentAdditionalInformationTitle => '';

  @override
  String get agentBioLabel => 'السيرة الذاتية';

  @override
  String get agentExternalIdLabel => 'المعرف الخارجي';

  @override
  String get agentSettingsLabel => '';

  @override
  String get agentIntegrationLabel => '';

  @override
  String get agentOwnerIdLabel => '';

  @override
  String get agentAgencyIdLabel => '';

  @override
  String get agentDeletedAtLabel => '';

  @override
  String get amenitiesSectionTitle => 'مرافق';

  @override
  String get noAmenitiesListed => 'لا توجد مرافق';

  @override
  String get locationSectionTitle => 'موقع';

  @override
  String get getDirectionsButton => 'احصل على الاتجاهات';

  @override
  String get messageStatusRead => 'تم القراءة';

  @override
  String get messageStatusDelivered => 'تم التسليم';

  @override
  String get messageStatusSent => 'تم الإرسال';

  @override
  String get defaultUser => 'مستخدم افتراضي';

  @override
  String get unknownTime => 'زمن غير معروف';

  @override
  String get commonNotAvailable => '';

  @override
  String accountsFound(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'تم العثور على $count حساب',
      many: 'تم العثور على $count حسابًا',
      few: 'تم العثور على $count حسابات',
      two: 'تم العثور على حسابين',
      one: 'تم العثور على حساب واحد',
      zero: 'لم يتم العثور على حسابات',
    );
    return '$_temp0';
  }

  @override
  String get actionCardProperties => 'العقارات';

  @override
  String get actionCardTenants => 'المستأجرون';

  @override
  String get actionCardAnalytics => 'تحليلات';

  @override
  String get actionCardPayments => 'المدفوعات';

  @override
  String get actionCardTasks => 'المهام';

  @override
  String get actionCardMessages => 'الرسائل';

  @override
  String get actionCardHelpDesk => 'مكتب المساعدة';

  @override
  String get actionCardManageYourPropertyPortfolio =>
      'إدارة محفظة العقارات الخاصة بك';

  @override
  String get actionCardManageTenantInformation => 'إدارة معلومات المستأجرين';

  @override
  String get actionCardViewReportsAndAnalytics => 'عرض التقارير والتحليلات';

  @override
  String get actionCardTrackFinancialRecords => 'تتبع السجلات المالية';

  @override
  String get actionCardManageMaintenanceTasks => 'إدارة مهام الصيانة';

  @override
  String get actionCardCommunicateWithTenants => 'التواصل مع المستأجرين';

  @override
  String get actionCardGetAssistanceWhenNeeded =>
      'الحصول على المساعدة عند الحاجة';

  @override
  String get actionCardAddProperty => 'إضافة عقار';

  @override
  String get actionCardCreateANewPropertyListing => 'إنشاء قائمة عقار جديدة';

  @override
  String get actionCardAddTenant => 'إضافة مستأجر';

  @override
  String get actionCardRegisterANewTenant => 'تسجيل مستأجر جديد';

  @override
  String get actionCardRecordPayment => 'تسجيل دفعة';

  @override
  String get actionCardRecordARentPayment => 'تسجيل دفعة إيجار';

  @override
  String get actionCardAddTask => 'إضافة مهمة';

  @override
  String get actionCardCreateAMaintenanceTask => '';

  @override
  String get actionCardScheduleEvent => '';

  @override
  String get actionCardCreateAPropertyEvent => '';

  @override
  String get actionCardComposeMessage => '';

  @override
  String get actionCardSendAMessageToTenants => 'إرسال رسالة إلى المستأجرين';

  @override
  String get actionCardCreateDocument => 'إنشاء مستند';

  @override
  String get actionCardGenerateANewDocument => 'إنشاء مستند جديد';

  @override
  String get actionCardGetStarted => 'ابدأ الآن';

  @override
  String get actionCardNewThisMonth => 'جديد هذا الشهر';

  @override
  String get tenantsTitle => '';

  @override
  String get tenantsDescription => '';

  @override
  String get tenantsAddTenant => '';

  @override
  String get tenantsPropertyFilter => '';

  @override
  String get tenantsAllProperties => '';

  @override
  String get tenantsPaymentStatusFilter => '';

  @override
  String get tenantsAllStatuses => '';

  @override
  String get tenantsTenantColumn => '';

  @override
  String get tenantsStatusColumn => '';

  @override
  String get tenantsPropertyUnitColumn => '';

  @override
  String get tenantsContactColumn => '';

  @override
  String get tenantsLeasePeriodColumn => '';

  @override
  String get tenantsActionsColumn => '';

  @override
  String get tenantsIdLabel => '';

  @override
  String get tenantsNotAssigned => '';

  @override
  String get tenantsNotAvailable => '';

  @override
  String get tenantsLeaseFrom => '';

  @override
  String get tenantsLeaseTo => '';

  @override
  String get tenantsViewDetails => '';

  @override
  String get tenantsEdit => '';

  @override
  String get tenantsDelete => '';

  @override
  String get tenantsNoTenantsFound => '';

  @override
  String get tenantsGetStartedAddTenant => '';

  @override
  String get tenantsConfirmDeletionTitle => '';

  @override
  String tenantsConfirmDeletionDesc(Object tenant) {
    return 'هل أنت متأكد من حذف المستأجر $tenant؟';
  }

  @override
  String get tenantsCancel => '';

  @override
  String get tenantsDeleting => '';

  @override
  String get tenantsPrevious => '';

  @override
  String get tenantsNext => '';

  @override
  String get tenantsStatusUnpaid => '';

  @override
  String get tenantsStatusPartiallyPaid => '';

  @override
  String get tenantsStatusPaid => '';

  @override
  String get tenantsStatusRefunded => '';

  @override
  String get tenantsStatusOverdue => '';

  @override
  String get tenantsStatusCancelled => '';

  @override
  String get agenciesTitle => 'الوكالات';

  @override
  String get agenciesDescription => 'إدارة وكالاتك وإعداداتها.';

  @override
  String get agenciesSearch => '';

  @override
  String get agenciesStatus => '';

  @override
  String get agenciesStatusValuesPending => '';

  @override
  String get agenciesStatusValuesVerified => '';

  @override
  String get agenciesStatusValuesRejected => '';

  @override
  String get agenciesAdd => '';

  @override
  String get agenciesEdit => 'تعديل';

  @override
  String get agenciesDelete => 'حذف';

  @override
  String agenciesConfirmDeleteDesc(Object name) {
    return 'هل أنت متأكد من حذف الوكالة $name؟';
  }

  @override
  String get agenciesDeletedMsg => 'تم حذف الوكالة بنجاح.';

  @override
  String get agenciesNone => '';

  @override
  String get agenciesNa => '';

  @override
  String get agenciesAgents => 'الوكلاء';

  @override
  String get agenciesView => '';

  @override
  String get agenciesName => '';

  @override
  String get agenciesEmail => '';

  @override
  String get agenciesPhoneNumber => '';

  @override
  String get agenciesAddress => '';

  @override
  String get agenciesWebsite => '';

  @override
  String get agenciesLogoUrl => '';

  @override
  String get agenciesCreated => '';

  @override
  String get agenciesUpdated => '';

  @override
  String get agenciesProperties => 'العقارات';

  @override
  String get agenciesActions => '';

  @override
  String get agenciesCancel => '';

  @override
  String get agenciesDeleting => 'جارٍ الحذف...';

  @override
  String get agenciesCreating => '';

  @override
  String get agenciesSaving => '';

  @override
  String get agenciesSave => '';

  @override
  String get agenciesCreate => 'إنشاء';

  @override
  String get agenciesGetStarted => '';

  @override
  String get agenciesRequired => '';

  @override
  String get agenciesInvalidEmail => 'عنوان بريد إلكتروني غير صالح.';

  @override
  String get agenciesInvalidUrl => 'عنوان URL غير صالح.';

  @override
  String get agenciesUpdatedMsg => 'تم التحديث!';

  @override
  String get agenciesCreatedMsg => 'تم الإنشاء!';

  @override
  String get agenciesErrorLoad => 'فشل تحميل التفاصيل.';

  @override
  String get agenciesErrorCreate => 'فشل الإنشاء.';

  @override
  String get agenciesErrorUpdate => 'فشل التحديث.';

  @override
  String get agenciesErrorDelete => '';

  @override
  String get loginPageTitle => '';

  @override
  String get loginPageEmail => '';

  @override
  String get loginPagePassword => '';

  @override
  String get loginPageRememberMe => '';

  @override
  String get loginPageForgotPassword => '';

  @override
  String get loginPageSignIn => '';

  @override
  String get loginPageOrContinueWith => '';

  @override
  String get loginPageDontHaveAccount => '';

  @override
  String get loginPageSignUp => '';

  @override
  String get loginPageErrorInvalidCredentials => '';

  @override
  String get loginPageErrorSomethingWentWrong => '';

  @override
  String get loginPageErrorSessionExpired => '';

  @override
  String get authErrorTitle => '';

  @override
  String get authErrorSomethingWentWrong => '';

  @override
  String get authErrorOauthAccountNotLinked => '';

  @override
  String get authErrorOauthCallbackError => '';

  @override
  String get authErrorOauthCreateAccountError => '';

  @override
  String get authErrorOauthSignInError => '';

  @override
  String get authErrorBackToLogin => '';

  @override
  String get propertyTitle => 'تفاصيل العقار';

  @override
  String get propertyBackToProperties => '';

  @override
  String get propertyEditProperty => '';

  @override
  String get propertyDeleteProperty => '';

  @override
  String get propertyCreateProperty => 'إنشاء عقار';

  @override
  String get propertyAddProperty => '';

  @override
  String get propertyLoading => '';

  @override
  String get propertyNotFound => 'لم يتم العثور على العقار.';

  @override
  String get propertyDebugInfo => '';

  @override
  String get propertyConfirmDeleteTitle => '';

  @override
  String get propertyConfirmDeleteDescription => '';

  @override
  String get propertyConfirmDeleteCancel => '';

  @override
  String get propertyConfirmDeleteConfirm => 'تأكيد الحذف';

  @override
  String get propertyTabsOverview => '';

  @override
  String get propertyTabsFeatures => '';

  @override
  String get propertyTabsAmenities => 'المرافق';

  @override
  String get propertyTabsLocation => '';

  @override
  String get propertyTabsDocuments => '';

  @override
  String get propertyTabsHistory => 'السجل';

  @override
  String get propertySectionsBasicInfo => '';

  @override
  String get propertySectionsPhysicalCharacteristics => '';

  @override
  String get propertySectionsContactInfo => '';

  @override
  String get propertySectionsRelatedEntities => '';

  @override
  String get propertySectionsMetadata => '';

  @override
  String get propertySectionsFeatures => 'الميزات';

  @override
  String get propertySectionsAmenities => 'المرافق';

  @override
  String get propertySectionsLocationInfo => '';

  @override
  String get propertyFieldsTitle => 'العنوان';

  @override
  String get propertyFieldsDescription => '';

  @override
  String get propertyFieldsPropertyType => '';

  @override
  String get propertyFieldsStatus => '';

  @override
  String get propertyFieldsCategory => 'الفئة';

  @override
  String get propertyFieldsBuildingClass => '';

  @override
  String get propertyFieldsCondition => '';

  @override
  String get propertyFieldsSize => 'المساحة (م²)';

  @override
  String get propertyFieldsBedrooms => '';

  @override
  String get propertyFieldsBathrooms => '';

  @override
  String get propertyFieldsYearBuilt => '';

  @override
  String get propertyFieldsContactEmail => 'بريد الاتصال';

  @override
  String get propertyFieldsContactPhone => '';

  @override
  String get propertyFieldsOwner => '';

  @override
  String get propertyFieldsAgent => 'الوكيل';

  @override
  String get propertyFieldsAgency => '';

  @override
  String get propertyFieldsCreated => '';

  @override
  String get propertyFieldsUpdated => '';

  @override
  String get propertyFieldsListed => '';

  @override
  String get propertyFieldsAddress => '';

  @override
  String get propertyFieldsCity => 'المدينة';

  @override
  String get propertyFieldsStateProvince => '';

  @override
  String get propertyFieldsPostalCode => '';

  @override
  String get propertyFieldsCountry => 'الدولة';

  @override
  String get propertyFieldsCoordinates => '';

  @override
  String get propertyFieldsLatitude => '';

  @override
  String get propertyFieldsLongitude => '';

  @override
  String get propertyNoFeatures => 'لا توجد ميزات مدرجة';

  @override
  String get propertyNoAmenities => 'لا توجد مرافق مدرجة';

  @override
  String get propertyNoCoordinates => '';

  @override
  String get propertySuccessDeleted => 'تم حذف العقار بنجاح';

  @override
  String get propertySuccessCreated => '';

  @override
  String get propertySuccessUpdated => '';

  @override
  String get propertyErrorDelete => '';

  @override
  String get propertyErrorCreate => 'فشل إنشاء العقار';

  @override
  String get propertyErrorUpdate => '';

  @override
  String get propertyErrorFetch => '';

  @override
  String get adminDashboard => 'لوحة التحكم';

  @override
  String get adminProperties => '';

  @override
  String get adminAgents => '';

  @override
  String get adminAgencies => '';

  @override
  String get adminOwners => '';

  @override
  String get adminTenants => '';

  @override
  String get adminPayments => 'Payments';

  @override
  String get adminTasks => 'المهام';

  @override
  String get adminMessages => '';

  @override
  String get adminReports => '';

  @override
  String get adminAnalytics => 'التحليلات';

  @override
  String get adminSettings => '';

  @override
  String get adminNotifications => '';

  @override
  String get account_id => '';

  @override
  String get account_type => 'النوع';

  @override
  String get account_provider => 'الموفر';

  @override
  String get accountFilter_type_BANK => '';

  @override
  String get accountFilter_type_CREDIT_CARD => 'بطاقة الائتمان';

  @override
  String get accountFilter_type_INVESTMENT => '';

  @override
  String get accountFilter_type_SAVINGS => '';

  @override
  String get accountFilter_type_LOAN => '';

  @override
  String get accountFilter_type_OTHER => '';

  @override
  String get facilityDetailTitle => 'تفاصيل المنشأة';

  @override
  String get facilityDetailId => 'المعرف';

  @override
  String get facilityDetailName => 'الاسم';

  @override
  String get facilityDetailDescription => 'الوصف';

  @override
  String get facilityDetailType => 'النوع';

  @override
  String get facilityDetailStatus => 'الحالة';

  @override
  String get facilityDetailPropertyId => 'معرف العقار';

  @override
  String get facilityDetailLocation => 'الموقع';

  @override
  String get facilityDetailMetadata => 'البيانات الوصفية';

  @override
  String get facilityDetailCreatedBy => 'تم الإنشاء بواسطة';

  @override
  String get facilityDetailUpdatedBy => 'تم التحديث بواسطة';

  @override
  String get facilityDetailCreatedAt => 'تاريخ الإنشاء';

  @override
  String get facilityDetailUpdatedAt => 'تاريخ التحديث';

  @override
  String get facilityDetailDeletedAt => '';

  @override
  String get complianceRecordDetailTitle => 'تفاصيل سجل الإمتثال';

  @override
  String get complianceRecordType => '';

  @override
  String get complianceRecordStatus => '';

  @override
  String get complianceRecordMetadata => '';

  @override
  String get complianceRecordCustomFields => '';

  @override
  String get analyticsDetailTitle => 'تفاصيل التحليلات';

  @override
  String get analyticsType => 'النوع';

  @override
  String get analyticsEntityType => 'نوع الكيان';

  @override
  String get analyticsEntityId => 'معرف الكيان';

  @override
  String get analyticsTimestamp => 'الطابع الزمني';

  @override
  String get analyticsPropertyId => 'معرف العقار';

  @override
  String get analyticsUserId => 'معرف المستخدم';

  @override
  String get analyticsAgentId => 'معرف الوكيل';

  @override
  String get analyticsAgencyId => 'معرف الوكالة';

  @override
  String get analyticsReservationId => 'معرف الحجز';

  @override
  String get analyticsTaskId => 'معرف المهمة';

  @override
  String get analyticsDeletedAt => 'تاريخ الحذف';

  @override
  String get analyticsCreatedAt => 'تاريخ الإنشاء';

  @override
  String get analyticsUpdatedAt => 'تاريخ التحديث';

  @override
  String get analyticsData => 'البيانات';

  @override
  String get analyticsAgency => 'الوكالة';

  @override
  String get analyticsAgent => 'الوكيل';

  @override
  String get analyticsTypeListingView => 'عرض القائمة';

  @override
  String get analyticsTypeBookingConversion => 'تحويل الحجز';

  @override
  String get analyticsTypeUserEngagement => 'تفاعل المستخدم';

  @override
  String get analyticsTypeRevenue => 'الإيرادات';

  @override
  String get analyticsTypePerformance => 'الأداء';

  @override
  String get analyticsTypeAgentPerformance => 'أداء الوكيل';

  @override
  String get analyticsTypeAgencyPerformance => 'أداء الوكالة';

  @override
  String get analyticsTypeView => 'عرض';

  @override
  String get contractDetailTitle => 'تفاصيل العقد';

  @override
  String get contractIdLabel => 'المعرف';

  @override
  String get contractNameLabel => 'الاسم';

  @override
  String get contractDescriptionLabel => 'الوصف';

  @override
  String get contractTypeLabel => 'النوع';

  @override
  String get contractStatusLabel => 'الحالة';

  @override
  String get contractCurrencyLabel => 'العملة';

  @override
  String get contractRentAmountLabel => 'قيمة الإيجار';

  @override
  String get contractNoticePeriodLabel => 'فترة الإشعار';

  @override
  String get contractPropertyIdLabel => 'معرف العقار';

  @override
  String get contractTenantIdLabel => 'معرف المستأجر';

  @override
  String get contractLandlordIdLabel => 'معرف المالك';

  @override
  String get contractOwnerIdLabel => 'معرف المالك';

  @override
  String get contractAgencyIdLabel => 'معرف الوكالة';

  @override
  String get contractStartDateLabel => 'تاريخ البدء';

  @override
  String get contractEndDateLabel => 'تاريخ الانتهاء';

  @override
  String get contractCreatedAtLabel => 'تاريخ الإنشاء';

  @override
  String get contractUpdatedAtLabel => 'تاريخ التحديث';

  @override
  String get contractDeletedAtLabel => 'تاريخ الحذف';

  @override
  String get contractSignedByLabel => 'تم التوقيع بواسطة';

  @override
  String get contractSignedAtLabel => 'تاريخ التوقيع';

  @override
  String get contractTerminatedByLabel => 'تم الإنهاء بواسطة';

  @override
  String get contractTerminatedAtLabel => 'تاريخ الإنهاء';

  @override
  String get contractCancelledByLabel => 'تم الإلغاء بواسطة';

  @override
  String get contractCancelledAtLabel => 'تاريخ الإلغاء';

  @override
  String get contractTermsLabel => ':الشروط';

  @override
  String get contractConditionsLabel => ':الظروف';

  @override
  String get contractTypeRental => 'إيجار';

  @override
  String get contractTypeSale => 'بيع';

  @override
  String get contractTypeManagement => 'إدارة';

  @override
  String get contractTypeCommission => 'عمولة';

  @override
  String get contractTypeService => 'خدمة';

  @override
  String get contractStatusDraft => 'مسودة';

  @override
  String get contractStatusActive => 'نشط';

  @override
  String get contractStatusExpired => 'منتهي الصلاحية';

  @override
  String get contractStatusTerminated => 'منتهي';

  @override
  String get contractStatusRenewed => 'مجدد';

  @override
  String get contractStatusPending => 'قيد الانتظار';

  @override
  String get contractStatusArchived => 'مؤرشف';

  @override
  String get taxRecordAny => '';

  @override
  String get taxRecordPaid => '';

  @override
  String get taxRecordUnpaid => '';

  @override
  String get taxRecordsTitle => 'السجلات الضريبية';

  @override
  String get eventType => 'النوع';

  @override
  String get eventStatus => 'الحالة';

  @override
  String get eventProperty => 'العقار';

  @override
  String get eventAttendees => 'الحضور';

  @override
  String get eventDate => 'التاريخ';

  @override
  String get eventListTitle => 'الأحداث';

  @override
  String get eventGallery => 'المعرض';

  @override
  String get pricingRuleName => '';

  @override
  String get pricingRuleType => 'النوع';

  @override
  String get pricingRuleStatus => 'الحالة';

  @override
  String get pricingRuleMultiplier => 'المضاعف';

  @override
  String get pricingRuleFixedPrice => 'السعر الثابت';

  @override
  String get pricingRuleIsActive => 'نشط';

  @override
  String get pricingRulePropertyId => 'معرف العقار';

  @override
  String get pricingRuleCreatedAt => 'تاريخ الإنشاء';

  @override
  String get pricingRuleUpdatedAt => 'تاريخ التحديث';

  @override
  String get pricingRuleDeletedAt => 'تاريخ الحذف';

  @override
  String get pricingRuleConditions => 'الشروط';

  @override
  String get pricingRuleProperty => 'العقار';

  @override
  String get mentionType => 'النوع';

  @override
  String get mentionStatus => 'الحالة';

  @override
  String get taskType => '';

  @override
  String get taskStatus => 'الحالة';

  @override
  String get taskPriority => 'الأولوية';

  @override
  String get taskAssignedTo => 'مُعين إلى';

  @override
  String get taskCreatedAt => '';

  @override
  String get taskUpdatedAt => '';

  @override
  String get taskDeletedAt => '';

  @override
  String get guestStatus => 'الحالة';

  @override
  String get guestPhoneNumber => 'رقم الهاتف';

  @override
  String get reviewType => 'النوع';

  @override
  String get reviewStatus => 'الحالة';

  @override
  String get notificationType => 'النوع';

  @override
  String get notificationStatus => 'الحالة';

  @override
  String get messageType => 'النوع';

  @override
  String get messageStatus => 'الحالة';

  @override
  String get accountType => 'نوع الحساب';

  @override
  String get accountStatus => 'حالة الحساب';

  @override
  String get complianceTypeLicense => '';

  @override
  String get complianceTypeCertification => '';

  @override
  String get complianceTypeInsurance => '';

  @override
  String get complianceTypePermit => '';

  @override
  String get complianceTypeOther => '';

  @override
  String get complianceStatusPending => '';

  @override
  String get complianceStatusApproved => '';

  @override
  String get complianceStatusRejected => '';

  @override
  String get complianceStatusExpired => '';

  @override
  String get commonYes => '';

  @override
  String get commonNo => '';

  @override
  String get accountFilter_type_oauth => '';

  @override
  String get accountFilter_type_email => '';

  @override
  String get accountFilter_type_oidc => '';

  @override
  String get accountFilter_type_credentials => '';

  @override
  String get accountFilter_type_google => '';

  @override
  String get adminUsers => 'المستخدمون';

  @override
  String get adminExpenses => '';

  @override
  String get adminFacilities => '';

  @override
  String get adminHelpdesk => '';

  @override
  String get adminSubscriptions => '';

  @override
  String get adminContracts => '';

  @override
  String get adminGuests => '';

  @override
  String get adminCompliance => '';

  @override
  String get adminPricingRules => '';

  @override
  String get adminReviews => '';

  @override
  String get accountFilter_type_facebook => '';

  @override
  String get edit_agent_tooltip => 'تعديل الوكيل';

  @override
  String get agent_contact_information_title => 'معلومات الاتصال';

  @override
  String get agent_email_label => 'البريد الإلكتروني';

  @override
  String get agent_phone_label => 'الهاتف';

  @override
  String get agent_address_label => 'العنوان';

  @override
  String get agent_website_label => 'الموقع الإلكتروني';

  @override
  String get agent_professional_information_title => 'المعلومات المهنية';

  @override
  String get agent_status_label => 'الحالة';

  @override
  String get agent_agency_label => 'الوكالة';

  @override
  String get agent_specialities_label => 'التخصصات';

  @override
  String get agent_activity_title => 'النشاط الأخير';

  @override
  String get agent_last_active_label => 'آخر نشاط';

  @override
  String get agent_is_active_label => 'نشط';

  @override
  String get agent_created_at_label => 'تاريخ الإنشاء';

  @override
  String get common_not_available => 'غير متوفر';

  @override
  String get common_yes => 'نعم';

  @override
  String get common_no => 'لا';

  @override
  String get availability_edit_title => 'تعديل التوفر';

  @override
  String get common_save => 'حفظ';

  @override
  String get availability_date => 'التاريخ';

  @override
  String get availability_not_set => 'لم يتم التعيين';

  @override
  String get availability_blocked => 'محظور';

  @override
  String get availability_booked => 'محجوز';

  @override
  String get availability_property_id => 'معرف العقار';

  @override
  String get availability_reservation_id => 'معرف الحجز';

  @override
  String get availability_pricing_rule_id => 'معرف قاعدة التسعير';

  @override
  String get availability_total_units => 'إجمالي الوحدات';

  @override
  String get availability_available_units => 'الوحدات المتاحة';

  @override
  String get availability_booked_units => 'الوحدات المحجوزة';

  @override
  String get availability_blocked_units => 'الوحدات المحظورة';

  @override
  String get availability_base_price => 'السعر الأساسي';

  @override
  String get availability_current_price => 'السعر الحالي';

  @override
  String get availability_special_pricing_json => 'التسعير الخاص (JSON)';

  @override
  String get availability_price_settings_json => 'إعدادات السعر (JSON)';

  @override
  String get availability_min_nights => 'الحد الأدنى لليالي';

  @override
  String get availability_max_nights => 'الحد الأقصى لليالي';

  @override
  String get availability_max_guests => 'الحد الأقصى للضيوف';

  @override
  String get availability_discount_settings_json => 'إعدادات الخصم (JSON)';

  @override
  String get availability_weekend_rate => 'سعر عطلة نهاية الأسبوع';

  @override
  String get availability_weekday_rate => 'سعر أيام الأسبوع';

  @override
  String get availability_weekend_multiplier => 'مضاعف عطلة نهاية الأسبوع';

  @override
  String get availability_weekday_multiplier => 'مضاعف أيام الأسبوع';

  @override
  String get availability_seasonal_multiplier => 'المضاعف الموسمي';

  @override
  String get facilityTypeGym => '';

  @override
  String get facilityTypePool => '';

  @override
  String get facilityTypeParkingLot => '';

  @override
  String get facilityTypeLaundry => '';

  @override
  String get facilityTypeElevator => '';

  @override
  String get facilityTypeSecurity => '';

  @override
  String get facilityTypeOther => '';

  @override
  String get facilityStatusAvailable => 'متاح';

  @override
  String get facilityStatusUnavailable => 'غير متاح';

  @override
  String get facilityStatusMaintenance => 'صيانة';
}
