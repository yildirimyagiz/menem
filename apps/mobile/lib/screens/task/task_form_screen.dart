import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/models/task.dart'; // Adjust path
// Import your task provider
// import 'package:mobile/providers/task_provider.dart';

class TaskFormScreen extends ConsumerStatefulWidget {
  final Task? task; // Pass task for editing, null for creating

  const TaskFormScreen({super.key, this.task});

  @override
  ConsumerState<TaskFormScreen> createState() => _TaskFormScreenState();
}

class _TaskFormScreenState extends ConsumerState<TaskFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  TaskStatus _selectedStatus = TaskStatus.todo;
  TaskPriority _selectedPriority = TaskPriority.low;
  DateTime? _dueDate;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.task?.title ?? '');
    _descriptionController =
        TextEditingController(text: widget.task?.description ?? '');
    _selectedStatus = widget.task?.status ?? TaskStatus.todo;
    _selectedPriority = widget.task?.priority ?? TaskPriority.low;
    _dueDate = widget.task?.dueDate;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _selectDueDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _dueDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != _dueDate) {
      setState(() {
        _dueDate = picked;
      });
    }
  }

  void _submitForm() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() => _isLoading = true);

      try {
        if (widget.task == null) {
          // await ref.read(taskNotifierProvider.notifier).createTask(taskData);
          ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Task created (Mock)')));
        } else {
          // await ref.read(taskNotifierProvider.notifier).updateTask(widget.task!.id, taskData);
          ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Task updated (Mock)')));
        }
        if (mounted) Navigator.of(context).pop();
      } catch (e) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Error: $e')));
      } finally {
        if (mounted) setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.task == null ? 'Add Task' : 'Edit Task'),
        actions: [
          if (_isLoading)
            const Padding(
                padding: EdgeInsets.all(16.0),
                child: CircularProgressIndicator(color: Colors.white)),
          if (!_isLoading)
            IconButton(icon: const Icon(Icons.save), onPressed: _submitForm),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16.0),
          children: <Widget>[
            TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Title'),
                validator: (v) => v!.isEmpty ? 'Required' : null),
            TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(labelText: 'Description'),
                maxLines: 3),
            DropdownButtonFormField<TaskStatus>(
                value: _selectedStatus,
                items: TaskStatus.values
                    .map((s) => DropdownMenuItem(value: s, child: Text(s.name)))
                    .toList(),
                onChanged: (v) => setState(() => _selectedStatus = v!),
                decoration: const InputDecoration(labelText: 'Status')),
            DropdownButtonFormField<TaskPriority>(
                value: _selectedPriority,
                items: TaskPriority.values
                    .map((p) => DropdownMenuItem(value: p, child: Text(p.name)))
                    .toList(),
                onChanged: (v) => setState(() => _selectedPriority = v!),
                decoration: const InputDecoration(labelText: 'Priority')),
            ListTile(
                title: Text(
                    'Due Date: ${_dueDate == null ? "Not set" : _dueDate!.toLocal().toString().split(' ')[0]}'),
                trailing: const Icon(Icons.calendar_today),
                onTap: () => _selectDueDate(context)),
            // Add fields for assignee, related property/project etc.
          ],
        ),
      ),
    );
  }
}
