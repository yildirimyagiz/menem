// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for Turkish (`tr`).
class AppLocalizationsTr extends AppLocalizations {
  AppLocalizationsTr([String locale = 'tr']) : super(locale);

  @override
  String get appTitle => 'Menem';

  @override
  String get dashboard => 'Kontrol Paneli';

  @override
  String get manageProperties => 'Mülkleri Yönet';

  @override
  String get quickAccess => 'Hızlı Erişim';

  @override
  String get properties => 'Mülkler';

  @override
  String get tenants => 'Kiracılar';

  @override
  String get payments => 'Ödemeler';

  @override
  String get tasks => 'Görevler';

  @override
  String get summaryStatistics => 'Özet İstatistikler';

  @override
  String get totalProperties => 'Toplam Mülk Sayısı';

  @override
  String occupancyRate(Object rate) {
    return 'Doluluk Oranı: $rate';
  }

  @override
  String get monthlyCashflow => 'Aylık Nakit Akışı';

  @override
  String pendingPayments(Object count) {
    return 'Bekleyen Ödemeler: $count';
  }

  @override
  String get pendingTasks => 'Bekleyen Görevler';

  @override
  String tasksThisWeek(Object count) {
    return 'Bu hafta $count görev';
  }

  @override
  String get propertyDetailTitle => 'Mülk Detayları';

  @override
  String get propertyDetailOverviewTab => 'Genel Bakış';

  @override
  String get propertyDetailFeaturesTab => 'Özellikler';

  @override
  String get propertyDetailLocationTab => 'Konum';

  @override
  String get propertyDetailGalleryTab => 'Galeri';

  @override
  String get propertyDetailId => 'ID';

  @override
  String get propertyDetailNumber => 'Mülk Numarası';

  @override
  String get propertyDetailTitleField => 'Başlık';

  @override
  String get propertyDetailDescription => 'Açıklama';

  @override
  String get propertyDetailType => 'Tür';

  @override
  String get propertyDetailStatus => 'Durum';

  @override
  String get propertyDetailCategory => 'Kategori';

  @override
  String get propertyDetailCondition => 'Durum (Fiziksel)';

  @override
  String get propertyDetailMarketValue => 'Piyasa Değeri';

  @override
  String get propertyDetailBedrooms => 'Yatak Odası Sayısı';

  @override
  String get propertyDetailBathrooms => 'Banyo Sayısı';

  @override
  String get propertyDetailYearBuilt => 'Yapım Yılı';

  @override
  String get propertyDetailFeatures => 'Özellikler';

  @override
  String get propertyDetailAmenities => 'Olanaklar';

  @override
  String get propertyDetailAddress => 'Adres';

  @override
  String get propertyDetailCity => 'Şehir';

  @override
  String get propertyDetailState => 'İl/Eyalet';

  @override
  String get propertyDetailCountry => 'Ülke';

  @override
  String get propertyDetailZipCode => 'Posta Kodu';

  @override
  String get propertyDetailCoordinates => 'Koordinatlar';

  @override
  String get propertyDetailNoFeatures => 'Özellik veya olanak bulunmuyor';

  @override
  String get propertyDetailNoLocation => 'Konum bilgisi bulunmuyor';

  @override
  String get propertyDetailGalleryPlaceholder =>
      'Galeri Görünümü (Resimlerin GridView ile uygulanması gerekiyor)';

  @override
  String get propertyDetailDeleteConfirm =>
      'Bu mülkü silmek istediğinizden emin misiniz?';

  @override
  String get propertyDetailDeleteSuccess => 'Mülk başarıyla silindi';

  @override
  String propertyDetailDeleteFailed(Object error) {
    return 'Mülk silinemedi: $error';
  }

  @override
  String get propertyDetailContactAgent => 'Emlakçıyla İletişime Geç';

  @override
  String get propertyDetailPrice => 'Fiyat';

  @override
  String get propertyDetailLoading => 'Mülk detayları yükleniyor...';

  @override
  String get propertyDetailNotFound => 'Mülk bulunamadı.';

  @override
  String get totalTenants => 'Toplam Kiracı Sayısı';

  @override
  String newTenants(Object count) {
    return 'Yeni Kiracılar: $count';
  }

  @override
  String get homeLabel => 'Ana Sayfa';

  @override
  String get favoritesEmpty => 'Henüz favori yok';

  @override
  String get favoritesError => 'Favoriler yüklenirken hata oluştu';

  @override
  String get favoritesRetry => 'Tekrar Dene';

  @override
  String get emptyStateRetry => 'Tekrar Dene';

  @override
  String get listings => 'Mülklerim';

  @override
  String get listingsEmpty => 'Henüz ilan yok';

  @override
  String get listingsRetry => 'Tekrar Dene';

  @override
  String get filterPropertiesTitle => 'Mülkleri Filtrele';

  @override
  String get filterPropertiesApply => 'Uygula';

  @override
  String get filterPropertiesCancel => 'İptal';

  @override
  String get messagesLabel => 'Mesajlar';

  @override
  String get notificationsLabel => 'Bildirimler';

  @override
  String get notificationsEmpty => 'Henüz bildirim yok';

  @override
  String get paymentsLabel => 'Ödemeler';

  @override
  String get settingsLabel => 'Ayarlar';

  @override
  String get settingsAppearance => 'Görünüm';

  @override
  String get settingsDarkMode => 'Karanlık Mod';

  @override
  String get filterTasksTitle => 'Görevleri Filtrele';

  @override
  String get filterTasksStatus => 'Durum';

  @override
  String get filterTasksPriority => 'Öncelik';

  @override
  String get filterTasksType => 'Tür';

  @override
  String get filterTasksDueDate => 'Bitiş Tarihi';

