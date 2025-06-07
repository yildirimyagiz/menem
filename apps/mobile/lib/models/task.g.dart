// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'task.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Task _$TaskFromJson(Map<String, dynamic> json) => Task(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      status: $enumDecodeNullable(_$TaskStatusEnumMap, json['status']) ??
          TaskStatus.todo,
      type: $enumDecode(_$TaskTypeEnumMap, json['type']),
      priority: $enumDecodeNullable(_$TaskPriorityEnumMap, json['priority']) ??
          TaskPriority.medium,
      createdById: json['createdById'] as String?,
      assignedToId: json['assignedToId'] as String?,
      propertyId: json['propertyId'] as String?,
      agentId: json['agentId'] as String?,
      agencyId: json['agencyId'] as String?,
      dueDate: json['dueDate'] == null
          ? null
          : DateTime.parse(json['dueDate'] as String),
      completedAt: json['completedAt'] == null
          ? null
          : DateTime.parse(json['completedAt'] as String),
      facilityId: json['facilityId'] as String?,
      includedServiceId: json['includedServiceId'] as String?,
      extraChargeId: json['extraChargeId'] as String?,
      createdBy: json['createdBy'] == null
          ? null
          : User.fromJson(json['createdBy'] as Map<String, dynamic>),
      assignedTo: json['assignedTo'] == null
          ? null
          : User.fromJson(json['assignedTo'] as Map<String, dynamic>),
      property: json['property'] == null
          ? null
          : Property.fromJson(json['property'] as Map<String, dynamic>),
      facility: json['facility'] == null
          ? null
          : Facility.fromJson(json['facility'] as Map<String, dynamic>),
      includedService: json['includedService'] == null
          ? null
          : IncludedService.fromJson(
              json['includedService'] as Map<String, dynamic>),
      extraCharge: json['extraCharge'] == null
          ? null
          : ExtraCharge.fromJson(json['extraCharge'] as Map<String, dynamic>),
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

Map<String, dynamic> _$TaskToJson(Task instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'title': instance.title,
      'description': instance.description,
      'status': _$TaskStatusEnumMap[instance.status]!,
      'type': _$TaskTypeEnumMap[instance.type]!,
      'priority': _$TaskPriorityEnumMap[instance.priority]!,
      'createdById': instance.createdById,
      'assignedToId': instance.assignedToId,
      'propertyId': instance.propertyId,
      'agentId': instance.agentId,
      'agencyId': instance.agencyId,
      'dueDate': instance.dueDate?.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'facilityId': instance.facilityId,
      'includedServiceId': instance.includedServiceId,
      'extraChargeId': instance.extraChargeId,
      'createdBy': instance.createdBy,
      'assignedTo': instance.assignedTo,
      'property': instance.property,
      'facility': instance.facility,
      'includedService': instance.includedService,
      'extraCharge': instance.extraCharge,
    };

const _$TaskStatusEnumMap = {
  TaskStatus.todo: 'TODO',
  TaskStatus.inProgress: 'IN_PROGRESS',
  TaskStatus.completed: 'COMPLETED',
  TaskStatus.cancelled: 'CANCELLED',
};

const _$TaskTypeEnumMap = {
  TaskType.propertyMaintenance: 'PROPERTY_MAINTENANCE',
  TaskType.listingReview: 'LISTING_REVIEW',
  TaskType.clientFollowUp: 'CLIENT_FOLLOW_UP',
  TaskType.documentProcessing: 'DOCUMENT_PROCESSING',
  TaskType.marketingTask: 'MARKETING_TASK',
  TaskType.salesActivity: 'SALES_ACTIVITY',
  TaskType.complianceCheck: 'COMPLIANCE_CHECK',
  TaskType.communicationFollowUp: 'COMMUNICATION_FOLLOW_UP',
};

const _$TaskPriorityEnumMap = {
  TaskPriority.low: 'LOW',
  TaskPriority.medium: 'MEDIUM',
  TaskPriority.high: 'HIGH',
  TaskPriority.urgent: 'URGENT',
};
