import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';
import 'user.dart';
import 'property.dart';
import 'facility.dart';
import 'included_service.dart';
import 'extra_charge.dart';

part 'task.g.dart';

enum TaskStatus {
  @JsonValue('TODO')
  todo,
  @JsonValue('IN_PROGRESS')
  inProgress,
  @JsonValue('COMPLETED')
  completed,
  @JsonValue('CANCELLED')
  cancelled,
}

enum TaskPriority {
  @JsonValue('LOW')
  low,
  @JsonValue('MEDIUM')
  medium,
  @JsonValue('HIGH')
  high,
  @JsonValue('URGENT')
  urgent,
}

enum TaskType {
  @JsonValue('PROPERTY_MAINTENANCE')
  propertyMaintenance,
  @JsonValue('LISTING_REVIEW')
  listingReview,
  @JsonValue('CLIENT_FOLLOW_UP')
  clientFollowUp,
  @JsonValue('DOCUMENT_PROCESSING')
  documentProcessing,
  @JsonValue('MARKETING_TASK')
  marketingTask,
  @JsonValue('SALES_ACTIVITY')
  salesActivity,
  @JsonValue('COMPLIANCE_CHECK')
  complianceCheck,
  @JsonValue('COMMUNICATION_FOLLOW_UP')
  communicationFollowUp,
}

@JsonSerializable()
class Task extends BaseModel {
  final String title;
  final String? description;
  final TaskStatus status;
  final TaskType type;
  final TaskPriority priority;
  final String? createdById;
  final String? assignedToId;
  final String? propertyId;
  final String? agentId;
  final String? agencyId;
  final DateTime? dueDate;
  final DateTime? completedAt;
  final String? facilityId;
  final String? includedServiceId;
  final String? extraChargeId;

  // Relations
  final User? createdBy;
  final User? assignedTo;
  final Property? property;
  final Facility? facility;
  final IncludedService? includedService;
  final ExtraCharge? extraCharge;

  Task({
    required super.id,
    required this.title,
    this.description,
    this.status = TaskStatus.todo,
    required this.type,
    this.priority = TaskPriority.medium,
    this.createdById,
    this.assignedToId,
    this.propertyId,
    this.agentId,
    this.agencyId,
    this.dueDate,
    this.completedAt,
    this.facilityId,
    this.includedServiceId,
    this.extraChargeId,
    this.createdBy,
    this.assignedTo,
    this.property,
    this.facility,
    this.includedService,
    this.extraCharge,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
  });

  bool get isOverdue => dueDate != null && DateTime.now().isAfter(dueDate!);

  bool get isCompleted => status == TaskStatus.completed;

  bool get isCancelled => status == TaskStatus.cancelled;

  @override
  bool get isActive => !isCompleted && !isCancelled;

  factory Task.fromJson(Map<String, dynamic> json) => _$TaskFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$TaskToJson(this);

  Task copyWith({
    String? id,
    String? title,
    String? description,
    TaskStatus? status,
    TaskType? type,
    TaskPriority? priority,
    String? createdById,
    String? assignedToId,
    String? propertyId,
    String? agentId,
    String? agencyId,
    DateTime? dueDate,
    DateTime? completedAt,
    String? facilityId,
    String? includedServiceId,
    String? extraChargeId,
    User? createdBy,
    User? assignedTo,
    Property? property,
    Facility? facility,
    IncludedService? includedService,
    ExtraCharge? extraCharge,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      status: status ?? this.status,
      type: type ?? this.type,
      priority: priority ?? this.priority,
      createdById: createdById ?? this.createdById,
      assignedToId: assignedToId ?? this.assignedToId,
      propertyId: propertyId ?? this.propertyId,
      agentId: agentId ?? this.agentId,
      agencyId: agencyId ?? this.agencyId,
      dueDate: dueDate ?? this.dueDate,
      completedAt: completedAt ?? this.completedAt,
      facilityId: facilityId ?? this.facilityId,
      includedServiceId: includedServiceId ?? this.includedServiceId,
      extraChargeId: extraChargeId ?? this.extraChargeId,
      createdBy: createdBy ?? this.createdBy,
      assignedTo: assignedTo ?? this.assignedTo,
      property: property ?? this.property,
      facility: facility ?? this.facility,
      includedService: includedService ?? this.includedService,
      extraCharge: extraCharge ?? this.extraCharge,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
    );
  }
}
