/// Custom exception for photo-related errors.
class PhotoException implements Exception {
  final String message;
  PhotoException(this.message);
  
  @override
  String toString() => 'PhotoException: $message';
}
