import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MegaMenu {
    id: string;
    appName: string;
    carModel: string;
    city: string;
    company: string;
    construction: string;
    corporate: string;
    country: string;
    department: string;
}

interface MegaMenuStore {
    megaMenu: MegaMenu | null;
    megaMenus: MegaMenu[];
    isLoading: boolean;

    setMegaMenu: (menu: MegaMenu) => void;
    updateMegaMenu: (menuUpdate: Partial<MegaMenu>) => void;
    clearMegaMenu: () => void;
    setMegaMenus: (menus: MegaMenu[]) => void;
    addMegaMenu: (menu: MegaMenu) => void;
    removeMegaMenu: (menuId: string) => void;
}

export const useMegaMenuStore = create<MegaMenuStore>()(
    devtools((set) => ({
        megaMenu: null,
        megaMenus: [],
        isLoading: false,

        setMegaMenu: (menu) => set({ megaMenu: menu }),
        updateMegaMenu: (menuUpdate) => set((state) => ({
            megaMenu: state.megaMenu ? { ...state.megaMenu, ...menuUpdate } : null,
            megaMenus: state.megaMenus.map(m =>
                m.id === state.megaMenu?.id ? { ...m, ...menuUpdate } : m
            ),
        })),
        clearMegaMenu: () => set({ megaMenu: null }),

        setMegaMenus: (menus) => set({ megaMenus: menus }),
        addMegaMenu: (menu) => set((state) => ({ megaMenus: [...state.megaMenus, menu] })),
        removeMegaMenu: (menuId) => set((state) => ({
            megaMenus: state.megaMenus.filter(m => m.id !== menuId),
        })),
    }))
);
