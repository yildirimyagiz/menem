import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'favorite.g.dart';

enum FavoriteType {
  @JsonValue('PROPERTY')
  property,
  @JsonValue('AGENT')
  agent,
  @JsonValue('AGENCY')
  agency,
  @JsonValue('OTHER')
  other,
}

@JsonSerializable()
class Favorite extends BaseModel {
  final String userId;
  final String entityId;
  final FavoriteType type;
  final String? notes;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;
  final String? name;
  final String? description;

  Favorite({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.userId,
    required this.entityId,
    required this.type,
    this.notes,
    this.metadata,
    this.createdBy,
    this.updatedBy,
    this.name,
    this.description,
  }) {
    if (userId.isEmpty) {
      throw ArgumentError('User ID cannot be empty');
    }
    if (entityId.isEmpty) {
      throw ArgumentError('Entity ID cannot be empty');
    }
  }

  bool get isProperty => type == FavoriteType.property;
  bool get isAgent => type == FavoriteType.agent;
  bool get isAgency => type == FavoriteType.agency;
  bool get isOther => type == FavoriteType.other;

  String get propertyId => isProperty ? entityId : '';

  factory Favorite.fromJson(Map<String, dynamic> json) =>
      _$FavoriteFromJson(json);

  get address => null;

  get photos => null;

  String? get title => null;

  get marketValue => null;

  @override
  Map<String, dynamic> toJson() => _$FavoriteToJson(this);

  Favorite copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? userId,
    String? entityId,
    FavoriteType? type,
    String? notes,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
    String? name,
    String? description,
  }) {
    return Favorite(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      userId: userId ?? this.userId,
      entityId: entityId ?? this.entityId,
      type: type ?? this.type,
      notes: notes ?? this.notes,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
      name: name ?? this.name,
      description: description ?? this.description,
    );
  }
}
