import type { Blog, BlogCategory, Bookmark } from '~/utils/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';



interface BlogStore {
    // State
    blog: Blog | null;
    blogs: Blog[];
    categories: BlogCategory[];
    bookmarks: Bookmark[];
    isLoading: boolean;

    // Blog actions
    setBlog: (blog: Blog) => void;
    updateBlog: (blog: Partial<Blog>) => void;
    clearBlog: () => void;
    setBlogs: (blogs: Blog[]) => void;
    addBlog: (blog: Blog) => void;
    removeBlog: (blogId: string) => void;
    incrementViewCount: (blogId: string) => void;
    incrementCommentCount: (blogId: string) => void;

    // Category actions
    setCategories: (categories: BlogCategory[]) => void;
    addCategory: (category: BlogCategory) => void;
    removeCategory: (categoryId: string) => void;
    updateCategory: (categoryId: string, data: Partial<BlogCategory>) => void;

    // Bookmark actions
    setBookmarks: (bookmarks: Bookmark[]) => void;
    toggleBookmark: (blogId: string) => void;
    addBookmark: (bookmark: Bookmark) => void;
    removeBookmark: (bookmarkId: string) => void;
}

// Create store
export const useBlogStore = create<BlogStore>()(
    devtools((set) => ({
        // Initial state
        blog: null,
        blogs: [],
        categories: [],
        bookmarks: [],
        isLoading: false,

        // Blog actions
        setBlog: (blog) => set({ blog }),
        updateBlog: (blogUpdate) => set((state) => ({
            blog: state.blog ? { ...state.blog, ...blogUpdate } : null,
            blogs: state.blogs.map(b =>
                b.id === state.blog?.id ? { ...b, ...blogUpdate } : b
            )
        })),
        clearBlog: () => set({ blog: null }),

        setBlogs: (blogs) => set({ blogs }),
        addBlog: (blog) => set((state) => ({
            blogs: [...state.blogs, blog]
        })),
        removeBlog: (blogId) => set((state) => ({
            blogs: state.blogs.filter(b => b.id !== blogId)
        })),

        incrementViewCount: (blogId) => set((state) => ({
            blogs: state.blogs.map(b =>
                b.id === blogId
                    ? { ...b, viewCount: b.viewCount + 1 }
                    : b
            )
        })),

        incrementCommentCount: (blogId) => set((state) => ({
            blogs: state.blogs.map(b =>
                b.id === blogId
                    ? { ...b, commentCount: b.commentCount + 1 }
                    : b
            )
        })),

        // Category actions
        setCategories: (categories) => set({ categories }),
        addCategory: (category) => set((state) => ({
            categories: [...state.categories, category]
        })),
        removeCategory: (categoryId) => set((state) => ({
            categories: state.categories.filter(c => c.id !== categoryId)
        })),
        updateCategory: (categoryId, data) => set((state) => ({
            categories: state.categories.map(c =>
                c.id === categoryId ? { ...c, ...data } : c
            )
        })),

        // Bookmark actions
        setBookmarks: (bookmarks) => set({ bookmarks }),
        toggleBookmark: (blogId) => set((state) => ({
            bookmarks: state.bookmarks.map(b =>
                b.blogId === blogId
                    ? {
                        ...b,
                        isBookmarked: !b.isBookmarked,
                        count: b.isBookmarked ? b.count - 1 : b.count + 1,
                        updatedAt: new Date()
                    }
                    : b
            )
        })),
        addBookmark: (bookmark) => set((state) => ({
            bookmarks: [...state.bookmarks, bookmark]
        })),
        removeBookmark: (bookmarkId) => set((state) => ({
            bookmarks: state.bookmarks.filter(b => b.id !== bookmarkId)
        })),
    }))
); 