import 'package:flutter/material.dart';
import '../../models/task.dart';

class TaskFilters extends StatefulWidget {
  final void Function({String? title, TaskStatus? status, TaskPriority? priority, TaskType? type, String? assignedToId, String? propertyId}) onChanged;
  const TaskFilters({super.key, required this.onChanged});

  @override
  State<TaskFilters> createState() => _TaskFiltersState();
}

class _TaskFiltersState extends State<TaskFilters> {
  final _titleController = TextEditingController();
  final _assignedToIdController = TextEditingController();
  final _propertyIdController = TextEditingController();
  TaskStatus? _selectedStatus;
  TaskPriority? _selectedPriority;
  TaskType? _selectedType;

  @override
  void dispose() {
    _titleController.dispose();
    _assignedToIdController.dispose();
    _propertyIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      title: _titleController.text.isEmpty ? null : _titleController.text,
      status: _selectedStatus,
      priority: _selectedPriority,
      type: _selectedType,
      assignedToId: _assignedToIdController.text.isEmpty ? null : _assignedToIdController.text,
      propertyId: _propertyIdController.text.isEmpty ? null : _propertyIdController.text,
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
        DropdownButtonFormField<TaskStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: TaskStatus.values
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
        DropdownButtonFormField<TaskPriority>(
          value: _selectedPriority,
          decoration: const InputDecoration(labelText: 'Priority'),
          items: TaskPriority.values
              .map((priority) => DropdownMenuItem(
                    value: priority,
                    child: Text(priority.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (priority) {
            setState(() => _selectedPriority = priority);
            _onFilterChanged();
          },
        ),
        DropdownButtonFormField<TaskType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: TaskType.values
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
        TextField(
          controller: _assignedToIdController,
          decoration: const InputDecoration(labelText: 'Assigned To'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _propertyIdController,
          decoration: const InputDecoration(labelText: 'Property ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
      ],
    );
  }
}
