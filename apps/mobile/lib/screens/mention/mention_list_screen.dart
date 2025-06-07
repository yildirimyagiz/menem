import 'package:flutter/material.dart';
import '../../models/mention.dart';

import '../../widgets/mention/mention_filters.dart';
import '../../widgets/mention/mention_header.dart';

class MentionListScreen extends StatefulWidget {
  final List<Mention> mentions;
  final List<String> allTypes;
  const MentionListScreen({super.key, required this.mentions, required this.allTypes});

  @override
  State<MentionListScreen> createState() => _MentionListScreenState();
}

class _MentionListScreenState extends State<MentionListScreen> {
  List<MentionType>? _selectedTypes;
  final bool _isLoading = false;
  String? _error;

  List<Mention> get _filteredMentions {
    if (_selectedTypes == null || _selectedTypes!.isEmpty) return widget.mentions;
    return widget.mentions.where((m) => _selectedTypes!.contains(m.type)).toList();
  }

  void _showMentionActions(Mention mention) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.visibility),
              title: const Text('View'),
              onTap: () {
                // TODO: Implement view
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete),
              title: const Text('Delete'),
              onTap: () {
                // TODO: Implement delete
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mentions')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)))
              : Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      MentionHeader(mentionCount: _filteredMentions.length),
                      const SizedBox(height: 8),
                      MentionFilters(
                        allTypes: widget.allTypes.cast<MentionType>(),
                        onFilterChanged: ({types}) => setState(() => _selectedTypes = types),
                      ),
                      const SizedBox(height: 12),
                      Expanded(
                        child: ListView.separated(
                          itemCount: _filteredMentions.length,
                          separatorBuilder: (_, __) => const Divider(),
                          itemBuilder: (context, i) {
                            final mention = _filteredMentions[i];
                            return ListTile(
                              leading: Icon(Icons.alternate_email, color: Theme.of(context).colorScheme.primary),
                              title: Text('User: ${mention.userId}'),
                              subtitle: Text('Post: ${mention.postId}\nRead: ${mention.isRead ? "Yes" : "No"}'),
                              trailing: IconButton(
                                icon: const Icon(Icons.more_vert),
                                onPressed: () => _showMentionActions(mention),
                              ),
                              onTap: () => _showMentionActions(mention),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}
