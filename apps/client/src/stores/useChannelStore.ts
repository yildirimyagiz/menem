import type { Channel } from '~/utils/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';



interface ChannelStore {
    channel: Channel | null;
    channels: Channel[];
    isLoading: boolean;
    searchQuery: string;

    setChannel: (channel: Channel) => void;
    updateChannel: (channel: Partial<Channel>) => void;
    clearChannel: () => void;
    setChannels: (channels: Channel[]) => void;
    addChannel: (channel: Channel) => void;
    removeChannel: (channelId: string) => void;
    setSearchQuery: (query: string) => void;

    getActiveChannels: () => Channel[];
    searchChannels: () => Channel[];
    getChannelByName: (name: string) => Channel | null;
    getRecentChannels: (limit?: number) => Channel[];
    getDeletedChannels: () => Channel[];
}

export const useChannelStore = create<ChannelStore>()(
    devtools((set, get) => ({
        channel: null,
        channels: [],
        isLoading: false,
        searchQuery: '',

        setChannel: (channel) => set({ channel }),
        updateChannel: (channelUpdate) => set((state) => ({
            channel: state.channel ? { ...state.channel, ...channelUpdate } : null,
            channels: state.channels.map(c =>
                c.id === state.channel?.id ? { ...c, ...channelUpdate } : c
            )
        })),
        clearChannel: () => set({ channel: null }),

        setChannels: (channels) => set({ channels }),
        addChannel: (channel) => set((state) => ({
            channels: [...state.channels, channel]
        })),
        removeChannel: (channelId) => set((state) => ({
            channels: state.channels.filter(c => c.id !== channelId)
        })),

        setSearchQuery: (query) => set({ searchQuery: query }),

        getActiveChannels: () => {
            const { channels } = get();
            return channels.filter(c => !c.deletedAt);
        },

        searchChannels: () => {
            const { channels, searchQuery } = get();
            if (!searchQuery) return channels;

            const query = searchQuery.toLowerCase();
            return channels.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.description?.toLowerCase().includes(query)
            );
        },

        getChannelByName: (name) => {
            const { channels } = get();
            return channels.find(c =>
                c.name.toLowerCase() === name.toLowerCase()
            ) ?? null;
        },

        getRecentChannels: (limit = 5) => {
            const { channels } = get();
            return [...channels]
                .sort((a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                )
                .slice(0, limit);
        },

        getDeletedChannels: () => {
            const { channels } = get();
            return channels.filter(c => c.deletedAt);
        }
    }))
); 