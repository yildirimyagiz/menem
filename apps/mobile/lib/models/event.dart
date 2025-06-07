import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';
import 'property.dart';
import 'user.dart';

part 'event.g.dart';

enum EventType {
  @JsonValue('VIEWING')
  viewing,
  @JsonValue('OPEN_HOUSE')
  openHouse,
  @JsonValue('MAINTENANCE')
  maintenance,
  @JsonValue('INSPECTION')
  inspection,
  @JsonValue('OTHER')
  other,
}

enum EventStatus {
  @JsonValue('SCHEDULED')
  scheduled,
  @JsonValue('IN_PROGRESS')
  inProgress,
  @JsonValue('COMPLETED')
  completed,
  @JsonValue('CANCELLED')
  cancelled,
  @JsonValue('FAILED')
  failed,
}

@JsonSerializable()
class Event extends BaseModel {
  final String propertyId;
  final Property property;
  final String title;
  final String? description;
  final EventType eventType;
  final DateTime scheduledAt;
  final int? duration;
  final String? createdById;
  final User? createdBy;
  final List<User> attendees;
  @override
  final bool isActive;
  final EventStatus status;
  final DateTime startTime;
  final DateTime endTime;
  final String? location;
  final String? userId;
  final String? agencyId;
  final Map<String, dynamic>? metadata;
  final String? updatedBy;

  Event({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.propertyId,
    required this.property,
    required this.title,
    this.description,
    required this.eventType,
    required this.scheduledAt,
    this.duration,
    this.createdById,
    this.createdBy,
    required this.attendees,
    required this.isActive,
    required this.status,
    required this.startTime,
    required this.endTime,
    this.location,
    this.userId,
    this.agencyId,
    this.metadata,
    this.updatedBy,
  }) {
    if (title.isEmpty) {
      throw ArgumentError('Event title cannot be empty');
    }
    if (description != null && description!.isEmpty) {
      throw ArgumentError('Event description cannot be empty if provided');
    }
    if (scheduledAt.isAfter(endTime)) {
      throw ArgumentError('Scheduled time cannot be after end time');
    }
    if (startTime.isAfter(endTime)) {
      throw ArgumentError('Start time cannot be after end time');
    }
  }

  bool get isBooking =>
      eventType == EventType.viewing || eventType == EventType.openHouse;
  bool get isPayment => false;
  bool get isReview => false;
  bool get isMaintenance => eventType == EventType.maintenance;
  bool get isInspection => eventType == EventType.inspection;
  bool get isOther => eventType == EventType.other;
  bool get isScheduled => status == EventStatus.scheduled;
  bool get isInProgress => status == EventStatus.inProgress;
  bool get isCompleted => status == EventStatus.completed;
  bool get isCancelled => status == EventStatus.cancelled;
  bool get isFailed => status == EventStatus.failed;
  bool get isOver => DateTime.now().isAfter(endTime);

  factory Event.fromJson(Map<String, dynamic> json) => _$EventFromJson(json);

  get type => null;

  @override
  Map<String, dynamic> toJson() => _$EventToJson(this);

  Event copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? propertyId,
    Property? property,
    String? title,
    String? description,
    EventType? eventType,
    DateTime? scheduledAt,
    int? duration,
    String? createdById,
    User? createdBy,
    List<User>? attendees,
    bool? isActive,
    EventStatus? status,
    DateTime? startTime,
    DateTime? endTime,
    String? location,
    String? userId,
    String? agencyId,
    Map<String, dynamic>? metadata,
    String? updatedBy,
  }) {
    return Event(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      propertyId: propertyId ?? this.propertyId,
      property: property ?? this.property,
      title: title ?? this.title,
      description: description ?? this.description,
      eventType: eventType ?? this.eventType,
      scheduledAt: scheduledAt ?? this.scheduledAt,
      duration: duration ?? this.duration,
      createdById: createdById ?? this.createdById,
      createdBy: createdBy ?? this.createdBy,
      attendees: attendees ?? this.attendees,
      isActive: isActive ?? this.isActive,
      status: status ?? this.status,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      location: location ?? this.location,
      userId: userId ?? this.userId,
      agencyId: agencyId ?? this.agencyId,
      metadata: metadata ?? this.metadata,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}
