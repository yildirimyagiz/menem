// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for Persian (`fa`).
class AppLocalizationsFa extends AppLocalizations {
  AppLocalizationsFa([String locale = 'fa']) : super(locale);

  @override
  String get appTitle => 'Menem';

  @override
  String get dashboard => 'داشبورد';

  @override
  String get manageProperties => 'املاک خود را به طور موثر مدیریت کنید';

  @override
  String get quickAccess => 'دسترسی سریع';

  @override
  String get properties => 'املاک';

  @override
  String get tenants => 'مستاجرین';

  @override
  String get payments => 'پرداخت ها';

  @override
  String get tasks => 'وظایف';

  @override
  String get summaryStatistics => 'آمار خلاصه';

  @override
  String get totalProperties => 'کل املاک';

  @override
  String occupancyRate(Object rate) {
    return 'نرخ اشغال: $rate';
  }

  @override
  String get monthlyCashflow => 'جریان نقدی ماهانه';

  @override
  String pendingPayments(Object count) {
    return 'پرداخت های در انتظار: $count';
  }

  @override
  String get pendingTasks => 'وظایف در انتظار';

  @override
  String tasksThisWeek(Object count) {
    return '$count این هفته';
  }

  @override
  String get propertyDetailTitle => 'جزئیات ملک';

  @override
  String get propertyDetailOverviewTab => 'بررسی اجمالی';

  @override
  String get propertyDetailFeaturesTab => 'امکانات';

  @override
  String get propertyDetailLocationTab => 'موقعیت';

  @override
  String get propertyDetailGalleryTab => 'گالری';

  @override
  String get propertyDetailId => 'شناسه';

  @override
  String get propertyDetailNumber => 'شماره ملک';

  @override
  String get propertyDetailTitleField => 'عنوان';

  @override
  String get propertyDetailDescription => 'توضیحات';

  @override
  String get propertyDetailType => 'نوع';

  @override
  String get propertyDetailStatus => 'وضعیت';

  @override
  String get propertyDetailCategory => 'دسته بندی';

  @override
  String get propertyDetailCondition => 'شرایط';

  @override
  String get propertyDetailMarketValue => 'ارزش بازار';

  @override
  String get propertyDetailBedrooms => 'اتاق خواب ها';

  @override
  String get propertyDetailBathrooms => 'حمام ها';

  @override
  String get propertyDetailYearBuilt => 'سال ساخت';

  @override
  String get propertyDetailFeatures => 'امکانات';

  @override
  String get propertyDetailAmenities => 'امکانات رفاهی';

  @override
  String get propertyDetailAddress => 'آدرس';

  @override
  String get propertyDetailCity => 'شهر';

  @override
  String get propertyDetailState => 'استان';

  @override
  String get propertyDetailCountry => 'کشور';

  @override
  String get propertyDetailZipCode => 'کد پستی';

  @override
  String get propertyDetailCoordinates => 'مختصات';

  @override
  String get propertyDetailNoFeatures =>
      'هیچ ویژگی یا امکانات رفاهی موجود نیست';

  @override
  String get propertyDetailNoLocation => 'اطلاعات موقعیت مکانی موجود نیست';

  @override
  String get propertyDetailGalleryPlaceholder =>
      'نمای گالری (با GridView تصاویر پیاده سازی شود)';

  @override
  String get propertyDetailDeleteConfirm =>
      'آیا مطمئن هستید که می خواهید این ملک را حذف کنید؟';

  @override
  String get propertyDetailDeleteSuccess => 'ملک با موفقیت حذف شد';

  @override
  String propertyDetailDeleteFailed(Object error) {
    return 'حذف ملک انجام نشد: $error';
  }

  @override
  String get propertyDetailContactAgent => 'تماس با مشاور';

  @override
  String get propertyDetailPrice => 'قیمت';

  @override
  String get propertyDetailLoading => 'در حال بارگذاری جزئیات ملک...';

  @override
  String get propertyDetailNotFound => 'ملک یافت نشد.';

  @override
  String get totalTenants => 'کل مستاجرین';

  @override
  String newTenants(Object count) {
    return 'مستاجرین جدید: $count';
  }

  @override
  String get homeLabel => 'خانه';

  @override
  String get favoritesEmpty => 'هنوز هیچ مورد علاقه ای وجود ندارد';

  @override
  String get favoritesError => 'خطا در بارگیری موارد دلخواه';

  @override
  String get favoritesRetry => 'تلاش مجدد';

  @override
  String get emptyStateRetry => 'تلاش مجدد';

  @override
  String get listings => 'املاک من';

  @override
  String get listingsEmpty => 'هنوز هیچ لیستی وجود ندارد';

  @override
  String get listingsRetry => 'تلاش مجدد';

  @override
  String get filterPropertiesTitle => 'فیلتر کردن املاک';

  @override
  String get filterPropertiesApply => 'اعمال';

  @override
  String get filterPropertiesCancel => 'لغو';

  @override
  String get messagesLabel => 'پیام ها';

  @override
  String get notificationsLabel => 'اعلان ها';

  @override
  String get notificationsEmpty => 'هنوز هیچ اعلانی وجود ندارد';

  @override
  String get paymentsLabel => 'پرداخت ها';

  @override
  String get settingsLabel => 'تنظیمات';

  @override
  String get settingsAppearance => 'ظاهر';

  @override
  String get settingsDarkMode => 'حالت تاریک';

  @override
  String get filterTasksTitle => 'فیلتر کردن وظایف';

  @override
  String get filterTasksStatus => 'وضعیت';

  @override
  String get filterTasksPriority => 'اولویت';

  @override
  String get filterTasksType => 'نوع';

  @override
  String get filterTasksDueDate => 'تاریخ سررسید';

  @override
  String get filterTasksApply => 'اعمال';

