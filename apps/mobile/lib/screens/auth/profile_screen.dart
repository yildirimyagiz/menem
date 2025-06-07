import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/user_provider.dart';
import '../../services/navigation_service.dart';
import 'package:awesome_snackbar_content/awesome_snackbar_content.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  final bool _isLoading = false;

  void _showSnackBar({
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
  Widget build(BuildContext context) {
    final userState = ref.watch(userProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              try {
                await ref.read(userProvider.notifier).signOut();
                _showSnackBar(
                  title: 'Success',
                  message: 'Successfully signed out',
                  contentType: ContentType.success,
                );
                NavigationService.navigateTo('/login');
              } catch (e) {
                _showSnackBar(
                  title: 'Error',
                  message: 'Failed to sign out: ${e.toString()}',
                  contentType: ContentType.failure,
                );
              }
            },
          ),
        ],
      ),
      body: userState.when(
        data: (userData) {
          if (userData == null) {
            return const Center(
              child: Text('No user data available'),
            );
          }

          return Stack(
            children: [
              SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Profile Header
                    Center(
                      child: Column(
                        children: [
                          CircleAvatar(
                            radius: 50,
                            backgroundColor:
                                Theme.of(context).colorScheme.primary,
                            child: Text(
                              userData['name']?.substring(0, 1).toUpperCase() ??
                                  'U',
                              style: TextStyle(
                                fontSize: 32,
                                color: Theme.of(context).colorScheme.onPrimary,
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            userData['name'] ?? 'User',
                            style: Theme.of(context).textTheme.headlineMedium,
                          ),
                          Text(
                            userData['email'] ?? '',
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
                    // Profile Actions
                    Card(
                      child: Column(
                        children: [
                          ListTile(
                            leading: const Icon(Icons.edit),
                            title: const Text('Edit Profile'),
                            trailing: const Icon(Icons.chevron_right),
                            onTap: () {
                              NavigationService.navigateTo('/edit-profile');
                            },
                          ),
                          const Divider(),
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
                    // User Information
                    Card(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Text(
                              'User Information',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                          ),
                          const Divider(),
                          ListTile(
                            leading: const Icon(Icons.email),
                            title: const Text('Email'),
                            subtitle: Text(userData['email'] ?? 'N/A'),
                          ),
                          ListTile(
                            leading: const Icon(Icons.phone),
                            title: const Text('Phone'),
                            subtitle: Text(userData['phone'] ?? 'N/A'),
                          ),
                          ListTile(
                            leading: const Icon(Icons.verified_user),
                            title: const Text('Email Verification'),
                            subtitle: Text(
                              userData['emailVerified'] == true
                                  ? 'Verified'
                                  : 'Not Verified',
                            ),
                            trailing: userData['emailVerified'] != true
                                ? TextButton(
                                    onPressed: () async {
                                      try {
                                        await ref
                                            .read(userProvider.notifier)
                                            .sendEmailVerification();
                                        _showSnackBar(
                                          title: 'Success',
                                          message:
                                              'Verification email sent successfully',
                                          contentType: ContentType.success,
                                        );
                                      } catch (e) {
                                        _showSnackBar(
                                          title: 'Error',
                                          message:
                                              'Failed to send verification email: ${e.toString()}',
                                          contentType: ContentType.failure,
                                        );
                                      }
                                    },
                                    child: const Text('Verify'),
                                  )
                                : null,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              if (_isLoading)
                Container(
                  color: Colors.black.withValues(alpha: 0.5),
                  child: const Center(
                    child: CircularProgressIndicator(),
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
