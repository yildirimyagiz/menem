// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'agency.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Agency _$AgencyFromJson(Map<String, dynamic> json) => Agency(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      phone: json['phone'] as String?,
      email: json['email'] as String?,
      website: json['website'] as String?,
      address: json['address'] as String?,
      logoUrl: json['logoUrl'] as String?,
      status: $enumDecodeNullable(_$AgencyStatusEnumMap, json['status']) ??
          AgencyStatus.pending,
      facilityId: json['facilityId'] as String?,
      includedServiceId: json['includedServiceId'] as String?,
      extraChargeId: json['extraChargeId'] as String?,
      isActive: json['isActive'] as bool? ?? true,
      ownerId: json['ownerId'] as String?,
      settings: json['settings'] as Map<String, dynamic>?,
      theme: json['theme'] as String?,
      externalId: json['externalId'] as String?,
      integration: json['integration'] as Map<String, dynamic>?,
      owner: json['owner'] == null
          ? null
          : User.fromJson(json['owner'] as Map<String, dynamic>),
      facility: json['facility'] == null
          ? null
          : Facility.fromJson(json['facility'] as Map<String, dynamic>),
      includedService: json['includedService'] == null
          ? null
          : IncludedService.fromJson(
              json['includedService'] as Map<String, dynamic>),
      extraCharge: json['extraCharge'] == null
          ? null
          : ExtraCharge.fromJson(json['extraCharge'] as Map<String, dynamic>),
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
    );

Map<String, dynamic> _$AgencyToJson(Agency instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'name': instance.name,
      'description': instance.description,
      'phone': instance.phone,
      'email': instance.email,
      'website': instance.website,
      'address': instance.address,
      'logoUrl': instance.logoUrl,
      'status': _$AgencyStatusEnumMap[instance.status]!,
      'facilityId': instance.facilityId,
      'includedServiceId': instance.includedServiceId,
      'extraChargeId': instance.extraChargeId,
      'isActive': instance.isActive,
      'ownerId': instance.ownerId,
      'settings': instance.settings,
      'theme': instance.theme,
      'externalId': instance.externalId,
      'integration': instance.integration,
      'owner': instance.owner,
      'facility': instance.facility,
      'includedService': instance.includedService,
      'extraCharge': instance.extraCharge,
    };

const _$AgencyStatusEnumMap = {
  AgencyStatus.pending: 'PENDING',
  AgencyStatus.active: 'ACTIVE',
  AgencyStatus.suspended: 'SUSPENDED',
};
