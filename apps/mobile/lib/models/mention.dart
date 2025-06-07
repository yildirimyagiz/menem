import 'package:freezed_annotation/freezed_annotation.dart';

import 'base_model.dart';

part 'mention.g.dart';
part 'mention.freezed.dart';

@freezed
class MentionData with _$MentionData {
  const factory MentionData({
    required String id,
    required String mentionedById,
    required String mentionedToId,
    required String type,
    String? taskId,
    String? propertyId,
    String? content,
    required bool isRead,
    String? agencyId,
    required DateTime createdAt,
    required DateTime updatedAt,
    DateTime? deletedAt,
    String? userId,
  }) = _MentionData;

  factory MentionData.fromJson(Map<String, dynamic> json) =>
      _$MentionDataFromJson(json);
}

enum MentionType {
  @JsonValue('USER')
  user,
  @JsonValue('PROPERTY')
  property,
  @JsonValue('TASK')
  task,
}

@JsonSerializable()
class Mention extends BaseModel {
  final String userId;
  final String postId;
  final String? commentId;
  final bool isRead;
  final DateTime? readAt;

  Mention({
    required super.id,
    required this.userId,
    required this.postId,
    this.commentId,
    this.isRead = false,
    this.readAt,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
  });

  factory Mention.fromJson(Map<String, dynamic> json) =>
      _$MentionFromJson(json);

  get mentionedById => null;

  get entityId => null;

  Object? get type => null;
  @override
  Map<String, dynamic> toJson() => _$MentionToJson(this);

  Mention copyWith({
    String? id,
    String? userId,
    String? postId,
    String? commentId,
    bool? isRead,
    DateTime? readAt,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
  }) {
    return Mention(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      postId: postId ?? this.postId,
      commentId: commentId ?? this.commentId,
      isRead: isRead ?? this.isRead,
      readAt: readAt ?? this.readAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
    );
  }
}
