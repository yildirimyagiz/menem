import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'review.g.dart';

enum ReviewType {
  @JsonValue('PROPERTY')
  property,
  @JsonValue('AGENT')
  agent,
  @JsonValue('AGENCY')
  agency,
  @JsonValue('OTHER')
  other,
}

enum ReviewStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('APPROVED')
  approved,
  @JsonValue('REJECTED')
  rejected,
}

@JsonSerializable()
class Review extends BaseModel {
  final String userId;
  final String entityId;
  final ReviewType type;
  final ReviewStatus status;
  final int rating;
  final String title;
  final String content;
  final List<String>? images;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;

  Review({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.userId,
    required this.entityId,
    required this.type,
    required this.status,
    required this.rating,
    required this.title,
    required this.content,
    this.images,
    this.metadata,
    this.createdBy,
    this.updatedBy,
  }) {
    if (userId.isEmpty) {
      throw ArgumentError('User ID cannot be empty');
    }
    if (entityId.isEmpty) {
      throw ArgumentError('Entity ID cannot be empty');
    }
    if (rating < 1 || rating > 5) {
      throw ArgumentError('Rating must be between 1 and 5');
    }
    if (title.isEmpty) {
      throw ArgumentError('Review title cannot be empty');
    }
    if (content.isEmpty) {
      throw ArgumentError('Review content cannot be empty');
    }
  }

  bool get isProperty => type == ReviewType.property;
  bool get isAgent => type == ReviewType.agent;
  bool get isAgency => type == ReviewType.agency;
  bool get isOther => type == ReviewType.other;
  bool get isPending => status == ReviewStatus.pending;
  bool get isApproved => status == ReviewStatus.approved;
  bool get isRejected => status == ReviewStatus.rejected;
  bool get isPublic => isApproved;

  factory Review.fromJson(Map<String, dynamic> json) => _$ReviewFromJson(json);

  get reviewerId => null;

  @override
  Map<String, dynamic> toJson() => _$ReviewToJson(this);

  Review copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? userId,
    String? entityId,
    ReviewType? type,
    ReviewStatus? status,
    int? rating,
    String? title,
    String? content,
    List<String>? images,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) {
    return Review(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      userId: userId ?? this.userId,
      entityId: entityId ?? this.entityId,
      type: type ?? this.type,
      status: status ?? this.status,
      rating: rating ?? this.rating,
      title: title ?? this.title,
      content: content ?? this.content,
      images: images ?? this.images,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}
