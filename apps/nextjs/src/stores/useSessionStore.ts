
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Session } from '~/utils/types';


interface SessionStore {
    session: Session | null;
    sessions: Session[];
    isLoading: boolean;

    setSession: (session: Session) => void;
    updateSession: (sessionUpdate: Partial<Session>) => void;
    clearSession: () => void;
    setSessions: (sessions: Session[]) => void;
    addSession: (session: Session) => void;
    removeSession: (sessionId: string) => void;
}

export const useSessionStore = create<SessionStore>()(
    devtools((set) => ({
        session: null,
        sessions: [],
        isLoading: false,

        setSession: (session) => set({ session }),
        updateSession: (sessionUpdate) => set((state) => ({
            session: state.session ? { ...state.session, ...sessionUpdate } : null,
            sessions: state.sessions.map(s =>
                s.id === state.session?.id ? { ...s, ...sessionUpdate } : s
            ),
        })),
        clearSession: () => set({ session: null }),

        setSessions: (sessions) => set({ sessions }),
        addSession: (session) => set((state) => ({
            sessions: [...state.sessions, session],
        })),
        removeSession: (sessionId) => set((state) => ({
            sessions: state.sessions.filter(s => s.id !== sessionId),
        })),
    }))
);
