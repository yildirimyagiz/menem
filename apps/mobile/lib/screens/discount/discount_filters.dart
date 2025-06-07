import 'package:flutter/material.dart';
import '../../models/discount.dart';

class DiscountFilters extends StatefulWidget {
  final void Function({String? name, String? code, DiscountType? type, bool? isActive}) onChanged;
  const DiscountFilters({super.key, required this.onChanged});

  @override
  State<DiscountFilters> createState() => _DiscountFiltersState();
}

class _DiscountFiltersState extends State<DiscountFilters> {
  final _nameController = TextEditingController();
  final _codeController = TextEditingController();
  DiscountType? _selectedType;
  bool? _isActive;

  @override
  void dispose() {
    _nameController.dispose();
    _codeController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      name: _nameController.text.isEmpty ? null : _nameController.text,
      code: _codeController.text.isEmpty ? null : _codeController.text,
      type: _selectedType,
      isActive: _isActive,
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
          controller: _codeController,
          decoration: const InputDecoration(labelText: 'Code'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<DiscountType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: DiscountType.values
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
        DropdownButtonFormField<bool>(
          value: _isActive,
          decoration: const InputDecoration(labelText: 'Active'),
          items: const [
            DropdownMenuItem(value: null, child: Text('Any')),
            DropdownMenuItem(value: true, child: Text('Active')),
            DropdownMenuItem(value: false, child: Text('Inactive')),
          ],
          onChanged: (val) {
            setState(() => _isActive = val);
            _onFilterChanged();
          },
        ),
      ],
    );
  }
}
