// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'permission.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Permission _$PermissionFromJson(Map<String, dynamic> json) => Permission(
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
      type: $enumDecode(_$PermissionTypeEnumMap, json['type']),
      scope: $enumDecode(_$PermissionScopeEnumMap, json['scope']),
      resourceId: json['resourceId'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$PermissionToJson(Permission instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'name': instance.name,
      'description': instance.description,
      'type': _$PermissionTypeEnumMap[instance.type]!,
      'scope': _$PermissionScopeEnumMap[instance.scope]!,
      'resourceId': instance.resourceId,
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
    };

const _$PermissionTypeEnumMap = {
  PermissionType.read: 'READ',
  PermissionType.write: 'WRITE',
  PermissionType.delete: 'DELETE',
  PermissionType.admin: 'ADMIN',
  PermissionType.other: 'OTHER',
};

const _$PermissionScopeEnumMap = {
  PermissionScope.property: 'PROPERTY',
  PermissionScope.user: 'USER',
  PermissionScope.agency: 'AGENCY',
  PermissionScope.system: 'SYSTEM',
  PermissionScope.other: 'OTHER',
};
