import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:mobile/generated/l10n.dart' show AppLocalizations;

class AdminSidebar extends StatelessWidget {
  const AdminSidebar({super.key});

  static const double sidebarWidth = 280;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final s = AppLocalizations.of(context)!;
    final navItems = [
      _AdminNavItem(s.adminDashboard, Icons.home, '/admin'),
      _AdminNavItem(
          s.adminProperties, LucideIcons.building2, '/admin/properties'),
      _AdminNavItem(s.adminTenants, Icons.people,
          '/admin/tenants'), // Assuming 'Users' maps to 'Tenants' or similar admin section
      _AdminNavItem(s.adminPayments, LucideIcons.creditCard, '/admin/payments'),
      _AdminNavItem(
          s.adminNotifications, Icons.notifications, '/admin/notifications'),
      _AdminNavItem(s.adminSettings, Icons.settings, '/admin/settings'),
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
          // Logo/Header
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 24.0, horizontal: 20),
            child: Row(
              children: [
                Icon(LucideIcons.building2,
                    color: theme.colorScheme.primary, size: 28),
                const SizedBox(width: 12),
                Text(s.sitetitle,
                    style: theme.textTheme.titleLarge
                        ?.copyWith(fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          // Navigation
          Expanded(
            child: ListView(
              children: navItems
                  .map((item) => _AdminSidebarTile(item: item))
                  .toList(),
            ),
          ),
          // Sign out
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: ListTile(
              leading: Icon(Icons.logout, color: theme.colorScheme.onSurface),
              title: Text(s.authSignOut, style: theme.textTheme.bodyMedium),
              onTap: () {},
            ),
          ),
        ],
      ),
    );
  }
}

class _AdminNavItem {
  final String label;
  final IconData icon;
  final String route;
  const _AdminNavItem(this.label, this.icon, this.route);
}

class _AdminSidebarTile extends StatelessWidget {
  final _AdminNavItem item;
  const _AdminSidebarTile({required this.item});

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
      selectedTileColor:
          theme.colorScheme.primary.withAlpha((0.08 * 255).round()),
      onTap: () {
        if (!isActive) {
          Navigator.of(context).pushNamed(item.route);
        }
      },
    );
  }
}
