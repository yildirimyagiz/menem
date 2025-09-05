// apps/client/src/stores/useTicketStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Ticket {
  id: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  agentId?: string;
  category?: string;
  tags?: string[];
}

interface TicketStore {
  currentTicket: Ticket | null;
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createTicket: (
    ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  fetchTicket: (id: string) => Promise<void>;
  fetchTickets: (filters?: any) => Promise<void>;
  assignTicket: (ticketId: string, agentId: string) => Promise<void>;
  updateStatus: (ticketId: string, status: Ticket["status"]) => Promise<void>;
  addNote: (ticketId: string, content: string) => Promise<void>;
  setCurrentTicket: (ticket: Ticket | null) => void;
  clearError: () => void;
}

export const useTicketStore = create<TicketStore>()(
  devtools(
    (set) => ({
      currentTicket: null,
      tickets: [],
      isLoading: false,
      error: null,

      createTicket: async (ticketData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ticketData),
          });

          if (!response.ok) {
            throw new Error("Failed to create ticket");
          }

          const newTicket = await response.json();
          set((state) => ({
            tickets: [newTicket, ...state.tickets],
            currentTicket: newTicket,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to create ticket",
            isLoading: false,
          });
        }
      },

      updateTicket: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/tickets/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            throw new Error("Failed to update ticket");
          }

          const updatedTicket = await response.json();
          set((state) => ({
            tickets: state.tickets.map((t) =>
              t.id === id ? { ...t, ...updatedTicket } : t,
            ),
            currentTicket:
              state.currentTicket?.id === id
                ? { ...state.currentTicket, ...updatedTicket }
                : state.currentTicket,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update ticket",
            isLoading: false,
          });
        }
      },

      deleteTicket: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/tickets/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete ticket");
          }

          set((state) => ({
            tickets: state.tickets.filter((t) => t.id !== id),
            currentTicket:
              state.currentTicket?.id === id ? null : state.currentTicket,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete ticket",
            isLoading: false,
          });
        }
      },

      fetchTicket: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/tickets/${id}`);

          if (!response.ok) {
            throw new Error("Failed to fetch ticket");
          }

          const ticket = await response.json();
          set({
            currentTicket: ticket,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch ticket",
            isLoading: false,
          });
        }
      },

      fetchTickets: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
          const query = new URLSearchParams(filters).toString();
          const response = await fetch(`/api/tickets?${query}`);

          if (!response.ok) {
            throw new Error("Failed to fetch tickets");
          }

          const data = await response.json();
          set({
            tickets: data,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch tickets",
            isLoading: false,
          });
        }
      },

      assignTicket: async (ticketId, agentId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/tickets/${ticketId}/assign`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agentId }),
          });

          if (!response.ok) {
            throw new Error("Failed to assign ticket");
          }

          const updatedTicket = await response.json();
          set((state) => ({
            tickets: state.tickets.map((t) =>
              t.id === ticketId ? { ...t, agentId } : t,
            ),
            currentTicket:
              state.currentTicket?.id === ticketId
                ? { ...state.currentTicket, agentId }
                : state.currentTicket,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to assign ticket",
            isLoading: false,
          });
        }
      },

      updateStatus: async (ticketId, status) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/tickets/${ticketId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          });

          if (!response.ok) {
            throw new Error("Failed to update ticket status");
          }

          const updatedTicket = await response.json();
          set((state) => ({
            tickets: state.tickets.map((t) =>
              t.id === ticketId ? { ...t, status } : t,
            ),
            currentTicket:
              state.currentTicket?.id === ticketId
                ? { ...state.currentTicket, status }
                : state.currentTicket,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update ticket status",
            isLoading: false,
          });
        }
      },

      addNote: async (ticketId, content) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/tickets/${ticketId}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          });

          if (!response.ok) {
            throw new Error("Failed to add note");
          }

          // You might want to update the ticket with the new note
          // This depends on your API response structure
          const updatedTicket = await response.json();
          set((state) => ({
            currentTicket:
              state.currentTicket?.id === ticketId
                ? updatedTicket
                : state.currentTicket,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to add note",
            isLoading: false,
          });
        }
      },

      setCurrentTicket: (ticket) => set({ currentTicket: ticket }),
      clearError: () => set({ error: null }),
    }),
    { name: "ticket-store" },
  ),
);
