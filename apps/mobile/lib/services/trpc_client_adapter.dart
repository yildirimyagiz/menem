import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:mobile/services/communication_log_service.dart' show TrpcClient;

/// Adapter that makes Dio compatible with TrpcClient interface
class TrpcClientAdapter implements TrpcClient {
  final Dio _dio;

  TrpcClientAdapter(this._dio);

  @override
  Future<T?> query<T>(String procedure, Map<String, Object?> params) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/trpc/$procedure',
        queryParameters: {
          'input': jsonEncode(params),
        },
      );
      return response.data?['result']?['data'] as T?;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<T?> mutation<T>(String procedure, Map<String, Object?> params) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/trpc/$procedure',
        data: params,
      );
      return response.data?['result']?['data'] as T?;
    } catch (e) {
      rethrow;
    }
  }
}
