import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../providers/task_provider.dart';
import '../../widgets/task_status_chip.dart';
import '../../widgets/task_priority_chip.dart';

class TaskDetailScreen extends ConsumerWidget {
  final String taskId;

  const TaskDetailScreen({
    super.key,
    required this.taskId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final taskState = ref.watch(taskNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Task Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // TODO: Navigate to edit task screen
            },
          ),
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Delete Task'),
                  content: const Text(
                    'Are you sure you want to delete this task? This action cannot be undone.',
                  ),
                  actions: [
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: const Text('Cancel'),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        ref.read(taskNotifierProvider.notifier).deleteTask(taskId);
                        Navigator.pop(context); // Close dialog
                        Navigator.pop(context); // Return to list
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                      ),
                      child: const Text('Delete'),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: taskState.when(
        data: (task) {
          if (task == null) {
            return const Center(
              child: Text('Task not found'),
            );
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  task.title,
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    TaskStatusChip(status: task.status),
                    const SizedBox(width: 8),
                    TaskPriorityChip(priority: task.priority),
                  ],
                ),
                const SizedBox(height: 24),
                if (task.description != null) ...[
                  Text(
                    'Description',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 8),
                  Text(task.description!),
                  const SizedBox(height: 24),
                ],
                _buildInfoSection(
                  context,
                  'Details',
                  [
                    _buildInfoRow('Type', task.type.toString().split('.').last),
                    if (task.dueDate != null)
                      _buildInfoRow(
                        'Due Date',
                        DateFormat('MMM d, y').format(task.dueDate!),
                      ),
                    if (task.completedAt != null)
                      _buildInfoRow(
                        'Completed At',
                        DateFormat('MMM d, y').format(task.completedAt!),
                      ),
                    _buildInfoRow(
                      'Created At',
                      task.createdAt != null
                          ? DateFormat('MMM d, y').format(task.createdAt!)
                          : 'N/A',
                    ),
                    _buildInfoRow(
                      'Updated At',
                      task.updatedAt != null
                          ? DateFormat('MMM d, y').format(task.updatedAt!)
                          : 'N/A',
                    ),
                  ],
                ),
                if (task.assignedTo != null) ...[
                  const SizedBox(height: 24),
                  _buildInfoSection(
                    context,
                    'Assigned To',
                    [
                      _buildInfoRow('Name', task.assignedTo!.name),
                      _buildInfoRow('Email', task.assignedTo!.email),
                    ],
                  ),
                ],
                if (task.property != null) ...[
                  const SizedBox(height: 24),
                  _buildInfoSection(
                    context,
                    'Property',
                    [
                      _buildInfoRow('Title', task.property!.title),
                      _buildInfoRow(
                        'Type',
                        task.property!.propertyType.toString().split('.').last,
                      ),
                      _buildInfoRow(
                        'Status',
                        task.property!.propertyStatus
                            .toString()
                            .split('.')
                            .last,
                      ),
                    ],
                  ),
                ],
              ],
            ),
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, stackTrace) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Error: ${error.toString()}'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  ref.read(taskNotifierProvider.notifier).getTask(taskId);
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoSection(
    BuildContext context,
    String title,
    List<Widget> children,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 8),
        ...children,
      ],
    );
  }

  Widget _buildInfoRow(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            child: Text(value ?? 'N/A'),
          ),
        ],
      ),
    );
  }
}
