import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class QuickActionsSection extends StatelessWidget {
  const QuickActionsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final actions = [
      _QuickActionItem(
        icon: LucideIcons.plusCircle,
        label: 'Add Property',
        onTap: () => debugPrint('Quick action: Add Property'),
      ),
      _QuickActionItem(
        icon: LucideIcons.wallet,
        label: 'Collect Rent',
        onTap: () => debugPrint('Quick action: Collect Rent'),
      ),
      _QuickActionItem(
        icon: LucideIcons.users,
        label: 'Add Tenant',
        onTap: () => debugPrint('Quick action: Add Tenant'),
      ),
      _QuickActionItem(
        icon: LucideIcons.wrench,
        label: 'Create Task',
        onTap: () => debugPrint('Quick action: Create Task'),
      ),
    ];
    return Column(
      children: actions
          .map((a) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4.0),
                child: a,
              ))
          .toList(),
    );
  }
}

class _QuickActionItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onTap;

  const _QuickActionItem({required this.icon, required this.label, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Icon(icon, color: Theme.of(context).primaryColor),
        title: Text(label),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
