import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/api/api_service.dart';
import '../models/offer.dart';
import '../config/env.dart';

class OfferService {
  final String _baseUrl;

  OfferService(ApiService apiService, {String? baseUrl})
      : _baseUrl = baseUrl ?? Env.apiUrl;

  /// Get all offers
  Future<List<Offer>> getAll() async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/offers'),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)['data'] as List;
        return data.map((json) => Offer.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load offers: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error getting all offers: $e');
      rethrow;
    }
  }

  /// Get offers by status
  Future<List<Offer>> getOffersByStatus(String status) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/offers').replace(
          queryParameters: {'status': status},
        ),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)['data'] as List;
        return data.map((json) => Offer.fromJson(json)).toList();
      } else {
        throw Exception(
            'Failed to load offers by status $status: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error getting offers by status $status: $e');
      rethrow;
    }
  }

  /// Get offers by property ID
  Future<List<Offer>> getOffersByProperty(String propertyId) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/offers').replace(
          queryParameters: {'propertyId': propertyId},
        ),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)['data'] as List;
        return data.map((json) => Offer.fromJson(json)).toList();
      } else {
        throw Exception(
            'Failed to load offers for property $propertyId: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error getting offers for property $propertyId: $e');
      rethrow;
    }
  }

  /// Get a single offer by ID
  Future<Offer?> get(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/offers/$id'),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)['data'];
        if (data == null) return null;
        return Offer.fromJson(data);
      } else if (response.statusCode == 404) {
        return null;
      } else {
        throw Exception('Failed to load offer $id: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error getting offer $id: $e');
      rethrow;
    }
  }

  /// Helper method to get headers with auth token
  Future<Map<String, String>> _getHeaders() async {
    // If you need to add auth headers, you can get them from _apiService
    return {
      'Content-Type': 'application/json',
      // Add any other required headers here
    };
  }

  // Future<Offer> create(CreateOfferDto dto) { ... }
  // Future<Offer> update(String id, UpdateOfferDto dto) { ... }
  // Future<void> delete(String id) { ... }
}
