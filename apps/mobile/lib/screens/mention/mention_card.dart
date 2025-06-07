import 'package:flutter/material.dart';
import '../../models/mention.dart';
import 'package:intl/intl.dart';

class MentionCard extends StatelessWidget {
  final Mention mention;
  final VoidCallback? onTap;
  const MentionCard({super.key, required this.mention, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: Icon(
          mention.isRead ? Icons.alternate_email : Icons.mark_email_unread,
          color: mention.isRead ? Colors.green : Colors.red,
        ),
        title: Text('User: ${mention.userId}'),
        subtitle: Text(
            'Post: ${mention.postId}${mention.commentId != null ? " • Comment: ${mention.commentId}" : ""}'),
        trailing: Text(DateFormat.yMMMd().format(mention.createdAt!)),
      ),
    );
  }
}
