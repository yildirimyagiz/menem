import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ExperienceCategory, Photo, Guest, Review, Reservation, Message, Currency } from '~/utils/types';
import { PublishedStatus, Statuses } from '~/utils/types';

interface Price {
    id: string;
    baseAmount: number;
    finalAmount: number;
    currency: Currency;
    experienceId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface Experience {
    id: string;
    userId: string;
    date: Date;
    href: string;
    title: string;
    featured: boolean;
    featuredImage?: string;
    commentCount: number;
    viewCount: number;
    like: boolean;
    category: ExperienceCategory;
    status: Statuses;
    reviewCount: number;
    averageRating?: number;
    price: Price[];
    maxGuests: number;
    saleOff?: number;
    isAds?: boolean;
    publishedStatus: PublishedStatus;
    slug: string;
    listingId?: string;
    locationId: string;
    listingNumber?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

    // Relations
    messages: Message[];
    galleryImgs: Photo[];
    guests: Guest[];
    reservations: Reservation[];
    reviews: Review[];
}

interface ExperienceFilters {
    category?: ExperienceCategory;
    locationId?: string;
    maxPrice?: number;
    minGuests?: number;
    featured?: boolean;
    status?: Statuses;
    priceRange?: {
        min: number;
        max: number;
    };
}

interface ExperienceStore {
    experience: Experience | null;
    experiences: Experience[];
    isLoading: boolean;
    filters: ExperienceFilters;

    setExperience: (experience: Experience) => void;
    updateExperience: (experience: Partial<Experience>) => void;
    clearExperience: () => void;
    setExperiences: (experiences: Experience[]) => void;
    addExperience: (experience: Experience) => void;
    removeExperience: (experienceId: string) => void;
    setFilters: (filters: Partial<ExperienceFilters>) => void;
    clearFilters: () => void;

    incrementViewCount: (experienceId: string) => void;
    incrementCommentCount: (experienceId: string) => void;
    updateReviewStats: (experienceId: string, rating: number) => void;
    toggleFeatured: (experienceId: string) => void;
    updateStatus: (experienceId: string, status: Statuses) => void;

    // Queries
    getFilteredExperiences: () => Experience[];
    getFeaturedExperiences: () => Experience[];
    getExperiencesByLocation: (locationId: string) => Experience[];
    getExperiencesByCategory: (category: ExperienceCategory) => Experience[];
    getActiveExperiences: () => Experience[];
    getPricedExperiences: (min: number, max: number) => Experience[];
}

export const useExperienceStore = create<ExperienceStore>()(
    devtools((set, get) => ({
        experience: null,
        experiences: [],
        isLoading: false,
        filters: {},

        setExperience: (experience) => set({ experience }),
        updateExperience: (experienceUpdate) => set((state) => ({
            experience: state.experience ? { ...state.experience, ...experienceUpdate } : null,
            experiences: state.experiences.map(e =>
                e.id === state.experience?.id ? { ...e, ...experienceUpdate } : e
            )
        })),
        clearExperience: () => set({ experience: null }),

        setExperiences: (experiences) => set({ experiences }),
        addExperience: (experience) => set((state) => ({
            experiences: [...state.experiences, experience]
        })),
        removeExperience: (experienceId) => set((state) => ({
            experiences: state.experiences.filter(e => e.id !== experienceId)
        })),

        setFilters: (newFilters) => set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),
        clearFilters: () => set({ filters: {} }),

        incrementViewCount: (experienceId) => set((state) => ({
            experiences: state.experiences.map(e =>
                e.id === experienceId ? { ...e, viewCount: e.viewCount + 1 } : e
            )
        })),

        incrementCommentCount: (experienceId) => set((state) => ({
            experiences: state.experiences.map(e =>
                e.id === experienceId ? { ...e, commentCount: e.commentCount + 1 } : e
            )
        })),

        updateReviewStats: (experienceId, rating) => set((state) => ({
            experiences: state.experiences.map(e =>
                e.id === experienceId ? {
                    ...e,
                    reviewCount: e.reviewCount + 1,
                    averageRating: e.averageRating
                        ? (e.averageRating * e.reviewCount + rating) / (e.reviewCount + 1)
                        : rating
                } : e
            )
        })),

        toggleFeatured: (experienceId) => set((state) => ({
            experiences: state.experiences.map(e =>
                e.id === experienceId ? { ...e, featured: !e.featured } : e
            )
        })),

        updateStatus: (experienceId, status) => set((state) => ({
            experiences: state.experiences.map(e =>
                e.id === experienceId ? { ...e, status } : e
            )
        })),

        getFilteredExperiences: () => {
            const { experiences, filters } = get();
            return experiences.filter(exp => {
                if (filters.category && exp.category !== filters.category) return false;
                if (filters.locationId && exp.locationId !== filters.locationId) return false;
                if (filters.minGuests && exp.maxGuests < filters.minGuests) return false;
                if (filters.featured && !exp.featured) return false;
                if (filters.status && exp.status !== filters.status) return false;
                if (filters.priceRange) {
                    const hasValidPrice = exp.price.some(p =>
                        p.baseAmount >= (filters.priceRange?.min ?? 0) &&
                        p.finalAmount <= (filters.priceRange?.max ?? Infinity)
                    );
                    if (!hasValidPrice) return false;
                }
                return true;
            });
        },

        getFeaturedExperiences: () => {
            const { experiences } = get();
            return experiences.filter(e => e.featured);
        },

        getExperiencesByLocation: (locationId) => {
            const { experiences } = get();
            return experiences.filter(e => e.locationId === locationId);
        },

        getExperiencesByCategory: (category) => {
            const { experiences } = get();
            return experiences.filter(e => e.category === category);
        },

        getActiveExperiences: () => {
            const { experiences } = get();
            return experiences.filter(e =>
                !e.deletedAt &&
                e.status === Statuses.Active &&
                e.publishedStatus === PublishedStatus.ACTIVE
            );
        },

        getPricedExperiences: (min, max) => {
            const { experiences } = get();
            return experiences.filter(e =>
                e.price.some(p =>
                    p.baseAmount >= min &&
                    p.finalAmount <= max
                )
            );
        },
    }))
); 