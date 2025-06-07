import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';

class ForgotPasswordForm extends ConsumerStatefulWidget {
  const ForgotPasswordForm({super.key});

  @override
  ConsumerState<ForgotPasswordForm> createState() => _ForgotPasswordFormState();
}

class _ForgotPasswordFormState extends ConsumerState<ForgotPasswordForm> {
  final _emailController = TextEditingController();
  bool _loading = false;
  String? _error;
  String? _success;

  Future<void> _submit() async {
    setState(() {
      _loading = true;
      _error = null;
      _success = null;
    });
    try {
      await ref.read(authNotifierProvider.notifier).forgotPassword(_emailController.text);
      setState(() {
        _success = 'If your email exists, a reset link was sent.';
      });
    } catch (e) {
      setState(() {
        _error = 'Failed to send reset email.';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(labelText: 'Email'),
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 24),
        if (_error != null)
          Text(_error!, style: const TextStyle(color: Colors.red)),
        if (_success != null)
          Text(_success!, style: const TextStyle(color: Colors.green)),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: _loading ? null : _submit,
          child: _loading ? const CircularProgressIndicator() : const Text('Send Reset Link'),
        ),
      ],
    );
  }
}
