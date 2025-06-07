import 'package:flutter/material.dart';
import '../models/task.dart';

class TaskPriorityChip extends StatelessWidget {
  final TaskPriority priority;

  const TaskPriorityChip({
    super.key,
    required this.priority,
  });

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text(
        priority.toString().split('.').last,
        style: TextStyle(
          color: _getTextColor(context),
          fontWeight: FontWeight.bold,
        ),
      ),
      backgroundColor: _getBackgroundColor(),
    );
  }

  Color _getBackgroundColor() {
    switch (priority) {
      case TaskPriority.low:
        return Colors.grey.shade100;
      case TaskPriority.medium:
        return Colors.blue.shade100;
      case TaskPriority.high:
        return Colors.orange.shade100;
      case TaskPriority.urgent:
        return Colors.red.shade100;
    }
  }

  Color _getTextColor(BuildContext context) {
    switch (priority) {
      case TaskPriority.low:
        return Colors.grey.shade800;
      case TaskPriority.medium:
        return Colors.blue.shade800;
      case TaskPriority.high:
        return Colors.orange.shade800;
      case TaskPriority.urgent:
        return Colors.red.shade800;
    }
  }
}