  @override
  String get filterTasksCancel => 'لغو';

  @override
  String get profileLabel => 'پروفایل';

  @override
  String get logoutLabel => 'خروج از سیستم';

  @override
  String get loggingout => 'در حال خروج از سیستم...';

  @override
  String get sitetitle => 'رنتال پروک';

  @override
  String get nav_home => 'خانه';

  @override
  String get nav_properties => 'املاک';

  @override
  String get nav_payments => 'پرداخت ها';

  @override
  String get nav_tasks => 'وظایف';

  @override
  String get nav_messages => 'پیام ها';

  @override
  String get nav_notifications => 'اعلان ها';

  @override
  String get nav_helpdesk => 'میز کمک';

  @override
  String get nav_subscription => 'اشتراک';

  @override
  String get nav_settings => 'تنظیمات';

  @override
  String get nav_tenants => 'مستاجرین';

  @override
  String get nav_expenses => 'هزینه ها';

  @override
  String get nav_facilities => 'امکانات';

  @override
  String get nav_analytics => 'تجزیه و تحلیل';

  @override
  String get nav_help => 'کمک';

  @override
  String get nav_logout => 'خروج از سیستم';

  @override
  String get nav_profile => 'پروفایل';

  @override
  String get nav_viewAll => 'مشاهده همه';

  @override
  String get indexTitle => 'به منم خوش آمدید';

  @override
  String get indexDescription => 'راه حل مدیریت املاک شما';

  @override
  String get indexPropertyManagementTitle => 'مدیریت املاک';

  @override
  String get indexPropertyManagementDescription =>
      'املاک خود را با مجموعه جامع ابزارهای ما به طور موثر مدیریت کنید.';

  @override
  String get indexWaterManagementTitle => 'مدیریت آب';

  @override
  String get indexWaterManagementDescription =>
      'مصرف آب را در سراسر املاک خود ردیابی و بهینه کنید.';

  @override
  String get authSignIn => 'ورود با گوگل';

  @override
  String get authSignOut => 'خروج از سیستم';

  @override
  String get createPropertyTitle => 'ایجاد ملک جدید';

  @override
  String get propertyCreatedSuccess => 'ملک با موفقیت ایجاد شد';

  @override
  String get propertyCreatedError => 'ایجاد ملک انجام نشد';

  @override
  String get registerAlreadyHaveAccount => 'قبلاً حساب کاربری دارید؟ وارد شوید';

  @override
  String get registerForgotPassword => 'رمز عبور را فراموش کرده اید؟';

  @override
  String get propertyViewingEventsTitle => 'رویدادهای بازدید';

  @override
  String get propertyViewingSchedule => 'زمان بندی بازدید';

  @override
  String authWelcomeBack(Object name) {
    return 'خوش آمدید، $name';
  }

  @override
  String get postsCreate => 'ایجاد پست';

  @override
  String get postsTitle => 'عنوان';

  @override
  String get postsContent => 'محتوا';

  @override
  String get postsLoading => 'در حال بارگذاری پست ها...';

  @override
  String get postsSave => 'ذخیره';

  @override
  String get postsCancel => 'لغو';

  @override
  String get postsEdit => 'ویرایش';

  @override
  String get postsDelete => 'حذف';

  @override
  String get postsNoPostsYet => 'هنوز هیچ پستی وجود ندارد';

  @override
  String get postsErrorUnauthorized =>
      'برای انجام این عمل باید وارد سیستم شوید';

  @override
  String get postsErrorCreatePost => 'ایجاد پست انجام نشد';

  @override
  String get postsErrorUpdatePost => 'به روز رسانی پست انجام نشد';

  @override
  String get postsErrorDeletePost => 'حذف پست انجام نشد';

  @override
  String get chatMessages => 'پیام ها';

  @override
  String chatChattingWith(Object name) {
    return 'در حال گفتگو با $name';
  }

  @override
  String get chatConnectWithUsers =>
      'با کاربران ارتباط برقرار کنید و پشتیبانی دریافت کنید';

  @override
  String get chatBackToList => 'بازگشت به لیست';

  @override
  String get chatWelcomeToChat => 'به چت خوش آمدید';

  @override
  String get chatWelcomeDescription =>
      'با سایر کاربران گفتگو را شروع کنید یا برای کمک با پشتیبانی تماس بگیرید';

  @override
  String get chatNewMessage => 'پیام جدید';

  @override
  String get chatContactSupport => 'تماس با پشتیبانی';

  @override
  String get chatBack => 'بازگشت';

  @override
  String get chatSearchUsers => 'جستجوی کاربران...';

  @override
  String get chatTypeMessage => 'پیام خود را تایپ کنید...';

  @override
  String get chatSend => 'ارسال';

  @override
  String get chatErrorUnauthorized => 'برای انجام این عمل باید وارد سیستم شوید';

  @override
  String get chatErrorSendMessage => 'ارسال پیام انجام نشد';

  @override
  String get chatErrorMarkAsRead =>
      'علامت گذاری پیام ها به عنوان خوانده شده انجام نشد';

  @override
  String get chatError => 'خطا';

  @override
  String get chatConnectionError =>
      'اتصال به سرور چت انجام نشد. لطفاً دوباره تلاش کنید.';

  @override
  String get chatMessageSendError =>
      'ارسال پیام شما انجام نشد. لطفاً بعداً دوباره تلاش کنید.';

  @override
  String get notifications_placeholder => 'هنوز هیچ اعلانی وجود ندارد';

  @override
  String get notificationsPlaceholder => 'هنوز هیچ اعلانی وجود ندارد';

  @override
  String commonTimeAgo(Object time) {
    return '$time پیش';
  }

  @override
  String get commonSuccess => 'موفقیت';

  @override
  String get commonError => 'خطا';