  @override
  String get filterTasksApply => 'Uygula';

  @override
  String get filterTasksCancel => 'İptal';

  @override
  String get profileLabel => 'Profil';

  @override
  String get logoutLabel => 'Çıkış Yap';

  @override
  String get loggingout => 'Çıkış yapılıyor...';

  @override
  String get sitetitle => 'RentalProc';

  @override
  String get nav_home => 'Ana Sayfa';

  @override
  String get nav_properties => 'Mülkler';

  @override
  String get nav_payments => 'Ödemeler';

  @override
  String get nav_tasks => 'Görevler';

  @override
  String get nav_messages => 'Mesajlar';

  @override
  String get nav_notifications => 'Bildirimler';

  @override
  String get nav_helpdesk => 'Yardım Masası';

  @override
  String get nav_subscription => 'Abonelik';

  @override
  String get nav_settings => 'Ayarlar';

  @override
  String get nav_tenants => 'Kiracılar';

  @override
  String get nav_expenses => 'Giderler';

  @override
  String get nav_facilities => 'Tesisler';

  @override
  String get nav_analytics => 'Analitik';

  @override
  String get nav_help => 'Yardım';

  @override
  String get nav_logout => 'Çıkış Yap';

  @override
  String get nav_profile => 'Profil';

  @override
  String get nav_viewAll => 'Tümünü Görüntüle';

  @override
  String get indexTitle => 'Menem\'e Hoş Geldiniz';

  @override
  String get indexDescription => 'Mülk yönetimi çözümünüz';

  @override
  String get indexPropertyManagementTitle => 'Mülk Yönetimi';

  @override
  String get indexPropertyManagementDescription =>
      'Kapsamlı araç setimizle mülklerinizi verimli bir şekilde yönetin.';

  @override
  String get indexWaterManagementTitle => 'Su Yönetimi';

  @override
  String get indexWaterManagementDescription =>
      'Mülklerinizdeki su kullanımını takip edin ve optimize edin.';

  @override
  String get authSignIn => 'Google ile Giriş Yap';

  @override
  String get authSignOut => 'Çıkış Yap';

  @override
  String get createPropertyTitle => 'Yeni Mülk Oluştur';

  @override
  String get propertyCreatedSuccess => 'Mülk başarıyla oluşturuldu';

  @override
  String get propertyCreatedError => 'Mülk oluşturulamadı';

  @override
  String get registerAlreadyHaveAccount =>
      'Zaten bir hesabınız var mı? Giriş Yapın';

  @override
  String get registerForgotPassword => 'Şifrenizi mi unuttunuz?';

  @override
  String get propertyViewingEventsTitle => 'Görüntüleme Etkinlikleri';

  @override
  String get propertyViewingSchedule => 'Görüntüleme Planla';

  @override
  String authWelcomeBack(Object name) {
    return 'Tekrar hoş geldin, $name';
  }

  @override
  String get postsCreate => 'Gönderi Oluştur';

  @override
  String get postsTitle => 'Başlık';

  @override
  String get postsContent => 'İçerik';

  @override
  String get postsLoading => 'Gönderiler yükleniyor...';

  @override
  String get postsSave => 'Kaydet';

  @override
  String get postsCancel => 'İptal';

  @override
  String get postsEdit => 'Düzenle';

  @override
  String get postsDelete => 'Sil';

  @override
  String get postsNoPostsYet => 'Henüz gönderi yok';

  @override
  String get postsErrorUnauthorized =>
      'Bu işlemi gerçekleştirmek için giriş yapmalısınız';

  @override
  String get postsErrorCreatePost => 'Gönderi oluşturulamadı';

  @override
  String get postsErrorUpdatePost => 'Gönderi güncellenemedi';

  @override
  String get postsErrorDeletePost => 'Gönderi silinemedi';

  @override
  String get chatMessages => 'Mesajlar';

  @override
  String chatChattingWith(Object name) {
    return '$name ile sohbet ediliyor';
  }

  @override
  String get chatConnectWithUsers =>
      'Kullanıcılarla bağlantı kurun ve destek alın';

  @override
  String get chatBackToList => 'Listeye Geri Dön';

  @override
  String get chatWelcomeToChat => 'Sohbete Hoş Geldiniz';

  @override
  String get chatWelcomeDescription =>
      'Diğer kullanıcılarla sohbet başlatın veya yardım için destekle iletişime geçin';

  @override
  String get chatNewMessage => 'Yeni Mesaj';

  @override
  String get chatContactSupport => 'Destekle İletişime Geç';

  @override
  String get chatBack => 'Geri';

  @override
  String get chatSearchUsers => 'Kullanıcıları ara...';

  @override
  String get chatTypeMessage => 'Mesajınızı yazın...';

  @override
  String get chatSend => 'Gönder';

  @override
  String get chatErrorUnauthorized =>
      'Bu işlemi gerçekleştirmek için giriş yapmalısınız';

  @override
  String get chatErrorSendMessage => 'Mesaj gönderilemedi';

  @override
  String get chatErrorMarkAsRead => 'Mesajlar okundu olarak işaretlenemedi';

  @override
  String get chatError => 'Hata';

  @override
  String get chatConnectionError =>
      'Sohbet sunucusuna bağlanılamadı. Lütfen tekrar deneyin.';

  @override
  String get chatMessageSendError =>
      'Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.';

  @override
  String get notifications_placeholder => 'Henüz bildirim yok';

  @override
  String get notificationsPlaceholder => 'Henüz bildirim yok';

  @override
  String commonTimeAgo(Object time) {
    return '$time önce';
  }

  @override
  String get commonSuccess => 'Başarılı';

  @override
  String get commonError => 'Hata';

