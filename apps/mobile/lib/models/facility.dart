import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'facility.g.dart';

enum FacilityType {
  @JsonValue('PARKING')
  parking,
  @JsonValue('POOL')
  pool,
  @JsonValue('GYM')
  gym,
  @JsonValue('LAUNDRY')
  laundry,
  @JsonValue('ELEVATOR')
  elevator,
  @JsonValue('SECURITY')
  security,
  @JsonValue('OTHER')
  other,
}

enum FacilityStatus {
  @JsonValue('AVAILABLE')
  available,
  @JsonValue('UNAVAILABLE')
  unavailable,
  @JsonValue('MAINTENANCE')
  maintenance,
}

@JsonSerializable()
class Facility extends BaseModel {
  final String name;
  final String description;
  final FacilityType type;
  final FacilityStatus status;
  final String? propertyId;
  final String? location;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;
  final String? icon;
  final String? logo;
  final String? locationId;

  Facility({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.name,
    required this.description,
    required this.type,
    required this.status,
    this.propertyId,
    this.location,
    this.locationId,
    this.metadata,
    this.createdBy,
    this.updatedBy,
    this.icon,
    this.logo,
  }) {
    if (name.isEmpty) {
      throw ArgumentError('Facility name cannot be empty');
    }
    if (description.isEmpty) {
      throw ArgumentError('Facility description cannot be empty');
    }
  }

  bool get isParking => type == FacilityType.parking;
  bool get isPool => type == FacilityType.pool;
  bool get isGym => type == FacilityType.gym;
  bool get isLaundry => type == FacilityType.laundry;
  bool get isElevator => type == FacilityType.elevator;
  bool get isSecurity => type == FacilityType.security;
  bool get isOther => type == FacilityType.other;
  bool get isAvailable => status == FacilityStatus.available;
  bool get isUnavailable => status == FacilityStatus.unavailable;
  bool get isMaintenance => status == FacilityStatus.maintenance;

  factory Facility.fromJson(Map<String, dynamic> json) =>
      _$FacilityFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$FacilityToJson(this);

  /// Returns a copy of this Facility with the given fields replaced by new values.
  /// For nullable fields, pass `explicitNull: true` to explicitly set them to null.
  Facility copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? name,
    String? description,
    FacilityType? type,
    FacilityStatus? status,
    String? propertyId,
    bool propertyIdExplicitNull = false,
    String? icon,
    String? logo,
    String? locationId,
    String? location,
    bool locationExplicitNull = false,
    Map<String, dynamic>? metadata,
    bool metadataExplicitNull = false,
    String? createdBy,
    bool createdByExplicitNull = false,
    String? updatedBy,
    bool updatedByExplicitNull = false,
  }) {
    return Facility(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      name: name ?? this.name,
      description: description ?? this.description,
      type: type ?? this.type,
      status: status ?? this.status,
      propertyId:
          propertyIdExplicitNull ? null : (propertyId ?? this.propertyId),
      icon: icon ?? this.icon,
      logo: logo ?? this.logo,
      locationId: locationId ?? this.locationId,
      location: locationExplicitNull ? null : (location ?? this.location),
      metadata: metadataExplicitNull ? null : (metadata ?? this.metadata),
      createdBy: createdByExplicitNull ? null : (createdBy ?? this.createdBy),
      updatedBy: updatedByExplicitNull ? null : (updatedBy ?? this.updatedBy),
    );
  }
}