  @override
  String propertiesFound(Object count) {
    return '$count ملک یافت شد';
  }

  @override
  String get errorScreenTitle => 'خطا';

  @override
  String get errorScreenGoBack => 'بازگشت';

  @override
  String get dateRangeSelectTitle => 'انتخاب محدوده تاریخ';

  @override
  String get dateRangeSelectApply => 'اعمال';

  @override
  String get dateRangeSelectCancel => 'لغو';

  @override
  String get commonWarning => 'هشدار';

  @override
  String get commonInfo => 'اطلاعات';

  @override
  String get commonLoading => 'در حال بارگذاری...';

  @override
  String get commonSave => 'ذخیره';

  @override
  String get commonCancel => 'لغو';

  @override
  String get commonDelete => 'حذف';

  @override
  String get commonEdit => 'ویرایش';

  @override
  String get commonCreate => 'ایجاد';

  @override
  String get commonView => 'مشاهده';

  @override
  String get commonPrevious => 'قبلی';

  @override
  String get commonNext => 'بعدی';

  @override
  String get commonBack => 'بازگشت';

  @override
  String get commonConfirm => 'تایید';

  @override
  String get commonActions => 'اقدامات';

  @override
  String get commonSearch => 'جستجو';

  @override
  String get commonFilter => 'فیلتر';

  @override
  String get commonSort => 'مرتب سازی';

  @override
  String get commonNoData => 'داده ای موجود نیست';

  @override
  String get editAgentTooltip => 'ویرایش مشاور';

  @override
  String get agentContactInformationTitle => 'اطلاعات تماس';

  @override
  String get agentEmailLabel => 'ایمیل';

  @override
  String get agentPhoneLabel => 'تلفن';

  @override
  String get agentAddressLabel => 'آدرس';

  @override
  String get agentWebsiteLabel => 'وب سایت';

  @override
  String get agentProfessionalInformationTitle => 'اطلاعات حرفه ای';

  @override
  String get agentStatusLabel => 'وضعیت';

  @override
  String get agentAgencyLabel => 'آژانس';

  @override
  String get agentSpecialitiesLabel => 'تخصص ها';

  @override
  String get agentActivityTitle => 'فعالیت اخیر';

  @override
  String get agentLastActiveLabel => 'آخرین فعالیت';

  @override
  String get agentIsActiveLabel => 'فعال است';

  @override
  String get agentCreatedAtLabel => 'ایجاد شده در';

  @override
  String get agentAdditionalInformationTitle => 'اطلاعات اضافی';

  @override
  String get agentBioLabel => 'بیوگرافی';

  @override
  String get agentExternalIdLabel => 'شناسه خارجی';

  @override
  String get agentSettingsLabel => 'تنظیمات';

  @override
  String get agentIntegrationLabel => 'ادغام';

  @override
  String get agentOwnerIdLabel => 'شناسه مالک';

  @override
  String get agentAgencyIdLabel => 'شناسه آژانس';

  @override
  String get agentDeletedAtLabel => 'حذف شده در';

  @override
  String get amenitiesSectionTitle => 'امکانات رفاهی';

  @override
  String get noAmenitiesListed => 'هیچ امکانات رفاهی لیست نشده است';

  @override
  String get locationSectionTitle => 'موقعیت';

  @override
  String get getDirectionsButton => 'دریافت مسیرها';

  @override
  String get messageStatusRead => 'خوانده شده';

  @override
  String get messageStatusDelivered => 'تحویل داده شده';

  @override
  String get messageStatusSent => 'ارسال شده';

  @override
  String get defaultUser => 'کاربر پیش فرض';

  @override
  String get unknownTime => 'زمان نامشخص';

  @override
  String get commonNotAvailable => 'در دسترس نیست';

