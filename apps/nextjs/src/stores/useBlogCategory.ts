import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BlogCategory {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface BlogCategoryStore {
    blogCategory: BlogCategory | null;
    blogCategories: BlogCategory[];
    isLoading: boolean;

    setBlogCategory: (blogCategory: BlogCategory) => void;
    updateBlogCategory: (blogCategoryUpdate: Partial<BlogCategory>) => void;
    clearBlogCategory: () => void;
    setBlogCategories: (blogCategories: BlogCategory[]) => void;
    addBlogCategory: (blogCategory: BlogCategory) => void;
    removeBlogCategory: (blogCategoryId: string) => void;
}

export const useBlogCategoryStore = create<BlogCategoryStore>()(
    devtools((set) => ({
        blogCategory: null,
        blogCategories: [],
        isLoading: false,

        setBlogCategory: (blogCategory) => set({ blogCategory }),
        updateBlogCategory: (blogCategoryUpdate) => set((state) => ({
            blogCategory: state.blogCategory
                ? { ...state.blogCategory, ...blogCategoryUpdate }
                : null,
            blogCategories: state.blogCategories.map((bc) =>
                bc.id === state.blogCategory?.id
                    ? { ...bc, ...blogCategoryUpdate }
                    : bc
            ),
        })),
        clearBlogCategory: () => set({ blogCategory: null }),

        setBlogCategories: (blogCategories) => set({ blogCategories }),
        addBlogCategory: (blogCategory) => set((state) => ({
            blogCategories: [...state.blogCategories, blogCategory],
        })),
        removeBlogCategory: (blogCategoryId) => set((state) => ({
            blogCategories: state.blogCategories.filter((bc) => bc.id !== blogCategoryId),
        })),
    }))
);
