import 'dart:developer';

import '../api/api_service.dart';
import '../exceptions/api_exception.dart';
import '../models/channel.dart';
import '../models/pagination.dart';

class ChannelService {
  final ApiService _apiService;

  ChannelService(this._apiService);

  Future<PaginatedResponse<Channel>> getChannels({
    int page = 1,
    int limit = 10,
    String? name,
    DateTime? createdAtFrom,
    DateTime? createdAtTo,
    DateTime? updatedAtFrom,
    DateTime? updatedAtTo,
    bool? includeDeleted = false,
    String? sortBy = 'createdAt',
    String sortOrder = 'desc',
    required String type,
    required String status,
    required String memberId,
  }) async {
    try {
      final response = await _apiService.query(
        'channel.list',
        {
          'page': page,
          'pageSize': limit,
          if (name != null) 'name': name,
          if (createdAtFrom != null)
            'createdAtFrom': createdAtFrom.toIso8601String(),
          if (createdAtTo != null) 'createdAtTo': createdAtTo.toIso8601String(),
          if (updatedAtFrom != null)
            'updatedAtFrom': updatedAtFrom.toIso8601String(),
          if (updatedAtTo != null) 'updatedAtTo': updatedAtTo.toIso8601String(),
          if (includeDeleted != null)
            'deletedAt': includeDeleted ? {'not': null} : null,
          'sortBy': sortBy,
          'sortOrder': sortOrder,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from getChannels');
      }

      return PaginatedResponse<Channel>.fromJson(
        response,
        (json) => Channel.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getChannels', e, st);
      throw ApiException.server('Failed to get channels: $e');
    }
  }

  Future<Channel> getChannel(String id) async {
    try {
      final response = await _apiService.query(
        'channel.getById',
        {'id': id},
      );

      if (response == null) {
        throw ApiException.notFound('Channel not found');
      }

      return Channel.fromJson(response);
    } catch (e, st) {
      _logError('getChannel', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Channel not found');
      }
      throw ApiException.server('Failed to get channel: $e');
    }
  }

  Future<Channel> createChannel({
    required String name,
    String? description,
    required String type,
    List<String>? memberIds,
  }) async {
    try {
      final response = await _apiService.mutation(
        'channel.create',
        {
          'name': name,
          if (description != null) 'description': description,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from createChannel');
      }

      return Channel.fromJson(response);
    } catch (e, st) {
      _logError('createChannel', e, st);
      throw ApiException.server('Failed to create channel: $e');
    }
  }

  Future<Channel> updateChannel({
    required String id,
    String? name,
    String? description,
    List<String>? memberIds,
    String? type,
  }) async {
    try {
      final response = await _apiService.mutation(
        'channel.update',
        {
          'id': id,
          if (name != null) 'name': name,
          if (description != null) 'description': description,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from updateChannel');
      }

      return Channel.fromJson(response);
    } catch (e, st) {
      _logError('updateChannel', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Channel not found');
      }
      throw ApiException.server('Failed to update channel: $e');
    }
  }

  Future<Channel> deleteChannel(String id) async {
    try {
      final response = await _apiService.mutation(
        'channel.delete',
        {'id': id},
      );

      if (response == null) {
        throw ApiException.server('No data returned from deleteChannel');
      }

      return Channel.fromJson(response);
    } catch (e, st) {
      _logError('deleteChannel', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Channel not found');
      }
      throw ApiException.server('Failed to delete channel: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[ChannelService][$method] $error', error: error, stackTrace: st);
  }
}
