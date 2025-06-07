import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:mobile/models/permission.dart';
import 'package:mobile/services/permission_service.dart';
import 'api_providers.dart';

part 'permission_providers.g.dart';

/// Provider for the PermissionService
@riverpod
// ignore: deprecated_member_use_from_same_package
PermissionService permissionService(PermissionServiceRef ref) {
  final apiService = ref.watch(apiServiceProvider);
  return PermissionService(apiService);
}

/// Notifier for managing a list of permissions
@riverpod
class PermissionNotifier extends _$PermissionNotifier {
  late final PermissionService _service;

  @override
  Future<List<Permission>> build() async {
    _service = ref.watch(permissionServiceProvider);
    try {
      final response = await _service.getPermissions();
      return response.data;
    } catch (e, st) {
      debugPrint('Error loading permissions: $e\n$st');
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await _service.getPermissions();
      return response.data;
    });
  }

  Future<void> filter({
    String? userId,
    String? resourceId,
    String? type,
    String? scope,
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await _service.getPermissions(
        userId: userId,
        resourceId: resourceId,
        type: type,
        scope: scope,
      );
      return response.data;
    });
  }

  Future<Permission> createPermission(Map<String, dynamic> data) async {
    try {
      final permission = await _service.createPermission(data);
      await refresh(); // Refresh the list after creation
      return permission;
    } catch (e, st) {
      debugPrint('Error creating permission: $e\n$st');
      rethrow;
    }
  }
}

/// Notifier for managing a single permission
@riverpod
class PermissionDetailNotifier extends _$PermissionDetailNotifier {
  late final PermissionService _service;
  String? _permissionId;

  @override
  Future<Permission?> build(String id) async {
    _permissionId = id;
    _service = ref.watch(permissionServiceProvider);

    if (id.isEmpty) return null;

    try {
      return await _service.getPermission(id);
    } catch (e) {
      if (e.toString().contains('not found')) return null;
      rethrow;
    }
  }

  Future<void> refresh() async {
    if (_permissionId == null) return;
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => _service.getPermission(_permissionId!),
    );
  }

  Future<Permission> updatePermission(Map<String, dynamic> data) async {
    if (_permissionId == null) {
      throw Exception('No permission ID available for update');
    }

    try {
      final permission = await _service.updatePermission(_permissionId!, data);
      await refresh();
      return permission;
    } catch (e, st) {
      debugPrint('Error updating permission: $e\n$st');
      rethrow;
    }
  }

  Future<void> deletePermission() async {
    if (_permissionId == null) return;

    try {
      await _service.deletePermission(_permissionId!);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      debugPrint('Error deleting permission: $e\n$st');
      rethrow;
    }
  }
}
