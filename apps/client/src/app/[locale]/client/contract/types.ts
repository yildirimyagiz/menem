import type {
  Contract,
  ContractStatusType,
  ExtraCharge,
  IncludedService,
  Increase,
  Property,
  Tenant,
  User,
} from "@reservatior/validators";

// Simple type for contract data as returned by the API
export interface ContractCardData {
  id: string;
  name: string;
  description: string;
  status: ContractStatusType;
  startDate: string;
  endDate: string;
  tenantId: string;
  propertyId: string;
  agencyId: string;
  terms: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | undefined;
  property: {
    id: string;
    name: string;
  } | null;
  tenant: {
    id: string;
    name: string;
  } | null;
  agency: {
    id: string;
    name: string;
  } | null;
}

export interface ContractWithRelations extends Contract {
  property: {
    id: string;
    name: string;
  } | null;
  tenant: {
    id: string;
    name: string;
  } | null;
  agency: {
    id: string;
    name: string;
  } | null;
  increases?: {
    id: string;
    propertyId: string;
    tenantId: string;
    proposedBy: string;
    oldRent: number;
    newRent: number;
    effectiveDate: Date;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    Property?: {
      id: string;
      title: string;
    };
    Tenant?: {
      id: string;
      userName: string;
    };
    Offer?: {
      id: string;
    } | null;
    Contract?: {
      id: string;
    } | null;
    contractId: string | null;
  }[];
  extraCharges?: {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    logo: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    properties?: {
      id: string;
      title: string;
    }[];
    agencies?: {
      id: string;
      name: string;
    }[];
    users?: {
      id: string;
      userName: string;
    }[];
    tasks?: {
      id: string;
    }[];
    reports?: {
      id: string;
    }[];
    FacilityAmenities: {
      id: string;
    }[];
    locationAmenities: {
      id: string;
    }[];
    expenses?: {
      id: string;
    }[];
    Facility?: {
      id: string;
      name: string;
    } | null;
    facilityId: string | null;
    IncludedService?: {
      id: string;
      name: string;
    } | null;
    includedServiceId: string | null;
  }[];
  includedServices?: {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    logo: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    properties?: {
      id: string;
      title: string;
    }[];
    agencies?: {
      id: string;
      name: string;
    }[];
    users?: {
      id: string;
      userName: string;
    }[];
    tasks?: {
      id: string;
    }[];
    reports?: {
      id: string;
    }[];
    FacilityAmenities: {
      id: string;
    }[];
    locationAmenities: {
      id: string;
    }[];
    expenses?: {
      id: string;
    }[];
    extraCharges?: {
      id: string;
      name: string;
    }[];
    Facility?: {
      id: string;
      name: string;
    } | null;
    facilityId: string | null;
  }[];
}

export interface ContractFormValues {
  name: string;
  description: string;
  status: ContractStatusType;
  startDate: string;
  endDate: string;
  tenantId: string;
  propertyId: string;
  agencyId: string;
  terms: Record<string, any>;
  metadata: Record<string, any>;
}

export interface ContractFilter {
  status?: ContractStatusType;
  tenantId?: string;
  propertyId?: string;
  agencyId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  sortBy?: "startDate" | "endDate" | "status" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface ContractTerms {
  paymentSchedule: {
    frequency: "monthly" | "quarterly" | "yearly";
    dueDate: number; // Day of the month
  };
  deposit: {
    amount: number;
    refundable: boolean;
  };
  maintenance: {
    responsibility: "tenant" | "agency" | "shared";
    emergencyContact: string;
  };
  termination: {
    noticePeriod: number; // in days
    conditions: string[];
  };
  includedServices: string[];
  extraCharges: Record<
    string,
    {
      amount: number;
      frequency: string;
    }
  >;
}
