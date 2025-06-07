import 'package:flutter/material.dart';
import '../../models/message.dart';
import 'package:intl/intl.dart';

class MessageCard extends StatelessWidget {
  final Message message;
  final VoidCallback? onTap;
  const MessageCard({super.key, required this.message, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.message),
        title:
            Text(message.content, maxLines: 1, overflow: TextOverflow.ellipsis),
        subtitle: Text(
            '${message.type.toString().split('.').last} • ${message.status.toString().split('.').last}'),
        trailing: Text(DateFormat.yMMMd().format(message.createdAt!)),
      ),
    );
  }
}
