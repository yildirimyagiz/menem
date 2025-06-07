import 'package:flutter/material.dart';
import '../models/task.dart';

class TaskStatusChip extends StatelessWidget {
  final TaskStatus status;

  const TaskStatusChip({
    super.key,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text(
        status.toString().split('.').last,
        style: TextStyle(
          color: _getTextColor(context),
          fontWeight: FontWeight.bold,
        ),
      ),
      backgroundColor: _getBackgroundColor(),
    );
  }

  Color _getBackgroundColor() {
    switch (status) {
      case TaskStatus.todo:
        return Colors.grey.shade200;
      case TaskStatus.inProgress:
        return Colors.blue.shade100;
      case TaskStatus.completed:
        return Colors.green.shade100;
      case TaskStatus.cancelled:
        return Colors.red.shade100;
    }
  }

  Color _getTextColor(BuildContext context) {
    switch (status) {
      case TaskStatus.todo:
        return Colors.grey.shade800;
      case TaskStatus.inProgress:
        return Colors.blue.shade800;
      case TaskStatus.completed:
        return Colors.green.shade800;
      case TaskStatus.cancelled:
        return Colors.red.shade800;
    }
  }
}
