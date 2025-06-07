// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for Chinese (`zh`).
class AppLocalizationsZh extends AppLocalizations {
  AppLocalizationsZh([String locale = 'zh']) : super(locale);

  @override
  String get appTitle => 'Menem';

  @override
  String get dashboard => '仪表板';

  @override
  String get manageProperties => '有效管理您的房产';

  @override
  String get quickAccess => '快速访问';

  @override
  String get properties => '房产';

  @override
  String get tenants => '租户';

  @override
  String get payments => '付款';

  @override
  String get tasks => '任务';

  @override
  String get summaryStatistics => '汇总统计';

  @override
  String get totalProperties => '总房产数';

  @override
  String occupancyRate(Object rate) {
    return '入住率: $rate';
  }

  @override
  String get monthlyCashflow => '月度现金流';

  @override
  String pendingPayments(Object count) {
    return '待处理付款: $count';
  }

  @override
  String get pendingTasks => '待处理任务';

  @override
  String tasksThisWeek(Object count) {
    return '本周 $count 项';
  }

  @override
  String get propertyDetailTitle => '房产详情';

  @override
  String get propertyDetailOverviewTab => '概览';

  @override
  String get propertyDetailFeaturesTab => '特点';

  @override
  String get propertyDetailLocationTab => '位置';

  @override
  String get propertyDetailGalleryTab => '相册';

  @override
  String get propertyDetailId => 'ID';

  @override
  String get propertyDetailNumber => '房产编号';

  @override
  String get propertyDetailTitleField => '标题';

  @override
  String get propertyDetailDescription => '描述';

  @override
  String get propertyDetailType => '类型';

  @override
  String get propertyDetailStatus => '状态';

  @override
  String get propertyDetailCategory => '类别';

  @override
  String get propertyDetailCondition => '状况';

  @override
  String get propertyDetailMarketValue => '市场价值';

  @override
  String get propertyDetailBedrooms => '卧室';

  @override
  String get propertyDetailBathrooms => '浴室';

  @override
  String get propertyDetailYearBuilt => '建造年份';

  @override
  String get propertyDetailFeatures => '特点';

  @override
  String get propertyDetailAmenities => '便利设施';

  @override
  String get propertyDetailAddress => '地址';

  @override
  String get propertyDetailCity => '城市';

  @override
  String get propertyDetailState => '州/省';

  @override
  String get propertyDetailCountry => '国家';

  @override
  String get propertyDetailZipCode => '邮政编码';

  @override
  String get propertyDetailCoordinates => '坐标';

  @override
  String get propertyDetailNoFeatures => '无可用特点或便利设施';

  @override
  String get propertyDetailNoLocation => '无可用位置信息';

  @override
  String get propertyDetailGalleryPlaceholder => '相册视图 (使用图片网格视图实现)';

  @override
  String get propertyDetailDeleteConfirm => '您确定要删除此房产吗？';

  @override
  String get propertyDetailDeleteSuccess => '房产删除成功';

  @override
  String propertyDetailDeleteFailed(Object error) {
    return '删除房产失败: $error';
  }

  @override
  String get propertyDetailContactAgent => '联系代理人';

  @override
  String get propertyDetailPrice => '价格';

  @override
  String get propertyDetailLoading => '正在加载房产详情...';

  @override
  String get propertyDetailNotFound => '未找到房产。';

  @override
  String get totalTenants => '总租户数';

  @override
  String newTenants(Object count) {
    return '新租户: $count';
  }

  @override
  String get homeLabel => '首页';

  @override
  String get favoritesEmpty => '暂无收藏';

  @override
  String get favoritesError => '加载收藏夹时出错';

  @override
  String get favoritesRetry => '重试';

  @override
  String get emptyStateRetry => '重试';

  @override
  String get listings => '我的房产';

  @override
  String get listingsEmpty => '暂无房源';

  @override
  String get listingsRetry => '重试';

  @override
  String get filterPropertiesTitle => '筛选房产';

  @override
  String get filterPropertiesApply => '应用';

  @override
  String get filterPropertiesCancel => '取消';

  @override
  String get messagesLabel => '消息';

  @override
  String get notificationsLabel => '通知';

  @override
  String get notificationsEmpty => '暂无通知';

  @override
  String get paymentsLabel => '付款';

  @override
  String get settingsLabel => '设置';

  @override
  String get settingsAppearance => '外观';

  @override
  String get settingsDarkMode => '深色模式';

  @override
  String get filterTasksTitle => '筛选任务';

  @override
  String get filterTasksStatus => '状态';

  @override
  String get filterTasksPriority => '优先级';

  @override
  String get filterTasksType => '类型';

  @override
  String get filterTasksDueDate => '截止日期';

  @override
  String get filterTasksApply => '应用';

