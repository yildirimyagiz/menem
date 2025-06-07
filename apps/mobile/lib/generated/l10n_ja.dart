// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for Japanese (`ja`).
class AppLocalizationsJa extends AppLocalizations {
  AppLocalizationsJa([String locale = 'ja']) : super(locale);

  @override
  String get appTitle => 'Menem';

  @override
  String get dashboard => 'ダッシュボード';

  @override
  String get manageProperties => '物件を管理';

  @override
  String get quickAccess => 'クイックアクセス';

  @override
  String get properties => '物件';

  @override
  String get tenants => 'テナント';

  @override
  String get payments => '支払い';

  @override
  String get tasks => 'タスク';

  @override
  String get summaryStatistics => '概要統計';

  @override
  String get totalProperties => '総物件数';

  @override
  String occupancyRate(Object rate) {
    return '稼働率: $rate';
  }

  @override
  String get monthlyCashflow => '月次キャッシュフロー';

  @override
  String pendingPayments(Object count) {
    return '保留中の支払い: $count';
  }

  @override
  String get pendingTasks => '保留中のタスク';

  @override
  String tasksThisWeek(Object count) {
    return '今週 $count 件';
  }

  @override
  String get propertyDetailTitle => '物件詳細';

  @override
  String get propertyDetailOverviewTab => '概要';

  @override
  String get propertyDetailFeaturesTab => '特徴';

  @override
  String get propertyDetailLocationTab => '場所';

  @override
  String get propertyDetailGalleryTab => 'ギャラリー';

  @override
  String get propertyDetailId => 'ID';

  @override
  String get propertyDetailNumber => '物件番号';

  @override
  String get propertyDetailTitleField => 'タイトル';

  @override
  String get propertyDetailDescription => '説明';

  @override
  String get propertyDetailType => 'タイプ';

  @override
  String get propertyDetailStatus => 'ステータス';

  @override
  String get propertyDetailCategory => 'カテゴリ';

  @override
  String get propertyDetailCondition => '状態';

  @override
  String get propertyDetailMarketValue => '市場価値';

  @override
  String get propertyDetailBedrooms => 'ベッドルーム';

  @override
  String get propertyDetailBathrooms => 'バスルーム';

  @override
  String get propertyDetailYearBuilt => '築年数';

  @override
  String get propertyDetailFeatures => '特徴';

  @override
  String get propertyDetailAmenities => '設備';

  @override
  String get propertyDetailAddress => '住所';

  @override
  String get propertyDetailCity => '市';

  @override
  String get propertyDetailState => '州/都道府県';

  @override
  String get propertyDetailCountry => '国';

  @override
  String get propertyDetailZipCode => '郵便番号';

  @override
  String get propertyDetailCoordinates => '座標';

  @override
  String get propertyDetailNoFeatures => '特徴や設備はありません';

  @override
  String get propertyDetailNoLocation => '場所情報はありません';

  @override
  String get propertyDetailGalleryPlaceholder => 'ギャラリービュー（画像のGridViewで実装）';

  @override
  String get propertyDetailDeleteConfirm => 'この物件を削除してもよろしいですか？';

  @override
  String get propertyDetailDeleteSuccess => '物件は正常に削除されました';

  @override
  String propertyDetailDeleteFailed(Object error) {
    return '物件の削除に失敗しました: $error';
  }

  @override
  String get propertyDetailContactAgent => 'エージェントに連絡';

  @override
  String get propertyDetailPrice => '価格';

  @override
  String get propertyDetailLoading => '物件詳細を読み込み中...';

  @override
  String get propertyDetailNotFound => '物件が見つかりません。';

  @override
  String get totalTenants => '総テナント数';

  @override
  String newTenants(Object count) {
    return '新規テナント: $count';
  }

  @override
  String get homeLabel => 'ホーム';

  @override
  String get favoritesEmpty => 'まだお気に入りはありません';

  @override
  String get favoritesError => 'お気に入りの読み込み中にエラーが発生しました';

  @override
  String get favoritesRetry => '再試行';

  @override
  String get emptyStateRetry => '再試行';

  @override
  String get listings => '私の物件';

  @override
  String get listingsEmpty => 'まだリスティングはありません';

  @override
  String get listingsRetry => '再試行';

  @override
  String get filterPropertiesTitle => '物件を絞り込む';

  @override
  String get filterPropertiesApply => '適用';

  @override
  String get filterPropertiesCancel => 'キャンセル';

  @override
  String get messagesLabel => 'メッセージ';

  @override
  String get notificationsLabel => '通知';

  @override
  String get notificationsEmpty => 'まだ通知はありません';

  @override
  String get paymentsLabel => '支払い';

  @override
  String get settingsLabel => '設定';

  @override
  String get settingsAppearance => '外観';

  @override
  String get settingsDarkMode => 'ダークモード';

  @override
  String get filterTasksTitle => 'タスクを絞り込む';

  @override
  String get filterTasksStatus => 'ステータス';

  @override
  String get filterTasksPriority => '優先度';

  @override
  String get filterTasksType => 'タイプ';

  @override
  String get filterTasksDueDate => '期日';

