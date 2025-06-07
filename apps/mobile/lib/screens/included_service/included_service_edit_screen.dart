import 'package:flutter/material.dart';
import '../../models/included_service.dart';

class IncludedServiceEditScreen extends StatefulWidget {
  final IncludedService includedService;
  const IncludedServiceEditScreen({super.key, required this.includedService});

  @override
  State<IncludedServiceEditScreen> createState() => _IncludedServiceEditScreenState();
}

class _IncludedServiceEditScreenState extends State<IncludedServiceEditScreen> {
  late TextEditingController _nameController;
  late TextEditingController _descriptionController;

  @override
  void initState() {
    super.initState();
    final s = widget.includedService;
    _nameController = TextEditingController(text: s.name);
    _descriptionController = TextEditingController(text: s.description ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.includedService.copyWith(
      name: _nameController.text.trim(),
      description: _descriptionController.text.trim().isNotEmpty ? _descriptionController.text.trim() : null,
    );
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Included Service'),
        actions: [IconButton(icon: const Icon(Icons.save), onPressed: _save)],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(controller: _nameController, decoration: const InputDecoration(labelText: 'Name')),
            TextField(controller: _descriptionController, decoration: const InputDecoration(labelText: 'Description')),
          ],
        ),
      ),
    );
  }
}
