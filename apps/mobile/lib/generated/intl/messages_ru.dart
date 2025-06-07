// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a ru locale. All the
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
  String get localeName => 'ru';

  static String m0(count) =>
      "${Intl.plural(count, zero: 'Аккаунты не найдены', one: 'Найден ${count} аккаунт', few: 'Найдено ${count} аккаунта', many: 'Найдено ${count} аккаунтов', other: 'Найдено ${count} аккаунтов')}";

  static String m2(name) => "С возвращением, ${name}!";

  static String m3(name) => "Чат с ${name}";

  static String m5(count) => "Новые арендаторы: ${count}";

  static String m6(rate) => "Уровень заселения: ${rate}";

  static String m7(count) => "Ожидающие платежи: ${count}";

  static String m9(count) => "${count} на этой неделе";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountsFound": m0,
    "agent_activity_title": MessageLookupByLibrary.simpleMessage(
      "Недавняя активность",
    ),
    "agent_address_label": MessageLookupByLibrary.simpleMessage("Адрес"),
    "agent_agency_label": MessageLookupByLibrary.simpleMessage("Агентство"),
    "agent_contact_information_title": MessageLookupByLibrary.simpleMessage(
      "Контактная информация",
    ),
    "agent_created_at_label": MessageLookupByLibrary.simpleMessage(
      "Дата создания",
    ),
    "agent_email_label": MessageLookupByLibrary.simpleMessage(
      "Электронная почта",
    ),
    "agent_is_active_label": MessageLookupByLibrary.simpleMessage("Активен"),
    "agent_last_active_label": MessageLookupByLibrary.simpleMessage(
      "Последняя активность",
    ),
    "agent_phone_label": MessageLookupByLibrary.simpleMessage("Телефон"),
    "agent_professional_information_title":
        MessageLookupByLibrary.simpleMessage("Профессиональная информация"),
    "agent_specialities_label": MessageLookupByLibrary.simpleMessage(
      "Специализации",
    ),
    "agent_status_label": MessageLookupByLibrary.simpleMessage("Статус"),
    "agent_website_label": MessageLookupByLibrary.simpleMessage("Веб-сайт"),
    "amenitiesSectionTitle": MessageLookupByLibrary.simpleMessage("Удобства"),
    "analyticsAgency": MessageLookupByLibrary.simpleMessage("Agency"),
    "analyticsAgencyId": MessageLookupByLibrary.simpleMessage("Agency ID"),
    "analyticsAgent": MessageLookupByLibrary.simpleMessage("Agent"),
    "analyticsAgentId": MessageLookupByLibrary.simpleMessage("Agent ID"),
    "analyticsCreatedAt": MessageLookupByLibrary.simpleMessage("Created At"),
    "analyticsData": MessageLookupByLibrary.simpleMessage("Data"),
    "analyticsDeletedAt": MessageLookupByLibrary.simpleMessage("Deleted At"),
    "analyticsDetailTitle": MessageLookupByLibrary.simpleMessage(
      "Analytics Details",
    ),
    "analyticsEntityId": MessageLookupByLibrary.simpleMessage("Entity ID"),
    "analyticsEntityType": MessageLookupByLibrary.simpleMessage("Entity Type"),
    "analyticsPropertyId": MessageLookupByLibrary.simpleMessage("Property ID"),
    "analyticsReservationId": MessageLookupByLibrary.simpleMessage(
      "Reservation ID",
    ),
    "analyticsTaskId": MessageLookupByLibrary.simpleMessage("Task ID"),
    "analyticsTimestamp": MessageLookupByLibrary.simpleMessage("Timestamp"),
    "analyticsType": MessageLookupByLibrary.simpleMessage("Type"),
    "analyticsTypeAgencyPerformance": MessageLookupByLibrary.simpleMessage(
      "Agency Performance",
    ),
    "analyticsTypeAgentPerformance": MessageLookupByLibrary.simpleMessage(
      "Agent Performance",
    ),
    "analyticsTypeBookingConversion": MessageLookupByLibrary.simpleMessage(
      "Booking Conversion",
    ),
    "analyticsTypeListingView": MessageLookupByLibrary.simpleMessage(
      "Listing View",
    ),
    "analyticsTypePerformance": MessageLookupByLibrary.simpleMessage(
      "Performance",
    ),
    "analyticsTypeRevenue": MessageLookupByLibrary.simpleMessage("Revenue"),
    "analyticsTypeUserEngagement": MessageLookupByLibrary.simpleMessage(
      "User Engagement",
    ),
    "analyticsTypeView": MessageLookupByLibrary.simpleMessage("View"),
    "analyticsUpdatedAt": MessageLookupByLibrary.simpleMessage("Updated At"),
    "analyticsUserId": MessageLookupByLibrary.simpleMessage("User ID"),
    "appTitle": MessageLookupByLibrary.simpleMessage("Менем"),
    "authSignIn": MessageLookupByLibrary.simpleMessage("Войти через Google"),
    "authSignOut": MessageLookupByLibrary.simpleMessage("Выйти"),
    "authWelcomeBack": m2,
    "chatBack": MessageLookupByLibrary.simpleMessage("Назад"),
    "chatBackToList": MessageLookupByLibrary.simpleMessage("Назад к списку"),
    "chatChattingWith": m3,
    "chatConnectWithUsers": MessageLookupByLibrary.simpleMessage(
      "Общайтесь с пользователями и получайте поддержку.",
    ),
    "chatConnectionError": MessageLookupByLibrary.simpleMessage(
      "Не удалось подключиться к серверу чата. Пожалуйста, попробуйте еще раз.",
    ),
    "chatContactSupport": MessageLookupByLibrary.simpleMessage(
      "Связаться с поддержкой",
    ),
    "chatError": MessageLookupByLibrary.simpleMessage("Ошибка"),
    "chatErrorMarkAsRead": MessageLookupByLibrary.simpleMessage(
      "Не удалось отметить сообщения как прочитанные.",
    ),
    "chatErrorSendMessage": MessageLookupByLibrary.simpleMessage(
      "Не удалось отправить сообщение.",
    ),
    "chatErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "Для выполнения этого действия необходимо войти в систему.",
    ),
    "chatMessageSendError": MessageLookupByLibrary.simpleMessage(
      "Не удалось отправить ваше сообщение. Пожалуйста, попробуйте позже.",
    ),
    "chatMessages": MessageLookupByLibrary.simpleMessage("Сообщения"),
    "chatNewMessage": MessageLookupByLibrary.simpleMessage("Новое сообщение"),
    "chatSearchUsers": MessageLookupByLibrary.simpleMessage(
      "Поиск пользователей...",
    ),
    "chatSend": MessageLookupByLibrary.simpleMessage("Отправить"),
    "chatTypeMessage": MessageLookupByLibrary.simpleMessage(
      "Введите сообщение...",
    ),
    "chatWelcomeDescription": MessageLookupByLibrary.simpleMessage(
      "Начните общение с другими пользователями или обратитесь в службу поддержки за помощью.",
    ),
    "chatWelcomeToChat": MessageLookupByLibrary.simpleMessage(
      "Добро пожаловать в чат!",
    ),
    "common_no": MessageLookupByLibrary.simpleMessage("Нет"),
    "common_not_available": MessageLookupByLibrary.simpleMessage("Недоступно"),
    "common_save": MessageLookupByLibrary.simpleMessage("Сохранить"),
    "common_yes": MessageLookupByLibrary.simpleMessage("Да"),
    "contractAgencyIdLabel": MessageLookupByLibrary.simpleMessage(
      "ID агентства",
    ),
    "contractCancelledAtLabel": MessageLookupByLibrary.simpleMessage(
      "Дата отмены",
    ),
    "contractCancelledByLabel": MessageLookupByLibrary.simpleMessage(
      "Отменено",
    ),
    "contractConditionsLabel": MessageLookupByLibrary.simpleMessage(
      "Ограничения:",
    ),
    "contractCreatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Дата создания",
    ),
    "contractCurrencyLabel": MessageLookupByLibrary.simpleMessage("Валюта"),
    "contractDeletedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Дата удаления",
    ),
    "contractDescriptionLabel": MessageLookupByLibrary.simpleMessage(
      "Описание",
    ),
    "contractDetailTitle": MessageLookupByLibrary.simpleMessage(
      "Детали контракта",
    ),
    "contractEndDateLabel": MessageLookupByLibrary.simpleMessage(
      "Дата окончания",
    ),
    "contractIdLabel": MessageLookupByLibrary.simpleMessage("ID"),
    "contractLandlordIdLabel": MessageLookupByLibrary.simpleMessage(
      "ID арендодателя",
    ),
    "contractNameLabel": MessageLookupByLibrary.simpleMessage("Имя"),
    "contractNoticePeriodLabel": MessageLookupByLibrary.simpleMessage(
      "Период уведомления",
    ),
    "contractOwnerIdLabel": MessageLookupByLibrary.simpleMessage(
      "ID владельца",
    ),
    "contractPropertyIdLabel": MessageLookupByLibrary.simpleMessage(
      "ID объекта",
    ),
    "contractRentAmountLabel": MessageLookupByLibrary.simpleMessage(
      "Сумма аренды",
    ),
    "contractSignedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Дата подписи",
    ),
    "contractSignedByLabel": MessageLookupByLibrary.simpleMessage("Подписано"),
    "contractStartDateLabel": MessageLookupByLibrary.simpleMessage(
      "Дата начала",
    ),
    "contractStatusArchived": MessageLookupByLibrary.simpleMessage(
      "Архивирован",
    ),
    "contractStatusDraft": MessageLookupByLibrary.simpleMessage("Черновик"),
    "contractStatusExpired": MessageLookupByLibrary.simpleMessage("Истекший"),
    "contractStatusLabel": MessageLookupByLibrary.simpleMessage("Статус"),
    "contractStatusPending": MessageLookupByLibrary.simpleMessage("В ожидании"),
    "contractStatusRenewed": MessageLookupByLibrary.simpleMessage("Обновлён"),
    "contractStatusTerminated": MessageLookupByLibrary.simpleMessage(
      "Прекращён",
    ),
    "contractTenantIdLabel": MessageLookupByLibrary.simpleMessage(
      "ID арендатора",
    ),
    "contractTerminatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Дата прекращения",
    ),
    "contractTerminatedByLabel": MessageLookupByLibrary.simpleMessage(
      "Прекращено",
    ),
    "contractTermsLabel": MessageLookupByLibrary.simpleMessage("Условия:"),
    "contractTypeCommission": MessageLookupByLibrary.simpleMessage("Комиссия"),
    "contractTypeLabel": MessageLookupByLibrary.simpleMessage("Тип"),
    "contractTypeManagement": MessageLookupByLibrary.simpleMessage(
      "Управление",
    ),
    "contractTypeRental": MessageLookupByLibrary.simpleMessage("Аренда"),
    "contractTypeSale": MessageLookupByLibrary.simpleMessage("Продажа"),
    "contractTypeService": MessageLookupByLibrary.simpleMessage("Сервис"),
    "contractUpdatedAtLabel": MessageLookupByLibrary.simpleMessage(
      "Дата обновления",
    ),
    "dashboard": MessageLookupByLibrary.simpleMessage("Панель управления"),
    "defaultUser": MessageLookupByLibrary.simpleMessage(
      "Пользователь по умолчанию",
    ),
    "edit_agent_tooltip": MessageLookupByLibrary.simpleMessage(
      "Редактировать агента",
    ),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage(
      "Проложить маршрут",
    ),
    "homeLabel": MessageLookupByLibrary.simpleMessage("Главная"),
    "indexDescription": MessageLookupByLibrary.simpleMessage(
      "Ваше решение для управления недвижимостью",
    ),
    "indexPropertyManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Эффективно управляйте своей недвижимостью с помощью нашего комплексного набора инструментов.",
    ),
    "indexPropertyManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Управление недвижимостью",
    ),
    "indexTitle": MessageLookupByLibrary.simpleMessage(
      "Добро пожаловать в Менем",
    ),
    "indexWaterManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Отслеживайте и оптимизируйте потребление воды на ваших объектах.",
    ),
    "indexWaterManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Управление водоснабжением",
    ),
    "listings": MessageLookupByLibrary.simpleMessage("Мои объекты"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage(
      "Местоположение",
    ),
    "loggingout": MessageLookupByLibrary.simpleMessage("Выход..."),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("Выйти"),
    "manageProperties": MessageLookupByLibrary.simpleMessage(
      "Эффективно управляйте своей недвижимостью",
    ),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage(
      "Доставлено",
    ),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("Прочитано"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("Отправлено"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("Сообщения"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage(
      "Ежемесячный денежный поток",
    ),
    "nav_analytics": MessageLookupByLibrary.simpleMessage("Аналитика"),
    "nav_expenses": MessageLookupByLibrary.simpleMessage("Расходы"),
    "nav_facilities": MessageLookupByLibrary.simpleMessage("Удобства"),
    "nav_help": MessageLookupByLibrary.simpleMessage("Помощь"),
    "nav_helpdesk": MessageLookupByLibrary.simpleMessage("Служба поддержки"),
    "nav_home": MessageLookupByLibrary.simpleMessage("Главная"),
    "nav_logout": MessageLookupByLibrary.simpleMessage("Выйти"),
    "nav_messages": MessageLookupByLibrary.simpleMessage("Сообщения"),
    "nav_notifications": MessageLookupByLibrary.simpleMessage("Уведомления"),
    "nav_payments": MessageLookupByLibrary.simpleMessage("Платежи"),
    "nav_profile": MessageLookupByLibrary.simpleMessage("Профиль"),
    "nav_properties": MessageLookupByLibrary.simpleMessage("Объекты"),
    "nav_settings": MessageLookupByLibrary.simpleMessage("Настройки"),
    "nav_subscription": MessageLookupByLibrary.simpleMessage("Подписка"),
    "nav_tasks": MessageLookupByLibrary.simpleMessage("Задачи"),
    "nav_tenants": MessageLookupByLibrary.simpleMessage("Арендаторы"),
    "nav_viewAll": MessageLookupByLibrary.simpleMessage("Смотреть все"),
    "newTenants": m5,
    "noAmenitiesListed": MessageLookupByLibrary.simpleMessage(
      "Удобства не указаны.",
    ),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage("Уведомления"),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage(
      "Уведомлений пока нет.",
    ),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("Платежи"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("Платежи"),
    "pendingPayments": m7,
    "pendingTasks": MessageLookupByLibrary.simpleMessage("Ожидающие задачи"),
    "postsCancel": MessageLookupByLibrary.simpleMessage("Отмена"),
    "postsContent": MessageLookupByLibrary.simpleMessage("Содержимое"),
    "postsCreate": MessageLookupByLibrary.simpleMessage("Создать запись"),
    "postsDelete": MessageLookupByLibrary.simpleMessage("Удалить"),
    "postsEdit": MessageLookupByLibrary.simpleMessage("Редактировать"),
    "postsErrorCreatePost": MessageLookupByLibrary.simpleMessage(
      "Не удалось создать запись.",
    ),
    "postsErrorDeletePost": MessageLookupByLibrary.simpleMessage(
      "Не удалось удалить запись.",
    ),
    "postsErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "Для выполнения этого действия необходимо войти в систему.",
    ),
    "postsErrorUpdatePost": MessageLookupByLibrary.simpleMessage(
      "Не удалось обновить запись.",
    ),
    "postsLoading": MessageLookupByLibrary.simpleMessage("Загрузка записей..."),
    "postsNoPostsYet": MessageLookupByLibrary.simpleMessage("Записей пока нет"),
    "postsSave": MessageLookupByLibrary.simpleMessage("Сохранить"),
    "postsTitle": MessageLookupByLibrary.simpleMessage("Заголовок"),
    "profileLabel": MessageLookupByLibrary.simpleMessage("Профиль"),
    "properties": MessageLookupByLibrary.simpleMessage("Недвижимость"),
    "quickAccess": MessageLookupByLibrary.simpleMessage("Быстрый доступ"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("Настройки"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("RentalProc"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage(
      "Сводная статистика",
    ),
    "tasks": MessageLookupByLibrary.simpleMessage("Задачи"),
    "tasksThisWeek": m9,
    "tenants": MessageLookupByLibrary.simpleMessage("Арендаторы"),
    "totalProperties": MessageLookupByLibrary.simpleMessage("Всего объектов"),
    "totalTenants": MessageLookupByLibrary.simpleMessage("Всего арендаторов"),
    "unknownTime": MessageLookupByLibrary.simpleMessage("Неизвестное время"),
  };
}
