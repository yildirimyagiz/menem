import type { Taxonomy } from '~/utils/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


interface TaxonomyStore {
    taxonomy: Taxonomy | null;
    taxonomies: Taxonomy[];
    isLoading: boolean;

    setTaxonomy: (taxonomy: Taxonomy) => void;
    updateTaxonomy: (taxonomy: Partial<Taxonomy>) => void;
    clearTaxonomy: () => void;
    setTaxonomies: (taxonomies: Taxonomy[]) => void;
    addTaxonomy: (taxonomy: Taxonomy) => void;
    removeTaxonomy: (taxonomyId: string) => void;

    getActiveTaxonomies: () => Taxonomy[];
    searchTaxonomies: (query: string) => Taxonomy[];
    getMostUsedTaxonomies: (limit?: number) => Taxonomy[];
    getTaxonomiesByColor: (color: string) => Taxonomy[];
}

export const useTaxonomyStore = create<TaxonomyStore>()(
    devtools((set, get) => ({
        taxonomy: null,
        taxonomies: [],
        isLoading: false,

        setTaxonomy: (taxonomy) => set({ taxonomy }),
        updateTaxonomy: (taxonomyUpdate) => set((state) => ({
            taxonomy: state.taxonomy ? { ...state.taxonomy, ...taxonomyUpdate } : null,
            taxonomies: state.taxonomies.map(t =>
                t.id === state.taxonomy?.id ? { ...t, ...taxonomyUpdate } : t
            )
        })),
        clearTaxonomy: () => set({ taxonomy: null }),

        setTaxonomies: (taxonomies) => set({ taxonomies }),
        addTaxonomy: (taxonomy) => set((state) => ({
            taxonomies: [...state.taxonomies, taxonomy]
        })),
        removeTaxonomy: (taxonomyId) => set((state) => ({
            taxonomies: state.taxonomies.filter(t => t.id !== taxonomyId)
        })),

        getActiveTaxonomies: () => {
            const { taxonomies } = get();
            return taxonomies.filter(t => !t.deletedAt);
        },

        searchTaxonomies: (query) => {
            const { taxonomies } = get();
            const searchTerm = query.toLowerCase();
            return taxonomies.filter(t =>
                t.name.toLowerCase().includes(searchTerm) ||
                t.description?.toLowerCase().includes(searchTerm)
            );
        },

        getMostUsedTaxonomies: (limit = 10) => {
            const { taxonomies } = get();
            return [...taxonomies]
                .sort((a, b) => b.count - a.count)
                .slice(0, limit);
        },

        getTaxonomiesByColor: (color) => {
            const { taxonomies } = get();
            return taxonomies.filter(t => t.color === color);
        }
    }))
); 