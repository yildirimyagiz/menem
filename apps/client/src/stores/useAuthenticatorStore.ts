import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Authenticator {
    credentialID: string;
    userId: string;
    providerAccountId: string;
    credentialPublicKey: string;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface AuthenticatorStore {
    authenticator: Authenticator | null;
    authenticators: Authenticator[];
    isLoading: boolean;

    setAuthenticator: (authenticator: Authenticator) => void;
    updateAuthenticator: (authenticatorUpdate: Partial<Authenticator>) => void;
    clearAuthenticator: () => void;
    setAuthenticators: (authenticators: Authenticator[]) => void;
    addAuthenticator: (authenticator: Authenticator) => void;
    removeAuthenticator: (userId: string, credentialID: string) => void;
}

export const useAuthenticatorStore = create<AuthenticatorStore>()(
    devtools((set) => ({
        authenticator: null,
        authenticators: [],
        isLoading: false,

        setAuthenticator: (authenticator) => set({ authenticator }),
        updateAuthenticator: (authenticatorUpdate) => set((state) => ({
            authenticator: state.authenticator
                ? { ...state.authenticator, ...authenticatorUpdate }
                : null,
            authenticators: state.authenticators.map(a =>
                a.userId === state.authenticator?.userId &&
                    a.credentialID === state.authenticator.credentialID
                    ? { ...a, ...authenticatorUpdate }
                    : a
            ),
        })),
        clearAuthenticator: () => set({ authenticator: null }),

        setAuthenticators: (authenticators) => set({ authenticators }),
        addAuthenticator: (authenticator) => set((state) => ({
            authenticators: [...state.authenticators, authenticator],
        })),
        removeAuthenticator: (userId, credentialID) => set((state) => ({
            authenticators: state.authenticators.filter(
                a => !(a.userId === userId && a.credentialID === credentialID)
            ),
        })),
    }))
);
