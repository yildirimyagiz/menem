// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a tr locale. All the
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
  String get localeName => 'tr';

  static String m0(count) =>
      "${Intl.plural(count, zero: 'Hesap bulunamadı', one: '1 hesap bulundu', other: '${count} hesap bulundu')}";

  static String m2(name) => "Tekrar hoş geldiniz, ${name}";

  static String m3(name) => "${name} ile sohbet ediliyor";

  static String m5(count) => "Yeni Kiracılar: ${count}";

  static String m6(rate) => "Doluluk Oranı: ${rate}";

  static String m7(count) => "Bekleyen Ödemeler: ${count}";

  static String m9(count) => "Bu hafta ${count}";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountsFound": m0,
    "agent_activity_title": MessageLookupByLibrary.simpleMessage(
      "Son Etkinlik",
    ),
    "agent_address_label": MessageLookupByLibrary.simpleMessage("Adres"),
    "agent_agency_label": MessageLookupByLibrary.simpleMessage("Ajans"),
    "agent_contact_information_title": MessageLookupByLibrary.simpleMessage(
      "İletişim Bilgileri",
    ),
    "agent_created_at_label": MessageLookupByLibrary.simpleMessage(
      "Oluşturulma Tarihi",
    ),
    "agent_email_label": MessageLookupByLibrary.simpleMessage("E-posta"),
    "agent_is_active_label": MessageLookupByLibrary.simpleMessage("Aktif Mi"),
    "agent_last_active_label": MessageLookupByLibrary.simpleMessage(
      "Son Aktif",
    ),
    "agent_phone_label": MessageLookupByLibrary.simpleMessage("Telefon"),
    "agent_professional_information_title":
        MessageLookupByLibrary.simpleMessage("Profesyonel Bilgiler"),
    "agent_specialities_label": MessageLookupByLibrary.simpleMessage(
      "Uzmanlık Alanları",
    ),
    "agent_status_label": MessageLookupByLibrary.simpleMessage("Durum"),
    "agent_website_label": MessageLookupByLibrary.simpleMessage("Web Sitesi"),
    "amenitiesSectionTitle": MessageLookupByLibrary.simpleMessage("Olanaklar"),
    "appTitle": MessageLookupByLibrary.simpleMessage("Menem"),
    "authSignIn": MessageLookupByLibrary.simpleMessage("Google ile Giriş Yap"),
    "authSignOut": MessageLookupByLibrary.simpleMessage("Çıkış Yap"),
    "authWelcomeBack": m2,
    "chatBack": MessageLookupByLibrary.simpleMessage("Geri"),
    "chatBackToList": MessageLookupByLibrary.simpleMessage("Listeye Geri Dön"),
    "chatChattingWith": m3,
    "chatConnectWithUsers": MessageLookupByLibrary.simpleMessage(
      "Kullanıcılarla bağlantı kurun ve destek alın",
    ),
    "chatConnectionError": MessageLookupByLibrary.simpleMessage(
      "Sohbet sunucusuna bağlanılamadı. Lütfen tekrar deneyin.",
    ),
    "chatContactSupport": MessageLookupByLibrary.simpleMessage(
      "Destekle İletişime Geçin",
    ),
    "chatError": MessageLookupByLibrary.simpleMessage("Hata"),
    "chatErrorMarkAsRead": MessageLookupByLibrary.simpleMessage(
      "Mesajlar okundu olarak işaretlenemedi",
    ),
    "chatErrorSendMessage": MessageLookupByLibrary.simpleMessage(
      "Mesaj gönderilemedi",
    ),
    "chatErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "Bu işlemi gerçekleştirmek için giriş yapmalısınız",
    ),
    "chatMessageSendError": MessageLookupByLibrary.simpleMessage(
      "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.",
    ),
    "chatMessages": MessageLookupByLibrary.simpleMessage("Mesajlar"),
    "chatNewMessage": MessageLookupByLibrary.simpleMessage("Yeni Mesaj"),
    "chatSearchUsers": MessageLookupByLibrary.simpleMessage(
      "Kullanıcıları ara...",
    ),
    "chatSend": MessageLookupByLibrary.simpleMessage("Gönder"),
    "chatTypeMessage": MessageLookupByLibrary.simpleMessage(
      "Mesajınızı yazın...",
    ),
    "chatWelcomeDescription": MessageLookupByLibrary.simpleMessage(
      "Diğer kullanıcılarla sohbet başlatın veya yardım için destekle iletişime geçin",
    ),
    "chatWelcomeToChat": MessageLookupByLibrary.simpleMessage(
      "Sohbete Hoş Geldiniz",
    ),
    "common_no": MessageLookupByLibrary.simpleMessage("Hayır"),
    "common_not_available": MessageLookupByLibrary.simpleMessage(
      "Mevcut değil",
    ),
    "common_save": MessageLookupByLibrary.simpleMessage("Kaydet"),
    "common_yes": MessageLookupByLibrary.simpleMessage("Evet"),
    "dashboard": MessageLookupByLibrary.simpleMessage("Panel"),
    "defaultUser": MessageLookupByLibrary.simpleMessage("Varsayılan Kullanıcı"),
    "edit_agent_tooltip": MessageLookupByLibrary.simpleMessage(
      "Temsilciyi Düzenle",
    ),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage(
      "Yol Tarifi Al",
    ),
    "homeLabel": MessageLookupByLibrary.simpleMessage("Ana Sayfa"),
    "indexDescription": MessageLookupByLibrary.simpleMessage(
      "Mülk yönetim çözümünüz",
    ),
    "indexPropertyManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Kapsamlı araç setimizle mülklerinizi verimli bir şekilde yönetin.",
    ),
    "indexPropertyManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Mülk Yönetimi",
    ),
    "indexTitle": MessageLookupByLibrary.simpleMessage("Menem\'e Hoş Geldiniz"),
    "indexWaterManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Mülklerinizdeki su kullanımını takip edin ve optimize edin.",
    ),
    "indexWaterManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Su Yönetimi",
    ),
    "listings": MessageLookupByLibrary.simpleMessage("Mülklerim"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage("Konum"),
    "loggingout": MessageLookupByLibrary.simpleMessage("Çıkış yapılıyor..."),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("Çıkış Yap"),
    "manageProperties": MessageLookupByLibrary.simpleMessage(
      "Mülklerinizi verimli yönetin",
    ),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage(
      "Teslim Edildi",
    ),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("Okundu"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("Gönderildi"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("Mesajlar"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage(
      "Aylık Nakit Akışı",
    ),
    "nav_analytics": MessageLookupByLibrary.simpleMessage("Analizler"),
    "nav_expenses": MessageLookupByLibrary.simpleMessage("Giderler"),
    "nav_facilities": MessageLookupByLibrary.simpleMessage("Tesisler"),
    "nav_help": MessageLookupByLibrary.simpleMessage("Yardım"),
    "nav_helpdesk": MessageLookupByLibrary.simpleMessage("Yardım Masası"),
    "nav_home": MessageLookupByLibrary.simpleMessage("Ana Sayfa"),
    "nav_logout": MessageLookupByLibrary.simpleMessage("Çıkış Yap"),
    "nav_messages": MessageLookupByLibrary.simpleMessage("Mesajlar"),
    "nav_notifications": MessageLookupByLibrary.simpleMessage("Bildirimler"),
    "nav_payments": MessageLookupByLibrary.simpleMessage("Ödemeler"),
    "nav_profile": MessageLookupByLibrary.simpleMessage("Profil"),
    "nav_properties": MessageLookupByLibrary.simpleMessage("Mülkler"),
    "nav_settings": MessageLookupByLibrary.simpleMessage("Ayarlar"),
    "nav_subscription": MessageLookupByLibrary.simpleMessage("Abonelik"),
    "nav_tasks": MessageLookupByLibrary.simpleMessage("Görevler"),
    "nav_tenants": MessageLookupByLibrary.simpleMessage("Kiracılar"),
    "nav_viewAll": MessageLookupByLibrary.simpleMessage("Tümünü Görüntüle"),
    "newTenants": m5,
    "noAmenitiesListed": MessageLookupByLibrary.simpleMessage(
      "Listelenen olanak yok",
    ),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage("Bildirimler"),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage(
      "Henüz bildirim yok",
    ),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("Ödemeler"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("Ödemeler"),
    "pendingPayments": m7,
    "pendingTasks": MessageLookupByLibrary.simpleMessage("Bekleyen Görevler"),
    "postsCancel": MessageLookupByLibrary.simpleMessage("İptal"),
    "postsContent": MessageLookupByLibrary.simpleMessage("İçerik"),
    "postsCreate": MessageLookupByLibrary.simpleMessage("Gönderi Oluştur"),
    "postsDelete": MessageLookupByLibrary.simpleMessage("Sil"),
    "postsEdit": MessageLookupByLibrary.simpleMessage("Düzenle"),
    "postsErrorCreatePost": MessageLookupByLibrary.simpleMessage(
      "Gönderi oluşturulamadı",
    ),
    "postsErrorDeletePost": MessageLookupByLibrary.simpleMessage(
      "Gönderi silinemedi",
    ),
    "postsErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "Bu işlemi gerçekleştirmek için giriş yapmalısınız",
    ),
    "postsErrorUpdatePost": MessageLookupByLibrary.simpleMessage(
      "Gönderi güncellenemedi",
    ),
    "postsLoading": MessageLookupByLibrary.simpleMessage(
      "Gönderiler yükleniyor...",
    ),
    "postsNoPostsYet": MessageLookupByLibrary.simpleMessage(
      "Henüz gönderi yok",
    ),
    "postsSave": MessageLookupByLibrary.simpleMessage("Kaydet"),
    "postsTitle": MessageLookupByLibrary.simpleMessage("Başlık"),
    "profileLabel": MessageLookupByLibrary.simpleMessage("Profil"),
    "properties": MessageLookupByLibrary.simpleMessage("Mülkler"),
    "quickAccess": MessageLookupByLibrary.simpleMessage("Hızlı Erişim"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("Ayarlar"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("RentalProc"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage(
      "Özet İstatistikler",
    ),
    "tasks": MessageLookupByLibrary.simpleMessage("Görevler"),
    "tasksThisWeek": m9,
    "tenants": MessageLookupByLibrary.simpleMessage("Kiracılar"),
    "totalProperties": MessageLookupByLibrary.simpleMessage("Toplam Mülk"),
    "totalTenants": MessageLookupByLibrary.simpleMessage("Toplam Kiracı"),
    "unknownTime": MessageLookupByLibrary.simpleMessage("Bilinmeyen zaman"),
  };
}
