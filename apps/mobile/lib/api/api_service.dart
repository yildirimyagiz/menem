import 'package:dio/dio.dart';
import 'package:mobile/enums/property_enums.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

import '../config/env.dart'; // Import Env
import 'package:mobile/models/agency.dart';
import 'package:mobile/models/analytics.dart';
import 'package:mobile/models/availability.dart';
import 'package:mobile/models/favorite.dart';
// Assuming these models exist or will be created
import 'package:mobile/models/facility.dart'; // Assuming Facility model
import 'package:mobile/models/message.dart'; // Assuming Message model for chat
import 'package:mobile/models/notification.dart'; // Assuming Notification model
import 'package:mobile/models/property.dart' hide PropertyCategory;
import 'package:mobile/models/subscription.dart'; // Assuming Subscription model
import 'package:mobile/models/task.dart';
import 'package:mobile/models/user.dart';
import '../services/auth_service.dart';

class ApiService {
  /// Getter for the underlying Dio instance
  Dio get dio => _dio;
  final Dio _dio;
  final String baseUrl;
  final AuthService _authService;
  final String wsUrl;
  final Map<String, String> headers;
  WebSocketChannel? _wsChannel;

  // --- Static tRPC http-based client methods (from TRPCClient) ---
  static Future<dynamic> trpcQuery(
      String baseUrl, Map<String, String> headers, String procedure,
      [Map<String, dynamic>? input]) async {
    // Construct the base URL part
    var urlString = '$baseUrl/trpc/$procedure';

    // For GET requests (typical for tRPC queries), input is usually in query parameters.
    // tRPC often stringifies a single 'input' JSON object.
    if (input != null && input.isNotEmpty) {
      final encodedInput = Uri.encodeComponent(jsonEncode(input));
      urlString += '?input=$encodedInput';
    }

    final url = Uri.parse(urlString);
    final response = await http.get(
      // Changed to GET for queries
      url,
      headers: headers,
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      // Standard tRPC response structure often has { "result": { "data": ... } }
      if (data is Map<String, dynamic> &&
          data.containsKey('result') &&
          data['result'] is Map<String, dynamic> &&
          data['result'].containsKey('data')) {
        return data['result']['data'];
      }
      // Fallback or throw more specific error if structure is different
      throw Exception(
          'Failed to parse tRPC query response: Unexpected data structure. Body: ${response.body}');
    } else {
      throw Exception(
          'Failed to execute query: ${response.statusCode} ${response.reasonPhrase} - Body: ${response.body}');
    }
  }

  static Future<dynamic> trpcMutation(
      String baseUrl, Map<String, String> headers, String procedure,
      [Map<String, dynamic>? input]) async {
    final url =
        Uri.parse('$baseUrl/trpc/$procedure'); // Corrected string interpolation
    final response = await http.post(
      url,
      headers: headers,
      body: jsonEncode(input ?? {}),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      // Standard tRPC response structure
      if (data is Map<String, dynamic> &&
          data.containsKey('result') &&
          data['result'] is Map<String, dynamic> &&
          data['result'].containsKey('data')) {
        return data['result']['data'];
      }
      throw Exception(
          'Failed to parse tRPC mutation response: Unexpected data structure. Body: ${response.body}');
    } else {
      throw Exception(
          'Failed to execute mutation: ${response.statusCode} ${response.reasonPhrase} - Body: ${response.body}');
    }
  }

  ApiService({
    Dio? dio,
    String? baseUrl,
    AuthService? authService,
    String? wsUrl, // Made wsUrl optional, to be sourced from Env
    Map<String, String>? headers,
  })  : _dio = dio ?? Dio(),
        baseUrl = baseUrl ?? Env.apiBaseUrl, // Use Env for default
        _authService = authService ??
            (throw ArgumentError(
                'AuthService instance is required')), // Require resolved AuthService
        wsUrl = wsUrl ?? Env.wsUrl, // Use Env for default wsUrl
        headers = {
          'Content-Type': 'application/json',
          ...?headers,
        } {
    _dio.options.baseUrl = this.baseUrl; // Set Dio's base URL
    _dio.options.connectTimeout = const Duration(seconds: 5);
    _dio.options.receiveTimeout = const Duration(seconds: 3);
    _dio.interceptors.add(_AuthInterceptor(_authService));
  }

