import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'notification.g.dart';

enum NotificationType {
  message,
  listing,
  system,
  warning,
  booking,
  mention,
  like,
  comment,
  follow,
  price,
  availability,
  other,
  priceChange,
}

@JsonSerializable()
class Notification extends BaseModel {
  final String title;
  final String message;
  final NotificationType type;
  final bool isRead;
  final Map<String, dynamic>? metadata;
  String? entityId;
  String? content;
  String? entityType;
  String? agencyId;
  String? agentId;
  String? tenantId;
  String? reviewId;
  Map<String, dynamic>? agency;
  Map<String, dynamic>? agent;
  Map<String, dynamic>? tenant;
  Map<String, dynamic>? review;
  Map<String, dynamic>? user;

  Notification({
    required super.id,
    required this.title,
    required this.message,
    required this.type,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    this.isRead = false,
    this.metadata,
  }) {
    if (title.isEmpty) {
      throw ArgumentError('Title cannot be empty');
    }
    if (message.isEmpty) {
      throw ArgumentError('Message cannot be empty');
    }
  }

  factory Notification.fromJson(Map<String, dynamic> json) =>
      _$NotificationFromJson(json);

  get body => null;

  @override
  Map<String, dynamic> toJson() => _$NotificationToJson(this);

  Notification copyWith({
    String? id,
    String? title,
    String? message,
    NotificationType? type,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    bool? isRead,
    Map<String, dynamic>? metadata,
  }) {
    return Notification(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      type: type ?? this.type,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      isRead: isRead ?? this.isRead,
      metadata: metadata ?? this.metadata,
    );
  }
}
