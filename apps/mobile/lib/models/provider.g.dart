// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'provider.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Provider _$ProviderFromJson(Map<String, dynamic> json) => Provider(
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
      type: $enumDecode(_$ProviderTypeEnumMap, json['type']),
      status: $enumDecode(_$ProviderStatusEnumMap, json['status']),
      contactName: json['contactName'] as String?,
      contactEmail: json['contactEmail'] as String?,
      contactPhone: json['contactPhone'] as String?,
      address: json['address'] as String?,
      city: json['city'] as String?,
      state: json['state'] as String?,
      country: json['country'] as String?,
      postalCode: json['postalCode'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$ProviderToJson(Provider instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'name': instance.name,
      'description': instance.description,
      'type': _$ProviderTypeEnumMap[instance.type]!,
      'status': _$ProviderStatusEnumMap[instance.status]!,
      'contactName': instance.contactName,
      'contactEmail': instance.contactEmail,
      'contactPhone': instance.contactPhone,
      'address': instance.address,
      'city': instance.city,
      'state': instance.state,
      'country': instance.country,
      'postalCode': instance.postalCode,
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
    };

const _$ProviderTypeEnumMap = {
  ProviderType.service: 'SERVICE',
  ProviderType.supplier: 'SUPPLIER',
  ProviderType.contractor: 'CONTRACTOR',
  ProviderType.other: 'OTHER',
};

const _$ProviderStatusEnumMap = {
  ProviderStatus.active: 'ACTIVE',
  ProviderStatus.inactive: 'INACTIVE',
  ProviderStatus.suspended: 'SUSPENDED',
};
