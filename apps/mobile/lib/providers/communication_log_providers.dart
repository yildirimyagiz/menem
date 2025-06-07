import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:logging/logging.dart';

import '../api/api_service.dart';
import '../models/communication_log.dart';
import '../services/communication_log_service.dart';
import 'api_service_provider.dart';

/// Provider for CommunicationLogService
final communicationLogServiceProvider =
    Provider<CommunicationLogService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  // Create a simple implementation of TrpcClient that uses ApiService
  final trpcClient = _ApiServiceTrpcClient(apiService);
  return CommunicationLogService(trpcClient);
});

/// Simple implementation of TrpcClient that uses ApiService
class _ApiServiceTrpcClient implements TrpcClient {
  final ApiService _apiService;

  _ApiServiceTrpcClient(this._apiService);

  @override
  Future<T?> query<T>(String procedure, Map<String, Object?> params) async {
    try {
      // Convert params to query parameters with string values
      final queryParams = <String, dynamic>{};
      params.forEach((key, value) {
        if (value != null) {
          queryParams[key] = value;
        }
      });
      
      final response = await _apiService.get(
        '/trpc/$procedure',
        queryParameters: queryParams,
      );
      
      // Handle tRPC response format
      final responseData = response.data;
      if (responseData is Map<String, dynamic> && 
          responseData.containsKey('result') && 
          responseData['result'] is Map) {
        return (responseData['result'] as Map)['data'] as T?;
      }
      return responseData as T?;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<T?> mutation<T>(String procedure, Map<String, Object?> params) async {
    try {
      // Convert params to a format compatible with the API
      // The API expects body to be Map<String, Map<String, String>>
      final stringParams = params.map((key, value) => 
        MapEntry(key, value?.toString() ?? '')
      );
      final body = <String, Map<String, String>>{
        'input': stringParams.cast<String, String>(),
      };
      
      final response = await _apiService.post(
        '/trpc/$procedure',
        null, // First parameter is unused
        body: body,
      );
      
      // Handle tRPC response format
      final responseData = response.data;
      if (responseData is Map<String, dynamic> && 
          responseData.containsKey('result') && 
          responseData['result'] is Map) {
        return (responseData['result'] as Map)['data'] as T?;
      }
      return responseData as T?;
    } catch (e) {
      rethrow;
    }
  }
}

/// Notifier for managing a list of communication logs
class CommunicationLogNotifier
    extends StateNotifier<AsyncValue<List<CommunicationLog>>> {
  final CommunicationLogService _service;
  final _logger = Logger('CommunicationLogNotifier');
  String? _senderId;
  String? _receiverId;

  CommunicationLogNotifier(this._service,
      {String? senderId, String? receiverId})
      : _senderId = senderId,
        _receiverId = receiverId,
        super(const AsyncValue.loading()) {
    _loadLogs();
  }

  Future<void> _loadLogs() async {
    try {
      state = const AsyncValue.loading();
      final logs = await _service.getLogs(
        senderId: _senderId,
        receiverId: _receiverId,
      );
      state = AsyncValue.data(logs);
    } catch (e, st) {
      _logger.severe('Failed to load communication logs', e, st);
      state = AsyncValue.error(e, st);
    }
  }

  void setFilters({String? senderId, String? receiverId}) {
    _senderId = senderId;
    _receiverId = receiverId;
  }

  Future<void> refresh() async {
    await _loadLogs();
  }

  Future<void> addLog(CommunicationLog log) async {
    try {
      await _service.createLog(
        senderId: log.senderId,
        receiverId: log.receiverId,
        type: log.type,
        content: log.content,
        entityId: log.entityId,
        entityType: log.entityType,
        metadata: log.metadata,
        isRead: log.isRead,
      );
      await _loadLogs();
    } catch (e, st) {
      _logger.severe('Failed to add communication log', e, st);
      rethrow;
    }
  }

  Future<void> updateLog(CommunicationLog log) async {
    try {
      await _service.updateLog(
        id: log.id,
        type: log.type,
        content: log.content,
        entityId: log.entityId,
        entityType: log.entityType,
        metadata: log.metadata,
        isRead: log.isRead,
      );
      await _loadLogs();
    } catch (e, st) {
      _logger.severe('Failed to update communication log', e, st);
      rethrow;
    }
  }

  Future<void> deleteLog(String id) async {
    try {
      await _service.deleteLog(id);
      await _loadLogs();
    } catch (e, st) {
      _logger.severe('Failed to delete communication log', e, st);
      rethrow;
    }
  }
}

/// Notifier for managing a single communication log
class CommunicationLogDetailNotifier
    extends StateNotifier<AsyncValue<CommunicationLog>> {
  final CommunicationLogService _service;
  final _logger = Logger('CommunicationLogDetailNotifier');

  CommunicationLogDetailNotifier(this._service)
      : super(const AsyncValue.loading());

  Future<void> getLogById(String id) async {
    try {
      state = const AsyncValue.loading();
      final log = await _service.getLog(id);
      state = AsyncValue.data(log);
    } catch (e, st) {
      _logger.severe('Failed to load communication log', e, st);
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> refresh(String id) async {
    await getLogById(id);
  }

  /// Updates the read status of a log
  Future<void> markAsRead(String id) async {
    try {
      final currentLog = state.value;
      if (currentLog != null && !currentLog.isRead) {
        await _service.updateLog(
          id: id,
          isRead: true,
        );
        state = AsyncValue.data(currentLog.copyWith(isRead: true));
      }
    } catch (e, st) {
      _logger.severe('Failed to mark log as read', e, st);
      rethrow;
    }
  }
}

/// Provider for the list of communication logs
final communicationLogsProvider = StateNotifierProvider.family<
    CommunicationLogNotifier,
    AsyncValue<List<CommunicationLog>>,
    ({String? senderId, String? receiverId})>(
  (ref, filters) {
    final service = ref.watch(communicationLogServiceProvider);
    return CommunicationLogNotifier(
      service,
      senderId: filters.senderId,
      receiverId: filters.receiverId,
    );
  },
);

/// Provider for a single communication log
final communicationLogDetailProvider = StateNotifierProvider.family<
    CommunicationLogDetailNotifier, AsyncValue<CommunicationLog>, String>(
  (ref, id) {
    final service = ref.watch(communicationLogServiceProvider);
    final notifier = CommunicationLogDetailNotifier(service);
    notifier.getLogById(id);
    return notifier;
  },
);
