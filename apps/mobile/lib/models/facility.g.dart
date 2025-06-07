// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facility.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Facility _$FacilityFromJson(Map<String, dynamic> json) => Facility(
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
      name: json['name'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$FacilityTypeEnumMap, json['type']),
      status: $enumDecode(_$FacilityStatusEnumMap, json['status']),
      propertyId: json['propertyId'] as String?,
      location: json['location'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$FacilityToJson(Facility instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'name': instance.name,
      'description': instance.description,
      'type': _$FacilityTypeEnumMap[instance.type]!,
      'status': _$FacilityStatusEnumMap[instance.status]!,
      'propertyId': instance.propertyId,
      'location': instance.location,
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
    };

const _$FacilityTypeEnumMap = {
  FacilityType.parking: 'PARKING',
  FacilityType.pool: 'POOL',
  FacilityType.gym: 'GYM',
  FacilityType.laundry: 'LAUNDRY',
  FacilityType.elevator: 'ELEVATOR',
  FacilityType.security: 'SECURITY',
  FacilityType.other: 'OTHER',
};

const _$FacilityStatusEnumMap = {
  FacilityStatus.available: 'AVAILABLE',
  FacilityStatus.unavailable: 'UNAVAILABLE',
  FacilityStatus.maintenance: 'MAINTENANCE',
};
