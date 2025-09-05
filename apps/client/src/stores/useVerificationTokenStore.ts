import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface VerificationToken {
    identifier: string;
    token: string;
    expires: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface VerificationTokenStore {
    verificationToken: VerificationToken | null;
    verificationTokens: VerificationToken[];
    isLoading: boolean;

    setVerificationToken: (token: VerificationToken) => void;
    updateVerificationToken: (tokenUpdate: Partial<VerificationToken>) => void;
    clearVerificationToken: () => void;
    setVerificationTokens: (tokens: VerificationToken[]) => void;
    addVerificationToken: (token: VerificationToken) => void;
    removeVerificationToken: (identifier: string, token: string) => void;
}

export const useVerificationTokenStore = create<VerificationTokenStore>()(
    devtools((set) => ({
        verificationToken: null,
        verificationTokens: [],
        isLoading: false,

        setVerificationToken: (token) => set({ verificationToken: token }),
        updateVerificationToken: (tokenUpdate) => set((state) => ({
            verificationToken: state.verificationToken
                ? { ...state.verificationToken, ...tokenUpdate }
                : null,
            verificationTokens: state.verificationTokens.map(t =>
                t.identifier === state.verificationToken?.identifier &&
                    t.token === state.verificationToken.token
                    ? { ...t, ...tokenUpdate }
                    : t
            ),
        })),
        clearVerificationToken: () => set({ verificationToken: null }),

        setVerificationTokens: (tokens) => set({ verificationTokens: tokens }),
        addVerificationToken: (token) => set((state) => ({
            verificationTokens: [...state.verificationTokens, token],
        })),
        removeVerificationToken: (identifier, token) => set((state) => ({
            verificationTokens: state.verificationTokens.filter(
                t => !(t.identifier === identifier && t.token === token)
            ),
        })),
    }))
);
