import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'hashtag.g.dart';

enum HashtagType {
  @JsonValue('GENERAL')
  general,
  @JsonValue('PROPERTY')
  property,
  @JsonValue('LOCATION')
  location,
  @JsonValue('AMENITY')
  amenity,
  @JsonValue('CUSTOM')
  custom,
}

@JsonSerializable()
class Hashtag extends BaseModel {
  final String name;
  final HashtagType type;
  final String? description;
  final int usageCount;
  final List<String>? relatedTags;
  final List<String>? postIds;
  final List<String>? propertyIds;
  final bool isTrending;
  final DateTime? lastUsedAt;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;
  final Map<String, dynamic>? customFields;
  final String? createdById;
  final String? agencyId;

  Hashtag({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.name,
    required this.type,
    this.description,
    this.usageCount = 0,
    this.relatedTags,
    this.postIds,
    this.propertyIds,
    this.isTrending = false,
    this.lastUsedAt,
    this.metadata,
    this.createdBy,
    this.updatedBy,
    this.customFields,
    this.createdById,
    this.agencyId,
  }) {
    if (name.isEmpty) {
      throw ArgumentError('Name cannot be empty');
    }
  }

  bool get isGeneral => type == HashtagType.general;
  bool get isProperty => type == HashtagType.property;
  bool get isLocation => type == HashtagType.location;
  bool get isAmenity => type == HashtagType.amenity;
  bool get isCustom => type == HashtagType.custom;

  factory Hashtag.fromJson(Map<String, dynamic> json) =>
      _$HashtagFromJson(json);

  get count => null;

  @override
  Map<String, dynamic> toJson() => _$HashtagToJson(this);

  Hashtag copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? name,
    HashtagType? type,
    String? description,
    int? usageCount,
    List<String>? relatedTags,
    List<String>? postIds,
    List<String>? propertyIds,
    bool? isTrending,
    DateTime? lastUsedAt,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
    Map<String, dynamic>? customFields,
    String? createdById,
    String? agencyId,
    int? count,
  }) {
    return Hashtag(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      name: name ?? this.name,
      type: type ?? this.type,
      description: description ?? this.description,
      usageCount: usageCount ?? this.usageCount,
      relatedTags: relatedTags ?? this.relatedTags,
      postIds: postIds ?? this.postIds,
      propertyIds: propertyIds ?? this.propertyIds,
      isTrending: isTrending ?? this.isTrending,
      lastUsedAt: lastUsedAt ?? this.lastUsedAt,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
      customFields: customFields ?? this.customFields,
      createdById: createdById ?? this.createdById,
      agencyId: agencyId ?? this.agencyId,
    );
  }
}
