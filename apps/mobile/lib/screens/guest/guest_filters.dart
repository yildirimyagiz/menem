import 'package:flutter/material.dart';
import '../../models/guest.dart';

class GuestFilters extends StatefulWidget {
  final void Function({String? userId, GuestStatus? status}) onChanged;
  const GuestFilters({super.key, required this.onChanged});

  @override
  State<GuestFilters> createState() => _GuestFiltersState();
}

class _GuestFiltersState extends State<GuestFilters> {
  final _userIdController = TextEditingController();
  GuestStatus? _selectedStatus;

  @override
  void dispose() {
    _userIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      userId: _userIdController.text.isEmpty ? null : _userIdController.text,
      status: _selectedStatus,
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
        DropdownButtonFormField<GuestStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: GuestStatus.values
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
