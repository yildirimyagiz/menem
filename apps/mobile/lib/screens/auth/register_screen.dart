import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'register_form.dart';

class RegisterScreen extends ConsumerWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Register'),
      ),
      body: const Padding(
        padding: EdgeInsets.all(24.0),
        child: RegisterForm(),
      ),
    );
  }
}
