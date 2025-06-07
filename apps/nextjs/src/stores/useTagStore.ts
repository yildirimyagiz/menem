import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Tag {
    id: string;
    cuid: string;
    name: string;
    blogId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface TagStore {
    tag: Tag | null;
    tags: Tag[];
    isLoading: boolean;

    setTag: (tag: Tag) => void;
    updateTag: (tag: Partial<Tag>) => void;
    clearTag: () => void;
    setTags: (tags: Tag[]) => void;
    addTag: (tag: Tag) => void;
    removeTag: (tagId: string) => void;

    getTagsByBlog: (blogId: string) => Tag[];
    searchTags: (query: string) => Tag[];
    getActiveTags: () => Tag[];
    getPopularTags: (limit?: number) => Tag[];
}

export const useTagStore = create<TagStore>()(
    devtools((set, get) => ({
        tag: null,
        tags: [],
        isLoading: false,

        setTag: (tag) => set({ tag }),
        updateTag: (tagUpdate) => set((state) => ({
            tag: state.tag ? { ...state.tag, ...tagUpdate } : null,
            tags: state.tags.map(t =>
                t.id === state.tag?.id ? { ...t, ...tagUpdate } : t
            )
        })),
        clearTag: () => set({ tag: null }),

        setTags: (tags) => set({ tags }),
        addTag: (tag) => set((state) => ({
            tags: [...state.tags, tag]
        })),
        removeTag: (tagId) => set((state) => ({
            tags: state.tags.filter(t => t.id !== tagId)
        })),

        getTagsByBlog: (blogId) => {
            const { tags } = get();
            return tags.filter(t => t.blogId === blogId);
        },

        searchTags: (query) => {
            const { tags } = get();
            const searchTerm = query.toLowerCase();
            return tags.filter(t =>
                t.name.toLowerCase().includes(searchTerm)
            );
        },

        getActiveTags: () => {
            const { tags } = get();
            return tags.filter(t => !t.deletedAt);
        },

        getPopularTags: (limit = 10) => {
            const { tags } = get();
            // In a real application, you might want to track usage count
            // This is a simplified version that just returns active tags
            return tags
                .filter(t => !t.deletedAt)
                .slice(0, limit);
        }
    }))
); 