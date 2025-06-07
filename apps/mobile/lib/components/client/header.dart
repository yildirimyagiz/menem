import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:mobile/config/env.dart';
import 'package:mobile/config/nav_config.dart';
import 'package:mobile/main.dart';
import 'package:mobile/providers/auth_provider.dart';

// Example: Assume you have a provider for unread notification count
final unreadNotificationCountProvider =
    StateProvider<int>((ref) => 0); // Replace with your actual provider

class Header extends ConsumerWidget implements PreferredSizeWidget {
  final Function? toggleMobileMenu;

  const Header({Key? key, this.toggleMobileMenu}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.asData?.value;
    final notificationCount =
        ref.watch(unreadNotificationCountProvider); // Watch the count

    final String initials = getUserInitials(user);
    final String? userImageUrl = user?['image'] as String?;

    return AppBar(
      leading: toggleMobileMenu != null
          ? IconButton(
              icon: const Icon(LucideIcons.menu),
              onPressed: () => toggleMobileMenu!(),
            )
          : null,
      title: Row(
        children: [
          Icon(LucideIcons.building,
              size: 28, color: Theme.of(context).primaryColor),
          const SizedBox(width: 8),
          const Text(Env.appName,
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
        ],
      ),
      actions: [
        const _LanguageDropdown(),
        Stack(
          children: [
            IconButton(
              icon: const Icon(LucideIcons.bell),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Navigate to Notifications TBD"),
                  ),
                );
              },
            ),
            if (notificationCount > 0) // Show badge only if count > 0
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  constraints:
                      const BoxConstraints(minWidth: 16, minHeight: 16),
                  child: Text(
                    notificationCount.toString(),
                    style: const TextStyle(color: Colors.white, fontSize: 10),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
          ],
        ),
        CircleAvatar(
          backgroundImage:
              userImageUrl != null ? NetworkImage(userImageUrl) : null,
          backgroundColor: userImageUrl == null
              ? Color.fromRGBO(
                  (Theme.of(context).primaryColor.r * 255.0).round() & 0xff,
                  (Theme.of(context).primaryColor.g * 255.0).round() & 0xff,
                  (Theme.of(context).primaryColor.b * 255.0).round() & 0xff,
                  0.2,
                )
              : Colors.transparent,
          child: userImageUrl == null
              ? Text(
                  initials,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor,
                  ),
                )
              : null,
        ),
        const SizedBox(width: 16),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class _LanguageDropdown extends StatefulWidget {
  const _LanguageDropdown({Key? key}) : super(key: key);

  @override
  State<_LanguageDropdown> createState() => _LanguageDropdownState();
}

class _LanguageDropdownState extends State<_LanguageDropdown> {
  Locale? _selectedLocale;
  List<Locale> supportedLocales = [
    const Locale('en'),
    const Locale('ar'),
    const Locale('de'),
    const Locale('es'),
    const Locale('fa'),
    const Locale('fr'),
    const Locale('hi'),
    const Locale('it'),
    const Locale('ja'),
    const Locale('ru'),
    const Locale('tr'),
    const Locale('zh'),
  ];

  @override
  Widget build(BuildContext context) {
    final locale = Localizations.localeOf(context);
    _selectedLocale ??= locale;

    return DropdownButtonHideUnderline(
      child: DropdownButton<Locale>(
        value: _selectedLocale,
        icon: const Icon(Icons.language),
        items: supportedLocales.map((locale) {
          return DropdownMenuItem(
            value: locale,
            child: Text(locale.languageCode.toUpperCase()),
          );
        }).toList(),
        onChanged: (Locale? newLocale) {
          if (newLocale != null) {
            setState(() {
              _selectedLocale = newLocale;
            });
            MyApp.setLocale(context, newLocale);
          }
        },
        style: TextStyle(
          color: Theme.of(context).primaryColor,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
