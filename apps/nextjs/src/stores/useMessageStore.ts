import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Message {
    id: string;
    cuid: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: Date;
    readAt?: Date;
    updatedAt: Date;
    seenAt?: Date;
    deletedAt?: Date;
    listingId?: string;
    carId?: string;
    paymentId?: string;
    taskId?: string;
    reservationId?: string;
    experienceId?: string;
    channelId?: string;
    helpId?: string;
    documents: Document[];
}

interface MessageStore {
    message: Message | null;
    messages: Message[];
    isLoading: boolean;

    setMessage: (message: Message) => void;
    updateMessage: (messageUpdate: Partial<Message>) => void;
    clearMessage: () => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    removeMessage: (messageId: string) => void;
}

export const useMessageStore = create<MessageStore>()(
    devtools((set) => ({
        message: null,
        messages: [],
        isLoading: false,

        setMessage: (message) => set({ message }),
        updateMessage: (messageUpdate) => set((state) => ({
            message: state.message
                ? { ...state.message, ...messageUpdate }
                : null,
            messages: state.messages.map((msg) =>
                msg.id === state.message?.id ? { ...msg, ...messageUpdate } : msg
            ),
        })),
        clearMessage: () => set({ message: null }),

        setMessages: (messages) => set({ messages }),
        addMessage: (message) => set((state) => ({
            messages: [...state.messages, message],
        })),
        removeMessage: (messageId) => set((state) => ({
            messages: state.messages.filter((msg) => msg.id !== messageId),
        })),
    }))
);
