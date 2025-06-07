import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';

class GoogleLoginButton extends ConsumerWidget {
  const GoogleLoginButton({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ElevatedButton.icon(
      icon: Image.asset('assets/google_logo.png', height: 24),
      label: const Text('Sign in with Google'),
      onPressed: () async {
        await ref.read(authNotifierProvider.notifier).googleLogin();
        // Optionally handle navigation or error
      },
    );
  }
}
