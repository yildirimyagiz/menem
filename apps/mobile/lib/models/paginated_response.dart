/// A generic paginated response wrapper.
class PaginatedResponse<T> {
  /// The list of items for the current page.
  final List<T> data;

  /// The current page number (1-based).
  final int page;

  /// The number of items per page.
  final int limit;

  /// The total number of items across all pages.
  final int total;

  /// The total number of pages.
  int get totalPages => (total / limit).ceil();

  /// Whether there is a next page.
  bool get hasNextPage => page < totalPages;

  /// Whether there is a previous page.
  bool get hasPreviousPage => page > 1;

  const PaginatedResponse({
    required this.data,
    required this.page,
    required this.limit,
    required this.total,
  });

  /// Creates a [PaginatedResponse] from JSON.
  ///
  /// The [fromJson] function is used to convert each item in the data list
  /// from JSON to the appropriate type [T].
  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJson,
  ) {
    final data = (json['data'] as List).map((item) => fromJson(item)).toList();
    
    return PaginatedResponse<T>(
      data: data,
      page: json['page'] as int,
      limit: json['limit'] as int,
      total: json['total'] as int,
    );
  }

  /// Creates a [PaginatedResponse] with an empty data list.
  factory PaginatedResponse.empty() {
    return const PaginatedResponse(
      data: [],
      page: 1,
      limit: 10,
      total: 0,
    );
  }

  /// Maps the current [PaginatedResponse] to a new [PaginatedResponse] with a different type.
  PaginatedResponse<R> map<R>(R Function(T) transform) {
    return PaginatedResponse<R>(
      data: data.map(transform).toList(),
      page: page,
      limit: limit,
      total: total,
    );
  }

  /// Returns a new [PaginatedResponse] with the given data replaced.
  PaginatedResponse<T> copyWith({
    List<T>? data,
    int? page,
    int? limit,
    int? total,
  }) {
    return PaginatedResponse<T>(
      data: data ?? this.data,
      page: page ?? this.page,
      limit: limit ?? this.limit,
      total: total ?? this.total,
    );
  }

  @override
  String toString() {
    return 'PaginatedResponse{data: $data, page: $page, limit: $limit, total: $total}';
  }
}
