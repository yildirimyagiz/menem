import 'package:flutter/foundation.dart';

/// Base exception for API-related errors.
class ApiException implements Exception {
  final String message;
  final String? code;
  final dynamic data;
  final StackTrace? stackTrace;

  ApiException(
    this.message, {
    this.code,
    this.data,
    StackTrace? st,
  }) : stackTrace = st;

  @override
  String toString() =>
      'ApiException: $message${code != null ? ' (code: $code)' : ''}${data != null ? ' - Data: $data' : ''}';

  /// Create an exception from a TRPC error response
  factory ApiException.fromTrpcError({
    required String message,
    String? code,
    dynamic data,
    StackTrace? st,
  }) {
    return ApiException(message, code: code, data: data, st: st);
  }

  /// Create an exception for not found errors
  factory ApiException.notFound(String message) {
    return ApiException(message, code: 'NOT_FOUND');
  }

  /// Create an exception for validation errors
  factory ApiException.validation(String message) {
    return ApiException(message, code: 'VALIDATION_ERROR');
  }

  /// Create an exception for permission errors
  factory ApiException.permission(String message) {
    return ApiException(message, code: 'PERMISSION_DENIED');
  }

  /// Create an exception for server errors
  factory ApiException.server(String message) {
    return ApiException(message, code: 'SERVER_ERROR');
  }

  /// Create an exception for network errors
  factory ApiException.network(String message) {
    return ApiException(message, code: 'NETWORK_ERROR');
  }

  /// Create an exception for timeout errors
  factory ApiException.timeout(String message) {
    return ApiException(message, code: 'TIMEOUT');
  }

  /// Create an exception for authentication errors
  factory ApiException.auth(String message) {
    return ApiException(message, code: 'AUTH_ERROR');
  }

  /// Log the exception with developer tools
  void log() {
    if (stackTrace != null) {
      if (kDebugMode) {
        print('[ApiException] $this');
      }
      if (kDebugMode) {
        print('Stack Trace:');
      }
      if (kDebugMode) {
        print(stackTrace);
      }
    } else {
      if (kDebugMode) {
        print('[ApiException] $this');
      }
    }
  }
}