  @override
  String get filterTasksCancel => '取消';

  @override
  String get profileLabel => '个人资料';

  @override
  String get logoutLabel => '登出';

  @override
  String get loggingout => '正在登出...';

  @override
  String get sitetitle => 'RentalProc';

  @override
  String get nav_home => '首页';

  @override
  String get nav_properties => '房产';

  @override
  String get nav_payments => '付款';

  @override
  String get nav_tasks => '任务';

  @override
  String get nav_messages => '消息';

  @override
  String get nav_notifications => '通知';

  @override
  String get nav_helpdesk => '帮助台';

  @override
  String get nav_subscription => '订阅';

  @override
  String get nav_settings => '设置';

  @override
  String get nav_tenants => '租户';

  @override
  String get nav_expenses => '费用';

  @override
  String get nav_facilities => '设施';

  @override
  String get nav_analytics => '分析';

  @override
  String get nav_help => '帮助';

  @override
  String get nav_logout => '登出';

  @override
  String get nav_profile => '个人资料';

  @override
  String get nav_viewAll => '查看全部';

  @override
  String get indexTitle => '欢迎来到 Menem';

  @override
  String get indexDescription => '您的房产管理解决方案';

  @override
  String get indexPropertyManagementTitle => '房产管理';

  @override
  String get indexPropertyManagementDescription => '使用我们全面的工具套件高效管理您的房产。';

  @override
  String get indexWaterManagementTitle => '水务管理';

  @override
  String get indexWaterManagementDescription => '跟踪和优化您所有房产的用水情况。';

  @override
  String get authSignIn => '使用 Google 登录';

  @override
  String get authSignOut => '登出';

  @override
  String get createPropertyTitle => '创建新房产';

  @override
  String get propertyCreatedSuccess => '房产创建成功';

  @override
  String get propertyCreatedError => '创建房产失败';

  @override
  String get registerAlreadyHaveAccount => '已有账户？登录';

  @override
  String get registerForgotPassword => '忘记密码？';

  @override
  String get propertyViewingEventsTitle => '看房活动';

  @override
  String get propertyViewingSchedule => '安排看房';

  @override
  String authWelcomeBack(Object name) {
    return '欢迎回来，$name';
  }

  @override
  String get postsCreate => '创建帖子';

  @override
  String get postsTitle => '标题';

  @override
  String get postsContent => '内容';

  @override
  String get postsLoading => '正在加载帖子...';

  @override
  String get postsSave => '保存';

  @override
  String get postsCancel => '取消';

  @override
  String get postsEdit => '编辑';

  @override
  String get postsDelete => '删除';

  @override
  String get postsNoPostsYet => '暂无帖子';

  @override
  String get postsErrorUnauthorized => '您必须登录才能执行此操作';

  @override
  String get postsErrorCreatePost => '创建帖子失败';

  @override
  String get postsErrorUpdatePost => '更新帖子失败';

  @override
  String get postsErrorDeletePost => '删除帖子失败';

  @override
  String get chatMessages => '消息';

  @override
  String chatChattingWith(Object name) {
    return '正在与 $name 聊天';
  }

  @override
  String get chatConnectWithUsers => '与用户联系并获取支持';

  @override
  String get chatBackToList => '返回列表';

  @override
  String get chatWelcomeToChat => '欢迎来到聊天室';

  @override
  String get chatWelcomeDescription => '与其他用户开始对话或联系支持寻求帮助';

  @override
  String get chatNewMessage => '新消息';

  @override
  String get chatContactSupport => '联系支持';

  @override
  String get chatBack => '返回';

  @override
  String get chatSearchUsers => '搜索用户...';

  @override
  String get chatTypeMessage => '输入您的消息...';

  @override
  String get chatSend => '发送';

  @override
  String get chatErrorUnauthorized => '您必须登录才能执行此操作';

  @override
  String get chatErrorSendMessage => '发送消息失败';

  @override
  String get chatErrorMarkAsRead => '将消息标记为已读失败';

  @override
  String get chatError => '错误';

  @override
  String get chatConnectionError => '连接聊天服务器失败。请重试。';

  @override
  String get chatMessageSendError => '发送您的消息失败。请稍后重试。';

  @override
  String get notifications_placeholder => '暂无通知';

  @override
  String get notificationsPlaceholder => '暂无通知';

  @override
  String commonTimeAgo(Object time) {
    return '$time前';
  }

  @override
  String get commonSuccess => '成功';

  @override
  String get commonError => '错误';

  @override
  String propertiesFound(Object count) {
    return '找到 $count 处房产';
  }

  @override
  String get errorScreenTitle => '错误';

  @override
  String get errorScreenGoBack => '返回';

  @override
  String get dateRangeSelectTitle => '选择日期范围';

  @override
  String get dateRangeSelectApply => '应用';

