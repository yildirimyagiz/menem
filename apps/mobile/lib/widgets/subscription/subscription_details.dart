import 'package:flutter/material.dart';
import '../../models/subscription.dart';

class SubscriptionDetails extends StatelessWidget {
  final Subscription subscription;
  const SubscriptionDetails({super.key, required this.subscription});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Subscription: ${subscription.id}', style: Theme.of(context).textTheme.titleLarge),
        Text('User: ${subscription.userId}'),
        // Add more fields as needed
      ],
    );
  }
}
