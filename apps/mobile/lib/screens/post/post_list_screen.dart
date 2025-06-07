import 'package:flutter/material.dart';
import '../../models/post.dart';
import '../../widgets/post/post_filters.dart';
import '../../widgets/post/post_header.dart';
import '../../widgets/post/post_details.dart';

class PostListScreen extends StatefulWidget {
  final List<Post> posts;
  final List<String> allTypes;
  const PostListScreen(
      {super.key, required this.posts, required this.allTypes});

  @override
  State<PostListScreen> createState() => _PostListScreenState();
}

class _PostListScreenState extends State<PostListScreen> {
  List<String>? _selectedTypes;
  final bool _isLoading = false;
  String? _error;

  List<Post> get _filteredPosts {
    if (_selectedTypes == null || _selectedTypes!.isEmpty) return widget.posts;
    return widget.posts.where((p) => _selectedTypes!.contains(p.type)).toList();
  }

  void _showPostActions(Post post) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.visibility),
              title: const Text('View'),
              onTap: () {
                Navigator.pop(context);
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Post Details'),
                    content: PostDetails(post: post),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Close'),
                      ),
                    ],
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.edit),
              title: const Text('Edit'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Edit not implemented yet')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete),
              title: const Text('Delete'),
              onTap: () async {
                Navigator.pop(context);
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Delete Post'),
                    content: const Text(
                        'Are you sure you want to delete this post?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context, false),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(context, true),
                        child: const Text('Delete',
                            style: TextStyle(color: Colors.red)),
                      ),
                    ],
                  ),
                );
                // Guard all context usage after async gap with 'if (!mounted) return;'
                if (!mounted) return;
                if (confirm == true) {
                  setState(() {
                    widget.posts.remove(post);
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    // ignore: use_build_context_synchronously
                    const SnackBar(content: Text('Post deleted')),
                  );
                }
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
      appBar: AppBar(title: const Text('Posts')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Text(_error!,
                      style: TextStyle(
                          color: Theme.of(context).colorScheme.error)))
              : Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      PostHeader(postCount: _filteredPosts.length),
                      const SizedBox(height: 8),
                      PostFilters(
                        allTypes: widget.allTypes,
                        onFilterChanged: ({types}) =>
                            setState(() => _selectedTypes = types),
                      ),
                      const SizedBox(height: 12),
                      Expanded(
                        child: ListView.separated(
                          itemCount: _filteredPosts.length,
                          separatorBuilder: (_, __) => const Divider(),
                          itemBuilder: (context, i) {
                            final post = _filteredPosts[i];
                            return ListTile(
                              leading: Icon(Icons.article,
                                  color: Theme.of(context).colorScheme.primary),
                              title: Text(post.title),
                              subtitle: Text(post.body ?? ''),
                              trailing: IconButton(
                                icon: const Icon(Icons.more_vert),
                                onPressed: () => _showPostActions(post),
                              ),
                              onTap: () => _showPostActions(post),
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
