import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Event } from '~/utils/types';


interface EventStore {
    event: Event | null;
    events: Event[];
    isLoading: boolean;

    setEvent: (event: Event) => void;
    updateEvent: (event: Partial<Event>) => void;
    clearEvent: () => void;
    setEvents: (events: Event[]) => void;
    addEvent: (event: Event) => void;
    removeEvent: (eventId: string) => void;
}

export const useEventStore = create<EventStore>()(
    devtools((set) => ({
        event: null,
        events: [],
        isLoading: false,

        setEvent: (event) => set({ event }),
        updateEvent: (eventUpdate) => set((state) => ({
            event: state.event ? { ...state.event, ...eventUpdate } : null,
            events: state.events.map(e => e.id === state.event?.id ? { ...e, ...eventUpdate } : e),
        })),
        clearEvent: () => set({ event: null }),

        setEvents: (events) => set({ events }),
        addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
        removeEvent: (eventId) => set((state) => ({
            events: state.events.filter(e => e.id !== eventId),
        })),
    }))
);
