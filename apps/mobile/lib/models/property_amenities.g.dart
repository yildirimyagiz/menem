// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'property_amenities.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PropertyAmenities _$PropertyAmenitiesFromJson(Map<String, dynamic> json) =>
    PropertyAmenities(
      id: json['id'] as String,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      propertyId: json['propertyId'] as String,
      type: $enumDecode(_$PropertyAmenityTypeEnumMap, json['type']),
      description: json['description'] as String?,
      isIncluded: json['isIncluded'] as bool? ?? true,
      metadata: json['metadata'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$PropertyAmenitiesToJson(PropertyAmenities instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'propertyId': instance.propertyId,
      'type': _$PropertyAmenityTypeEnumMap[instance.type]!,
      'description': instance.description,
      'isIncluded': instance.isIncluded,
      'metadata': instance.metadata,
    };

const _$PropertyAmenityTypeEnumMap = {
  PropertyAmenityType.pool: 'POOL',
  PropertyAmenityType.gym: 'GYM',
  PropertyAmenityType.garden: 'GARDEN',
  PropertyAmenityType.parking: 'PARKING',
  PropertyAmenityType.security: 'SECURITY',
  PropertyAmenityType.elevator: 'ELEVATOR',
  PropertyAmenityType.storage: 'STORAGE',
  PropertyAmenityType.balcony: 'BALCONY',
  PropertyAmenityType.terrace: 'TERRACE',
  PropertyAmenityType.furnished: 'FURNISHED',
};
