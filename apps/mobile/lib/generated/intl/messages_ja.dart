// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a ja locale. All the
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
  String get localeName => 'ja';

  static String m0(count) =>
      "${Intl.plural(count, zero: 'アカウントは見つかりませんでした', one: '1件のアカウントが見つかりました', other: '${count}件のアカウントが見つかりました')}";

  static String m2(name) => "おかえりなさい、${name}さん";

  static String m3(name) => "${name}とチャット中";

  static String m5(count) => "新規テナント: ${count}";

  static String m6(rate) => "稼働率: ${rate}";

  static String m7(count) => "未払い: ${count}";

  static String m9(count) => "今週${count}";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountsFound": m0,
    "agent_activity_title": MessageLookupByLibrary.simpleMessage("最近のアクティビティ"),
    "agent_address_label": MessageLookupByLibrary.simpleMessage("住所"),
    "agent_agency_label": MessageLookupByLibrary.simpleMessage("エージェンシー"),
    "agent_contact_information_title": MessageLookupByLibrary.simpleMessage(
      "連絡先情報",
    ),
    "agent_created_at_label": MessageLookupByLibrary.simpleMessage("作成日"),
    "agent_email_label": MessageLookupByLibrary.simpleMessage("メールアドレス"),
    "agent_is_active_label": MessageLookupByLibrary.simpleMessage("アクティブ"),
    "agent_last_active_label": MessageLookupByLibrary.simpleMessage("最終アクティブ"),
    "agent_phone_label": MessageLookupByLibrary.simpleMessage("電話番号"),
    "agent_professional_information_title":
        MessageLookupByLibrary.simpleMessage("専門情報"),
    "agent_specialities_label": MessageLookupByLibrary.simpleMessage("専門分野"),
    "agent_status_label": MessageLookupByLibrary.simpleMessage("ステータス"),
    "agent_website_label": MessageLookupByLibrary.simpleMessage("ウェブサイト"),
    "amenitiesSectionTitle": MessageLookupByLibrary.simpleMessage("設備"),
    "appTitle": MessageLookupByLibrary.simpleMessage("Menem"),
    "authSignIn": MessageLookupByLibrary.simpleMessage("Googleでサインイン"),
    "authSignOut": MessageLookupByLibrary.simpleMessage("サインアウト"),
    "authWelcomeBack": m2,
    "chatBack": MessageLookupByLibrary.simpleMessage("戻る"),
    "chatBackToList": MessageLookupByLibrary.simpleMessage("リストに戻る"),
    "chatChattingWith": m3,
    "chatConnectWithUsers": MessageLookupByLibrary.simpleMessage(
      "ユーザーとつながり、サポートを受ける",
    ),
    "chatConnectionError": MessageLookupByLibrary.simpleMessage(
      "チャットサーバーへの接続に失敗しました。もう一度お試しください。",
    ),
    "chatContactSupport": MessageLookupByLibrary.simpleMessage("サポートに連絡"),
    "chatError": MessageLookupByLibrary.simpleMessage("エラー"),
    "chatErrorMarkAsRead": MessageLookupByLibrary.simpleMessage(
      "メッセージを既読にできませんでした",
    ),
    "chatErrorSendMessage": MessageLookupByLibrary.simpleMessage(
      "メッセージの送信に失敗しました",
    ),
    "chatErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "このアクションを実行するにはログインする必要があります",
    ),
    "chatMessageSendError": MessageLookupByLibrary.simpleMessage(
      "メッセージの送信に失敗しました。後でもう一度お試しください。",
    ),
    "chatMessages": MessageLookupByLibrary.simpleMessage("メッセージ"),
    "chatNewMessage": MessageLookupByLibrary.simpleMessage("新しいメッセージ"),
    "chatSearchUsers": MessageLookupByLibrary.simpleMessage("ユーザーを検索..."),
    "chatSend": MessageLookupByLibrary.simpleMessage("送信"),
    "chatTypeMessage": MessageLookupByLibrary.simpleMessage("メッセージを入力..."),
    "chatWelcomeDescription": MessageLookupByLibrary.simpleMessage(
      "他のユーザーと会話を開始するか、サポートに連絡して支援を受けてください",
    ),
    "chatWelcomeToChat": MessageLookupByLibrary.simpleMessage("チャットへようこそ"),
    "common_no": MessageLookupByLibrary.simpleMessage("いいえ"),
    "common_not_available": MessageLookupByLibrary.simpleMessage("利用不可"),
    "common_save": MessageLookupByLibrary.simpleMessage("保存"),
    "common_yes": MessageLookupByLibrary.simpleMessage("はい"),
    "contractAgencyIdLabel": MessageLookupByLibrary.simpleMessage("代理店ID"),
    "contractCancelledAtLabel": MessageLookupByLibrary.simpleMessage("キャンセル日"),
    "contractCancelledByLabel": MessageLookupByLibrary.simpleMessage("キャンセル者"),
    "contractConditionsLabel": MessageLookupByLibrary.simpleMessage("条件:"),
    "contractCreatedAtLabel": MessageLookupByLibrary.simpleMessage("作成日"),
    "contractCurrencyLabel": MessageLookupByLibrary.simpleMessage("通貨"),
    "contractDeletedAtLabel": MessageLookupByLibrary.simpleMessage("削除日"),
    "contractDescriptionLabel": MessageLookupByLibrary.simpleMessage("説明"),
    "contractDetailTitle": MessageLookupByLibrary.simpleMessage("契約の詳細"),
    "contractEndDateLabel": MessageLookupByLibrary.simpleMessage("終了日"),
    "contractIdLabel": MessageLookupByLibrary.simpleMessage("ID"),
    "contractLandlordIdLabel": MessageLookupByLibrary.simpleMessage("家主ID"),
    "contractNameLabel": MessageLookupByLibrary.simpleMessage("名前"),
    "contractNoticePeriodLabel": MessageLookupByLibrary.simpleMessage("通知期間"),
    "contractOwnerIdLabel": MessageLookupByLibrary.simpleMessage("オーナーID"),
    "contractPropertyIdLabel": MessageLookupByLibrary.simpleMessage("物件ID"),
    "contractRentAmountLabel": MessageLookupByLibrary.simpleMessage("家賃額"),
    "contractSignedAtLabel": MessageLookupByLibrary.simpleMessage("署名日"),
    "contractSignedByLabel": MessageLookupByLibrary.simpleMessage("署名者"),
    "contractStartDateLabel": MessageLookupByLibrary.simpleMessage("開始日"),
    "contractStatusArchived": MessageLookupByLibrary.simpleMessage("アーカイブ済み"),
    "contractStatusDraft": MessageLookupByLibrary.simpleMessage("下書き"),
    "contractStatusExpired": MessageLookupByLibrary.simpleMessage("期限切れ"),
    "contractStatusLabel": MessageLookupByLibrary.simpleMessage("ステータス"),
    "contractStatusPending": MessageLookupByLibrary.simpleMessage("保留中"),
    "contractStatusRenewed": MessageLookupByLibrary.simpleMessage("更新済み"),
    "contractStatusTerminated": MessageLookupByLibrary.simpleMessage("終了"),
    "contractTenantIdLabel": MessageLookupByLibrary.simpleMessage("入居者ID"),
    "contractTerminatedAtLabel": MessageLookupByLibrary.simpleMessage("終了日"),
    "contractTerminatedByLabel": MessageLookupByLibrary.simpleMessage("終了者"),
    "contractTermsLabel": MessageLookupByLibrary.simpleMessage("契約条件:"),
    "contractTypeCommission": MessageLookupByLibrary.simpleMessage("手数料"),
    "contractTypeLabel": MessageLookupByLibrary.simpleMessage("タイプ"),
    "contractTypeManagement": MessageLookupByLibrary.simpleMessage("管理"),
    "contractTypeRental": MessageLookupByLibrary.simpleMessage("賃貸"),
    "contractTypeSale": MessageLookupByLibrary.simpleMessage("売買"),
    "contractTypeService": MessageLookupByLibrary.simpleMessage("サービス"),
    "contractUpdatedAtLabel": MessageLookupByLibrary.simpleMessage("更新日"),
    "dashboard": MessageLookupByLibrary.simpleMessage("ダッシュボード"),
    "defaultUser": MessageLookupByLibrary.simpleMessage("デフォルトユーザー"),
    "edit_agent_tooltip": MessageLookupByLibrary.simpleMessage("エージェントを編集"),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage("道順を取得"),
    "homeLabel": MessageLookupByLibrary.simpleMessage("ホーム"),
    "indexDescription": MessageLookupByLibrary.simpleMessage("あなたの物件管理ソリューション"),
    "indexPropertyManagementDescription": MessageLookupByLibrary.simpleMessage(
      "包括的なツールスイートで物件を効率的に管理します。",
    ),
    "indexPropertyManagementTitle": MessageLookupByLibrary.simpleMessage(
      "物件管理",
    ),
    "indexTitle": MessageLookupByLibrary.simpleMessage("Menemへようこそ"),
    "indexWaterManagementDescription": MessageLookupByLibrary.simpleMessage(
      "物件全体の水の使用量を追跡および最適化します。",
    ),
    "indexWaterManagementTitle": MessageLookupByLibrary.simpleMessage("水管理"),
    "listings": MessageLookupByLibrary.simpleMessage("マイ物件"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage("場所"),
    "loggingout": MessageLookupByLibrary.simpleMessage("ログアウト中..."),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("ログアウト"),
    "manageProperties": MessageLookupByLibrary.simpleMessage("物件を効率的に管理する"),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage("配信済み"),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("既読"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("送信済み"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("メッセージ"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage("月間キャッシュフロー"),
    "nav_analytics": MessageLookupByLibrary.simpleMessage("分析"),
    "nav_expenses": MessageLookupByLibrary.simpleMessage("費用"),
    "nav_facilities": MessageLookupByLibrary.simpleMessage("設備"),
    "nav_help": MessageLookupByLibrary.simpleMessage("ヘルプ"),
    "nav_helpdesk": MessageLookupByLibrary.simpleMessage("ヘルプデスク"),
    "nav_home": MessageLookupByLibrary.simpleMessage("ホーム"),
    "nav_logout": MessageLookupByLibrary.simpleMessage("ログアウト"),
    "nav_messages": MessageLookupByLibrary.simpleMessage("メッセージ"),
    "nav_notifications": MessageLookupByLibrary.simpleMessage("通知"),
    "nav_payments": MessageLookupByLibrary.simpleMessage("支払い"),
    "nav_profile": MessageLookupByLibrary.simpleMessage("プロフィール"),
    "nav_properties": MessageLookupByLibrary.simpleMessage("物件"),
    "nav_settings": MessageLookupByLibrary.simpleMessage("設定"),
    "nav_subscription": MessageLookupByLibrary.simpleMessage("サブスクリプション"),
    "nav_tasks": MessageLookupByLibrary.simpleMessage("タスク"),
    "nav_tenants": MessageLookupByLibrary.simpleMessage("テナント"),
    "nav_viewAll": MessageLookupByLibrary.simpleMessage("すべて表示"),
    "newTenants": m5,
    "noAmenitiesListed": MessageLookupByLibrary.simpleMessage("設備はリストされていません"),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage("通知"),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage(
      "まだ通知はありません",
    ),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("支払い"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("支払い"),
    "pendingPayments": m7,
    "pendingTasks": MessageLookupByLibrary.simpleMessage("未処理タスク"),
    "postsCancel": MessageLookupByLibrary.simpleMessage("キャンセル"),
    "postsContent": MessageLookupByLibrary.simpleMessage("コンテンツ"),
    "postsCreate": MessageLookupByLibrary.simpleMessage("投稿を作成"),
    "postsDelete": MessageLookupByLibrary.simpleMessage("削除"),
    "postsEdit": MessageLookupByLibrary.simpleMessage("編集"),
    "postsErrorCreatePost": MessageLookupByLibrary.simpleMessage(
      "投稿の作成に失敗しました",
    ),
    "postsErrorDeletePost": MessageLookupByLibrary.simpleMessage(
      "投稿の削除に失敗しました",
    ),
    "postsErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "このアクションを実行するにはログインする必要があります",
    ),
    "postsErrorUpdatePost": MessageLookupByLibrary.simpleMessage(
      "投稿の更新に失敗しました",
    ),
    "postsLoading": MessageLookupByLibrary.simpleMessage("投稿を読み込み中..."),
    "postsNoPostsYet": MessageLookupByLibrary.simpleMessage("まだ投稿はありません"),
    "postsSave": MessageLookupByLibrary.simpleMessage("保存"),
    "postsTitle": MessageLookupByLibrary.simpleMessage("タイトル"),
    "profileLabel": MessageLookupByLibrary.simpleMessage("プロフィール"),
    "properties": MessageLookupByLibrary.simpleMessage("物件"),
    "quickAccess": MessageLookupByLibrary.simpleMessage("クイックアクセス"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("設定"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("RentalProc"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage("概要統計"),
    "tasks": MessageLookupByLibrary.simpleMessage("タスク"),
    "tasksThisWeek": m9,
    "tenants": MessageLookupByLibrary.simpleMessage("テナント"),
    "totalProperties": MessageLookupByLibrary.simpleMessage("総物件数"),
    "totalTenants": MessageLookupByLibrary.simpleMessage("総テナント数"),
    "unknownTime": MessageLookupByLibrary.simpleMessage("不明な時間"),
  };
}
