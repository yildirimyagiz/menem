// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for Russian (`ru`).
class AppLocalizationsRu extends AppLocalizations {
  AppLocalizationsRu([String locale = 'ru']) : super(locale);

  @override
  String get appTitle => 'Menem';

  @override
  String get dashboard => 'Панель управления';

  @override
  String get manageProperties => 'Управляйте вашей недвижимостью';

  @override
  String get quickAccess => 'Быстрый доступ';

  @override
  String get properties => 'Объекты недвижимости';

  @override
  String get tenants => 'Арендаторы';

  @override
  String get payments => 'Платежи';

  @override
  String get tasks => 'Задачи';

  @override
  String get summaryStatistics => 'Сводная статистика';

  @override
  String get totalProperties => 'Всего объектов';

  @override
  String occupancyRate(Object rate) {
    return 'Уровень загруженности: $rate';
  }

  @override
  String get monthlyCashflow => 'Ежемесячный денежный поток';

  @override
  String pendingPayments(Object count) {
    return 'Ожидающие платежи: $count';
  }

  @override
  String get pendingTasks => 'Ожидающие задачи';

  @override
  String tasksThisWeek(Object count) {
    return '$count на этой неделе';
  }

  @override
  String get propertyDetailTitle => 'Детали объекта';

  @override
  String get propertyDetailOverviewTab => 'Обзор';

  @override
  String get propertyDetailFeaturesTab => 'Характеристики';

  @override
  String get propertyDetailLocationTab => 'Местоположение';

  @override
  String get propertyDetailGalleryTab => 'Галерея';

  @override
  String get propertyDetailId => 'ID';

  @override
  String get propertyDetailNumber => 'Номер объекта';

  @override
  String get propertyDetailTitleField => 'Название';

  @override
  String get propertyDetailDescription => 'Описание';

  @override
  String get propertyDetailType => 'Тип';

  @override
  String get propertyDetailStatus => 'Статус';

  @override
  String get propertyDetailCategory => 'Категория';

  @override
  String get propertyDetailCondition => 'Состояние';

  @override
  String get propertyDetailMarketValue => 'Рыночная стоимость';

  @override
  String get propertyDetailBedrooms => 'Спальни';

  @override
  String get propertyDetailBathrooms => 'Ванные комнаты';

  @override
  String get propertyDetailYearBuilt => 'Год постройки';

  @override
  String get propertyDetailFeatures => 'Характеристики';

  @override
  String get propertyDetailAmenities => 'Удобства';

  @override
  String get propertyDetailAddress => 'Адрес';

  @override
  String get propertyDetailCity => 'Город';

  @override
  String get propertyDetailState => 'Штат/Провинция';

  @override
  String get propertyDetailCountry => 'Страна';

  @override
  String get propertyDetailZipCode => 'Почтовый индекс';

  @override
  String get propertyDetailCoordinates => 'Координаты';

  @override
  String get propertyDetailNoFeatures =>
      'Характеристики или удобства отсутствуют';

  @override
  String get propertyDetailNoLocation =>
      'Информация о местоположении отсутствует';

  @override
  String get propertyDetailGalleryPlaceholder =>
      'Просмотр галереи (реализовать с помощью GridView изображений)';

  @override
  String get propertyDetailDeleteConfirm =>
      'Вы уверены, что хотите удалить этот объект?';

  @override
  String get propertyDetailDeleteSuccess => 'Объект успешно удален';

  @override
  String propertyDetailDeleteFailed(Object error) {
    return 'Не удалось удалить объект: $error';
  }

  @override
  String get propertyDetailContactAgent => 'Связаться с агентом';

  @override
  String get propertyDetailPrice => 'Цена';

  @override
  String get propertyDetailLoading => 'Загрузка деталей объекта...';

  @override
  String get propertyDetailNotFound => 'Объект не найден.';

  @override
  String get totalTenants => 'Всего арендаторов';

  @override
  String newTenants(Object count) {
    return 'Новые арендаторы: $count';
  }

  @override
  String get homeLabel => 'Главная';

  @override
  String get favoritesEmpty => 'Избранного пока нет';

  @override
  String get favoritesError => 'Ошибка загрузки избранного';

  @override
  String get favoritesRetry => 'Повторить';

  @override
  String get emptyStateRetry => 'Повторить';

  @override
  String get listings => 'Мои объекты';

  @override
  String get listingsEmpty => 'Объявлений пока нет';

  @override
  String get listingsRetry => 'Повторить';

  @override
  String get filterPropertiesTitle => 'Фильтр объектов';

  @override
  String get filterPropertiesApply => 'Применить';

  @override
  String get filterPropertiesCancel => 'Отмена';

  @override
  String get messagesLabel => 'Сообщения';

  @override
  String get notificationsLabel => 'Уведомления';

  @override
  String get notificationsEmpty => 'Уведомлений пока нет';

  @override
  String get paymentsLabel => 'Платежи';

  @override
  String get settingsLabel => 'Настройки';

  @override
  String get settingsAppearance => 'Внешний вид';

  @override
  String get settingsDarkMode => 'Темный режим';

  @override
  String get filterTasksTitle => 'Фильтр задач';

  @override
  String get filterTasksStatus => 'Статус';

  @override
  String get filterTasksPriority => 'Приоритет';

  @override
  String get filterTasksType => 'Тип';

  @override
  String get filterTasksDueDate => 'Срок выполнения';

  @override
  String get filterTasksApply => 'Применить';

