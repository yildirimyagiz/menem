import 'package:flutter/material.dart';

import 'package:intl/intl.dart';
import '../models/communication_log.dart';
import 'package:mobile/generated/l10n.dart'; // Import AppLocalizations

class MessageBubble extends StatelessWidget {
  final CommunicationLog message;
  final bool isMe;

  const MessageBubble({
    super.key,
    required this.message,
    required this.isMe,
  });

  Widget _buildDeliveryStatus(BuildContext context) {
    final s = AppLocalizations.of(context)!;
    if (!isMe) return const SizedBox.shrink();

    IconData icon;
    String tooltip;

    if (message.isRead) {
      icon = Icons.done_all;
      tooltip = s.messageStatusRead;
    } else if (message.isDelivered) {
      icon = Icons.done_all;
      tooltip = s.messageStatusDelivered;
    } else {
      icon = Icons.done;
      tooltip = s.messageStatusSent;
    }

    return Tooltip(
      message: tooltip,
      child: Icon(
        icon,
        size: 16,
        color: Colors.white.withAlpha((255 * 0.7).round()),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isMe
              ? Theme.of(context).primaryColor
              : Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha((255 * 0.1).round()),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        child: Column(
          crossAxisAlignment:
              isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            if (!isMe && message.user != null) ...[
              Text(
                // Accessing 'name' from the user map, providing a default if null or not a String.
                (message.user!['name'] as String?) ?? s.defaultUser,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: isMe ? Colors.white : Theme.of(context).primaryColor,
                ),
              ),
              const SizedBox(height: 4),
            ],
            Text(
              message.content,
              style: TextStyle(
                color: isMe
                    ? Colors.white
                    : Theme.of(context).textTheme.bodyLarge?.color,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  message.createdAt != null
                      ? DateFormat('HH:mm').format(message.createdAt!)
                      : s.unknownTime,
                  style: TextStyle(
                    fontSize: 12,
                    color: isMe
                        ? Colors.white.withAlpha((255 * 0.7).round())
                        : Colors.grey,
                  ),
                ),
                if (isMe) ...[
                  const SizedBox(width: 4),
                  _buildDeliveryStatus(context),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}
