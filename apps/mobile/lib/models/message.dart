import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';
import 'user.dart';

part 'message.g.dart';

enum MessageType {
  @JsonValue('text')
  text,
  @JsonValue('image')
  image,
  @JsonValue('file')
  file,
  @JsonValue('system')
  system
}

enum MessageStatus {
  @JsonValue('sent')
  sent,
  @JsonValue('delivered')
  delivered,
  @JsonValue('read')
  read,
  @JsonValue('failed')
  failed
}

@JsonSerializable()
class Message extends BaseModel {
  final String content;
  final MessageType type;
  final MessageStatus status;
  final String senderId;
  final String receiverId;
  final Map<String, dynamic>? metadata;
  final User sender;
  final User receiver;
  final bool isRead;

  Message({
    required super.id,
    required this.content,
    required this.type,
    required this.status,
    required this.senderId,
    required this.receiverId,
    this.metadata,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.sender,
    required this.receiver,
    this.isRead = false,
  }) {
    if (content.isEmpty) {
      throw ArgumentError('Content cannot be empty');
    }
  }

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'] as String,
      sender: User.fromJson(json['sender'] as Map<String, dynamic>),
      receiver: User.fromJson(json['receiver'] as Map<String, dynamic>),
      content: json['content'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      isRead: json['isRead'] as bool? ?? false,
      type: $enumDecode(_$MessageTypeEnumMap, json['type']),
      status: $enumDecode(_$MessageStatusEnumMap, json['status']),
      senderId: json['senderId'] as String,
      receiverId: json['receiverId'] as String,
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
    );
  }

  @override
  Map<String, dynamic> toJson() => _$MessageToJson(this);

  Message copyWith({
    String? id,
    String? content,
    MessageType? type,
    MessageStatus? status,
    String? senderId,
    String? receiverId,
    Map<String, dynamic>? metadata,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    User? sender,
    User? receiver,
    bool? isRead,
  }) {
    return Message(
      id: id ?? this.id,
      content: content ?? this.content,
      type: type ?? this.type,
      status: status ?? this.status,
      senderId: senderId ?? this.senderId,
      receiverId: receiverId ?? this.receiverId,
      metadata: metadata ?? this.metadata,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      sender: sender ?? this.sender,
      receiver: receiver ?? this.receiver,
      isRead: isRead ?? this.isRead,
    );
  }

  bool get isText => type == MessageType.text;
  bool get isImage => type == MessageType.image;
  bool get isFile => type == MessageType.file;
  bool get isSystem => type == MessageType.system;

  bool get isSent => status == MessageStatus.sent;
  bool get isDelivered => status == MessageStatus.delivered;
  bool get isFailed => status == MessageStatus.failed;
}
