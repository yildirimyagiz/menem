import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/user_provider.dart';

import '../../services/navigation_service.dart';
import 'package:awesome_snackbar_content/awesome_snackbar_content.dart';

class ProfileSettingsScreen extends ConsumerWidget {
  const ProfileSettingsScreen({super.key});

  void _showSnackBar({
    required BuildContext context,
    required String title,
    required String message,
    required ContentType contentType,
  }) {
    final snackBar = SnackBar(
      elevation: 0,
      behavior: SnackBarBehavior.floating,
      backgroundColor: Colors.transparent,
      content: AwesomeSnackbarContent(
        title: title,
        message: message,
        contentType: contentType,
      ),
    );

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(snackBar);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userState = ref.watch(userProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile Settings'),
      ),
      body: userState.when(
        data: (userData) {
          if (userData == null) {
            return const Center(
              child: Text('No user data available'),
            );
          }

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Profile Information
              Card(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        'Profile Information',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ),
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.edit),
                      title: const Text('Edit Profile'),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        NavigationService.navigateTo('/edit-profile');
                      },
                    ),
                    ListTile(
                      leading: const Icon(Icons.lock),
                      title: const Text('Change Password'),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        NavigationService.navigateTo('/change-password');
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // Account Management
              Card(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        'Account Management',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ),
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.account_circle),
                      title: const Text('Connected Accounts'),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        NavigationService.navigateTo('/account-management');
                      },
                    ),
                    ListTile(
                      leading: const Icon(Icons.notifications),
                      title: const Text('Notification Settings'),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        NavigationService.navigateTo('/notification-settings');
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // Security
              Card(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        'Security',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ),
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.security),
                      title: const Text('Two-Factor Authentication'),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        NavigationService.navigateTo('/2fa-settings');
                      },
                    ),
                    ListTile(
                      leading: const Icon(Icons.devices),
                      title: const Text('Active Sessions'),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        NavigationService.navigateTo('/active-sessions');
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // Danger Zone
              Card(
                color: Theme.of(context).colorScheme.errorContainer,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        'Danger Zone',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Theme.of(context)
                                  .colorScheme
                                  .onErrorContainer,
                            ),
                      ),
                    ),
                    const Divider(),
                    ListTile(
                      leading: Icon(
                        Icons.delete_forever,
                        color: Theme.of(context).colorScheme.error,
                      ),
                      title: Text(
                        'Delete Account',
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.error,
                        ),
                      ),
                      onTap: () {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('Delete Account'),
                            content: const Text(
                              'Are you sure you want to delete your account? This action cannot be undone.',
                            ),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                },
                                child: const Text('Cancel'),
                              ),
                              ElevatedButton(
                                onPressed: () async {
                                  try {
                                    await ref
                                        .read(userProvider.notifier)
                                        .deleteAccount();
                                    if (!context.mounted) return;
                                    _showSnackBar(
                                      context: context,
                                      title: 'Success',
                                      message: 'Account deleted successfully',
                                      contentType: ContentType.success,
                                    );
                                    NavigationService.navigateTo('/login');
                                  } catch (e) {
                                    if (!context.mounted) return;
                                    _showSnackBar(
                                      context: context,
                                      title: 'Error',
                                      message: 'Failed to delete account: $e',
                                      contentType: ContentType.failure,
                                    );
                                  }
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor:
                                      Theme.of(context).colorScheme.error,
                                ),
                                child: const Text('Delete'),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, stackTrace) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Error loading profile',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.error,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  ref.invalidate(userProvider);
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
