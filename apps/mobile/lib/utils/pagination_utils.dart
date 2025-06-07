import 'package:mobile/models/pagination.dart';
import 'package:mobile/models/pagination_params.dart';

extension PaginationExtension<T> on PaginatedResponse<T> {
  /// Creates a copy of the response with updated data
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

  /// Gets the next page parameters
  PaginationParams nextPageParams() {
    return PaginationParams(
      page: page + 1,
      limit: limit,
    );
  }
}

/// Creates an empty paginated response
PaginatedResponse<T> emptyPaginatedResponse<T>() {
  return PaginatedResponse<T>(
    data: [],
    page: 1,
    limit: 10,
    total: 0,
  );
}

/// Combines two paginated responses (useful for infinite scrolling)
PaginatedResponse<T> combinePaginatedResponses<T>(
  PaginatedResponse<T> existing,
  PaginatedResponse<T> newResponse,
) {
  return PaginatedResponse<T>(
    data: [...existing.data, ...newResponse.data],
    page: newResponse.page,
    limit: newResponse.limit,
    total: newResponse.total,
  );
}
