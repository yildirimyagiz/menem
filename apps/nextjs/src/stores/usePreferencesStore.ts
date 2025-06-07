import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '~/utils/types';
interface Preferences {
    id: string;
    userId: string;
    theme?: string; // Or the appropriate enum type for theme
    language?: string; // Or the appropriate enum type for language
    notificationPrefs?: Record<string, unknown>;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: string;
    privacySettings?: Record<string, unknown>;
    displaySettings?: Record<string, unknown>;
    emailSubscriptions?: Record<string, unknown>;
    currency?: string; // Or the appropriate enum type for currency
    marketingPreferences?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    user?: User; // Use the appropriate type for User
}

interface PreferencesStore {
    preferences: Preferences | null;
    preferencesList: Preferences[];
    isLoading: boolean;

    setPreferences: (preferences: Preferences) => void;
    updatePreferences: (preferencesUpdate: Partial<Preferences>) => void;
    clearPreferences: () => void;
    setPreferencesList: (preferencesList: Preferences[]) => void;
    addPreferences: (preferences: Preferences) => void;
    removePreferences: (preferencesId: string) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
    devtools((set) => ({
        preferences: null,
        preferencesList: [],
        isLoading: false,

        setPreferences: (preferences) => set({ preferences }),
        updatePreferences: (preferencesUpdate) => set((state) => ({
            preferences: state.preferences
                ? { ...state.preferences, ...preferencesUpdate }
                : null,
            preferencesList: state.preferencesList.map((p) =>
                p.id === state.preferences?.id ? { ...p, ...preferencesUpdate } : p
            ),
        })),
        clearPreferences: () => set({ preferences: null }),

        setPreferencesList: (preferencesList) => set({ preferencesList }),
        addPreferences: (preferences) => set((state) => ({
            preferencesList: [...state.preferencesList, preferences],
        })),
        removePreferences: (preferencesId) => set((state) => ({
            preferencesList: state.preferencesList.filter((p) => p.id !== preferencesId),
        })),
    }))
);
