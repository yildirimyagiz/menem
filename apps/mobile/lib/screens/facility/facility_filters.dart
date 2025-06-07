import 'package:flutter/material.dart';
import '../../models/facility.dart';

class FacilityFilters extends StatefulWidget {
  final void Function({String? name, FacilityType? type, FacilityStatus? status}) onChanged;
  const FacilityFilters({super.key, required this.onChanged});

  @override
  State<FacilityFilters> createState() => _FacilityFiltersState();
}

class _FacilityFiltersState extends State<FacilityFilters> {
  final _nameController = TextEditingController();
  FacilityType? _selectedType;
  FacilityStatus? _selectedStatus;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      name: _nameController.text.isEmpty ? null : _nameController.text,
      type: _selectedType,
      status: _selectedStatus,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _nameController,
          decoration: const InputDecoration(labelText: 'Name'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<FacilityType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: FacilityType.values
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
        DropdownButtonFormField<FacilityStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: FacilityStatus.values
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
