// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a zh locale. All the
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
  String get localeName => 'zh';

  static String m0(count) =>
      "${Intl.plural(count, zero: '未找到账户', one: '找到 1 个账户', other: '找到 ${count} 个账户')}";

  static String m2(name) => "欢迎回来，${name}";

  static String m3(name) => "正在与 ${name} 聊天";

  static String m5(count) => "新租户: ${count}";

  static String m6(rate) => "入住率: ${rate}";

  static String m7(count) => "待付款: ${count}";

  static String m9(count) => "本周${count}";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountsFound": m0,
    "agent_activity_title": MessageLookupByLibrary.simpleMessage("最近活动"),
    "agent_address_label": MessageLookupByLibrary.simpleMessage("地址"),
    "agent_agency_label": MessageLookupByLibrary.simpleMessage("代理机构"),
    "agent_contact_information_title": MessageLookupByLibrary.simpleMessage(
      "联系信息",
    ),
    "agent_created_at_label": MessageLookupByLibrary.simpleMessage("创建时间"),
    "agent_email_label": MessageLookupByLibrary.simpleMessage("电子邮件"),
    "agent_is_active_label": MessageLookupByLibrary.simpleMessage("是否活跃"),
    "agent_last_active_label": MessageLookupByLibrary.simpleMessage("上次活动时间"),
    "agent_phone_label": MessageLookupByLibrary.simpleMessage("电话"),
    "agent_professional_information_title":
        MessageLookupByLibrary.simpleMessage("专业信息"),
    "agent_specialities_label": MessageLookupByLibrary.simpleMessage("专长"),
    "agent_status_label": MessageLookupByLibrary.simpleMessage("状态"),
    "agent_website_label": MessageLookupByLibrary.simpleMessage("网站"),
    "amenitiesSectionTitle": MessageLookupByLibrary.simpleMessage("设施"),
    "appTitle": MessageLookupByLibrary.simpleMessage("Menem"),
    "authSignIn": MessageLookupByLibrary.simpleMessage("使用 Google 登录"),
    "authSignOut": MessageLookupByLibrary.simpleMessage("退出登录"),
    "authWelcomeBack": m2,
    "chatBack": MessageLookupByLibrary.simpleMessage("返回"),
    "chatBackToList": MessageLookupByLibrary.simpleMessage("返回列表"),
    "chatChattingWith": m3,
    "chatConnectWithUsers": MessageLookupByLibrary.simpleMessage("与用户联系并获得支持"),
    "chatConnectionError": MessageLookupByLibrary.simpleMessage(
      "连接聊天服务器失败。请重试。",
    ),
    "chatContactSupport": MessageLookupByLibrary.simpleMessage("联系支持"),
    "chatError": MessageLookupByLibrary.simpleMessage("错误"),
    "chatErrorMarkAsRead": MessageLookupByLibrary.simpleMessage("标记消息为已读失败"),
    "chatErrorSendMessage": MessageLookupByLibrary.simpleMessage("发送消息失败"),
    "chatErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "您必须登录才能执行此操作",
    ),
    "chatMessageSendError": MessageLookupByLibrary.simpleMessage(
      "发送您的消息失败。请稍后重试。",
    ),
    "chatMessages": MessageLookupByLibrary.simpleMessage("消息"),
    "chatNewMessage": MessageLookupByLibrary.simpleMessage("新消息"),
    "chatSearchUsers": MessageLookupByLibrary.simpleMessage("搜索用户..."),
    "chatSend": MessageLookupByLibrary.simpleMessage("发送"),
    "chatTypeMessage": MessageLookupByLibrary.simpleMessage("输入您的消息..."),
    "chatWelcomeDescription": MessageLookupByLibrary.simpleMessage(
      "与其他用户开始对话或联系支持以获得帮助",
    ),
    "chatWelcomeToChat": MessageLookupByLibrary.simpleMessage("欢迎来到聊天"),
    "common_no": MessageLookupByLibrary.simpleMessage("否"),
    "common_not_available": MessageLookupByLibrary.simpleMessage("不可用"),
    "common_save": MessageLookupByLibrary.simpleMessage("保存"),
    "common_yes": MessageLookupByLibrary.simpleMessage("是"),
    "dashboard": MessageLookupByLibrary.simpleMessage("仪表板"),
    "defaultUser": MessageLookupByLibrary.simpleMessage("默认用户"),
    "edit_agent_tooltip": MessageLookupByLibrary.simpleMessage("编辑代理"),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage("获取路线"),
    "homeLabel": MessageLookupByLibrary.simpleMessage("首页"),
    "indexDescription": MessageLookupByLibrary.simpleMessage("您的物业管理解决方案"),
    "indexPropertyManagementDescription": MessageLookupByLibrary.simpleMessage(
      "使用我们全面的工具套件高效管理您的物业。",
    ),
    "indexPropertyManagementTitle": MessageLookupByLibrary.simpleMessage(
      "物业管理",
    ),
    "indexTitle": MessageLookupByLibrary.simpleMessage("欢迎来到 Menem"),
    "indexWaterManagementDescription": MessageLookupByLibrary.simpleMessage(
      "跟踪和优化您物业的水使用情况。",
    ),
    "indexWaterManagementTitle": MessageLookupByLibrary.simpleMessage("水管理"),
    "listings": MessageLookupByLibrary.simpleMessage("我的物业"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage("位置"),
    "loggingout": MessageLookupByLibrary.simpleMessage("正在退出登录..."),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("退出登录"),
    "manageProperties": MessageLookupByLibrary.simpleMessage("高效管理您的物业"),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage("已送达"),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("已读"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("已发送"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("消息"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage("月现金流"),
    "nav_analytics": MessageLookupByLibrary.simpleMessage("分析"),
    "nav_expenses": MessageLookupByLibrary.simpleMessage("费用"),
    "nav_facilities": MessageLookupByLibrary.simpleMessage("设施"),
    "nav_help": MessageLookupByLibrary.simpleMessage("帮助"),
    "nav_helpdesk": MessageLookupByLibrary.simpleMessage("帮助台"),
    "nav_home": MessageLookupByLibrary.simpleMessage("首页"),
    "nav_logout": MessageLookupByLibrary.simpleMessage("退出登录"),
    "nav_messages": MessageLookupByLibrary.simpleMessage("消息"),
    "nav_notifications": MessageLookupByLibrary.simpleMessage("通知"),
    "nav_payments": MessageLookupByLibrary.simpleMessage("付款"),
    "nav_profile": MessageLookupByLibrary.simpleMessage("个人资料"),
    "nav_properties": MessageLookupByLibrary.simpleMessage("物业"),
    "nav_settings": MessageLookupByLibrary.simpleMessage("设置"),
    "nav_subscription": MessageLookupByLibrary.simpleMessage("订阅"),
    "nav_tasks": MessageLookupByLibrary.simpleMessage("任务"),
    "nav_tenants": MessageLookupByLibrary.simpleMessage("租户"),
    "nav_viewAll": MessageLookupByLibrary.simpleMessage("查看全部"),
    "newTenants": m5,
    "noAmenitiesListed": MessageLookupByLibrary.simpleMessage("未列出设施"),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage("通知"),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage("还没有通知"),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("付款"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("付款"),
    "pendingPayments": m7,
    "pendingTasks": MessageLookupByLibrary.simpleMessage("待办任务"),
    "postsCancel": MessageLookupByLibrary.simpleMessage("取消"),
    "postsContent": MessageLookupByLibrary.simpleMessage("内容"),
    "postsCreate": MessageLookupByLibrary.simpleMessage("创建帖子"),
    "postsDelete": MessageLookupByLibrary.simpleMessage("删除"),
    "postsEdit": MessageLookupByLibrary.simpleMessage("编辑"),
    "postsErrorCreatePost": MessageLookupByLibrary.simpleMessage("创建帖子失败"),
    "postsErrorDeletePost": MessageLookupByLibrary.simpleMessage("删除帖子失败"),
    "postsErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "您必须登录才能执行此操作",
    ),
    "postsErrorUpdatePost": MessageLookupByLibrary.simpleMessage("更新帖子失败"),
    "postsLoading": MessageLookupByLibrary.simpleMessage("正在加载帖子..."),
    "postsNoPostsYet": MessageLookupByLibrary.simpleMessage("还没有帖子"),
    "postsSave": MessageLookupByLibrary.simpleMessage("保存"),
    "postsTitle": MessageLookupByLibrary.simpleMessage("标题"),
    "profileLabel": MessageLookupByLibrary.simpleMessage("个人资料"),
    "properties": MessageLookupByLibrary.simpleMessage("Properties"),
    "quickAccess": MessageLookupByLibrary.simpleMessage("快速访问"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("设置"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("RentalProc"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage("统计摘要"),
    "tasks": MessageLookupByLibrary.simpleMessage("任务"),
    "tasksThisWeek": m9,
    "totalProperties": MessageLookupByLibrary.simpleMessage("总物业数"),
    "totalTenants": MessageLookupByLibrary.simpleMessage("租户总数"),
    "unknownTime": MessageLookupByLibrary.simpleMessage("未知时间"),
  };
}
