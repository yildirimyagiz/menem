import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'post.g.dart';

enum PostType {
  @JsonValue('ARTICLE')
  article,
  @JsonValue('NEWS')
  news,
  @JsonValue('EVENT')
  event,
  @JsonValue('ANNOUNCEMENT')
  announcement,
  @JsonValue('OTHER')
  other,
}

enum PostStatus {
  @JsonValue('DRAFT')
  draft,
  @JsonValue('PUBLISHED')
  published,
  @JsonValue('ARCHIVED')
  archived,
}

@JsonSerializable()
class Post extends BaseModel {
  final String title;
  final String content;
  final PostType type;
  final PostStatus status;
  final String? authorId;
  final String? categoryId;
  final List<String>? tags;
  final String? imageUrl;
  final DateTime? publishedAt;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;

  Post({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.title,
    required this.content,
    required this.type,
    required this.status,
    this.authorId,
    this.categoryId,
    this.tags,
    this.imageUrl,
    this.publishedAt,
    this.metadata,
    this.createdBy,
    this.updatedBy,
  }) {
    if (title.isEmpty) {
      throw ArgumentError('Post title cannot be empty');
    }
    if (content.isEmpty) {
      throw ArgumentError('Post content cannot be empty');
    }
  }

  bool get isArticle => type == PostType.article;
  bool get isNews => type == PostType.news;
  bool get isEvent => type == PostType.event;
  bool get isAnnouncement => type == PostType.announcement;
  bool get isOther => type == PostType.other;
  bool get isDraft => status == PostStatus.draft;
  bool get isPublished => status == PostStatus.published;
  bool get isArchived => status == PostStatus.archived;
  bool get isPublic =>
      isPublished &&
      publishedAt != null &&
      DateTime.now().isAfter(publishedAt!);

  factory Post.fromJson(Map<String, dynamic> json) => _$PostFromJson(json);

  get body => null;

  @override
  Map<String, dynamic> toJson() => _$PostToJson(this);

  Post copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? title,
    String? content,
    PostType? type,
    PostStatus? status,
    String? authorId,
    String? categoryId,
    List<String>? tags,
    String? imageUrl,
    DateTime? publishedAt,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) {
    return Post(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      title: title ?? this.title,
      content: content ?? this.content,
      type: type ?? this.type,
      status: status ?? this.status,
      authorId: authorId ?? this.authorId,
      categoryId: categoryId ?? this.categoryId,
      tags: tags ?? this.tags,
      imageUrl: imageUrl ?? this.imageUrl,
      publishedAt: publishedAt ?? this.publishedAt,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}
