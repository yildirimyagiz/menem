import 'package:flutter/material.dart';
import '../../models/analytics.dart';

class AnalyticsEditScreen extends StatefulWidget {
  final Analytics analytics;

  const AnalyticsEditScreen({super.key, required this.analytics});

  @override
  State<AnalyticsEditScreen> createState() => _AnalyticsEditScreenState();
}

class _AnalyticsEditScreenState extends State<AnalyticsEditScreen> {
  late TextEditingController _entityIdController;
  late TextEditingController _entityTypeController;
  late TextEditingController _dataController;
  late TextEditingController _propertyIdController;
  late TextEditingController _userIdController;
  late TextEditingController _agentIdController;
  late TextEditingController _agencyIdController;
  late TextEditingController _reservationIdController;
  late TextEditingController _taskIdController;
  AnalyticsType? _type;
  DateTime? _timestamp;

  @override
  void initState() {
    super.initState();
    final a = widget.analytics;
    _entityIdController = TextEditingController(text: a.entityId);
    _entityTypeController = TextEditingController(text: a.entityType);
    _dataController = TextEditingController(text: a.data.toString());
    _propertyIdController = TextEditingController(text: a.propertyId ?? '');
    _userIdController = TextEditingController(text: a.userId ?? '');
    _agentIdController = TextEditingController(text: a.agentId ?? '');
    _agencyIdController = TextEditingController(text: a.agencyId ?? '');
    _reservationIdController =
        TextEditingController(text: a.reservationId ?? '');
    _taskIdController = TextEditingController(text: a.taskId ?? '');
    _type = a.type;
    _timestamp = a.timestamp;
  }

  @override
  void dispose() {
    _entityIdController.dispose();
    _entityTypeController.dispose();
    _dataController.dispose();
    _propertyIdController.dispose();
    _userIdController.dispose();
    _agentIdController.dispose();
    _agencyIdController.dispose();
    _reservationIdController.dispose();
    _taskIdController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.analytics.copyWith(
      entityId: _entityIdController.text.trim(),
      entityType: _entityTypeController.text.trim(),
      data: {
        'data': _dataController.text
      }, // For now, treat as stringified JSON
      propertyId: _propertyIdController.text.trim().isNotEmpty
          ? _propertyIdController.text.trim()
          : null,
      userId: _userIdController.text.trim().isNotEmpty
          ? _userIdController.text.trim()
          : null,
      agentId: _agentIdController.text.trim().isNotEmpty
          ? _agentIdController.text.trim()
          : null,
      agencyId: _agencyIdController.text.trim().isNotEmpty
          ? _agencyIdController.text.trim()
          : null,
      reservationId: _reservationIdController.text.trim().isNotEmpty
          ? _reservationIdController.text.trim()
          : null,
      taskId: _taskIdController.text.trim().isNotEmpty
          ? _taskIdController.text.trim()
          : null,
      type: _type,
      timestamp: _timestamp,
    );
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Analytics'),
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
            DropdownButtonFormField<AnalyticsType>(
              value: _type,
              decoration: const InputDecoration(labelText: 'Type'),
              items: AnalyticsType.values
                  .map((t) => DropdownMenuItem(
                        value: t,
                        child: Text(t.name),
                      ))
                  .toList(),
              onChanged: (val) => setState(() => _type = val),
            ),
            TextField(
              controller: _entityTypeController,
              decoration: const InputDecoration(labelText: 'Entity Type'),
            ),
            TextField(
              controller: _entityIdController,
              decoration: const InputDecoration(labelText: 'Entity ID'),
            ),
            TextField(
              controller: _dataController,
              decoration:
                  const InputDecoration(labelText: 'Data (JSON string)'),
              maxLines: 2,
            ),
            TextField(
              controller: _propertyIdController,
              decoration: const InputDecoration(labelText: 'Property ID'),
            ),
            TextField(
              controller: _userIdController,
              decoration: const InputDecoration(labelText: 'User ID'),
            ),
            TextField(
              controller: _agentIdController,
              decoration: const InputDecoration(labelText: 'Agent ID'),
            ),
            TextField(
              controller: _agencyIdController,
              decoration: const InputDecoration(labelText: 'Agency ID'),
            ),
            TextField(
              controller: _reservationIdController,
              decoration: const InputDecoration(labelText: 'Reservation ID'),
            ),
            TextField(
              controller: _taskIdController,
              decoration: const InputDecoration(labelText: 'Task ID'),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Text('Timestamp: '),
                Text(_timestamp != null
                    ? _timestamp!.toLocal().toString().split(' ')[0]
                    : 'Not set'),
                IconButton(
                  icon: const Icon(Icons.calendar_today),
                  onPressed: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _timestamp ?? DateTime.now(),
                      firstDate: DateTime(2000),
                      lastDate: DateTime(2100),
                    );
                    if (picked != null) {
                      setState(() => _timestamp = picked);
                    }
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
