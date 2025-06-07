import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/notification.dart' as models;
import '../../providers/notification_provider.dart';
import '../../widgets/notification_tile.dart';
import '../../widgets/commons/empty_state.dart';
import '../../widgets/commons/error_state.dart';
import '../../widgets/commons/loading_state.dart';
import '../../utils/notification_utils.dart';
import '../../services/notification_effects_service.dart';
import 'notification_detail_screen.dart';
import 'notification_preferences_screen.dart';

class NotificationListScreen extends ConsumerStatefulWidget {
  const NotificationListScreen({super.key});

  @override
  ConsumerState<NotificationListScreen> createState() =>
      _NotificationListScreenState();
}

class _NotificationListScreenState extends ConsumerState<NotificationListScreen>
    with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  final _effectsService = NotificationEffectsService();
  models.NotificationType? _selectedType;
  bool _showUnreadOnly = false;
  late TabController _tabController;
  bool _groupByType = false;

  ProviderListenable? get notificationsProvider => null;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    Future.microtask(() {
      ref.read(notificationsNotifierProvider.notifier).refresh();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _effectsService.dispose();
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final notificationsAsync = ref.watch(notificationsNotifierProvider);
    final notifier = ref.read(notificationsNotifierProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'By Date'),
            Tab(text: 'By Type'),
          ],
          onTap: (index) {
            setState(() {
              _groupByType = index == 1;
            });
          },
        ),
        actions: [
          IconButton(
            icon: Badge(
              label: notificationsAsync.when(
                data: (notifications) => Text(
                  '${NotificationUtils.getUnreadCount(notifications)}',
                ),
                loading: () => const Text('0'),
                error: (_, __) => const Text('0'),
              ),
              child: const Icon(Icons.notifications),
            ),
            onPressed: () {
              setState(() {
                _showUnreadOnly = !_showUnreadOnly;
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const NotificationPreferencesScreen(),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
          IconButton(
            icon: const Icon(Icons.done_all),
            onPressed: () {
              notifier.markAllAsRead();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search notifications...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          setState(() {});
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              onChanged: (value) {
                setState(() {});
              },
            ),
          ),
          if (_selectedType != null || _showUnreadOnly)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: Wrap(
                spacing: 8,
                children: [
                  if (_selectedType != null)
                    Chip(
                      label: Text(_getNotificationTypeLabel(_selectedType!)),
                      onDeleted: () {
                        setState(() {
                          _selectedType = null;
                        });
                      },
                    ),
                  if (_showUnreadOnly)
                    Chip(
                      label: const Text('Unread Only'),
                      onDeleted: () {
                        setState(() {
                          _showUnreadOnly = false;
                        });
                      },
                    ),
                ],
              ),
            ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                await notifier.refresh();
              },
              child: notificationsAsync.when(
                data: (notifications) {
                  final filteredNotifications =
                      _filterNotifications(notifications);
                  if (filteredNotifications.isEmpty) {
                    return const EmptyState(
                      message: 'No notifications found',
                      icon: Icons.notifications_none,
                    );
                  }

                  final groupedNotifications = _groupByType
                      ? NotificationUtils.groupNotificationsByType(
                          filteredNotifications)
                      : NotificationUtils.groupNotificationsByDate(
                          filteredNotifications);

                  return ListView.builder(
                    itemCount: groupedNotifications.length,
                    itemBuilder: (context, index) {
                      final groupKey =
                          groupedNotifications.keys.elementAt(index);
                      final groupNotifications =
                          groupedNotifications[groupKey]!;

                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              children: [
                                Text(
                                  groupKey,
                                  style: Theme.of(context).textTheme.titleSmall,
                                ),
                                const SizedBox(width: 8),
                                Badge(
                                  label: Text(
                                    '${groupNotifications.where((n) => !n.isRead).length}',
                                  ),
                                ),
                              ],
                            ),
                          ),
                          ...groupNotifications.map((notification) {
                            return NotificationTile(
                              notification: notification,
                              onTap: () async {
                                if (!notification.isRead) {
                                  await notifier.markAsRead(notification.id);
                                  await _effectsService.playNotificationSound();
                                  await _effectsService.vibrate();
                                }
                                if (context.mounted) {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (context) =>
                                          NotificationDetailScreen(
                                        notification: notification,
                                      ),
                                    ),
                                  );
                                }
                              },
                              onDismiss: () {
                                notifier.delete(notification.id);
                              },
                            );
                          }).toList(),
                        ],
                      );
                    },
                  );
                },
                loading: () => const LoadingState(),
                error: (error, stackTrace) => ErrorState(
                  message: error.toString(),
                  onRetry: () async {
                    if (context.mounted) {
                      ref
                          .read(notificationsNotifierProvider.notifier)
                          .refresh();
                    }
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<models.Notification> _filterNotifications(
    List<models.Notification> notifications,
  ) {
    return notifications.where((notification) {
      if (_showUnreadOnly && notification.isRead) {
        return false;
      }
      if (_selectedType != null && notification.type != _selectedType) {
        return false;
      }
      if (_searchController.text.isNotEmpty) {
        final searchTerm = _searchController.text.toLowerCase();
        return notification.content != null &&
            notification.content!.toLowerCase().contains(searchTerm);
      }
      return true;
    }).toList();
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Notifications'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            DropdownButtonFormField<models.NotificationType?>(
              value: _selectedType,
              decoration: const InputDecoration(
                labelText: 'Notification Type',
              ),
              items: [
                const DropdownMenuItem(
                  value: null,
                  child: Text('All Types'),
                ),
                ...models.NotificationType.values.map(
                  (type) => DropdownMenuItem(
                    value: type,
                    child: Text(_getNotificationTypeLabel(type)),
                  ),
                ),
              ],
              onChanged: (value) {
                setState(() {
                  _selectedType = value;
                });
                Navigator.of(context).pop();
              },
            ),
            const SizedBox(height: 16),
            SwitchListTile(
              title: const Text('Unread Only'),
              value: _showUnreadOnly,
              onChanged: (value) {
                setState(() {
                  _showUnreadOnly = value;
                });
                Navigator.of(context).pop();
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _selectedType = null;
                _showUnreadOnly = false;
              });
              Navigator.of(context).pop();
            },
            child: const Text('Clear Filters'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  String _getNotificationTypeLabel(models.NotificationType type) {
    switch (type) {
      case models.NotificationType.message:
        return 'Message';
      case models.NotificationType.booking:
        return 'Booking';
      case models.NotificationType.mention:
        return 'Mention';
      case models.NotificationType.like:
        return 'Like';
      case models.NotificationType.comment:
        return 'Comment';
      case models.NotificationType.follow:
        return 'Follow';
      case models.NotificationType.priceChange:
        return 'Price Change';
      case models.NotificationType.availability:
        return 'Availability';
      case models.NotificationType.system:
        return 'System';
      case models.NotificationType.other:
        return 'Other';
      case models.NotificationType.listing:
        return 'Listing';
      case models.NotificationType.warning:
        return 'Warning';
      case models.NotificationType.price:
        return 'Price';
    }
  }
}

extension on ProviderListenable? {}

// Extension removed as we're using the generated providers directly