  @override
  String accountsFound(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count حساب یافت شد',
      one: '1 حساب یافت شد',
      zero: 'هیچ حسابی یافت نشد',
    );
    return '$_temp0';
  }

  @override
  String get actionCardProperties => 'املاک';

  @override
  String get actionCardTenants => 'مستاجرین';

  @override
  String get actionCardAnalytics => 'تجزیه و تحلیل';

  @override
  String get actionCardPayments => 'پرداخت ها';

  @override
  String get actionCardTasks => 'وظایف';

  @override
  String get actionCardMessages => 'پیام ها';

  @override
  String get actionCardHelpDesk => 'میز کمک';

  @override
  String get actionCardManageYourPropertyPortfolio =>
      'پرتفوی املاک خود را مدیریت کنید';

  @override
  String get actionCardManageTenantInformation =>
      'اطلاعات مستاجر را مدیریت کنید';

  @override
  String get actionCardViewReportsAndAnalytics =>
      'مشاهده گزارشات و تجزیه و تحلیل ها';

  @override
  String get actionCardTrackFinancialRecords => 'سوابق مالی را پیگیری کنید';

  @override
  String get actionCardManageMaintenanceTasks => 'وظایف نگهداری را مدیریت کنید';

  @override
  String get actionCardCommunicateWithTenants =>
      'با مستاجرین ارتباط برقرار کنید';

  @override
  String get actionCardGetAssistanceWhenNeeded => 'در صورت نیاز کمک بگیرید';

  @override
  String get actionCardAddProperty => 'افزودن ملک';

  @override
  String get actionCardCreateANewPropertyListing => 'ایجاد لیست ملک جدید';

  @override
  String get actionCardAddTenant => 'افزودن مستاجر';

  @override
  String get actionCardRegisterANewTenant => 'ثبت نام مستاجر جدید';

  @override
  String get actionCardRecordPayment => 'ثبت پرداخت';

  @override
  String get actionCardRecordARentPayment => 'ثبت پرداخت اجاره';

  @override
  String get actionCardAddTask => 'افزودن وظیفه';

  @override
  String get actionCardCreateAMaintenanceTask => 'ایجاد وظیفه نگهداری';

  @override
  String get actionCardScheduleEvent => 'زمان بندی رویداد';

  @override
  String get actionCardCreateAPropertyEvent => 'ایجاد رویداد ملک';

  @override
  String get actionCardComposeMessage => 'نوشتن پیام';

  @override
  String get actionCardSendAMessageToTenants => 'ارسال پیام به مستاجرین';

  @override
  String get actionCardCreateDocument => 'ایجاد سند';

  @override
  String get actionCardGenerateANewDocument => 'ایجاد سند جدید';

  @override
  String get actionCardGetStarted => 'شروع کنید';

  @override
  String get actionCardNewThisMonth => 'جدید این ماه';

  @override
  String get tenantsTitle => 'مستاجرین';

  @override
  String get tenantsDescription =>
      'اطلاعات مستاجر و اجاره نامه ها را در سراسر املاک خود مدیریت کنید';

  @override
  String get tenantsAddTenant => 'افزودن مستاجر';

  @override
  String get tenantsPropertyFilter => 'ملک';

  @override
  String get tenantsAllProperties => 'همه املاک';

  @override
  String get tenantsPaymentStatusFilter => 'وضعیت پرداخت';

  @override
  String get tenantsAllStatuses => 'همه وضعیت ها';

  @override
  String get tenantsTenantColumn => 'مستاجر';

  @override
  String get tenantsStatusColumn => 'وضعیت';

  @override
  String get tenantsPropertyUnitColumn => 'ملک / واحد';

  @override
  String get tenantsContactColumn => 'تماس';

  @override
  String get tenantsLeasePeriodColumn => 'دوره اجاره';

  @override
  String get tenantsActionsColumn => 'اقدامات';

  @override
  String get tenantsIdLabel => 'شناسه';

  @override
  String get tenantsNotAssigned => 'اختصاص داده نشده';

  @override
  String get tenantsNotAvailable => 'نامشخص';

  @override
  String get tenantsLeaseFrom => 'از';

  @override
  String get tenantsLeaseTo => 'به';

  @override
  String get tenantsViewDetails => 'مشاهده جزئیات';

  @override
  String get tenantsEdit => 'ویرایش';

  @override
  String get tenantsDelete => 'حذف';

  @override
  String get tenantsNoTenantsFound => 'هیچ مستاجری یافت نشد';

  @override
  String get tenantsGetStartedAddTenant => 'با افزودن مستاجر جدید شروع کنید';

  @override
  String get tenantsConfirmDeletionTitle => 'تایید حذف';

  @override
  String tenantsConfirmDeletionDesc(Object tenant) {
    return 'آیا مطمئن هستید که می خواهید مستاجر $tenant را حذف کنید؟ این عمل قابل بازگشت نیست.';
  }

  @override
  String get tenantsCancel => 'لغو';

  @override
  String get tenantsDeleting => 'در حال حذف...';

  @override
  String get tenantsPrevious => 'قبلی';

  @override
  String get tenantsNext => 'بعدی';

  @override
  String get tenantsStatusUnpaid => 'پرداخت نشده';

  @override
  String get tenantsStatusPartiallyPaid => 'پرداخت جزئی';

  @override
  String get tenantsStatusPaid => 'پرداخت شده';

  @override
  String get tenantsStatusRefunded => 'بازپرداخت شده';

  @override
  String get tenantsStatusOverdue => 'سررسید گذشته';

  @override
  String get tenantsStatusCancelled => 'لغو شده';

  @override
  String get agenciesTitle => 'آژانس ها';

  @override
  String get agenciesDescription => 'آژانس ها و تنظیمات آنها را مدیریت کنید.';

  @override
  String get agenciesSearch => 'جستجوی آژانس ها...';

  @override
  String get agenciesStatus => 'وضعیت';

  @override
  String get agenciesStatusValuesPending => 'در انتظار';

  @override
  String get agenciesStatusValuesVerified => 'تایید شده';

  @override
  String get agenciesStatusValuesRejected => 'رد شده';

  @override
  String get agenciesAdd => 'افزودن آژانس';

  @override
  String get agenciesEdit => 'ویرایش';

  @override
  String get agenciesDelete => 'حذف';

  @override
  String agenciesConfirmDeleteDesc(Object name) {
    return 'آیا مطمئن هستید که می خواهید $name را حذف کنید؟ این عمل قابل بازگشت نیست.';
  }

  @override
  String get agenciesDeletedMsg => 'آژانس با موفقیت حذف شد.';

  @override
  String get agenciesNone =>
      'هیچ آژانسی با جستجوی شما مطابقت ندارد. فیلترهای مختلف را امتحان کنید.';

  @override
  String get agenciesNa => 'نامشخص';

  @override
  String get agenciesAgents => 'مشاورین';

  @override
  String get agenciesView => 'مشاهده';

  @override
  String get agenciesName => 'نام آژانس';

  @override
  String get agenciesEmail => 'ایمیل';

  @override
  String get agenciesPhoneNumber => 'شماره تلفن';

  @override
  String get agenciesAddress => 'آدرس';

  @override
  String get agenciesWebsite => 'وب سایت';

  @override
  String get agenciesLogoUrl => 'URL لوگو';

  @override
  String get agenciesCreated => 'ایجاد شده';

  @override
  String get agenciesUpdated => 'به روز شده';

  @override
  String get agenciesProperties => 'املاک';

  @override
  String get agenciesActions => 'اقدامات';

  @override
  String get agenciesCancel => 'لغو';

  @override
  String get agenciesDeleting => 'در حال حذف...';

  @override
  String get agenciesCreating => 'در حال ایجاد...';

  @override
  String get agenciesSaving => 'در حال ذخیره...';

  @override
  String get agenciesSave => 'ذخیره';

  @override
  String get agenciesCreate => 'ایجاد';

  @override
  String get agenciesGetStarted => 'با افزودن آژانس جدید شروع کنید';

  @override
  String get agenciesRequired => 'این فیلد الزامی است.';

  @override
  String get agenciesInvalidEmail => 'آدرس ایمیل نامعتبر است.';

  @override
  String get agenciesInvalidUrl => 'URL نامعتبر است.';

  @override
  String get agenciesUpdatedMsg => 'به روز شد!';

  @override
  String get agenciesCreatedMsg => 'ایجاد شد!';

  @override
  String get agenciesErrorLoad => 'بارگیری جزئیات انجام نشد.';

  @override
  String get agenciesErrorCreate => 'ایجاد انجام نشد.';

  @override
  String get agenciesErrorUpdate => 'به روز رسانی انجام نشد.';

  @override
  String get agenciesErrorDelete => 'حذف انجام نشد.';

  @override
  String get loginPageTitle => 'ورود به سیستم';

  @override
  String get loginPageEmail => 'ایمیل';

  @override
  String get loginPagePassword => 'رمز عبور';

  @override
  String get loginPageRememberMe => 'مرا به خاطر بسپار';

  @override
  String get loginPageForgotPassword => 'رمز عبور را فراموش کرده اید؟';

  @override
  String get loginPageSignIn => 'ورود به سیستم';

  @override
  String get loginPageOrContinueWith => 'یا ادامه با';

  @override
  String get loginPageDontHaveAccount => 'حساب کاربری ندارید؟';

  @override
  String get loginPageSignUp => 'ثبت نام';

  @override
  String get loginPageErrorInvalidCredentials =>
      'ایمیل یا رمز عبور نامعتبر است';

  @override
  String get loginPageErrorSomethingWentWrong =>
      'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.';

  @override
  String get loginPageErrorSessionExpired =>
      'جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.';

  @override
  String get authErrorTitle => 'خطای احراز هویت';

  @override
  String get authErrorSomethingWentWrong =>
      'در حین احراز هویت مشکلی پیش آمد. لطفاً دوباره تلاش کنید.';

  @override
  String get authErrorOauthAccountNotLinked =>
      'حسابی با این ایمیل از قبل وجود دارد. لطفاً با روش احراز هویت اصلی وارد شوید.';

  @override
  String get authErrorOauthCallbackError =>
      'در طول فرآیند بازگشت تماس OAuth خطایی روی داد.';

  @override
  String get authErrorOauthCreateAccountError =>
      'ایجاد حساب جدید انجام نشد. لطفاً دوباره تلاش کنید.';

  @override
  String get authErrorOauthSignInError =>
      'خطا در ورود با ارائه دهنده انتخاب شده. لطفاً دوباره تلاش کنید.';

  @override
  String get authErrorBackToLogin => 'بازگشت به ورود';

  @override
  String get propertyTitle => 'جزئیات ملک';

  @override
  String get propertyBackToProperties => 'بازگشت به املاک';

  @override
  String get propertyEditProperty => 'ویرایش ملک';

  @override
  String get propertyDeleteProperty => 'حذف ملک';

  @override
  String get propertyCreateProperty => 'ایجاد ملک';

  @override
  String get propertyAddProperty => 'افزودن ملک';

  @override
  String get propertyLoading => 'در حال بارگذاری ملک...';

  @override
  String get propertyNotFound => 'ملک یافت نشد.';

  @override
  String get propertyDebugInfo => 'اطلاعات اشکال زدایی:';

  @override
  String get propertyConfirmDeleteTitle =>
      'آیا مطمئن هستید که می خواهید این ملک را حذف کنید؟';

  @override
  String get propertyConfirmDeleteDescription =>
      'این عمل قابل بازگشت نیست. تمام داده های مرتبط با این ملک برای همیشه حذف خواهند شد.';

  @override
  String get propertyConfirmDeleteCancel => 'لغو';

  @override
  String get propertyConfirmDeleteConfirm => 'تایید حذف';

  @override
  String get propertyTabsOverview => 'بررسی اجمالی';

  @override
  String get propertyTabsFeatures => 'امکانات';

  @override
  String get propertyTabsAmenities => 'امکانات رفاهی';

  @override
  String get propertyTabsLocation => 'موقعیت';

  @override
  String get propertyTabsDocuments => 'اسناد';

  @override
  String get propertyTabsHistory => 'تاریخچه';

  @override
  String get propertySectionsBasicInfo => 'اطلاعات پایه';

  @override
  String get propertySectionsPhysicalCharacteristics => 'مشخصات فیزیکی';

  @override
  String get propertySectionsContactInfo => 'اطلاعات تماس';

  @override
  String get propertySectionsRelatedEntities => 'موجودیت های مرتبط';

  @override
  String get propertySectionsMetadata => 'فراداده';

  @override
  String get propertySectionsFeatures => 'امکانات';

  @override
  String get propertySectionsAmenities => 'امکانات رفاهی';

  @override
  String get propertySectionsLocationInfo => 'اطلاعات موقعیت';

  @override
  String get propertyFieldsTitle => 'عنوان';

  @override
  String get propertyFieldsDescription => 'توضیحات';

  @override
  String get propertyFieldsPropertyType => 'نوع ملک';

  @override
  String get propertyFieldsStatus => 'وضعیت';

  @override
  String get propertyFieldsCategory => 'دسته بندی';

  @override
  String get propertyFieldsBuildingClass => 'کلاس ساختمان';

  @override
  String get propertyFieldsCondition => 'شرایط';

  @override
  String get propertyFieldsSize => 'اندازه (متر مربع)';

  @override
  String get propertyFieldsBedrooms => 'اتاق خواب ها';

  @override
  String get propertyFieldsBathrooms => 'حمام ها';

  @override
  String get propertyFieldsYearBuilt => 'سال ساخت';

  @override
  String get propertyFieldsContactEmail => 'ایمیل تماس';

  @override
  String get propertyFieldsContactPhone => 'تلفن تماس';

  @override
  String get propertyFieldsOwner => 'مالک';

  @override
  String get propertyFieldsAgent => 'مشاور';

  @override
  String get propertyFieldsAgency => 'آژانس';

  @override
  String get propertyFieldsCreated => 'ایجاد شده';

  @override
  String get propertyFieldsUpdated => 'به روز شده';

  @override
  String get propertyFieldsListed => 'لیست شده';

  @override
  String get propertyFieldsAddress => 'آدرس';

  @override
  String get propertyFieldsCity => 'شهر';

  @override
  String get propertyFieldsStateProvince => 'استان/منطقه';

  @override
  String get propertyFieldsPostalCode => 'کد پستی';

  @override
  String get propertyFieldsCountry => 'کشور';

  @override
  String get propertyFieldsCoordinates => 'مختصات';

  @override
  String get propertyFieldsLatitude => 'عرض جغرافیایی';

  @override
  String get propertyFieldsLongitude => 'طول جغرافیایی';

  @override
  String get propertyNoFeatures => 'هیچ ویژگی لیست نشده است';

  @override
  String get propertyNoAmenities => 'هیچ امکانات رفاهی لیست نشده است';

  @override
  String get propertyNoCoordinates => 'مختصات موجود نیست';

  @override
  String get propertySuccessDeleted => 'ملک با موفقیت حذف شد';

  @override
  String get propertySuccessCreated => 'ملک با موفقیت ایجاد شد';

  @override
  String get propertySuccessUpdated => 'ملک با موفقیت به روز شد';

  @override
  String get propertyErrorDelete => 'حذف ملک انجام نشد';

  @override
  String get propertyErrorCreate => 'ایجاد ملک انجام نشد';

  @override
  String get propertyErrorUpdate => 'به روز رسانی ملک انجام نشد';

  @override
  String get propertyErrorFetch => 'واکشی جزئیات ملک انجام نشد';

  @override
  String get adminDashboard => 'داشبورد';

  @override
  String get adminProperties => 'املاک';

  @override
  String get adminAgents => 'مشاورین';

  @override
  String get adminAgencies => 'آژانس ها';

  @override
  String get adminOwners => 'مالکین';

  @override
  String get adminTenants => 'مستاجرین';

  @override
  String get adminPayments => 'پرداخت ها';

  @override
  String get adminTasks => 'وظایف';

  @override
  String get adminMessages => 'پیام ها';

  @override
  String get adminReports => 'گزارش ها';

  @override
  String get adminAnalytics => 'تجزیه و تحلیل';

  @override
  String get adminSettings => 'تنظیمات';

  @override
  String get adminNotifications => 'اعلان ها';

  @override
  String get account_id => 'شناسه حساب';

  @override
  String get account_type => 'نوع';

  @override
  String get account_provider => 'ارائه دهنده';

  @override
  String get accountFilter_type_BANK => 'حساب بانکی';

  @override
  String get accountFilter_type_CREDIT_CARD => 'کارت اعتباری';

  @override
  String get accountFilter_type_INVESTMENT => 'حساب سرمایه گذاری';

  @override
  String get accountFilter_type_SAVINGS => 'حساب پس انداز';

  @override
  String get accountFilter_type_LOAN => 'حساب وام';

  @override
  String get accountFilter_type_OTHER => 'حساب دیگر';

  @override
  String get facilityDetailTitle => 'جزئیات تسهیلات';

  @override
  String get facilityDetailId => 'شناسه';

  @override
  String get facilityDetailName => 'نام';

  @override
  String get facilityDetailDescription => 'توضیحات';

  @override
  String get facilityDetailType => 'نوع';

  @override
  String get facilityDetailStatus => 'وضعیت';

  @override
  String get facilityDetailPropertyId => 'شناسه ملک';

  @override
  String get facilityDetailLocation => 'موقعیت';

  @override
  String get facilityDetailMetadata => 'فراداده';

  @override
  String get facilityDetailCreatedBy => 'ایجاد شده توسط';

  @override
  String get facilityDetailUpdatedBy => 'به روز شده توسط';

  @override
  String get facilityDetailCreatedAt => 'ایجاد شده در';

  @override
  String get facilityDetailUpdatedAt => 'به روز شده در';

  @override
  String get facilityDetailDeletedAt => 'حذف شده در';

  @override
  String get complianceRecordDetailTitle => 'جزئیات سابقه انطباق';

  @override
  String get complianceRecordType => 'نوع';

  @override
  String get complianceRecordStatus => 'وضعیت';

  @override
  String get complianceRecordMetadata => 'فراداده';

  @override
  String get complianceRecordCustomFields => 'فیلدهای سفارشی';

  @override
  String get analyticsDetailTitle => 'جزئیات تجزیه و تحلیل';

  @override
  String get analyticsType => 'نوع';

  @override
  String get analyticsEntityType => 'نوع موجودیت';

  @override
  String get analyticsEntityId => 'شناسه موجودیت';

  @override
  String get analyticsTimestamp => 'مهر زمانی';

  @override
  String get analyticsPropertyId => 'شناسه ملک';

  @override
  String get analyticsUserId => 'شناسه کاربر';

  @override
  String get analyticsAgentId => 'شناسه مشاور';

  @override
  String get analyticsAgencyId => 'شناسه آژانس';

  @override
  String get analyticsReservationId => 'شناسه رزرو';

  @override
  String get analyticsTaskId => 'شناسه وظیفه';

  @override
  String get analyticsDeletedAt => 'حذف شده در';

  @override
  String get analyticsCreatedAt => 'ایجاد شده در';

  @override
  String get analyticsUpdatedAt => 'به روز شده در';

  @override
  String get analyticsData => 'داده ها';

  @override
  String get analyticsAgency => 'آژانس';

  @override
  String get analyticsAgent => 'مشاور';

  @override
  String get analyticsTypeListingView => 'نمای لیست';

  @override
  String get analyticsTypeBookingConversion => 'تبدیل رزرو';

  @override
  String get analyticsTypeUserEngagement => 'تعامل کاربر';

  @override
  String get analyticsTypeRevenue => 'درآمد';

  @override
  String get analyticsTypePerformance => 'عملکرد';

  @override
  String get analyticsTypeAgentPerformance => 'عملکرد مشاور';

  @override
  String get analyticsTypeAgencyPerformance => 'عملکرد آژانس';

  @override
  String get analyticsTypeView => 'مشاهده';

  @override
  String get contractDetailTitle => 'جزئیات قرارداد';

  @override
  String get contractIdLabel => 'شناسه';

  @override
  String get contractNameLabel => 'نام';

  @override
  String get contractDescriptionLabel => 'توضیحات';

  @override
  String get contractTypeLabel => 'نوع';

  @override
  String get contractStatusLabel => 'وضعیت';

  @override
  String get contractCurrencyLabel => 'ارز';

  @override
  String get contractRentAmountLabel => 'مبلغ اجاره';

  @override
  String get contractNoticePeriodLabel => 'دوره اطلاع رسانی';

  @override
  String get contractPropertyIdLabel => 'شناسه ملک';

  @override
  String get contractTenantIdLabel => 'شناسه مستاجر';

  @override
  String get contractLandlordIdLabel => 'شناسه موجر';

  @override
  String get contractOwnerIdLabel => 'شناسه مالک';

  @override
  String get contractAgencyIdLabel => 'شناسه آژانس';

  @override
  String get contractStartDateLabel => 'تاریخ شروع';

  @override
  String get contractEndDateLabel => 'تاریخ پایان';

  @override
  String get contractCreatedAtLabel => 'ایجاد شده در';

  @override
  String get contractUpdatedAtLabel => 'به روز شده در';

  @override
  String get contractDeletedAtLabel => 'حذف شده در';

  @override
  String get contractSignedByLabel => 'امضا شده توسط';

  @override
  String get contractSignedAtLabel => 'امضا شده در';

  @override
  String get contractTerminatedByLabel => 'فسخ شده توسط';

  @override
  String get contractTerminatedAtLabel => 'فسخ شده در';

  @override
  String get contractCancelledByLabel => 'لغو شده توسط';

  @override
  String get contractCancelledAtLabel => 'لغو شده در';

  @override
  String get contractTermsLabel => 'شرایط:';

  @override
  String get contractConditionsLabel => 'مقررات:';

  @override
  String get contractTypeRental => 'اجاره ای';

  @override
  String get contractTypeSale => 'فروش';

  @override
  String get contractTypeManagement => 'مدیریت';

  @override
  String get contractTypeCommission => 'کمیسیون';

  @override
  String get contractTypeService => 'خدمات';

  @override
  String get contractStatusDraft => 'پیش نویس';

  @override
  String get contractStatusActive => 'فعال';

  @override
  String get contractStatusExpired => 'منقضی شده';

  @override
  String get contractStatusTerminated => 'فسخ شده';

  @override
  String get contractStatusRenewed => 'تمدید شده';

  @override
  String get contractStatusPending => 'در انتظار';

  @override
  String get contractStatusArchived => 'بایگانی شده';

  @override
  String get taxRecordAny => 'هر';

  @override
  String get taxRecordPaid => 'پرداخت شده';

  @override
  String get taxRecordUnpaid => 'پرداخت نشده';

  @override
  String get taxRecordsTitle => 'سوابق مالیاتی';

  @override
  String get eventType => 'نوع';

  @override
  String get eventStatus => 'وضعیت';

  @override
  String get eventProperty => 'ملک';

  @override
  String get eventAttendees => 'شرکت کنندگان';

  @override
  String get eventDate => 'تاریخ';

  @override
  String get eventListTitle => 'رویدادها';

  @override
  String get eventGallery => 'گالری';

  @override
  String get pricingRuleName => 'نام';

  @override
  String get pricingRuleType => 'نوع';

  @override
  String get pricingRuleStatus => 'وضعیت';

  @override
  String get pricingRuleMultiplier => 'ضریب';

  @override
  String get pricingRuleFixedPrice => 'قیمت ثابت';

  @override
  String get pricingRuleIsActive => 'فعال است';

  @override
  String get pricingRulePropertyId => 'شناسه ملک';

  @override
  String get pricingRuleCreatedAt => 'ایجاد شده در';

  @override
  String get pricingRuleUpdatedAt => 'به روز شده در';

  @override
  String get pricingRuleDeletedAt => 'حذف شده در';

  @override
  String get pricingRuleConditions => 'شرایط';

  @override
  String get pricingRuleProperty => 'ملک';

  @override
  String get mentionType => 'نوع';

  @override
  String get mentionStatus => 'وضعیت';

  @override
  String get taskType => 'نوع';

  @override
  String get taskStatus => 'وضعیت';

  @override
  String get taskPriority => 'اولویت';

  @override
  String get taskAssignedTo => 'اختصاص داده شده به';

  @override
  String get taskCreatedAt => 'ایجاد شده در';

  @override
  String get taskUpdatedAt => 'به روز شده در';

  @override
  String get taskDeletedAt => 'حذف شده در';

  @override
  String get guestStatus => 'وضعیت';

  @override
  String get guestPhoneNumber => 'شماره تلفن';

  @override
  String get reviewType => 'نوع';

  @override
  String get reviewStatus => 'وضعیت';

  @override
  String get notificationType => 'نوع';

  @override
  String get notificationStatus => 'وضعیت';

  @override
  String get messageType => 'نوع';

  @override
  String get messageStatus => 'وضعیت';

  @override
  String get accountType => 'نوع';

  @override
  String get accountStatus => 'وضعیت';

  @override
  String get complianceTypeLicense => 'مجوز';

  @override
  String get complianceTypeCertification => 'گواهینامه';

  @override
  String get complianceTypeInsurance => 'بیمه';

  @override
  String get complianceTypePermit => 'پروانه';

  @override
  String get complianceTypeOther => 'دیگر';

  @override
  String get complianceStatusPending => 'در انتظار';

  @override
  String get complianceStatusApproved => 'تایید شده';

  @override
  String get complianceStatusRejected => 'رد شده';

  @override
  String get complianceStatusExpired => 'منقضی شده';

  @override
  String get commonYes => 'بله';

  @override
  String get commonNo => 'خیر';

  @override
  String get accountFilter_type_oauth => 'OAuth';

  @override
  String get accountFilter_type_email => 'ایمیل';

  @override
  String get accountFilter_type_oidc => 'OIDC';

  @override
  String get accountFilter_type_credentials => 'اعتبارنامه ها';

  @override
  String get accountFilter_type_google => 'گوگل';

  @override
  String get adminUsers => 'کاربران';

  @override
  String get adminExpenses => 'هزینه ها';

  @override
  String get adminFacilities => 'امکانات';

  @override
  String get adminHelpdesk => 'میز کمک';

  @override
  String get adminSubscriptions => 'اشتراک ها';

  @override
  String get adminContracts => 'قراردادها';

  @override
  String get adminGuests => 'مهمانان';

  @override
  String get adminCompliance => 'انطباق';

  @override
  String get adminPricingRules => 'قوانین قیمت گذاری';

  @override
  String get adminReviews => 'بررسی ها';

  @override
  String get accountFilter_type_facebook => 'فیس بوک';

  @override
  String get edit_agent_tooltip => 'ویرایش مشاور';

  @override
  String get agent_contact_information_title => 'اطلاعات تماس';

  @override
  String get agent_email_label => 'ایمیل';

  @override
  String get agent_phone_label => 'تلفن';

  @override
  String get agent_address_label => 'آدرس';

  @override
  String get agent_website_label => 'وب سایت';

  @override
  String get agent_professional_information_title => 'اطلاعات حرفه ای';

  @override
  String get agent_status_label => 'وضعیت';

  @override
  String get agent_agency_label => 'آژانس';

  @override
  String get agent_specialities_label => 'تخصص ها';

  @override
  String get agent_activity_title => 'فعالیت اخیر';

  @override
  String get agent_last_active_label => 'آخرین فعالیت';

  @override
  String get agent_is_active_label => 'فعال است';

  @override
  String get agent_created_at_label => 'ایجاد شده در';

  @override
  String get common_not_available => 'در دسترس نیست';

  @override
  String get common_yes => 'بله';

  @override
  String get common_no => 'خیر';

  @override
  String get availability_edit_title => 'ویرایش در دسترس بودن';

  @override
  String get common_save => 'ذخیره';

  @override
  String get availability_date => 'تاریخ';

  @override
  String get availability_not_set => 'تنظیم نشده';

  @override
  String get availability_blocked => 'مسدود شده';

  @override
  String get availability_booked => 'رزرو شده';

  @override
  String get availability_property_id => 'شناسه ملک';

  @override
  String get availability_reservation_id => 'شناسه رزرو';

  @override
  String get availability_pricing_rule_id => 'شناسه قانون قیمت گذاری';

  @override
  String get availability_total_units => 'کل واحدها';

  @override
  String get availability_available_units => 'واحدهای موجود';

  @override
  String get availability_booked_units => 'واحدهای رزرو شده';

  @override
  String get availability_blocked_units => 'واحدهای مسدود شده';

  @override
  String get availability_base_price => 'قیمت پایه';

  @override
  String get availability_current_price => 'قیمت فعلی';

  @override
  String get availability_special_pricing_json => 'قیمت گذاری ویژه (JSON)';

  @override
  String get availability_price_settings_json => 'تنظیمات قیمت (JSON)';

  @override
  String get availability_min_nights => 'حداقل شب ها';

  @override
  String get availability_max_nights => 'حداکثر شب ها';

  @override
  String get availability_max_guests => 'حداکثر مهمانان';

  @override
  String get availability_discount_settings_json => 'تنظیمات تخفیف (JSON)';

  @override
  String get availability_weekend_rate => 'نرخ آخر هفته';

  @override
  String get availability_weekday_rate => 'نرخ روزهای هفته';

  @override
  String get availability_weekend_multiplier => 'ضریب آخر هفته';

  @override
  String get availability_weekday_multiplier => 'ضریب روزهای هفته';

  @override
  String get availability_seasonal_multiplier => 'ضریب فصلی';

  @override
  String get facilityTypeGym => 'باشگاه بدنسازی';

  @override
  String get facilityTypePool => 'استخر';

  @override
  String get facilityTypeParkingLot => 'پارکینگ';

  @override
  String get facilityTypeLaundry => 'خشکشویی';

  @override
  String get facilityTypeElevator => 'آسانسور';

  @override
  String get facilityTypeSecurity => 'امنیت';

  @override
  String get facilityTypeOther => 'دیگر';

  @override
  String get facilityStatusAvailable => 'در دسترس';

  @override
  String get facilityStatusUnavailable => 'غیر قابل دسترس';

  @override
  String get facilityStatusMaintenance => 'در دست تعمیر';
}
