// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

User _$UserFromJson(Map<String, dynamic> json) => User(
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
      email: json['email'] as String,
      username: json['username'] as String?,
      displayName: json['displayName'] as String?,
      name: json['name'] as String?,
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
      phoneNumber: json['phoneNumber'] as String?,
      profilePicture: json['profilePicture'] as String?,
      image: json['image'] as String?,
      role: $enumDecode(_$RoleEnumMap, json['role']),
      type: $enumDecode(_$AccountTypeEnumMap, json['type']),
      isActive: json['isActive'] as bool,
      lastLogin: json['lastLogin'] == null
          ? null
          : DateTime.parse(json['lastLogin'] as String),
      emailVerified: json['emailVerified'] == null
          ? null
          : DateTime.parse(json['emailVerified'] as String),
      responseTime: json['responseTime'] as String?,
      locale: json['locale'] as String?,
      timezone: json['timezone'] as String?,
      preferences: json['preferences'] as Map<String, dynamic>?,
      agencyId: json['agencyId'] as String?,
      status: $enumDecode(_$UserStatusEnumMap, json['status']),
      facilityId: json['facilityId'] as String?,
      includedServiceId: json['includedServiceId'] as String?,
      extraChargeId: json['extraChargeId'] as String?,
      locationId: json['locationId'] as String?,
    );

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'email': instance.email,
      'username': instance.username,
      'displayName': instance.displayName,
      'name': instance.name,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'phoneNumber': instance.phoneNumber,
      'profilePicture': instance.profilePicture,
      'image': instance.image,
      'role': _$RoleEnumMap[instance.role]!,
      'type': _$AccountTypeEnumMap[instance.type]!,
      'isActive': instance.isActive,
      'lastLogin': instance.lastLogin?.toIso8601String(),
      'emailVerified': instance.emailVerified?.toIso8601String(),
      'responseTime': instance.responseTime,
      'locale': instance.locale,
      'timezone': instance.timezone,
      'preferences': instance.preferences,
      'agencyId': instance.agencyId,
      'status': _$UserStatusEnumMap[instance.status]!,
      'facilityId': instance.facilityId,
      'includedServiceId': instance.includedServiceId,
      'extraChargeId': instance.extraChargeId,
      'locationId': instance.locationId,
    };

const _$RoleEnumMap = {
  Role.user: 'USER',
  Role.admin: 'ADMIN',
  Role.superAdmin: 'SUPER_ADMIN',
  Role.agency: 'AGENCY',
  Role.agencyAdmin: 'AGENCY_ADMIN',
  Role.agentAdmin: 'AGENT_ADMIN',
  Role.agent: 'AGENT',
  Role.seller: 'SELLER',
  Role.buyer: 'BUYER',
  Role.guest: 'GUEST',
  Role.tenant: 'TENANT',
  Role.moderator: 'MODERATOR',
  Role.facilityManager: 'FACILITY_MANAGER',
  Role.unknown: 'unknown',
};

const _$AccountTypeEnumMap = {
  AccountType.oauth: 'OAUTH',
  AccountType.email: 'EMAIL',
  AccountType.oidc: 'OIDC',
  AccountType.credentials: 'CREDENTIALS',
  AccountType.google: 'GOOGLE',
  AccountType.facebook: 'FACEBOOK',
  AccountType.unknown: 'unknown',
};

const _$UserStatusEnumMap = {
  UserStatus.active: 'ACTIVE',
  UserStatus.inactive: 'INACTIVE',
  UserStatus.suspended: 'SUSPENDED',
  UserStatus.unknown: 'unknown',
};
