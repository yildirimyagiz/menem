import 'package:flutter/material.dart';

class MentionFilters extends StatefulWidget {
  final void Function({String? userId, String? postId, bool? isRead}) onChanged;
  const MentionFilters({super.key, required this.onChanged});

  @override
  State<MentionFilters> createState() => _MentionFiltersState();
}

class _MentionFiltersState extends State<MentionFilters> {
  final _userIdController = TextEditingController();
  final _postIdController = TextEditingController();
  bool? _isRead;

  @override
  void dispose() {
    _userIdController.dispose();
    _postIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      userId: _userIdController.text.isEmpty ? null : _userIdController.text,
      postId: _postIdController.text.isEmpty ? null : _postIdController.text,
      isRead: _isRead,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _userIdController,
          decoration: const InputDecoration(labelText: 'User ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _postIdController,
          decoration: const InputDecoration(labelText: 'Post ID'),
          onChanged: (_) => _onFilterChanged(),
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
