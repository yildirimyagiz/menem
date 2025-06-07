import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'guest.g.dart';

enum GuestStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('ACTIVE')
  active,
  @JsonValue('INACTIVE')
  inactive,
  @JsonValue('BLOCKED')
  blocked,
}

@JsonSerializable()
class Guest extends BaseModel {
  final String userId;
  final String firstName;
  final String lastName;
  final String? email;
  final String? phoneNumber;
  final GuestStatus status;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;

  Guest({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.userId,
    required this.firstName,
    required this.lastName,
    this.email,
    this.phoneNumber,
    required this.status,
    this.metadata,
    this.createdBy,
    this.updatedBy,
  }) {
    if (firstName.isEmpty) {
      throw ArgumentError('First name cannot be empty');
    }
    if (lastName.isEmpty) {
      throw ArgumentError('Last name cannot be empty');
    }
    if (userId.isEmpty) {
      throw ArgumentError('User ID cannot be empty');
    }
  }

  bool get isPending => status == GuestStatus.pending;
  @override
  bool get isActive => status == GuestStatus.active;
  bool get isInactive => status == GuestStatus.inactive;
  bool get isBlocked => status == GuestStatus.blocked;

  factory Guest.fromJson(Map<String, dynamic> json) => _$GuestFromJson(json);

  get name => null;

  get phone => null;

  @override
  Map<String, dynamic> toJson() => _$GuestToJson(this);

  Guest copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? userId,
    String? firstName,
    String? lastName,
    String? email,
    String? phoneNumber,
    GuestStatus? status,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) {
    return Guest(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      userId: userId ?? this.userId,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email ?? this.email,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      status: status ?? this.status,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}
