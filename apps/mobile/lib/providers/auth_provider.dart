// path: mobile/lib/providers/auth_provider.dart

import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../services/auth_service.dart';

part 'auth_provider.g.dart';

final authServiceProvider = FutureProvider<AuthService>((ref) async {
  return await AuthService.create(apiBaseUrl: 'https://localhost:3000/api');
});

@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  FutureOr<Map<String, dynamic>?> build() async {
    final authService = await ref.read(authServiceProvider.future);
    return authService.getUser();
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final authService = await ref.read(authServiceProvider.future);
      return await authService.login(email, password);
    });
  }

  Future<void> register(String name, String email, String password) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final authService = await ref.read(authServiceProvider.future);
      return await authService.register(name, email, password);
    });
  }

  Future<void> forgotPassword(String email) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final authService = await ref.read(authServiceProvider.future);
      await authService.forgotPassword(email);
      return state.value; // No user change
    });
  }

  Future<void> logout() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final authService = await ref.read(authServiceProvider.future);
      await authService.logout();
      return null;
    });
  }

  String? getUserId() {
    return state.value?['id'] as String?;
  }

  Future<bool> isAuthenticated() async {
    final authService = await ref.read(authServiceProvider.future);
    return authService.isAuthenticated();
  }

  Future<void> googleLogin() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final authService = await ref.read(authServiceProvider.future);
      // Call the implemented googleLogin method from AuthService
      final userData = await authService.googleLogin();
      return userData['user'] as Map<String, dynamic>;
    });
  }
}
