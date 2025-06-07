import 'package:flutter/material.dart';
import 'dart:convert';
import '../../models/communication_log.dart';

class CommunicationLogEditScreen extends StatefulWidget {
  final CommunicationLog communicationLog;
  const CommunicationLogEditScreen({super.key, required this.communicationLog});

  @override
  State<CommunicationLogEditScreen> createState() =>
      _CommunicationLogEditScreenState();
}

class _CommunicationLogEditScreenState
    extends State<CommunicationLogEditScreen> {
  late TextEditingController _senderIdController;
  late TextEditingController _receiverIdController;
  late TextEditingController _contentController;
  late TextEditingController _entityIdController;
  late TextEditingController _entityTypeController;
  late TextEditingController _metadataController;
  Map<String, dynamic>? _metadata;
  CommunicationType? _type;
  bool _isRead = false;

  @override
  void initState() {
    super.initState();
    final log = widget.communicationLog;
    _senderIdController = TextEditingController(text: log.senderId);
    _receiverIdController = TextEditingController(text: log.receiverId);
    _contentController = TextEditingController(text: log.content);
    _entityIdController = TextEditingController(text: log.entityId ?? '');
    _entityTypeController = TextEditingController(text: log.entityType ?? '');
    _metadata = log.metadata;
    _metadataController = TextEditingController(
        text: _metadata != null ? jsonEncode(_metadata) : '');
    _type = log.type;
    _isRead = log.isRead;
  }

  @override
  void dispose() {
    _senderIdController.dispose();
    _receiverIdController.dispose();
    _contentController.dispose();
    _entityIdController.dispose();
    _entityTypeController.dispose();
    _metadataController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.communicationLog.copyWith(
      senderId: _senderIdController.text.trim(),
      receiverId: _receiverIdController.text.trim(),
      content: _contentController.text.trim(),
      entityId: _entityIdController.text.trim().isNotEmpty
          ? _entityIdController.text.trim()
          : null,
      entityType: _entityTypeController.text.trim().isNotEmpty
          ? _entityTypeController.text.trim()
          : null,
      metadata:
          _metadata, // This will now correctly refer to the state variable
      type: _type,
      isRead: _isRead,
    );
    Navigator.of(context).pop(updated);
  }

  void _updateMetadata() {
    try {
      if (_metadataController.text.trim().isEmpty) {
        setState(() => _metadata = null);
      } else {
        final json =
            jsonDecode(_metadataController.text) as Map<String, dynamic>;
        setState(() {
          _metadata = json;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Invalid JSON in Metadata: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Communication Log'),
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
              controller: _senderIdController,
              decoration: const InputDecoration(labelText: 'Sender ID'),
            ),
            TextField(
              controller: _receiverIdController,
              decoration: const InputDecoration(labelText: 'Receiver ID'),
            ),
            DropdownButtonFormField<CommunicationType>(
              value: _type,
              decoration: const InputDecoration(labelText: 'Type'),
              items: CommunicationType.values
                  .map((t) => DropdownMenuItem(
                        value: t,
                        child: Text(t.name),
                      ))
                  .toList(),
              onChanged: (val) => setState(() => _type = val),
            ),
            SwitchListTile(
              title: const Text('Read'),
              value: _isRead,
              onChanged: (val) => setState(() => _isRead = val),
            ),
            TextField(
              controller: _contentController,
              decoration: const InputDecoration(labelText: 'Content'),
            ),
            TextField(
              controller: _entityIdController,
              decoration: const InputDecoration(labelText: 'Entity ID'),
            ),
            TextField(
              controller: _entityTypeController,
              decoration: const InputDecoration(labelText: 'Entity Type'),
            ),
            TextField(
              controller: _metadataController,
              decoration:
                  const InputDecoration(labelText: 'Metadata (JSON string)'),
              maxLines: 4,
              onChanged: (text) => _updateMetadata(),
            ),
          ],
        ),
      ),
    );
  }
}
