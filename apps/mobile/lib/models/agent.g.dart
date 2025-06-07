// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'agent.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Agent _$AgentFromJson(Map<String, dynamic> json) => Agent(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String?,
      bio: json['bio'] as String?,
      phoneNumber: json['phoneNumber'] as String?,
      address: json['address'] as String?,
      website: json['website'] as String?,
      logoUrl: json['logoUrl'] as String?,
      status: $enumDecodeNullable(_$AgentStatusEnumMap, json['status']) ??
          AgentStatus.pending,
      agencyId: json['agencyId'] as String?,
      settings: json['settings'] as Map<String, dynamic>?,
      externalId: json['externalId'] as String?,
      integration: json['integration'] as Map<String, dynamic>?,
      ownerId: json['ownerId'] as String?,
      lastActive: json['lastActive'] == null
          ? null
          : DateTime.parse(json['lastActive'] as String),
      specialities: (json['specialities'] as List<dynamic>?)
          ?.map((e) => $enumDecode(_$AgentSpecialtyEnumMap, e))
          .toList(),
      agency: json['agency'] == null
          ? null
          : Agency.fromJson(json['agency'] as Map<String, dynamic>),
      owner: json['owner'] == null
          ? null
          : User.fromJson(json['owner'] as Map<String, dynamic>),
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

Map<String, dynamic> _$AgentToJson(Agent instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'name': instance.name,
      'email': instance.email,
      'phoneNumber': instance.phoneNumber,
      'address': instance.address,
      'website': instance.website,
      'logoUrl': instance.logoUrl,
      'status': _$AgentStatusEnumMap[instance.status]!,
      'bio': instance.bio,
      'agencyId': instance.agencyId,
      'settings': instance.settings,
      'externalId': instance.externalId,
      'integration': instance.integration,
      'ownerId': instance.ownerId,
      'lastActive': instance.lastActive?.toIso8601String(),
      'specialities': instance.specialities
          ?.map((e) => _$AgentSpecialtyEnumMap[e]!)
          .toList(),
      'agency': instance.agency,
      'owner': instance.owner,
    };

const _$AgentStatusEnumMap = {
  AgentStatus.pending: 'PENDING',
  AgentStatus.active: 'ACTIVE',
  AgentStatus.suspended: 'SUSPENDED',
};

const _$AgentSpecialtyEnumMap = {
  AgentSpecialty.residential: 'RESIDENTIAL',
  AgentSpecialty.commercial: 'COMMERCIAL',
  AgentSpecialty.luxury: 'LUXURY',
  AgentSpecialty.rental: 'RENTAL',
  AgentSpecialty.investment: 'INVESTMENT',
  AgentSpecialty.other: 'OTHER',
};
