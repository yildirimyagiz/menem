// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'extra_charge.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExtraCharge _$ExtraChargeFromJson(Map<String, dynamic> json) => ExtraCharge(
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
      description: json['description'] as String?,
      icon: json['icon'] as String?,
      logo: json['logo'] as String?,
      facilityId: json['facilityId'] as String?,
      propertyIds: (json['propertyIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      agencyIds: (json['agencyIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      userIds: (json['userIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      taskIds: (json['taskIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      reportIds: (json['reportIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      facilityAmenityIds: (json['facilityAmenityIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      locationAmenityIds: (json['locationAmenityIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      expenseIds: (json['expenseIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      includedServiceIds: (json['includedServiceIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$ExtraChargeToJson(ExtraCharge instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'name': instance.name,
      'description': instance.description,
      'icon': instance.icon,
      'logo': instance.logo,
      'facilityId': instance.facilityId,
      'propertyIds': instance.propertyIds,
      'agencyIds': instance.agencyIds,
      'userIds': instance.userIds,
      'taskIds': instance.taskIds,
      'reportIds': instance.reportIds,
      'facilityAmenityIds': instance.facilityAmenityIds,
      'locationAmenityIds': instance.locationAmenityIds,
      'expenseIds': instance.expenseIds,
      'includedServiceIds': instance.includedServiceIds,
    };
