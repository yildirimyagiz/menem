// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'post.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Post _$PostFromJson(Map<String, dynamic> json) => Post(
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
      title: json['title'] as String,
      content: json['content'] as String,
      type: $enumDecode(_$PostTypeEnumMap, json['type']),
      status: $enumDecode(_$PostStatusEnumMap, json['status']),
      authorId: json['authorId'] as String?,
      categoryId: json['categoryId'] as String?,
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList(),
      imageUrl: json['imageUrl'] as String?,
      publishedAt: json['publishedAt'] == null
          ? null
          : DateTime.parse(json['publishedAt'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$PostToJson(Post instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'title': instance.title,
      'content': instance.content,
      'type': _$PostTypeEnumMap[instance.type]!,
      'status': _$PostStatusEnumMap[instance.status]!,
      'authorId': instance.authorId,
      'categoryId': instance.categoryId,
      'tags': instance.tags,
      'imageUrl': instance.imageUrl,
      'publishedAt': instance.publishedAt?.toIso8601String(),
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
    };

const _$PostTypeEnumMap = {
  PostType.article: 'ARTICLE',
  PostType.news: 'NEWS',
  PostType.event: 'EVENT',
  PostType.announcement: 'ANNOUNCEMENT',
  PostType.other: 'OTHER',
};

const _$PostStatusEnumMap = {
  PostStatus.draft: 'DRAFT',
  PostStatus.published: 'PUBLISHED',
  PostStatus.archived: 'ARCHIVED',
};
