import 'package:flutter/material.dart';
import '../../models/message.dart';

class MessageFilters extends StatefulWidget {
  final void Function({String? senderId, String? receiverId, MessageType? type, MessageStatus? status}) onChanged;
  const MessageFilters({super.key, required this.onChanged});

  @override
  State<MessageFilters> createState() => _MessageFiltersState();
}

class _MessageFiltersState extends State<MessageFilters> {
  final _senderIdController = TextEditingController();
  final _receiverIdController = TextEditingController();
  MessageType? _selectedType;
  MessageStatus? _selectedStatus;

  @override
  void dispose() {
    _senderIdController.dispose();
    _receiverIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      senderId: _senderIdController.text.isEmpty ? null : _senderIdController.text,
      receiverId: _receiverIdController.text.isEmpty ? null : _receiverIdController.text,
      type: _selectedType,
      status: _selectedStatus,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _senderIdController,
          decoration: const InputDecoration(labelText: 'Sender ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _receiverIdController,
          decoration: const InputDecoration(labelText: 'Receiver ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<MessageType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: MessageType.values
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
        DropdownButtonFormField<MessageStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: MessageStatus.values
              .map((status) => DropdownMenuItem(
                    value: status,
                    child: Text(status.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (status) {
            setState(() => _selectedStatus = status);
            _onFilterChanged();
          },
        ),
      ],
    );
  }
}