  @override
  String get dateRangeSelectCancel => '取消';

  @override
  String get commonWarning => '警告';

  @override
  String get commonInfo => '信息';

  @override
  String get commonLoading => '正在加载...';

  @override
  String get commonSave => '保存';

  @override
  String get commonCancel => '取消';

  @override
  String get commonDelete => '删除';

  @override
  String get commonEdit => '编辑';

  @override
  String get commonCreate => '创建';

  @override
  String get commonView => '查看';

  @override
  String get commonPrevious => '上一个';

  @override
  String get commonNext => '下一个';

  @override
  String get commonBack => '返回';

  @override
  String get commonConfirm => '确认';

  @override
  String get commonActions => '操作';

  @override
  String get commonSearch => '搜索';

  @override
  String get commonFilter => '筛选';

  @override
  String get commonSort => '排序';

  @override
  String get commonNoData => '无可用数据';

  @override
  String get editAgentTooltip => '编辑代理人';

  @override
  String get agentContactInformationTitle => '联系信息';

  @override
  String get agentEmailLabel => '电子邮件';

  @override
  String get agentPhoneLabel => '电话';

  @override
  String get agentAddressLabel => '地址';

  @override
  String get agentWebsiteLabel => '网站';

  @override
  String get agentProfessionalInformationTitle => '专业信息';

  @override
  String get agentStatusLabel => '状态';

  @override
  String get agentAgencyLabel => '代理机构';

  @override
  String get agentSpecialitiesLabel => '专长';

  @override
  String get agentActivityTitle => '最近活动';

  @override
  String get agentLastActiveLabel => '最后活跃时间';

  @override
  String get agentIsActiveLabel => '是否活跃';

  @override
  String get agentCreatedAtLabel => '创建于';

  @override
  String get agentAdditionalInformationTitle => '附加信息';

  @override
  String get agentBioLabel => '简介';

  @override
  String get agentExternalIdLabel => '外部 ID';

  @override
  String get agentSettingsLabel => '设置';

  @override
  String get agentIntegrationLabel => '集成';

  @override
  String get agentOwnerIdLabel => '所有者 ID';

  @override
  String get agentAgencyIdLabel => '代理机构 ID';

  @override
  String get agentDeletedAtLabel => '删除于';

  @override
  String get amenitiesSectionTitle => '便利设施';

  @override
  String get noAmenitiesListed => '未列出任何便利设施';

  @override
  String get locationSectionTitle => '位置';

  @override
  String get getDirectionsButton => '获取路线';

  @override
  String get messageStatusRead => '已读';

  @override
  String get messageStatusDelivered => '已送达';

  @override
  String get messageStatusSent => '已发送';

  @override
  String get defaultUser => '默认用户';

  @override
  String get unknownTime => '未知时间';

  @override
  String get commonNotAvailable => '不可用';

