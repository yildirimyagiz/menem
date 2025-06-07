import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Membership {
    id: string;
    userId: string;
    accountType: string;
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    MembershipNumber?: number;
}

interface MembershipStore {
    membership: Membership | null;
    memberships: Membership[];
    isLoading: boolean;

    setMembership: (membership: Membership) => void;
    updateMembership: (membershipUpdate: Partial<Membership>) => void;
    clearMembership: () => void;
    setMemberships: (memberships: Membership[]) => void;
    addMembership: (membership: Membership) => void;
    removeMembership: (membershipId: string) => void;
}

export const useMembershipStore = create<MembershipStore>()(
    devtools((set) => ({
        membership: null,
        memberships: [],
        isLoading: false,

        setMembership: (membership) => set({ membership }),
        updateMembership: (membershipUpdate) => set((state) => ({
            membership: state.membership ? { ...state.membership, ...membershipUpdate } : null,
            memberships: state.memberships.map(m =>
                m.id === state.membership?.id ? { ...m, ...membershipUpdate } : m
            ),
        })),
        clearMembership: () => set({ membership: null }),

        setMemberships: (memberships) => set({ memberships }),
        addMembership: (membership) => set((state) => ({
            memberships: [...state.memberships, membership],
        })),
        removeMembership: (membershipId) => set((state) => ({
            memberships: state.memberships.filter(m => m.id !== membershipId),
        })),
    }))
);
