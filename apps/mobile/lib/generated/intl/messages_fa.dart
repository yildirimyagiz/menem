// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a fa locale. All the
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
  String get localeName => 'fa';

  static String m0(count) =>
      "${Intl.plural(count, zero: 'هیچ حسابی پیدا نشد', one: '1 حساب پیدا شد', other: '${count} حساب پیدا شد')}";

  static String m2(name) => "خوش آمدید، ${name}";

  static String m3(name) => "در حال گفتگو با ${name}";

  static String m5(count) => "مستاجران جدید: ${count}";

  static String m6(rate) => "نرخ اشغال: ${rate}";

  static String m7(count) => "پرداخت های معلق: ${count}";

  static String m9(count) => "${count} این هفته";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountsFound": m0,
    "agent_activity_title": MessageLookupByLibrary.simpleMessage("فعالیت اخیر"),
    "agent_address_label": MessageLookupByLibrary.simpleMessage("آدرس"),
    "agent_agency_label": MessageLookupByLibrary.simpleMessage("آژانس"),
    "agent_contact_information_title": MessageLookupByLibrary.simpleMessage(
      "اطلاعات تماس",
    ),
    "agent_created_at_label": MessageLookupByLibrary.simpleMessage(
      "ایجاد شده در",
    ),
    "agent_email_label": MessageLookupByLibrary.simpleMessage("ایمیل"),
    "agent_is_active_label": MessageLookupByLibrary.simpleMessage("فعال است"),
    "agent_last_active_label": MessageLookupByLibrary.simpleMessage(
      "آخرین فعالیت",
    ),
    "agent_phone_label": MessageLookupByLibrary.simpleMessage("تلفن"),
    "agent_professional_information_title":
        MessageLookupByLibrary.simpleMessage("اطلاعات حرفه ای"),
    "agent_specialities_label": MessageLookupByLibrary.simpleMessage("تخصص ها"),
    "agent_status_label": MessageLookupByLibrary.simpleMessage("وضعیت"),
    "agent_website_label": MessageLookupByLibrary.simpleMessage("وب سایت"),
    "amenitiesSectionTitle": MessageLookupByLibrary.simpleMessage(
      "امکانات رفاهی",
    ),
    "appTitle": MessageLookupByLibrary.simpleMessage("منم"),
    "authSignIn": MessageLookupByLibrary.simpleMessage("ورود با گوگل"),
    "authSignOut": MessageLookupByLibrary.simpleMessage("خروج از سیستم"),
    "authWelcomeBack": m2,
    "chatBack": MessageLookupByLibrary.simpleMessage("بازگشت"),
    "chatBackToList": MessageLookupByLibrary.simpleMessage("بازگشت به لیست"),
    "chatChattingWith": m3,
    "chatConnectWithUsers": MessageLookupByLibrary.simpleMessage(
      "با کاربران ارتباط برقرار کنید و پشتیبانی دریافت کنید",
    ),
    "chatConnectionError": MessageLookupByLibrary.simpleMessage(
      "اتصال به سرور چت ناموفق بود. لطفا دوباره تلاش کنید.",
    ),
    "chatContactSupport": MessageLookupByLibrary.simpleMessage(
      "تماس با پشتیبانی",
    ),
    "chatError": MessageLookupByLibrary.simpleMessage("خطا"),
    "chatErrorMarkAsRead": MessageLookupByLibrary.simpleMessage(
      "علامت گذاری پیام ها به عنوان خوانده شده ناموفق بود",
    ),
    "chatErrorSendMessage": MessageLookupByLibrary.simpleMessage(
      "ارسال پیام ناموفق بود",
    ),
    "chatErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "برای انجام این عمل باید وارد شوید",
    ),
    "chatMessageSendError": MessageLookupByLibrary.simpleMessage(
      "ارسال پیام شما ناموفق بود. لطفاً بعداً دوباره امتحان کنید.",
    ),
    "chatMessages": MessageLookupByLibrary.simpleMessage("پیام ها"),
    "chatNewMessage": MessageLookupByLibrary.simpleMessage("پیام جدید"),
    "chatSearchUsers": MessageLookupByLibrary.simpleMessage(
      "جستجوی کاربران...",
    ),
    "chatSend": MessageLookupByLibrary.simpleMessage("ارسال"),
    "chatTypeMessage": MessageLookupByLibrary.simpleMessage(
      "پیام خود را تایپ کنید...",
    ),
    "chatWelcomeDescription": MessageLookupByLibrary.simpleMessage(
      "با سایر کاربران گفتگو را شروع کنید یا برای کمک با پشتیبانی تماس بگیرید",
    ),
    "chatWelcomeToChat": MessageLookupByLibrary.simpleMessage(
      "به چت خوش آمدید",
    ),
    "common_no": MessageLookupByLibrary.simpleMessage("خیر"),
    "common_not_available": MessageLookupByLibrary.simpleMessage(
      "در دسترس نیست",
    ),
    "common_save": MessageLookupByLibrary.simpleMessage("ذخیره"),
    "common_yes": MessageLookupByLibrary.simpleMessage("بله"),
    "dashboard": MessageLookupByLibrary.simpleMessage("داشبورد"),
    "defaultUser": MessageLookupByLibrary.simpleMessage("کاربر پیش فرض"),
    "edit_agent_tooltip": MessageLookupByLibrary.simpleMessage(
      "ویرایش نماینده",
    ),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage(
      "دریافت مسیرها",
    ),
    "homeLabel": MessageLookupByLibrary.simpleMessage("خانه"),
    "indexDescription": MessageLookupByLibrary.simpleMessage(
      "راه حل مدیریت املاک شما",
    ),
    "indexPropertyManagementDescription": MessageLookupByLibrary.simpleMessage(
      "املاک خود را با مجموعه جامع ابزارهای ما به طور کارآمد مدیریت کنید.",
    ),
    "indexPropertyManagementTitle": MessageLookupByLibrary.simpleMessage(
      "مدیریت املاک",
    ),
    "indexTitle": MessageLookupByLibrary.simpleMessage("به منم خوش آمدید"),
    "indexWaterManagementDescription": MessageLookupByLibrary.simpleMessage(
      "مصرف آب را در سراسر املاک خود ردیابی و بهینه کنید.",
    ),
    "indexWaterManagementTitle": MessageLookupByLibrary.simpleMessage(
      "مدیریت آب",
    ),
    "listings": MessageLookupByLibrary.simpleMessage("املاک من"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage(
      "موقعیت مکانی",
    ),
    "loggingout": MessageLookupByLibrary.simpleMessage("در حال خروج..."),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("خروج"),
    "manageProperties": MessageLookupByLibrary.simpleMessage(
      "املاک خود را به طور مؤثر مدیریت کنید",
    ),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage(
      "تحویل داده شده",
    ),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("خوانده شده"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("ارسال شده"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("پیام ها"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage(
      "جریان نقدی ماهانه",
    ),
    "nav_analytics": MessageLookupByLibrary.simpleMessage("تجزیه و تحلیل"),
    "nav_expenses": MessageLookupByLibrary.simpleMessage("هزینه ها"),
    "nav_facilities": MessageLookupByLibrary.simpleMessage("امکانات"),
    "nav_help": MessageLookupByLibrary.simpleMessage("راهنما"),
    "nav_helpdesk": MessageLookupByLibrary.simpleMessage("میز کمک"),
    "nav_home": MessageLookupByLibrary.simpleMessage("خانه"),
    "nav_logout": MessageLookupByLibrary.simpleMessage("خروج"),
    "nav_messages": MessageLookupByLibrary.simpleMessage("پیام ها"),
    "nav_notifications": MessageLookupByLibrary.simpleMessage("اعلان ها"),
    "nav_payments": MessageLookupByLibrary.simpleMessage("پرداخت ها"),
    "nav_profile": MessageLookupByLibrary.simpleMessage("پروفایل"),
    "nav_properties": MessageLookupByLibrary.simpleMessage("املاک"),
    "nav_settings": MessageLookupByLibrary.simpleMessage("تنظیمات"),
    "nav_subscription": MessageLookupByLibrary.simpleMessage("اشتراک"),
    "nav_tasks": MessageLookupByLibrary.simpleMessage("وظایف"),
    "nav_tenants": MessageLookupByLibrary.simpleMessage("مستاجران"),
    "nav_viewAll": MessageLookupByLibrary.simpleMessage("مشاهده همه"),
    "newTenants": m5,
    "noAmenitiesListed": MessageLookupByLibrary.simpleMessage(
      "هیچ امکاناتی لیست نشده است",
    ),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage("اعلان ها"),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage(
      "هنوز اعلانی وجود ندارد",
    ),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("پرداخت ها"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("پرداخت ها"),
    "pendingPayments": m7,
    "pendingTasks": MessageLookupByLibrary.simpleMessage("وظایف معلق"),
    "postsCancel": MessageLookupByLibrary.simpleMessage("لغو"),
    "postsContent": MessageLookupByLibrary.simpleMessage("محتوا"),
    "postsCreate": MessageLookupByLibrary.simpleMessage("ایجاد پست"),
    "postsDelete": MessageLookupByLibrary.simpleMessage("حذف"),
    "postsEdit": MessageLookupByLibrary.simpleMessage("ویرایش"),
    "postsErrorCreatePost": MessageLookupByLibrary.simpleMessage(
      "ایجاد پست ناموفق بود",
    ),
    "postsErrorDeletePost": MessageLookupByLibrary.simpleMessage(
      "حذف پست ناموفق بود",
    ),
    "postsErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "برای انجام این عمل باید وارد شوید",
    ),
    "postsErrorUpdatePost": MessageLookupByLibrary.simpleMessage(
      "به روزرسانی پست ناموفق بود",
    ),
    "postsLoading": MessageLookupByLibrary.simpleMessage(
      "در حال بارگذاری پست ها...",
    ),
    "postsNoPostsYet": MessageLookupByLibrary.simpleMessage(
      "هنوز پستی وجود ندارد",
    ),
    "postsSave": MessageLookupByLibrary.simpleMessage("ذخیره"),
    "postsTitle": MessageLookupByLibrary.simpleMessage("عنوان"),
    "profileLabel": MessageLookupByLibrary.simpleMessage("پروفایل"),
    "properties": MessageLookupByLibrary.simpleMessage("املاک"),
    "quickAccess": MessageLookupByLibrary.simpleMessage("دسترسی سریع"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("تنظیمات"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("RentalProc"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage("آمار خلاصه"),
    "tasks": MessageLookupByLibrary.simpleMessage("وظایف"),
    "tasksThisWeek": m9,
    "tenants": MessageLookupByLibrary.simpleMessage("مستاجران"),
    "totalProperties": MessageLookupByLibrary.simpleMessage("کل املاک"),
    "totalTenants": MessageLookupByLibrary.simpleMessage("کل مستاجران"),
    "unknownTime": MessageLookupByLibrary.simpleMessage("زمان نامشخص"),
  };
}
