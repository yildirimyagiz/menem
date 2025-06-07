import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '~/utils/types';

interface Token {
    id: string;
    value: string;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    user?: User; // Use appropriate type for User
}

interface TokenStore {
    token: Token | null;
    tokens: Token[];
    isLoading: boolean;

    setToken: (token: Token) => void;
    updateToken: (tokenUpdate: Partial<Token>) => void;
    clearToken: () => void;
    setTokens: (tokens: Token[]) => void;
    addToken: (token: Token) => void;
    removeToken: (tokenId: string) => void;
}

export const useTokenStore = create<TokenStore>()(
    devtools((set) => ({
        token: null,
        tokens: [],
        isLoading: false,

        setToken: (token) => set({ token }),
        updateToken: (tokenUpdate) => set((state) => ({
            token: state.token
                ? { ...state.token, ...tokenUpdate }
                : null,
            tokens: state.tokens.map((t) =>
                t.id === state.token?.id ? { ...t, ...tokenUpdate } : t
            ),
        })),
        clearToken: () => set({ token: null }),

        setTokens: (tokens) => set({ tokens }),
        addToken: (token) => set((state) => ({
            tokens: [...state.tokens, token],
        })),
        removeToken: (tokenId) => set((state) => ({
            tokens: state.tokens.filter((t) => t.id !== tokenId),
        })),
    }))
);
