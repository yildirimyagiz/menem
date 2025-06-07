import 'package:flutter/material.dart';
import '../../models/channel.dart';

class ChannelEditScreen extends StatefulWidget {
  final Channel channel;
  const ChannelEditScreen({super.key, required this.channel});

  @override
  State<ChannelEditScreen> createState() => _ChannelEditScreenState();
}

class _ChannelEditScreenState extends State<ChannelEditScreen> {
  late TextEditingController _nameController;
  late TextEditingController _cuidController;
  late TextEditingController _descriptionController;
  late TextEditingController _communicationLogsController;
  ChannelType? _type;
  ChannelCategory? _category;

  @override
  void initState() {
    super.initState();
    final c = widget.channel;
    _nameController = TextEditingController(text: c.name);
    _cuidController = TextEditingController(text: c.cuid);
    _descriptionController = TextEditingController(text: c.description ?? '');
    _communicationLogsController = TextEditingController(text: c.communicationLogs?.toString() ?? '');
    _type = c.type;
    _category = c.category;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _cuidController.dispose();
    _descriptionController.dispose();
    _communicationLogsController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.channel.copyWith(
      name: _nameController.text.trim(),
      cuid: _cuidController.text.trim(),
      description: _descriptionController.text.trim().isNotEmpty
          ? _descriptionController.text.trim()
          : null,
      descriptionExplicitNull: _descriptionController.text.trim().isEmpty,
      communicationLogs: _communicationLogsController.text.isNotEmpty
          ? [ {'data': _communicationLogsController.text} ]
          : null,
      communicationLogsExplicitNull: _communicationLogsController.text.isEmpty,
      type: _type,
      category: _category,
    );
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Channel'),
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: _save,
            tooltip: 'Save',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Name'),
            ),
            TextField(
              controller: _cuidController,
              decoration: const InputDecoration(labelText: 'CUID'),
            ),
            DropdownButtonFormField<ChannelType>(
              value: _type,
              decoration: const InputDecoration(labelText: 'Type'),
              items: ChannelType.values
                  .map((t) => DropdownMenuItem(
                        value: t,
                        child: Text(t.name),
                      ))
                  .toList(),
              onChanged: (val) => setState(() => _type = val),
            ),
            DropdownButtonFormField<ChannelCategory>(
              value: _category,
              decoration: const InputDecoration(labelText: 'Category'),
              items: ChannelCategory.values
                  .map((c) => DropdownMenuItem(
                        value: c,
                        child: Text(c.name),
                      ))
                  .toList(),
              onChanged: (val) => setState(() => _category = val),
            ),
            TextField(
              controller: _descriptionController,
              decoration: const InputDecoration(labelText: 'Description'),
              maxLines: 2,
            ),
            TextField(
              controller: _communicationLogsController,
              decoration: const InputDecoration(labelText: 'Communication Logs (JSON string)'),
            ),
          ],
        ),
      ),
    );
  }
}
