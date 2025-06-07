import 'package:flutter/material.dart';
import '../../models/event.dart';
import 'package:intl/intl.dart';

class EventEditScreen extends StatefulWidget {
  final Event event;
  const EventEditScreen({super.key, required this.event});

  @override
  State<EventEditScreen> createState() => _EventEditScreenState();
}

class _EventEditScreenState extends State<EventEditScreen> {
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  EventType? _eventType; // Changed from String? to EventType?
  DateTime? _scheduledAt;
  late TextEditingController _durationController;
  late TextEditingController _attendeesController;
  bool _isActive = true;

  @override
  void initState() {
    super.initState();
    final e = widget.event;
    _titleController = TextEditingController(text: e.title);
    _descriptionController = TextEditingController(text: e.description ?? '');
    _eventType = e.eventType; // Assumes e.eventType is EventType?
    _scheduledAt = e.scheduledAt;
    _durationController =
        TextEditingController(text: e.duration?.toString() ?? '');
    // Assuming User model has an 'id' field and attendees is List<User>
    _attendeesController = TextEditingController(
        text: e.attendees.map((user) => user.id).join(','));
    _isActive = e.isActive;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _durationController.dispose();
    _attendeesController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.event.copyWith(
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim().isNotEmpty
          ? _descriptionController.text.trim()
          : null,
      eventType: _eventType,
      scheduledAt: _scheduledAt,
      duration: int.tryParse(_durationController.text.trim()),
      isActive: _isActive,
      // FIXME: The Event.copyWith method expects 'attendees' to be List<User>?.
      // This screen currently only has attendee IDs as List<String>.
      // To correctly update attendees, this screen needs to convert IDs to User objects
      // or the Event.copyWith method needs to be adapted to accept attendee IDs.
      // attendees: _attendeesController.text.trim().isNotEmpty
      //     ? _attendeesController.text.trim().split(',').map((s) => s.trim()).toList()
      //     : null,
    );
    Navigator.of(context).pop(updated);
  }

  Future<void> _pickDate(BuildContext context, DateTime? initial,
      ValueChanged<DateTime?> onPicked) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: initial ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked != null) onPicked(picked);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Event'),
        actions: [IconButton(icon: const Icon(Icons.save), onPressed: _save)],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Title')),
            TextField(
                controller: _descriptionController,
                decoration: const InputDecoration(labelText: 'Description')),
            DropdownButtonFormField<EventType>(
              value: _eventType,
              decoration: const InputDecoration(labelText: 'Event Type'),
              items: EventType.values
                  .map((t) => DropdownMenuItem(
                      value: t, child: Text(t.toString().split('.').last)))
                  .toList(),
              onChanged: (v) => setState(() => _eventType = v),
            ),
            Row(
              children: [
                Expanded(
                    child: Text(_scheduledAt != null
                        ? 'Scheduled: ${DateFormat.yMd().format(_scheduledAt!)}'
                        : 'Scheduled At')),
                IconButton(
                    icon: const Icon(Icons.date_range),
                    onPressed: () => _pickDate(context, _scheduledAt,
                        (d) => setState(() => _scheduledAt = d))),
              ],
            ),
            TextField(
                controller: _durationController,
                decoration: const InputDecoration(labelText: 'Duration (min)'),
                keyboardType: TextInputType.number),
            TextField(
                controller: _attendeesController,
                decoration: const InputDecoration(
                    labelText: 'Attendees (comma-separated user IDs)')),
            SwitchListTile(
                title: const Text('Active'),
                value: _isActive,
                onChanged: (v) => setState(() => _isActive = v)),
          ],
        ),
      ),
    );
  }
}