  @override
  String get filterTasksApply => '適用';

  @override
  String get filterTasksCancel => 'キャンセル';

  @override
  String get profileLabel => 'プロフィール';

  @override
  String get logoutLabel => 'ログアウト';

  @override
  String get loggingout => 'ログアウト中...';

  @override
  String get sitetitle => 'RentalProc';

  @override
  String get nav_home => 'ホーム';

  @override
  String get nav_properties => '物件';

  @override
  String get nav_payments => '支払い';

  @override
  String get nav_tasks => 'タスク';

  @override
  String get nav_messages => 'メッセージ';

  @override
  String get nav_notifications => '通知';

  @override
  String get nav_helpdesk => 'ヘルプデスク';

  @override
  String get nav_subscription => 'サブスクリプション';

  @override
  String get nav_settings => '設定';

  @override
  String get nav_tenants => 'テナント';

  @override
  String get nav_expenses => '経費';

  @override
  String get nav_facilities => '施設';

  @override
  String get nav_analytics => 'アナリティクス';

  @override
  String get nav_help => 'ヘルプ';

  @override
  String get nav_logout => 'ログアウト';

  @override
  String get nav_profile => 'プロフィール';

  @override
  String get nav_viewAll => 'すべて表示';

  @override
  String get indexTitle => 'Menemへようこそ';

  @override
  String get indexDescription => 'あなたの物件管理ソリューション';

  @override
  String get indexPropertyManagementTitle => '物件管理';

  @override
  String get indexPropertyManagementDescription => '包括的なツールスイートで物件を効率的に管理します。';

  @override
  String get indexWaterManagementTitle => '水管理';

  @override
  String get indexWaterManagementDescription => '物件全体の水の使用状況を追跡し、最適化します。';

  @override
  String get authSignIn => 'Googleでサインイン';

  @override
  String get authSignOut => 'サインアウト';

  @override
  String get createPropertyTitle => '新規物件作成';

  @override
  String get propertyCreatedSuccess => '物件が正常に作成されました';

  @override
  String get propertyCreatedError => '物件の作成に失敗しました';

  @override
  String get registerAlreadyHaveAccount => 'すでにアカウントをお持ちですか？ログイン';

  @override
  String get registerForgotPassword => 'パスワードをお忘れですか？';

  @override
  String get propertyViewingEventsTitle => '内覧イベント';

  @override
  String get propertyViewingSchedule => '内覧を予約';

  @override
  String authWelcomeBack(Object name) {
    return 'おかえりなさい、$nameさん';
  }

  @override
  String get postsCreate => '投稿を作成';

  @override
  String get postsTitle => 'タイトル';

  @override
  String get postsContent => '内容';

  @override
  String get postsLoading => '投稿を読み込み中...';

  @override
  String get postsSave => '保存';

  @override
  String get postsCancel => 'キャンセル';

  @override
  String get postsEdit => '編集';

  @override
  String get postsDelete => '削除';

  @override
  String get postsNoPostsYet => 'まだ投稿はありません';

  @override
  String get postsErrorUnauthorized => 'この操作を行うにはログインする必要があります';

  @override
  String get postsErrorCreatePost => '投稿の作成に失敗しました';

  @override
  String get postsErrorUpdatePost => '投稿の更新に失敗しました';

  @override
  String get postsErrorDeletePost => '投稿の削除に失敗しました';

  @override
  String get chatMessages => 'メッセージ';

  @override
  String chatChattingWith(Object name) {
    return '$nameとチャット中';
  }

  @override
  String get chatConnectWithUsers => 'ユーザーとつながり、サポートを受ける';

  @override
  String get chatBackToList => 'リストに戻る';

  @override
  String get chatWelcomeToChat => 'チャットへようこそ';

  @override
  String get chatWelcomeDescription => '他のユーザーと会話を開始するか、サポートに連絡して支援を受けてください';

  @override
  String get chatNewMessage => '新しいメッセージ';

  @override
  String get chatContactSupport => 'サポートに連絡';

  @override
  String get chatBack => '戻る';

  @override
  String get chatSearchUsers => 'ユーザーを検索...';

  @override
  String get chatTypeMessage => 'メッセージを入力...';

  @override
  String get chatSend => '送信';

  @override
  String get chatErrorUnauthorized => 'この操作を行うにはログインする必要があります';

  @override
  String get chatErrorSendMessage => 'メッセージの送信に失敗しました';

  @override
  String get chatErrorMarkAsRead => 'メッセージを既読としてマークできませんでした';

  @override
  String get chatError => 'エラー';

  @override
  String get chatConnectionError => 'チャットサーバーへの接続に失敗しました。もう一度お試しください。';

  @override
  String get chatMessageSendError => 'メッセージの送信に失敗しました。後でもう一度お試しください。';

  @override
  String get notifications_placeholder => 'まだ通知はありません';

  @override
  String get notificationsPlaceholder => 'まだ通知はありません';

  @override
  String commonTimeAgo(Object time) {
    return '$time前';
  }

  @override
  String get commonSuccess => '成功';

  @override
  String get commonError => 'エラー';

  @override
  String propertiesFound(Object count) {
    return '$count件の物件が見つかりました';
  }

