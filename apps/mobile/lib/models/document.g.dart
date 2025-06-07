// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'document.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Document _$DocumentFromJson(Map<String, dynamic> json) => Document(
      id: json['id'] as String,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      title: json['title'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$DocumentTypeEnumMap, json['type']),
      status: $enumDecode(_$DocumentStatusEnumMap, json['status']),
      url: json['url'] as String,
      mimeType: json['mimeType'] as String,
      size: (json['size'] as num).toInt(),
      metadata: json['metadata'] as Map<String, dynamic>?,
      uploadedBy: json['uploadedBy'] as String?,
      uploadedAt: json['uploadedAt'] == null
          ? null
          : DateTime.parse(json['uploadedAt'] as String),
      approvedBy: json['approvedBy'] as String?,
      approvedAt: json['approvedAt'] == null
          ? null
          : DateTime.parse(json['approvedAt'] as String),
      rejectedBy: json['rejectedBy'] as String?,
      rejectedAt: json['rejectedAt'] == null
          ? null
          : DateTime.parse(json['rejectedAt'] as String),
      archivedBy: json['archivedBy'] as String?,
      archivedAt: json['archivedAt'] == null
          ? null
          : DateTime.parse(json['archivedAt'] as String),
      propertyId: json['propertyId'] as String?,
      userId: json['userId'] as String?,
      agencyId: json['agencyId'] as String?,
      contractId: json['contractId'] as String?,
      reservationId: json['reservationId'] as String?,
      property: json['Property'] as Map<String, dynamic>?,
      user: json['User'] as Map<String, dynamic>?,
      agency: json['Agency'] as Map<String, dynamic>?,
      contract: json['Contract'] as Map<String, dynamic>?,
      reservation: json['Reservation'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$DocumentToJson(Document instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'title': instance.title,
      'description': instance.description,
      'type': _$DocumentTypeEnumMap[instance.type]!,
      'status': _$DocumentStatusEnumMap[instance.status]!,
      'url': instance.url,
      'mimeType': instance.mimeType,
      'size': instance.size,
      'metadata': instance.metadata,
      'uploadedBy': instance.uploadedBy,
      'uploadedAt': instance.uploadedAt?.toIso8601String(),
      'approvedBy': instance.approvedBy,
      'approvedAt': instance.approvedAt?.toIso8601String(),
      'rejectedBy': instance.rejectedBy,
      'rejectedAt': instance.rejectedAt?.toIso8601String(),
      'archivedBy': instance.archivedBy,
      'archivedAt': instance.archivedAt?.toIso8601String(),
      'propertyId': instance.propertyId,
      'userId': instance.userId,
      'agencyId': instance.agencyId,
      'contractId': instance.contractId,
      'reservationId': instance.reservationId,
      'Property': instance.property,
      'User': instance.user,
      'Agency': instance.agency,
      'Contract': instance.contract,
      'Reservation': instance.reservation,
    };

const _$DocumentTypeEnumMap = {
  DocumentType.contract: 'CONTRACT',
  DocumentType.invoice: 'INVOICE',
  DocumentType.receipt: 'RECEIPT',
  DocumentType.report: 'REPORT',
  DocumentType.image: 'IMAGE',
  DocumentType.video: 'VIDEO',
  DocumentType.audio: 'AUDIO',
  DocumentType.other: 'OTHER',
};

const _$DocumentStatusEnumMap = {
  DocumentStatus.draft: 'DRAFT',
  DocumentStatus.pending: 'PENDING',
  DocumentStatus.approved: 'APPROVED',
  DocumentStatus.rejected: 'REJECTED',
  DocumentStatus.archived: 'ARCHIVED',
};
