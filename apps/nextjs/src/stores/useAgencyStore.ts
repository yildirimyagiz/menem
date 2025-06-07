import type { z } from "zod";
import type { GetState, SetState } from "zustand";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { AgencySchema } from "@acme/validators";

// Infer Agency type from Zod schema
export type Agency = z.infer<typeof AgencySchema>;

// AgencyStore definition
interface AgencyStore {
  agency: Agency | null;
  agencies: Agency[];
  isLoading: boolean;
  filters: {
    address?: string;
  };

  setAgency: (agency: Agency) => void;
  updateAgency: (agencyUpdate: Agency) => void;
  clearAgency: () => void;
  setAgencies: (agencies: Agency[]) => void;
  addAgency: (agency: Agency) => void;
  removeAgency: (agencyId: string) => void;
  setFilters: (newFilters: AgencyStore["filters"]) => void;

  getFilteredAgencies: () => Agency[];
  getActiveAgencies: () => Agency[];
  searchAgencies: (query: string) => Agency[];
}

export const useAgencyStore = create<AgencyStore>()(
  devtools((set: SetState<AgencyStore>, get: GetState<AgencyStore>) => ({
    agency: null,
    agencies: [],
    isLoading: false,
    filters: {},

    setAgency: (agency: Agency) => set({ agency }),
    updateAgency: (agencyUpdate: Agency) =>
      set((state: AgencyStore) => ({
        agency: state.agency ? { ...state.agency, ...agencyUpdate } : null,
        agencies: state.agencies.map((a: Agency) =>
          a.id === state.agency?.id ? { ...a, ...agencyUpdate } : a,
        ),
      })),
    clearAgency: (): void => set({ agency: null }),

    setAgencies: (agencies: Agency[]) => set({ agencies }),
    addAgency: (agency: Agency) =>
      set((state: AgencyStore) => ({
        agencies: [...state.agencies, agency],
      })),
    removeAgency: (agencyId: string) =>
      set((state: AgencyStore) => ({
        agencies: state.agencies.filter((a: Agency) => a.id !== agencyId),
      })),

    setFilters: (newFilters: AgencyStore["filters"]) =>
      set((state: AgencyStore) => ({
        filters: { ...state.filters, ...newFilters },
      })),

    // Filter agencies by address (optional)
    getFilteredAgencies: (): Agency[] => {
      const { agencies, filters } = get();
      return agencies.filter((agency: Agency) => {
        if (filters.address && agency.address !== filters.address) {
          return false;
        }
        return true;
      });
    },

    getActiveAgencies: (): Agency[] => {
      const { agencies } = get();
      return agencies.filter((a: Agency) => !a.deletedAt);
    },

    // Search agencies by name, address, website, or phoneNumber (all optional fields are checked for existence)
    searchAgencies: (query: string): Agency[] => {
      const { agencies } = get();
      const lowerQuery = query.toLowerCase();
      return agencies.filter((agency: Agency) => {
        return (
          agency.name.toLowerCase().includes(lowerQuery) ||
          agency.address?.toLowerCase().includes(lowerQuery) ||
          agency.website?.toLowerCase().includes(lowerQuery) ||
          agency.phoneNumber?.toLowerCase().includes(lowerQuery)
        );
      });
    },
  })),
);
