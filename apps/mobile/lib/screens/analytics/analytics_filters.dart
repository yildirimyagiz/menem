import 'package:flutter/material.dart';
import '../../models/analytics.dart';

class AnalyticsFilters extends StatefulWidget {
  final void Function({String? entityId, String? entityType, AnalyticsType? type, String? userId, String? propertyId, String? agencyId, String? agentId}) onChanged;
  const AnalyticsFilters({super.key, required this.onChanged});

  @override
  State<AnalyticsFilters> createState() => _AnalyticsFiltersState();
}

class _AnalyticsFiltersState extends State<AnalyticsFilters> {
  final _entityIdController = TextEditingController();
  final _entityTypeController = TextEditingController();
  final _userIdController = TextEditingController();
  final _propertyIdController = TextEditingController();
  final _agencyIdController = TextEditingController();
  final _agentIdController = TextEditingController();
  AnalyticsType? _selectedType;

  @override
  void dispose() {
    _entityIdController.dispose();
    _entityTypeController.dispose();
    _userIdController.dispose();
    _propertyIdController.dispose();
    _agencyIdController.dispose();
    _agentIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      entityId: _entityIdController.text.isEmpty ? null : _entityIdController.text,
      entityType: _entityTypeController.text.isEmpty ? null : _entityTypeController.text,
      type: _selectedType,
      userId: _userIdController.text.isEmpty ? null : _userIdController.text,
      propertyId: _propertyIdController.text.isEmpty ? null : _propertyIdController.text,
      agencyId: _agencyIdController.text.isEmpty ? null : _agencyIdController.text,
      agentId: _agentIdController.text.isEmpty ? null : _agentIdController.text,
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
        TextField(
          controller: _entityTypeController,
          decoration: const InputDecoration(labelText: 'Entity Type'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _userIdController,
          decoration: const InputDecoration(labelText: 'User ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _propertyIdController,
          decoration: const InputDecoration(labelText: 'Property ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _agencyIdController,
          decoration: const InputDecoration(labelText: 'Agency ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _agentIdController,
          decoration: const InputDecoration(labelText: 'Agent ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<AnalyticsType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: AnalyticsType.values
              .map((type) => DropdownMenuItem(
                    value: type,
                    child: Text(type.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (type) {
            setState(() => _selectedType = type);
            _onFilterChanged();
          },
        ),
      ],
    );
  }
}
