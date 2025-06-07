import 'package:flutter/material.dart';

class SubscriptionHeader extends StatelessWidget {
  final int subscriptionCount;
  final String? title;
  const SubscriptionHeader(
      {super.key, required this.subscriptionCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$subscriptionCount subscriptions found',
            style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
