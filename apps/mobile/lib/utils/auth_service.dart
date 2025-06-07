import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:logging/logging.dart';
import 'package:mobile/api/api_service.dart';

class AuthService {
  static final _logger = Logger('AuthService');

  /// Get current user session from Next.js backend using tRPC
  static Future<Map<String, dynamic>?> getCurrentUser(
      {String baseUrl = 'http://localhost:3000/api'}) async {
    try {
      final response = await ApiService.trpcQuery(
        baseUrl,
        {'Content-Type': 'application/json'},
        'auth.getSession',
      );
      if (response != null && response is Map<String, dynamic>) {
        return response;
      }
      return null;
    } catch (e) {
      _logger.severe('Get Current User Error', e);
      rethrow;
    }
  }

  /// Sign in with credentials (REST, NextAuth)
  static Future<Map<String, dynamic>?> signInWithEmailAndPassword(
      String email, String password,
      {String baseUrl = 'http://localhost:3000/api'}) async {
    try {
      final url = Uri.parse('$baseUrl/auth/callback/credentials');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: {
          'email': email,
          'password': password,
          'redirect': 'false',
        },
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Login failed: ${response.body}');
    } catch (e) {
      _logger.severe('Sign in error', e);
      throw Exception('Failed to sign in: ${e.toString()}');
    }
  }

  /// Register a new user (REST, Next.js)
  static Future<Map<String, dynamic>> signUpWithEmailAndPassword(
      String email, String password, String name,
      {String baseUrl = 'http://localhost:3000/api'}) async {
    try {
      final url = Uri.parse('$baseUrl/auth/register');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'name': name, 'email': email, 'password': password}),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Registration failed: ${response.body}');
    } catch (e) {
      _logger.severe('Sign up error', e);
      throw Exception('Failed to create account: ${e.toString()}');
    }
  }

  /// Sign out (REST, NextAuth)
  static Future<void> signOut(
      {String baseUrl = 'http://localhost:3000/api'}) async {
    try {
      final url = Uri.parse('$baseUrl/auth/signout');
      await http.post(url, headers: {'Content-Type': 'application/json'});
      // Optionally clear local session/token if needed
    } catch (e) {
      _logger.severe('Sign Out Error', e);
      rethrow;
    }
  }

  static Future<void> resetPassword(String email) async {
    try {
      final apiService = ApiService(wsUrl: '');
      await apiService.mutation('auth.forgotPassword', {
        'email': email,
      });
    } catch (e) {
      _logger.severe('Password reset error', e);
      throw Exception('Failed to send password reset email: ${e.toString()}');
    }
  }

  static Future<void> signInWithGoogle() async {
    // Implement the sign-in logic here
  }

  static Future<void> updateProfile(
      {required String name, required String phone} /* parameters */) async {
    // Implement the update profile logic here
  }

  static Future<void> changePassword(
      {required String currentPassword,
      required String newPassword} /* parameters */) async {
    // Implement the change password logic here
  }

  static Future<void> sendEmailVerification() async {
    // Implement the email verification logic here
  }

  static Future<void> deleteAccount() async {
    // Implement the delete account logic here
  }

  // Additional methods can be added here as needed
}
