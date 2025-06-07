import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'document.g.dart';

enum DocumentType {
  @JsonValue('CONTRACT')
  contract,
  @JsonValue('INVOICE')
  invoice,
  @JsonValue('RECEIPT')
  receipt,
  @JsonValue('REPORT')
  report,
  @JsonValue('IMAGE')
  image,
  @JsonValue('VIDEO')
  video,
  @JsonValue('AUDIO')
  audio,
  @JsonValue('OTHER')
  other,
}

enum DocumentStatus {
  @JsonValue('DRAFT')
  draft,
  @JsonValue('PENDING')
  pending,
  @JsonValue('APPROVED')
  approved,
  @JsonValue('REJECTED')
  rejected,
  @JsonValue('ARCHIVED')
  archived,
}

@JsonSerializable()
class Document extends BaseModel {
  final String title;
  final String description;
  final DocumentType type;
  final DocumentStatus status;
  final String url;
  final String mimeType;
  final int size;
  final Map<String, dynamic>? metadata;
  final String? uploadedBy;
  final DateTime? uploadedAt;
  final String? approvedBy;
  final DateTime? approvedAt;
  final String? rejectedBy;
  final DateTime? rejectedAt;
  final String? archivedBy;
  final DateTime? archivedAt;
  final String? propertyId;
  final String? userId;
  final String? agencyId;
  final String? contractId;
  final String? reservationId;
  @JsonKey(name: 'Property')
  final Map<String, dynamic>? property;
  @JsonKey(name: 'User')
  final Map<String, dynamic>? user;
  @JsonKey(name: 'Agency')
  final Map<String, dynamic>? agency;
  @JsonKey(name: 'Contract')
  final Map<String, dynamic>? contract;
  @JsonKey(name: 'Reservation')
  final Map<String, dynamic>? reservation;

  Document({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.title,
    required this.description,
    required this.type,
    required this.status,
    required this.url,
    required this.mimeType,
    required this.size,
    this.metadata,
    this.uploadedBy,
    this.uploadedAt,
    this.approvedBy,
    this.approvedAt,
    this.rejectedBy,
    this.rejectedAt,
    this.archivedBy,
    this.archivedAt,
    this.propertyId,
    this.userId,
    this.agencyId,
    this.contractId,
    this.reservationId,
    this.property,
    this.user,
    this.agency,
    this.contract,
    this.reservation,
  }) {
    if (title.isEmpty) {
      throw ArgumentError('Title cannot be empty');
    }
    if (description.isEmpty) {
      throw ArgumentError('Description cannot be empty');
    }
    if (url.isEmpty) {
      throw ArgumentError('URL cannot be empty');
    }
    if (mimeType.isEmpty) {
      throw ArgumentError('MIME type cannot be empty');
    }
    if (size < 0) {
      throw ArgumentError('Size cannot be negative');
    }
  }

  bool get isDraft => status == DocumentStatus.draft;
  bool get isPending => status == DocumentStatus.pending;
  bool get isApproved => status == DocumentStatus.approved;
  bool get isRejected => status == DocumentStatus.rejected;
  bool get isArchived => status == DocumentStatus.archived;
  bool get isContract => type == DocumentType.contract;
  bool get isInvoice => type == DocumentType.invoice;
  bool get isReceipt => type == DocumentType.receipt;
  bool get isReport => type == DocumentType.report;
  bool get isImage => type == DocumentType.image;
  bool get isVideo => type == DocumentType.video;
  bool get isAudio => type == DocumentType.audio;
  bool get isOther => type == DocumentType.other;
  bool get hasBeenUploaded => uploadedAt != null;
  bool get hasBeenApproved => approvedAt != null;
  bool get hasBeenRejected => rejectedAt != null;
  bool get hasBeenArchived => archivedAt != null;

  factory Document.fromJson(Map<String, dynamic> json) =>
      _$DocumentFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$DocumentToJson(this);

  Document copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? title,
    String? description,
    DocumentType? type,
    DocumentStatus? status,
    String? url,
    String? mimeType,
    int? size,
    Map<String, dynamic>? metadata,
    String? uploadedBy,
    DateTime? uploadedAt,
    String? approvedBy,
    DateTime? approvedAt,
    String? rejectedBy,
    DateTime? rejectedAt,
    String? archivedBy,
    DateTime? archivedAt,
    String? propertyId,
    String? userId,
    String? agencyId,
    String? contractId,
    String? reservationId,
    Map<String, dynamic>? property,
    Map<String, dynamic>? user,
    Map<String, dynamic>? agency,
    Map<String, dynamic>? contract,
    Map<String, dynamic>? reservation,
  }) {
    return Document(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      title: title ?? this.title,
      description: description ?? this.description,
      type: type ?? this.type,
      status: status ?? this.status,
      url: url ?? this.url,
      mimeType: mimeType ?? this.mimeType,
      size: size ?? this.size,
      metadata: metadata ?? this.metadata,
      uploadedBy: uploadedBy ?? this.uploadedBy,
      uploadedAt: uploadedAt ?? this.uploadedAt,
      approvedBy: approvedBy ?? this.approvedBy,
      approvedAt: approvedAt ?? this.approvedAt,
      rejectedBy: rejectedBy ?? this.rejectedBy,
      rejectedAt: rejectedAt ?? this.rejectedAt,
      archivedBy: archivedBy ?? this.archivedBy,
      archivedAt: archivedAt ?? this.archivedAt,
      propertyId: propertyId ?? this.propertyId,
      userId: userId ?? this.userId,
      agencyId: agencyId ?? this.agencyId,
      contractId: contractId ?? this.contractId,
      reservationId: reservationId ?? this.reservationId,
      property: property ?? this.property,
      user: user ?? this.user,
      agency: agency ?? this.agency,
      contract: contract ?? this.contract,
      reservation: reservation ?? this.reservation,
    );
  }
}
