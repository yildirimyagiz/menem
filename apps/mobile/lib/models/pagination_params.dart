import 'package:equatable/equatable.dart';

/// Standardized pagination parameters for API requests
class PaginationParams extends Equatable {
  /// The page number (1-based)
  final int page;

  /// Number of items per page
  final int limit;

  /// Field to sort by
  final String? sortBy;

  /// Sort order ('asc' or 'desc')
  final String sortOrder;

  /// Search query string
  final String? search;

  /// Whether to include deleted items
  final bool? includeDeleted;

  const PaginationParams({
    this.page = 1,
    this.limit = 10,
    this.sortBy,
    this.sortOrder = 'asc',
    this.search,
    this.includeDeleted,
  });

  /// Converts the pagination parameters to a map for API requests
  Map<String, dynamic> toJson() {
    return {
      'page': page,
      'limit': limit,
      if (sortBy != null) 'sortBy': sortBy,
      'sortOrder': sortOrder,
      if (search != null && search!.isNotEmpty) 'search': search,
      if (includeDeleted != null) 'includeDeleted': includeDeleted,
    };
  }

  /// Creates a copy of these parameters with the given fields replaced
  PaginationParams copyWith({
    int? page,
    int? limit,
    String? sortBy,
    String? sortOrder,
    String? search,
    bool? includeDeleted,
  }) {
    return PaginationParams(
      page: page ?? this.page,
      limit: limit ?? this.limit,
      sortBy: sortBy ?? this.sortBy,
      sortOrder: sortOrder ?? this.sortOrder,
      search: search ?? this.search,
      includeDeleted: includeDeleted ?? this.includeDeleted,
    );
  }

  @override
  List<Object?> get props => [
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        includeDeleted,
      ];
}
