import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/account_providers.dart';
import 'package:awesome_snackbar_content/awesome_snackbar_content.dart';

class AccountManagementScreen extends ConsumerStatefulWidget {
  const AccountManagementScreen({super.key});

  @override
  ConsumerState<AccountManagementScreen> createState() =>
      _AccountManagementScreenState();
}

class _AccountManagementScreenState
    extends ConsumerState<AccountManagementScreen> {
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
  Widget build(BuildContext context) {
    final accountsState = ref.watch(accountNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Account Management'),
      ),
      body: accountsState.when(
        data: (accounts) {
          if (accounts.isEmpty) {
            return const Center(
              child: Text('No accounts found'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: accounts.length,
            itemBuilder: (context, index) {
              final account = accounts[index];
              return Card(
                child: ListTile(
                  leading: Icon(
                    _getProviderIcon(account.provider),
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  title: Text(account.provider),
                  subtitle: Text(account.type
                      .name), // Using .name for cleaner enum string representation
                  // If you need the exact @JsonValue (e.g. "GOOGLE"), you might need account.type.value or similar
                  trailing: PopupMenuButton<String>(
                    onSelected: (value) async {
                      switch (value) {
                        case 'disconnect':
                          try {
                            await ref
                                .read(accountNotifierProvider.notifier)
                                .deleteAccount(account.id);
                            if (!mounted) return;
                            _showSnackBar(
                              // ignore: use_build_context_synchronously
                              context: context,
                              title: 'Success',
                              message: 'Account disconnected successfully',
                              contentType: ContentType.success,
                            );
                          } catch (e) {
                            if (!mounted) return;
                            _showSnackBar(
                              // ignore: use_build_context_synchronously
                              context: context,
                              title: 'Error',
                              message: 'Failed to disconnect account: $e',
                              contentType: ContentType.failure,
                            );
                          }
                          break;
                      }
                    },
                    itemBuilder: (context) => [
                      const PopupMenuItem(
                        value: 'disconnect',
                        child: Text('Disconnect'),
                      ),
                    ],
                  ),
                ),
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
              Text(
                'Error loading accounts',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.error,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  ref.invalidate(accountNotifierProvider);
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getProviderIcon(String provider) {
    switch (provider.toLowerCase()) {
      case 'google':
        return Icons.g_mobiledata;
      case 'facebook':
        return Icons.facebook;
      case 'email':
        return Icons.email;
      default:
        return Icons.account_circle;
    }
  }
}
