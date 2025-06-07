import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../api/api_service.dart';

// part 'api_provider.g.dart'; // Removed: file not generated or needed

final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService(
    wsUrl: 'wss://localhost:2999',
    baseUrl: 'http://localhost:3000',
  );
});
