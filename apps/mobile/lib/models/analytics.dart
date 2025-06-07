import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'analytics.g.dart';

enum AnalyticsType {
  @JsonValue('LISTING_VIEW')
  listingView,
  @JsonValue('BOOKING_CONVERSION')
  bookingConversion,
  @JsonValue('USER_ENGAGEMENT')
  userEngagement,
  @JsonValue('REVENUE')
  revenue,
  @JsonValue('PERFORMANCE')
  performance,
  @JsonValue('AGENT_PERFORMANCE')
  agentPerformance,
  @JsonValue('AGENCY_PERFORMANCE')
  agencyPerformance,
  @JsonValue(
      'VIEW') // Added JsonValue, ensure 'VIEW' is the correct backend string or adjust.
  view, // Consider if this 'view' type aligns with your backend schema.
}

@JsonSerializable()
class Analytics extends BaseModel {
  @JsonKey(name: 'isActive') // Ensures _isActive is serialized as 'isActive'
  final bool? _isActive;
  @override
  bool get isActive => !isDeleted && (_isActive ?? true);
  final String entityId;
  final String entityType;
  final AnalyticsType type;
  final Map<String, dynamic> data;
  final DateTime timestamp;
  final String? propertyId;
  final String? userId;
  final String? agentId;
  final String? agencyId;
  final String? reservationId;
  final String? taskId;
  @JsonKey(name: 'Agency')
  final Map<String, dynamic>? agency;
  @JsonKey(name: 'Agent')
  final Map<String, dynamic>? agent;
  @JsonKey(name: 'Property')
  final Map<String, dynamic>? property;
  @JsonKey(name: 'Reservation')
  final Map<String, dynamic>? reservation;
  @JsonKey(name: 'Task')
  final Map<String, dynamic>? task;
  @JsonKey(name: 'User')
  final Map<String, dynamic>? user;

  Analytics({
    required super.id,
    bool? isActive,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.entityId,
    required this.entityType,
    required this.type,
    required this.data,
    required this.timestamp,
    this.propertyId,
    this.userId,
    this.agentId,
    this.agencyId,
    this.reservationId,
    this.taskId,
    this.agency,
    this.agent,
    this.property,
    this.reservation,
    this.task,
    this.user,
  }) : _isActive = isActive {
    if (entityId.isEmpty) {
      throw ArgumentError('Entity ID cannot be empty');
    }
    if (entityType.isEmpty) {
      throw ArgumentError('Entity type cannot be empty');
    }
  }

  bool get isPropertyAnalytics => propertyId != null;
  bool get isUserAnalytics => userId != null;
  bool get isAgentAnalytics => agentId != null;
  bool get isAgencyAnalytics => agencyId != null;
  bool get isReservationAnalytics => reservationId != null;
  bool get isTaskAnalytics => taskId != null;

  // Use the generated fromJson factory for robustness
  factory Analytics.fromJson(Map<String, dynamic> json) =>
      _$AnalyticsFromJson(json);

  @override
  // Use the generated toJson factory
  Map<String, dynamic> toJson() => _$AnalyticsToJson(this);

  /// Returns a copy of this Analytics with the given fields replaced by new values.
  /// For nullable fields, pass `explicitNull: true` to explicitly set them to null.
  Analytics copyWith({
    String? id,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? entityId,
    String? entityType,
    AnalyticsType? type,
    Map<String, dynamic>? data,
    bool dataExplicitNull = false,
    DateTime? timestamp,
    String? propertyId,
    bool propertyIdExplicitNull = false,
    String? userId,
    bool userIdExplicitNull = false,
    String? agentId,
    bool agentIdExplicitNull = false,
    String? agencyId,
    bool agencyIdExplicitNull = false,
    String? reservationId,
    bool reservationIdExplicitNull = false,
    String? taskId,
    bool taskIdExplicitNull = false,
    Map<String, dynamic>? agency,
    bool agencyExplicitNull = false,
    Map<String, dynamic>? agent,
    bool agentExplicitNull = false,
    Map<String, dynamic>? property,
    bool propertyExplicitNull = false,
    Map<String, dynamic>? reservation,
    bool reservationExplicitNull = false,
    Map<String, dynamic>? task,
    bool taskExplicitNull = false,
    Map<String, dynamic>? user,
    bool userExplicitNull = false,
  }) {
    return Analytics(
      id: id ?? this.id,
      isActive: isActive ?? _isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      entityId: entityId ?? this.entityId,
      entityType: entityType ?? this.entityType,
      type: type ?? this.type,
      data: dataExplicitNull ? {} : (data ?? this.data),
      timestamp: timestamp ?? this.timestamp,
      propertyId:
          propertyIdExplicitNull ? null : (propertyId ?? this.propertyId),
      userId: userIdExplicitNull ? null : (userId ?? this.userId),
      agentId: agentIdExplicitNull ? null : (agentId ?? this.agentId),
      agencyId: agencyIdExplicitNull ? null : (agencyId ?? this.agencyId),
      reservationId: reservationIdExplicitNull
          ? null
          : (reservationId ?? this.reservationId),
      taskId: taskIdExplicitNull ? null : (taskId ?? this.taskId),
      agency: agencyExplicitNull ? null : (agency ?? this.agency),
      agent: agentExplicitNull ? null : (agent ?? this.agent),
      property: propertyExplicitNull ? null : (property ?? this.property),
      reservation:
          reservationExplicitNull ? null : (reservation ?? this.reservation),
      task: taskExplicitNull ? null : (task ?? this.task),
      user: userExplicitNull ? null : (user ?? this.user),
    );
  }

  static Analytics empty() {
    return Analytics(
      id: '',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      deletedAt: null,
      entityId: '',
      entityType: '',
      type: AnalyticsType.listingView,
      data: {},
      timestamp: DateTime.now(),
      propertyId: null,
      userId: null,
      agentId: null,
      agencyId: null,
      reservationId: null,
      taskId: null,
      agency: null,
      agent: null,
      property: null,
      reservation: null,
      task: null,
      user: null,
    );
  }
}
