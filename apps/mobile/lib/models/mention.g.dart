// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mention.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Mention _$MentionFromJson(Map<String, dynamic> json) => Mention(
      id: json['id'] as String,
      userId: json['userId'] as String,
      postId: json['postId'] as String,
      commentId: json['commentId'] as String?,
      isRead: json['isRead'] as bool? ?? false,
      readAt: json['readAt'] == null
          ? null
          : DateTime.parse(json['readAt'] as String),
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

Map<String, dynamic> _$MentionToJson(Mention instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'userId': instance.userId,
      'postId': instance.postId,
      'commentId': instance.commentId,
      'isRead': instance.isRead,
      'readAt': instance.readAt?.toIso8601String(),
    };

_$MentionDataImpl _$$MentionDataImplFromJson(Map<String, dynamic> json) =>
    _$MentionDataImpl(
      id: json['id'] as String,
      mentionedById: json['mentionedById'] as String,
      mentionedToId: json['mentionedToId'] as String,
      type: json['type'] as String,
      taskId: json['taskId'] as String?,
      propertyId: json['propertyId'] as String?,
      content: json['content'] as String?,
      isRead: json['isRead'] as bool,
      agencyId: json['agencyId'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      userId: json['userId'] as String?,
    );

Map<String, dynamic> _$$MentionDataImplToJson(_$MentionDataImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'mentionedById': instance.mentionedById,
      'mentionedToId': instance.mentionedToId,
      'type': instance.type,
      'taskId': instance.taskId,
      'propertyId': instance.propertyId,
      'content': instance.content,
      'isRead': instance.isRead,
      'agencyId': instance.agencyId,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'userId': instance.userId,
    };
