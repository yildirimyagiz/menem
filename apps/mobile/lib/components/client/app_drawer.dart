import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

// import '../config/env.dart'; // For Env.appName if needed - nav_config is already imported with a prefix
import 'package:mobile/config/nav_config.dart' as nav_config;
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/services/navigation_service.dart';

import '../../enums/role.dart'; // Ensure this is the only import for nav_config

class AppDrawer extends ConsumerWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final authNotifier = ref.read(authNotifierProvider.notifier);
    final user = authState.asData?.value;

    final String displayName = nav_config.getUserDisplayName(user);
    final String initials = nav_config.getUserInitials(user);
    final String? userImageUrl = user?['image'] as String?;
    final String? email = user?['email'] as String?;

    // Determine current user role
    final Role currentUserRole = user?['role'] != null
        ? Role.values.firstWhere(
            (r) =>
                r.toString().split('.').last.toLowerCase() ==
                (user!['role'] as String).toLowerCase(),
            orElse: () => Role.guest,
          )
        : Role.guest;

    final List<nav_config.NavConfigItem> allMainItems =
        nav_config.getAllNavItems(ref);
    final List<nav_config.NavConfigItem> bottomDrawerItems =
        nav_config.getBottomDrawerNavItems(ref);

    List<Widget> buildDrawerItems(List<nav_config.NavConfigItem> items) {
      return items.where((item) {
        if (item.isDivider) return true;
        if (item.onlyFor == null) return true;
        if (user == null && !item.onlyFor!.contains(Role.guest)) return false;
        return item.onlyFor!.contains(currentUserRole);
      }).map((item) {
        if (item.isDivider) {
          return const Divider();
        }
        return ListTile(
          leading: item.badgeCountProvider != null
              ? Consumer(builder: (context, watchRef, child) {
                  final count = watchRef.watch(item.badgeCountProvider!);
                  return Badge(
                    label: count > 0 ? Text('$count') : null,
                    isLabelVisible: count > 0,
                    child: Icon(item.icon,
                        color: Theme.of(context).iconTheme.color),
                  );
                })
              : Icon(item.icon, color: Theme.of(context).iconTheme.color),
          title: Text(item.getLabel(context)),
          onTap: () {
            Navigator.pop(context); // Close the drawer
            if (item.route.isNotEmpty) {
              NavigationService.navigateTo(item.route);
            }
          },
        );
      }).toList();
    }

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          UserAccountsDrawerHeader(
            accountName: Text(displayName,
                style: const TextStyle(fontWeight: FontWeight.bold)),
            accountEmail: Text(email ?? (user == null ? 'Not signed in' : '')),
            currentAccountPicture: CircleAvatar(
              backgroundImage:
                  userImageUrl != null ? NetworkImage(userImageUrl) : null,
              backgroundColor: userImageUrl == null
                  ? Theme.of(context).primaryColor.withAlpha(178)
                  : Colors.transparent,
              child: userImageUrl == null
                  ? Text(initials,
                      style:
                          const TextStyle(fontSize: 40.0, color: Colors.white))
                  : null,
            ),
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor,
            ),
          ),
          ...buildDrawerItems(allMainItems),
          const Divider(),
          ...buildDrawerItems(bottomDrawerItems),
          ListTile(
            leading: Icon(user != null ? LucideIcons.logOut : LucideIcons.logIn,
                color: user != null ? Colors.redAccent : null),
            title: Text(user != null
                ? 'Sign Out'
                : 'Sign In'), // i18n: Place for internationalization logic or use context.l10n when available.
            onTap: () async {
              Navigator.pop(context);
              if (user != null) {
                await authNotifier
                    .logout(); // This should trigger AuthWrapper to rebuild
              } else {
                NavigationService.navigateTo(NavigationService.loginRoute);
              }
            },
          ),
        ],
      ),
    );
  }
}
