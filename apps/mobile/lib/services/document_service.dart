import 'package:flutter/foundation.dart';

import '../models/document.dart';
import 'dart:developer';

/// Custom exception for document-related errors.
class DocumentException implements Exception {
  final String message;
  DocumentException(this.message);
  @override
  String toString() => 'DocumentException: $message';
}

/// Service for handling document-related API operations via TRPC.
class DocumentService {
  final TrpcClient _client;

  DocumentService(this._client);

  /// Fetches all documents (optionally filtered by status/type).
  Future<List<Document>> getDocuments(
      {DocumentStatus? status, DocumentType? type}) async {
    try {
      final response = await _client.query<List<dynamic>>(
        'document.getAll',
        {
          if (status != null) 'status': status.toString().split('.').last,
          if (type != null) 'type': type.toString().split('.').last,
        },
      );
      if (response == null) {
        throw DocumentException('No data returned from getDocuments');
      }
      final documentsJson = List<Map<String, dynamic>>.from(response);
      return documentsJson.map((json) => Document.fromJson(json)).toList();
    } catch (e, st) {
      _logError('getDocuments', e, st);
      throw DocumentException('Failed to get documents: $e');
    }
  }

  /// Fetches a single document by ID.
  Future<Document> getDocument(String id) async {
    try {
      final response = await _client.query<Map<String, dynamic>>(
        'document.get',
        {'id': id},
      );
      if (response == null) {
        throw DocumentException('No data returned from getDocument');
      }
      return Document.fromJson(response);
    } catch (e, st) {
      _logError('getDocument', e, st);
      throw DocumentException('Failed to get document: $e');
    }
  }

  /// Creates a new document.
  Future<Document> createDocument(
    Map<String, dynamic> json, {
    required String title,
    required String description,
    required DocumentType type,
    required DocumentStatus status,
    // Add other required fields from your model here
  }) async {
    try {
      final response = await _client.mutation<Map<String, dynamic>>(
        'document.create',
        {
          'title': title,
          'description': description,
          'type': type.toString().split('.').last,
          'status': status.toString().split('.').last,
          // Add other fields here
        },
      );
      if (response == null) {
        throw DocumentException('No data returned from createDocument');
      }
      return Document.fromJson(response);
    } catch (e, st) {
      _logError('createDocument', e, st);
      throw DocumentException('Failed to create document: $e');
    }
  }

  /// Updates an existing document by ID.
  Future<Document> updateDocument(
    String id, {
    String? title,
    String? description,
    DocumentType? type,
    DocumentStatus? status,
    // Add other updatable fields from your model here
  }) async {
    try {
      final response = await _client.mutation<Map<String, dynamic>>(
        'document.update',
        {
          'id': id,
          if (title != null) 'title': title,
          if (description != null) 'description': description,
          if (type != null) 'type': type.toString().split('.').last,
          if (status != null) 'status': status.toString().split('.').last,
          // Add other fields here
        },
      );
      if (response == null) {
        throw DocumentException('No data returned from updateDocument');
      }
      return Document.fromJson(response);
    } catch (e, st) {
      _logError('updateDocument', e, st);
      throw DocumentException('Failed to update document: $e');
    }
  }

  /// Deletes a document by ID.
  Future<void> deleteDocument(String id) async {
    try {
      await _client.mutation<void>('document.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteDocument', e, st);
      throw DocumentException('Failed to delete document: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[DocumentService][$method] $error', error: error, stackTrace: st);
    // Optionally log errors to a logging service or console
    // Optionally log errors to a logging service or console
    if (kDebugMode) {
      print('DocumentService.$method error: $error\n$st');
    }
  }
}

class TrpcClient {
  Future<T?> query<T>(String procedure, Map<String, Object?> params) async {
    return null;
  }

  Future<T?> mutation<T>(String procedure, Map<String, Object?> params) async {
    return null;
  }
}
