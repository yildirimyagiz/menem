import 'package:flutter/material.dart';
import '../../models/discount.dart';
import 'package:intl/intl.dart';

class DiscountCard extends StatelessWidget {
  final Discount discount;
  final VoidCallback? onTap;
  const DiscountCard({super.key, required this.discount, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.local_offer),
        title: Text(discount.code),
        subtitle: Text(
            '${discount.type.toString().split('.').last} • ${discount.value}'),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Chip(
              label: Text(discount.status.toString().split('.').last),
              backgroundColor: _statusColor(discount.status),
            ),
            Text(DateFormat.yMMMd().format(discount.startDate)),
          ],
        ),
      ),
    );
  }

  Color _statusColor(DiscountStatus status) {
    switch (status) {
      case DiscountStatus.active:
        return Colors.green.shade100;
      case DiscountStatus.inactive:
        return Colors.grey.shade300;
      case DiscountStatus.expired:
        return Colors.red.shade100;
    }
  }
}