  @override
  String get filterTasksCancel => 'Отмена';

  @override
  String get profileLabel => 'Профиль';

  @override
  String get logoutLabel => 'Выйти';

  @override
  String get loggingout => 'Выход...';

  @override
  String get sitetitle => 'RentalProc';

  @override
  String get nav_home => 'Главная';

  @override
  String get nav_properties => 'Объекты';

  @override
  String get nav_payments => 'Платежи';

  @override
  String get nav_tasks => 'Задачи';

  @override
  String get nav_messages => 'Сообщения';

  @override
  String get nav_notifications => 'Уведомления';

  @override
  String get nav_helpdesk => 'Служба поддержки';

  @override
  String get nav_subscription => 'Подписка';

  @override
  String get nav_settings => 'Настройки';

  @override
  String get nav_tenants => 'Арендаторы';

  @override
  String get nav_expenses => 'Расходы';

  @override
  String get nav_facilities => 'Удобства';

  @override
  String get nav_analytics => 'Аналитика';

  @override
  String get nav_help => 'Помощь';

  @override
  String get nav_logout => 'Выйти';

  @override
  String get nav_profile => 'Профиль';

  @override
  String get nav_viewAll => 'Посмотреть все';

  @override
  String get indexTitle => 'Добро пожаловать в Menem';

  @override
  String get indexDescription => 'Ваше решение для управления недвижимостью';

  @override
  String get indexPropertyManagementTitle => 'Управление недвижимостью';

  @override
  String get indexPropertyManagementDescription =>
      'Эффективно управляйте своей недвижимостью с помощью нашего комплексного набора инструментов.';

  @override
  String get indexWaterManagementTitle => 'Управление водными ресурсами';

  @override
  String get indexWaterManagementDescription =>
      'Отслеживайте и оптимизируйте использование воды на ваших объектах.';

  @override
  String get authSignIn => 'Войти через Google';

  @override
  String get authSignOut => 'Выйти';

  @override
  String get createPropertyTitle => 'Создать новый объект';

  @override
  String get propertyCreatedSuccess => 'Объект успешно создан';

  @override
  String get propertyCreatedError => 'Не удалось создать объект';

  @override
  String get registerAlreadyHaveAccount => 'Уже есть аккаунт? Войти';

  @override
  String get registerForgotPassword => 'Забыли пароль?';

  @override
  String get propertyViewingEventsTitle => 'События просмотра';

  @override
  String get propertyViewingSchedule => 'Запланировать просмотр';

  @override
  String authWelcomeBack(Object name) {
    return 'С возвращением, $name';
  }

  @override
  String get postsCreate => 'Создать пост';

  @override
  String get postsTitle => 'Заголовок';

  @override
  String get postsContent => 'Содержание';

  @override
  String get postsLoading => 'Загрузка постов...';

  @override
  String get postsSave => 'Сохранить';

  @override
  String get postsCancel => 'Отмена';

  @override
  String get postsEdit => 'Редактировать';

  @override
  String get postsDelete => 'Удалить';

  @override
  String get postsNoPostsYet => 'Постов пока нет';

  @override
  String get postsErrorUnauthorized =>
      'Для выполнения этого действия необходимо войти в систему';

  @override
  String get postsErrorCreatePost => 'Не удалось создать пост';

  @override
  String get postsErrorUpdatePost => 'Не удалось обновить пост';

  @override
  String get postsErrorDeletePost => 'Не удалось удалить пост';

  @override
  String get chatMessages => 'Сообщения';

  @override
  String chatChattingWith(Object name) {
    return 'Чат с $name';
  }

  @override
  String get chatConnectWithUsers =>
      'Свяжитесь с пользователями и получите поддержку';

  @override
  String get chatBackToList => 'Назад к списку';

  @override
  String get chatWelcomeToChat => 'Добро пожаловать в чат';

  @override
  String get chatWelcomeDescription =>
      'Начните разговор с другими пользователями или обратитесь в службу поддержки за помощью';

  @override
  String get chatNewMessage => 'Новое сообщение';

  @override
  String get chatContactSupport => 'Связаться с поддержкой';

  @override
  String get chatBack => 'Назад';

  @override
  String get chatSearchUsers => 'Поиск пользователей...';

  @override
  String get chatTypeMessage => 'Введите ваше сообщение...';

  @override
  String get chatSend => 'Отправить';

  @override
  String get chatErrorUnauthorized =>
      'Для выполнения этого действия необходимо войти в систему';

  @override
  String get chatErrorSendMessage => 'Не удалось отправить сообщение';

  @override
  String get chatErrorMarkAsRead =>
      'Не удалось отметить сообщения как прочитанные';

  @override
  String get chatError => 'Ошибка';

  @override
  String get chatConnectionError =>
      'Не удалось подключиться к серверу чата. Пожалуйста, попробуйте еще раз.';

  @override
  String get chatMessageSendError =>
      'Не удалось отправить ваше сообщение. Пожалуйста, попробуйте позже.';

  @override
  String get notifications_placeholder => 'Уведомлений пока нет';

  @override
  String get notificationsPlaceholder => 'Уведомлений пока нет';

  @override
  String commonTimeAgo(Object time) {
    return '$time назад';
  }

  @override
  String get commonSuccess => 'Успешно';

  @override
  String get commonError => 'Ошибка';

  @override
  String propertiesFound(Object count) {
    return 'Найдено объектов: $count';
  }

  @override
  String get errorScreenTitle => 'Ошибка';

