import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Label {
    id: string;
    cuid: string;
    name: string;
    color: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

interface LabelStore {
    label: Label | null;
    labels: Label[];
    isLoading: boolean;

    setLabel: (label: Label) => void;
    updateLabel: (label: Partial<Label>) => void;
    clearLabel: () => void;
    setLabels: (labels: Label[]) => void;
    addLabel: (label: Label) => void;
    removeLabel: (labelId: string) => void;

    getLabelsByName: (name: string) => Label[];
    getLabelsByColor: (color: string) => Label[];
    getActiveLabels: () => Label[];
}

export const useLabelStore = create<LabelStore>()(
    devtools((set, get) => ({
        label: null,
        labels: [],
        isLoading: false,

        setLabel: (label) => set({ label }),
        updateLabel: (labelUpdate) => set((state) => ({
            label: state.label ? { ...state.label, ...labelUpdate } : null,
            labels: state.labels.map(l =>
                l.id === state.label?.id ? { ...l, ...labelUpdate } : l
            )
        })),
        clearLabel: () => set({ label: null }),

        setLabels: (labels) => set({ labels }),
        addLabel: (label) => set((state) => ({
            labels: [...state.labels, label]
        })),
        removeLabel: (labelId) => set((state) => ({
            labels: state.labels.filter(l => l.id !== labelId)
        })),

        getLabelsByName: (name) => {
            const { labels } = get();
            return labels.filter(l =>
                l.name.toLowerCase().includes(name.toLowerCase())
            );
        },

        getLabelsByColor: (color) => {
            const { labels } = get();
            return labels.filter(l => l.color === color);
        },

        getActiveLabels: () => {
            const { labels } = get();
            return labels.filter(l => !l.deletedAt);
        }
    }))
); 