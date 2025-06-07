import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Ticket {
    id: string;
    cuid: string;
    eventName: string;
    eventDate: Date;
    venue: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface TicketStore {
    ticket: Ticket | null;
    tickets: Ticket[];
    isLoading: boolean;

    setTicket: (ticket: Ticket) => void;
    updateTicket: (ticket: Partial<Ticket>) => void;
    clearTicket: () => void;
    setTickets: (tickets: Ticket[]) => void;
    addTicket: (ticket: Ticket) => void;
    removeTicket: (ticketId: string) => void;

    getTicketsByEvent: (eventName: string) => Ticket[];
    getTicketsByVenue: (venue: string) => Ticket[];
    getUpcomingTickets: () => Ticket[];
    getPastTickets: () => Ticket[];
    searchTickets: (query: string) => Ticket[];
    getTicketsByDateRange: (startDate: Date, endDate: Date) => Ticket[];
}

export const useTicketStore = create<TicketStore>()(
    devtools((set, get) => ({
        ticket: null,
        tickets: [],
        isLoading: false,

        setTicket: (ticket) => set({ ticket }),
        updateTicket: (ticketUpdate) => set((state) => ({
            ticket: state.ticket ? { ...state.ticket, ...ticketUpdate } : null,
            tickets: state.tickets.map(t =>
                t.id === state.ticket?.id ? { ...t, ...ticketUpdate } : t
            )
        })),
        clearTicket: () => set({ ticket: null }),

        setTickets: (tickets) => set({ tickets }),
        addTicket: (ticket) => set((state) => ({
            tickets: [...state.tickets, ticket]
        })),
        removeTicket: (ticketId) => set((state) => ({
            tickets: state.tickets.filter(t => t.id !== ticketId)
        })),

        getTicketsByEvent: (eventName) => {
            const { tickets } = get();
            return tickets.filter(t =>
                t.eventName.toLowerCase() === eventName.toLowerCase()
            );
        },

        getTicketsByVenue: (venue) => {
            const { tickets } = get();
            return tickets.filter(t =>
                t.venue.toLowerCase() === venue.toLowerCase()
            );
        },

        getUpcomingTickets: () => {
            const { tickets } = get();
            const now = new Date();
            return tickets
                .filter(t => new Date(t.eventDate) > now)
                .sort((a, b) =>
                    new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
                );
        },

        getPastTickets: () => {
            const { tickets } = get();
            const now = new Date();
            return tickets
                .filter(t => new Date(t.eventDate) < now)
                .sort((a, b) =>
                    new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
                );
        },

        searchTickets: (query) => {
            const { tickets } = get();
            const searchTerm = query.toLowerCase();
            return tickets.filter(t =>
                t.eventName.toLowerCase().includes(searchTerm) ||
                t.venue.toLowerCase().includes(searchTerm)
            );
        },

        getTicketsByDateRange: (startDate, endDate) => {
            const { tickets } = get();
            return tickets.filter(t => {
                const eventDate = new Date(t.eventDate);
                return eventDate >= startDate && eventDate <= endDate;
            });
        }
    }))
); 