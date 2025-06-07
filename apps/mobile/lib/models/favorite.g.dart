// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'favorite.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Favorite _$FavoriteFromJson(Map<String, dynamic> json) => Favorite(
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
      userId: json['userId'] as String,
      entityId: json['entityId'] as String,
      type: $enumDecode(_$FavoriteTypeEnumMap, json['type']),
      notes: json['notes'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
      name: json['name'] as String?,
      description: json['description'] as String?,
    );

Map<String, dynamic> _$FavoriteToJson(Favorite instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'userId': instance.userId,
      'entityId': instance.entityId,
      'type': _$FavoriteTypeEnumMap[instance.type]!,
      'notes': instance.notes,
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
      'name': instance.name,
      'description': instance.description,
    };

const _$FavoriteTypeEnumMap = {
  FavoriteType.property: 'PROPERTY',
  FavoriteType.agent: 'AGENT',
  FavoriteType.agency: 'AGENCY',
  FavoriteType.other: 'OTHER',
};
