/// Custom exception for agency-related errors.
class AgencyException implements Exception {
  final String message;
  final String? code;

  AgencyException(this.message, {this.code});

  @override
  String toString() => 'AgencyException: $message${code != null ? ' (Code: $code)' : ''}';
}
