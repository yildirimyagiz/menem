import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'reservation.g.dart';

enum ReservationType {
  @JsonValue('BOOKING')
  booking,
  @JsonValue('VIEWING')
  viewing,
  @JsonValue('MAINTENANCE')
  maintenance,
  @JsonValue('OTHER')
  other,
}

enum ReservationStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('CONFIRMED')
  confirmed,
  @JsonValue('CANCELLED')
  cancelled,
  @JsonValue('COMPLETED')
  completed,
  @JsonValue('NO_SHOW')
  noShow,
  // ignore: constant_identifier_names
  CANCELLED,
}

@JsonSerializable()
class Reservation extends BaseModel {
  final String propertyId;
  final String userId;
  final ReservationType type;
  final ReservationStatus status;
  final DateTime startTime;
  final DateTime endTime;
  final int? numberOfGuests;
  final String? notes;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;

  Reservation({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.propertyId,
    required this.userId,
    required this.type,
    required this.status,
    required this.startTime,
    required this.endTime,
    this.numberOfGuests,
    this.notes,
    this.metadata,
    this.createdBy,
    this.updatedBy,
  }) {
    if (propertyId.isEmpty) {
      throw ArgumentError('Property ID cannot be empty');
    }
    if (userId.isEmpty) {
      throw ArgumentError('User ID cannot be empty');
    }
    if (startTime.isAfter(endTime)) {
      throw ArgumentError('Start time cannot be after end time');
    }
    if (numberOfGuests != null && numberOfGuests! <= 0) {
      throw ArgumentError('Number of guests must be greater than zero');
    }
  }

  bool get isBooking => type == ReservationType.booking;
  bool get isViewing => type == ReservationType.viewing;
  bool get isMaintenance => type == ReservationType.maintenance;
  bool get isOther => type == ReservationType.other;
  bool get isPending => status == ReservationStatus.pending;
  bool get isConfirmed => status == ReservationStatus.confirmed;
  bool get isCancelled => status == ReservationStatus.cancelled;
  bool get isCompleted => status == ReservationStatus.completed;
  bool get isNoShow => status == ReservationStatus.noShow;
  @override
  bool get isActive => isConfirmed && DateTime.now().isBefore(endTime);
  bool get isOver => DateTime.now().isAfter(endTime);

  factory Reservation.fromJson(Map<String, dynamic> json) =>
      _$ReservationFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$ReservationToJson(this);

  Reservation copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? propertyId,
    String? userId,
    ReservationType? type,
    ReservationStatus? status,
    DateTime? startTime,
    DateTime? endTime,
    int? numberOfGuests,
    String? notes,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) {
    return Reservation(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      propertyId: propertyId ?? this.propertyId,
      userId: userId ?? this.userId,
      type: type ?? this.type,
      status: status ?? this.status,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      numberOfGuests: numberOfGuests ?? this.numberOfGuests,
      notes: notes ?? this.notes,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}
