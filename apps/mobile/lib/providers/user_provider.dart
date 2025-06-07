import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../utils/auth_service.dart';

final userProvider =
    StateNotifierProvider<UserNotifier, AsyncValue<Map<String, dynamic>?>>(
        (ref) {
  return UserNotifier();
});

class UserNotifier extends StateNotifier<AsyncValue<Map<String, dynamic>?>> {
  UserNotifier() : super(const AsyncValue.loading()) {
    loadUser();
  }

  Future<void> loadUser() async {
    try {
      final userData = await AuthService.getCurrentUser();
      state = AsyncValue.data(userData);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  Future<void> signOut() async {
    try {
      await AuthService.signOut();
      state = const AsyncValue.data(null);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  Future<void> updateProfile({
    required String name,
    required String phone,
  }) async {
    try {
      await AuthService.updateProfile(
        name: name,
        phone: phone,
      );
      await loadUser();
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      await AuthService.changePassword(
        currentPassword: currentPassword,
        newPassword: newPassword,
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }

  Future<void> sendEmailVerification() async {
    try {
      await AuthService.sendEmailVerification();
      // Reload user data to get updated verification status
      await loadUser();
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }

  Future<void> deleteAccount() async {
    try {
      await AuthService.deleteAccount();
      state = const AsyncValue.data(null);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }
}
