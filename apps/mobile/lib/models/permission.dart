import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'permission.g.dart';

enum PermissionType {
  @JsonValue('READ')
  read,
  @JsonValue('WRITE')
  write,
  @JsonValue('DELETE')
  delete,
  @JsonValue('ADMIN')
  admin,
  @JsonValue('OTHER')
  other,
}

enum PermissionScope {
  @JsonValue('PROPERTY')
  property,
  @JsonValue('USER')
  user,
  @JsonValue('AGENCY')
  agency,
  @JsonValue('SYSTEM')
  system,
  @JsonValue('OTHER')
  other,
}

@JsonSerializable()
class Permission extends BaseModel {
  final String name;
  final String description;
  final PermissionType type;
  final PermissionScope scope;
  final String? resourceId;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;

  Permission({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.name,
    required this.description,
    required this.type,
    required this.scope,
    this.resourceId,
    this.metadata,
    this.createdBy,
    this.updatedBy,
  }) {
    if (name.isEmpty) {
      throw ArgumentError('Permission name cannot be empty');
    }
    if (description.isEmpty) {
      throw ArgumentError('Permission description cannot be empty');
    }
  }

  bool get isRead => type == PermissionType.read;
  bool get isWrite => type == PermissionType.write;
  bool get isDelete => type == PermissionType.delete;
  bool get isAdmin => type == PermissionType.admin;
  bool get isOther => type == PermissionType.other;
  bool get isProperty => scope == PermissionScope.property;
  bool get isUser => scope == PermissionScope.user;
  bool get isAgency => scope == PermissionScope.agency;
  bool get isSystem => scope == PermissionScope.system;
  bool get isOtherScope => scope == PermissionScope.other;

  factory Permission.fromJson(Map<String, dynamic> json) =>
      _$PermissionFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$PermissionToJson(this);

  Permission copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? name,
    String? description,
    PermissionType? type,
    PermissionScope? scope,
    String? resourceId,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) {
    return Permission(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      name: name ?? this.name,
      description: description ?? this.description,
      type: type ?? this.type,
      scope: scope ?? this.scope,
      resourceId: resourceId ?? this.resourceId,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}
