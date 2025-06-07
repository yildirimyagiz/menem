import 'package:flutter/material.dart';

class SummaryStatisticsSection extends StatelessWidget {
  const SummaryStatisticsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        StatCard(
          title: 'Total Properties',
          value: '32',
          subtitle: 'Occupancy Rate: 84.4%',
          icon: Icons.apartment,
          color: Colors.blue[700],
        ),
        StatCard(
          title: 'Monthly Cashflow',
          value: '₺42,500.00',
          subtitle: 'Pending Payments: 7',
          icon: Icons.account_balance_wallet,
          color: Colors.lightBlue[600],
        ),
        StatCard(
          title: 'Pending Tasks',
          value: '23',
          subtitle: '-5 this week',
          icon: Icons.assignment_late,
          color: Colors.indigo[400],
        ),
        StatCard(
          title: 'Total Tenants',
          value: '42',
          subtitle: 'New Tenants: 5',
          icon: Icons.people,
          color: Colors.cyan[600],
        ),
      ],
    );
  }
}

class StatCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData? icon;
  final Color? color;
  const StatCard({required this.title, required this.value, required this.subtitle, this.icon, this.color, super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: color?.withAlpha((0.08 * 255).toInt()) ?? Theme.of(context).colorScheme.surface,
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        child: Row(
          children: [
            if (icon != null)
              Container(
                decoration: BoxDecoration(
                  color: color?.withAlpha((0.18 * 255).toInt()) ?? Theme.of(context).primaryColor.withAlpha((0.12 * 255).toInt()),
                  shape: BoxShape.circle,
                ),
                padding: const EdgeInsets.all(10),
                child: Icon(icon, color: color ?? Theme.of(context).primaryColor, size: 28),
              ),
            if (icon != null) const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: TextStyle(color: Colors.grey[700], fontSize: 13)),
                ],
              ),
            ),
            const SizedBox(width: 10),
            Text(
              value,
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color ?? Theme.of(context).primaryColor),
            ),
          ],
        ),
      ),
    );
  }
}
