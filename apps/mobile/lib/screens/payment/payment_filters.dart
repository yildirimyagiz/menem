import 'package:flutter/material.dart';
import '../../models/payment.dart';

class PaymentFilters extends StatefulWidget {
  final void Function({String? userId, PaymentStatus? status, PaymentType? type, PaymentMethod? method}) onChanged;
  const PaymentFilters({super.key, required this.onChanged});

  @override
  State<PaymentFilters> createState() => _PaymentFiltersState();
}

class _PaymentFiltersState extends State<PaymentFilters> {
  final _userIdController = TextEditingController();
  PaymentStatus? _selectedStatus;
  PaymentType? _selectedType;
  PaymentMethod? _selectedMethod;

  @override
  void dispose() {
    _userIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      userId: _userIdController.text.isEmpty ? null : _userIdController.text,
      status: _selectedStatus,
      type: _selectedType,
      method: _selectedMethod,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _userIdController,
          decoration: const InputDecoration(labelText: 'User ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<PaymentStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: PaymentStatus.values
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
        DropdownButtonFormField<PaymentType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: PaymentType.values
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
        DropdownButtonFormField<PaymentMethod>(
          value: _selectedMethod,
          decoration: const InputDecoration(labelText: 'Method'),
          items: PaymentMethod.values
              .map((method) => DropdownMenuItem(
                    value: method,
                    child: Text(method.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (method) {
            setState(() => _selectedMethod = method);
            _onFilterChanged();
          },
        ),
      ],
    );
  }
}
