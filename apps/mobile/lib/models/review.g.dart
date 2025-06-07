// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'review.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Review _$ReviewFromJson(Map<String, dynamic> json) => Review(
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
      type: $enumDecode(_$ReviewTypeEnumMap, json['type']),
      status: $enumDecode(_$ReviewStatusEnumMap, json['status']),
      rating: (json['rating'] as num).toInt(),
      title: json['title'] as String,
      content: json['content'] as String,
      images:
          (json['images'] as List<dynamic>?)?.map((e) => e as String).toList(),
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$ReviewToJson(Review instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'userId': instance.userId,
      'entityId': instance.entityId,
      'type': _$ReviewTypeEnumMap[instance.type]!,
      'status': _$ReviewStatusEnumMap[instance.status]!,
      'rating': instance.rating,
      'title': instance.title,
      'content': instance.content,
      'images': instance.images,
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
    };

const _$ReviewTypeEnumMap = {
  ReviewType.property: 'PROPERTY',
  ReviewType.agent: 'AGENT',
  ReviewType.agency: 'AGENCY',
  ReviewType.other: 'OTHER',
};

const _$ReviewStatusEnumMap = {
  ReviewStatus.pending: 'PENDING',
  ReviewStatus.approved: 'APPROVED',
  ReviewStatus.rejected: 'REJECTED',
};
