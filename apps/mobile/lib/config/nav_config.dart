import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../enums/role.dart'; // Your Role enum
import '../services/navigation_service.dart';

// Conceptual: You'll need to create these providers to manage badge counts
final unreadMessageCountProvider = StateProvider<int>((ref) => 3); // Example
final unreadNotificationCountProvider =
    StateProvider<int>((ref) => 5); // Example

class NavConfigItem {
  final String labelKey; // For internationalization (e.g., "nav.home")
  final IconData icon;
  final String route;
  final List<Role>? onlyFor; // Roles that can see this item
  final StateProvider<int>?
      badgeCountProvider; // Optional Riverpod provider for badge count
  final bool isDivider;

  const NavConfigItem({
    required this.labelKey,
    required this.icon,
    required this.route,
    this.onlyFor,
    this.badgeCountProvider,
    this.isDivider = false,
  });

  // Special item for dividers
  const NavConfigItem.divider()
      : labelKey = '',
        icon = Icons.remove, // Placeholder, won't be used
        route = '',
        onlyFor = null,
        badgeCountProvider = null,
        isDivider = true;

  // Helper to get translated label - integrate your i18n solution here
  String getLabel(BuildContext context) {
    // Placeholder for actual translation
    // Example: return AppLocalizations.of(context)!.translate(labelKey);
    if (labelKey.startsWith('nav.')) {
      final key = labelKey.substring(4);
      return key.splitMapJoin(
          RegExp(
              r'(?=[A-Z])'), // Split on capital letters for better formatting
          onMatch: (m) => ' ${m.group(0)}',
          onNonMatch: (n) => n.substring(0, 1).toUpperCase() + n.substring(1));
    }
    if (labelKey.isNotEmpty) {
      return labelKey.substring(0, 1).toUpperCase() + labelKey.substring(1);
    }
    return labelKey;
  }
}

// Define all navigation items, similar to Next.js navItems
// The `basePath` logic from Next.js (e.g., /admin vs /client) should be handled
// by defining full routes here or by your NavigationService.
List<NavConfigItem> getAllNavItems(WidgetRef ref) {
  // Potentially use ref to get dynamic parts of routes if needed, e.g., based on user settings
  // For now, basePath logic is simplified by assuming full routes or NavigationService handles it.
  // String basePath = ref.watch(userRoleProvider.select((role) => role == Role.admin ? "/admin" : "/client")); // Conceptual

  return [
    const NavConfigItem(
        labelKey: "nav.home",
        icon: LucideIcons.home,
        route: NavigationService.homeRoute),
    const NavConfigItem(
        labelKey: "nav.properties",
        icon: LucideIcons.building,
        route: "/properties"),
    const NavConfigItem(
        labelKey: "nav.tenants",
        icon: LucideIcons.users,
        route: "/tenants",
        onlyFor: [
          Role.admin,
          Role.agencyAdmin,
          Role.agentAdmin,
          Role.propertyManager
        ]),
    const NavConfigItem(
        labelKey: "nav.payments", icon: LucideIcons.wallet, route: "/payments"),
    const NavConfigItem(
        labelKey: "nav.tasks", icon: LucideIcons.wrench, route: "/tasks"),
    const NavConfigItem(
        labelKey: "nav.expenses",
        icon: LucideIcons.circleDollarSign,
        route: "/expenses",
        onlyFor: [Role.admin, Role.agencyAdmin, Role.propertyManager]),
    const NavConfigItem(
        labelKey: "nav.facilities",
        icon: LucideIcons.warehouse,
        route: "/facilities",
        onlyFor: [Role.admin, Role.agencyAdmin, Role.propertyManager]),
    NavConfigItem(
        labelKey: "nav.messages",
        icon: LucideIcons.messageCircle,
        route: "/messages",
        badgeCountProvider: unreadMessageCountProvider),
    NavConfigItem(
        labelKey: "nav.notifications",
        icon: LucideIcons.bell,
        route: "/notifications",
        badgeCountProvider: unreadNotificationCountProvider),
    const NavConfigItem(
        labelKey: "nav.helpdesk",
        icon: LucideIcons.helpCircle,
        route: "/helpdesk"),
    const NavConfigItem(
        labelKey: "nav.analytics",
        icon: LucideIcons.barChart4,
        route: "/analytics",
        onlyFor: [Role.admin, Role.agencyAdmin, Role.propertyManager]),
    const NavConfigItem(
        labelKey: "nav.subscription",
        icon: LucideIcons.circleDollarSign,
        route: "/subscription"),
    // Settings and Help are often at the bottom of a drawer
  ];
}

List<NavConfigItem> getBottomDrawerNavItems(WidgetRef ref) {
  // String basePath = ref.watch(userRoleProvider.select((role) => role == Role.admin ? "/admin" : "/client")); // Conceptual
  return [
    const NavConfigItem(
        labelKey: "nav.help",
        icon: LucideIcons.helpCircle,
        route: "/help"), // Example: ${basePath}/help
    const NavConfigItem(
        labelKey: "nav.settings",
        icon: LucideIcons.settings,
        route: "/settings"), // Example: ${basePath}/settings
  ];
}

// Helper to get user initials (similar to Next.js getInitials)
String getUserInitials(Map<String, dynamic>? user) {
  if (user == null) return "G"; // Guest
  final String? firstName = user['firstName'] as String?;
  final String? lastName = user['lastName'] as String?;
  final String? username = user['username'] as String?;
  final String? email = user['email'] as String?;

  if (firstName != null &&
      firstName.isNotEmpty &&
      lastName != null &&
      lastName.isNotEmpty) {
    return "${firstName[0]}${lastName[0]}".toUpperCase();
  }
  if (username != null && username.length >= 2) {
    return username.substring(0, 2).toUpperCase();
  }
  if (username != null && username.isNotEmpty) {
    return username.substring(0, 1).toUpperCase();
  }
  if (email != null && email.isNotEmpty) {
    return email.substring(0, 1).toUpperCase();
  }
  return "U"; // User
}

// Helper to get user display name (similar to Next.js getUserDisplayName)
String getUserDisplayName(Map<String, dynamic>? user) {
  if (user == null) return "Guest User";
  final String? firstName = user['firstName'] as String?;
  final String? lastName = user['lastName'] as String?;
  final String? username = user['username'] as String?;

  if (firstName != null && lastName != null) return "$firstName $lastName";
  if (username != null) return username;
  return user['email']?.split("@")[0] ?? "User";
}
