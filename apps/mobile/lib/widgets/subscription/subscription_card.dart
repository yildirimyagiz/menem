import 'package:flutter/material.dart';
import '../../models/subscription.dart';
import 'subscription_details.dart';

class SubscriptionCard extends StatelessWidget {
  final Subscription subscription;
  final VoidCallback? onTap;

  const SubscriptionCard({super.key, required this.subscription, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: SubscriptionDetails(subscription: subscription),
        ),
      ),
    );
  }
}
