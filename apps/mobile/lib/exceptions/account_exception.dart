/// Custom exception for account-related errors
class AccountException implements Exception {
  final String message;
  final String? code;

  AccountException(this.message, {this.code});

  @override
  String toString() => 'AccountException: $message${code != null ? ' (Code: $code)' : ''}';
}
