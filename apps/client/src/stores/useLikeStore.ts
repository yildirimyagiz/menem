import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Like {
    id: string;
    cuid: string;
    listingId: string;
    userId?: string;
    count: number;
    isLiked: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface LikeStore {
    like: Like | null;
    likes: Like[];
    isLoading: boolean;

    setLike: (like: Like) => void;
    updateLike: (like: Partial<Like>) => void;
    clearLike: () => void;
    setLikes: (likes: Like[]) => void;
    toggleLike: (listingId: string, userId?: string) => void;
    incrementCount: (likeId: string) => void;
    decrementCount: (likeId: string) => void;
}

export const useLikeStore = create<LikeStore>()(
    devtools((set) => ({
        like: null,
        likes: [],
        isLoading: false,

        setLike: (like) => set({ like }),
        updateLike: (likeUpdate) => set((state) => ({
            like: state.like ? { ...state.like, ...likeUpdate } : null,
            likes: state.likes.map(l =>
                l.id === state.like?.id ? { ...l, ...likeUpdate } : l
            )
        })),
        clearLike: () => set({ like: null }),

        setLikes: (likes) => set({ likes }),

        toggleLike: (listingId, _userId) => set((state) => ({
            likes: state.likes.map(like =>
                like.listingId === listingId
                    ? {
                        ...like,
                        isLiked: !like.isLiked,
                        count: like.isLiked ? like.count - 1 : like.count + 1,
                        updatedAt: new Date()

                    }
                    : like
            )
        })),

        incrementCount: (likeId) => set((state) => ({
            likes: state.likes.map(like =>
                like.id === likeId
                    ? { ...like, count: like.count + 1 }
                    : like
            )
        })),

        decrementCount: (likeId) => set((state) => ({
            likes: state.likes.map(like =>
                like.id === likeId
                    ? { ...like, count: like.count - 1 }
                    : like
            )
        }))
    }))
); 