  @override
  String propertiesFound(Object count) {
    return '$count mülk bulundu';
  }

  @override
  String get errorScreenTitle => 'Hata';

  @override
  String get errorScreenGoBack => 'Geri Dön';

  @override
  String get dateRangeSelectTitle => 'Tarih Aralığı Seçin';

  @override
  String get dateRangeSelectApply => 'Uygula';

  @override
  String get dateRangeSelectCancel => 'İptal';

  @override
  String get commonWarning => 'Uyarı';

  @override
  String get commonInfo => 'Bilgi';

  @override
  String get commonLoading => 'Yükleniyor...';

  @override
  String get commonSave => 'Kaydet';

  @override
  String get commonCancel => 'İptal';

  @override
  String get commonDelete => 'Sil';

  @override
  String get commonEdit => 'Düzenle';

  @override
  String get commonCreate => 'Oluştur';

  @override
  String get commonView => 'Görüntüle';

  @override
  String get commonPrevious => 'Önceki';

  @override
  String get commonNext => 'Sonraki';

  @override
  String get commonBack => 'Geri';

  @override
  String get commonConfirm => 'Onayla';

  @override
  String get commonActions => 'Eylemler';

  @override
  String get commonSearch => 'Ara';

  @override
  String get commonFilter => 'Filtrele';

  @override
  String get commonSort => 'Sırala';

  @override
  String get commonNoData => 'Veri bulunmuyor';

  @override
  String get editAgentTooltip => 'Temsilciyi Düzenle';

  @override
  String get agentContactInformationTitle => 'İletişim Bilgileri';

  @override
  String get agentEmailLabel => 'E-posta';

  @override
  String get agentPhoneLabel => 'Telefon';

  @override
  String get agentAddressLabel => 'Adres';

  @override
  String get agentWebsiteLabel => 'Web Sitesi';

  @override
  String get agentProfessionalInformationTitle => 'Profesyonel Bilgiler';

  @override
  String get agentStatusLabel => 'Durum';

  @override
  String get agentAgencyLabel => 'Ajans';

  @override
  String get agentSpecialitiesLabel => 'Uzmanlık Alanları';

  @override
  String get agentActivityTitle => 'Son Etkinlik';

  @override
  String get agentLastActiveLabel => 'Son Aktif Olma Zamanı';

  @override
  String get agentIsActiveLabel => 'Aktif Mi';

  @override
  String get agentCreatedAtLabel => 'Oluşturulma Tarihi';

  @override
  String get agentAdditionalInformationTitle => 'Ek Bilgiler';

  @override
  String get agentBioLabel => 'Biyografi';

  @override
  String get agentExternalIdLabel => 'Harici ID';

  @override
  String get agentSettingsLabel => 'Ayarlar';

  @override
  String get agentIntegrationLabel => 'Entegrasyon';

  @override
  String get agentOwnerIdLabel => 'Sahip ID';

  @override
  String get agentAgencyIdLabel => 'Ajans ID';

  @override
  String get agentDeletedAtLabel => 'Silinme Tarihi';

  @override
  String get amenitiesSectionTitle => 'Olanaklar';

  @override
  String get noAmenitiesListed => 'Listelenen olanak yok';

  @override
  String get locationSectionTitle => 'Konum';

  @override
  String get getDirectionsButton => 'Yol Tarifi Al';

  @override
  String get messageStatusRead => 'Okundu';

  @override
  String get messageStatusDelivered => 'Teslim Edildi';

  @override
  String get messageStatusSent => 'Gönderildi';

  @override
  String get defaultUser => 'Varsayılan Kullanıcı';

  @override
  String get unknownTime => 'Bilinmeyen zaman';

  @override
  String get commonNotAvailable => 'Mevcut değil';