  void connectWebSocket() {
    _wsChannel = WebSocketChannel.connect(Uri.parse(wsUrl));
  }

  void disconnectWebSocket() {
    _wsChannel?.sink.close();
    _wsChannel = null;
  }

  void sendWebSocketMessage(String message) {
    _wsChannel?.sink.add(message);
  }

  Stream<dynamic> get webSocketStream =>
      _wsChannel?.stream ?? const Stream.empty();

  Future<dynamic> query(String procedure,
      [Map<String, dynamic>? params]) async {
    try {
      final response = await _dio.get(
        '/trpc/$procedure',
        queryParameters: params,
      );
      return response.data['result']['data'];
    } on DioException catch (e) {
      // Catch DioException specifically
      throw _handleError(e); // Use your existing handler
    }
  }

  Future<dynamic> mutation(String procedure,
      [Map<String, dynamic>? params]) async {
    try {
      final response = await _dio.post(
        '/trpc/$procedure',
        data: params,
      );
      return response.data['result']['data'];
    } on DioException catch (e) {
      // Catch DioException specifically
      throw _handleError(e); // Use your existing handler
    }
  }

  // Auth Router
  Future<User?> signIn(/*Credentials or token*/) async {
    // Actual implementation depends on auth strategy (e.g., credentials, token)
    // This is a placeholder if signIn is handled by a different mechanism (e.g., AuthApiClient)
    // or if it returns user data upon successful tRPC mutation.
    final result =
        await mutation('auth.signIn'); // Adjust procedure and params as needed
    if (result != null) {
      return User.fromJson(result as Map<String, dynamic>);
    }
    return null;
  }

  Future<void> signOut() async {
    await mutation('auth.signOut'); // Adjust procedure as needed
  }

  // Property Router
  Future<List<Property>> getProperties() async {
    final result = await query('property.getAll');
    if (result is List) {
      return result
          .map((json) => Property.fromJson(json as Map<String, dynamic>))
          .toList();
    }
    throw Exception('Failed to parse properties: Unexpected response format');
  }

  Future<Property> getPropertyById(String id) async {
    final result = await query('property.getById', {'id': id});
    if (result is Map<String, dynamic>) {
      return Property.fromJson(result);
    }
    throw Exception('Failed to parse property: Unexpected response format');
  }

  // Tenant Router
  // Assuming Tenant model exists (e.g., mobile/lib/models/tenant.dart)
  Future<List<dynamic>> getTenants() async {
    // Future<List<Tenant>>
    final result = await query('tenant.getAll');
    // return (result as List).map((item) => Tenant.fromJson(item as Map<String, dynamic>)).toList();
    return result as List<
        dynamic>; // Placeholder if Tenant model or fromJson is not ready
  }

  Future<dynamic> createTenant(Map<String, dynamic> data) async {
    // Future<Tenant>
    final result = await mutation('tenant.create', data);
    // return Tenant.fromJson(result as Map<String, dynamic>);
    return result; // Placeholder
  }

  // Chat Router
  Future<List<Message>> getMessages() async {
    final result = await query('chat.getMessages');
    if (result is List) {
      return result
          .map((json) => Message.fromJson(json as Map<String, dynamic>))
          .toList();
    }
    throw Exception('Failed to parse messages');
  }

  Future<Message> sendMessage(Map<String, dynamic> data) async {
    final result = await mutation('chat.sendMessage', data);
    return Message.fromJson(result as Map<String, dynamic>);
  }

  Future<List<Message>> getMessagesByRecipient(String recipientId) async {
    final result =
        await query('chat.getByRecipient', {'recipientId': recipientId});
    if (result is List) {
      return result
          .map((json) => Message.fromJson(json as Map<String, dynamic>))
          .toList();
    }
    throw Exception('Failed to parse messages by recipient');
  }

  Future<void> markMessageAsRead(String messageId) async {
    await mutation('chat.markAsRead', {'messageId': messageId});
  }

