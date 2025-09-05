import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Mention {
    id: string;
    cuid: string;
    userId: string;
    mentionedUserId: string;
    contentType: string;
    contentId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    messageId?: string;
}

interface MentionStore {
    mention: Mention | null;
    mentions: Mention[];
    isLoading: boolean;

    setMention: (mention: Mention) => void;
    updateMention: (mentionUpdate: Partial<Mention>) => void;
    clearMention: () => void;
    setMentions: (mentions: Mention[]) => void;
    addMention: (mention: Mention) => void;
    removeMention: (mentionId: string) => void;
}

export const useMentionStore = create<MentionStore>()(
    devtools((set) => ({
        mention: null,
        mentions: [],
        isLoading: false,

        setMention: (mention) => set({ mention }),
        updateMention: (mentionUpdate) => set((state) => ({
            mention: state.mention
                ? { ...state.mention, ...mentionUpdate }
                : null,
            mentions: state.mentions.map((m) =>
                m.id === state.mention?.id ? { ...m, ...mentionUpdate } : m
            ),
        })),
        clearMention: () => set({ mention: null }),

        setMentions: (mentions) => set({ mentions }),
        addMention: (mention) => set((state) => ({
            mentions: [...state.mentions, mention],
        })),
        removeMention: (mentionId) => set((state) => ({
            mentions: state.mentions.filter((m) => m.id !== mentionId),
        })),
    }))
);
