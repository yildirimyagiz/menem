// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'communication_log.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunicationLog _$CommunicationLogFromJson(Map<String, dynamic> json) =>
    CommunicationLog(
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
      senderId: json['senderId'] as String,
      receiverId: json['receiverId'] as String,
      type: $enumDecode(_$CommunicationTypeEnumMap, json['type']),
      content: json['content'] as String,
      entityId: json['entityId'] as String?,
      entityType: json['entityType'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      isRead: json['isRead'] as bool? ?? false,
      readAt: json['readAt'] == null
          ? null
          : DateTime.parse(json['readAt'] as String),
      deliveredAt: json['deliveredAt'] == null
          ? null
          : DateTime.parse(json['deliveredAt'] as String),
      userId: json['userId'] as String?,
      agencyId: json['agencyId'] as String?,
      threadId: json['threadId'] as String?,
      replyToId: json['replyToId'] as String?,
      channelId: json['channelId'] as String?,
      ticketId: json['ticketId'] as String?,
      agency: json['Agency'] as Map<String, dynamic>?,
      user: json['User'] as Map<String, dynamic>?,
      replyTo: json['ReplyTo'] as Map<String, dynamic>?,
      replies: (json['Replies'] as List<dynamic>?)
          ?.map((e) => e as Map<String, dynamic>)
          .toList(),
      channel: json['Channel'] as Map<String, dynamic>?,
      ticket: json['Ticket'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$CommunicationLogToJson(CommunicationLog instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'senderId': instance.senderId,
      'receiverId': instance.receiverId,
      'type': _$CommunicationTypeEnumMap[instance.type]!,
      'content': instance.content,
      'entityId': instance.entityId,
      'entityType': instance.entityType,
      'metadata': instance.metadata,
      'isRead': instance.isRead,
      'readAt': instance.readAt?.toIso8601String(),
      'deliveredAt': instance.deliveredAt?.toIso8601String(),
      'userId': instance.userId,
      'agencyId': instance.agencyId,
      'threadId': instance.threadId,
      'replyToId': instance.replyToId,
      'channelId': instance.channelId,
      'ticketId': instance.ticketId,
      'Agency': instance.agency,
      'User': instance.user,
      'ReplyTo': instance.replyTo,
      'Replies': instance.replies,
      'Channel': instance.channel,
      'Ticket': instance.ticket,
    };

const _$CommunicationTypeEnumMap = {
  CommunicationType.problem: 'PROBLEM',
  CommunicationType.request: 'REQUEST',
  CommunicationType.advice: 'ADVICE',
  CommunicationType.information: 'INFORMATION',
  CommunicationType.feedback: 'FEEDBACK',
};
