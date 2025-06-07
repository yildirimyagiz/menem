import 'package:flutter/material.dart';
import '../../models/subscription.dart';
import '../../widgets/subscription/subscription_card.dart';
import '../../widgets/subscription/subscription_filters.dart';
import '../../widgets/subscription/subscription_header.dart';

class SubscriptionListScreen extends StatefulWidget {
  final List<Subscription> subscriptions;
  final List<String> allTypes;
  const SubscriptionListScreen(
      {super.key, required this.subscriptions, required this.allTypes});

  @override
  State<SubscriptionListScreen> createState() => _SubscriptionListScreenState();
}

class _SubscriptionListScreenState extends State<SubscriptionListScreen> {
  List<String>? _selectedTypes;

  List<Subscription> get _filteredSubscriptions {
    if (_selectedTypes == null || _selectedTypes!.isEmpty) {
      return widget.subscriptions;
    }
    return widget.subscriptions
        .where((s) => _selectedTypes!.contains(s.type))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Subscriptions')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SubscriptionHeader(
                subscriptionCount: _filteredSubscriptions.length),
            const SizedBox(height: 8),
            SubscriptionFilters(
              allTypes: widget.allTypes,
              onFilterChanged: ({types}) =>
                  setState(() => _selectedTypes = types),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: _filteredSubscriptions.length,
                itemBuilder: (context, i) => SubscriptionCard(
                  subscription: _filteredSubscriptions[i],
                  onTap: () {
                    // Navigate to detail if needed
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
