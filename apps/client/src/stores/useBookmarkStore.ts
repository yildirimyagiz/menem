import type { Bookmark } from '~/utils/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


interface BookmarkStore {
    bookmark: Bookmark | null;
    bookmarks: Bookmark[];
    isLoading: boolean;

    setBookmark: (bookmark: Bookmark) => void;
    updateBookmark: (bookmarkUpdate: Partial<Bookmark>) => void;
    clearBookmark: () => void;
    setBookmarks: (bookmarks: Bookmark[]) => void;
    addBookmark: (bookmark: Bookmark) => void;
    removeBookmark: (bookmarkId: string) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
    devtools((set) => ({
        bookmark: null,
        bookmarks: [],
        isLoading: false,

        setBookmark: (bookmark) => set({ bookmark }),
        updateBookmark: (bookmarkUpdate) => set((state) => ({
            bookmark: state.bookmark
                ? { ...state.bookmark, ...bookmarkUpdate }
                : null,
            bookmarks: state.bookmarks.map((b) =>
                b.id === state.bookmark?.id ? { ...b, ...bookmarkUpdate } : b
            ),
        })),
        clearBookmark: () => set({ bookmark: null }),

        setBookmarks: (bookmarks) => set({ bookmarks }),
        addBookmark: (bookmark) => set((state) => ({
            bookmarks: [...state.bookmarks, bookmark],
        })),
        removeBookmark: (bookmarkId) => set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId),
        })),
    }))
);
