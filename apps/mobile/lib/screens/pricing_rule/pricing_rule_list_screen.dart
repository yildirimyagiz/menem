import 'package:flutter/material.dart';
import '../../models/pricing_rule.dart';

import '../../widgets/pricing_rule/pricing_rule_header.dart';
import '../../widgets/pricing_rule/pricing_rule_details.dart';

class PricingRuleListScreen extends StatefulWidget {
  final List<PricingRule> pricingRules;
  final List<String> allTypes;
  const PricingRuleListScreen(
      {super.key, required this.pricingRules, required this.allTypes});

  @override
  State<PricingRuleListScreen> createState() => _PricingRuleListScreenState();
}

class _PricingRuleListScreenState extends State<PricingRuleListScreen> {
  List<String>? _selectedTypes;
  final bool _isLoading = false;
  String? _error;

  List<PricingRule> get _filteredPricingRules {
    if (_selectedTypes == null || _selectedTypes!.isEmpty) {
      return widget.pricingRules;
    }
    return widget.pricingRules
        .where((r) => _selectedTypes!.contains(r.type))
        .toList();
  }

  void _showPricingRuleActions(PricingRule rule) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.visibility),
              title: const Text('View'),
              onTap: () {
                Navigator.pop(context);
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Pricing Rule Details'),
                    content: PricingRuleDetails(pricingRule: rule),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Close'),
                      ),
                    ],
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.edit),
              title: const Text('Edit'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Edit not implemented yet')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete),
              title: const Text('Delete'),
              onTap: () async {
                Navigator.pop(context);
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Delete Pricing Rule'),
                    content: const Text(
                        'Are you sure you want to delete this pricing rule?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context, false),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(context, true),
                        child: const Text('Delete',
                            style: TextStyle(color: Colors.red)),
                      ),
                    ],
                  ),
                );
                if (!mounted) return;
                if (confirm == true) {
                  setState(() {
                    widget.pricingRules.remove(rule);
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    // ignore: use_build_context_synchronously
                    const SnackBar(content: Text('Pricing rule deleted')),
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pricing Rules')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Text(_error!,
                      style: TextStyle(
                          color: Theme.of(context).colorScheme.error)))
              : Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      PricingRuleHeader(
                          pricingRuleCount: _filteredPricingRules.length),
                      const SizedBox(height: 8),
                      const SizedBox(height: 12),
                      Expanded(
                        child: ListView.separated(
                          itemCount: _filteredPricingRules.length,
                          separatorBuilder: (_, __) => const Divider(),
                          itemBuilder: (context, i) {
                            final rule = _filteredPricingRules[i];
                            return ListTile(
                              leading: Icon(Icons.rule,
                                  color: Theme.of(context).colorScheme.primary),
                              title: Text(rule.name),
                              subtitle:
                                  Text(rule.type.toString().split('.').last),
                              trailing: IconButton(
                                icon: const Icon(Icons.more_vert),
                                onPressed: () => _showPricingRuleActions(rule),
                              ),
                              onTap: () => _showPricingRuleActions(rule),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}
