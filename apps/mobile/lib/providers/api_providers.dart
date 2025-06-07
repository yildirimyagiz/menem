import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:mobile/api/api_service.dart';

part 'api_providers.g.dart';

@riverpod
// ignore: deprecated_member_use_from_same_package
ApiService apiService(ApiServiceRef ref) {
  // Configure your API service with base URLs, interceptors, etc. here
  return ApiService();
}