  @override
  String get errorScreenGoBack => 'Назад';

  @override
  String get dateRangeSelectTitle => 'Выберите диапазон дат';

  @override
  String get dateRangeSelectApply => 'Применить';

  @override
  String get dateRangeSelectCancel => 'Отмена';

  @override
  String get commonWarning => 'Предупреждение';

  @override
  String get commonInfo => 'Информация';

  @override
  String get commonLoading => 'Загрузка...';

  @override
  String get commonSave => 'Сохранить';

  @override
  String get commonCancel => 'Отмена';

  @override
  String get commonDelete => 'Удалить';

  @override
  String get commonEdit => 'Редактировать';

  @override
  String get commonCreate => 'Создать';

  @override
  String get commonView => 'Просмотр';

  @override
  String get commonPrevious => 'Предыдущий';

  @override
  String get commonNext => 'Следующий';

  @override
  String get commonBack => 'Назад';

  @override
  String get commonConfirm => 'Подтвердить';

  @override
  String get commonActions => 'Действия';

  @override
  String get commonSearch => 'Поиск';

  @override
  String get commonFilter => 'Фильтр';

  @override
  String get commonSort => 'Сортировка';

  @override
  String get commonNoData => 'Данные отсутствуют';

  @override
  String get editAgentTooltip => 'Редактировать агента';

  @override
  String get agentContactInformationTitle => 'Контактная информация';

  @override
  String get agentEmailLabel => 'Электронная почта';

  @override
  String get agentPhoneLabel => 'Телефон';

  @override
  String get agentAddressLabel => 'Адрес';

  @override
  String get agentWebsiteLabel => 'Веб-сайт';

  @override
  String get agentProfessionalInformationTitle => 'Профессиональная информация';

  @override
  String get agentStatusLabel => 'Статус';

  @override
  String get agentAgencyLabel => 'Агентство';

  @override
  String get agentSpecialitiesLabel => 'Специализации';

  @override
  String get agentActivityTitle => 'Недавняя активность';

  @override
  String get agentLastActiveLabel => 'Последняя активность';

  @override
  String get agentIsActiveLabel => 'Активен';

  @override
  String get agentCreatedAtLabel => 'Создано';

  @override
  String get agentAdditionalInformationTitle => 'Дополнительная информация';

  @override
  String get agentBioLabel => 'Биография';

  @override
  String get agentExternalIdLabel => 'Внешний ID';

  @override
  String get agentSettingsLabel => 'Настройки';

  @override
  String get agentIntegrationLabel => 'Интеграция';

  @override
  String get agentOwnerIdLabel => 'ID владельца';

  @override
  String get agentAgencyIdLabel => 'ID агентства';

  @override
  String get agentDeletedAtLabel => 'Удалено';

  @override
  String get amenitiesSectionTitle => 'Удобства';

  @override
  String get noAmenitiesListed => 'Удобства не указаны';

  @override
  String get locationSectionTitle => 'Местоположение';

  @override
  String get getDirectionsButton => 'Проложить маршрут';

  @override
  String get messageStatusRead => 'Прочитано';

  @override
  String get messageStatusDelivered => 'Доставлено';

  @override
  String get messageStatusSent => 'Отправлено';

  @override
  String get defaultUser => 'Пользователь по умолчанию';

  @override
  String get unknownTime => 'Неизвестное время';

  @override
  String get commonNotAvailable => 'Недоступно';

