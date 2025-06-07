import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'ticket.g.dart';

enum TicketType {
  @JsonValue('SUPPORT')
  support,
  @JsonValue('FEATURE_REQUEST')
  featureRequest,
  @JsonValue('BUG')
  bug,
  @JsonValue('COMPLAINT')
  complaint,
  @JsonValue('OTHER')
  other,
}

enum TicketPriority {
  @JsonValue('LOW')
  low,
  @JsonValue('MEDIUM')
  medium,
  @JsonValue('HIGH')
  high,
  @JsonValue('URGENT')
  urgent,
}

enum TicketStatus {
  @JsonValue('OPEN')
  open,
  @JsonValue('IN_PROGRESS')
  inProgress,
  @JsonValue('RESOLVED')
  resolved,
  @JsonValue('CLOSED')
  closed,
  @JsonValue('ON_HOLD')
  onHold,
}

@JsonSerializable()
class Ticket extends BaseModel {
  final String title;
  final String description;
  final TicketType type;
  final TicketPriority priority;
  final TicketStatus status;
  final String userId;
  final String? assignedTo;
  final DateTime? dueDate;
  final DateTime? resolvedAt;
  final DateTime? closedAt;
  final List<String>? attachments;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;

  Ticket({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.title,
    required this.description,
    required this.type,
    required this.priority,
    required this.status,
    required this.userId,
    this.assignedTo,
    this.dueDate,
    this.resolvedAt,
    this.closedAt,
    this.attachments,
    this.metadata,
    this.createdBy,
    this.updatedBy,
  }) {
    if (title.isEmpty) {
      throw ArgumentError('Title cannot be empty');
    }
    if (description.isEmpty) {
      throw ArgumentError('Description cannot be empty');
    }
    if (userId.isEmpty) {
      throw ArgumentError('User ID cannot be empty');
    }
    final now = DateTime.now();
    if (dueDate != null && dueDate!.isBefore(now)) {
      throw ArgumentError('Due date must be in the future');
    }
    if (resolvedAt != null &&
        createdAt != null &&
        resolvedAt!.isBefore(createdAt!)) {
      throw ArgumentError('Resolved at cannot be before creation date');
    }
    if (closedAt != null &&
        createdAt != null &&
        closedAt!.isBefore(createdAt!)) {
      throw ArgumentError('Closed at cannot be before creation date');
    }
  }

  bool get isSupport => type == TicketType.support;
  bool get isFeatureRequest => type == TicketType.featureRequest;
  bool get isBug => type == TicketType.bug;
  bool get isComplaint => type == TicketType.complaint;
  bool get isOther => type == TicketType.other;

  bool get isLowPriority => priority == TicketPriority.low;
  bool get isMediumPriority => priority == TicketPriority.medium;
  bool get isHighPriority => priority == TicketPriority.high;
  bool get isUrgent => priority == TicketPriority.urgent;

  bool get isOpen => status == TicketStatus.open;
  bool get isInProgress => status == TicketStatus.inProgress;
  bool get isResolved => status == TicketStatus.resolved;
  bool get isClosed => status == TicketStatus.closed;
  bool get isOnHold => status == TicketStatus.onHold;

  bool get isOverdue =>
      dueDate != null &&
      DateTime.now().isAfter(dueDate!) &&
      !isResolved &&
      !isClosed;

  factory Ticket.fromJson(Map<String, dynamic> json) => _$TicketFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$TicketToJson(this);

  Ticket copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? title,
    String? description,
    TicketType? type,
    TicketPriority? priority,
    TicketStatus? status,
    String? userId,
    String? assignedTo,
    DateTime? dueDate,
    DateTime? resolvedAt,
    DateTime? closedAt,
    List<String>? attachments,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) {
    return Ticket(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      title: title ?? this.title,
      description: description ?? this.description,
      type: type ?? this.type,
      priority: priority ?? this.priority,
      status: status ?? this.status,
      userId: userId ?? this.userId,
      assignedTo: assignedTo ?? this.assignedTo,
      dueDate: dueDate ?? this.dueDate,
      resolvedAt: resolvedAt ?? this.resolvedAt,
      closedAt: closedAt ?? this.closedAt,
      attachments: attachments ?? this.attachments,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}
