import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/communication_log.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/providers/chat_provider.dart';
import '../../widgets/message_bubble.dart';

class ChatDetailScreen extends ConsumerStatefulWidget {
  final CommunicationLog chat;

  const ChatDetailScreen({
    super.key,
    required this.chat,
  });

  @override
  ConsumerState<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends ConsumerState<ChatDetailScreen> {
  final _messageController = TextEditingController();
  final _scrollController = ScrollController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadMessages();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadMessages() async {
    if (!mounted) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final threadId = widget.chat.threadId ?? widget.chat.id;
      if (threadId.isEmpty) return;

      // Set the current thread ID and refresh messages
      ref.read(chatThreadIdProvider.notifier).state = threadId;
      await ref.read(chatThreadMessagesProvider.notifier).build();

      if (mounted) {
        _scrollToBottom();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to load messages')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  Future<void> _sendMessage() async {
    if (_messageController.text.trim().isEmpty) return;

    final userId = ref.read(authNotifierProvider.notifier).getUserId();
    if (userId == null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('You must be logged in to send messages'),
          ),
        );
      }
      return;
    }

    final threadId = widget.chat.threadId ?? widget.chat.id;
    final content = _messageController.text.trim();
    _messageController.clear();

    try {
      await ref.read(chatThreadMessagesProvider.notifier).sendMessage(
            threadId: threadId,
            content: content,
            receiverId: widget.chat.receiverId,
            channelId: widget.chat.channelId,
            entityId: widget.chat.id,
            entityType: widget.chat.type.toString().split('.').last,
          );

      if (mounted) {
        _scrollToBottom();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to send message. Please try again.'),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final threadId = widget.chat.threadId ?? widget.chat.id;
    if (threadId.isEmpty) {
      return const Scaffold(
        body: Center(child: Text('Invalid chat thread')),
      );
    }

    // Watch the chat thread messages
    final chatState = ref.watch(chatThreadMessagesProvider);
    final userId = ref.watch(authNotifierProvider.notifier).getUserId();

    return Scaffold(
      appBar: AppBar(
        title: Text(_getTitle()),
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: () {
              showModalBottomSheet(
                context: context,
                builder: (context) => SafeArea(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      ListTile(
                        leading: const Icon(Icons.delete),
                        title: const Text('Delete Chat'),
                        onTap: () {
                          Navigator.pop(context);
                          _deleteChat();
                        },
                      ),
                      ListTile(
                        leading: const Icon(Icons.markunread),
                        title: const Text('Mark as Unread'),
                        onTap: () {
                          Navigator.pop(context);
                          _markAsUnread();
                        },
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: chatState.when(
              data: (messages) {
                return ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(16),
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final messageData = messages[index];
                    // Ensure we have a valid CommunicationLog object
                    // ignore: unnecessary_type_check
                    final message = messageData is CommunicationLog
                        ? messageData
                        : CommunicationLog.fromJson(
                            messageData as Map<String, dynamic>);
                    return MessageBubble(
                      message: message,
                      isMe: message.senderId == userId,
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
                      onPressed: _loadMessages,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 4,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.attach_file),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('File attachment coming soon!')),
                      );
                    },
                  ),
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      decoration: const InputDecoration(
                        hintText: 'Type a message...',
                        border: InputBorder.none,
                      ),
                      maxLines: null,
                      textCapitalization: TextCapitalization.sentences,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send),
                    onPressed: _isLoading ? null : _sendMessage,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getTitle() {
    if (widget.chat.channel != null) {
      return widget.chat.channel!['name'] as String;
    }
    if (widget.chat.ticket != null) {
      return widget.chat.ticket!['subject'] as String;
    }
    if (widget.chat.user != null) {
      return widget.chat.user!['name'] as String;
    }
    return 'Chat';
  }

  Future<void> _deleteChat() async {
    try {
      final threadId = widget.chat.threadId ?? widget.chat.id;
      await ref.read(chatThreadMessagesProvider.notifier).deleteChat(threadId);

      if (mounted) {
        Navigator.pop(context);
        if (mounted) {
          Navigator.pop(context);
        }
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Chat deleted')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to delete chat')),
        );
      }
    }
  }

  Future<void> _markAsUnread() async {
    try {
      final threadId = widget.chat.threadId ?? widget.chat.id;
      await ref
          .read(chatThreadMessagesProvider.notifier)
          .markAsUnread(threadId);

      if (mounted) {
        Navigator.pop(context);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Marked as unread')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to mark as unread')),
        );
      }
    }
  }
}
