import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Hashtag {
    id: string;
    cuid: string;
    name: string;
    contentType: string;
    contentId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface HashtagStore {
    hashtag: Hashtag | null;
    hashtags: Hashtag[];
    isLoading: boolean;

    setHashtag: (hashtag: Hashtag) => void;
    updateHashtag: (hashtag: Partial<Hashtag>) => void;
    clearHashtag: () => void;
    setHashtags: (hashtags: Hashtag[]) => void;
    addHashtag: (hashtag: Hashtag) => void;
    removeHashtag: (hashtagId: string) => void;

    getHashtagsByContent: (contentType: string, contentId: string) => Hashtag[];
    getHashtagsByName: (name: string) => Hashtag[];
    getTrendingHashtags: (limit?: number) => { name: string; count: number }[];
}

export const useHashtagStore = create<HashtagStore>()(
    devtools((set, get) => ({
        hashtag: null,
        hashtags: [],
        isLoading: false,

        setHashtag: (hashtag) => set({ hashtag }),
        updateHashtag: (hashtagUpdate) => set((state) => ({
            hashtag: state.hashtag ? { ...state.hashtag, ...hashtagUpdate } : null,
            hashtags: state.hashtags.map(h =>
                h.id === state.hashtag?.id ? { ...h, ...hashtagUpdate } : h
            )
        })),
        clearHashtag: () => set({ hashtag: null }),

        setHashtags: (hashtags) => set({ hashtags }),
        addHashtag: (hashtag) => set((state) => ({
            hashtags: [...state.hashtags, hashtag]
        })),
        removeHashtag: (hashtagId) => set((state) => ({
            hashtags: state.hashtags.filter(h => h.id !== hashtagId)
        })),

        getHashtagsByContent: (contentType, contentId) => {
            const { hashtags } = get();
            return hashtags.filter(h =>
                h.contentType === contentType &&
                h.contentId === contentId
            );
        },

        getHashtagsByName: (name) => {
            const { hashtags } = get();
            return hashtags.filter(h =>
                h.name.toLowerCase().includes(name.toLowerCase())
            );
        },

        getTrendingHashtags: (limit = 10) => {
            const { hashtags } = get();
            const hashtagCounts = hashtags.reduce((acc, hashtag) => {
                acc[hashtag.name] = (acc[hashtag.name] ?? 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            return Object.entries(hashtagCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, limit);
        }
    }))
); 