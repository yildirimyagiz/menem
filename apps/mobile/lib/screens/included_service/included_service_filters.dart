import 'package:flutter/material.dart';

class IncludedServiceFilters extends StatefulWidget {
  final void Function({String? name, String? facilityId}) onChanged;
  const IncludedServiceFilters({super.key, required this.onChanged});

  @override
  State<IncludedServiceFilters> createState() => _IncludedServiceFiltersState();
}

class _IncludedServiceFiltersState extends State<IncludedServiceFilters> {
  final _nameController = TextEditingController();
  final _facilityIdController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _facilityIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      name: _nameController.text.isEmpty ? null : _nameController.text,
      facilityId: _facilityIdController.text.isEmpty ? null : _facilityIdController.text,
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
        TextField(
          controller: _facilityIdController,
          decoration: const InputDecoration(labelText: 'Facility ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
      ],
    );
  }
}