  // Dashboard Router
  // Assuming DashboardStats model exists
  Future<dynamic> getDashboardStats() async {
    // Future<DashboardStats>
    final result =
        await query('dashboard.getStats'); // Corrected tRPC procedure
    // return DashboardStats.fromJson(result as Map<String, dynamic>);
    return result; // Placeholder
  }

  // Task Router
  Future<List<Task>> getTasks() async {
    final result = await query('task.getAll'); // Corrected tRPC procedure
    if (result is List) {
      return result
          .map((json) => Task.fromJson(json as Map<String, dynamic>))
          .toList();
    }
    throw Exception('Failed to parse tasks');
  }

  Future<Task> createTask(Map<String, dynamic> data) async {
    final result =
        await mutation('task.create', data); // Corrected tRPC procedure
    return Task.fromJson(result as Map<String, dynamic>);
  }

  // Notification Router
  Future<List<Notification>> getNotifications() async {
    final result =
        await query('notification.getAll'); // Corrected tRPC procedure
    if (result is List) {
      return result
          .map((json) => Notification.fromJson(json as Map<String, dynamic>))
          .toList();
    }
    throw Exception('Failed to parse notifications');
  }

  // Facility Router
  Future<List<Facility>> getFacilities() async {
    final result = await query('facility.getAll'); // Corrected tRPC procedure
    if (result is List) {
      return result
          .map((json) => Facility.fromJson(json as Map<String, dynamic>))
          .toList();
    }
    throw Exception('Failed to parse facilities');
  }

  Future<Facility> createFacility(Map<String, dynamic> data) async {
    final result =
        await mutation('facility.create', data); // Corrected tRPC procedure
    return Facility.fromJson(result as Map<String, dynamic>);
  }

  // Subscription Router
  Future<Subscription> getSubscription() async {
    final result = await query('subscription.get'); // Corrected tRPC procedure
    return Subscription.fromJson(result as Map<String, dynamic>);
  }

