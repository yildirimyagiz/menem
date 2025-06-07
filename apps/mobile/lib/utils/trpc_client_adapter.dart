import 'package:flutter/foundation.dart';
import 'package:mobile/api/api_service.dart';
import 'package:mobile/services/trpc_client.dart';

/// Adapter to make ApiService work with code expecting TrpcClient
class TrpcClientAdapter implements TrpcClient {
  final String baseUrl;
  final Map<String, String> _headers = {};

  TrpcClientAdapter(ApiService apiService) : baseUrl = apiService.baseUrl;

  @override
  Future<T?> query<T>(String procedure, Map<String, Object?> params) async {
    try {
      // Convert params to the format expected by ApiService
      final input = _convertParams(params);
      return await ApiService.trpcQuery(baseUrl, _headers, procedure, input);
    } catch (e) {
      if (kDebugMode) {
        print('Error in TrpcClientAdapter.query: $e');
      }
      rethrow;
    }
  }

  @override
  Future<T?> mutation<T>(String procedure, Map<String, Object?> params) async {
    try {
      // Convert params to the format expected by ApiService
      final input = _convertParams(params);
      return await ApiService.trpcMutation(baseUrl, _headers, procedure, input);
    } catch (e) {
      if (kDebugMode) {
        print('Error in TrpcClientAdapter.mutation: $e');
      }
      rethrow;
    }
  }

  /// Convert parameters to the format expected by tRPC
  Map<String, dynamic> _convertParams(Map<String, Object?> params) {
    final result = <String, dynamic>{};
    for (final entry in params.entries) {
      if (entry.value != null) {
        result[entry.key] = entry.value;
      }
    }
    return result;
  }

  /// Set headers for the client
  void setHeaders(Map<String, String> headers) {
    _headers.addAll(headers);
  }

  /// Clear all headers
  void clearHeaders() {
    _headers.clear();
  }
}
