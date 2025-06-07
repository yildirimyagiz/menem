// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ticket.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Ticket _$TicketFromJson(Map<String, dynamic> json) => Ticket(
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
      description: json['description'] as String,
      type: $enumDecode(_$TicketTypeEnumMap, json['type']),
      priority: $enumDecode(_$TicketPriorityEnumMap, json['priority']),
      status: $enumDecode(_$TicketStatusEnumMap, json['status']),
      userId: json['userId'] as String,
      assignedTo: json['assignedTo'] as String?,
      dueDate: json['dueDate'] == null
          ? null
          : DateTime.parse(json['dueDate'] as String),
      resolvedAt: json['resolvedAt'] == null
          ? null
          : DateTime.parse(json['resolvedAt'] as String),
      closedAt: json['closedAt'] == null
          ? null
          : DateTime.parse(json['closedAt'] as String),
      attachments: (json['attachments'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$TicketToJson(Ticket instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'title': instance.title,
      'description': instance.description,
      'type': _$TicketTypeEnumMap[instance.type]!,
      'priority': _$TicketPriorityEnumMap[instance.priority]!,
      'status': _$TicketStatusEnumMap[instance.status]!,
      'userId': instance.userId,
      'assignedTo': instance.assignedTo,
      'dueDate': instance.dueDate?.toIso8601String(),
      'resolvedAt': instance.resolvedAt?.toIso8601String(),
      'closedAt': instance.closedAt?.toIso8601String(),
      'attachments': instance.attachments,
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
    };

const _$TicketTypeEnumMap = {
  TicketType.support: 'SUPPORT',
  TicketType.featureRequest: 'FEATURE_REQUEST',
  TicketType.bug: 'BUG',
  TicketType.complaint: 'COMPLAINT',
  TicketType.other: 'OTHER',
};

const _$TicketPriorityEnumMap = {
  TicketPriority.low: 'LOW',
  TicketPriority.medium: 'MEDIUM',
  TicketPriority.high: 'HIGH',
  TicketPriority.urgent: 'URGENT',
};

const _$TicketStatusEnumMap = {
  TicketStatus.open: 'OPEN',
  TicketStatus.inProgress: 'IN_PROGRESS',
  TicketStatus.resolved: 'RESOLVED',
  TicketStatus.closed: 'CLOSED',
  TicketStatus.onHold: 'ON_HOLD',
};
