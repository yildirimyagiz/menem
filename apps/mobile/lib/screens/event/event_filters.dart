import 'package:flutter/material.dart';
import '../../models/event.dart';

class EventFilters extends StatefulWidget {
  final void Function({String? title, EventType? type, EventStatus? status}) onChanged;
  const EventFilters({super.key, required this.onChanged});

  @override
  State<EventFilters> createState() => _EventFiltersState();
}

class _EventFiltersState extends State<EventFilters> {
  final _titleController = TextEditingController();
  EventType? _selectedType;
  EventStatus? _selectedStatus;

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      title: _titleController.text.isEmpty ? null : _titleController.text,
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
          controller: _titleController,
          decoration: const InputDecoration(labelText: 'Title'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<EventType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: EventType.values
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
        DropdownButtonFormField<EventStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: EventStatus.values
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