  @override
  String accountsFound(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '找到 $count 个账户',
      one: '找到 1 个账户',
      zero: '未找到账户',
    );
    return '$_temp0';
  }

  @override
  String get actionCardProperties => '房产';

  @override
  String get actionCardTenants => '租户';

  @override
  String get actionCardAnalytics => '分析';

  @override
  String get actionCardPayments => '付款';

  @override
  String get actionCardTasks => '任务';

  @override
  String get actionCardMessages => '消息';

  @override
  String get actionCardHelpDesk => '帮助台';

  @override
  String get actionCardManageYourPropertyPortfolio => '管理您的房产组合';

  @override
  String get actionCardManageTenantInformation => '管理租户信息';

  @override
  String get actionCardViewReportsAndAnalytics => '查看报告和分析';

  @override
  String get actionCardTrackFinancialRecords => '跟踪财务记录';

  @override
  String get actionCardManageMaintenanceTasks => '管理维护任务';

  @override
  String get actionCardCommunicateWithTenants => '与租户沟通';

  @override
  String get actionCardGetAssistanceWhenNeeded => '在需要时获取帮助';

  @override
  String get actionCardAddProperty => '添加房产';

  @override
  String get actionCardCreateANewPropertyListing => '创建新的房产列表';

  @override
  String get actionCardAddTenant => '添加租户';

  @override
  String get actionCardRegisterANewTenant => '注册新租户';

  @override
  String get actionCardRecordPayment => '记录付款';

  @override
  String get actionCardRecordARentPayment => '记录租金付款';

  @override
  String get actionCardAddTask => '添加任务';

  @override
  String get actionCardCreateAMaintenanceTask => '创建维护任务';

  @override
  String get actionCardScheduleEvent => '安排活动';

  @override
  String get actionCardCreateAPropertyEvent => '创建房产活动';

  @override
  String get actionCardComposeMessage => '撰写消息';

  @override
  String get actionCardSendAMessageToTenants => '向租户发送消息';

  @override
  String get actionCardCreateDocument => '创建文档';

  @override
  String get actionCardGenerateANewDocument => '生成新文档';

  @override
  String get actionCardGetStarted => '开始使用';

  @override
  String get actionCardNewThisMonth => '本月新增';

  @override
  String get tenantsTitle => '租户';

  @override
  String get tenantsDescription => '管理您所有房产的租户信息和租赁合同';

  @override
  String get tenantsAddTenant => '添加租户';

  @override
  String get tenantsPropertyFilter => '房产';

  @override
  String get tenantsAllProperties => '所有房产';

  @override
  String get tenantsPaymentStatusFilter => '付款状态';

  @override
  String get tenantsAllStatuses => '所有状态';

  @override
  String get tenantsTenantColumn => '租户';

  @override
  String get tenantsStatusColumn => '状态';

  @override
  String get tenantsPropertyUnitColumn => '房产/单元';

  @override
  String get tenantsContactColumn => '联系方式';

  @override
  String get tenantsLeasePeriodColumn => '租赁期';

  @override
  String get tenantsActionsColumn => '操作';

  @override
  String get tenantsIdLabel => 'ID';

  @override
  String get tenantsNotAssigned => '未分配';

  @override
  String get tenantsNotAvailable => '不适用';

  @override
  String get tenantsLeaseFrom => '从';

  @override
  String get tenantsLeaseTo => '至';

  @override
  String get tenantsViewDetails => '查看详情';

  @override
  String get tenantsEdit => '编辑';

  @override
  String get tenantsDelete => '删除';

  @override
  String get tenantsNoTenantsFound => '未找到租户';

  @override
  String get tenantsGetStartedAddTenant => '通过添加新租户开始';

  @override
  String get tenantsConfirmDeletionTitle => '确认删除';

  @override
  String tenantsConfirmDeletionDesc(Object tenant) {
    return '您确定要删除租户 $tenant 吗？此操作无法撤销。';
  }

  @override
  String get tenantsCancel => '取消';

  @override
  String get tenantsDeleting => '正在删除...';

  @override
  String get tenantsPrevious => '上一个';

  @override
  String get tenantsNext => '下一个';

  @override
  String get tenantsStatusUnpaid => '未付款';

  @override
  String get tenantsStatusPartiallyPaid => '部分付款';

  @override
  String get tenantsStatusPaid => '已付款';

  @override
  String get tenantsStatusRefunded => '已退款';

  @override
  String get tenantsStatusOverdue => '逾期';

  @override
  String get tenantsStatusCancelled => '已取消';

  @override
  String get agenciesTitle => '代理机构';

  @override
  String get agenciesDescription => '管理您的代理机构及其设置。';

  @override
  String get agenciesSearch => '搜索代理机构...';

  @override
  String get agenciesStatus => '状态';

  @override
  String get agenciesStatusValuesPending => '待处理';

  @override
  String get agenciesStatusValuesVerified => '已验证';

  @override
  String get agenciesStatusValuesRejected => '已拒绝';

  @override
  String get agenciesAdd => '添加代理机构';

  @override
  String get agenciesEdit => '编辑';

  @override
  String get agenciesDelete => '删除';

  @override
  String agenciesConfirmDeleteDesc(Object name) {
    return '您确定要删除 $name 吗？此操作无法撤销。';
  }

  @override
  String get agenciesDeletedMsg => '代理机构删除成功。';

  @override
  String get agenciesNone => '没有符合您搜索条件的代理机构。请尝试不同的筛选条件。';

  @override
  String get agenciesNa => '不适用';

  @override
  String get agenciesAgents => '代理人';

  @override
  String get agenciesView => '查看';

  @override
  String get agenciesName => '代理机构名称';

  @override
  String get agenciesEmail => '电子邮件';

  @override
  String get agenciesPhoneNumber => '电话号码';

  @override
  String get agenciesAddress => '地址';

  @override
  String get agenciesWebsite => '网站';

  @override
  String get agenciesLogoUrl => '徽标 URL';

  @override
  String get agenciesCreated => '已创建';

  @override
  String get agenciesUpdated => '已更新';

  @override
  String get agenciesProperties => '房产';

  @override
  String get agenciesActions => '操作';

  @override
  String get agenciesCancel => '取消';

  @override
  String get agenciesDeleting => '正在删除...';

  @override
  String get agenciesCreating => '正在创建...';

  @override
  String get agenciesSaving => '正在保存...';

  @override
  String get agenciesSave => '保存';

  @override
  String get agenciesCreate => '创建';

  @override
  String get agenciesGetStarted => '通过添加新的代理机构开始';

  @override
  String get agenciesRequired => '此字段为必填项。';

  @override
  String get agenciesInvalidEmail => '无效的电子邮件地址。';

  @override
  String get agenciesInvalidUrl => '无效的 URL。';

  @override
  String get agenciesUpdatedMsg => '已更新！';

  @override
  String get agenciesCreatedMsg => '已创建！';

  @override
  String get agenciesErrorLoad => '加载详情失败。';

  @override
  String get agenciesErrorCreate => '创建失败。';

  @override
  String get agenciesErrorUpdate => '更新失败。';

  @override
  String get agenciesErrorDelete => '删除失败。';

  @override
  String get loginPageTitle => '登录';

  @override
  String get loginPageEmail => '电子邮件';

  @override
  String get loginPagePassword => '密码';

  @override
  String get loginPageRememberMe => '记住我';

  @override
  String get loginPageForgotPassword => '忘记密码？';

  @override
  String get loginPageSignIn => '登录';

  @override
  String get loginPageOrContinueWith => '或继续使用';

  @override
  String get loginPageDontHaveAccount => '没有账户？';

  @override
  String get loginPageSignUp => '注册';

  @override
  String get loginPageErrorInvalidCredentials => '无效的电子邮件或密码';

  @override
  String get loginPageErrorSomethingWentWrong => '出了点问题。请重试。';

  @override
  String get loginPageErrorSessionExpired => '您的会话已过期。请重新登录。';

  @override
  String get authErrorTitle => '身份验证错误';

  @override
  String get authErrorSomethingWentWrong => '身份验证期间出了点问题。请重试。';

  @override
  String get authErrorOauthAccountNotLinked => '已存在使用此电子邮件的账户。请使用原始身份验证方法登录。';

  @override
  String get authErrorOauthCallbackError => 'OAuth 回调过程中发生错误。';

  @override
  String get authErrorOauthCreateAccountError => '创建新账户失败。请重试。';

  @override
  String get authErrorOauthSignInError => '使用所选提供商登录时出错。请重试。';

  @override
  String get authErrorBackToLogin => '返回登录';

  @override
  String get propertyTitle => '房产详情';

  @override
  String get propertyBackToProperties => '返回房产列表';

  @override
  String get propertyEditProperty => '编辑房产';

  @override
  String get propertyDeleteProperty => '删除房产';

  @override
  String get propertyCreateProperty => '创建房产';

  @override
  String get propertyAddProperty => '添加房产';

  @override
  String get propertyLoading => '正在加载房产...';

  @override
  String get propertyNotFound => '未找到房产。';

  @override
  String get propertyDebugInfo => '调试信息：';

  @override
  String get propertyConfirmDeleteTitle => '您确定要删除此房产吗？';

  @override
  String get propertyConfirmDeleteDescription => '此操作无法撤销。与此房产相关的所有数据将被永久删除。';

  @override
  String get propertyConfirmDeleteCancel => '取消';

  @override
  String get propertyConfirmDeleteConfirm => '确认删除';

  @override
  String get propertyTabsOverview => '概览';

  @override
  String get propertyTabsFeatures => '特点';

  @override
  String get propertyTabsAmenities => '便利设施';

  @override
  String get propertyTabsLocation => '位置';

  @override
  String get propertyTabsDocuments => '文档';

  @override
  String get propertyTabsHistory => '历史记录';

  @override
  String get propertySectionsBasicInfo => '基本信息';

  @override
  String get propertySectionsPhysicalCharacteristics => '物理特性';

  @override
  String get propertySectionsContactInfo => '联系信息';

  @override
  String get propertySectionsRelatedEntities => '相关实体';

  @override
  String get propertySectionsMetadata => '元数据';

  @override
  String get propertySectionsFeatures => '特点';

  @override
  String get propertySectionsAmenities => '便利设施';

  @override
  String get propertySectionsLocationInfo => '位置信息';

  @override
  String get propertyFieldsTitle => '标题';

  @override
  String get propertyFieldsDescription => '描述';

  @override
  String get propertyFieldsPropertyType => '房产类型';

  @override
  String get propertyFieldsStatus => '状态';

  @override
  String get propertyFieldsCategory => '类别';

  @override
  String get propertyFieldsBuildingClass => '建筑等级';

  @override
  String get propertyFieldsCondition => '状况';

  @override
  String get propertyFieldsSize => '面积 (平方米)';

  @override
  String get propertyFieldsBedrooms => '卧室';

  @override
  String get propertyFieldsBathrooms => '浴室';

  @override
  String get propertyFieldsYearBuilt => '建造年份';

  @override
  String get propertyFieldsContactEmail => '联系电子邮件';

  @override
  String get propertyFieldsContactPhone => '联系电话';

  @override
  String get propertyFieldsOwner => '所有者';

  @override
  String get propertyFieldsAgent => '代理人';

  @override
  String get propertyFieldsAgency => '代理机构';

  @override
  String get propertyFieldsCreated => '已创建';

  @override
  String get propertyFieldsUpdated => '已更新';

  @override
  String get propertyFieldsListed => '已列出';

  @override
  String get propertyFieldsAddress => '地址';

  @override
  String get propertyFieldsCity => '城市';

  @override
  String get propertyFieldsStateProvince => '州/省';

  @override
  String get propertyFieldsPostalCode => '邮政编码';

  @override
  String get propertyFieldsCountry => '国家';

  @override
  String get propertyFieldsCoordinates => '坐标';

  @override
  String get propertyFieldsLatitude => '纬度';

  @override
  String get propertyFieldsLongitude => '经度';

  @override
  String get propertyNoFeatures => '未列出任何特点';

  @override
  String get propertyNoAmenities => '未列出任何便利设施';

  @override
  String get propertyNoCoordinates => '无可用坐标';

  @override
  String get propertySuccessDeleted => '房产删除成功';

  @override
  String get propertySuccessCreated => '房产创建成功';

  @override
  String get propertySuccessUpdated => '房产更新成功';

  @override
  String get propertyErrorDelete => '删除房产失败';

  @override
  String get propertyErrorCreate => '创建房产失败';

  @override
  String get propertyErrorUpdate => '更新房产失败';

  @override
  String get propertyErrorFetch => '获取房产详情失败';

  @override
  String get adminDashboard => '仪表板';

  @override
  String get adminProperties => '房产';

  @override
  String get adminAgents => '代理人';

  @override
  String get adminAgencies => '代理机构';

  @override
  String get adminOwners => '所有者';

  @override
  String get adminTenants => '租户';

  @override
  String get adminPayments => '付款';

  @override
  String get adminTasks => '任务';

  @override
  String get adminMessages => '消息';

  @override
  String get adminReports => '报告';

  @override
  String get adminAnalytics => '分析';

  @override
  String get adminSettings => '设置';

  @override
  String get adminNotifications => '通知';

  @override
  String get account_id => '账户 ID';

  @override
  String get account_type => '类型';

  @override
  String get account_provider => '提供商';

  @override
  String get accountFilter_type_BANK => '银行账户';

  @override
  String get accountFilter_type_CREDIT_CARD => '信用卡';

  @override
  String get accountFilter_type_INVESTMENT => '投资账户';

  @override
  String get accountFilter_type_SAVINGS => '储蓄账户';

  @override
  String get accountFilter_type_LOAN => '贷款账户';

  @override
  String get accountFilter_type_OTHER => '其他账户';

  @override
  String get facilityDetailTitle => '设施详情';

  @override
  String get facilityDetailId => 'ID';

  @override
  String get facilityDetailName => '名称';

  @override
  String get facilityDetailDescription => '描述';

  @override
  String get facilityDetailType => '类型';

  @override
  String get facilityDetailStatus => '状态';

  @override
  String get facilityDetailPropertyId => '房产 ID';

  @override
  String get facilityDetailLocation => '位置';

  @override
  String get facilityDetailMetadata => '元数据';

  @override
  String get facilityDetailCreatedBy => '创建者';

  @override
  String get facilityDetailUpdatedBy => '更新者';

  @override
  String get facilityDetailCreatedAt => '创建于';

  @override
  String get facilityDetailUpdatedAt => '更新于';

  @override
  String get facilityDetailDeletedAt => '删除于';

  @override
  String get complianceRecordDetailTitle => '合规记录详情';

  @override
  String get complianceRecordType => '类型';

  @override
  String get complianceRecordStatus => '状态';

  @override
  String get complianceRecordMetadata => '元数据';

  @override
  String get complianceRecordCustomFields => '自定义字段';

  @override
  String get analyticsDetailTitle => '分析详情';

  @override
  String get analyticsType => '类型';

  @override
  String get analyticsEntityType => '实体类型';

  @override
  String get analyticsEntityId => '实体 ID';

  @override
  String get analyticsTimestamp => '时间戳';

  @override
  String get analyticsPropertyId => '房产 ID';

  @override
  String get analyticsUserId => '用户 ID';

  @override
  String get analyticsAgentId => '代理人 ID';

  @override
  String get analyticsAgencyId => '代理机构 ID';

  @override
  String get analyticsReservationId => '预订 ID';

  @override
  String get analyticsTaskId => '任务 ID';

  @override
  String get analyticsDeletedAt => '删除于';

  @override
  String get analyticsCreatedAt => '创建于';

  @override
  String get analyticsUpdatedAt => '更新于';

  @override
  String get analyticsData => '数据';

  @override
  String get analyticsAgency => '代理机构';

  @override
  String get analyticsAgent => '代理人';

  @override
  String get analyticsTypeListingView => '房源浏览量';

  @override
  String get analyticsTypeBookingConversion => '预订转化率';

  @override
  String get analyticsTypeUserEngagement => '用户参与度';

  @override
  String get analyticsTypeRevenue => '收入';

  @override
  String get analyticsTypePerformance => '绩效';

  @override
  String get analyticsTypeAgentPerformance => '代理人绩效';

  @override
  String get analyticsTypeAgencyPerformance => '代理机构绩效';

  @override
  String get analyticsTypeView => '查看';

  @override
  String get contractDetailTitle => '合同详情';

  @override
  String get contractIdLabel => 'ID';

  @override
  String get contractNameLabel => '名称';

  @override
  String get contractDescriptionLabel => '描述';

  @override
  String get contractTypeLabel => '类型';

  @override
  String get contractStatusLabel => '状态';

  @override
  String get contractCurrencyLabel => '货币';

  @override
  String get contractRentAmountLabel => '租金金额';

  @override
  String get contractNoticePeriodLabel => '通知期';

  @override
  String get contractPropertyIdLabel => '房产 ID';

  @override
  String get contractTenantIdLabel => '租户 ID';

  @override
  String get contractLandlordIdLabel => '房东 ID';

  @override
  String get contractOwnerIdLabel => '所有者 ID';

  @override
  String get contractAgencyIdLabel => '代理机构 ID';

  @override
  String get contractStartDateLabel => '开始日期';

  @override
  String get contractEndDateLabel => '结束日期';

  @override
  String get contractCreatedAtLabel => '创建于';

  @override
  String get contractUpdatedAtLabel => '更新于';

  @override
  String get contractDeletedAtLabel => '删除于';

  @override
  String get contractSignedByLabel => '签署人';

  @override
  String get contractSignedAtLabel => '签署于';

  @override
  String get contractTerminatedByLabel => '终止人';

  @override
  String get contractTerminatedAtLabel => '终止于';

  @override
  String get contractCancelledByLabel => '取消人';

  @override
  String get contractCancelledAtLabel => '取消于';

  @override
  String get contractTermsLabel => '条款：';

  @override
  String get contractConditionsLabel => '条件：';

  @override
  String get contractTypeRental => '租赁';

  @override
  String get contractTypeSale => '销售';

  @override
  String get contractTypeManagement => '管理';

  @override
  String get contractTypeCommission => '佣金';

  @override
  String get contractTypeService => '服务';

  @override
  String get contractStatusDraft => '草稿';

  @override
  String get contractStatusActive => '有效';

  @override
  String get contractStatusExpired => '已过期';

  @override
  String get contractStatusTerminated => '已终止';

  @override
  String get contractStatusRenewed => '已续订';

  @override
  String get contractStatusPending => '待处理';

  @override
  String get contractStatusArchived => '已存档';

  @override
  String get taxRecordAny => '任何';

  @override
  String get taxRecordPaid => '已付';

  @override
  String get taxRecordUnpaid => '未付';

  @override
  String get taxRecordsTitle => '税务记录';

  @override
  String get eventType => '类型';

  @override
  String get eventStatus => '状态';

  @override
  String get eventProperty => '房产';

  @override
  String get eventAttendees => '参与者';

  @override
  String get eventDate => '日期';

  @override
  String get eventListTitle => '活动';

  @override
  String get eventGallery => '相册';

  @override
  String get pricingRuleName => '名称';

  @override
  String get pricingRuleType => '类型';

  @override
  String get pricingRuleStatus => '状态';

  @override
  String get pricingRuleMultiplier => '乘数';

  @override
  String get pricingRuleFixedPrice => '固定价格';

  @override
  String get pricingRuleIsActive => '是否有效';

  @override
  String get pricingRulePropertyId => '房产 ID';

  @override
  String get pricingRuleCreatedAt => '创建于';

  @override
  String get pricingRuleUpdatedAt => '更新于';

  @override
  String get pricingRuleDeletedAt => '删除于';

  @override
  String get pricingRuleConditions => '条件';

  @override
  String get pricingRuleProperty => '房产';

  @override
  String get mentionType => '类型';

  @override
  String get mentionStatus => '状态';

  @override
  String get taskType => '类型';

  @override
  String get taskStatus => '状态';

  @override
  String get taskPriority => '优先级';

  @override
  String get taskAssignedTo => '分配给';

  @override
  String get taskCreatedAt => '创建于';

  @override
  String get taskUpdatedAt => '更新于';

  @override
  String get taskDeletedAt => '删除于';

  @override
  String get guestStatus => '状态';

  @override
  String get guestPhoneNumber => '电话号码';

  @override
  String get reviewType => '类型';

  @override
  String get reviewStatus => '状态';

  @override
  String get notificationType => '类型';

  @override
  String get notificationStatus => '状态';

  @override
  String get messageType => '类型';

  @override
  String get messageStatus => '状态';

  @override
  String get accountType => '类型';

  @override
  String get accountStatus => '状态';

  @override
  String get complianceTypeLicense => '许可证';

  @override
  String get complianceTypeCertification => '认证';

  @override
  String get complianceTypeInsurance => '保险';

  @override
  String get complianceTypePermit => '许可证';

  @override
  String get complianceTypeOther => '其他';

  @override
  String get complianceStatusPending => '待处理';

  @override
  String get complianceStatusApproved => '已批准';

  @override
  String get complianceStatusRejected => '已拒绝';

  @override
  String get complianceStatusExpired => '已过期';

  @override
  String get commonYes => '是';

  @override
  String get commonNo => '否';

  @override
  String get accountFilter_type_oauth => 'OAuth';

  @override
  String get accountFilter_type_email => '电子邮件';

  @override
  String get accountFilter_type_oidc => 'OIDC';

  @override
  String get accountFilter_type_credentials => '凭据';

  @override
  String get accountFilter_type_google => 'Google';

  @override
  String get adminUsers => '用户';

  @override
  String get adminExpenses => '费用';

  @override
  String get adminFacilities => '设施';

  @override
  String get adminHelpdesk => '帮助台';

  @override
  String get adminSubscriptions => '订阅';

  @override
  String get adminContracts => '合同';

  @override
  String get adminGuests => '访客';

  @override
  String get adminCompliance => '合规性';

  @override
  String get adminPricingRules => '定价规则';

  @override
  String get adminReviews => '评论';

  @override
  String get accountFilter_type_facebook => 'Facebook';

  @override
  String get edit_agent_tooltip => '编辑代理人';

  @override
  String get agent_contact_information_title => '联系信息';

  @override
  String get agent_email_label => '电子邮件';

  @override
  String get agent_phone_label => '电话';

  @override
  String get agent_address_label => '地址';

  @override
  String get agent_website_label => '网站';

  @override
  String get agent_professional_information_title => '专业信息';

  @override
  String get agent_status_label => '状态';

  @override
  String get agent_agency_label => '代理机构';

  @override
  String get agent_specialities_label => '专长';

  @override
  String get agent_activity_title => '最近活动';

  @override
  String get agent_last_active_label => '最后活跃时间';

  @override
  String get agent_is_active_label => '是否活跃';

  @override
  String get agent_created_at_label => '创建于';

  @override
  String get common_not_available => '不可用';

  @override
  String get common_yes => '是';

  @override
  String get common_no => '否';

  @override
  String get availability_edit_title => '编辑可用性';

  @override
  String get common_save => '保存';

  @override
  String get availability_date => '日期';

  @override
  String get availability_not_set => '未设置';

  @override
  String get availability_blocked => '已屏蔽';

  @override
  String get availability_booked => '已预订';

  @override
  String get availability_property_id => '房产 ID';

  @override
  String get availability_reservation_id => '预订 ID';

  @override
  String get availability_pricing_rule_id => '定价规则 ID';

  @override
  String get availability_total_units => '总单元数';

  @override
  String get availability_available_units => '可用单元数';

  @override
  String get availability_booked_units => '已预订单元数';

  @override
  String get availability_blocked_units => '已屏蔽单元数';

  @override
  String get availability_base_price => '基本价格';

  @override
  String get availability_current_price => '当前价格';

  @override
  String get availability_special_pricing_json => '特殊定价 (JSON)';

  @override
  String get availability_price_settings_json => '价格设置 (JSON)';

  @override
  String get availability_min_nights => '最少入住夜数';

  @override
  String get availability_max_nights => '最多入住夜数';

  @override
  String get availability_max_guests => '最多入住人数';

  @override
  String get availability_discount_settings_json => '折扣设置 (JSON)';

  @override
  String get availability_weekend_rate => '周末费率';

  @override
  String get availability_weekday_rate => '工作日费率';

  @override
  String get availability_weekend_multiplier => '周末乘数';

  @override
  String get availability_weekday_multiplier => '工作日乘数';

  @override
  String get availability_seasonal_multiplier => '季节性乘数';

  @override
  String get facilityTypeGym => '健身房';

  @override
  String get facilityTypePool => '游泳池';

  @override
  String get facilityTypeParkingLot => '停车场';

  @override
  String get facilityTypeLaundry => '洗衣房';

  @override
  String get facilityTypeElevator => '电梯';

  @override
  String get facilityTypeSecurity => '安保';

  @override
  String get facilityTypeOther => '其他';

  @override
  String get facilityStatusAvailable => '可用';

  @override
  String get facilityStatusUnavailable => '不可用';

  @override
  String get facilityStatusMaintenance => '维护中';
}
