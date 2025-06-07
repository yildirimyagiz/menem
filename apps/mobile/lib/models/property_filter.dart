import 'package:json_annotation/json_annotation.dart';
import 'property.dart';

part 'property_filter.g.dart';

@JsonSerializable()
class PropertyFilter {
  final String? title;
  final String? locationId;
  final PropertyCategory? category;
  final PropertyStatus? status;
  final PropertyCondition? condition;
  final String? ownerId;
  final String? agencyId;
  final DateTime? createdAtFrom;
  final DateTime? createdAtTo;
  final DateTime? listedAtFrom;
  final DateTime? listedAtTo;
  final double? priceMin;
  final double? priceMax;
  final String? sortBy;
  final String? sortOrder;
  final int? page;
  final int? pageSize;

  PropertyFilter({
    this.title,
    this.locationId,
    this.category,
    this.status,
    this.condition,
    this.ownerId,
    this.agencyId,
    this.createdAtFrom,
    this.createdAtTo,
    this.listedAtFrom,
    this.listedAtTo,
    this.priceMin,
    this.priceMax,
    this.sortBy,
    this.sortOrder,
    this.page,
    this.pageSize,
  });

  factory PropertyFilter.fromJson(Map<String, dynamic> json) =>
      _$PropertyFilterFromJson(json);

  Map<String, dynamic> toJson() => _$PropertyFilterToJson(this);

  PropertyFilter copyWith({
    String? title,
    String? locationId,
    PropertyCategory? category,
    PropertyStatus? status,
    PropertyCondition? condition,
    String? ownerId,
    String? agencyId,
    DateTime? createdAtFrom,
    DateTime? createdAtTo,
    DateTime? listedAtFrom,
    DateTime? listedAtTo,
    double? priceMin,
    double? priceMax,
    String? sortBy,
    String? sortOrder,
    int? page,
    int? pageSize,
  }) {
    return PropertyFilter(
      title: title ?? this.title,
      locationId: locationId ?? this.locationId,
      category: category ?? this.category,
      status: status ?? this.status,
      condition: condition ?? this.condition,
      ownerId: ownerId ?? this.ownerId,
      agencyId: agencyId ?? this.agencyId,
      createdAtFrom: createdAtFrom ?? this.createdAtFrom,
      createdAtTo: createdAtTo ?? this.createdAtTo,
      listedAtFrom: listedAtFrom ?? this.listedAtFrom,
      listedAtTo: listedAtTo ?? this.listedAtTo,
      priceMin: priceMin ?? this.priceMin,
      priceMax: priceMax ?? this.priceMax,
      sortBy: sortBy ?? this.sortBy,
      sortOrder: sortOrder ?? this.sortOrder,
      page: page ?? this.page,
      pageSize: pageSize ?? this.pageSize,
    );
  }
}
