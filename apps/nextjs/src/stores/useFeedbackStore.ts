import type { Feedback } from '~/utils/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


interface FeedbackStore {
    feedback: Feedback | null;
    feedbacks: Feedback[];
    isLoading: boolean;

    setFeedback: (feedback: Feedback) => void;
    updateFeedback: (feedback: Partial<Feedback>) => void;
    clearFeedback: () => void;
    setFeedbacks: (feedbacks: Feedback[]) => void;
    addFeedback: (feedback: Feedback) => void;
    removeFeedback: (feedbackId: string) => void;
    getFeedbacksByUser: (userId: string) => Feedback[];
    getAverageRating: () => number;
}

export const useFeedbackStore = create<FeedbackStore>()(
    devtools((set, get) => ({
        feedback: null,
        feedbacks: [],
        isLoading: false,

        setFeedback: (feedback) => set({ feedback }),
        updateFeedback: (feedbackUpdate) => set((state) => ({
            feedback: state.feedback ? { ...state.feedback, ...feedbackUpdate } : null,
            feedbacks: state.feedbacks.map(f =>
                f.id === state.feedback?.id ? { ...f, ...feedbackUpdate } : f
            )
        })),
        clearFeedback: () => set({ feedback: null }),

        setFeedbacks: (feedbacks) => set({ feedbacks }),
        addFeedback: (feedback) => set((state) => ({
            feedbacks: [...state.feedbacks, feedback]
        })),
        removeFeedback: (feedbackId) => set((state) => ({
            feedbacks: state.feedbacks.filter(f => f.id !== feedbackId)
        })),

        getFeedbacksByUser: (userId) => {
            const { feedbacks } = get();
            return feedbacks.filter(f => f.userId === userId);
        },

        getAverageRating: () => {
            const { feedbacks } = get();
            if (feedbacks.length === 0) return 0;
            const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
            return sum / feedbacks.length;
        }
    }))
); 