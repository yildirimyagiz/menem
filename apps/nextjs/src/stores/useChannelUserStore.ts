import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UserRole } from '~/utils/types';

interface ChannelUser {
    id: string;
    userId: string;
    channelId: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface ChannelUserStore {
    channelUser: ChannelUser | null;
    channelUsers: ChannelUser[];
    isLoading: boolean;
    filters: {
        role?: UserRole;
        channelId?: string;
        userId?: string;
    };

    setChannelUser: (channelUser: ChannelUser) => void;
    updateChannelUser: (channelUser: Partial<ChannelUser>) => void;
    clearChannelUser: () => void;
    setChannelUsers: (channelUsers: ChannelUser[]) => void;
    addChannelUser: (channelUser: ChannelUser) => void;
    removeChannelUser: (channelUserId: string) => void;
    setFilters: (filters: Partial<ChannelUserStore['filters']>) => void;

    getFilteredChannelUsers: () => ChannelUser[];
    getUsersByChannel: (channelId: string) => ChannelUser[];
    getChannelsByUser: (userId: string) => ChannelUser[];
    getUsersByRole: (role: UserRole) => ChannelUser[];
    getActiveChannelUsers: () => ChannelUser[];
    isUserInChannel: (userId: string, channelId: string) => boolean;
    getUserRoleInChannel: (userId: string, channelId: string) => UserRole | null;
}

export const useChannelUserStore = create<ChannelUserStore>()(
    devtools((set, get) => ({
        channelUser: null,
        channelUsers: [],
        isLoading: false,
        filters: {},

        setChannelUser: (channelUser) => set({ channelUser }),
        updateChannelUser: (channelUserUpdate) => set((state) => ({
            channelUser: state.channelUser ? { ...state.channelUser, ...channelUserUpdate } : null,
            channelUsers: state.channelUsers.map(cu =>
                cu.id === state.channelUser?.id ? { ...cu, ...channelUserUpdate } : cu
            )
        })),
        clearChannelUser: () => set({ channelUser: null }),

        setChannelUsers: (channelUsers) => set({ channelUsers }),
        addChannelUser: (channelUser) => set((state) => ({
            channelUsers: [...state.channelUsers, channelUser]
        })),
        removeChannelUser: (channelUserId) => set((state) => ({
            channelUsers: state.channelUsers.filter(cu => cu.id !== channelUserId)
        })),

        setFilters: (newFilters) => set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),

        getFilteredChannelUsers: () => {
            const { channelUsers, filters } = get();
            return channelUsers.filter(cu => {
                if (filters.role && cu.role !== filters.role) return false;
                if (filters.channelId && cu.channelId !== filters.channelId) return false;
                if (filters.userId && cu.userId !== filters.userId) return false;
                return true;
            });
        },

        getUsersByChannel: (channelId) => {
            const { channelUsers } = get();
            return channelUsers.filter(cu => cu.channelId === channelId);
        },

        getChannelsByUser: (userId) => {
            const { channelUsers } = get();
            return channelUsers.filter(cu => cu.userId === userId);
        },

        getUsersByRole: (role) => {
            const { channelUsers } = get();
            return channelUsers.filter(cu => cu.role === role);
        },

        getActiveChannelUsers: () => {
            const { channelUsers } = get();
            return channelUsers.filter(cu => !cu.deletedAt);
        },

        isUserInChannel: (userId, channelId) => {
            const { channelUsers } = get();
            return channelUsers.some(cu =>
                cu.userId === userId &&
                cu.channelId === channelId &&
                !cu.deletedAt
            );
        },

        getUserRoleInChannel: (userId, channelId) => {
            const { channelUsers } = get();
            const channelUser = channelUsers.find(cu =>
                cu.userId === userId &&
                cu.channelId === channelId &&
                !cu.deletedAt
            );
            return channelUser?.role ?? null;
        }
    }))
); 