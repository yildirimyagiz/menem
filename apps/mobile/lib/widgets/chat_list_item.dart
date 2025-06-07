import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/communication_log.dart';

class ChatListItem extends StatelessWidget {
  final CommunicationLog chat;
  final VoidCallback onTap;

  const ChatListItem({
    super.key,
    required this.chat,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: CircleAvatar(
        backgroundColor: _getTypeColor(chat.type),
        child: Icon(
          _getTypeIcon(chat.type),
          color: Colors.white,
        ),
      ),
      title: Text(
        _getTitle(chat),
        style: TextStyle(
          fontWeight: chat.isRead ? FontWeight.normal : FontWeight.bold,
        ),
      ),
      subtitle: Text(
        chat.content,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      trailing: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Text(
            chat.createdAt != null
                ? DateFormat('HH:mm').format(chat.createdAt!)
                : 'Unknown time',
            style: TextStyle(
              fontSize: 12,
              color: chat.isRead ? Colors.grey : Theme.of(context).primaryColor,
            ),
          ),
          if (!chat.isRead)
            Container(
              margin: const EdgeInsets.only(top: 4),
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
                shape: BoxShape.circle,
              ),
              child: const Text(
                '1',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                ),
              ),
            ),
        ],
      ),
    );
  }

  String _getTitle(CommunicationLog chat) {
    if (chat.channel != null) {
      return (chat.channel?['name'] as String?) ?? 'Unknown Channel';
    }
    if (chat.ticket != null) {
      return (chat.ticket?['subject'] as String?) ?? 'Unknown Ticket';
    }
    if (chat.user != null) {
      return (chat.user?['name'] as String?) ?? 'Unknown User';
    }
    return 'Unknown';
  }

  IconData _getTypeIcon(CommunicationType type) {
    switch (type) {
      case CommunicationType.problem:
        return Icons.error;
      case CommunicationType.request:
        return Icons.help;
      case CommunicationType.advice:
        return Icons.lightbulb;
      case CommunicationType.information:
        return Icons.info;
      case CommunicationType.feedback:
        return Icons.feedback;
    }
  }

  Color _getTypeColor(CommunicationType type) {
    switch (type) {
      case CommunicationType.problem:
        return Colors.red;
      case CommunicationType.request:
        return Colors.orange;
      case CommunicationType.advice:
        return Colors.green;
      case CommunicationType.information:
        return Colors.blue;
      case CommunicationType.feedback:
        return Colors.purple;
    }
  }
}
