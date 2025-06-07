// path: mobile/lib/hooks/use_auth.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';

class AuthHook {
  final Ref ref;

  AuthHook(this.ref);

  AsyncValue<Map<String, dynamic>?> get userAsync => ref.watch(authNotifierProvider);

  Map<String, dynamic>? get user => userAsync.value;

  bool get isAuthenticated => user != null;

  Future<void> login(String email, String password) async {
    await ref.read(authNotifierProvider.notifier).login(email, password);
  }

  Future<void> logout() async {
    await ref.read(authNotifierProvider.notifier).logout();
  }
}
