import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'communication_log.g.dart';

enum CommunicationType {
  @JsonValue('PROBLEM')
  problem,
  @JsonValue('REQUEST')
  request,
  @JsonValue('ADVICE')
  advice,
  @JsonValue('INFORMATION')
  information,
  @JsonValue('FEEDBACK')
  feedback,
}

enum CommunicationStatus {
  @JsonValue('SENT')
  sent,
  @JsonValue('DELIVERED')
  delivered,
  @JsonValue('READ')
  read,
  @JsonValue('FAILED')
  failed,
  @JsonValue('PENDING')
  pending,
}

@JsonSerializable()
class CommunicationLog extends BaseModel {
  String? get subject => content;
  DateTime? get date => deliveredAt;
  final String senderId;
  final String receiverId;
  final CommunicationType type;
  final String content;
  final String? entityId;
  final String? entityType;
  final Map<String, dynamic>? metadata;
  final bool isRead;
  final DateTime? readAt;
  final DateTime? deliveredAt;
  final String? userId;
  final String? agencyId;
  final String? threadId;
  final String? replyToId;
  final String? channelId;
  final String? ticketId;
  @JsonKey(name: 'Agency')
  final Map<String, dynamic>? agency;
  @JsonKey(name: 'User')
  final Map<String, dynamic>? user;
  @JsonKey(name: 'ReplyTo')
  final Map<String, dynamic>? replyTo;
  @JsonKey(name: 'Replies')
  final List<Map<String, dynamic>>? replies;
  @JsonKey(name: 'Channel')
  final Map<String, dynamic>? channel;
  @JsonKey(name: 'Ticket')
  final Map<String, dynamic>? ticket;

  CommunicationLog({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.senderId,
    required this.receiverId,
    required this.type,
    required this.content,
    this.entityId,
    this.entityType,
    this.metadata,
    this.isRead = false,
    this.readAt,
    this.deliveredAt,
    this.userId,
    this.agencyId,
    this.threadId,
    this.replyToId,
    this.channelId,
    this.ticketId,
    this.agency,
    this.user,
    this.replyTo,
    this.replies,
    this.channel,
    this.ticket,
  }) {
    if (senderId.isEmpty) {
      throw ArgumentError('Sender ID cannot be empty');
    }
    if (receiverId.isEmpty) {
      throw ArgumentError('Receiver ID cannot be empty');
    }
    if (content.isEmpty) {
      throw ArgumentError('Content cannot be empty');
    }
  }

  bool get isProblem => type == CommunicationType.problem;
  bool get isRequest => type == CommunicationType.request;
  bool get isAdvice => type == CommunicationType.advice;
  bool get isInformation => type == CommunicationType.information;
  bool get isFeedback => type == CommunicationType.feedback;
  bool get hasReplies => replies != null && replies!.isNotEmpty;
  bool get isThreaded => threadId != null;
  bool get isReply => replyToId != null;
  bool get isDelivered => deliveredAt != null;
  bool get hasBeenRead => readAt != null;

  factory CommunicationLog.fromJson(Map<String, dynamic> json) =>
      _$CommunicationLogFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$CommunicationLogToJson(this);

  /// Returns a copy of this CommunicationLog with the given fields replaced by new values.
  /// For nullable fields, pass `explicitNull: true` to explicitly set them to null.
  CommunicationLog copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? senderId,
    String? receiverId,
    CommunicationType? type,
    String? content,
    String? entityId,
    bool entityIdExplicitNull = false,
    String? entityType,
    bool entityTypeExplicitNull = false,
    Map<String, dynamic>? metadata,
    bool metadataExplicitNull = false,
    bool? isRead,
    DateTime? readAt,
    bool readAtExplicitNull = false,
    DateTime? deliveredAt,
    bool deliveredAtExplicitNull = false,
    String? userId,
    bool userIdExplicitNull = false,
    String? agencyId,
    bool agencyIdExplicitNull = false,
    String? threadId,
    bool threadIdExplicitNull = false,
    String? replyToId,
    bool replyToIdExplicitNull = false,
    String? channelId,
    bool channelIdExplicitNull = false,
    String? ticketId,
    bool ticketIdExplicitNull = false,
    Map<String, dynamic>? agency,
    bool agencyExplicitNull = false,
    Map<String, dynamic>? user,
    bool userExplicitNull = false,
    Map<String, dynamic>? replyTo,
    bool replyToExplicitNull = false,
    List<Map<String, dynamic>>? replies,
    bool repliesExplicitNull = false,
    Map<String, dynamic>? channel,
    bool channelExplicitNull = false,
    Map<String, dynamic>? ticket,
    bool ticketExplicitNull = false,
  }) {
    return CommunicationLog(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      senderId: senderId ?? this.senderId,
      receiverId: receiverId ?? this.receiverId,
      type: type ?? this.type,
      content: content ?? this.content,
      entityId: entityIdExplicitNull ? null : (entityId ?? this.entityId),
      entityType: entityTypeExplicitNull ? null : (entityType ?? this.entityType),
      metadata: metadataExplicitNull ? null : (metadata ?? this.metadata),
      isRead: isRead ?? this.isRead,
      readAt: readAtExplicitNull ? null : (readAt ?? this.readAt),
      deliveredAt: deliveredAtExplicitNull ? null : (deliveredAt ?? this.deliveredAt),
      userId: userIdExplicitNull ? null : (userId ?? this.userId),
      agencyId: agencyIdExplicitNull ? null : (agencyId ?? this.agencyId),
      threadId: threadIdExplicitNull ? null : (threadId ?? this.threadId),
      replyToId: replyToIdExplicitNull ? null : (replyToId ?? this.replyToId),
      channelId: channelIdExplicitNull ? null : (channelId ?? this.channelId),
      ticketId: ticketIdExplicitNull ? null : (ticketId ?? this.ticketId),
      agency: agencyExplicitNull ? null : (agency ?? this.agency),
      user: userExplicitNull ? null : (user ?? this.user),
      replyTo: replyToExplicitNull ? null : (replyTo ?? this.replyTo),
      replies: repliesExplicitNull ? null : (replies ?? this.replies),
      channel: channelExplicitNull ? null : (channel ?? this.channel),
      ticket: ticketExplicitNull ? null : (ticket ?? this.ticket),
    );
  }
}
