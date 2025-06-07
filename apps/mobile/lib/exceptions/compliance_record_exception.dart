/// Custom exception for compliance record related errors.
class ComplianceRecordException implements Exception {
  final String message;
  final String? code;

  const ComplianceRecordException(this.message, {this.code});

  @override
  String toString() => 'ComplianceRecordException: $message${code != null ? ' (code: $code)' : ''}';

  /// Creates a [ComplianceRecordException] for when a compliance record is not found
  factory ComplianceRecordException.notFound([String? message]) {
    return ComplianceRecordException(
      message ?? 'Compliance record not found',
      code: 'NOT_FOUND',
    );
  }

  /// Creates a [ComplianceRecordException] for when a compliance record already exists
  factory ComplianceRecordException.alreadyExists([String? message]) {
    return ComplianceRecordException(
      message ?? 'Compliance record already exists',
      code: 'ALREADY_EXISTS',
    );
  }

  /// Creates a [ComplianceRecordException] for validation errors
  factory ComplianceRecordException.validation(String message) {
    return ComplianceRecordException(
      message,
      code: 'VALIDATION_ERROR',
    );
  }
}
