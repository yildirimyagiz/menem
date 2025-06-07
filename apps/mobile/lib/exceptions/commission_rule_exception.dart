/// Custom exception for commission rule related errors.
class CommissionRuleException implements Exception {
  final String message;
  final String? code;

  const CommissionRuleException(this.message, {this.code});

  @override
  String toString() => 'CommissionRuleException: $message${code != null ? ' (code: $code)' : ''}';

  /// Creates a [CommissionRuleException] for when a commission rule is not found
  factory CommissionRuleException.notFound([String? message]) {
    return CommissionRuleException(
      message ?? 'Commission rule not found',
      code: 'NOT_FOUND',
    );
  }

  /// Creates a [CommissionRuleException] for when a commission rule already exists
  factory CommissionRuleException.alreadyExists([String? message]) {
    return CommissionRuleException(
      message ?? 'Commission rule already exists',
      code: 'ALREADY_EXISTS',
    );
  }

  /// Creates a [CommissionRuleException] for validation errors
  factory CommissionRuleException.validation(String message) {
    return CommissionRuleException(
      message,
      code: 'VALIDATION_ERROR',
    );
  }
}
