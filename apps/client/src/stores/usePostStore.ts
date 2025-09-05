import type { RouterOutputs } from "@reservatior/api";
import { create } from "zustand";

// Store için tipler
interface PostState {
    posts: RouterOutputs["post"]["all"]; // Post verileri
    isLoading: boolean; // Yükleniyor durumu
    setPosts: (posts: RouterOutputs["post"]["all"]) => void; // Postları güncelleme fonksiyonu
    setLoading: (loading: boolean) => void; // Yükleniyor durumunu güncelleme fonksiyonu
    addPost: (newPost: RouterOutputs["post"]["all"][0]) => void; // Yeni post ekleme fonksiyonu
}

export const usePostStore = create<PostState>((set) => ({
    posts: [],
    isLoading: false,
    setPosts: (posts: RouterOutputs["post"]["all"]) => set({ posts }),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    addPost: (newPost: RouterOutputs["post"]["all"][0]) => set((state) => ({
        posts: [...state.posts, newPost] // Yeni post ekle
    })),
}));
