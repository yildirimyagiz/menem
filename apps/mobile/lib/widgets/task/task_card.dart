import 'package:flutter/material.dart';
import 'package:mobile/models/task.dart'; // Adjust path to your Task model
// Assuming you have this
import 'package:mobile/widgets/task_priority_chip.dart';
import 'package:mobile/widgets/task_status_chip.dart'; // Assuming you have this
import 'package:intl/intl.dart'; // For date formatting

class TaskCard extends StatelessWidget {
  final Task task;
  final VoidCallback? onTap;

  const TaskCard({super.key, required this.task, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(task.title, style: Theme.of(context).textTheme.titleMedium),
              if (task.description != null && task.description!.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(task.description!,
                    style: Theme.of(context).textTheme.bodySmall,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis),
              ],
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TaskStatusChip(status: task.status), // Pass the actual enum
                  TaskPriorityChip(
                      priority: task.priority), // Pass the actual enum
                ],
              ),
              if (task.dueDate != null) ...[
                const SizedBox(height: 8),
                Text('Due: ${DateFormat.yMd().format(task.dueDate!.toLocal())}',
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall), // Simple date format
              ],
            ],
          ),
        ),
      ),
    );
  }
}
