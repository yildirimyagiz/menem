import 'package:flutter/material.dart';
import 'package:mobile/components/layouts/client_layout.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class MyPropertiesScreen extends ConsumerWidget {
  const MyPropertiesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return const ClientLayout(
      child: Center(
        child: Text('My Properties Screen'),
      ),
    );
  }
}
