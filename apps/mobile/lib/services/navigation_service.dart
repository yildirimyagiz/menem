import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/main/error_screen.dart';
import '../screens/auth/profile_screen.dart';
import '../screens/account/settings_screen.dart';
import '../screens/auth/edit_profile_screen.dart';
import '../screens/auth/change_password_screen.dart';
import '../screens/main/home_screen.dart';
import '../screens/account/privacy_policy_screen.dart';
import '../screens/account/terms_of_service_screen.dart';
import '../screens/dashboard/dashboard_layout.dart';
import '../screens/profile/profile_settings_screen.dart';
import '../screens/account/account_management_screen.dart';
import '../screens/messages/messages_screen.dart';
import '../screens/favorites/favorites_screen.dart';
import '../screens/property/my_properties_screen.dart';
import '../screens/notifications/notifications_screen.dart';

class NavigationService {
  static final FluroRouter router = FluroRouter();
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  // --- Route Constants ---
  static const String rootRoute =
      "/"; // Often the initial route, can be same as home
  static const String homeRoute =
      "/"; // Corresponds to Dashboard in RoleSidebar
  static const String loginRoute = "/login";
  static const String registerRoute = "/register";
  static const String profileRoute = "/profile";
  static const String editProfileRoute = "/edit-profile";
  static const String changePasswordRoute = "/change-password";
  static const String settingsRoute = "/settings";
  static const String errorRoute = "/error";
  static const String privacyPolicyRoute = "/privacy-policy";
  static const String termsOfServiceRoute = "/terms-of-service";
  static const String dashboardRoute = "/dashboard"; // Main dashboard layout
  static const String profileSettingsRoute = "/profile-settings";
  static const String accountManagementRoute = "/account-management";
  static const String messagesRoute = "/messages"; // Or chatRoute
  static const String chatRoute = "/chat"; // Alias for messages if preferred
  static const String favoritesRoute = "/favorites";
  static const String myPropertiesRoute = "/my-properties";
  static const String notificationsRoute = "/notifications";
  static const String helpRoute = "/help";

  // Routes from the more extensive nav_config example (add if needed)
  static const String propertiesRoute = "/properties";
  static const String tenantsRoute = "/tenants";
  static const String paymentsRoute = "/payments";
  static const String tasksRoute = "/tasks";
  static const String expensesRoute = "/expenses";
  static const String facilitiesRoute = "/facilities";
  static const String helpdeskRoute = "/helpdesk";
  static const String analyticsRoute = "/analytics";
  static const String subscriptionRoute = "/subscription";

  // --- Route Definition Helper ---
  static void _defineRoute(String routePath, Widget screen,
      {TransitionType? transitionType}) {
    router.define(
      routePath,
      handler: Handler(
        handlerFunc: (context, params) => screen,
      ),
      transitionType: transitionType,
    );
  }

  static void initRoutes() {
    // Auth routes
    _defineRoute(loginRoute, const LoginScreen());
    _defineRoute(registerRoute, const RegisterScreen());
    _defineRoute(profileRoute, const ProfileScreen());
    _defineRoute(editProfileRoute, const EditProfileScreen());
    _defineRoute(changePasswordRoute, const ChangePasswordScreen());

    // Main app routes
    _defineRoute(
        homeRoute, const HomeScreen()); // Or rootRoute if preferred for initial
    _defineRoute("/home", const HomeScreen()); // Alias for dashboard
    _defineRoute(dashboardRoute, const HomeScreen()); // Alias for dashboard
    _defineRoute(settingsRoute, const SettingsScreen());
    _defineRoute(privacyPolicyRoute, const PrivacyPolicyScreen());
    _defineRoute(termsOfServiceRoute, const TermsOfServiceScreen());
    _defineRoute(dashboardRoute,
        const DashboardLayout(child: MyPropertiesScreen())); // Example child
    _defineRoute(profileSettingsRoute, const ProfileSettingsScreen());
    _defineRoute(accountManagementRoute, const AccountManagementScreen());
    _defineRoute(messagesRoute, const MessagesScreen());
    _defineRoute(chatRoute, const MessagesScreen()); // Alias for messages
    _defineRoute(favoritesRoute, const FavoritesScreen());
    _defineRoute(myPropertiesRoute, const MyPropertiesScreen());
    _defineRoute(notificationsRoute, const NotificationsScreen());
    _defineRoute(helpRoute,
        const ErrorScreen(message: "Help Screen TBD")); // Placeholder

    // Define other specific routes from nav_config as needed
    _defineRoute(
        propertiesRoute, const ErrorScreen(message: "Properties Screen TBD"));
    _defineRoute(
        tenantsRoute, const ErrorScreen(message: "Tenants Screen TBD"));
    _defineRoute(
        paymentsRoute, const ErrorScreen(message: "Payments Screen TBD"));
    _defineRoute(tasksRoute, const ErrorScreen(message: "Tasks Screen TBD"));
    _defineRoute(
        expensesRoute, const ErrorScreen(message: "Expenses Screen TBD"));
    _defineRoute(
        facilitiesRoute, const ErrorScreen(message: "Facilities Screen TBD"));
    _defineRoute(
        helpdeskRoute, const ErrorScreen(message: "Help Desk Screen TBD"));
    _defineRoute(
        analyticsRoute, const ErrorScreen(message: "Analytics Screen TBD"));
    _defineRoute(subscriptionRoute,
        const ErrorScreen(message: "Subscription Screen TBD"));

    // Error route
    router.define(
      errorRoute,
      handler: Handler(
        handlerFunc: (context, params) {
          final message = params['message']?.first ?? 'An error occurred';
          return ErrorScreen(message: message);
        },
      ),
    );

    // Define a notFoundHandler for Fluro
    router.notFoundHandler = Handler(
        handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
      // print("ROUTE WAS NOT FOUND: ${params.toString()}"); // For debugging
      return const ErrorScreen(message: "Page not found");
    });
  }

  static Future<dynamic> navigateTo(String routeName,
      {Map<String, dynamic>? params}) {
    if (navigatorKey.currentContext == null) {
      // print("Error: Navigator context is null. Cannot navigate.");
      return Future.value(); // Or throw an exception
    }
    return router.navigateTo(
      navigatorKey.currentContext!,
      routeName,
      routeSettings: RouteSettings(arguments: params),
      transition: TransitionType.fadeIn,
    );
  }

  static Future<dynamic> navigateToReplacement(String routeName,
      {Map<String, dynamic>? params}) {
    return router.navigateTo(
      // Ensure context is available, similar to navigateTo
      // This check might be redundant if navigateTo is always called from a widget context
      // but good for robustness if called from elsewhere.
      navigatorKey.currentContext!,
      routeName,
      routeSettings: RouteSettings(arguments: params),
      transition: TransitionType.fadeIn,
      replace: true,
    );
  }

  static void goBack() {
    navigatorKey.currentState?.pop();
  }

  // Specific navigation helpers can be kept if they provide significant convenience
  static void navigateToMyProperties() {
    navigateTo(myPropertiesRoute);
  }

  static void navigateToRegister() {
    navigateTo(registerRoute);
  }
}
