// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'hashtag.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Hashtag _$HashtagFromJson(Map<String, dynamic> json) => Hashtag(
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
      type: $enumDecode(_$HashtagTypeEnumMap, json['type']),
      description: json['description'] as String?,
      usageCount: (json['usageCount'] as num?)?.toInt() ?? 0,
      relatedTags: (json['relatedTags'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      postIds:
          (json['postIds'] as List<dynamic>?)?.map((e) => e as String).toList(),
      propertyIds: (json['propertyIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      isTrending: json['isTrending'] as bool? ?? false,
      lastUsedAt: json['lastUsedAt'] == null
          ? null
          : DateTime.parse(json['lastUsedAt'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
      customFields: json['customFields'] as Map<String, dynamic>?,
      createdById: json['createdById'] as String?,
      agencyId: json['agencyId'] as String?,
    );

Map<String, dynamic> _$HashtagToJson(Hashtag instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'name': instance.name,
      'type': _$HashtagTypeEnumMap[instance.type]!,
      'description': instance.description,
      'usageCount': instance.usageCount,
      'relatedTags': instance.relatedTags,
      'postIds': instance.postIds,
      'propertyIds': instance.propertyIds,
      'isTrending': instance.isTrending,
      'lastUsedAt': instance.lastUsedAt?.toIso8601String(),
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
      'customFields': instance.customFields,
      'createdById': instance.createdById,
      'agencyId': instance.agencyId,
    };

const _$HashtagTypeEnumMap = {
  HashtagType.general: 'GENERAL',
  HashtagType.property: 'PROPERTY',
  HashtagType.location: 'LOCATION',
  HashtagType.amenity: 'AMENITY',
  HashtagType.custom: 'CUSTOM',
};
