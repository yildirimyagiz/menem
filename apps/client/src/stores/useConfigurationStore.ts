import type { Configuration } from '~/utils/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';



interface ConfigurationStore {
    configuration: Configuration | null;
    configurations: Configuration[];
    isLoading: boolean;

    setConfiguration: (configuration: Configuration) => void;
    updateConfiguration: (configuration: Partial<Configuration>) => void;
    clearConfiguration: () => void;
    setConfigurations: (configurations: Configuration[]) => void;
    addConfiguration: (configuration: Configuration) => void;
    removeConfiguration: (configId: string) => void;
    getConfigurationsByProvider: (providerId: string) => Configuration[];
    getConfigurationValue: (providerId: string, key: string) => string | undefined;
}

export const useConfigurationStore = create<ConfigurationStore>()(
    devtools((set, get) => ({
        configuration: null,
        configurations: [],
        isLoading: false,

        setConfiguration: (configuration) => set({ configuration }),
        updateConfiguration: (configUpdate) => set((state) => ({
            configuration: state.configuration ?
                { ...state.configuration, ...configUpdate } : null,
            configurations: state.configurations.map(c =>
                c.id === state.configuration?.id ? { ...c, ...configUpdate } : c
            )
        })),
        clearConfiguration: () => set({ configuration: null }),

        setConfigurations: (configurations) => set({ configurations }),
        addConfiguration: (configuration) => set((state) => ({
            configurations: [...state.configurations, configuration]
        })),
        removeConfiguration: (configId) => set((state) => ({
            configurations: state.configurations.filter(c => c.id !== configId)
        })),

        getConfigurationsByProvider: (providerId) => {
            const { configurations } = get();
            return configurations.filter(config =>
                config.paymentProviderId === providerId
            );
        },

        getConfigurationValue: (providerId, key) => {
            const { configurations } = get();
            return configurations.find(config =>
                config.paymentProviderId === providerId &&
                config.key === key
            )?.value;
        },
    }))
); 