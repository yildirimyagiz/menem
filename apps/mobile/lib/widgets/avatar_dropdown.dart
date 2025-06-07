import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/user_provider.dart';
import '../services/navigation_service.dart';

class AvatarDropdown extends ConsumerWidget {
  const AvatarDropdown({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userState = ref.watch(userProvider);

    return userState.when(
      data: (userData) {
        if (userData == null) return const SizedBox.shrink();

        final String? userRole = userData['role'] as String?;
        final String? userName = userData['name'] as String?;
        final String? userEmail = userData['email'] as String?;

        return PopupMenuButton<String>(
          icon: CircleAvatar(
            backgroundColor: Theme.of(context).colorScheme.primary,
            child: Text(
              userName?.substring(0, 1).toUpperCase() ?? 'U',
              style: TextStyle(
                color: Theme.of(context).colorScheme.onPrimary,
              ),
            ),
          ),
          itemBuilder: (context) => [
            // User info section
            PopupMenuItem<String>(
              enabled: false,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    userName ?? 'User',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  Text(
                    userEmail ?? '',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            const PopupMenuDivider(),
            // Common menu items
            const PopupMenuItem<String>(
              value: 'profile',
              child: ListTile(
                leading: Icon(Icons.person),
                title: Text('Profile'),
              ),
            ),
            const PopupMenuItem<String>(
              value: 'settings',
              child: ListTile(
                leading: Icon(Icons.settings),
                title: Text('Settings'),
              ),
            ),
            // Role-specific menu items
            if (userRole == 'ADMIN') ...[
              const PopupMenuDivider(),
              const PopupMenuItem<String>(
                value: 'users',
                child: ListTile(
                  leading: Icon(Icons.people),
                  title: Text('Manage Users'),
                ),
              ),
              const PopupMenuItem<String>(
                value: 'roles',
                child: ListTile(
                  leading: Icon(Icons.admin_panel_settings),
                  title: Text('Manage Roles'),
                ),
              ),
            ],
            if (userRole == 'AGENT') ...[
              const PopupMenuDivider(),
              const PopupMenuItem<String>(
                value: 'properties',
                child: ListTile(
                  leading: Icon(Icons.home),
                  title: Text('Manage Properties'),
                ),
              ),
              const PopupMenuItem<String>(
                value: 'clients',
                child: ListTile(
                  leading: Icon(Icons.person_outline),
                  title: Text('Manage Clients'),
                ),
              ),
            ],
            const PopupMenuDivider(),
            const PopupMenuItem<String>(
              value: 'logout',
              child: ListTile(
                leading: Icon(Icons.logout),
                title: Text('Sign Out'),
              ),
            ),
          ],
          onSelected: (value) async {
            switch (value) {
              case 'profile':
                NavigationService.navigateTo('/profile');
                break;
              case 'settings':
                NavigationService.navigateTo('/settings');
                break;
              case 'users':
                NavigationService.navigateTo('/users');
                break;
              case 'roles':
                NavigationService.navigateTo('/roles');
                break;
              case 'properties':
                NavigationService.navigateTo('/properties');
                break;
              case 'clients':
                NavigationService.navigateTo('/clients');
                break;
              case 'logout':
                await ref.read(userProvider.notifier).signOut();
                NavigationService.navigateToReplacement('/login');
                break;
            }
          },
        );
      },
      loading: () => const SizedBox.shrink(),
      error: (_, __) => const SizedBox.shrink(),
    );
  }
}
