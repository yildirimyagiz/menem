import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class ClientSidebar extends StatelessWidget {
  const ClientSidebar({super.key});

  static const double sidebarWidth = 240;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final navItems = [
      const _ClientNavItem('Dashboard', Icons.home, '/dashboard'),
      const _ClientNavItem('Messages', Icons.message, '/messages'),
      const _ClientNavItem(
          'Notifications', Icons.notifications, '/notifications'),
      const _ClientNavItem('Tasks', LucideIcons.clipboardList, '/tasks'),
      const _ClientNavItem('Settings', Icons.settings, '/settings'),
    ];
    return Container(
      width: sidebarWidth,
      height: double.infinity,
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(
          right: BorderSide(color: theme.dividerColor),
        ),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 24.0, horizontal: 20),
            child: Row(
              children: [
                Icon(Icons.home, color: theme.colorScheme.primary, size: 26),
                const SizedBox(width: 10),
                Text('RentalProc',
                    style: theme.textTheme.titleLarge
                        ?.copyWith(fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              children: navItems
                  .map((item) => _ClientSidebarTile(item: item))
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class _ClientNavItem {
  final String label;
  final IconData icon;
  final String route;
  const _ClientNavItem(this.label, this.icon, this.route);
}

class _ClientSidebarTile extends StatelessWidget {
  final _ClientNavItem item;
  const _ClientSidebarTile({required this.item});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isActive = ModalRoute.of(context)?.settings.name == item.route;
    return ListTile(
      leading: Icon(item.icon,
          color: isActive ? theme.colorScheme.primary : theme.iconTheme.color),
      title: Text(
        item.label,
        style: theme.textTheme.bodyMedium?.copyWith(
          color: isActive
              ? theme.colorScheme.primary
              : theme.textTheme.bodyMedium?.color,
          fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: isActive,
      selectedTileColor: theme.colorScheme.primary.withAlpha((0.08 * 255).toInt()),
      onTap: () {
        if (!isActive) {
          Navigator.of(context).pushNamed(item.route);
        }
      },
    );
  }
}
