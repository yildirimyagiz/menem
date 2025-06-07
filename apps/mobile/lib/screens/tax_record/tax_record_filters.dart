import 'package:flutter/material.dart';

class TaxRecordFilters extends StatefulWidget {
  final void Function({String? propertyId, int? year, bool? paid}) onChanged;
  const TaxRecordFilters({super.key, required this.onChanged});

  @override
  State<TaxRecordFilters> createState() => _TaxRecordFiltersState();
}

class _TaxRecordFiltersState extends State<TaxRecordFilters> {
  final _propertyIdController = TextEditingController();
  final _yearController = TextEditingController();
  bool? _paid;

  @override
  void dispose() {
    _propertyIdController.dispose();
    _yearController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    int? year = int.tryParse(_yearController.text);
    widget.onChanged(
      propertyId: _propertyIdController.text.isEmpty ? null : _propertyIdController.text,
      year: year,
      paid: _paid,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _propertyIdController,
          decoration: const InputDecoration(labelText: 'Property ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _yearController,
          decoration: const InputDecoration(labelText: 'Year'),
          keyboardType: TextInputType.number,
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<bool>(
          value: _paid,
          decoration: const InputDecoration(labelText: 'Paid'),
          items: const [
            DropdownMenuItem(value: null, child: Text('Any')),
            DropdownMenuItem(value: true, child: Text('Paid')),
            DropdownMenuItem(value: false, child: Text('Unpaid')),
          ],
          onChanged: (value) {
            setState(() => _paid = value);
            _onFilterChanged();
          },
        ),
      ],
    );
  }
}
