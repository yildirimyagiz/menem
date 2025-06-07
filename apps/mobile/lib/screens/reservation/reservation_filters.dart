import 'package:flutter/material.dart';
import '../../models/reservation.dart';

class ReservationFilters extends StatefulWidget {
  final void Function({String? propertyId, String? userId, ReservationType? type, ReservationStatus? status}) onChanged;
  const ReservationFilters({super.key, required this.onChanged});

  @override
  State<ReservationFilters> createState() => _ReservationFiltersState();
}

class _ReservationFiltersState extends State<ReservationFilters> {
  final _propertyIdController = TextEditingController();
  final _userIdController = TextEditingController();
  ReservationType? _selectedType;
  ReservationStatus? _selectedStatus;

  @override
  void dispose() {
    _propertyIdController.dispose();
    _userIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      propertyId: _propertyIdController.text.isEmpty ? null : _propertyIdController.text,
      userId: _userIdController.text.isEmpty ? null : _userIdController.text,
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
          controller: _propertyIdController,
          decoration: const InputDecoration(labelText: 'Property ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _userIdController,
          decoration: const InputDecoration(labelText: 'User ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<ReservationType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: ReservationType.values
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
        DropdownButtonFormField<ReservationStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: ReservationStatus.values
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
