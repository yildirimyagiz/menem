import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/notification_service.dart';
import '../../providers/api_providers.dart';

class NotificationPreferencesScreen extends ConsumerStatefulWidget {
  const NotificationPreferencesScreen({super.key});

  @override
  ConsumerState<NotificationPreferencesScreen> createState() =>
      _NotificationPreferencesScreenState();
}

class _NotificationPreferencesScreenState
    extends ConsumerState<NotificationPreferencesScreen> {
  late final NotificationService _notificationService;
  Map<String, bool> _preferences = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    // Get the API service first, then create the notification service
    final apiService = ref.read(apiServiceProvider);
    _notificationService = NotificationService(apiService);
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final preferences =
          await _notificationService.getNotificationPreferences();
      setState(() {
        _preferences = preferences;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load preferences: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _updatePreference(String type, bool value) async {
    try {
      await _notificationService.updateNotificationPreferences(type, value);
      setState(() {
        _preferences[type] = value;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update preference: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notification Settings'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              children: [
                _buildSectionHeader('Messages'),
                _buildPreferenceSwitch(
                  'notifications.message',
                  'New Messages',
                  'Get notified when you receive new messages',
                ),
                _buildPreferenceSwitch(
                  'notifications.mention',
                  'Mentions',
                  'Get notified when someone mentions you',
                ),
                _buildDivider(),
                _buildSectionHeader('Bookings'),
                _buildPreferenceSwitch(
                  'notifications.booking',
                  'Booking Updates',
                  'Get notified about booking changes',
                ),
                _buildPreferenceSwitch(
                  'notifications.availability',
                  'Availability Updates',
                  'Get notified about property availability changes',
                ),
                _buildDivider(),
                _buildSectionHeader('Social'),
                _buildPreferenceSwitch(
                  'notifications.like',
                  'Likes',
                  'Get notified when someone likes your content',
                ),
                _buildPreferenceSwitch(
                  'notifications.comment',
                  'Comments',
                  'Get notified when someone comments on your content',
                ),
                _buildPreferenceSwitch(
                  'notifications.follow',
                  'New Followers',
                  'Get notified when someone follows you',
                ),
                _buildDivider(),
                _buildSectionHeader('Property'),
                _buildPreferenceSwitch(
                  'notifications.priceChange',
                  'Price Changes',
                  'Get notified about property price changes',
                ),
                _buildDivider(),
                _buildSectionHeader('System'),
                _buildPreferenceSwitch(
                  'notifications.system',
                  'System Notifications',
                  'Get notified about system updates and maintenance',
                ),
              ],
            ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
              color: Theme.of(context).primaryColor,
              fontWeight: FontWeight.bold,
            ),
      ),
    );
  }

  Widget _buildPreferenceSwitch(
    String key,
    String title,
    String subtitle,
  ) {
    return SwitchListTile(
      title: Text(title),
      subtitle: Text(
        subtitle,
        style: Theme.of(context).textTheme.bodySmall,
      ),
      value: _preferences[key] ?? true,
      onChanged: (value) => _updatePreference(key, value),
    );
  }

  Widget _buildDivider() {
    return const Divider(height: 1);
  }
}
