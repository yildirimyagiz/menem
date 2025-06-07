import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';
import 'user.dart';
import 'agency.dart';

part 'agent.g.dart';

enum AgentStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('ACTIVE')
  active,
  @JsonValue('SUSPENDED')
  suspended,
}

// Enum to match Prisma's AgentSpecialities
enum AgentSpecialty {
  @JsonValue('RESIDENTIAL')
  residential,
  @JsonValue('COMMERCIAL')
  commercial,
  @JsonValue('LUXURY')
  luxury,
  @JsonValue('RENTAL')
  rental,
  @JsonValue('INVESTMENT')
  investment,
  @JsonValue('OTHER')
  other,
}

@JsonSerializable()
class Agent extends BaseModel {
  final String name;
  final String? email;
  final String? phoneNumber;
  final String? address;
  final String? website;
  final String? logoUrl;
  final AgentStatus status;
  final String? bio; // Added bio field
  final String? agencyId;
  final Map<String, dynamic>? settings;
  final String? externalId;
  final Map<String, dynamic>? integration;
  final String? ownerId;
  final DateTime? lastActive;

  // Use the AgentSpecialty enum
  final List<AgentSpecialty>? specialities;

  // Relations
  final Agency? agency;
  final User? owner;

  Agent({
    required super.id,
    required this.name,
    this.email,
    this.bio,
    this.phoneNumber,
    this.address,
    this.website,
    this.logoUrl,
    this.status = AgentStatus.pending,
    this.agencyId,
    this.settings,
    this.externalId,
    this.integration,
    this.ownerId,
    this.lastActive,
    this.specialities,
    this.agency,
    this.owner,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
  });

  factory Agent.fromJson(Map<String, dynamic> json) => _$AgentFromJson(json);

  // Getter for isActive based on status
  @override
  bool get isActive => status == AgentStatus.active;

  @override
  Map<String, dynamic> toJson() => _$AgentToJson(this);

  /// Returns a copy of this Agent with the given fields replaced by new values.
  /// For nullable fields, pass `explicitNull: true` to explicitly set them to null.
  Agent copyWith({
    String? id,
    String? name,
    String? email,
    bool emailExplicitNull = false,
    String? bio,
    bool bioExplicitNull = false,
    String? phoneNumber,
    bool phoneNumberExplicitNull = false,
    String? address,
    bool addressExplicitNull = false,
    String? website,
    bool websiteExplicitNull = false,
    String? logoUrl,
    bool logoUrlExplicitNull = false,
    AgentStatus? status,
    String? agencyId,
    bool agencyIdExplicitNull = false,
    Map<String, dynamic>? settings,
    bool settingsExplicitNull = false,
    String? externalId,
    bool externalIdExplicitNull = false,
    Map<String, dynamic>? integration,
    bool integrationExplicitNull = false,
    String? ownerId,
    bool ownerIdExplicitNull = false,
    DateTime? lastActive,
    bool lastActiveExplicitNull = false,
    List<AgentSpecialty>? specialities,
    bool specialitiesExplicitNull = false,
    Agency? agency,
    bool agencyExplicitNull = false,
    User? owner,
    bool ownerExplicitNull = false,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
  }) {
    return Agent(
      id: id ?? this.id,
      name: name ?? this.name,
      email: emailExplicitNull ? null : (email ?? this.email),
      bio: bioExplicitNull ? null : (bio ?? this.bio),
      phoneNumber: phoneNumberExplicitNull ? null : (phoneNumber ?? this.phoneNumber),
      address: addressExplicitNull ? null : (address ?? this.address),
      website: websiteExplicitNull ? null : (website ?? this.website),
      logoUrl: logoUrlExplicitNull ? null : (logoUrl ?? this.logoUrl),
      status: status ?? this.status,
      agencyId: agencyIdExplicitNull ? null : (agencyId ?? this.agencyId),
      settings: settingsExplicitNull ? null : (settings ?? this.settings),
      externalId: externalIdExplicitNull ? null : (externalId ?? this.externalId),
      integration: integrationExplicitNull ? null : (integration ?? this.integration),
      ownerId: ownerIdExplicitNull ? null : (ownerId ?? this.ownerId),
      lastActive: lastActiveExplicitNull ? null : (lastActive ?? this.lastActive),
      specialities: specialitiesExplicitNull ? null : (specialities ?? this.specialities),
      agency: agencyExplicitNull ? null : (agency ?? this.agency),
      owner: ownerExplicitNull ? null : (owner ?? this.owner),
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
    );
  }
}
