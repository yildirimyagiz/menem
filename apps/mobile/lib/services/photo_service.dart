import 'dart:developer';
import 'package:mobile/api/api_service.dart';
import 'package:mobile/exceptions/photo_exception.dart';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse
import 'package:mobile/models/photo.dart';

/// Service for handling photo-related API operations via TRPC.
class PhotoService {
  final ApiService _apiService;

  PhotoService(this._apiService);

  /// Fetches photos with pagination and filtering.
  Future<PaginatedResponse<Photo>> getPhotos({
    int page = 1,
    int limit = 10,
    String? type, // Photo type as string (e.g., 'PROPERTY', 'PROFILE', 'AGENCY')
    bool? featured,
    String? userId,
    String? agencyId,
    String? propertyId,
    String? agentId,
    String? postId,
    String? sortBy,
    String sortOrder = 'desc',
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
        'sortOrder': sortOrder,
      };
      if (type != null) params['type'] = type;
      if (featured != null) params['featured'] = featured;
      if (userId != null) params['userId'] = userId;
      if (agencyId != null) params['agencyId'] = agencyId;
      if (propertyId != null) params['propertyId'] = propertyId;
      if (agentId != null) params['agentId'] = agentId;
      if (postId != null) params['postId'] = postId;
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query('photo.list', params);
      if (response == null) {
        throw PhotoException('No data returned from getPhotos');
      }
      return PaginatedResponse<Photo>.fromJson(
        response as Map<String, dynamic>,
        (json) => Photo.fromJson(json as Map<String, dynamic>),
        dataKey: 'data',
      );
    } catch (e, st) {
      _logError('getPhotos', e, st);
      throw PhotoException('Failed to get photos: $e');
    }
  }

  /// Fetches a single photo by ID.
  Future<Photo> getPhoto(String id) async {
    try {
      final response = await _apiService.query(
        'photo.byId', // Corrected procedure name
        {'id': id},
      );
      if (response == null) {
        throw PhotoException('No data returned from getPhoto');
      }
      return Photo.fromJson(response);
    } catch (e, st) {
      _logError('getPhoto', e, st);
      throw PhotoException('Failed to get photo: $e');
    }
  }

  /// Creates a new photo.
  Future<Photo> createPhoto({
    required String url,
    required PhotoType type,
    required bool featured,
    String? caption,
    int? width,
    int? height,
    int? fileSize,
    String? mimeType,
    String? dominantColor,
    String? userId,
    String? agencyId,
    String? propertyId,
    String? agentId,
    String? postId,
  }) async {
    try {
      final Map<String, dynamic> data = {
        'url': url,
        'type': type.value, // Use the string value from the enum
        'featured': featured,
        if (caption != null) 'caption': caption,
        if (width != null) 'width': width,
        if (height != null) 'height': height,
        if (fileSize != null) 'fileSize': fileSize,
        if (mimeType != null) 'mimeType': mimeType,
        if (dominantColor != null) 'dominantColor': dominantColor,
        if (userId != null) 'userId': userId,
        if (agencyId != null) 'agencyId': agencyId,
        if (propertyId != null) 'propertyId': propertyId,
        if (agentId != null) 'agentId': agentId,
        if (postId != null) 'postId': postId,
      };
      final response = await _apiService.mutation('photo.create', data);
      if (response == null) {
        throw PhotoException('No data returned from createPhoto');
      }
      return Photo.fromJson(response);
    } catch (e, st) {
      _logError('createPhoto', e, st);
      throw PhotoException('Failed to create photo: $e');
    }
  }

  /// Updates an existing photo by ID.
  Future<Photo> updatePhoto({
    required String id,
    String? url,
    PhotoType? type,
    bool? featured,
    String? caption,
    int? width,
    int? height,
    int? fileSize,
    String? mimeType,
    String? dominantColor,
    DateTime? deletedAt, // For soft delete via update
  }) async {
    try {
      final Map<String, dynamic> data = {'id': id};
      if (url != null) data['url'] = url;
      if (type != null) data['type'] = type.value;

      if (featured != null) data['featured'] = featured;
      if (caption != null) {
        data['caption'] = caption; // Note: backend uses `caption: updateInput.caption ?? undefined,`
      }
      // To clear a field, you might need to send `null` explicitly if Zod schema allows.
      if (width != null) data['width'] = width;
      if (height != null) data['height'] = height;
      if (fileSize != null) data['fileSize'] = fileSize;
      if (mimeType != null) data['mimeType'] = mimeType;
      if (dominantColor != null) data['dominantColor'] = dominantColor;
      if (deletedAt != null) data['deletedAt'] = deletedAt.toIso8601String();

      final response = await _apiService.mutation('photo.update', data);
      if (response == null) {
        throw PhotoException('No data returned from updatePhoto');
      }
      return Photo.fromJson(response);
    } catch (e, st) {
      _logError('updatePhoto', e, st);
      throw PhotoException('Failed to update photo: $e');
    }
  }

  /// Deletes a photo by ID.
  Future<void> deletePhoto(String id) async {
    try {
      // This calls the hard delete.
      await _apiService.mutation('photo.delete', {'id': id});
    } catch (e, st) {
      _logError('deletePhoto', e, st);
      throw PhotoException('Failed to delete photo: $e');
    }
  }

  /// Soft deletes a photo by ID.
  Future<Photo> softDeletePhoto(String id) async {
    try {
      final response =
          await _apiService.mutation('photo.softDelete', {'id': id});
      return Photo.fromJson(response);
    } catch (e, st) {
      _logError('deletePhoto', e, st);
      throw PhotoException('Failed to delete photo: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[PhotoService][$method] $error', error: error, stackTrace: st);
  }
}

/// Supported photo types for the application
/// These should match the values expected by the backend API
enum PhotoType {
  property('PROPERTY'),
  profile('PROFILE'),
  agency('AGENCY'),
  cover('COVER'),
  gallery('GALLERY'),
  floorPlan('FLOOR_PLAN'),
  document('DOCUMENT'),
  other('OTHER');

  final String value;
  const PhotoType(this.value);

  @override
  String toString() => value;
}
