import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'user.g.dart';

/// User roles as defined in Prisma and UI
enum Role {
  @JsonValue('USER') user,
  @JsonValue('ADMIN') admin,
  @JsonValue('SUPER_ADMIN') superAdmin,
  @JsonValue('AGENCY') agency,
  @JsonValue('AGENCY_ADMIN') agencyAdmin,
  @JsonValue('AGENT_ADMIN') agentAdmin,
  @JsonValue('AGENT') agent,
  @JsonValue('SELLER') seller,
  @JsonValue('BUYER') buyer,
  @JsonValue('GUEST') guest,
  @JsonValue('TENANT') tenant,
  @JsonValue('MODERATOR') moderator,
  @JsonValue('FACILITY_MANAGER') facilityManager,
  unknown;

  static Role fromString(String? value) {
    if (value == null) return Role.unknown;
    return Role.values.firstWhere(
      (e) => e.name.toLowerCase() == value.toLowerCase(),
      orElse: () => Role.unknown,
    );
  }

  String get label => name.replaceAll('_', ' ').toUpperCase();
}


/// Account types for authentication
enum AccountType {
  @JsonValue('OAUTH') oauth,
  @JsonValue('EMAIL') email,
  @JsonValue('OIDC') oidc,
  @JsonValue('CREDENTIALS') credentials,
  @JsonValue('GOOGLE') google,
  @JsonValue('FACEBOOK') facebook,
  unknown;

  static AccountType fromString(String? value) {
    if (value == null) return AccountType.unknown;
    return AccountType.values.firstWhere(
      (e) => e.name.toLowerCase() == value.toLowerCase(),
      orElse: () => AccountType.unknown,
    );
  }

  String get label => name.replaceAll('_', ' ').toUpperCase();
}


/// Status for user accounts
enum UserStatus {
  @JsonValue('ACTIVE') active,
  @JsonValue('INACTIVE') inactive,
  @JsonValue('SUSPENDED') suspended,
  unknown;

  static UserStatus fromString(String? value) {
    if (value == null) return UserStatus.unknown;
    return UserStatus.values.firstWhere(
      (e) => e.name.toLowerCase() == value.toLowerCase(),
      orElse: () => UserStatus.unknown,
    );
  }

  String get label => name.toUpperCase();
}


@JsonSerializable()
class User extends BaseModel {
  /// Unique email address
  final String email;
  final String? username;
  final String? displayName;
  final String? name;
  final String? firstName;
  final String? lastName;
  final String? phoneNumber;
  final String? profilePicture;
  final String? image;
  final Role role;
  final AccountType type;
  @override
  final bool isActive;
  final DateTime? lastLogin;
  final DateTime? emailVerified;
  final String? responseTime;
  final String? locale;
  final String? timezone;
  final Map<String, dynamic>? preferences;
  final String? agencyId;
  final UserStatus status;
  final String? facilityId;
  final String? includedServiceId;
  final String? extraChargeId;
  final String? locationId;

  /// Utility: preferred avatar url
  String? get avatarUrl => profilePicture ?? image;

  /// Utility: display name for UI
  String get displayLabel => displayName?.isNotEmpty == true
      ? displayName!
      : (name?.isNotEmpty == true
          ? name!
          : (email.isNotEmpty ? email : 'User'));

  /// Utility: status label
  String get statusLabel => status.label;
  String get roleLabel => role.label;
  String get typeLabel => type.label;

  User({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.email,
    this.username,
    this.displayName,
    this.name,
    this.firstName,
    this.lastName,
    this.phoneNumber,
    this.profilePicture,
    this.image,
    required this.role,
    required this.type,
    required this.isActive,
    this.lastLogin,
    this.emailVerified,
    this.responseTime,
    this.locale,
    this.timezone,
    this.preferences,
    this.agencyId,
    required this.status,
    this.facilityId,
    this.includedServiceId,
    this.extraChargeId,
    this.locationId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      deletedAt: json['deletedAt'] != null ? DateTime.parse(json['deletedAt']) : null,
      email: json['email'],
      username: json['username'],
      displayName: json['displayName'],
      name: json['name'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      phoneNumber: json['phoneNumber'],
      profilePicture: json['profilePicture'],
      image: json['image'],
      role: Role.fromString(json['role'] as String?),
      type: AccountType.fromString(json['type'] as String?),
      isActive: json['isActive'] ?? false,
      lastLogin: json['lastLogin'] != null ? DateTime.tryParse(json['lastLogin']) : null,
      emailVerified: json['emailVerified'] != null ? DateTime.tryParse(json['emailVerified']) : null,
      responseTime: json['responseTime'],
      locale: json['locale'],
      timezone: json['timezone'],
      preferences: json['preferences'],
      agencyId: json['agencyId'],
      status: UserStatus.fromString(json['status'] as String?),
      facilityId: json['facilityId'],
      includedServiceId: json['includedServiceId'],
      extraChargeId: json['extraChargeId'],
      locationId: json['locationId'],
    );
  }

  /// Factory for Prisma-aligned JSON (if backend uses different keys)
  factory User.fromPrismaJson(Map<String, dynamic> json) => User.fromJson(json);

  @override
  Map<String, dynamic> toJson() {
    return {
      ...super.toJson(),
      'email': email,
      'username': username,
      'displayName': displayName,
      'name': name,
      'firstName': firstName,
      'lastName': lastName,
      'phoneNumber': phoneNumber,
      'profilePicture': profilePicture,
      'image': image,
      'role': role.name,
      'type': type.name,
      'isActive': isActive,
      'lastLogin': lastLogin?.toIso8601String(),
      'emailVerified': emailVerified?.toIso8601String(),
      'responseTime': responseTime,
      'locale': locale,
      'timezone': timezone,
      'preferences': preferences,
      'agencyId': agencyId,
      'status': status.name,
      'facilityId': facilityId,
      'includedServiceId': includedServiceId,
      'extraChargeId': extraChargeId,
      'locationId': locationId,
    };
  }
}

