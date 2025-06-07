// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'channel.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Channel _$ChannelFromJson(Map<String, dynamic> json) => Channel(
      id: json['id'] as String,
      isActive: json['isActive'] as bool?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      cuid: json['cuid'] as String,
      name: json['name'] as String,
      type: $enumDecode(_$ChannelTypeEnumMap, json['type']),
      category: $enumDecode(_$ChannelCategoryEnumMap, json['category']),
      description: json['description'] as String?,
      communicationLogs: (json['CommunicationLogs'] as List<dynamic>?)
          ?.map((e) => e as Map<String, dynamic>)
          .toList(),
    );

Map<String, dynamic> _$ChannelToJson(Channel instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'isActive': instance.isActive,
      'cuid': instance.cuid,
      'name': instance.name,
      'type': _$ChannelTypeEnumMap[instance.type]!,
      'category': _$ChannelCategoryEnumMap[instance.category]!,
      'description': instance.description,
      'CommunicationLogs': instance.communicationLogs,
    };

const _$ChannelTypeEnumMap = {
  ChannelType.public: 'PUBLIC',
  ChannelType.private: 'PRIVATE',
  ChannelType.group: 'GROUP',
};

const _$ChannelCategoryEnumMap = {
  ChannelCategory.agent: 'AGENT',
  ChannelCategory.agency: 'AGENCY',
  ChannelCategory.tenant: 'TENANT',
  ChannelCategory.property: 'PROPERTY',
  ChannelCategory.payment: 'PAYMENT',
  ChannelCategory.system: 'SYSTEM',
  ChannelCategory.report: 'REPORT',
  ChannelCategory.reservation: 'RESERVATION',
  ChannelCategory.task: 'TASK',
  ChannelCategory.ticket: 'TICKET',
};

ChannelModel _$ChannelModelFromJson(Map<String, dynamic> json) => ChannelModel(
      id: json['id'] as String,
      isActive: json['isActive'] as bool?,
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
      description: json['description'] as String?,
      type: $enumDecode(_$ChannelTypeEnumMap, json['type']),
      status: $enumDecode(_$ChannelStatusEnumMap, json['status']),
      icon: json['icon'] as String?,
      coverImage: json['coverImage'] as String?,
      memberIds:
          (json['memberIds'] as List<dynamic>).map((e) => e as String).toList(),
      ownerId: json['ownerId'] as String?,
      settings: json['settings'] as Map<String, dynamic>?,
      isPrivate: json['isPrivate'] as bool,
      lastMessageId: json['lastMessageId'] as String?,
      lastMessageAt: json['lastMessageAt'] == null
          ? null
          : DateTime.parse(json['lastMessageAt'] as String),
      unreadCount: (json['unreadCount'] as num).toInt(),
      metadata: json['metadata'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$ChannelModelToJson(ChannelModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'isActive': instance.isActive,
      'name': instance.name,
      'description': instance.description,
      'type': _$ChannelTypeEnumMap[instance.type]!,
      'status': _$ChannelStatusEnumMap[instance.status]!,
      'icon': instance.icon,
      'coverImage': instance.coverImage,
      'memberIds': instance.memberIds,
      'ownerId': instance.ownerId,
      'settings': instance.settings,
      'isPrivate': instance.isPrivate,
      'lastMessageId': instance.lastMessageId,
      'lastMessageAt': instance.lastMessageAt?.toIso8601String(),
      'unreadCount': instance.unreadCount,
      'metadata': instance.metadata,
    };

const _$ChannelStatusEnumMap = {
  ChannelStatus.active: 'ACTIVE',
  ChannelStatus.archived: 'ARCHIVED',
  ChannelStatus.deleted: 'DELETED',
};
