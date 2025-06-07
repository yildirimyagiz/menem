import 'package:flutter/material.dart';
import '../../models/notification.dart';

class NotificationFilters extends StatefulWidget {
  final void Function({String? entityId, NotificationType? type, bool? isRead}) onChanged;
  const NotificationFilters({super.key, required this.onChanged});

  @override
  State<NotificationFilters> createState() => _NotificationFiltersState();
}

class _NotificationFiltersState extends State<NotificationFilters> {
  final _entityIdController = TextEditingController();
  NotificationType? _selectedType;
  bool? _isRead;

  @override
  void dispose() {
    _entityIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      entityId: _entityIdController.text.isEmpty ? null : _entityIdController.text,
      type: _selectedType,
      isRead: _isRead,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _entityIdController,
          decoration: const InputDecoration(labelText: 'Entity ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<NotificationType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: NotificationType.values
              .map((type) => DropdownMenuItem(
                    value: type,
                    child: Text(type.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (type) {
            setState(() => _selectedType = type);
            _onFilterChanged();
          },
        ),
        DropdownButtonFormField<bool>(
          value: _isRead,
          decoration: const InputDecoration(labelText: 'Read Status'),
          items: const [
            DropdownMenuItem(value: null, child: Text('Any')),
            DropdownMenuItem(value: true, child: Text('Read')),
            DropdownMenuItem(value: false, child: Text('Unread')),
          ],
          onChanged: (val) {
            setState(() => _isRead = val);
            _onFilterChanged();
          },
        ),
      ],
    );
  }
}
