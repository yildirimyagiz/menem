import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserFavorite {
  id: string;
  userId: string;
  listingId: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface UserFavoriteStore {
  userFavorite: UserFavorite | null;
  userFavorites: UserFavorite[];
  isLoading: boolean;

  setUserFavorite: (favorite: UserFavorite) => void;
  updateUserFavorite: (favoriteUpdate: Partial<UserFavorite>) => void;
  clearUserFavorite: () => void;
  setUserFavorites: (favorites: UserFavorite[]) => void;
  addUserFavorite: (favorite: UserFavorite) => void;
  removeUserFavorite: (userId: string, listingId: string) => void;
  toggleFavorite: (listingId: string) => void;
}

export const useUserFavoriteStore = create<UserFavoriteStore>()(
  devtools((set, get) => ({
    userFavorite: null,
    userFavorites: [],
    isLoading: false,

    setUserFavorite: (favorite) => set({ userFavorite: favorite }),
    updateUserFavorite: (favoriteUpdate) =>
      set((state) => ({
        userFavorite: state.userFavorite
          ? { ...state.userFavorite, ...favoriteUpdate }
          : null,
        userFavorites: state.userFavorites.map((f) =>
          f.userId === state.userFavorite?.userId &&
          f.listingId === state.userFavorite.listingId
            ? { ...f, ...favoriteUpdate }
            : f,
        ),
      })),
    clearUserFavorite: () => set({ userFavorite: null }),

    setUserFavorites: (favorites) => set({ userFavorites: favorites }),
    addUserFavorite: (favorite) =>
      set((state) => ({
        userFavorites: [...state.userFavorites, favorite],
      })),
    removeUserFavorite: (userId, listingId) =>
      set((state) => ({
        userFavorites: state.userFavorites.filter(
          (f) => !(f.userId === userId && f.listingId === listingId),
        ),
      })),
    toggleFavorite: (listingId: string) => {
      const state = get();
      const existingFavorite = state.userFavorites.find(
        (f) => f.listingId === listingId,
      );

      if (existingFavorite) {
        // Toggle the favorite status
        set((state) => ({
          userFavorites: state.userFavorites.map((f) =>
            f.listingId === listingId ? { ...f, isFavorite: !f.isFavorite } : f,
          ),
        }));
      } else {
        // Add new favorite (assuming we have user context)
        // This would typically require user ID from auth context
        console.warn(
          "Toggle favorite called but no existing favorite found. User context may be missing.",
        );
      }
    },
  })),
);
