import 'package:flutter/material.dart';
import '../client/client_sidebar.dart';
import '../client/user_avatar_dropdown.dart';

class ClientLayout extends StatelessWidget {
  final Widget child;
  const ClientLayout({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          // Sidebar
          const ClientSidebar(),
          // Main content
          Expanded(
            child: Column(
              children: [
                // Top bar with user avatar dropdown
                Container(
                  height: 60,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surface,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withAlpha((0.04 * 255).toInt()),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      ClientUserAvatarDropdown(),
                    ],
                  ),
                ),
                // Main content area
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: child,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
