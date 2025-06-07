class PaginatedResponse<T> {
  final List<T> data;
  final int page;
  final int limit;
  final int total;

  PaginatedResponse({
    required this.data,
    required this.page,
    required this.limit,
    required this.total,
  });

  factory PaginatedResponse.fromJson(
      Map<String, dynamic> json, T Function(dynamic) fromJsonT,
      {required String dataKey}) {
    return PaginatedResponse<T>(
      data: (json[dataKey] as List).map(fromJsonT).toList(),
      page: json['page'] as int,
      limit: json['limit'] as int,
      total: json['total'] as int,
    );
  }

  bool get hasMore => (page * limit) < total;
  int get totalPages => (total / limit).ceil();
}
