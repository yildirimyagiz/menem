/// A client for making tRPC requests
abstract class TrpcClient {
  /// Executes a tRPC query
  Future<T?> query<T>(String procedure, Map<String, Object?> params);

  /// Executes a tRPC mutation
  Future<T?> mutation<T>(String procedure, Map<String, Object?> params);
}
