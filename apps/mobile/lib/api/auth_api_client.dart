import 'package:http/http.dart' as http;
import 'package:mobile/api/api_service.dart';

class AuthApiClient {
  final String baseUrl;

  AuthApiClient({required this.baseUrl});

  // Get current session/user via tRPC
  Future<Map<String, dynamic>?> getSession() async {
    final response = await ApiService.trpcQuery(
      baseUrl,
      {'Content-Type': 'application/json'},
      'auth.getSession',
    );
    if (response != null && response is Map<String, dynamic>) {
      return response;
    }
    return null;
  }

  // Sign in (credentials example)
  Future<bool> signIn(String email, String password) async {
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
    return response.statusCode == 200;
  }

  // Sign out
  Future<void> signOut() async {
    final url = Uri.parse('$baseUrl/auth/signout');
    await http.post(url, headers: {'Content-Type': 'application/json'});
  }
}

// Example usage
dynamic main() async {
  final authApi = AuthApiClient(baseUrl: 'http://localhost:3000');

  // Check session
  final session = await authApi.getSession();
  if (session != null) {
    // print('User is logged in: $session');
  } else {
    // print('Not logged in');
  }

  // Sign in
  final success = await authApi.signIn('user@example.com', 'password123');
  if (success) {
    // print('Signed in!');
  }

  // Sign out
  await authApi.signOut();
}
