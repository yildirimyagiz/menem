import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../widgets/chat_list_item.dart';
import '../../models/communication_log.dart';

class ChatListScreen extends ConsumerStatefulWidget {
  const ChatListScreen({super.key});

  @override
  ConsumerState<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends ConsumerState<ChatListScreen> {
  bool _isSearching = false;
  String _searchQuery = '';
  String _filter = 'All';
  final _searchController = TextEditingController();

  ProviderListenable<AsyncValue<List<CommunicationLog>>>?
      get chatListNotifierProvider => null;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showFilterDialog() async {
    final selected = await showDialog<String>(
      context: context,
      builder: (context) => SimpleDialog(
        title: const Text('Filter Chats'),
        children: [
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, 'All'),
            child: const Text('All'),
          ),
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, 'Unread'),
            child: const Text('Unread'),
          ),
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, 'Starred'),
            child: const Text('Starred'),
          ),
        ],
      ),
    );
    if (selected != null && mounted) {
      setState(() {
        _filter = selected;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final chatState = ref.watch(chatListNotifierProvider!);

    String getTitle(CommunicationLog chat) {
      if (chat.channel != null) {
        return chat.channel!['name'] as String;
      }
      if (chat.ticket != null) {
        return chat.ticket!['subject'] as String;
      }
      if (chat.user != null) {
        return chat.user!['name'] as String;
      }
      return 'Unknown';
    }

    return Scaffold(
      appBar: AppBar(
        title: _isSearching
            ? TextField(
                controller: _searchController,
                autofocus: true,
                decoration: InputDecoration(
                  hintText: 'Search messages...',
                  border: InputBorder.none,
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: () {
                      setState(() {
                        _isSearching = false;
                        _searchQuery = '';
                        _searchController.clear();
                      });
                    },
                  ),
                ),
                onChanged: (value) {
                  setState(() {
                    _searchQuery = value;
                  });
                },
              )
            : const Text('Messages'),
        actions: [
          IconButton(
            icon: Icon(_isSearching ? Icons.close : Icons.search),
            onPressed: () {
              setState(() {
                if (_isSearching) {
                  _isSearching = false;
                  _searchQuery = '';
                  _searchController.clear();
                } else {
                  _isSearching = true;
                }
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      body: chatState.when(
        data: (chats) {
          // Filter by search
          var filteredChats = chats.where((chat) {
            final query = _searchQuery.toLowerCase();
            final title = getTitle(chat).toLowerCase();
            final content = (chat.content).toLowerCase();
            return title.contains(query) || content.contains(query);
          }).toList();
          // Filter by filter
          if (_filter == 'Unread') {
            filteredChats = filteredChats.where((c) => !c.isRead).toList();
          } else if (_filter == 'Starred') {
            // No isStarred field, so stub as always false
            filteredChats = [];
          }

          if (filteredChats.isEmpty) {
            return const Center(
              child: Text('No messages yet'),
            );
          }

          return ListView.builder(
            itemCount: filteredChats.length,
            itemBuilder: (context, index) {
              final chat = filteredChats[index];
              return ChatListItem(
                chat: chat,
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    '/chat-detail',
                    arguments: chat,
                  );
                },
              );
            },
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, stackTrace) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Error: ${error.toString()}'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  ref
                      .read(chatListNotifierProvider!.notifier
                          as ProviderListenable<
                              AsyncNotifier<List<CommunicationLog>>>)
                      .loadChats();
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, '/new-chat');
        },
        child: const Icon(Icons.message),
      ),
    );
  }
}

extension on AsyncNotifier<List<CommunicationLog>> {
  void loadChats() {}
}

extension on ProviderListenable? {
  ProviderListenable? get notifier => null;
}
