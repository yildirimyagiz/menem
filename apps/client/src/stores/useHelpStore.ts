import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Help {
    id: string;
    title: string;
    description: string;
    status: string; // Replace with an enum or specific type for HelpStatus if available
    priority: string; // Replace with an enum or specific type for HelpPriority if available
    autoNumber: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    userId?: string;
    facilityId?: string;
    expenseId?: string;
}

interface HelpStore {
    help: Help | null;
    helps: Help[];
    isLoading: boolean;

    setHelp: (help: Help) => void;
    updateHelp: (helpUpdate: Partial<Help>) => void;
    clearHelp: () => void;
    setHelps: (helps: Help[]) => void;
    addHelp: (help: Help) => void;
    removeHelp: (helpId: string) => void;
}

export const useHelpStore = create<HelpStore>()(
    devtools((set) => ({
        help: null,
        helps: [],
        isLoading: false,

        setHelp: (help) => set({ help }),
        updateHelp: (helpUpdate) => set((state) => ({
            help: state.help ? { ...state.help, ...helpUpdate } : null,
            helps: state.helps.map(h =>
                h.id === state.help?.id ? { ...h, ...helpUpdate } : h
            ),
        })),
        clearHelp: () => set({ help: null }),

        setHelps: (helps) => set({ helps }),
        addHelp: (help) => set((state) => ({
            helps: [...state.helps, help],
        })),
        removeHelp: (helpId) => set((state) => ({
            helps: state.helps.filter(h => h.id !== helpId),
        })),
    }))
);
