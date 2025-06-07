import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class QuickAccessSection extends StatelessWidget {
  const QuickAccessSection({super.key});

  @override
  Widget build(BuildContext context) {
    final quickAccessItems = [
      const _QuickAccessItem(icon: LucideIcons.building, label: 'Properties'),
      const _QuickAccessItem(icon: LucideIcons.users, label: 'Tenants'),
      const _QuickAccessItem(icon: LucideIcons.wallet, label: 'Payments'),
      const _QuickAccessItem(icon: LucideIcons.wrench, label: 'Tasks'),
    ];

    return SizedBox(
      height: 80,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 8),
        itemCount: quickAccessItems.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, index) => quickAccessItems[index],
      ),
    );
  }
}

class _QuickAccessItem extends StatelessWidget {
  final IconData icon;
  final String label;
  const _QuickAccessItem({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        CircleAvatar(
          radius: 24,
          backgroundColor: Theme.of(context).primaryColor.withAlpha((0.1 * 255).toInt()),
          child: Icon(icon, color: Theme.of(context).primaryColor, size: 28),
        ),
        const SizedBox(height: 6),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }
}
