import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'channel.g.dart'; // Ensure this generates for both if ChannelModel is kept here, or split files

enum ChannelType {
  @JsonValue('PUBLIC')
  public,
  @JsonValue('PRIVATE')
  private,
  @JsonValue('GROUP')
  group,
}

enum ChannelCategory {
  @JsonValue('AGENT')
  agent,
  @JsonValue('AGENCY')
  agency,
  @JsonValue('TENANT')
  tenant,
  @JsonValue('PROPERTY')
  property,
  @JsonValue('PAYMENT')
  payment,
  @JsonValue('SYSTEM')
  system,
  @JsonValue('REPORT')
  report,
  @JsonValue('RESERVATION')
  reservation,
  @JsonValue('TASK')
  task,
  @JsonValue('TICKET')
  ticket,
}

@JsonSerializable()
class Channel extends BaseModel {
  final bool? _isActive;
  @override
  bool get isActive => !isDeleted && (_isActive ?? true);
  final String cuid;
  final String name;
  final ChannelType type;
  final ChannelCategory category;
  final String? description;
  @JsonKey(name: 'CommunicationLogs')
  final List<Map<String, dynamic>>? communicationLogs;

  Channel({
    required super.id,
    bool? isActive,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.cuid,
    required this.name,
    required this.type,
    required this.category,
    this.description,
    this.communicationLogs,
  })  : _isActive = isActive {
    if (name.isEmpty) {
      throw ArgumentError('Name cannot be empty');
    }
  }

  bool get isPublic => type == ChannelType.public;
  bool get isPrivate => type == ChannelType.private;
  bool get isGroup => type == ChannelType.group;
  bool get isAgentChannel => category == ChannelCategory.agent;
  bool get isAgencyChannel => category == ChannelCategory.agency;
  bool get isTenantChannel => category == ChannelCategory.tenant;
  bool get isPropertyChannel => category == ChannelCategory.property;
  bool get isPaymentChannel => category == ChannelCategory.payment;
  bool get isSystemChannel => category == ChannelCategory.system;
  bool get isReportChannel => category == ChannelCategory.report;
  bool get isReservationChannel => category == ChannelCategory.reservation;
  bool get isTaskChannel => category == ChannelCategory.task;
  bool get isTicketChannel => category == ChannelCategory.ticket;

  factory Channel.fromJson(Map<String, dynamic> json) => Channel(
        id: json['id'] as String,
        createdAt: DateTime.parse(json['createdAt'] as String),
        updatedAt: DateTime.parse(json['updatedAt'] as String),
        deletedAt: json['deletedAt'] != null
            ? DateTime.parse(json['deletedAt'] as String)
            : null,
        cuid: json['cuid'] as String,
        name: json['name'] as String,
        type: ChannelType.values.firstWhere((e) =>
            e.toString().split('.').last.toUpperCase() ==
            (json['type'] as String).toUpperCase()),
        category: ChannelCategory.values.firstWhere((e) =>
            e.toString().split('.').last.toUpperCase() ==
            (json['category'] as String).toUpperCase()),
        description: json['description'] as String?,
        communicationLogs: (json['CommunicationLogs'] as List?)
            ?.map((e) => Map<String, dynamic>.from(e as Map))
            .toList(),
        isActive: json['isActive'] as bool?,
      );

  @override
  Map<String, dynamic> toJson() => {
        ..._$ChannelToJson(this),
        'isActive': isActive,
      };

  /// Returns a copy of this Channel with the given fields replaced by new values.
  /// For nullable fields, pass the corresponding explicit null flag as true to set them to null.
  Channel copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? cuid,
    String? name,
    ChannelType? type,
    ChannelCategory? category,
    String? description,
    bool descriptionExplicitNull = false,
    List<Map<String, dynamic>>? communicationLogs,
    bool communicationLogsExplicitNull = false,
    bool? isActive,
    bool isActiveExplicitNull = false,
  }) {
    return Channel(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      cuid: cuid ?? this.cuid,
      name: name ?? this.name,
      type: type ?? this.type,
      category: category ?? this.category,
      description: descriptionExplicitNull ? null : (description ?? this.description),
      communicationLogs: communicationLogsExplicitNull ? null : (communicationLogs ?? this.communicationLogs),
      isActive: isActiveExplicitNull ? null : (isActive ?? _isActive),
    );
  }
}

enum ChannelStatus {
  @JsonValue('ACTIVE')
  active,
  @JsonValue('ARCHIVED')
  archived,
  @JsonValue('DELETED')
  deleted,
}

@JsonSerializable()
class ChannelModel extends BaseModel {
  final bool? _isActive;
  @override
  bool get isActive => !isDeleted && (_isActive ?? true);
  // If keeping in same file, .g.dart needs to handle both
  final String name;
  final String? description;
  final ChannelType type;
  final ChannelStatus status;
  final String? icon;
  final String? coverImage;
  final List<String> memberIds;
  final String? ownerId;
  final Map<String, dynamic>? settings;
  final bool isPrivate;
  final String? lastMessageId;
  final DateTime? lastMessageAt;
  final int unreadCount;
  final Map<String, dynamic>? metadata;

  ChannelModel({
    required super.id,
    bool? isActive,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.name,
    this.description,
    required this.type,
    required this.status,
    this.icon,
    this.coverImage,
    required this.memberIds,
    this.ownerId,
    this.settings,
    required this.isPrivate,
    this.lastMessageId,
    this.lastMessageAt,
    required this.unreadCount,
    this.metadata,
  }) : _isActive = isActive;

  factory ChannelModel.fromJson(Map<String, dynamic> json) => ChannelModel(
        id: json['id'] as String,
        createdAt: DateTime.parse(json['createdAt'] as String),
        updatedAt: DateTime.parse(json['updatedAt'] as String),
        deletedAt: json['deletedAt'] != null
            ? DateTime.parse(json['deletedAt'] as String)
            : null,
        name: json['name'] as String,
        description: json['description'] as String?,
        type: ChannelType.values.firstWhere((e) =>
            e.toString().split('.').last.toUpperCase() ==
            (json['type'] as String).toUpperCase()),
        status: ChannelStatus.values.firstWhere((e) =>
            e.toString().split('.').last.toUpperCase() ==
            (json['status'] as String).toUpperCase()),
        icon: json['icon'] as String?,
        coverImage: json['coverImage'] as String?,
        memberIds: (json['memberIds'] as List).map((e) => e as String).toList(),
        ownerId: json['ownerId'] as String?,
        settings: json['settings'] as Map<String, dynamic>?,
        isPrivate: json['isPrivate'] as bool,
        lastMessageId: json['lastMessageId'] as String?,
        lastMessageAt: json['lastMessageAt'] != null
            ? DateTime.parse(json['lastMessageAt'] as String)
            : null,
        unreadCount: json['unreadCount'] as int,
        metadata: json['metadata'] as Map<String, dynamic>?,
        isActive: json['isActive'] as bool?,
      );

  @override
  Map<String, dynamic> toJson() => {
        ..._$ChannelModelToJson(this),
        'isActive': isActive,
      };
}
