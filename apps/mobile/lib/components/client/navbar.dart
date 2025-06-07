import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/config/nav_config.dart' as nav_config;
import 'package:mobile/providers/auth_provider.dart';
import 'language_selector.dart';
import 'profile_menu.dart';
import 'notifications/notification_dropdown.dart';
import 'badge.dart' as custom;

class Navbar extends ConsumerWidget implements PreferredSizeWidget {
  const Navbar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.asData?.value;
    final String displayName = nav_config.getUserDisplayName(user);

    final String? userImageUrl = user?['image'] as String?;
    final String? email = user?['email'] as String?;
    final navItems = nav_config.getAllNavItems(ref);

    const supportedLocales = [
      Locale('en'),
      Locale('ar'),
      Locale('de'),
      Locale('es'),
      Locale('fa'),
      Locale('fr'),
      Locale('hi'),
      Locale('it'),
      Locale('ja'),
      Locale('ru'),
      Locale('tr'),
      Locale('zh'),
    ];
    final locale = Localizations.localeOf(context);

    return AppBar(
      title: Row(
        children: [
          Icon(Icons.business, color: Theme.of(context).primaryColor),
          const SizedBox(width: 8),
          const Text('RentalProc',
              style: TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
      actions: [
        ...navItems.map((item) => Stack(
              children: [
                IconButton(
                  icon: Icon(item.icon),
                  tooltip: item.getLabel(context),
                  onPressed: () {
                    if (item.route.isNotEmpty) {
                      Navigator.pushNamed(context, item.route);
                    }
                  },
                ),
                if (item.badgeCountProvider != null)
                  Consumer(builder: (context, ref, _) {
                    final count = ref.watch(item.badgeCountProvider!);
                    return count > 0
                        ? Positioned(
                            right: 4,
                            top: 4,
                            child: custom.Badge(count: count),
                          )
                        : const SizedBox.shrink();
                  }),
              ],
            )),
        NotificationDropdown(
          notifications: const [
            "New message from John",
            "Payment received",
            "Lease expiring soon"
          ],
          onViewAll: () {
            Navigator.pushNamed(context, '/notifications');
          },
        ),
        LanguageSelector(
          selectedLocale: locale,
          supportedLocales: supportedLocales,
          onChanged: (Locale newLocale) {
            // Implement your locale change logic, e.g. MyApp.setLocale(context, newLocale);
          },
        ),
        ProfileMenu(
          userName: displayName,
          userEmail: email,
          avatarUrl: userImageUrl,
          onProfile: () {
            Navigator.pushNamed(context, '/profile');
          },
          onSettings: () {
            Navigator.pushNamed(context, '/settings');
          },
          onLogout: () async {
            final authNotifier = ref.read(authNotifierProvider.notifier);
            await authNotifier.logout();
          },
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
