import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/task.dart';
import '../../providers/task_provider.dart';
import 'package:intl/intl.dart';

class TaskFilterDialog extends ConsumerStatefulWidget {
  const TaskFilterDialog({super.key});

  @override
  ConsumerState<TaskFilterDialog> createState() => _TaskFilterDialogState();
}

class _TaskFilterDialogState extends ConsumerState<TaskFilterDialog> {
  final Set<TaskStatus> _selectedStatuses = {};
  final Set<TaskPriority> _selectedPriorities = {};
  final Set<TaskType> _selectedTypes = {};
  DateTime? _dueDateFrom;
  DateTime? _dueDateTo;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Filter Tasks'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildFilterSection(
              'Status',
              TaskStatus.values,
              _selectedStatuses,
              (status) {
                setState(() {
                  if (_selectedStatuses.contains(status)) {
                    _selectedStatuses.remove(status);
                  } else {
                    _selectedStatuses.add(status);
                  }
                });
              },
            ),
            const SizedBox(height: 16),
            _buildFilterSection(
              'Priority',
              TaskPriority.values,
              _selectedPriorities,
              (priority) {
                setState(() {
                  if (_selectedPriorities.contains(priority)) {
                    _selectedPriorities.remove(priority);
                  } else {
                    _selectedPriorities.add(priority);
                  }
                });
              },
            ),
            const SizedBox(height: 16),
            _buildFilterSection(
              'Type',
              TaskType.values,
              _selectedTypes,
              (type) {
                setState(() {
                  if (_selectedTypes.contains(type)) {
                    _selectedTypes.remove(type);
                  } else {
                    _selectedTypes.add(type);
                  }
                });
              },
            ),
            const SizedBox(height: 16),
            _buildDateRangeSection(),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            setState(() {
              _selectedStatuses.clear();
              _selectedPriorities.clear();
              _selectedTypes.clear();
              _dueDateFrom = null;
              _dueDateTo = null;
            });
          },
          child: const Text('Reset'),
        ),
        ElevatedButton(
          onPressed: () {
            ref.read(taskListNotifierProvider.notifier).filterTasksClientSide(
                  statuses: _selectedStatuses.isEmpty
                      ? null
                      : _selectedStatuses.toList(),
                  priorities: _selectedPriorities.isEmpty
                      ? null
                      : _selectedPriorities.toList(),
                  types:
                      _selectedTypes.isEmpty ? null : _selectedTypes.toList(),
                  dueDateFrom: _dueDateFrom,
                  dueDateTo: _dueDateTo,
                );
            Navigator.pop(context);
          },
          child: const Text('Apply'),
        ),
      ],
    );
  }

  Widget _buildFilterSection<T>(
    String title,
    List<T> options,
    Set<T> selectedOptions,
    Function(T) onChanged,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: options.map((option) {
            return FilterChip(
              label: Text((option as Enum).name), // Use .name for enums
              selected: selectedOptions.contains(option),
              onSelected: (selected) {
                onChanged(option);
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildDateRangeSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Due Date Range',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: TextButton.icon(
                onPressed: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: _dueDateFrom ?? DateTime.now(),
                    firstDate: DateTime(2000),
                    lastDate: DateTime(2100),
                  );
                  if (date != null) {
                    setState(() {
                      _dueDateFrom = date;
                    });
                  }
                },
                icon: const Icon(Icons.calendar_today),
                label: Text(
                  _dueDateFrom != null
                      ? 'From: ${DateFormat.yMd().format(_dueDateFrom!)}'
                      : 'From: Select Date',
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextButton.icon(
                onPressed: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: _dueDateTo ?? DateTime.now(),
                    firstDate: DateTime(2000),
                    lastDate: DateTime(2100),
                  );
                  if (date != null) {
                    setState(() {
                      _dueDateTo = date;
                    });
                  }
                },
                icon: const Icon(Icons.calendar_today),
                label: Text(
                  _dueDateTo != null
                      ? 'To: ${DateFormat.yMd().format(_dueDateTo!)}'
                      : 'To: Select Date',
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
