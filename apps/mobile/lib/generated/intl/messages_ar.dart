// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a ar locale. All the
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
  String get localeName => 'ar';

  static String m0(count) =>
      "${Intl.plural(count, zero: 'لم يتم العثور على حسابات', one: 'تم العثور على حساب واحد', two: 'تم العثور على حسابين', few: 'تم العثور على ${count} حسابات', many: 'تم العثور على ${count} حسابًا', other: 'تم العثور على ${count} حساب')}";

  static String m1(name) => "";

  static String m2(name) => "مرحباً بعودتك، ${name}";

  static String m3(name) => "";

  static String m4(time) => "منذ ${time}";

  static String m5(count) => "المستأجرون الجدد: ${count}";

  static String m6(rate) => "معدل الإشغال: ${rate}";

  static String m7(count) => "المدفوعات المعلقة: ${count}";

  static String m8(error) => "فشل حذف العقار: ${error}";

  static String m9(count) => "${count} هذا الأسبوع";

  static String m10(tenant) => "";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountFilter_type_BANK": MessageLookupByLibrary.simpleMessage(""),
    "accountFilter_type_CREDIT_CARD": MessageLookupByLibrary.simpleMessage(
      "بطاقة الائتمان",
    ),
    "accountFilter_type_INVESTMENT": MessageLookupByLibrary.simpleMessage(""),
    "accountFilter_type_LOAN": MessageLookupByLibrary.simpleMessage(""),
    "accountFilter_type_OTHER": MessageLookupByLibrary.simpleMessage(""),
    "accountFilter_type_SAVINGS": MessageLookupByLibrary.simpleMessage(""),
    "accountFilter_type_credentials": MessageLookupByLibrary.simpleMessage(""),
    "accountFilter_type_email": MessageLookupByLibrary.simpleMessage(""),
    "accountFilter_type_facebook": MessageLookupByLibrary.simpleMessage(""),
    "accountFilter_type_google": MessageLookupByLibrary.simpleMessage(""),
    "accountFilter_type_oauth": MessageLookupByLibrary.simpleMessage(""),
    "accountFilter_type_oidc": MessageLookupByLibrary.simpleMessage(""),
    "accountStatus": MessageLookupByLibrary.simpleMessage("حالة الحساب"),
    "accountType": MessageLookupByLibrary.simpleMessage("نوع الحساب"),
    "account_id": MessageLookupByLibrary.simpleMessage(""),
    "account_provider": MessageLookupByLibrary.simpleMessage("الموفر"),
    "account_type": MessageLookupByLibrary.simpleMessage("النوع"),
    "accountsFound": m0,
    "actionCardAddProperty": MessageLookupByLibrary.simpleMessage("إضافة عقار"),
    "actionCardAddTask": MessageLookupByLibrary.simpleMessage("إضافة مهمة"),
    "actionCardAddTenant": MessageLookupByLibrary.simpleMessage("إضافة مستأجر"),
    "actionCardAnalytics": MessageLookupByLibrary.simpleMessage("تحليلات"),
    "actionCardCommunicateWithTenants": MessageLookupByLibrary.simpleMessage(
      "التواصل مع المستأجرين",
    ),
    "actionCardComposeMessage": MessageLookupByLibrary.simpleMessage(""),
    "actionCardCreateAMaintenanceTask": MessageLookupByLibrary.simpleMessage(
      "",
    ),
    "actionCardCreateANewPropertyListing": MessageLookupByLibrary.simpleMessage(
      "إنشاء قائمة عقار جديدة",
    ),
    "actionCardCreateAPropertyEvent": MessageLookupByLibrary.simpleMessage(""),
    "actionCardCreateDocument": MessageLookupByLibrary.simpleMessage(
      "إنشاء مستند",
    ),
    "actionCardGenerateANewDocument": MessageLookupByLibrary.simpleMessage(
      "إنشاء مستند جديد",
    ),
    "actionCardGetAssistanceWhenNeeded": MessageLookupByLibrary.simpleMessage(
      "الحصول على المساعدة عند الحاجة",
    ),
    "actionCardGetStarted": MessageLookupByLibrary.simpleMessage("ابدأ الآن"),
    "actionCardHelpDesk": MessageLookupByLibrary.simpleMessage("مكتب المساعدة"),
    "actionCardManageMaintenanceTasks": MessageLookupByLibrary.simpleMessage(
      "إدارة مهام الصيانة",
    ),
    "actionCardManageTenantInformation": MessageLookupByLibrary.simpleMessage(
      "إدارة معلومات المستأجرين",
    ),
    "actionCardManageYourPropertyPortfolio":
        MessageLookupByLibrary.simpleMessage("إدارة محفظة العقارات الخاصة بك"),
    "actionCardMessages": MessageLookupByLibrary.simpleMessage("الرسائل"),
    "actionCardNewThisMonth": MessageLookupByLibrary.simpleMessage(
      "جديد هذا الشهر",
    ),
    "actionCardPayments": MessageLookupByLibrary.simpleMessage("المدفوعات"),
    "actionCardProperties": MessageLookupByLibrary.simpleMessage("العقارات"),
    "actionCardRecordARentPayment": MessageLookupByLibrary.simpleMessage(
      "تسجيل دفعة إيجار",
    ),
    "actionCardRecordPayment": MessageLookupByLibrary.simpleMessage(
      "تسجيل دفعة",
    ),
    "actionCardRegisterANewTenant": MessageLookupByLibrary.simpleMessage(
      "تسجيل مستأجر جديد",
    ),
    "actionCardScheduleEvent": MessageLookupByLibrary.simpleMessage(""),
    "actionCardSendAMessageToTenants": MessageLookupByLibrary.simpleMessage(
      "إرسال رسالة إلى المستأجرين",
    ),
    "actionCardTasks": MessageLookupByLibrary.simpleMessage("المهام"),
    "actionCardTenants": MessageLookupByLibrary.simpleMessage("المستأجرون"),
    "actionCardTrackFinancialRecords": MessageLookupByLibrary.simpleMessage(
      "تتبع السجلات المالية",
    ),
    "actionCardViewReportsAndAnalytics": MessageLookupByLibrary.simpleMessage(
      "عرض التقارير والتحليلات",
    ),
    "adminAgencies": MessageLookupByLibrary.simpleMessage(""),
    "adminAgents": MessageLookupByLibrary.simpleMessage(""),
    "adminAnalytics": MessageLookupByLibrary.simpleMessage("التحليلات"),
    "adminDashboard": MessageLookupByLibrary.simpleMessage("لوحة التحكم"),
    "adminMessages": MessageLookupByLibrary.simpleMessage(""),
    "adminNotifications": MessageLookupByLibrary.simpleMessage(""),
    "adminOwners": MessageLookupByLibrary.simpleMessage(""),
    "adminProperties": MessageLookupByLibrary.simpleMessage(""),
    "adminReports": MessageLookupByLibrary.simpleMessage(""),
    "adminSettings": MessageLookupByLibrary.simpleMessage(""),
    "adminTenants": MessageLookupByLibrary.simpleMessage(""),
    "agenciesActions": MessageLookupByLibrary.simpleMessage(""),
    "agenciesAdd": MessageLookupByLibrary.simpleMessage(""),
    "agenciesAddress": MessageLookupByLibrary.simpleMessage(""),
    "agenciesAgents": MessageLookupByLibrary.simpleMessage("الوكلاء"),
    "agenciesCancel": MessageLookupByLibrary.simpleMessage(""),
    "agenciesConfirmDeleteDesc": m1,
    "agenciesCreate": MessageLookupByLibrary.simpleMessage("إنشاء"),
    "agenciesCreated": MessageLookupByLibrary.simpleMessage(""),
    "agenciesCreatedMsg": MessageLookupByLibrary.simpleMessage("تم الإنشاء!"),
    "agenciesCreating": MessageLookupByLibrary.simpleMessage(""),
    "agenciesDelete": MessageLookupByLibrary.simpleMessage("حذف"),
    "agenciesDeletedMsg": MessageLookupByLibrary.simpleMessage(
      "تم حذف الوكالة بنجاح.",
    ),
    "agenciesDeleting": MessageLookupByLibrary.simpleMessage("جارٍ الحذف..."),
    "agenciesDescription": MessageLookupByLibrary.simpleMessage(
      "إدارة وكالاتك وإعداداتها.",
    ),
    "agenciesEdit": MessageLookupByLibrary.simpleMessage("تعديل"),
    "agenciesEmail": MessageLookupByLibrary.simpleMessage(""),
    "agenciesErrorCreate": MessageLookupByLibrary.simpleMessage("فشل الإنشاء."),
    "agenciesErrorDelete": MessageLookupByLibrary.simpleMessage(""),
    "agenciesErrorLoad": MessageLookupByLibrary.simpleMessage(
      "فشل تحميل التفاصيل.",
    ),
    "agenciesErrorUpdate": MessageLookupByLibrary.simpleMessage("فشل التحديث."),
    "agenciesGetStarted": MessageLookupByLibrary.simpleMessage(""),
    "agenciesInvalidEmail": MessageLookupByLibrary.simpleMessage(
      "عنوان بريد إلكتروني غير صالح.",
    ),
    "agenciesInvalidUrl": MessageLookupByLibrary.simpleMessage(
      "عنوان URL غير صالح.",
    ),
    "agenciesLogoUrl": MessageLookupByLibrary.simpleMessage(""),
    "agenciesNa": MessageLookupByLibrary.simpleMessage(""),
    "agenciesName": MessageLookupByLibrary.simpleMessage(""),
    "agenciesNone": MessageLookupByLibrary.simpleMessage(""),
    "agenciesPhoneNumber": MessageLookupByLibrary.simpleMessage(""),
    "agenciesProperties": MessageLookupByLibrary.simpleMessage("العقارات"),
    "agenciesRequired": MessageLookupByLibrary.simpleMessage(""),
    "agenciesSave": MessageLookupByLibrary.simpleMessage(""),
    "agenciesSaving": MessageLookupByLibrary.simpleMessage(""),
    "agenciesSearch": MessageLookupByLibrary.simpleMessage(""),
    "agenciesStatus": MessageLookupByLibrary.simpleMessage(""),
    "agenciesStatusValuesPending": MessageLookupByLibrary.simpleMessage(""),
    "agenciesStatusValuesRejected": MessageLookupByLibrary.simpleMessage(""),
    "agenciesStatusValuesVerified": MessageLookupByLibrary.simpleMessage(""),
    "agenciesTitle": MessageLookupByLibrary.simpleMessage("الوكالات"),
    "agenciesUpdated": MessageLookupByLibrary.simpleMessage(""),
    "agenciesUpdatedMsg": MessageLookupByLibrary.simpleMessage("تم التحديث!"),
    "agenciesView": MessageLookupByLibrary.simpleMessage(""),
    "agenciesWebsite": MessageLookupByLibrary.simpleMessage(""),
    "agentAdditionalInformationTitle": MessageLookupByLibrary.simpleMessage(""),
    "agentAddressLabel": MessageLookupByLibrary.simpleMessage(""),
    "agentAgencyIdLabel": MessageLookupByLibrary.simpleMessage(""),
    "agentBioLabel": MessageLookupByLibrary.simpleMessage("السيرة الذاتية"),
    "agentContactInformationTitle": MessageLookupByLibrary.simpleMessage(
      "معلومات الاتصال",
    ),
    "agentDeletedAtLabel": MessageLookupByLibrary.simpleMessage(""),
    "agentEmailLabel": MessageLookupByLibrary.simpleMessage(
      "البريد الإلكتروني",
    ),
    "agentExternalIdLabel": MessageLookupByLibrary.simpleMessage(
      "المعرف الخارجي",
    ),
    "agentIntegrationLabel": MessageLookupByLibrary.simpleMessage(""),
    "agentOwnerIdLabel": MessageLookupByLibrary.simpleMessage(""),
    "agentPhoneLabel": MessageLookupByLibrary.simpleMessage(""),
    "agentSettingsLabel": MessageLookupByLibrary.simpleMessage(""),
    "agentWebsiteLabel": MessageLookupByLibrary.simpleMessage(""),
    "amenitiesSectionTitle": MessageLookupByLibrary.simpleMessage("مرافق"),
    "analyticsAgency": MessageLookupByLibrary.simpleMessage("الوكالة"),
    "analyticsAgencyId": MessageLookupByLibrary.simpleMessage("معرف الوكالة"),
    "analyticsAgent": MessageLookupByLibrary.simpleMessage("الوكيل"),
    "analyticsAgentId": MessageLookupByLibrary.simpleMessage("معرف الوكيل"),
    "analyticsCreatedAt": MessageLookupByLibrary.simpleMessage("تاريخ الإنشاء"),
    "analyticsData": MessageLookupByLibrary.simpleMessage("البيانات"),
    "analyticsDeletedAt": MessageLookupByLibrary.simpleMessage("تاريخ الحذف"),
    "analyticsDetailTitle": MessageLookupByLibrary.simpleMessage(
      "تفاصيل التحليلات",
    ),
    "analyticsEntityId": MessageLookupByLibrary.simpleMessage("معرف الكيان"),
    "analyticsEntityType": MessageLookupByLibrary.simpleMessage("نوع الكيان"),
    "analyticsPropertyId": MessageLookupByLibrary.simpleMessage("معرف العقار"),
    "analyticsReservationId": MessageLookupByLibrary.simpleMessage(
      "معرف الحجز",
    ),
    "analyticsTaskId": MessageLookupByLibrary.simpleMessage("معرف المهمة"),
    "analyticsTimestamp": MessageLookupByLibrary.simpleMessage("الطابع الزمني"),
    "analyticsType": MessageLookupByLibrary.simpleMessage("النوع"),
    "analyticsTypeAgencyPerformance": MessageLookupByLibrary.simpleMessage(
      "أداء الوكالة",
    ),
    "analyticsTypeAgentPerformance": MessageLookupByLibrary.simpleMessage(
      "أداء الوكيل",
    ),
    "analyticsTypeBookingConversion": MessageLookupByLibrary.simpleMessage(
      "تحويل الحجز",
    ),
    "analyticsTypeListingView": MessageLookupByLibrary.simpleMessage(
      "عرض القائمة",
    ),
    "analyticsTypePerformance": MessageLookupByLibrary.simpleMessage("الأداء"),
    "analyticsTypeRevenue": MessageLookupByLibrary.simpleMessage("الإيرادات"),
    "analyticsTypeUserEngagement": MessageLookupByLibrary.simpleMessage(
      "تفاعل المستخدم",
    ),
    "analyticsTypeView": MessageLookupByLibrary.simpleMessage("عرض"),
    "analyticsUpdatedAt": MessageLookupByLibrary.simpleMessage("تاريخ التحديث"),
    "analyticsUserId": MessageLookupByLibrary.simpleMessage("معرف المستخدم"),
    "appTitle": MessageLookupByLibrary.simpleMessage("مينيم"),
    "authErrorBackToLogin": MessageLookupByLibrary.simpleMessage(""),
    "authErrorOauthAccountNotLinked": MessageLookupByLibrary.simpleMessage(""),
    "authErrorOauthCallbackError": MessageLookupByLibrary.simpleMessage(""),
    "authErrorOauthCreateAccountError": MessageLookupByLibrary.simpleMessage(
      "",
    ),
    "authErrorOauthSignInError": MessageLookupByLibrary.simpleMessage(""),
    "authErrorSomethingWentWrong": MessageLookupByLibrary.simpleMessage(""),
    "authErrorTitle": MessageLookupByLibrary.simpleMessage(""),
    "authSignIn": MessageLookupByLibrary.simpleMessage("تسجيل الدخول مع جوجل"),
    "authSignOut": MessageLookupByLibrary.simpleMessage("تسجيل الخروج"),
    "authWelcomeBack": m2,
    "chatBack": MessageLookupByLibrary.simpleMessage(""),
    "chatBackToList": MessageLookupByLibrary.simpleMessage(""),
    "chatChattingWith": m3,
    "chatConnectWithUsers": MessageLookupByLibrary.simpleMessage(""),
    "chatConnectionError": MessageLookupByLibrary.simpleMessage(
      "فشل الاتصال بخادم الدردشة. الرجاء معاودة المحاولة.",
    ),
    "chatContactSupport": MessageLookupByLibrary.simpleMessage(""),
    "chatError": MessageLookupByLibrary.simpleMessage(""),
    "chatErrorMarkAsRead": MessageLookupByLibrary.simpleMessage(""),
    "chatErrorSendMessage": MessageLookupByLibrary.simpleMessage(""),
    "chatErrorUnauthorized": MessageLookupByLibrary.simpleMessage(""),
    "chatMessageSendError": MessageLookupByLibrary.simpleMessage(
      "فشل إرسال رسالتك. يرجى المحاولة مرة أخرى في وقت لاحق.",
    ),
    "chatMessages": MessageLookupByLibrary.simpleMessage(""),
    "chatNewMessage": MessageLookupByLibrary.simpleMessage(""),
    "chatSearchUsers": MessageLookupByLibrary.simpleMessage(""),
    "chatSend": MessageLookupByLibrary.simpleMessage(""),
    "chatTypeMessage": MessageLookupByLibrary.simpleMessage(""),
    "chatWelcomeDescription": MessageLookupByLibrary.simpleMessage(""),
    "chatWelcomeToChat": MessageLookupByLibrary.simpleMessage(""),
    "commonActions": MessageLookupByLibrary.simpleMessage("إجراءات"),
    "commonBack": MessageLookupByLibrary.simpleMessage("العودة"),
    "commonCancel": MessageLookupByLibrary.simpleMessage("إلغاء"),
    "commonConfirm": MessageLookupByLibrary.simpleMessage("تأكيد"),
    "commonCreate": MessageLookupByLibrary.simpleMessage("إنشاء"),
    "commonDelete": MessageLookupByLibrary.simpleMessage("حذف"),
    "commonEdit": MessageLookupByLibrary.simpleMessage("تعديل"),
    "commonError": MessageLookupByLibrary.simpleMessage("خطأ"),
    "commonFilter": MessageLookupByLibrary.simpleMessage("تصفية"),
    "commonInfo": MessageLookupByLibrary.simpleMessage("معلومات"),
    "commonLoading": MessageLookupByLibrary.simpleMessage("جاري التحميل..."),
    "commonNext": MessageLookupByLibrary.simpleMessage("التالي"),
    "commonNo": MessageLookupByLibrary.simpleMessage(""),
    "commonNoData": MessageLookupByLibrary.simpleMessage("لا توجد بيانات"),
    "commonNotAvailable": MessageLookupByLibrary.simpleMessage(""),
    "commonPrevious": MessageLookupByLibrary.simpleMessage("السابق"),
    "commonSave": MessageLookupByLibrary.simpleMessage("حفظ"),
    "commonSearch": MessageLookupByLibrary.simpleMessage("بحث"),
    "commonSort": MessageLookupByLibrary.simpleMessage("ترتيب"),
    "commonSuccess": MessageLookupByLibrary.simpleMessage("نجاح"),
    "commonTimeAgo": m4,
    "commonView": MessageLookupByLibrary.simpleMessage("عرض"),
    "commonWarning": MessageLookupByLibrary.simpleMessage("تحذير"),
    "commonYes": MessageLookupByLibrary.simpleMessage(""),
    "complianceRecordCustomFields": MessageLookupByLibrary.simpleMessage(""),
    "complianceRecordDetailTitle": MessageLookupByLibrary.simpleMessage(
      "تفاصيل سجل الإمتثال",
    ),
    "complianceRecordMetadata": MessageLookupByLibrary.simpleMessage(""),
    "complianceRecordStatus": MessageLookupByLibrary.simpleMessage(""),
    "complianceRecordType": MessageLookupByLibrary.simpleMessage(""),
    "contractAgencyIdLabel": MessageLookupByLibrary.simpleMessage(
      "معرف الوكالة",
    ),
    "contractCancelledAtLabel": MessageLookupByLibrary.simpleMessage(
      "تاريخ الإلغاء",
    ),
    "contractCancelledByLabel": MessageLookupByLibrary.simpleMessage(
      "تم الإلغاء بواسطة",
    ),
    "contractConditionsLabel": MessageLookupByLibrary.simpleMessage(":الظروف"),
    "contractCreatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "تاريخ الإنشاء",
    ),
    "contractCurrencyLabel": MessageLookupByLibrary.simpleMessage("العملة"),
    "contractDeletedAtLabel": MessageLookupByLibrary.simpleMessage(
      "تاريخ الحذف",
    ),
    "contractDescriptionLabel": MessageLookupByLibrary.simpleMessage("الوصف"),
    "contractDetailTitle": MessageLookupByLibrary.simpleMessage("تفاصيل العقد"),
    "contractEndDateLabel": MessageLookupByLibrary.simpleMessage(
      "تاريخ الانتهاء",
    ),
    "contractIdLabel": MessageLookupByLibrary.simpleMessage("المعرف"),
    "contractLandlordIdLabel": MessageLookupByLibrary.simpleMessage(
      "معرف المالك",
    ),
    "contractNameLabel": MessageLookupByLibrary.simpleMessage("الاسم"),
    "contractNoticePeriodLabel": MessageLookupByLibrary.simpleMessage(
      "فترة الإشعار",
    ),
    "contractOwnerIdLabel": MessageLookupByLibrary.simpleMessage("معرف المالك"),
    "contractPropertyIdLabel": MessageLookupByLibrary.simpleMessage(
      "معرف العقار",
    ),
    "contractRentAmountLabel": MessageLookupByLibrary.simpleMessage(
      "قيمة الإيجار",
    ),
    "contractSignedAtLabel": MessageLookupByLibrary.simpleMessage(
      "تاريخ التوقيع",
    ),
    "contractSignedByLabel": MessageLookupByLibrary.simpleMessage(
      "تم التوقيع بواسطة",
    ),
    "contractStartDateLabel": MessageLookupByLibrary.simpleMessage(
      "تاريخ البدء",
    ),
    "contractStatusArchived": MessageLookupByLibrary.simpleMessage("مؤرشف"),
    "contractStatusDraft": MessageLookupByLibrary.simpleMessage("مسودة"),
    "contractStatusExpired": MessageLookupByLibrary.simpleMessage(
      "منتهي الصلاحية",
    ),
    "contractStatusLabel": MessageLookupByLibrary.simpleMessage("الحالة"),
    "contractStatusPending": MessageLookupByLibrary.simpleMessage(
      "قيد الانتظار",
    ),
    "contractStatusRenewed": MessageLookupByLibrary.simpleMessage("مجدد"),
    "contractStatusTerminated": MessageLookupByLibrary.simpleMessage("منتهي"),
    "contractTenantIdLabel": MessageLookupByLibrary.simpleMessage(
      "معرف المستأجر",
    ),
    "contractTerminatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "تاريخ الإنهاء",
    ),
    "contractTerminatedByLabel": MessageLookupByLibrary.simpleMessage(
      "تم الإنهاء بواسطة",
    ),
    "contractTermsLabel": MessageLookupByLibrary.simpleMessage(":الشروط"),
    "contractTypeCommission": MessageLookupByLibrary.simpleMessage("عمولة"),
    "contractTypeLabel": MessageLookupByLibrary.simpleMessage("النوع"),
    "contractTypeManagement": MessageLookupByLibrary.simpleMessage("إدارة"),
    "contractTypeRental": MessageLookupByLibrary.simpleMessage("إيجار"),
    "contractTypeSale": MessageLookupByLibrary.simpleMessage("بيع"),
    "contractTypeService": MessageLookupByLibrary.simpleMessage("خدمة"),
    "contractUpdatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "تاريخ التحديث",
    ),
    "dashboard": MessageLookupByLibrary.simpleMessage("لوحة القيادة"),
    "defaultUser": MessageLookupByLibrary.simpleMessage("مستخدم افتراضي"),
    "editAgentTooltip": MessageLookupByLibrary.simpleMessage(""),
    "eventAttendees": MessageLookupByLibrary.simpleMessage("الحضور"),
    "eventDate": MessageLookupByLibrary.simpleMessage("التاريخ"),
    "eventGallery": MessageLookupByLibrary.simpleMessage("المعرض"),
    "eventListTitle": MessageLookupByLibrary.simpleMessage("الأحداث"),
    "eventProperty": MessageLookupByLibrary.simpleMessage("العقار"),
    "eventStatus": MessageLookupByLibrary.simpleMessage("الحالة"),
    "eventType": MessageLookupByLibrary.simpleMessage("النوع"),
    "facilityDetailCreatedAt": MessageLookupByLibrary.simpleMessage(
      "تاريخ الإنشاء",
    ),
    "facilityDetailCreatedBy": MessageLookupByLibrary.simpleMessage(
      "تم الإنشاء بواسطة",
    ),
    "facilityDetailDeletedAt": MessageLookupByLibrary.simpleMessage(""),
    "facilityDetailDescription": MessageLookupByLibrary.simpleMessage("الوصف"),
    "facilityDetailId": MessageLookupByLibrary.simpleMessage("المعرف"),
    "facilityDetailLocation": MessageLookupByLibrary.simpleMessage("الموقع"),
    "facilityDetailMetadata": MessageLookupByLibrary.simpleMessage(
      "البيانات الوصفية",
    ),
    "facilityDetailName": MessageLookupByLibrary.simpleMessage("الاسم"),
    "facilityDetailPropertyId": MessageLookupByLibrary.simpleMessage(
      "معرف العقار",
    ),
    "facilityDetailStatus": MessageLookupByLibrary.simpleMessage("الحالة"),
    "facilityDetailTitle": MessageLookupByLibrary.simpleMessage(
      "تفاصيل المنشأة",
    ),
    "facilityDetailType": MessageLookupByLibrary.simpleMessage("النوع"),
    "facilityDetailUpdatedAt": MessageLookupByLibrary.simpleMessage(
      "تاريخ التحديث",
    ),
    "facilityDetailUpdatedBy": MessageLookupByLibrary.simpleMessage(
      "تم التحديث بواسطة",
    ),
    "facilityStatusAvailable": MessageLookupByLibrary.simpleMessage("متاح"),
    "facilityStatusMaintenance": MessageLookupByLibrary.simpleMessage("صيانة"),
    "facilityStatusUnavailable": MessageLookupByLibrary.simpleMessage(
      "غير متاح",
    ),
    "facilityTypeGym": MessageLookupByLibrary.simpleMessage(""),
    "facilityTypeOther": MessageLookupByLibrary.simpleMessage(""),
    "facilityTypeParkingLot": MessageLookupByLibrary.simpleMessage(""),
    "facilityTypePool": MessageLookupByLibrary.simpleMessage(""),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage(
      "احصل على الاتجاهات",
    ),
    "guestPhoneNumber": MessageLookupByLibrary.simpleMessage("رقم الهاتف"),
    "guestStatus": MessageLookupByLibrary.simpleMessage("الحالة"),
    "homeLabel": MessageLookupByLibrary.simpleMessage("الرئيسية"),
    "indexDescription": MessageLookupByLibrary.simpleMessage(
      "حلول إدارة العقارات الخاصة بك",
    ),
    "indexPropertyManagementDescription": MessageLookupByLibrary.simpleMessage(
      "إدارة عقاراتك بفعالية مع مجموعة أدواتنا الشاملة.",
    ),
    "indexPropertyManagementTitle": MessageLookupByLibrary.simpleMessage(
      "إدارة العقارات",
    ),
    "indexTitle": MessageLookupByLibrary.simpleMessage("مرحباً بكم في مينيم"),
    "indexWaterManagementDescription": MessageLookupByLibrary.simpleMessage(
      "تتبع وتحسين استخدام المياه عبر عقاراتك.",
    ),
    "indexWaterManagementTitle": MessageLookupByLibrary.simpleMessage(
      "إدارة المياه",
    ),
    "listings": MessageLookupByLibrary.simpleMessage("عقاراتي"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage("موقع"),
    "loggingout": MessageLookupByLibrary.simpleMessage("...جار تسجيل الخروج"),
    "loginPageDontHaveAccount": MessageLookupByLibrary.simpleMessage(""),
    "loginPageEmail": MessageLookupByLibrary.simpleMessage(""),
    "loginPageErrorInvalidCredentials": MessageLookupByLibrary.simpleMessage(
      "",
    ),
    "loginPageErrorSessionExpired": MessageLookupByLibrary.simpleMessage(""),
    "loginPageErrorSomethingWentWrong": MessageLookupByLibrary.simpleMessage(
      "",
    ),
    "loginPageForgotPassword": MessageLookupByLibrary.simpleMessage(""),
    "loginPageOrContinueWith": MessageLookupByLibrary.simpleMessage(""),
    "loginPagePassword": MessageLookupByLibrary.simpleMessage(""),
    "loginPageRememberMe": MessageLookupByLibrary.simpleMessage(""),
    "loginPageSignIn": MessageLookupByLibrary.simpleMessage(""),
    "loginPageSignUp": MessageLookupByLibrary.simpleMessage(""),
    "loginPageTitle": MessageLookupByLibrary.simpleMessage(""),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("تسجيل الخروج"),
    "manageProperties": MessageLookupByLibrary.simpleMessage(
      "إدارة ممتلكاتك بفعالية",
    ),
    "mentionStatus": MessageLookupByLibrary.simpleMessage("الحالة"),
    "mentionType": MessageLookupByLibrary.simpleMessage("النوع"),
    "messageStatus": MessageLookupByLibrary.simpleMessage("الحالة"),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage(
      "تم التسليم",
    ),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("تم القراءة"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("تم الإرسال"),
    "messageType": MessageLookupByLibrary.simpleMessage("النوع"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("الرسائل"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage(
      "التدفق النقدي الشهري",
    ),
    "nav_analytics": MessageLookupByLibrary.simpleMessage(""),
    "nav_expenses": MessageLookupByLibrary.simpleMessage(""),
    "nav_facilities": MessageLookupByLibrary.simpleMessage(""),
    "nav_help": MessageLookupByLibrary.simpleMessage(""),
    "nav_helpdesk": MessageLookupByLibrary.simpleMessage(""),
    "nav_home": MessageLookupByLibrary.simpleMessage("الرئيسية"),
    "nav_logout": MessageLookupByLibrary.simpleMessage(""),
    "nav_messages": MessageLookupByLibrary.simpleMessage(""),
    "nav_notifications": MessageLookupByLibrary.simpleMessage(""),
    "nav_payments": MessageLookupByLibrary.simpleMessage(""),
    "nav_profile": MessageLookupByLibrary.simpleMessage(""),
    "nav_properties": MessageLookupByLibrary.simpleMessage("العقارات"),
    "nav_settings": MessageLookupByLibrary.simpleMessage(""),
    "nav_subscription": MessageLookupByLibrary.simpleMessage(""),
    "nav_tasks": MessageLookupByLibrary.simpleMessage(""),
    "nav_tenants": MessageLookupByLibrary.simpleMessage(""),
    "nav_viewAll": MessageLookupByLibrary.simpleMessage(""),
    "newTenants": m5,
    "noAmenitiesListed": MessageLookupByLibrary.simpleMessage("لا توجد مرافق"),
    "notificationStatus": MessageLookupByLibrary.simpleMessage("الحالة"),
    "notificationType": MessageLookupByLibrary.simpleMessage("النوع"),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage("الإشعارات"),
    "notificationsPlaceholder": MessageLookupByLibrary.simpleMessage(
      "لا توجد إشعارات حتى الآن",
    ),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage(""),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("المدفوعات"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("المدفوعات"),
    "pendingPayments": m7,
    "pendingTasks": MessageLookupByLibrary.simpleMessage("المهام المعلقة"),
    "postsCancel": MessageLookupByLibrary.simpleMessage(""),
    "postsContent": MessageLookupByLibrary.simpleMessage(""),
    "postsCreate": MessageLookupByLibrary.simpleMessage(""),
    "postsDelete": MessageLookupByLibrary.simpleMessage(""),
    "postsEdit": MessageLookupByLibrary.simpleMessage(""),
    "postsErrorCreatePost": MessageLookupByLibrary.simpleMessage(""),
    "postsErrorDeletePost": MessageLookupByLibrary.simpleMessage(""),
    "postsErrorUnauthorized": MessageLookupByLibrary.simpleMessage(""),
    "postsErrorUpdatePost": MessageLookupByLibrary.simpleMessage(""),
    "postsLoading": MessageLookupByLibrary.simpleMessage(""),
    "postsNoPostsYet": MessageLookupByLibrary.simpleMessage(""),
    "postsSave": MessageLookupByLibrary.simpleMessage(""),
    "postsTitle": MessageLookupByLibrary.simpleMessage(""),
    "pricingRuleConditions": MessageLookupByLibrary.simpleMessage("الشروط"),
    "pricingRuleCreatedAt": MessageLookupByLibrary.simpleMessage(
      "تاريخ الإنشاء",
    ),
    "pricingRuleDeletedAt": MessageLookupByLibrary.simpleMessage("تاريخ الحذف"),
    "pricingRuleFixedPrice": MessageLookupByLibrary.simpleMessage(
      "السعر الثابت",
    ),
    "pricingRuleIsActive": MessageLookupByLibrary.simpleMessage("نشط"),
    "pricingRuleMultiplier": MessageLookupByLibrary.simpleMessage("المضاعف"),
    "pricingRuleName": MessageLookupByLibrary.simpleMessage(""),
    "pricingRuleProperty": MessageLookupByLibrary.simpleMessage("العقار"),
    "pricingRulePropertyId": MessageLookupByLibrary.simpleMessage(
      "معرف العقار",
    ),
    "pricingRuleStatus": MessageLookupByLibrary.simpleMessage("الحالة"),
    "pricingRuleType": MessageLookupByLibrary.simpleMessage("النوع"),
    "pricingRuleUpdatedAt": MessageLookupByLibrary.simpleMessage(
      "تاريخ التحديث",
    ),
    "profileLabel": MessageLookupByLibrary.simpleMessage("الملف الشخصي"),
    "properties": MessageLookupByLibrary.simpleMessage("العقارات"),
    "propertyAddProperty": MessageLookupByLibrary.simpleMessage(""),
    "propertyBackToProperties": MessageLookupByLibrary.simpleMessage(""),
    "propertyConfirmDeleteCancel": MessageLookupByLibrary.simpleMessage(""),
    "propertyConfirmDeleteConfirm": MessageLookupByLibrary.simpleMessage(
      "تأكيد الحذف",
    ),
    "propertyConfirmDeleteDescription": MessageLookupByLibrary.simpleMessage(
      "",
    ),
    "propertyConfirmDeleteTitle": MessageLookupByLibrary.simpleMessage(""),
    "propertyCreateProperty": MessageLookupByLibrary.simpleMessage(
      "إنشاء عقار",
    ),
    "propertyDebugInfo": MessageLookupByLibrary.simpleMessage(""),
    "propertyDeleteProperty": MessageLookupByLibrary.simpleMessage(""),
    "propertyDetailAddress": MessageLookupByLibrary.simpleMessage("العنوان"),
    "propertyDetailAmenities": MessageLookupByLibrary.simpleMessage("المرافق"),
    "propertyDetailBathrooms": MessageLookupByLibrary.simpleMessage("الحمامات"),
    "propertyDetailBedrooms": MessageLookupByLibrary.simpleMessage("غرف النوم"),
    "propertyDetailCategory": MessageLookupByLibrary.simpleMessage(""),
    "propertyDetailCity": MessageLookupByLibrary.simpleMessage("المدينة"),
    "propertyDetailCondition": MessageLookupByLibrary.simpleMessage("الحالة"),
    "propertyDetailContactAgent": MessageLookupByLibrary.simpleMessage(
      "اتصل بالوكيل",
    ),
    "propertyDetailCoordinates": MessageLookupByLibrary.simpleMessage(
      "الإحداثيات",
    ),
    "propertyDetailCountry": MessageLookupByLibrary.simpleMessage("الدولة"),
    "propertyDetailDeleteConfirm": MessageLookupByLibrary.simpleMessage(
      "هل أنت متأكد أنك تريد حذف هذا العقار؟",
    ),
    "propertyDetailDeleteFailed": m8,
    "propertyDetailDeleteSuccess": MessageLookupByLibrary.simpleMessage(""),
    "propertyDetailDescription": MessageLookupByLibrary.simpleMessage("الوصف"),
    "propertyDetailFeatures": MessageLookupByLibrary.simpleMessage("الميزات"),
    "propertyDetailFeaturesTab": MessageLookupByLibrary.simpleMessage(
      "الميزات",
    ),
    "propertyDetailGalleryPlaceholder": MessageLookupByLibrary.simpleMessage(
      "عرض المعرض (تنفيذ باستخدام GridView للصور)",
    ),
    "propertyDetailGalleryTab": MessageLookupByLibrary.simpleMessage("المعرض"),
    "propertyDetailId": MessageLookupByLibrary.simpleMessage("المعرف"),
    "propertyDetailLoading": MessageLookupByLibrary.simpleMessage(
      "جاري تحميل تفاصيل العقار...",
    ),
    "propertyDetailLocationTab": MessageLookupByLibrary.simpleMessage("الموقع"),
    "propertyDetailMarketValue": MessageLookupByLibrary.simpleMessage(
      "القيمة السوقية",
    ),
    "propertyDetailNoFeatures": MessageLookupByLibrary.simpleMessage(
      "لا توجد ميزات أو مرافق متوفرة",
    ),
    "propertyDetailNoLocation": MessageLookupByLibrary.simpleMessage(
      "لا توجد معلومات عن الموقع",
    ),
    "propertyDetailNotFound": MessageLookupByLibrary.simpleMessage(
      "لم يتم العثور على العقار.",
    ),
    "propertyDetailNumber": MessageLookupByLibrary.simpleMessage("رقم العقار"),
    "propertyDetailOverviewTab": MessageLookupByLibrary.simpleMessage(
      "نظرة عامة",
    ),
    "propertyDetailPrice": MessageLookupByLibrary.simpleMessage("السعر"),
    "propertyDetailState": MessageLookupByLibrary.simpleMessage("الولاية"),
    "propertyDetailStatus": MessageLookupByLibrary.simpleMessage(""),
    "propertyDetailTitle": MessageLookupByLibrary.simpleMessage(
      "تفاصيل العقار",
    ),
    "propertyDetailTitleField": MessageLookupByLibrary.simpleMessage("العنوان"),
    "propertyDetailType": MessageLookupByLibrary.simpleMessage(""),
    "propertyDetailYearBuilt": MessageLookupByLibrary.simpleMessage(
      "سنة الإنشاء",
    ),
    "propertyDetailZipCode": MessageLookupByLibrary.simpleMessage(
      "الرمز البريدي",
    ),
    "propertyEditProperty": MessageLookupByLibrary.simpleMessage(""),
    "propertyErrorCreate": MessageLookupByLibrary.simpleMessage(
      "فشل إنشاء العقار",
    ),
    "propertyErrorDelete": MessageLookupByLibrary.simpleMessage(""),
    "propertyErrorFetch": MessageLookupByLibrary.simpleMessage(""),
    "propertyErrorUpdate": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsAddress": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsAgency": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsAgent": MessageLookupByLibrary.simpleMessage("الوكيل"),
    "propertyFieldsBathrooms": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsBedrooms": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsBuildingClass": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsCategory": MessageLookupByLibrary.simpleMessage("الفئة"),
    "propertyFieldsCity": MessageLookupByLibrary.simpleMessage("المدينة"),
    "propertyFieldsCondition": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsContactEmail": MessageLookupByLibrary.simpleMessage(
      "بريد الاتصال",
    ),
    "propertyFieldsContactPhone": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsCoordinates": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsCountry": MessageLookupByLibrary.simpleMessage("الدولة"),
    "propertyFieldsCreated": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsDescription": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsLatitude": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsListed": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsLongitude": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsOwner": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsPostalCode": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsPropertyType": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsSize": MessageLookupByLibrary.simpleMessage("المساحة (م²)"),
    "propertyFieldsStateProvince": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsStatus": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsTitle": MessageLookupByLibrary.simpleMessage("العنوان"),
    "propertyFieldsUpdated": MessageLookupByLibrary.simpleMessage(""),
    "propertyFieldsYearBuilt": MessageLookupByLibrary.simpleMessage(""),
    "propertyLoading": MessageLookupByLibrary.simpleMessage(""),
    "propertyNoAmenities": MessageLookupByLibrary.simpleMessage(
      "لا توجد مرافق مدرجة",
    ),
    "propertyNoCoordinates": MessageLookupByLibrary.simpleMessage(""),
    "propertyNoFeatures": MessageLookupByLibrary.simpleMessage(
      "لا توجد ميزات مدرجة",
    ),
    "propertyNotFound": MessageLookupByLibrary.simpleMessage(
      "لم يتم العثور على العقار.",
    ),
    "propertySectionsAmenities": MessageLookupByLibrary.simpleMessage(
      "المرافق",
    ),
    "propertySectionsBasicInfo": MessageLookupByLibrary.simpleMessage(""),
    "propertySectionsContactInfo": MessageLookupByLibrary.simpleMessage(""),
    "propertySectionsFeatures": MessageLookupByLibrary.simpleMessage("الميزات"),
    "propertySectionsLocationInfo": MessageLookupByLibrary.simpleMessage(""),
    "propertySectionsMetadata": MessageLookupByLibrary.simpleMessage(""),
    "propertySectionsPhysicalCharacteristics":
        MessageLookupByLibrary.simpleMessage(""),
    "propertySectionsRelatedEntities": MessageLookupByLibrary.simpleMessage(""),
    "propertySuccessCreated": MessageLookupByLibrary.simpleMessage(""),
    "propertySuccessDeleted": MessageLookupByLibrary.simpleMessage(
      "تم حذف العقار بنجاح",
    ),
    "propertySuccessUpdated": MessageLookupByLibrary.simpleMessage(""),
    "propertyTabsAmenities": MessageLookupByLibrary.simpleMessage("المرافق"),
    "propertyTabsDocuments": MessageLookupByLibrary.simpleMessage(""),
    "propertyTabsFeatures": MessageLookupByLibrary.simpleMessage(""),
    "propertyTabsHistory": MessageLookupByLibrary.simpleMessage("السجل"),
    "propertyTabsLocation": MessageLookupByLibrary.simpleMessage(""),
    "propertyTabsOverview": MessageLookupByLibrary.simpleMessage(""),
    "propertyTitle": MessageLookupByLibrary.simpleMessage("تفاصيل العقار"),
    "quickAccess": MessageLookupByLibrary.simpleMessage("وصول سريع"),
    "reviewStatus": MessageLookupByLibrary.simpleMessage("الحالة"),
    "reviewType": MessageLookupByLibrary.simpleMessage("النوع"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("الإعدادات"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("رينتالبروك"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage("إحصائيات ملخصة"),
    "taskAssignedTo": MessageLookupByLibrary.simpleMessage("مُعين إلى"),
    "taskPriority": MessageLookupByLibrary.simpleMessage("الأولوية"),
    "taskStatus": MessageLookupByLibrary.simpleMessage("الحالة"),
    "taskType": MessageLookupByLibrary.simpleMessage(""),
    "tasks": MessageLookupByLibrary.simpleMessage("المهام"),
    "tasksThisWeek": m9,
    "taxRecordAny": MessageLookupByLibrary.simpleMessage(""),
    "taxRecordPaid": MessageLookupByLibrary.simpleMessage(""),
    "taxRecordUnpaid": MessageLookupByLibrary.simpleMessage(""),
    "taxRecordsTitle": MessageLookupByLibrary.simpleMessage("السجلات الضريبية"),
    "tenants": MessageLookupByLibrary.simpleMessage("المستأجرون"),
    "tenantsActionsColumn": MessageLookupByLibrary.simpleMessage(""),
    "tenantsAddTenant": MessageLookupByLibrary.simpleMessage(""),
    "tenantsAllProperties": MessageLookupByLibrary.simpleMessage(""),
    "tenantsAllStatuses": MessageLookupByLibrary.simpleMessage(""),
    "tenantsCancel": MessageLookupByLibrary.simpleMessage(""),
    "tenantsConfirmDeletionDesc": m10,
    "tenantsConfirmDeletionTitle": MessageLookupByLibrary.simpleMessage(""),
    "tenantsContactColumn": MessageLookupByLibrary.simpleMessage(""),
    "tenantsDelete": MessageLookupByLibrary.simpleMessage(""),
    "tenantsDeleting": MessageLookupByLibrary.simpleMessage(""),
    "tenantsDescription": MessageLookupByLibrary.simpleMessage(""),
    "tenantsEdit": MessageLookupByLibrary.simpleMessage(""),
    "tenantsGetStartedAddTenant": MessageLookupByLibrary.simpleMessage(""),
    "tenantsIdLabel": MessageLookupByLibrary.simpleMessage(""),
    "tenantsLeaseFrom": MessageLookupByLibrary.simpleMessage(""),
    "tenantsLeasePeriodColumn": MessageLookupByLibrary.simpleMessage(""),
    "tenantsLeaseTo": MessageLookupByLibrary.simpleMessage(""),
    "tenantsNext": MessageLookupByLibrary.simpleMessage(""),
    "tenantsNoTenantsFound": MessageLookupByLibrary.simpleMessage(""),
    "tenantsNotAssigned": MessageLookupByLibrary.simpleMessage(""),
    "tenantsNotAvailable": MessageLookupByLibrary.simpleMessage(""),
    "tenantsPaymentStatusFilter": MessageLookupByLibrary.simpleMessage(""),
    "tenantsPrevious": MessageLookupByLibrary.simpleMessage(""),
    "tenantsPropertyFilter": MessageLookupByLibrary.simpleMessage(""),
    "tenantsPropertyUnitColumn": MessageLookupByLibrary.simpleMessage(""),
    "tenantsStatusCancelled": MessageLookupByLibrary.simpleMessage(""),
    "tenantsStatusColumn": MessageLookupByLibrary.simpleMessage(""),
    "tenantsStatusOverdue": MessageLookupByLibrary.simpleMessage(""),
    "tenantsStatusPaid": MessageLookupByLibrary.simpleMessage(""),
    "tenantsStatusPartiallyPaid": MessageLookupByLibrary.simpleMessage(""),
    "tenantsStatusRefunded": MessageLookupByLibrary.simpleMessage(""),
    "tenantsStatusUnpaid": MessageLookupByLibrary.simpleMessage(""),
    "tenantsTenantColumn": MessageLookupByLibrary.simpleMessage(""),
    "tenantsTitle": MessageLookupByLibrary.simpleMessage(""),
    "tenantsViewDetails": MessageLookupByLibrary.simpleMessage(""),
    "totalProperties": MessageLookupByLibrary.simpleMessage("إجمالي العقارات"),
    "totalTenants": MessageLookupByLibrary.simpleMessage("إجمالي المستأجرين"),
    "unknownTime": MessageLookupByLibrary.simpleMessage("زمن غير معروف"),
  };
}
