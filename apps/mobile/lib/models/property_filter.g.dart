// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'property_filter.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PropertyFilter _$PropertyFilterFromJson(Map<String, dynamic> json) =>
    PropertyFilter(
      title: json['title'] as String?,
      locationId: json['locationId'] as String?,
      category:
          $enumDecodeNullable(_$PropertyCategoryEnumMap, json['category']),
      status: $enumDecodeNullable(_$PropertyStatusEnumMap, json['status']),
      condition:
          $enumDecodeNullable(_$PropertyConditionEnumMap, json['condition']),
      ownerId: json['ownerId'] as String?,
      agencyId: json['agencyId'] as String?,
      createdAtFrom: json['createdAtFrom'] == null
          ? null
          : DateTime.parse(json['createdAtFrom'] as String),
      createdAtTo: json['createdAtTo'] == null
          ? null
          : DateTime.parse(json['createdAtTo'] as String),
      listedAtFrom: json['listedAtFrom'] == null
          ? null
          : DateTime.parse(json['listedAtFrom'] as String),
      listedAtTo: json['listedAtTo'] == null
          ? null
          : DateTime.parse(json['listedAtTo'] as String),
      priceMin: (json['priceMin'] as num?)?.toDouble(),
      priceMax: (json['priceMax'] as num?)?.toDouble(),
      sortBy: json['sortBy'] as String?,
      sortOrder: json['sortOrder'] as String?,
      page: (json['page'] as num?)?.toInt(),
      pageSize: (json['pageSize'] as num?)?.toInt(),
    );

Map<String, dynamic> _$PropertyFilterToJson(PropertyFilter instance) =>
    <String, dynamic>{
      'title': instance.title,
      'locationId': instance.locationId,
      'category': _$PropertyCategoryEnumMap[instance.category],
      'status': _$PropertyStatusEnumMap[instance.status],
      'condition': _$PropertyConditionEnumMap[instance.condition],
      'ownerId': instance.ownerId,
      'agencyId': instance.agencyId,
      'createdAtFrom': instance.createdAtFrom?.toIso8601String(),
      'createdAtTo': instance.createdAtTo?.toIso8601String(),
      'listedAtFrom': instance.listedAtFrom?.toIso8601String(),
      'listedAtTo': instance.listedAtTo?.toIso8601String(),
      'priceMin': instance.priceMin,
      'priceMax': instance.priceMax,
      'sortBy': instance.sortBy,
      'sortOrder': instance.sortOrder,
      'page': instance.page,
      'pageSize': instance.pageSize,
    };

const _$PropertyCategoryEnumMap = {
  PropertyCategory.residential: 'RESIDENTIAL',
  PropertyCategory.commercial: 'COMMERCIAL',
  PropertyCategory.industrial: 'INDUSTRIAL',
  PropertyCategory.land: 'LAND',
  PropertyCategory.other: 'OTHER',
  PropertyCategory.apartment: 'apartment',
};

const _$PropertyStatusEnumMap = {
  PropertyStatus.available: 'AVAILABLE',
  PropertyStatus.pending: 'PENDING',
  PropertyStatus.sold: 'SOLD',
  PropertyStatus.rented: 'RENTED',
  PropertyStatus.offMarket: 'OFF_MARKET',
  PropertyStatus.underContract: 'underContract',
  PropertyStatus.pendingApproval: 'pendingApproval',
  PropertyStatus.maintenance: 'maintenance',
  PropertyStatus.foreclosure: 'foreclosure',
  PropertyStatus.draft: 'draft',
  PropertyStatus.inactive: 'inactive',
};

const _$PropertyConditionEnumMap = {
  PropertyCondition.newConstruction: 'NEW_CONSTRUCTION',
  PropertyCondition.excellent: 'EXCELLENT',
  PropertyCondition.good: 'GOOD',
  PropertyCondition.needsRepair: 'NEEDS_REPAIR',
  PropertyCondition.renovated: 'RENOVATED',
  PropertyCondition.fixerUpper: 'FIXER_UPPER',
};
