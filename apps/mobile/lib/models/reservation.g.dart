// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reservation.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Reservation _$ReservationFromJson(Map<String, dynamic> json) => Reservation(
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
      propertyId: json['propertyId'] as String,
      userId: json['userId'] as String,
      type: $enumDecode(_$ReservationTypeEnumMap, json['type']),
      status: $enumDecode(_$ReservationStatusEnumMap, json['status']),
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: DateTime.parse(json['endTime'] as String),
      numberOfGuests: (json['numberOfGuests'] as num?)?.toInt(),
      notes: json['notes'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$ReservationToJson(Reservation instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'propertyId': instance.propertyId,
      'userId': instance.userId,
      'type': _$ReservationTypeEnumMap[instance.type]!,
      'status': _$ReservationStatusEnumMap[instance.status]!,
      'startTime': instance.startTime.toIso8601String(),
      'endTime': instance.endTime.toIso8601String(),
      'numberOfGuests': instance.numberOfGuests,
      'notes': instance.notes,
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
    };

const _$ReservationTypeEnumMap = {
  ReservationType.booking: 'BOOKING',
  ReservationType.viewing: 'VIEWING',
  ReservationType.maintenance: 'MAINTENANCE',
  ReservationType.other: 'OTHER',
};

const _$ReservationStatusEnumMap = {
  ReservationStatus.pending: 'PENDING',
  ReservationStatus.confirmed: 'CONFIRMED',
  ReservationStatus.cancelled: 'CANCELLED',
  ReservationStatus.completed: 'COMPLETED',
  ReservationStatus.noShow: 'NO_SHOW',
  ReservationStatus.CANCELLED: 'CANCELLED',
};