  @override
  String get errorScreenTitle => 'エラー';

  @override
  String get errorScreenGoBack => '戻る';

  @override
  String get dateRangeSelectTitle => '日付範囲を選択';

  @override
  String get dateRangeSelectApply => '適用';

  @override
  String get dateRangeSelectCancel => 'キャンセル';

  @override
  String get commonWarning => '警告';

  @override
  String get commonInfo => '情報';

  @override
  String get commonLoading => '読み込み中...';

  @override
  String get commonSave => '保存';

  @override
  String get commonCancel => 'キャンセル';

  @override
  String get commonDelete => '削除';

  @override
  String get commonEdit => '編集';

  @override
  String get commonCreate => '作成';

  @override
  String get commonView => '表示';

  @override
  String get commonPrevious => '前へ';

  @override
  String get commonNext => '次へ';

  @override
  String get commonBack => '戻る';

  @override
  String get commonConfirm => '確認';

  @override
  String get commonActions => 'アクション';

  @override
  String get commonSearch => '検索';

  @override
  String get commonFilter => 'フィルター';

  @override
  String get commonSort => '並べ替え';

  @override
  String get commonNoData => 'データがありません';

  @override
  String get editAgentTooltip => 'エージェントを編集';

  @override
  String get agentContactInformationTitle => '連絡先情報';

  @override
  String get agentEmailLabel => 'メールアドレス';

  @override
  String get agentPhoneLabel => '電話番号';

  @override
  String get agentAddressLabel => '住所';

  @override
  String get agentWebsiteLabel => 'ウェブサイト';

  @override
  String get agentProfessionalInformationTitle => '専門情報';

  @override
  String get agentStatusLabel => 'ステータス';

  @override
  String get agentAgencyLabel => '代理店';

  @override
  String get agentSpecialitiesLabel => '専門分野';

  @override
  String get agentActivityTitle => '最近のアクティビティ';

  @override
  String get agentLastActiveLabel => '最終アクティブ日時';

  @override
  String get agentIsActiveLabel => 'アクティブ';

  @override
  String get agentCreatedAtLabel => '作成日時';

  @override
  String get agentAdditionalInformationTitle => '追加情報';

  @override
  String get agentBioLabel => '経歴';

  @override
  String get agentExternalIdLabel => '外部ID';

  @override
  String get agentSettingsLabel => '設定';

  @override
  String get agentIntegrationLabel => '統合';

  @override
  String get agentOwnerIdLabel => '所有者ID';

  @override
  String get agentAgencyIdLabel => '代理店ID';

  @override
  String get agentDeletedAtLabel => '削除日時';

  @override
  String get amenitiesSectionTitle => '設備';

  @override
  String get noAmenitiesListed => '設備は記載されていません';

  @override
  String get locationSectionTitle => '場所';

  @override
  String get getDirectionsButton => '道順を取得';

  @override
  String get messageStatusRead => '既読';

  @override
  String get messageStatusDelivered => '配信済み';

  @override
  String get messageStatusSent => '送信済み';

  @override
  String get defaultUser => 'デフォルトユーザー';

  @override
  String get unknownTime => '不明な時間';

  @override
  String get commonNotAvailable => '利用不可';