  @override
  String accountsFound(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count hesap bulundu',
      one: '1 hesap bulundu',
      zero: 'Hesap bulunamadı',
    );
    return '$_temp0';
  }

  @override
  String get actionCardProperties => 'Mülkler';

  @override
  String get actionCardTenants => 'Kiracılar';

  @override
  String get actionCardAnalytics => 'Analitik';

  @override
  String get actionCardPayments => 'Ödemeler';

  @override
  String get actionCardTasks => 'Görevler';

  @override
  String get actionCardMessages => 'Mesajlar';

  @override
  String get actionCardHelpDesk => 'Yardım Masası';

  @override
  String get actionCardManageYourPropertyPortfolio =>
      'Mülk portföyünüzü yönetin';

  @override
  String get actionCardManageTenantInformation => 'Kiracı bilgilerini yönetin';

  @override
  String get actionCardViewReportsAndAnalytics =>
      'Raporları ve analizleri görüntüleyin';

  @override
  String get actionCardTrackFinancialRecords => 'Finansal kayıtları takip edin';

  @override
  String get actionCardManageMaintenanceTasks => 'Bakım görevlerini yönetin';

  @override
  String get actionCardCommunicateWithTenants => 'Kiracılarla iletişim kurun';

  @override
  String get actionCardGetAssistanceWhenNeeded => 'Gerektiğinde yardım alın';

  @override
  String get actionCardAddProperty => 'Mülk Ekle';

  @override
  String get actionCardCreateANewPropertyListing =>
      'Yeni bir mülk ilanı oluşturun';

  @override
  String get actionCardAddTenant => 'Kiracı Ekle';

  @override
  String get actionCardRegisterANewTenant => 'Yeni bir kiracı kaydedin';

  @override
  String get actionCardRecordPayment => 'Ödeme Kaydet';

  @override
  String get actionCardRecordARentPayment => 'Bir kira ödemesi kaydedin';

  @override
  String get actionCardAddTask => 'Görev Ekle';

  @override
  String get actionCardCreateAMaintenanceTask => 'Bir bakım görevi oluşturun';

  @override
  String get actionCardScheduleEvent => 'Etkinlik Planla';

  @override
  String get actionCardCreateAPropertyEvent => 'Bir mülk etkinliği oluşturun';

  @override
  String get actionCardComposeMessage => 'Mesaj Oluştur';

  @override
  String get actionCardSendAMessageToTenants => 'Kiracılara mesaj gönderin';

  @override
  String get actionCardCreateDocument => 'Belge Oluştur';

  @override
  String get actionCardGenerateANewDocument => 'Yeni bir belge oluşturun';

  @override
  String get actionCardGetStarted => 'Başlayın';

  @override
  String get actionCardNewThisMonth => 'Bu Ay Yeni';

  @override
  String get tenantsTitle => 'Kiracılar';

  @override
  String get tenantsDescription =>
      'Mülklerinizdeki kiracı bilgilerini ve kira sözleşmelerini yönetin';

  @override
  String get tenantsAddTenant => 'Kiracı Ekle';

  @override
  String get tenantsPropertyFilter => 'Mülk';

  @override
  String get tenantsAllProperties => 'Tüm Mülkler';

  @override
  String get tenantsPaymentStatusFilter => 'Ödeme Durumu';

  @override
  String get tenantsAllStatuses => 'Tüm Durumlar';

  @override
  String get tenantsTenantColumn => 'Kiracı';

  @override
  String get tenantsStatusColumn => 'Durum';

  @override
  String get tenantsPropertyUnitColumn => 'Mülk / Birim';

  @override
  String get tenantsContactColumn => 'İletişim';

  @override
  String get tenantsLeasePeriodColumn => 'Kira Süresi';

  @override
  String get tenantsActionsColumn => 'Eylemler';

  @override
  String get tenantsIdLabel => 'ID';

  @override
  String get tenantsNotAssigned => 'Atanmamış';

  @override
  String get tenantsNotAvailable => 'Yok';

  @override
  String get tenantsLeaseFrom => 'Başlangıç';

  @override
  String get tenantsLeaseTo => 'Bitiş';

  @override
  String get tenantsViewDetails => 'Detayları Görüntüle';

  @override
  String get tenantsEdit => 'Düzenle';

  @override
  String get tenantsDelete => 'Sil';

  @override
  String get tenantsNoTenantsFound => 'Kiracı bulunamadı';

  @override
  String get tenantsGetStartedAddTenant => 'Yeni bir kiracı ekleyerek başlayın';

  @override
  String get tenantsConfirmDeletionTitle => 'Silmeyi Onayla';

  @override
  String tenantsConfirmDeletionDesc(Object tenant) {
    return '$tenant adlı kiracıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.';
  }

  @override
  String get tenantsCancel => 'İptal';

  @override
  String get tenantsDeleting => 'Siliniyor...';

  @override
  String get tenantsPrevious => 'Önceki';

  @override
  String get tenantsNext => 'Sonraki';

  @override
  String get tenantsStatusUnpaid => 'Ödenmedi';

  @override
  String get tenantsStatusPartiallyPaid => 'Kısmen Ödendi';

  @override
  String get tenantsStatusPaid => 'Ödendi';

  @override
  String get tenantsStatusRefunded => 'İade Edildi';

  @override
  String get tenantsStatusOverdue => 'Vadesi Geçmiş';

  @override
  String get tenantsStatusCancelled => 'İptal Edildi';

  @override
  String get agenciesTitle => 'Ajanslar';

  @override
  String get agenciesDescription => 'Ajanslarınızı ve ayarlarını yönetin.';

  @override
  String get agenciesSearch => 'Ajansları ara...';

  @override
  String get agenciesStatus => 'Durum';

  @override
  String get agenciesStatusValuesPending => 'Beklemede';

  @override
  String get agenciesStatusValuesVerified => 'Doğrulandı';

  @override
  String get agenciesStatusValuesRejected => 'Reddedildi';

  @override
  String get agenciesAdd => 'Ajans Ekle';

  @override
  String get agenciesEdit => 'Düzenle';

  @override
  String get agenciesDelete => 'Sil';

  @override
  String agenciesConfirmDeleteDesc(Object name) {
    return '$name adlı ajansı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.';
  }

  @override
  String get agenciesDeletedMsg => 'Ajans başarıyla silindi.';

  @override
  String get agenciesNone =>
      'Aramanızla eşleşen ajans bulunamadı. Farklı filtreler deneyin.';

  @override
  String get agenciesNa => 'Yok';

  @override
  String get agenciesAgents => 'Temsilciler';

  @override
  String get agenciesView => 'Görüntüle';

  @override
  String get agenciesName => 'Ajans Adı';

  @override
  String get agenciesEmail => 'E-posta';

  @override
  String get agenciesPhoneNumber => 'Telefon Numarası';

  @override
  String get agenciesAddress => 'Adres';

  @override
  String get agenciesWebsite => 'Web Sitesi';

  @override
  String get agenciesLogoUrl => 'Logo URL\'si';

  @override
  String get agenciesCreated => 'Oluşturuldu';

  @override
  String get agenciesUpdated => 'Güncellendi';

  @override
  String get agenciesProperties => 'Mülkler';

  @override
  String get agenciesActions => 'Eylemler';

  @override
  String get agenciesCancel => 'İptal';

  @override
  String get agenciesDeleting => 'Siliniyor...';

  @override
  String get agenciesCreating => 'Oluşturuluyor...';

  @override
  String get agenciesSaving => 'Kaydediliyor...';

  @override
  String get agenciesSave => 'Kaydet';

  @override
  String get agenciesCreate => 'Oluştur';

  @override
  String get agenciesGetStarted => 'Yeni bir ajans ekleyerek başlayın';

  @override
  String get agenciesRequired => 'Bu alan zorunludur.';

  @override
  String get agenciesInvalidEmail => 'Geçersiz e-posta adresi.';

  @override
  String get agenciesInvalidUrl => 'Geçersiz URL.';

  @override
  String get agenciesUpdatedMsg => 'Güncellendi!';

  @override
  String get agenciesCreatedMsg => 'Oluşturuldu!';

  @override
  String get agenciesErrorLoad => 'Detaylar yüklenemedi.';

  @override
  String get agenciesErrorCreate => 'Oluşturulamadı.';

  @override
  String get agenciesErrorUpdate => 'Güncellenemedi.';

  @override
  String get agenciesErrorDelete => 'Silinemedi.';

  @override
  String get loginPageTitle => 'Giriş Yap';

  @override
  String get loginPageEmail => 'E-posta';

  @override
  String get loginPagePassword => 'Şifre';

  @override
  String get loginPageRememberMe => 'Beni hatırla';

  @override
  String get loginPageForgotPassword => 'Şifrenizi mi unuttunuz?';

  @override
  String get loginPageSignIn => 'Giriş Yap';

  @override
  String get loginPageOrContinueWith => 'Veya şununla devam et';

  @override
  String get loginPageDontHaveAccount => 'Hesabınız yok mu?';

  @override
  String get loginPageSignUp => 'Kaydol';

  @override
  String get loginPageErrorInvalidCredentials => 'Geçersiz e-posta veya şifre';

  @override
  String get loginPageErrorSomethingWentWrong =>
      'Bir şeyler ters gitti. Lütfen tekrar deneyin.';

  @override
  String get loginPageErrorSessionExpired =>
      'Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.';

  @override
  String get authErrorTitle => 'Kimlik Doğrulama Hatası';

  @override
  String get authErrorSomethingWentWrong =>
      'Kimlik doğrulama sırasında bir şeyler ters gitti. Lütfen tekrar deneyin.';

  @override
  String get authErrorOauthAccountNotLinked =>
      'Bu e-posta ile zaten bir hesap mevcut. Lütfen orijinal kimlik doğrulama yöntemiyle giriş yapın.';

  @override
  String get authErrorOauthCallbackError =>
      'OAuth geri arama işlemi sırasında bir hata oluştu.';

  @override
  String get authErrorOauthCreateAccountError =>
      'Yeni hesap oluşturulamadı. Lütfen tekrar deneyin.';

  @override
  String get authErrorOauthSignInError =>
      'Seçilen sağlayıcı ile giriş yapılırken hata oluştu. Lütfen tekrar deneyin.';

  @override
  String get authErrorBackToLogin => 'Giriş Ekranına Geri Dön';

  @override
  String get propertyTitle => 'Mülk Detayları';

  @override
  String get propertyBackToProperties => 'Mülklere Geri Dön';

  @override
  String get propertyEditProperty => 'Mülkü Düzenle';

  @override
  String get propertyDeleteProperty => 'Mülkü Sil';

  @override
  String get propertyCreateProperty => 'Mülk Oluştur';

  @override
  String get propertyAddProperty => 'Mülk Ekle';

  @override
  String get propertyLoading => 'Mülk yükleniyor...';

  @override
  String get propertyNotFound => 'Mülk bulunamadı.';

  @override
  String get propertyDebugInfo => 'Hata ayıklama bilgisi:';

  @override
  String get propertyConfirmDeleteTitle =>
      'Bu mülkü silmek istediğinizden emin misiniz?';

  @override
  String get propertyConfirmDeleteDescription =>
      'Bu işlem geri alınamaz. Bu mülkle ilişkili tüm veriler kalıcı olarak silinecektir.';

  @override
  String get propertyConfirmDeleteCancel => 'İptal';

  @override
  String get propertyConfirmDeleteConfirm => 'Silmeyi Onayla';

  @override
  String get propertyTabsOverview => 'Genel Bakış';

  @override
  String get propertyTabsFeatures => 'Özellikler';

  @override
  String get propertyTabsAmenities => 'Olanaklar';

  @override
  String get propertyTabsLocation => 'Konum';

  @override
  String get propertyTabsDocuments => 'Belgeler';

  @override
  String get propertyTabsHistory => 'Geçmiş';

  @override
  String get propertySectionsBasicInfo => 'Temel Bilgiler';

  @override
  String get propertySectionsPhysicalCharacteristics => 'Fiziksel Özellikler';

  @override
  String get propertySectionsContactInfo => 'İletişim Bilgileri';

  @override
  String get propertySectionsRelatedEntities => 'İlişkili Varlıklar';

  @override
  String get propertySectionsMetadata => 'Meta Veri';

  @override
  String get propertySectionsFeatures => 'Özellikler';

  @override
  String get propertySectionsAmenities => 'Olanaklar';

  @override
  String get propertySectionsLocationInfo => 'Konum Bilgileri';

  @override
  String get propertyFieldsTitle => 'Başlık';

  @override
  String get propertyFieldsDescription => 'Açıklama';

  @override
  String get propertyFieldsPropertyType => 'Mülk Türü';

  @override
  String get propertyFieldsStatus => 'Durum';

  @override
  String get propertyFieldsCategory => 'Kategori';

  @override
  String get propertyFieldsBuildingClass => 'Bina Sınıfı';

  @override
  String get propertyFieldsCondition => 'Durum (Fiziksel)';

  @override
  String get propertyFieldsSize => 'Boyut (m²)';

  @override
  String get propertyFieldsBedrooms => 'Yatak Odası Sayısı';

  @override
  String get propertyFieldsBathrooms => 'Banyo Sayısı';

  @override
  String get propertyFieldsYearBuilt => 'Yapım Yılı';

  @override
  String get propertyFieldsContactEmail => 'İletişim E-postası';

  @override
  String get propertyFieldsContactPhone => 'İletişim Telefonu';

  @override
  String get propertyFieldsOwner => 'Sahip';

  @override
  String get propertyFieldsAgent => 'Temsilci';

  @override
  String get propertyFieldsAgency => 'Ajans';

  @override
  String get propertyFieldsCreated => 'Oluşturuldu';

  @override
  String get propertyFieldsUpdated => 'Güncellendi';

  @override
  String get propertyFieldsListed => 'Listelendi';

  @override
  String get propertyFieldsAddress => 'Adres';

  @override
  String get propertyFieldsCity => 'Şehir';

  @override
  String get propertyFieldsStateProvince => 'İl/Eyalet';

  @override
  String get propertyFieldsPostalCode => 'Posta Kodu';

  @override
  String get propertyFieldsCountry => 'Ülke';

  @override
  String get propertyFieldsCoordinates => 'Koordinatlar';

  @override
  String get propertyFieldsLatitude => 'Enlem';

  @override
  String get propertyFieldsLongitude => 'Boylam';

  @override
  String get propertyNoFeatures => 'Listelenen özellik yok';

  @override
  String get propertyNoAmenities => 'Listelenen olanak yok';

  @override
  String get propertyNoCoordinates => 'Koordinat mevcut değil';

  @override
  String get propertySuccessDeleted => 'Mülk başarıyla silindi';

  @override
  String get propertySuccessCreated => 'Mülk başarıyla oluşturuldu';

  @override
  String get propertySuccessUpdated => 'Mülk başarıyla güncellendi';

  @override
  String get propertyErrorDelete => 'Mülk silinemedi';

  @override
  String get propertyErrorCreate => 'Mülk oluşturulamadı';

  @override
  String get propertyErrorUpdate => 'Mülk güncellenemedi';

  @override
  String get propertyErrorFetch => 'Mülk detayları getirilemedi';

  @override
  String get adminDashboard => 'Yönetici Paneli';

  @override
  String get adminProperties => 'Mülkler';

  @override
  String get adminAgents => 'Temsilciler';

  @override
  String get adminAgencies => 'Ajanslar';

  @override
  String get adminOwners => 'Sahipler';

  @override
  String get adminTenants => 'Kiracılar';

  @override
  String get adminPayments => 'Ödemeler';

  @override
  String get adminTasks => 'Görevler';

  @override
  String get adminMessages => 'Mesajlar';

  @override
  String get adminReports => 'Raporlar';

  @override
  String get adminAnalytics => 'Analitik';

  @override
  String get adminSettings => 'Ayarlar';

  @override
  String get adminNotifications => 'Bildirimler';

  @override
  String get account_id => 'Hesap ID';

  @override
  String get account_type => 'Tür';

  @override
  String get account_provider => 'Sağlayıcı';

  @override
  String get accountFilter_type_BANK => 'Banka Hesabı';

  @override
  String get accountFilter_type_CREDIT_CARD => 'Kredi Kartı';

  @override
  String get accountFilter_type_INVESTMENT => 'Yatırım Hesabı';

  @override
  String get accountFilter_type_SAVINGS => 'Tasarruf Hesabı';

  @override
  String get accountFilter_type_LOAN => 'Kredi Hesabı';

  @override
  String get accountFilter_type_OTHER => 'Diğer Hesap';

  @override
  String get facilityDetailTitle => 'Tesis Detayları';

  @override
  String get facilityDetailId => 'ID';

  @override
  String get facilityDetailName => 'Ad';

  @override
  String get facilityDetailDescription => 'Açıklama';

  @override
  String get facilityDetailType => 'Tür';

  @override
  String get facilityDetailStatus => 'Durum';

  @override
  String get facilityDetailPropertyId => 'Mülk ID';

  @override
  String get facilityDetailLocation => 'Konum';

  @override
  String get facilityDetailMetadata => 'Meta Veri';

  @override
  String get facilityDetailCreatedBy => 'Oluşturan';

  @override
  String get facilityDetailUpdatedBy => 'Güncelleyen';

  @override
  String get facilityDetailCreatedAt => 'Oluşturulma Tarihi';

  @override
  String get facilityDetailUpdatedAt => 'Güncellenme Tarihi';

  @override
  String get facilityDetailDeletedAt => 'Silinme Tarihi';

  @override
  String get complianceRecordDetailTitle => 'Uyumluluk Kaydı Detayları';

  @override
  String get complianceRecordType => 'Tür';

  @override
  String get complianceRecordStatus => 'Durum';

  @override
  String get complianceRecordMetadata => 'Meta Veri';

  @override
  String get complianceRecordCustomFields => 'Özel Alanlar';

  @override
  String get analyticsDetailTitle => 'Analitik Detayları';

  @override
  String get analyticsType => 'Tür';

  @override
  String get analyticsEntityType => 'Varlık Türü';

  @override
  String get analyticsEntityId => 'Varlık ID';

  @override
  String get analyticsTimestamp => 'Zaman Damgası';

  @override
  String get analyticsPropertyId => 'Mülk ID';

  @override
  String get analyticsUserId => 'Kullanıcı ID';

  @override
  String get analyticsAgentId => 'Temsilci ID';

  @override
  String get analyticsAgencyId => 'Ajans ID';

  @override
  String get analyticsReservationId => 'Rezervasyon ID';

  @override
  String get analyticsTaskId => 'Görev ID';

  @override
  String get analyticsDeletedAt => 'Silinme Tarihi';

  @override
  String get analyticsCreatedAt => 'Oluşturulma Tarihi';

  @override
  String get analyticsUpdatedAt => 'Güncellenme Tarihi';

  @override
  String get analyticsData => 'Veri';

  @override
  String get analyticsAgency => 'Ajans';

  @override
  String get analyticsAgent => 'Temsilci';

  @override
  String get analyticsTypeListingView => 'İlan Görüntüleme';

  @override
  String get analyticsTypeBookingConversion => 'Rezervasyon Dönüşümü';

  @override
  String get analyticsTypeUserEngagement => 'Kullanıcı Etkileşimi';

  @override
  String get analyticsTypeRevenue => 'Gelir';

  @override
  String get analyticsTypePerformance => 'Performans';

  @override
  String get analyticsTypeAgentPerformance => 'Temsilci Performansı';

  @override
  String get analyticsTypeAgencyPerformance => 'Ajans Performansı';

  @override
  String get analyticsTypeView => 'Görüntüleme';

  @override
  String get contractDetailTitle => 'Sözleşme Detayları';

  @override
  String get contractIdLabel => 'ID';

  @override
  String get contractNameLabel => 'Ad';

  @override
  String get contractDescriptionLabel => 'Açıklama';

  @override
  String get contractTypeLabel => 'Tür';

  @override
  String get contractStatusLabel => 'Durum';

  @override
  String get contractCurrencyLabel => 'Para Birimi';

  @override
  String get contractRentAmountLabel => 'Kira Tutarı';

  @override
  String get contractNoticePeriodLabel => 'İhbar Süresi';

  @override
  String get contractPropertyIdLabel => 'Mülk ID';

  @override
  String get contractTenantIdLabel => 'Kiracı ID';

  @override
  String get contractLandlordIdLabel => 'Ev Sahibi ID';

  @override
  String get contractOwnerIdLabel => 'Sahip ID';

  @override
  String get contractAgencyIdLabel => 'Ajans ID';

  @override
  String get contractStartDateLabel => 'Başlangıç Tarihi';

  @override
  String get contractEndDateLabel => 'Bitiş Tarihi';

  @override
  String get contractCreatedAtLabel => 'Oluşturulma Tarihi';

  @override
  String get contractUpdatedAtLabel => 'Güncellenme Tarihi';

  @override
  String get contractDeletedAtLabel => 'Silinme Tarihi';

  @override
  String get contractSignedByLabel => 'İmzalayan';

  @override
  String get contractSignedAtLabel => 'İmzalanma Tarihi';

  @override
  String get contractTerminatedByLabel => 'Fesheden';

  @override
  String get contractTerminatedAtLabel => 'Fesih Tarihi';

  @override
  String get contractCancelledByLabel => 'İptal Eden';

  @override
  String get contractCancelledAtLabel => 'İptal Tarihi';

  @override
  String get contractTermsLabel => 'Şartlar:';

  @override
  String get contractConditionsLabel => 'Koşullar:';

  @override
  String get contractTypeRental => 'Kira';

  @override
  String get contractTypeSale => 'Satış';

  @override
  String get contractTypeManagement => 'Yönetim';

  @override
  String get contractTypeCommission => 'Komisyon';

  @override
  String get contractTypeService => 'Hizmet';

  @override
  String get contractStatusDraft => 'Taslak';

  @override
  String get contractStatusActive => 'Aktif';

  @override
  String get contractStatusExpired => 'Süresi Dolmuş';

  @override
  String get contractStatusTerminated => 'Feshedilmiş';

  @override
  String get contractStatusRenewed => 'Yenilenmiş';

  @override
  String get contractStatusPending => 'Beklemede';

  @override
  String get contractStatusArchived => 'Arşivlenmiş';

  @override
  String get taxRecordAny => 'Herhangi Biri';

  @override
  String get taxRecordPaid => 'Ödendi';

  @override
  String get taxRecordUnpaid => 'Ödenmedi';

  @override
  String get taxRecordsTitle => 'Vergi Kayıtları';

  @override
  String get eventType => 'Tür';

  @override
  String get eventStatus => 'Durum';

  @override
  String get eventProperty => 'Mülk';

  @override
  String get eventAttendees => 'Katılımcılar';

  @override
  String get eventDate => 'Tarih';

  @override
  String get eventListTitle => 'Etkinlikler';

  @override
  String get eventGallery => 'Galeri';

  @override
  String get pricingRuleName => 'Ad';

  @override
  String get pricingRuleType => 'Tür';

  @override
  String get pricingRuleStatus => 'Durum';

  @override
  String get pricingRuleMultiplier => 'Çarpan';

  @override
  String get pricingRuleFixedPrice => 'Sabit Fiyat';

  @override
  String get pricingRuleIsActive => 'Aktif Mi';

  @override
  String get pricingRulePropertyId => 'Mülk ID';

  @override
  String get pricingRuleCreatedAt => 'Oluşturulma Tarihi';

  @override
  String get pricingRuleUpdatedAt => 'Güncellenme Tarihi';

  @override
  String get pricingRuleDeletedAt => 'Silinme Tarihi';

  @override
  String get pricingRuleConditions => 'Koşullar';

  @override
  String get pricingRuleProperty => 'Mülk';

  @override
  String get mentionType => 'Tür';

  @override
  String get mentionStatus => 'Durum';

  @override
  String get taskType => 'Tür';

  @override
  String get taskStatus => 'Durum';

  @override
  String get taskPriority => 'Öncelik';

  @override
  String get taskAssignedTo => 'Atanan Kişi';

  @override
  String get taskCreatedAt => 'Oluşturulma Tarihi';

  @override
  String get taskUpdatedAt => 'Güncellenme Tarihi';

  @override
  String get taskDeletedAt => 'Silinme Tarihi';

  @override
  String get guestStatus => 'Durum';

  @override
  String get guestPhoneNumber => 'Telefon Numarası';

  @override
  String get reviewType => 'Tür';

  @override
  String get reviewStatus => 'Durum';

  @override
  String get notificationType => 'Tür';

  @override
  String get notificationStatus => 'Durum';

  @override
  String get messageType => 'Tür';

  @override
  String get messageStatus => 'Durum';

  @override
  String get accountType => 'Tür';

  @override
  String get accountStatus => 'Durum';

  @override
  String get complianceTypeLicense => 'Lisans';

  @override
  String get complianceTypeCertification => 'Sertifika';

  @override
  String get complianceTypeInsurance => 'Sigorta';

  @override
  String get complianceTypePermit => 'İzin';

  @override
  String get complianceTypeOther => 'Diğer';

  @override
  String get complianceStatusPending => 'Beklemede';

  @override
  String get complianceStatusApproved => 'Onaylandı';

  @override
  String get complianceStatusRejected => 'Reddedildi';

  @override
  String get complianceStatusExpired => 'Süresi Dolmuş';

  @override
  String get commonYes => 'Evet';

  @override
  String get commonNo => 'Hayır';

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
  String get adminUsers => 'Kullanıcılar';

  @override
  String get adminExpenses => 'Giderler';

  @override
  String get adminFacilities => 'Tesisler';

  @override
  String get adminHelpdesk => 'Yardım Masası';

  @override
  String get adminSubscriptions => 'Abonelikler';

  @override
  String get adminContracts => 'Sözleşmeler';

  @override
  String get adminGuests => 'Misafirler';

  @override
  String get adminCompliance => 'Uyumluluk';

  @override
  String get adminPricingRules => 'Fiyatlandırma Kuralları';

  @override
  String get adminReviews => 'İncelemeler';

  @override
  String get accountFilter_type_facebook => 'Facebook';

  @override
  String get edit_agent_tooltip => 'Temsilciyi Düzenle';

  @override
  String get agent_contact_information_title => 'İletişim Bilgileri';

  @override
  String get agent_email_label => 'E-posta';

  @override
  String get agent_phone_label => 'Telefon';

  @override
  String get agent_address_label => 'Adres';

  @override
  String get agent_website_label => 'Web Sitesi';

  @override
  String get agent_professional_information_title => 'Profesyonel Bilgiler';

  @override
  String get agent_status_label => 'Durum';

  @override
  String get agent_agency_label => 'Ajans';

  @override
  String get agent_specialities_label => 'Uzmanlık Alanları';

  @override
  String get agent_activity_title => 'Son Etkinlik';

  @override
  String get agent_last_active_label => 'Son Aktif Olma Zamanı';

  @override
  String get agent_is_active_label => 'Aktif Mi';

  @override
  String get agent_created_at_label => 'Oluşturulma Tarihi';

  @override
  String get common_not_available => 'Mevcut değil';

  @override
  String get common_yes => 'Evet';

  @override
  String get common_no => 'Hayır';

  @override
  String get availability_edit_title => 'Müsaitliği Düzenle';

  @override
  String get common_save => 'Kaydet';

  @override
  String get availability_date => 'Tarih';

  @override
  String get availability_not_set => 'Ayarlanmadı';

  @override
  String get availability_blocked => 'Engellendi';

  @override
  String get availability_booked => 'Rezerve Edildi';

  @override
  String get availability_property_id => 'Mülk ID';

  @override
  String get availability_reservation_id => 'Rezervasyon ID';

  @override
  String get availability_pricing_rule_id => 'Fiyatlandırma Kuralı ID';

  @override
  String get availability_total_units => 'Toplam Birim';

  @override
  String get availability_available_units => 'Müsait Birimler';

  @override
  String get availability_booked_units => 'Rezerve Edilmiş Birimler';

  @override
  String get availability_blocked_units => 'Engellenmiş Birimler';

  @override
  String get availability_base_price => 'Taban Fiyat';

  @override
  String get availability_current_price => 'Güncel Fiyat';

  @override
  String get availability_special_pricing_json => 'Özel Fiyatlandırma (JSON)';

  @override
  String get availability_price_settings_json => 'Fiyat Ayarları (JSON)';

  @override
  String get availability_min_nights => 'Minimum Gece';

  @override
  String get availability_max_nights => 'Maksimum Gece';

  @override
  String get availability_max_guests => 'Maksimum Misafir';

  @override
  String get availability_discount_settings_json => 'İndirim Ayarları (JSON)';

  @override
  String get availability_weekend_rate => 'Hafta Sonu Fiyatı';

  @override
  String get availability_weekday_rate => 'Hafta İçi Fiyatı';

  @override
  String get availability_weekend_multiplier => 'Hafta Sonu Çarpanı';

  @override
  String get availability_weekday_multiplier => 'Hafta İçi Çarpanı';

  @override
  String get availability_seasonal_multiplier => 'Sezonluk Çarpan';

  @override
  String get facilityTypeGym => 'Spor Salonu';

  @override
  String get facilityTypePool => 'Havuz';

  @override
  String get facilityTypeParkingLot => 'Otopark';

  @override
  String get facilityTypeLaundry => 'Çamaşırhane';

  @override
  String get facilityTypeElevator => 'Asansör';

  @override
  String get facilityTypeSecurity => 'Güvenlik';

  @override
  String get facilityTypeOther => 'Diğer';

  @override
  String get facilityStatusAvailable => 'Müsait';

  @override
  String get facilityStatusUnavailable => 'Müsait Değil';

  @override
  String get facilityStatusMaintenance => 'Bakımda';
}
