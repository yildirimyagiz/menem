import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/components/client/header.dart';

import 'package:mobile/providers/auth_provider.dart';
import '../../providers/user_provider.dart';
import '../../services/navigation_service.dart';
import '../profile/profile_settings_screen.dart';
import '../messages/messages_screen.dart';
import '../favorites/favorites_screen.dart';
import '../property/my_properties_screen.dart';
import '../notifications/notifications_screen.dart';

class DashboardLayout extends ConsumerStatefulWidget {
  final Widget? child; // Optional, for custom content

  const DashboardLayout({super.key, this.child});

  @override
  ConsumerState<DashboardLayout> createState() => _DashboardLayoutState();
}

class _DashboardLayoutState extends ConsumerState<DashboardLayout> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const MyPropertiesScreen(),
    const MessagesScreen(),
    const FavoritesScreen(),
    const NotificationsScreen(),
    const ProfileSettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    ref.watch(userProvider);
    final authState = ref.watch(authNotifierProvider);

    return authState.when(
      data: (user) {
        if (user == null) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            Navigator.of(context).pushReplacementNamed('/login');
          });
          return const Center(child: CircularProgressIndicator());
        }

        final isWide = MediaQuery.of(context).size.width >= 800;

        return Scaffold(
          appBar: Header(
            // Optionally pass a callback to open drawer on mobile
            toggleMobileMenu:
                isWide ? null : () => Scaffold.of(context).openDrawer(),
          ),
          drawer: isWide
              ? null
              : Drawer(
                  child: _buildSidebar(context, isWide: false),
                ),
          body: Row(
            children: [
              if (isWide) _buildSidebar(context, isWide: true),
              Expanded(
                child: widget.child ?? _screens[_selectedIndex],
              ),
            ],
          ),
          floatingActionButton: FloatingActionButton(
            onPressed: () {
              NavigationService.navigateTo('/create-property');
            },
            child: const Icon(Icons.add),
          ),
          bottomNavigationBar: isWide ? null : _buildFooter(context),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stackTrace) => Center(child: Text('Error: $error')),
    );
  }

  Widget _buildSidebar(BuildContext context, {required bool isWide}) {
    return NavigationRail(
      extended: isWide,
      selectedIndex: _selectedIndex,
      onDestinationSelected: (index) {
        setState(() {
          _selectedIndex = index;
        });
      },
      destinations: const [
        NavigationRailDestination(
          icon: Icon(Icons.home),
          label: Text('My Properties'),
        ),
        NavigationRailDestination(
          icon: Icon(Icons.message),
          label: Text('Messages'),
        ),
        NavigationRailDestination(
          icon: Icon(Icons.favorite),
          label: Text('Favorites'),
        ),
        NavigationRailDestination(
          icon: Icon(Icons.notifications),
          label: Text('Notifications'),
        ),
        NavigationRailDestination(
          icon: Icon(Icons.person),
          label: Text('Profile'),
        ),
      ],
    );
  }

  Widget _buildFooter(BuildContext context) {
    return BottomAppBar(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Center(
          child: Text(
            '© ${DateTime.now().year} RentalProc. All rights reserved.',
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ),
      ),
    );
  }
}
