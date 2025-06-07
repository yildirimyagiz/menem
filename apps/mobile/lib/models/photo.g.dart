// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'photo.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Photo _$PhotoFromJson(Map<String, dynamic> json) => Photo(
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
      url: json['url'] as String,
      type: json['type'] as String,
      caption: json['caption'] as String?,
      alt: json['alt'] as String?,
      src: json['src'] as String?,
      featured: json['featured'] as bool? ?? false,
      width: (json['width'] as num?)?.toInt(),
      height: (json['height'] as num?)?.toInt(),
      fileSize: (json['fileSize'] as num?)?.toInt(),
      mimeType: json['mimeType'] as String?,
      dominantColor: json['dominantColor'] as String?,
      userId: json['userId'] as String?,
      agencyId: json['agencyId'] as String?,
      propertyId: json['propertyId'] as String?,
      agentId: json['agentId'] as String?,
      postId: json['postId'] as String?,
    );

Map<String, dynamic> _$PhotoToJson(Photo instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'url': instance.url,
      'type': instance.type,
      'caption': instance.caption,
      'alt': instance.alt,
      'src': instance.src,
      'featured': instance.featured,
      'width': instance.width,
      'height': instance.height,
      'fileSize': instance.fileSize,
      'mimeType': instance.mimeType,
      'dominantColor': instance.dominantColor,
      'userId': instance.userId,
      'agencyId': instance.agencyId,
      'propertyId': instance.propertyId,
      'agentId': instance.agentId,
      'postId': instance.postId,
    };
