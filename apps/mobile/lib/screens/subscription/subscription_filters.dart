import 'package:flutter/material.dart';
import '../../models/subscription.dart';

class SubscriptionFilters extends StatefulWidget {
  final void Function({String? entityId, SubscriptionPlan? plan, SubscriptionStatus? status}) onChanged;
  const SubscriptionFilters({super.key, required this.onChanged});

  @override
  State<SubscriptionFilters> createState() => _SubscriptionFiltersState();
}

class _SubscriptionFiltersState extends State<SubscriptionFilters> {
  final _entityIdController = TextEditingController();
  SubscriptionPlan? _selectedPlan;
  SubscriptionStatus? _selectedStatus;

  @override
  void dispose() {
    _entityIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      entityId: _entityIdController.text.isEmpty ? null : _entityIdController.text,
      plan: _selectedPlan,
      status: _selectedStatus,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _entityIdController,
          decoration: const InputDecoration(labelText: 'Entity ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<SubscriptionPlan>(
          value: _selectedPlan,
          decoration: const InputDecoration(labelText: 'Plan'),
          items: SubscriptionPlan.values
              .map((plan) => DropdownMenuItem(
                    value: plan,
                    child: Text(plan.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (plan) {
            setState(() => _selectedPlan = plan);
            _onFilterChanged();
          },
        ),
        DropdownButtonFormField<SubscriptionStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: SubscriptionStatus.values
              .map((status) => DropdownMenuItem(
                    value: status,
                    child: Text(status.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (status) {
            setState(() => _selectedStatus = status);
            _onFilterChanged();
          },
        ),
      ],
    );
  }
}
