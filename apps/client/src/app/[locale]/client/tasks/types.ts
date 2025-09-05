export interface TaskFilterInput {
  page: number;
  pageSize: number;
  sortBy:
    | "createdAt"
    | "updatedAt"
    | "dueDate"
    | "completedAt"
    | "title"
    | "status"
    | "priority";
  sortOrder: "asc" | "desc";
  title?: string;
  status?: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  type?:
    | "PROPERTY_MAINTENANCE"
    | "LISTING_REVIEW"
    | "CLIENT_FOLLOW_UP"
    | "DOCUMENT_PROCESSING"
    | "MARKETING_TASK"
    | "SALES_ACTIVITY"
    | "COMPLIANCE_CHECK"
    | "COMMUNICATION_FOLLOW_UP";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  createdById?: string;
  assignedToId?: string;
  propertyId?: string;
  agentId?: string;
  agencyId?: string;
  facilityId?: string;
  includedServiceId?: string;
  extraChargeId?: string;
  followedByUserId?: string;
}
