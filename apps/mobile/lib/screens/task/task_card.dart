import 'package:flutter/material.dart';
import '../../models/task.dart';

class TaskCard extends StatelessWidget {
  final Task task;
  final VoidCallback? onTap;
  const TaskCard({super.key, required this.task, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.task),
        title: Text(task.title),
        subtitle: Text(task.type.toString().split('.').last),
        trailing: Text(task.status.toString().split('.').last),
      ),
    );
  }
}
