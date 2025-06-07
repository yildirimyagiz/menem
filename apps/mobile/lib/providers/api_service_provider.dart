import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/api_service.dart';

final apiServiceProvider = Provider<ApiService>((ref) {
  // You can make this dynamic based on environment or config
  return ApiService(
    wsUrl: 'wss://localhost:2999',
    baseUrl: 'http://localhost:3000', // Use your real base URL
  );
});