  // User Router
  Future<List<User>> getUsers() async {
    try {
      // Assuming '/users' is a REST endpoint relative to your baseUrl, not tRPC.
      // If it's tRPC, use query('user.getAll') or similar.
      final response = await _dio.get('/users');
      final List<dynamic> responseData =
          response.data; // Dio automatically decodes JSON
      return responseData
          .map((item) => User.fromJson(item as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    } catch (e) {
      // Catch any other parsing errors or unexpected issues
      throw Exception('Failed to load or parse users: $e');
    }
  }

  Future<Response> get(String path,
      {Map<String, dynamic>? queryParameters}) async {
    try {
      return await _dio.get(path, queryParameters: queryParameters);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Response> post(String path, param1,
      {dynamic data, required Map<String, Map<String, String>> body}) async {
    try {
      return await _dio.post(path, data: data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Response> put(String path, {dynamic data}) async {
    try {
      return await _dio.put(path, data: data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Response> patch(String path, {dynamic data}) async {
    try {
      return await _dio.patch(path, data: data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Response> delete(String path) async {
    try {
      return await _dio.delete(path);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Exception _handleError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return Exception('Connection timeout. Please try again.');
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        dynamic responseData = error.response?.data;
        String errorMessage =
            'An unexpected error occurred.'; // Default message

        if (responseData is Map<String, dynamic> &&
            responseData.containsKey('message') &&
            responseData['message'] is String) {
          errorMessage = responseData['message'];
        } else if (responseData
                is Map<String, dynamic> && // Check for tRPC error structure
            responseData.containsKey('error') &&
            responseData['error'] is Map<String, dynamic> &&
            responseData['error']['message'] is String) {
          errorMessage = responseData['error']['message'];
        } else if (responseData is String && responseData.isNotEmpty) {
          errorMessage = responseData;
        } else {
          errorMessage = error.message ?? 'An unexpected error occurred.';
          // Consider logging the full error.response?.data if it's not a simple string or map with 'message'
        }
        return Exception('Error $statusCode: $errorMessage');
      case DioExceptionType.cancel:
        return Exception('Request cancelled');
      default:
        return Exception('Network error. Please check your connection.');
    }
  }

  // Favorite Router
  Future<List<Favorite>> getFavorites() async {
    try {
      final result = await query('favorite.getAll');
      if (result is List) {
        return result
            .map((json) => Favorite.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      throw Exception('Failed to parse favorites: Unexpected response format');
    } catch (e) {
      throw Exception('Failed to get favorites: $e');
    }
  }

  Future<void> addFavorite(String propertyId) async {
    try {
      await mutation('favorite.add', {'propertyId': propertyId});
    } catch (e) {
      throw Exception('Failed to add favorite: $e');
    }
  }

  Future<void> removeFavorite(String propertyId) async {
    try {
      await mutation('favorite.remove', {'propertyId': propertyId});
    } catch (e) {
      throw Exception('Failed to remove favorite: $e');
    }
  }

  // Placeholder: Implement or remove if not used via tRPC
  filterAgencies({List<AgencyStatus>? statuses, bool? isActive}) {}

  // Placeholder: Implement with tRPC query, e.g., query('analytics.get', params)
  getAnalytics(
      {String? entityId,
      String? entityType,
      AnalyticsType? type,
      DateTime? startDate,
      DateTime? endDate}) {}
  // Placeholder: Implement with tRPC query, e.g., query('analytics.getById', {'id': id})
  getAnalyticsById(String id) {}

  // Placeholder: Implement with tRPC mutation, e.g., mutation('analytics.create', analytics.toJson())
  createAnalytics(Analytics analytics) {}

  // Placeholder: Implement with tRPC query
  getPropertyAnalytics(
      {required String propertyId,
      AnalyticsType? type,
      DateTime? startDate,
      DateTime? endDate}) {}

  // Placeholder: Implement with tRPC query
  getAgencyAnalytics(
      {required String agencyId,
      AnalyticsType? type,
      DateTime? startDate,
      DateTime? endDate,
      required String agentId}) {}
  // Placeholder: Implement with tRPC query
  getAnalyticsSummary(
      {String? entityId,
      String? entityType,
      DateTime? startDate,
      DateTime? endDate}) {}

  // Placeholder: Implement with tRPC query, e.g., query('availability.getAll', params)
  getAvailabilities(
      {String? propertyId, DateTime? startDate, DateTime? endDate}) {}

  // Placeholder: Implement with tRPC query, e.g., query('availability.getById', {'id': id})
  getAvailability(String id) {}

  // Placeholder: Implement with tRPC mutation, e.g., mutation('availability.create', availability.toJson())
  createAvailability(Availability availability) {}

  // Placeholder: Implement with tRPC mutation, e.g., mutation('availability.update', availability.toJson())
  updateAvailability(Availability availability) {}

  // Placeholder: Implement with tRPC mutation, e.g., mutation('availability.delete', {'id': id})
  deleteAvailability(String id) {}

  // Placeholder: Implement with tRPC mutation
  blockDates(
      {required String propertyId,
      required DateTime startDate,
      required DateTime endDate,
      required int units,
      String? reason}) {}
  // Placeholder: Implement with tRPC mutation
  updatePricing(
      {required String propertyId,
      required DateTime startDate,
      required DateTime endDate,
      required double price,
      Map<String, dynamic>? settings}) {}

  // Placeholder: Implement with tRPC query, e.g., query('property.search', {'query': query})
  searchProperties(String query) {}

  // Placeholder: Implement with tRPC query
  filterProperties(
      {List<PropertyType>? types,
      List<PropertyStatus>? statuses,
      List<PropertyCategory>? categories}) {}

  // Placeholder: Implement with tRPC query, e.g., query('task.search', {'query': query})
  searchTasks(String query) {}
  // Placeholder: Implement with tRPC query
  filterTasks(
      {List<TaskStatus>? statuses,
      List<TaskPriority>? priorities,
      List<TaskType>? types,
      DateTime? dueDateFrom,
      DateTime? dueDateTo}) {}

  static Future buildHeaders() async {}
}

class _AuthInterceptor extends Interceptor {
  final AuthService _authService;

  _AuthInterceptor(this._authService);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = _authService.token;
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      _authService.signOut();
    }
    handler.next(err);
  }
}
