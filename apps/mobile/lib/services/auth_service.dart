import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

/// Custom exception for authentication errors.
class AuthException implements Exception {
  final String message;
  AuthException(this.message);
  @override
  String toString() => 'AuthException: $message';
}

/// AuthService handles authentication, user session, and related API calls.
class AuthService {
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';

  final String apiBaseUrl;
  late final SharedPreferences _prefs;

  AuthService._(this.apiBaseUrl, this._prefs);

  /// Factory constructor to ensure async initialization.
  static Future<AuthService> create({required String apiBaseUrl}) async {
    final prefs = await SharedPreferences.getInstance();
    return AuthService._(apiBaseUrl, prefs);
  }

  /// Throws if SharedPreferences is not initialized (should never happen).
  void _assertPrefsReady() {}

  /// Saves the auth token.
  Future<void> setToken(String token) async {
    _assertPrefsReady();
    await _prefs.setString(_tokenKey, token);
  }

  /// Returns the current auth token, or null if not set.
  String? get token {
    _assertPrefsReady();
    return _prefs.getString(_tokenKey);
  }

  /// Saves the user data as JSON.
  Future<void> setUser(Map<String, dynamic> user) async {
    _assertPrefsReady();
    await _prefs.setString(_userKey, jsonEncode(user));
  }

  /// Gets the user data as a Map, or null if not set.
  Map<String, dynamic>? getUser() {
    _assertPrefsReady();
    final userStr = _prefs.getString(_userKey);
    if (userStr == null) return null;
    return jsonDecode(userStr) as Map<String, dynamic>;
  }

  /// Returns the user ID if available.
  String? getUserId() {
    return getUser()?['id'] as String?;
  }

  /// Signs out the current user and clears session data.
  Future<void> signOut() async {
    _assertPrefsReady();
    await _prefs.remove(_tokenKey);
    await _prefs.remove(_userKey);
  }

  /// Deletes the account by calling the backend and then signs out locally.
  Future<void> deleteAccount() async {
    try {
      final response = await http.post(
        Uri.parse('{apiBaseUrl}/trpc/auth.deleteAccount'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode != 200) {
        throw AuthException('Account deletion failed: {response.body}');
      }
      await signOut();
    } catch (e) {
      throw AuthException('Account deletion error: $e');
    }
  }

  /// Returns true if the user is authenticated.
  bool isAuthenticated() {
    return token != null;
  }

  /// Logs out the user (alias for signOut).
  Future<void> logout() async {
    await signOut();
  }

  /// Logs in a user with email and password.
  /// Throws [AuthException] on failure.
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$apiBaseUrl/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        await setToken(data['token'] as String);
        await setUser(data['user'] as Map<String, dynamic>);
        return data;
      } else {
        throw AuthException('Login failed: ${response.body}');
      }
    } catch (e) {
      throw AuthException('Login error: $e');
    }
  }

  /// Registers a new user.
  /// Throws [AuthException] on failure.
  Future<Map<String, dynamic>> register(
      String name, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$apiBaseUrl/api/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
        }),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        await setToken(data['token'] as String);
        await setUser(data['user'] as Map<String, dynamic>);
        return data;
      } else {
        throw AuthException('Registration failed: ${response.body}');
      }
    } catch (e) {
      throw AuthException('Registration error: $e');
    }
  }

  /// Requests a password reset for the given email.
  Future<void> forgotPassword(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$apiBaseUrl/api/auth/forgot-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email}),
      );
      if (response.statusCode != 200) {
        throw AuthException('Password reset failed: ${response.body}');
      }
    } catch (e) {
      throw AuthException('Password reset error: $e');
    }
  }

  /// Signs in a user with Google OAuth.
  /// Throws [AuthException] on failure.
  Future<Map<String, dynamic>> googleLogin() async {
    try {
      // Initialize Google Sign-In
      final googleSignIn = GoogleSignIn(
        clientId: 'YOUR_WEB_CLIENT_ID', // Replace with your web client ID
        scopes: <String>['email', 'profile'],
      );

      // Sign in with Google
      final googleUser = await googleSignIn.signIn();
      if (googleUser == null) {
        throw AuthException('Google sign in was cancelled');
      }

      // Get the authentication tokens
      final googleAuth = await googleUser.authentication;

      // Send the Google access token to your backend
      final response = await http.post(
        Uri.parse('$apiBaseUrl/api/auth/google'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'accessToken': googleAuth.accessToken,
          'idToken': googleAuth.idToken,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        await setToken(data['token'] as String);
        await setUser(data['user'] as Map<String, dynamic>);
        return data;
      } else {
        throw AuthException('Google login failed: ${response.body}');
      }
    } on PlatformException catch (e) {
      throw AuthException('Google sign in error: ${e.message}');
    } catch (e) {
      throw AuthException('Google sign in error: $e');
    }
  }
}