  @override
  String accountsFound(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countアカウントが見つかりました',
      one: '1アカウントが見つかりました',
      zero: 'アカウントが見つかりません',
    );
    return '$_temp0';
  }

  @override
  String get actionCardProperties => '物件';

  @override
  String get actionCardTenants => 'テナント';

  @override
  String get actionCardAnalytics => 'アナリティクス';

  @override
  String get actionCardPayments => '支払い';

  @override
  String get actionCardTasks => 'タスク';

  @override
  String get actionCardMessages => 'メッセージ';

  @override
  String get actionCardHelpDesk => 'ヘルプデスク';

  @override
  String get actionCardManageYourPropertyPortfolio => '物件ポートフォリオを管理';

  @override
  String get actionCardManageTenantInformation => 'テナント情報を管理';

  @override
  String get actionCardViewReportsAndAnalytics => 'レポートと分析を表示';

  @override
  String get actionCardTrackFinancialRecords => '財務記録を追跡';

  @override
  String get actionCardManageMaintenanceTasks => 'メンテナンスタスクを管理';

  @override
  String get actionCardCommunicateWithTenants => 'テナントと連絡';

  @override
  String get actionCardGetAssistanceWhenNeeded => '必要なときに支援を受ける';

  @override
  String get actionCardAddProperty => '物件を追加';

  @override
  String get actionCardCreateANewPropertyListing => '新しい物件リスティングを作成';

  @override
  String get actionCardAddTenant => 'テナントを追加';

  @override
  String get actionCardRegisterANewTenant => '新しいテナントを登録';

  @override
  String get actionCardRecordPayment => '支払いを記録';

  @override
  String get actionCardRecordARentPayment => '家賃の支払いを記録';

  @override
  String get actionCardAddTask => 'タスクを追加';

  @override
  String get actionCardCreateAMaintenanceTask => 'メンテナンスタスクを作成';

  @override
  String get actionCardScheduleEvent => 'イベントをスケジュール';

  @override
  String get actionCardCreateAPropertyEvent => '物件イベントを作成';

  @override
  String get actionCardComposeMessage => 'メッセージを作成';

  @override
  String get actionCardSendAMessageToTenants => 'テナントにメッセージを送信';

  @override
  String get actionCardCreateDocument => 'ドキュメントを作成';

  @override
  String get actionCardGenerateANewDocument => '新しいドキュメントを生成';

  @override
  String get actionCardGetStarted => '開始';

  @override
  String get actionCardNewThisMonth => '今月の新着';

  @override
  String get tenantsTitle => 'テナント';

  @override
  String get tenantsDescription => '物件全体のテナント情報とリースを管理します';

  @override
  String get tenantsAddTenant => 'テナントを追加';

  @override
  String get tenantsPropertyFilter => '物件';

  @override
  String get tenantsAllProperties => 'すべての物件';

  @override
  String get tenantsPaymentStatusFilter => '支払いステータス';

  @override
  String get tenantsAllStatuses => 'すべてのステータス';

  @override
  String get tenantsTenantColumn => 'テナント';

  @override
  String get tenantsStatusColumn => 'ステータス';

  @override
  String get tenantsPropertyUnitColumn => '物件/ユニット';

  @override
  String get tenantsContactColumn => '連絡先';

  @override
  String get tenantsLeasePeriodColumn => 'リース期間';

  @override
  String get tenantsActionsColumn => 'アクション';

  @override
  String get tenantsIdLabel => 'ID';

  @override
  String get tenantsNotAssigned => '未割り当て';

  @override
  String get tenantsNotAvailable => 'N/A';

  @override
  String get tenantsLeaseFrom => 'から';

  @override
  String get tenantsLeaseTo => 'まで';

  @override
  String get tenantsViewDetails => '詳細を表示';

  @override
  String get tenantsEdit => '編集';

  @override
  String get tenantsDelete => '削除';

  @override
  String get tenantsNoTenantsFound => 'テナントが見つかりません';

  @override
  String get tenantsGetStartedAddTenant => '新しいテナントを追加して開始します';

  @override
  String get tenantsConfirmDeletionTitle => '削除の確認';

  @override
  String tenantsConfirmDeletionDesc(Object tenant) {
    return 'テナント$tenantを削除してもよろしいですか？この操作は元に戻せません。';
  }

  @override
  String get tenantsCancel => 'キャンセル';

  @override
  String get tenantsDeleting => '削除中...';

  @override
  String get tenantsPrevious => '前へ';

  @override
  String get tenantsNext => '次へ';

  @override
  String get tenantsStatusUnpaid => '未払い';

  @override
  String get tenantsStatusPartiallyPaid => '一部支払い済み';

  @override
  String get tenantsStatusPaid => '支払い済み';

  @override
  String get tenantsStatusRefunded => '返金済み';

  @override
  String get tenantsStatusOverdue => '期限切れ';

  @override
  String get tenantsStatusCancelled => 'キャンセル済み';

  @override
  String get agenciesTitle => '代理店';

  @override
  String get agenciesDescription => '代理店とその設定を管理します。';

  @override
  String get agenciesSearch => '代理店を検索...';

  @override
  String get agenciesStatus => 'ステータス';

  @override
  String get agenciesStatusValuesPending => '保留中';

  @override
  String get agenciesStatusValuesVerified => '確認済み';

  @override
  String get agenciesStatusValuesRejected => '拒否済み';

  @override
  String get agenciesAdd => '代理店を追加';

  @override
  String get agenciesEdit => '編集';

  @override
  String get agenciesDelete => '削除';

  @override
  String agenciesConfirmDeleteDesc(Object name) {
    return '$nameを削除してもよろしいですか？この操作は元に戻せません。';
  }

  @override
  String get agenciesDeletedMsg => '代理店は正常に削除されました。';

  @override
  String get agenciesNone => '検索に一致する代理店はありません。別のフィルターをお試しください。';

  @override
  String get agenciesNa => 'N/A';

  @override
  String get agenciesAgents => 'エージェント';

  @override
  String get agenciesView => '表示';

  @override
  String get agenciesName => '代理店名';

  @override
  String get agenciesEmail => 'メールアドレス';

  @override
  String get agenciesPhoneNumber => '電話番号';

  @override
  String get agenciesAddress => '住所';

  @override
  String get agenciesWebsite => 'ウェブサイト';

  @override
  String get agenciesLogoUrl => 'ロゴURL';

  @override
  String get agenciesCreated => '作成日時';

  @override
  String get agenciesUpdated => '更新日時';

  @override
  String get agenciesProperties => '物件';

  @override
  String get agenciesActions => 'アクション';

  @override
  String get agenciesCancel => 'キャンセル';

  @override
  String get agenciesDeleting => '削除中...';

  @override
  String get agenciesCreating => '作成中...';

  @override
  String get agenciesSaving => '保存中...';

  @override
  String get agenciesSave => '保存';

  @override
  String get agenciesCreate => '作成';

  @override
  String get agenciesGetStarted => '新しい代理店を追加して開始します';

  @override
  String get agenciesRequired => 'このフィールドは必須です。';

  @override
  String get agenciesInvalidEmail => '無効なメールアドレスです。';

  @override
  String get agenciesInvalidUrl => '無効なURLです。';

  @override
  String get agenciesUpdatedMsg => '更新しました！';

  @override
  String get agenciesCreatedMsg => '作成しました！';

  @override
  String get agenciesErrorLoad => '詳細の読み込みに失敗しました。';

  @override
  String get agenciesErrorCreate => '作成に失敗しました。';

  @override
  String get agenciesErrorUpdate => '更新に失敗しました。';

  @override
  String get agenciesErrorDelete => '削除に失敗しました。';

  @override
  String get loginPageTitle => 'サインイン';

  @override
  String get loginPageEmail => 'メールアドレス';

  @override
  String get loginPagePassword => 'パスワード';

  @override
  String get loginPageRememberMe => '記憶する';

  @override
  String get loginPageForgotPassword => 'パスワードをお忘れですか？';

  @override
  String get loginPageSignIn => 'サインイン';

  @override
  String get loginPageOrContinueWith => 'または以下で続行';

  @override
  String get loginPageDontHaveAccount => 'アカウントをお持ちではありませんか？';

  @override
  String get loginPageSignUp => 'サインアップ';

  @override
  String get loginPageErrorInvalidCredentials => '無効なメールアドレスまたはパスワードです';

  @override
  String get loginPageErrorSomethingWentWrong => '問題が発生しました。もう一度お試しください。';

  @override
  String get loginPageErrorSessionExpired =>
      'セッションの有効期限が切れました。もう一度サインインしてください。';

  @override
  String get authErrorTitle => '認証エラー';

  @override
  String get authErrorSomethingWentWrong => '認証中に問題が発生しました。もう一度お試しください。';

  @override
  String get authErrorOauthAccountNotLinked =>
      'このメールアドレスのアカウントは既に存在します。元の認証方法でサインインしてください。';

  @override
  String get authErrorOauthCallbackError => 'OAuthコールバック処理中にエラーが発生しました。';

  @override
  String get authErrorOauthCreateAccountError =>
      '新しいアカウントの作成に失敗しました。もう一度お試しください。';

  @override
  String get authErrorOauthSignInError =>
      '選択したプロバイダーでのサインイン中にエラーが発生しました。もう一度お試しください。';

  @override
  String get authErrorBackToLogin => 'ログインに戻る';

  @override
  String get propertyTitle => '物件詳細';

  @override
  String get propertyBackToProperties => '物件一覧に戻る';

  @override
  String get propertyEditProperty => '物件を編集';

  @override
  String get propertyDeleteProperty => '物件を削除';

  @override
  String get propertyCreateProperty => '物件を作成';

  @override
  String get propertyAddProperty => '物件を追加';

  @override
  String get propertyLoading => '物件を読み込み中...';

  @override
  String get propertyNotFound => '物件が見つかりません。';

  @override
  String get propertyDebugInfo => 'デバッグ情報:';

  @override
  String get propertyConfirmDeleteTitle => 'この物件を削除してもよろしいですか？';

  @override
  String get propertyConfirmDeleteDescription =>
      'この操作は元に戻せません。この物件に関連するすべてのデータは完全に削除されます。';

  @override
  String get propertyConfirmDeleteCancel => 'キャンセル';

  @override
  String get propertyConfirmDeleteConfirm => '削除を確認';

  @override
  String get propertyTabsOverview => '概要';

  @override
  String get propertyTabsFeatures => '特徴';

  @override
  String get propertyTabsAmenities => '設備';

  @override
  String get propertyTabsLocation => '場所';

  @override
  String get propertyTabsDocuments => 'ドキュメント';

  @override
  String get propertyTabsHistory => '履歴';

  @override
  String get propertySectionsBasicInfo => '基本情報';

  @override
  String get propertySectionsPhysicalCharacteristics => '物理的特性';

  @override
  String get propertySectionsContactInfo => '連絡先情報';

  @override
  String get propertySectionsRelatedEntities => '関連エンティティ';

  @override
  String get propertySectionsMetadata => 'メタデータ';

  @override
  String get propertySectionsFeatures => '特徴';

  @override
  String get propertySectionsAmenities => '設備';

  @override
  String get propertySectionsLocationInfo => '場所情報';

  @override
  String get propertyFieldsTitle => 'タイトル';

  @override
  String get propertyFieldsDescription => '説明';

  @override
  String get propertyFieldsPropertyType => '物件タイプ';

  @override
  String get propertyFieldsStatus => 'ステータス';

  @override
  String get propertyFieldsCategory => 'カテゴリ';

  @override
  String get propertyFieldsBuildingClass => '建物クラス';

  @override
  String get propertyFieldsCondition => '状態';

  @override
  String get propertyFieldsSize => 'サイズ (m²)';

  @override
  String get propertyFieldsBedrooms => 'ベッドルーム';

  @override
  String get propertyFieldsBathrooms => 'バスルーム';

  @override
  String get propertyFieldsYearBuilt => '築年数';

  @override
  String get propertyFieldsContactEmail => '連絡先メールアドレス';

  @override
  String get propertyFieldsContactPhone => '連絡先電話番号';

  @override
  String get propertyFieldsOwner => '所有者';

  @override
  String get propertyFieldsAgent => 'エージェント';

  @override
  String get propertyFieldsAgency => '代理店';

  @override
  String get propertyFieldsCreated => '作成日時';

  @override
  String get propertyFieldsUpdated => '更新日時';

  @override
  String get propertyFieldsListed => '掲載日時';

  @override
  String get propertyFieldsAddress => '住所';

  @override
  String get propertyFieldsCity => '市';

  @override
  String get propertyFieldsStateProvince => '州/都道府県';

  @override
  String get propertyFieldsPostalCode => '郵便番号';

  @override
  String get propertyFieldsCountry => '国';

  @override
  String get propertyFieldsCoordinates => '座標';

  @override
  String get propertyFieldsLatitude => '緯度';

  @override
  String get propertyFieldsLongitude => '経度';

  @override
  String get propertyNoFeatures => '特徴は記載されていません';

  @override
  String get propertyNoAmenities => '設備は記載されていません';

  @override
  String get propertyNoCoordinates => '座標がありません';

  @override
  String get propertySuccessDeleted => '物件は正常に削除されました';

  @override
  String get propertySuccessCreated => '物件は正常に作成されました';

  @override
  String get propertySuccessUpdated => '物件は正常に更新されました';

  @override
  String get propertyErrorDelete => '物件の削除に失敗しました';

  @override
  String get propertyErrorCreate => '物件の作成に失敗しました';

  @override
  String get propertyErrorUpdate => '物件の更新に失敗しました';

  @override
  String get propertyErrorFetch => '物件詳細の取得に失敗しました';

  @override
  String get adminDashboard => '管理者ダッシュボード';

  @override
  String get adminProperties => '物件';

  @override
  String get adminAgents => 'エージェント';

  @override
  String get adminAgencies => '代理店';

  @override
  String get adminOwners => '所有者';

  @override
  String get adminTenants => 'テナント';

  @override
  String get adminPayments => '支払い';

  @override
  String get adminTasks => 'タスク';

  @override
  String get adminMessages => 'メッセージ';

  @override
  String get adminReports => 'レポート';

  @override
  String get adminAnalytics => 'アナリティクス';

  @override
  String get adminSettings => '設定';

  @override
  String get adminNotifications => '通知';

  @override
  String get account_id => 'アカウントID';

  @override
  String get account_type => 'タイプ';

  @override
  String get account_provider => 'プロバイダー';

  @override
  String get accountFilter_type_BANK => '銀行口座';

  @override
  String get accountFilter_type_CREDIT_CARD => 'クレジットカード';

  @override
  String get accountFilter_type_INVESTMENT => '投資口座';

  @override
  String get accountFilter_type_SAVINGS => '普通預金口座';

  @override
  String get accountFilter_type_LOAN => 'ローン口座';

  @override
  String get accountFilter_type_OTHER => 'その他口座';

  @override
  String get facilityDetailTitle => '施設詳細';

  @override
  String get facilityDetailId => 'ID';

  @override
  String get facilityDetailName => '名前';

  @override
  String get facilityDetailDescription => '説明';

  @override
  String get facilityDetailType => 'タイプ';

  @override
  String get facilityDetailStatus => 'ステータス';

  @override
  String get facilityDetailPropertyId => '物件ID';

  @override
  String get facilityDetailLocation => '場所';

  @override
  String get facilityDetailMetadata => 'メタデータ';

  @override
  String get facilityDetailCreatedBy => '作成者';

  @override
  String get facilityDetailUpdatedBy => '更新者';

  @override
  String get facilityDetailCreatedAt => '作成日時';

  @override
  String get facilityDetailUpdatedAt => '更新日時';

  @override
  String get facilityDetailDeletedAt => '削除日時';

  @override
  String get complianceRecordDetailTitle => 'コンプライアンス記録詳細';

  @override
  String get complianceRecordType => 'タイプ';

  @override
  String get complianceRecordStatus => 'ステータス';

  @override
  String get complianceRecordMetadata => 'メタデータ';

  @override
  String get complianceRecordCustomFields => 'カスタムフィールド';

  @override
  String get analyticsDetailTitle => 'アナリティクス詳細';

  @override
  String get analyticsType => 'タイプ';

  @override
  String get analyticsEntityType => 'エンティティタイプ';

  @override
  String get analyticsEntityId => 'エンティティID';

  @override
  String get analyticsTimestamp => 'タイムスタンプ';

  @override
  String get analyticsPropertyId => '物件ID';

  @override
  String get analyticsUserId => 'ユーザーID';

  @override
  String get analyticsAgentId => 'エージェントID';

  @override
  String get analyticsAgencyId => '代理店ID';

  @override
  String get analyticsReservationId => '予約ID';

  @override
  String get analyticsTaskId => 'タスクID';

  @override
  String get analyticsDeletedAt => '削除日時';

  @override
  String get analyticsCreatedAt => '作成日時';

  @override
  String get analyticsUpdatedAt => '更新日時';

  @override
  String get analyticsData => 'データ';

  @override
  String get analyticsAgency => '代理店';

  @override
  String get analyticsAgent => 'エージェント';

  @override
  String get analyticsTypeListingView => 'リスティングビュー';

  @override
  String get analyticsTypeBookingConversion => '予約コンバージョン';

  @override
  String get analyticsTypeUserEngagement => 'ユーザーエンゲージメント';

  @override
  String get analyticsTypeRevenue => '収益';

  @override
  String get analyticsTypePerformance => 'パフォーマンス';

  @override
  String get analyticsTypeAgentPerformance => 'エージェントパフォーマンス';

  @override
  String get analyticsTypeAgencyPerformance => '代理店パフォーマンス';

  @override
  String get analyticsTypeView => 'ビュー';

  @override
  String get contractDetailTitle => '契約詳細';

  @override
  String get contractIdLabel => 'ID';

  @override
  String get contractNameLabel => '名前';

  @override
  String get contractDescriptionLabel => '説明';

  @override
  String get contractTypeLabel => 'タイプ';

  @override
  String get contractStatusLabel => 'ステータス';

  @override
  String get contractCurrencyLabel => '通貨';

  @override
  String get contractRentAmountLabel => '家賃';

  @override
  String get contractNoticePeriodLabel => '通知期間';

  @override
  String get contractPropertyIdLabel => '物件ID';

  @override
  String get contractTenantIdLabel => 'テナントID';

  @override
  String get contractLandlordIdLabel => '家主ID';

  @override
  String get contractOwnerIdLabel => '所有者ID';

  @override
  String get contractAgencyIdLabel => '代理店ID';

  @override
  String get contractStartDateLabel => '開始日';

  @override
  String get contractEndDateLabel => '終了日';

  @override
  String get contractCreatedAtLabel => '作成日時';

  @override
  String get contractUpdatedAtLabel => '更新日時';

  @override
  String get contractDeletedAtLabel => '削除日時';

  @override
  String get contractSignedByLabel => '署名者';

  @override
  String get contractSignedAtLabel => '署名日時';

  @override
  String get contractTerminatedByLabel => '解約者';

  @override
  String get contractTerminatedAtLabel => '解約日時';

  @override
  String get contractCancelledByLabel => 'キャンセル者';

  @override
  String get contractCancelledAtLabel => 'キャンセル日時';

  @override
  String get contractTermsLabel => '規約:';

  @override
  String get contractConditionsLabel => '条件:';

  @override
  String get contractTypeRental => '賃貸';

  @override
  String get contractTypeSale => '販売';

  @override
  String get contractTypeManagement => '管理';

  @override
  String get contractTypeCommission => '手数料';

  @override
  String get contractTypeService => 'サービス';

  @override
  String get contractStatusDraft => '下書き';

  @override
  String get contractStatusActive => '有効';

  @override
  String get contractStatusExpired => '期限切れ';

  @override
  String get contractStatusTerminated => '終了';

  @override
  String get contractStatusRenewed => '更新済み';

  @override
  String get contractStatusPending => '保留中';

  @override
  String get contractStatusArchived => 'アーカイブ済み';

  @override
  String get taxRecordAny => 'すべて';

  @override
  String get taxRecordPaid => '支払い済み';

  @override
  String get taxRecordUnpaid => '未払い';

  @override
  String get taxRecordsTitle => '税務記録';

  @override
  String get eventType => 'タイプ';

  @override
  String get eventStatus => 'ステータス';

  @override
  String get eventProperty => '物件';

  @override
  String get eventAttendees => '参加者';

  @override
  String get eventDate => '日付';

  @override
  String get eventListTitle => 'イベント';

  @override
  String get eventGallery => 'ギャラリー';

  @override
  String get pricingRuleName => '名前';

  @override
  String get pricingRuleType => 'タイプ';

  @override
  String get pricingRuleStatus => 'ステータス';

  @override
  String get pricingRuleMultiplier => '乗数';

  @override
  String get pricingRuleFixedPrice => '固定価格';

  @override
  String get pricingRuleIsActive => 'アクティブ';

  @override
  String get pricingRulePropertyId => '物件ID';

  @override
  String get pricingRuleCreatedAt => '作成日時';

  @override
  String get pricingRuleUpdatedAt => '更新日時';

  @override
  String get pricingRuleDeletedAt => '削除日時';

  @override
  String get pricingRuleConditions => '条件';

  @override
  String get pricingRuleProperty => '物件';

  @override
  String get mentionType => 'タイプ';

  @override
  String get mentionStatus => 'ステータス';

  @override
  String get taskType => 'タイプ';

  @override
  String get taskStatus => 'ステータス';

  @override
  String get taskPriority => '優先度';

  @override
  String get taskAssignedTo => '担当者';

  @override
  String get taskCreatedAt => '作成日時';

  @override
  String get taskUpdatedAt => '更新日時';

  @override
  String get taskDeletedAt => '削除日時';

  @override
  String get guestStatus => 'ステータス';

  @override
  String get guestPhoneNumber => '電話番号';

  @override
  String get reviewType => 'タイプ';

  @override
  String get reviewStatus => 'ステータス';

  @override
  String get notificationType => 'タイプ';

  @override
  String get notificationStatus => 'ステータス';

  @override
  String get messageType => 'タイプ';

  @override
  String get messageStatus => 'ステータス';

  @override
  String get accountType => 'タイプ';

  @override
  String get accountStatus => 'ステータス';

  @override
  String get complianceTypeLicense => 'ライセンス';

  @override
  String get complianceTypeCertification => '認証';

  @override
  String get complianceTypeInsurance => '保険';

  @override
  String get complianceTypePermit => '許可';

  @override
  String get complianceTypeOther => 'その他';

  @override
  String get complianceStatusPending => '保留中';

  @override
  String get complianceStatusApproved => '承認済み';

  @override
  String get complianceStatusRejected => '拒否済み';

  @override
  String get complianceStatusExpired => '期限切れ';

  @override
  String get commonYes => 'はい';

  @override
  String get commonNo => 'いいえ';

  @override
  String get accountFilter_type_oauth => 'OAuth';

  @override
  String get accountFilter_type_email => 'メール';

  @override
  String get accountFilter_type_oidc => 'OIDC';

  @override
  String get accountFilter_type_credentials => '認証情報';

  @override
  String get accountFilter_type_google => 'Google';

  @override
  String get adminUsers => 'ユーザー';

  @override
  String get adminExpenses => '経費';

  @override
  String get adminFacilities => '施設';

  @override
  String get adminHelpdesk => 'ヘルプデスク';

  @override
  String get adminSubscriptions => 'サブスクリプション';

  @override
  String get adminContracts => '契約';

  @override
  String get adminGuests => 'ゲスト';

  @override
  String get adminCompliance => 'コンプライアンス';

  @override
  String get adminPricingRules => '価格設定ルール';

  @override
  String get adminReviews => 'レビュー';

  @override
  String get accountFilter_type_facebook => 'Facebook';

  @override
  String get edit_agent_tooltip => 'エージェントを編集';

  @override
  String get agent_contact_information_title => '連絡先情報';

  @override
  String get agent_email_label => 'メールアドレス';

  @override
  String get agent_phone_label => '電話番号';

  @override
  String get agent_address_label => '住所';

  @override
  String get agent_website_label => 'ウェブサイト';

  @override
  String get agent_professional_information_title => '専門情報';

  @override
  String get agent_status_label => 'ステータス';

  @override
  String get agent_agency_label => '代理店';

  @override
  String get agent_specialities_label => '専門分野';

  @override
  String get agent_activity_title => '最近のアクティビティ';

  @override
  String get agent_last_active_label => '最終アクティブ日時';

  @override
  String get agent_is_active_label => 'アクティブ';

  @override
  String get agent_created_at_label => '作成日時';

  @override
  String get common_not_available => '利用不可';

  @override
  String get common_yes => 'はい';

  @override
  String get common_no => 'いいえ';

  @override
  String get availability_edit_title => '利用可能性を編集';

  @override
  String get common_save => '保存';

  @override
  String get availability_date => '日付';

  @override
  String get availability_not_set => '未設定';

  @override
  String get availability_blocked => 'ブロック済み';

  @override
  String get availability_booked => '予約済み';

  @override
  String get availability_property_id => '物件ID';

  @override
  String get availability_reservation_id => '予約ID';

  @override
  String get availability_pricing_rule_id => '価格設定ルールID';

  @override
  String get availability_total_units => '総ユニット数';

  @override
  String get availability_available_units => '利用可能なユニット数';

  @override
  String get availability_booked_units => '予約済みユニット数';

  @override
  String get availability_blocked_units => 'ブロック済みユニット数';

  @override
  String get availability_base_price => '基本価格';

  @override
  String get availability_current_price => '現在価格';

  @override
  String get availability_special_pricing_json => '特別価格設定 (JSON)';

  @override
  String get availability_price_settings_json => '価格設定 (JSON)';

  @override
  String get availability_min_nights => '最小宿泊日数';

  @override
  String get availability_max_nights => '最大宿泊日数';

  @override
  String get availability_max_guests => '最大宿泊人数';

  @override
  String get availability_discount_settings_json => '割引設定 (JSON)';

  @override
  String get availability_weekend_rate => '週末料金';

  @override
  String get availability_weekday_rate => '平日料金';

  @override
  String get availability_weekend_multiplier => '週末乗数';

  @override
  String get availability_weekday_multiplier => '平日乗数';

  @override
  String get availability_seasonal_multiplier => '季節乗数';

  @override
  String get facilityTypeGym => 'ジム';

  @override
  String get facilityTypePool => 'プール';

  @override
  String get facilityTypeParkingLot => '駐車場';

  @override
  String get facilityTypeLaundry => 'ランドリー';

  @override
  String get facilityTypeElevator => 'エレベーター';

  @override
  String get facilityTypeSecurity => 'セキュリティ';

  @override
  String get facilityTypeOther => 'その他';

  @override
  String get facilityStatusAvailable => '利用可能';

  @override
  String get facilityStatusUnavailable => '利用不可';

  @override
  String get facilityStatusMaintenance => 'メンテナンス中';
}