  @override
  String accountsFound(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'Найдено $count аккаунта',
      many: 'Найдено $count аккаунтов',
      few: 'Найдено $count аккаунта',
      one: 'Найден 1 аккаунт',
      zero: 'Аккаунты не найдены',
    );
    return '$_temp0';
  }

  @override
  String get actionCardProperties => 'Объекты';

  @override
  String get actionCardTenants => 'Арендаторы';

  @override
  String get actionCardAnalytics => 'Аналитика';

  @override
  String get actionCardPayments => 'Платежи';

  @override
  String get actionCardTasks => 'Задачи';

  @override
  String get actionCardMessages => 'Сообщения';

  @override
  String get actionCardHelpDesk => 'Служба поддержки';

  @override
  String get actionCardManageYourPropertyPortfolio =>
      'Управляйте своим портфелем недвижимости';

  @override
  String get actionCardManageTenantInformation =>
      'Управляйте информацией об арендаторах';

  @override
  String get actionCardViewReportsAndAnalytics =>
      'Просмотр отчетов и аналитики';

  @override
  String get actionCardTrackFinancialRecords =>
      'Отслеживайте финансовые записи';

  @override
  String get actionCardManageMaintenanceTasks =>
      'Управляйте задачами по техническому обслуживанию';

  @override
  String get actionCardCommunicateWithTenants => 'Общайтесь с арендаторами';

  @override
  String get actionCardGetAssistanceWhenNeeded =>
      'Получайте помощь, когда это необходимо';

  @override
  String get actionCardAddProperty => 'Добавить объект';

  @override
  String get actionCardCreateANewPropertyListing =>
      'Создать новое объявление о недвижимости';

  @override
  String get actionCardAddTenant => 'Добавить арендатора';

  @override
  String get actionCardRegisterANewTenant =>
      'Зарегистрировать нового арендатора';

  @override
  String get actionCardRecordPayment => 'Записать платеж';

  @override
  String get actionCardRecordARentPayment => 'Записать арендный платеж';

  @override
  String get actionCardAddTask => 'Добавить задачу';

  @override
  String get actionCardCreateAMaintenanceTask =>
      'Создать задачу по техническому обслуживанию';

  @override
  String get actionCardScheduleEvent => 'Запланировать событие';

  @override
  String get actionCardCreateAPropertyEvent => 'Создать событие объекта';

  @override
  String get actionCardComposeMessage => 'Написать сообщение';

  @override
  String get actionCardSendAMessageToTenants =>
      'Отправить сообщение арендаторам';

  @override
  String get actionCardCreateDocument => 'Создать документ';

  @override
  String get actionCardGenerateANewDocument => 'Создать новый документ';

  @override
  String get actionCardGetStarted => 'Начать';

  @override
  String get actionCardNewThisMonth => 'Новое в этом месяце';

  @override
  String get tenantsTitle => 'Арендаторы';

  @override
  String get tenantsDescription =>
      'Управляйте информацией об арендаторах и договорами аренды на ваших объектах';

  @override
  String get tenantsAddTenant => 'Добавить арендатора';

  @override
  String get tenantsPropertyFilter => 'Объект';

  @override
  String get tenantsAllProperties => 'Все объекты';

  @override
  String get tenantsPaymentStatusFilter => 'Статус платежа';

  @override
  String get tenantsAllStatuses => 'Все статусы';

  @override
  String get tenantsTenantColumn => 'Арендатор';

  @override
  String get tenantsStatusColumn => 'Статус';

  @override
  String get tenantsPropertyUnitColumn => 'Объект / Помещение';

  @override
  String get tenantsContactColumn => 'Контакт';

  @override
  String get tenantsLeasePeriodColumn => 'Срок аренды';

  @override
  String get tenantsActionsColumn => 'Действия';

  @override
  String get tenantsIdLabel => 'ID';

  @override
  String get tenantsNotAssigned => 'Не назначен';

  @override
  String get tenantsNotAvailable => 'Н/Д';

  @override
  String get tenantsLeaseFrom => 'С';

  @override
  String get tenantsLeaseTo => 'По';

  @override
  String get tenantsViewDetails => 'Посмотреть детали';

  @override
  String get tenantsEdit => 'Редактировать';

  @override
  String get tenantsDelete => 'Удалить';

  @override
  String get tenantsNoTenantsFound => 'Арендаторы не найдены';

  @override
  String get tenantsGetStartedAddTenant =>
      'Начните с добавления нового арендатора';

  @override
  String get tenantsConfirmDeletionTitle => 'Подтвердить удаление';

  @override
  String tenantsConfirmDeletionDesc(Object tenant) {
    return 'Вы уверены, что хотите удалить арендатора $tenant? Это действие нельзя отменить.';
  }

  @override
  String get tenantsCancel => 'Отмена';

  @override
  String get tenantsDeleting => 'Удаление...';

  @override
  String get tenantsPrevious => 'Предыдущий';

  @override
  String get tenantsNext => 'Следующий';

  @override
  String get tenantsStatusUnpaid => 'Не оплачено';

  @override
  String get tenantsStatusPartiallyPaid => 'Частично оплачено';

  @override
  String get tenantsStatusPaid => 'Оплачено';

  @override
  String get tenantsStatusRefunded => 'Возвращено';

  @override
  String get tenantsStatusOverdue => 'Просрочено';

  @override
  String get tenantsStatusCancelled => 'Отменено';

  @override
  String get agenciesTitle => 'Агентства';

  @override
  String get agenciesDescription =>
      'Управляйте своими агентствами и их настройками.';

  @override
  String get agenciesSearch => 'Поиск агентств...';

  @override
  String get agenciesStatus => 'Статус';

  @override
  String get agenciesStatusValuesPending => 'В ожидании';

  @override
  String get agenciesStatusValuesVerified => 'Проверено';

  @override
  String get agenciesStatusValuesRejected => 'Отклонено';

  @override
  String get agenciesAdd => 'Добавить агентство';

  @override
  String get agenciesEdit => 'Редактировать';

  @override
  String get agenciesDelete => 'Удалить';

  @override
  String agenciesConfirmDeleteDesc(Object name) {
    return 'Вы уверены, что хотите удалить $name? Это действие нельзя отменить.';
  }

  @override
  String get agenciesDeletedMsg => 'Агентство успешно удалено.';

  @override
  String get agenciesNone =>
      'Агентства, соответствующие вашему поиску, не найдены. Попробуйте другие фильтры.';

  @override
  String get agenciesNa => 'Н/Д';

  @override
  String get agenciesAgents => 'Агенты';

  @override
  String get agenciesView => 'Просмотр';

  @override
  String get agenciesName => 'Название агентства';

  @override
  String get agenciesEmail => 'Электронная почта';

  @override
  String get agenciesPhoneNumber => 'Номер телефона';

  @override
  String get agenciesAddress => 'Адрес';

  @override
  String get agenciesWebsite => 'Веб-сайт';

  @override
  String get agenciesLogoUrl => 'URL логотипа';

  @override
  String get agenciesCreated => 'Создано';

  @override
  String get agenciesUpdated => 'Обновлено';

  @override
  String get agenciesProperties => 'Объекты';

  @override
  String get agenciesActions => 'Действия';

  @override
  String get agenciesCancel => 'Отмена';

  @override
  String get agenciesDeleting => 'Удаление...';

  @override
  String get agenciesCreating => 'Создание...';

  @override
  String get agenciesSaving => 'Сохранение...';

  @override
  String get agenciesSave => 'Сохранить';

  @override
  String get agenciesCreate => 'Создать';

  @override
  String get agenciesGetStarted => 'Начните с добавления нового агентства';

  @override
  String get agenciesRequired => 'Это поле обязательно для заполнения.';

  @override
  String get agenciesInvalidEmail => 'Неверный адрес электронной почты.';

  @override
  String get agenciesInvalidUrl => 'Неверный URL.';

  @override
  String get agenciesUpdatedMsg => 'Обновлено!';

  @override
  String get agenciesCreatedMsg => 'Создано!';

  @override
  String get agenciesErrorLoad => 'Не удалось загрузить детали.';

  @override
  String get agenciesErrorCreate => 'Не удалось создать.';

  @override
  String get agenciesErrorUpdate => 'Не удалось обновить.';

  @override
  String get agenciesErrorDelete => 'Не удалось удалить.';

  @override
  String get loginPageTitle => 'Войти';

  @override
  String get loginPageEmail => 'Электронная почта';

  @override
  String get loginPagePassword => 'Пароль';

  @override
  String get loginPageRememberMe => 'Запомнить меня';

  @override
  String get loginPageForgotPassword => 'Забыли пароль?';

  @override
  String get loginPageSignIn => 'Войти';

  @override
  String get loginPageOrContinueWith => 'Или продолжить с';

  @override
  String get loginPageDontHaveAccount => 'Нет аккаунта?';

  @override
  String get loginPageSignUp => 'Зарегистрироваться';

  @override
  String get loginPageErrorInvalidCredentials =>
      'Неверный адрес электронной почты или пароль';

  @override
  String get loginPageErrorSomethingWentWrong =>
      'Что-то пошло не так. Пожалуйста, попробуйте еще раз.';

  @override
  String get loginPageErrorSessionExpired =>
      'Ваша сессия истекла. Пожалуйста, войдите снова.';

  @override
  String get authErrorTitle => 'Ошибка аутентификации';

  @override
  String get authErrorSomethingWentWrong =>
      'Во время аутентификации что-то пошло не так. Пожалуйста, попробуйте еще раз.';

  @override
  String get authErrorOauthAccountNotLinked =>
      'Аккаунт с этим адресом электронной почты уже существует. Пожалуйста, войдите с использованием исходного метода аутентификации.';

  @override
  String get authErrorOauthCallbackError =>
      'Произошла ошибка во время процесса обратного вызова OAuth.';

  @override
  String get authErrorOauthCreateAccountError =>
      'Не удалось создать новый аккаунт. Пожалуйста, попробуйте еще раз.';

  @override
  String get authErrorOauthSignInError =>
      'Ошибка входа с выбранным провайдером. Пожалуйста, попробуйте еще раз.';

  @override
  String get authErrorBackToLogin => 'Назад ко входу';

  @override
  String get propertyTitle => 'Детали объекта';

  @override
  String get propertyBackToProperties => 'Назад к объектам';

  @override
  String get propertyEditProperty => 'Редактировать объект';

  @override
  String get propertyDeleteProperty => 'Удалить объект';

  @override
  String get propertyCreateProperty => 'Создать объект';

  @override
  String get propertyAddProperty => 'Добавить объект';

  @override
  String get propertyLoading => 'Загрузка объекта...';

  @override
  String get propertyNotFound => 'Объект не найден.';

  @override
  String get propertyDebugInfo => 'Отладочная информация:';

  @override
  String get propertyConfirmDeleteTitle =>
      'Вы уверены, что хотите удалить этот объект?';

  @override
  String get propertyConfirmDeleteDescription =>
      'Это действие нельзя отменить. Все данные, связанные с этим объектом, будут безвозвратно удалены.';

  @override
  String get propertyConfirmDeleteCancel => 'Отмена';

  @override
  String get propertyConfirmDeleteConfirm => 'Подтвердить удаление';

  @override
  String get propertyTabsOverview => 'Обзор';

  @override
  String get propertyTabsFeatures => 'Характеристики';

  @override
  String get propertyTabsAmenities => 'Удобства';

  @override
  String get propertyTabsLocation => 'Местоположение';

  @override
  String get propertyTabsDocuments => 'Документы';

  @override
  String get propertyTabsHistory => 'История';

  @override
  String get propertySectionsBasicInfo => 'Основная информация';

  @override
  String get propertySectionsPhysicalCharacteristics =>
      'Физические характеристики';

  @override
  String get propertySectionsContactInfo => 'Контактная информация';

  @override
  String get propertySectionsRelatedEntities => 'Связанные сущности';

  @override
  String get propertySectionsMetadata => 'Метаданные';

  @override
  String get propertySectionsFeatures => 'Характеристики';

  @override
  String get propertySectionsAmenities => 'Удобства';

  @override
  String get propertySectionsLocationInfo => 'Информация о местоположении';

  @override
  String get propertyFieldsTitle => 'Название';

  @override
  String get propertyFieldsDescription => 'Описание';

  @override
  String get propertyFieldsPropertyType => 'Тип объекта';

  @override
  String get propertyFieldsStatus => 'Статус';

  @override
  String get propertyFieldsCategory => 'Категория';

  @override
  String get propertyFieldsBuildingClass => 'Класс здания';

  @override
  String get propertyFieldsCondition => 'Состояние';

  @override
  String get propertyFieldsSize => 'Размер (м²)';

  @override
  String get propertyFieldsBedrooms => 'Спальни';

  @override
  String get propertyFieldsBathrooms => 'Ванные комнаты';

  @override
  String get propertyFieldsYearBuilt => 'Год постройки';

  @override
  String get propertyFieldsContactEmail => 'Контактный Email';

  @override
  String get propertyFieldsContactPhone => 'Контактный телефон';

  @override
  String get propertyFieldsOwner => 'Владелец';

  @override
  String get propertyFieldsAgent => 'Агент';

  @override
  String get propertyFieldsAgency => 'Агентство';

  @override
  String get propertyFieldsCreated => 'Создано';

  @override
  String get propertyFieldsUpdated => 'Обновлено';

  @override
  String get propertyFieldsListed => 'Размещено';

  @override
  String get propertyFieldsAddress => 'Адрес';

  @override
  String get propertyFieldsCity => 'Город';

  @override
  String get propertyFieldsStateProvince => 'Штат/Провинция';

  @override
  String get propertyFieldsPostalCode => 'Почтовый индекс';

  @override
  String get propertyFieldsCountry => 'Страна';

  @override
  String get propertyFieldsCoordinates => 'Координаты';

  @override
  String get propertyFieldsLatitude => 'Широта';

  @override
  String get propertyFieldsLongitude => 'Долгота';

  @override
  String get propertyNoFeatures => 'Характеристики не указаны';

  @override
  String get propertyNoAmenities => 'Удобства не указаны';

  @override
  String get propertyNoCoordinates => 'Координаты отсутствуют';

  @override
  String get propertySuccessDeleted => 'Объект успешно удален';

  @override
  String get propertySuccessCreated => 'Объект успешно создан';

  @override
  String get propertySuccessUpdated => 'Объект успешно обновлен';

  @override
  String get propertyErrorDelete => 'Не удалось удалить объект';

  @override
  String get propertyErrorCreate => 'Не удалось создать объект';

  @override
  String get propertyErrorUpdate => 'Не удалось обновить объект';

  @override
  String get propertyErrorFetch => 'Не удалось загрузить детали объекта';

  @override
  String get adminDashboard => 'Панель администратора';

  @override
  String get adminProperties => 'Объекты';

  @override
  String get adminAgents => 'Агенты';

  @override
  String get adminAgencies => 'Агентства';

  @override
  String get adminOwners => 'Владельцы';

  @override
  String get adminTenants => 'Арендаторы';

  @override
  String get adminPayments => 'Платежи';

  @override
  String get adminTasks => 'Задачи';

  @override
  String get adminMessages => 'Сообщения';

  @override
  String get adminReports => 'Отчеты';

  @override
  String get adminAnalytics => 'Аналитика';

  @override
  String get adminSettings => 'Настройки';

  @override
  String get adminNotifications => 'Уведомления';

  @override
  String get account_id => 'ID аккаунта';

  @override
  String get account_type => 'Тип';

  @override
  String get account_provider => 'Провайдер';

  @override
  String get accountFilter_type_BANK => 'Банковский счет';

  @override
  String get accountFilter_type_CREDIT_CARD => 'Кредитная карта';

  @override
  String get accountFilter_type_INVESTMENT => 'Инвестиционный счет';

  @override
  String get accountFilter_type_SAVINGS => 'Сберегательный счет';

  @override
  String get accountFilter_type_LOAN => 'Кредитный счет';

  @override
  String get accountFilter_type_OTHER => 'Другой счет';

  @override
  String get facilityDetailTitle => 'Детали удобства';

  @override
  String get facilityDetailId => 'ID';

  @override
  String get facilityDetailName => 'Название';

  @override
  String get facilityDetailDescription => 'Описание';

  @override
  String get facilityDetailType => 'Тип';

  @override
  String get facilityDetailStatus => 'Статус';

  @override
  String get facilityDetailPropertyId => 'ID объекта';

  @override
  String get facilityDetailLocation => 'Местоположение';

  @override
  String get facilityDetailMetadata => 'Метаданные';

  @override
  String get facilityDetailCreatedBy => 'Создано';

  @override
  String get facilityDetailUpdatedBy => 'Обновлено';

  @override
  String get facilityDetailCreatedAt => 'Дата создания';

  @override
  String get facilityDetailUpdatedAt => 'Дата обновления';

  @override
  String get facilityDetailDeletedAt => 'Дата удаления';

  @override
  String get complianceRecordDetailTitle => 'Детали записи о соответствии';

  @override
  String get complianceRecordType => 'Тип';

  @override
  String get complianceRecordStatus => 'Статус';

  @override
  String get complianceRecordMetadata => 'Метаданные';

  @override
  String get complianceRecordCustomFields => 'Пользовательские поля';

  @override
  String get analyticsDetailTitle => 'Детали аналитики';

  @override
  String get analyticsType => 'Тип';

  @override
  String get analyticsEntityType => 'Тип сущности';

  @override
  String get analyticsEntityId => 'ID сущности';

  @override
  String get analyticsTimestamp => 'Временная метка';

  @override
  String get analyticsPropertyId => 'ID объекта';

  @override
  String get analyticsUserId => 'ID пользователя';

  @override
  String get analyticsAgentId => 'ID агента';

  @override
  String get analyticsAgencyId => 'ID агентства';

  @override
  String get analyticsReservationId => 'ID бронирования';

  @override
  String get analyticsTaskId => 'ID задачи';

  @override
  String get analyticsDeletedAt => 'Дата удаления';

  @override
  String get analyticsCreatedAt => 'Дата создания';

  @override
  String get analyticsUpdatedAt => 'Дата обновления';

  @override
  String get analyticsData => 'Данные';

  @override
  String get analyticsAgency => 'Агентство';

  @override
  String get analyticsAgent => 'Агент';

  @override
  String get analyticsTypeListingView => 'Просмотр объявления';

  @override
  String get analyticsTypeBookingConversion => 'Конверсия бронирования';

  @override
  String get analyticsTypeUserEngagement => 'Вовлеченность пользователя';

  @override
  String get analyticsTypeRevenue => 'Доход';

  @override
  String get analyticsTypePerformance => 'Производительность';

  @override
  String get analyticsTypeAgentPerformance => 'Производительность агента';

  @override
  String get analyticsTypeAgencyPerformance => 'Производительность агентства';

  @override
  String get analyticsTypeView => 'Просмотр';

  @override
  String get contractDetailTitle => 'Детали контракта';

  @override
  String get contractIdLabel => 'ID';

  @override
  String get contractNameLabel => 'Название';

  @override
  String get contractDescriptionLabel => 'Описание';

  @override
  String get contractTypeLabel => 'Тип';

  @override
  String get contractStatusLabel => 'Статус';

  @override
  String get contractCurrencyLabel => 'Валюта';

  @override
  String get contractRentAmountLabel => 'Сумма аренды';

  @override
  String get contractNoticePeriodLabel => 'Срок уведомления';

  @override
  String get contractPropertyIdLabel => 'ID объекта';

  @override
  String get contractTenantIdLabel => 'ID арендатора';

  @override
  String get contractLandlordIdLabel => 'ID арендодателя';

  @override
  String get contractOwnerIdLabel => 'ID владельца';

  @override
  String get contractAgencyIdLabel => 'ID агентства';

  @override
  String get contractStartDateLabel => 'Дата начала';

  @override
  String get contractEndDateLabel => 'Дата окончания';

  @override
  String get contractCreatedAtLabel => 'Дата создания';

  @override
  String get contractUpdatedAtLabel => 'Дата обновления';

  @override
  String get contractDeletedAtLabel => 'Дата удаления';

  @override
  String get contractSignedByLabel => 'Подписано';

  @override
  String get contractSignedAtLabel => 'Дата подписания';

  @override
  String get contractTerminatedByLabel => 'Расторгнуто';

  @override
  String get contractTerminatedAtLabel => 'Дата расторжения';

  @override
  String get contractCancelledByLabel => 'Отменено';

  @override
  String get contractCancelledAtLabel => 'Дата отмены';

  @override
  String get contractTermsLabel => 'Условия:';

  @override
  String get contractConditionsLabel => 'Положения:';

  @override
  String get contractTypeRental => 'Аренда';

  @override
  String get contractTypeSale => 'Продажа';

  @override
  String get contractTypeManagement => 'Управление';

  @override
  String get contractTypeCommission => 'Комиссия';

  @override
  String get contractTypeService => 'Услуга';

  @override
  String get contractStatusDraft => 'Черновик';

  @override
  String get contractStatusActive => 'Активен';

  @override
  String get contractStatusExpired => 'Истек';

  @override
  String get contractStatusTerminated => 'Расторгнут';

  @override
  String get contractStatusRenewed => 'Продлен';

  @override
  String get contractStatusPending => 'В ожидании';

  @override
  String get contractStatusArchived => 'Архивирован';

  @override
  String get taxRecordAny => 'Любой';

  @override
  String get taxRecordPaid => 'Оплачено';

  @override
  String get taxRecordUnpaid => 'Не оплачено';

  @override
  String get taxRecordsTitle => 'Налоговые записи';

  @override
  String get eventType => 'Тип';

  @override
  String get eventStatus => 'Статус';

  @override
  String get eventProperty => 'Объект';

  @override
  String get eventAttendees => 'Участники';

  @override
  String get eventDate => 'Дата';

  @override
  String get eventListTitle => 'События';

  @override
  String get eventGallery => 'Галерея';

  @override
  String get pricingRuleName => 'Название';

  @override
  String get pricingRuleType => 'Тип';

  @override
  String get pricingRuleStatus => 'Статус';

  @override
  String get pricingRuleMultiplier => 'Множитель';

  @override
  String get pricingRuleFixedPrice => 'Фиксированная цена';

  @override
  String get pricingRuleIsActive => 'Активно';

  @override
  String get pricingRulePropertyId => 'ID объекта';

  @override
  String get pricingRuleCreatedAt => 'Дата создания';

  @override
  String get pricingRuleUpdatedAt => 'Дата обновления';

  @override
  String get pricingRuleDeletedAt => 'Дата удаления';

  @override
  String get pricingRuleConditions => 'Условия';

  @override
  String get pricingRuleProperty => 'Объект';

  @override
  String get mentionType => 'Тип';

  @override
  String get mentionStatus => 'Статус';

  @override
  String get taskType => 'Тип';

  @override
  String get taskStatus => 'Статус';

  @override
  String get taskPriority => 'Приоритет';

  @override
  String get taskAssignedTo => 'Назначено';

  @override
  String get taskCreatedAt => 'Дата создания';

  @override
  String get taskUpdatedAt => 'Дата обновления';

  @override
  String get taskDeletedAt => 'Дата удаления';

  @override
  String get guestStatus => 'Статус';

  @override
  String get guestPhoneNumber => 'Номер телефона';

  @override
  String get reviewType => 'Тип';

  @override
  String get reviewStatus => 'Статус';

  @override
  String get notificationType => 'Тип';

  @override
  String get notificationStatus => 'Статус';

  @override
  String get messageType => 'Тип';

  @override
  String get messageStatus => 'Статус';

  @override
  String get accountType => 'Тип';

  @override
  String get accountStatus => 'Статус';

  @override
  String get complianceTypeLicense => 'Лицензия';

  @override
  String get complianceTypeCertification => 'Сертификация';

  @override
  String get complianceTypeInsurance => 'Страхование';

  @override
  String get complianceTypePermit => 'Разрешение';

  @override
  String get complianceTypeOther => 'Другое';

  @override
  String get complianceStatusPending => 'В ожидании';

  @override
  String get complianceStatusApproved => 'Одобрено';

  @override
  String get complianceStatusRejected => 'Отклонено';

  @override
  String get complianceStatusExpired => 'Истек срок';

  @override
  String get commonYes => 'Да';

  @override
  String get commonNo => 'Нет';

  @override
  String get accountFilter_type_oauth => 'OAuth';

  @override
  String get accountFilter_type_email => 'Электронная почта';

  @override
  String get accountFilter_type_oidc => 'OIDC';

  @override
  String get accountFilter_type_credentials => 'Учетные данные';

  @override
  String get accountFilter_type_google => 'Google';

  @override
  String get adminUsers => 'Пользователи';

  @override
  String get adminExpenses => 'Расходы';

  @override
  String get adminFacilities => 'Удобства';

  @override
  String get adminHelpdesk => 'Служба поддержки';

  @override
  String get adminSubscriptions => 'Подписки';

  @override
  String get adminContracts => 'Контракты';

  @override
  String get adminGuests => 'Гости';

  @override
  String get adminCompliance => 'Соответствие';

  @override
  String get adminPricingRules => 'Правила ценообразования';

  @override
  String get adminReviews => 'Отзывы';

  @override
  String get accountFilter_type_facebook => 'Facebook';

  @override
  String get edit_agent_tooltip => 'Редактировать агента';

  @override
  String get agent_contact_information_title => 'Контактная информация';

  @override
  String get agent_email_label => 'Электронная почта';

  @override
  String get agent_phone_label => 'Телефон';

  @override
  String get agent_address_label => 'Адрес';

  @override
  String get agent_website_label => 'Веб-сайт';

  @override
  String get agent_professional_information_title =>
      'Профессиональная информация';

  @override
  String get agent_status_label => 'Статус';

  @override
  String get agent_agency_label => 'Агентство';

  @override
  String get agent_specialities_label => 'Специализации';

  @override
  String get agent_activity_title => 'Недавняя активность';

  @override
  String get agent_last_active_label => 'Последняя активность';

  @override
  String get agent_is_active_label => 'Активен';

  @override
  String get agent_created_at_label => 'Создано';

  @override
  String get common_not_available => 'Недоступно';

  @override
  String get common_yes => 'Да';

  @override
  String get common_no => 'Нет';

  @override
  String get availability_edit_title => 'Редактировать доступность';

  @override
  String get common_save => 'Сохранить';

  @override
  String get availability_date => 'Дата';

  @override
  String get availability_not_set => 'Не установлено';

  @override
  String get availability_blocked => 'Заблокировано';

  @override
  String get availability_booked => 'Забронировано';

  @override
  String get availability_property_id => 'ID объекта';

  @override
  String get availability_reservation_id => 'ID бронирования';

  @override
  String get availability_pricing_rule_id => 'ID правила ценообразования';

  @override
  String get availability_total_units => 'Всего единиц';

  @override
  String get availability_available_units => 'Доступные единицы';

  @override
  String get availability_booked_units => 'Забронированные единицы';

  @override
  String get availability_blocked_units => 'Заблокированные единицы';

  @override
  String get availability_base_price => 'Базовая цена';

  @override
  String get availability_current_price => 'Текущая цена';

  @override
  String get availability_special_pricing_json =>
      'Специальное ценообразование (JSON)';

  @override
  String get availability_price_settings_json => 'Настройки цены (JSON)';

  @override
  String get availability_min_nights => 'Минимальное количество ночей';

  @override
  String get availability_max_nights => 'Максимальное количество ночей';

  @override
  String get availability_max_guests => 'Максимальное количество гостей';

  @override
  String get availability_discount_settings_json => 'Настройки скидок (JSON)';

  @override
  String get availability_weekend_rate => 'Тариф выходного дня';

  @override
  String get availability_weekday_rate => 'Тариф буднего дня';

  @override
  String get availability_weekend_multiplier => 'Множитель выходного дня';

  @override
  String get availability_weekday_multiplier => 'Множитель буднего дня';

  @override
  String get availability_seasonal_multiplier => 'Сезонный множитель';

  @override
  String get facilityTypeGym => 'Тренажерный зал';

  @override
  String get facilityTypePool => 'Бассейн';

  @override
  String get facilityTypeParkingLot => 'Парковка';

  @override
  String get facilityTypeLaundry => 'Прачечная';

  @override
  String get facilityTypeElevator => 'Лифт';

  @override
  String get facilityTypeSecurity => 'Охрана';

  @override
  String get facilityTypeOther => 'Другое';

  @override
  String get facilityStatusAvailable => 'Доступно';

  @override
  String get facilityStatusUnavailable => 'Недоступно';

  @override
  String get facilityStatusMaintenance => 'Техническое обслуживание';
}
