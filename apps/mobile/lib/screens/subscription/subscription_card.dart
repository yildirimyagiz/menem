import 'package:flutter/material.dart';
import '../../models/subscription.dart';
import 'package:intl/intl.dart';

class SubscriptionCard extends StatelessWidget {
  final Subscription subscription;
  final VoidCallback? onTap;
  const SubscriptionCard({super.key, required this.subscription, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.subscriptions),
        title: Text(subscription.plan.toString().split('.').last),
        subtitle: Text(subscription.status.toString().split('.').last),
        trailing: Text(DateFormat.yMMMd().format(subscription.startDate)),
      ),
    );
  }
}
