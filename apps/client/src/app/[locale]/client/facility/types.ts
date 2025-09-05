import type { z } from "zod";

import type {
  CreateExpenseInput,
  CreateExtraChargeInput,
  CreateIncludedServiceInput,
  Expense,
  ExpenseFilterInput,
  ExtraCharge,
  ExtraChargeFilterInput,
  Facility,
  FacilityFilterInput,
  IncludedService,
  IncludedServiceFilterInput,
  UpdateExpenseInput,
  UpdateExtraChargeInput,
  UpdateIncludedServiceInput,
} from "@reservatior/validators";

export interface FacilityFormValues {
  name: string;
  description?: string;
  icon?: string;
  logo?: string;
  locationId?: string;
  type:
    | "RESIDENTIAL"
    | "COMMERCIAL"
    | "MIXED_USE"
    | "INDUSTRIAL"
    | "OFFICE"
    | "RETAIL"
    | "WAREHOUSE"
    | "PARKING"
    | "GYM"
    | "SWIMMING_POOL"
    | "YOGA"
    | "FITNESS"
    | "GOLF"
    | "CAFETERIA"
    | "RESTAURANT"
    | "THEATER"
    | "CONCERT_HALL"
    | "MUSEUM"
    | "GALLERY"
    | "CINEMA"
    | "ZOO"
    | "BOTANIC_GARDEN"
    | "THEME_PARK"
    | "GOLF_COURSE"
    | "BEACH"
    | "PARK";
  status: "ACTIVE" | "INACTIVE";
  facilityAmenities?: string[];
  locationAmenities?: string[];
}

export interface FacilityFilter extends FacilityFilterInput {
  type?:
    | "RESIDENTIAL"
    | "COMMERCIAL"
    | "MIXED_USE"
    | "INDUSTRIAL"
    | "OFFICE"
    | "RETAIL"
    | "WAREHOUSE"
    | "PARKING"
    | "GYM"
    | "SWIMMING_POOL"
    | "YOGA"
    | "FITNESS"
    | "GOLF"
    | "CAFETERIA"
    | "RESTAURANT"
    | "THEATER"
    | "CONCERT_HALL"
    | "MUSEUM"
    | "GALLERY"
    | "CINEMA"
    | "ZOO"
    | "BOTANIC_GARDEN"
    | "THEME_PARK"
    | "GOLF_COURSE"
    | "BEACH"
    | "PARK";
  status?: "ACTIVE" | "INACTIVE";
}

export type {
  IncludedService,
  CreateIncludedServiceInput,
  UpdateIncludedServiceInput,
  IncludedServiceFilterInput,
};
export type {
  ExtraCharge,
  CreateExtraChargeInput,
  UpdateExtraChargeInput,
  ExtraChargeFilterInput,
};
export type {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseFilterInput,
};

export interface FacilityWithRelations extends Facility {
  Location?: {
    id: string;
    name?: string;
    city?: string;
    address?: string;
  };
  includedServices?: IncludedService[];
  extraCharges?: ExtraCharge[];
  expenses?: Expense[];
}
