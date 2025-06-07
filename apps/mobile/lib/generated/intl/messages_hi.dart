// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a hi locale. All the
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
  String get localeName => 'hi';

  static String m0(count) =>
      "${Intl.plural(count, zero: 'कोई खाता नहीं मिला', one: '${count} खाता मिला', other: '${count} खाते मिले')}";

  static String m2(name) => "वापस स्वागत है, ${name}";

  static String m3(name) => "${name} के साथ चैट कर रहे हैं";

  static String m5(count) => "नए किरायेदार: ${count}";

  static String m6(rate) => "आवास दर: ${rate}";

  static String m7(count) => "लंबित भुगतान: ${count}";

  static String m9(count) => "${count} इस सप्ताह";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountsFound": m0,
    "agent_activity_title": MessageLookupByLibrary.simpleMessage(
      "हाल की गतिविधि",
    ),
    "agent_address_label": MessageLookupByLibrary.simpleMessage("पता"),
    "agent_agency_label": MessageLookupByLibrary.simpleMessage("एजेंसी"),
    "agent_contact_information_title": MessageLookupByLibrary.simpleMessage(
      "संपर्क जानकारी",
    ),
    "agent_created_at_label": MessageLookupByLibrary.simpleMessage("बनाया गया"),
    "agent_email_label": MessageLookupByLibrary.simpleMessage("ईमेल"),
    "agent_is_active_label": MessageLookupByLibrary.simpleMessage("सक्रिय है"),
    "agent_last_active_label": MessageLookupByLibrary.simpleMessage(
      "अंतिम सक्रिय",
    ),
    "agent_phone_label": MessageLookupByLibrary.simpleMessage("फ़ोन"),
    "agent_professional_information_title":
        MessageLookupByLibrary.simpleMessage("पेशेवर जानकारी"),
    "agent_specialities_label": MessageLookupByLibrary.simpleMessage(
      "विशेषताएं",
    ),
    "agent_status_label": MessageLookupByLibrary.simpleMessage("स्थिति"),
    "agent_website_label": MessageLookupByLibrary.simpleMessage("वेबसाइट"),
    "amenitiesSectionTitle": MessageLookupByLibrary.simpleMessage("सुविधाएं"),
    "appTitle": MessageLookupByLibrary.simpleMessage("Menem"),
    "authSignIn": MessageLookupByLibrary.simpleMessage(
      "Google से साइन इन करें",
    ),
    "authSignOut": MessageLookupByLibrary.simpleMessage("साइन आउट"),
    "authWelcomeBack": m2,
    "chatBack": MessageLookupByLibrary.simpleMessage("वापस"),
    "chatBackToList": MessageLookupByLibrary.simpleMessage("सूची पर वापस"),
    "chatChattingWith": m3,
    "chatConnectWithUsers": MessageLookupByLibrary.simpleMessage(
      "उपयोगकर्ताओं से जुड़ें और समर्थन प्राप्त करें",
    ),
    "chatConnectionError": MessageLookupByLibrary.simpleMessage(
      "चैट सर्वर से कनेक्ट करने में विफल। कृपया पुनः प्रयास करें।",
    ),
    "chatContactSupport": MessageLookupByLibrary.simpleMessage(
      "समर्थन से संपर्क करें",
    ),
    "chatError": MessageLookupByLibrary.simpleMessage("त्रुटि"),
    "chatErrorMarkAsRead": MessageLookupByLibrary.simpleMessage(
      "संदेशों को पढ़ा हुआ चिह्नित करने में विफल",
    ),
    "chatErrorSendMessage": MessageLookupByLibrary.simpleMessage(
      "संदेश भेजने में विफल",
    ),
    "chatErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "इस कार्रवाई को करने के लिए आपको लॉग इन होना चाहिए",
    ),
    "chatMessageSendError": MessageLookupByLibrary.simpleMessage(
      "आपका संदेश भेजने में विफल। कृपया बाद में पुनः प्रयास करें।",
    ),
    "chatMessages": MessageLookupByLibrary.simpleMessage("संदेश"),
    "chatNewMessage": MessageLookupByLibrary.simpleMessage("नया संदेश"),
    "chatSearchUsers": MessageLookupByLibrary.simpleMessage(
      "उपयोगकर्ताओं को खोजें...",
    ),
    "chatSend": MessageLookupByLibrary.simpleMessage("भेजें"),
    "chatTypeMessage": MessageLookupByLibrary.simpleMessage(
      "अपना संदेश टाइप करें...",
    ),
    "chatWelcomeDescription": MessageLookupByLibrary.simpleMessage(
      "अन्य उपयोगकर्ताओं के साथ बातचीत शुरू करें या सहायता के लिए समर्थन से संपर्क करें",
    ),
    "chatWelcomeToChat": MessageLookupByLibrary.simpleMessage(
      "चैट में आपका स्वागत है",
    ),
    "common_no": MessageLookupByLibrary.simpleMessage("नहीं"),
    "common_not_available": MessageLookupByLibrary.simpleMessage(
      "उपलब्ध नहीं है",
    ),
    "common_save": MessageLookupByLibrary.simpleMessage("सहेजें"),
    "common_yes": MessageLookupByLibrary.simpleMessage("हाँ"),
    "dashboard": MessageLookupByLibrary.simpleMessage("डैशबोर्ड"),
    "defaultUser": MessageLookupByLibrary.simpleMessage("डिफ़ॉल्ट उपयोगकर्ता"),
    "edit_agent_tooltip": MessageLookupByLibrary.simpleMessage(
      "एजेंट संपादित करें",
    ),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage(
      "दिशा-निर्देश प्राप्त करें",
    ),
    "homeLabel": MessageLookupByLibrary.simpleMessage("होम"),
    "indexDescription": MessageLookupByLibrary.simpleMessage(
      "आपका संपत्ति प्रबंधन समाधान",
    ),
    "indexPropertyManagementDescription": MessageLookupByLibrary.simpleMessage(
      "हमारे व्यापक टूलसेट के साथ अपनी संपत्तियों का कुशलतापूर्वक प्रबंधन करें।",
    ),
    "indexPropertyManagementTitle": MessageLookupByLibrary.simpleMessage(
      "संपत्ति प्रबंधन",
    ),
    "indexTitle": MessageLookupByLibrary.simpleMessage(
      "मेनएम में आपका स्वागत है",
    ),
    "indexWaterManagementDescription": MessageLookupByLibrary.simpleMessage(
      "अपनी संपत्तियों में पानी के उपयोग को ट्रैक और अनुकूलित करें।",
    ),
    "indexWaterManagementTitle": MessageLookupByLibrary.simpleMessage(
      "जल प्रबंधन",
    ),
    "listings": MessageLookupByLibrary.simpleMessage("मेरी संपत्तियाँ"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage("स्थान"),
    "loggingout": MessageLookupByLibrary.simpleMessage("लॉग आउट हो रहा है..."),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("लॉग आउट"),
    "manageProperties": MessageLookupByLibrary.simpleMessage(
      "अपनी संपत्तियों का कुशलतापूर्वक प्रबंधन करें",
    ),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage("वितरित"),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("पढ़ा हुआ"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("भेजा गया"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("संदेश"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage(
      "मासिक नकदी प्रवाह",
    ),
    "nav_analytics": MessageLookupByLibrary.simpleMessage("विश्लेषण"),
    "nav_expenses": MessageLookupByLibrary.simpleMessage("खर्च"),
    "nav_facilities": MessageLookupByLibrary.simpleMessage("सुविधाएं"),
    "nav_help": MessageLookupByLibrary.simpleMessage("सहायता"),
    "nav_helpdesk": MessageLookupByLibrary.simpleMessage("सहायता डेस्क"),
    "nav_home": MessageLookupByLibrary.simpleMessage("होम"),
    "nav_logout": MessageLookupByLibrary.simpleMessage("लॉग आउट"),
    "nav_messages": MessageLookupByLibrary.simpleMessage("संदेश"),
    "nav_notifications": MessageLookupByLibrary.simpleMessage("सूचनाएं"),
    "nav_payments": MessageLookupByLibrary.simpleMessage("भुगतान"),
    "nav_profile": MessageLookupByLibrary.simpleMessage("प्रोफ़ाइल"),
    "nav_properties": MessageLookupByLibrary.simpleMessage("संपत्तियाँ"),
    "nav_settings": MessageLookupByLibrary.simpleMessage("सेटिंग्स"),
    "nav_subscription": MessageLookupByLibrary.simpleMessage("सदस्यता"),
    "nav_tasks": MessageLookupByLibrary.simpleMessage("कार्य"),
    "nav_tenants": MessageLookupByLibrary.simpleMessage("किरायेदार"),
    "nav_viewAll": MessageLookupByLibrary.simpleMessage("सभी देखें"),
    "newTenants": m5,
    "noAmenitiesListed": MessageLookupByLibrary.simpleMessage(
      "कोई सुविधा सूचीबद्ध नहीं है",
    ),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage("सूचनाएं"),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage(
      "अभी तक कोई सूचना नहीं",
    ),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("भुगतान"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("भुगतान"),
    "pendingPayments": m7,
    "pendingTasks": MessageLookupByLibrary.simpleMessage("लंबित कार्य"),
    "postsCancel": MessageLookupByLibrary.simpleMessage("रद्द करें"),
    "postsContent": MessageLookupByLibrary.simpleMessage("सामग्री"),
    "postsCreate": MessageLookupByLibrary.simpleMessage("पोस्ट बनाएँ"),
    "postsDelete": MessageLookupByLibrary.simpleMessage("हटाएँ"),
    "postsEdit": MessageLookupByLibrary.simpleMessage("संपादित करें"),
    "postsErrorCreatePost": MessageLookupByLibrary.simpleMessage(
      "पोस्ट बनाने में विफल",
    ),
    "postsErrorDeletePost": MessageLookupByLibrary.simpleMessage(
      "पोस्ट हटाने में विफल",
    ),
    "postsErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "इस कार्रवाई को करने के लिए आपको लॉग इन होना चाहिए",
    ),
    "postsErrorUpdatePost": MessageLookupByLibrary.simpleMessage(
      "पोस्ट अपडेट करने में विफल",
    ),
    "postsLoading": MessageLookupByLibrary.simpleMessage(
      "पोस्ट लोड हो रहे हैं...",
    ),
    "postsNoPostsYet": MessageLookupByLibrary.simpleMessage(
      "अभी तक कोई पोस्ट नहीं",
    ),
    "postsSave": MessageLookupByLibrary.simpleMessage("सहेजें"),
    "postsTitle": MessageLookupByLibrary.simpleMessage("शीर्षक"),
    "profileLabel": MessageLookupByLibrary.simpleMessage("प्रोफ़ाइल"),
    "properties": MessageLookupByLibrary.simpleMessage("संपत्तियाँ"),
    "quickAccess": MessageLookupByLibrary.simpleMessage("त्वरित पहुँच"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("सेटिंग्स"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("RentalProc"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage(
      "सारांश सांख्यिकी",
    ),
    "tasks": MessageLookupByLibrary.simpleMessage("कार्य"),
    "tasksThisWeek": m9,
    "tenants": MessageLookupByLibrary.simpleMessage("किरायेदार"),
    "totalProperties": MessageLookupByLibrary.simpleMessage("कुल संपत्तियाँ"),
    "totalTenants": MessageLookupByLibrary.simpleMessage("कुल किरायेदार"),
    "unknownTime": MessageLookupByLibrary.simpleMessage("अज्ञात समय"),
  };
}
