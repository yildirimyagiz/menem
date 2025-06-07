import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SpaceRecognitionType } from '~/utils/types';

interface ImageRecognition {
    id: string;
    imageUrl: string;
    base64Hash: string;
    recognizedType: SpaceRecognitionType;
    confidence: number;
    metadata: Record<string, unknown>;
    propertyId: string;
    photoId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ImageRecognitionStore {
    recognition: ImageRecognition | null;
    recognitions: ImageRecognition[];
    isLoading: boolean;
    filters: {
        recognizedType?: SpaceRecognitionType;
        minConfidence?: number;
        propertyId?: string;
    };

    setRecognition: (recognition: ImageRecognition) => void;
    updateRecognition: (recognition: Partial<ImageRecognition>) => void;
    clearRecognition: () => void;
    setRecognitions: (recognitions: ImageRecognition[]) => void;
    addRecognition: (recognition: ImageRecognition) => void;
    removeRecognition: (recognitionId: string) => void;
    setFilters: (filters: Partial<ImageRecognitionStore['filters']>) => void;

    getFilteredRecognitions: () => ImageRecognition[];
    getByProperty: (propertyId: string) => ImageRecognition[];
    getByPhoto: (photoId: string) => ImageRecognition[];
    getByHash: (hash: string) => ImageRecognition | null;
    getHighConfidenceRecognitions: (threshold?: number) => ImageRecognition[];
    getByRecognitionType: (type: SpaceRecognitionType) => ImageRecognition[];
}

export const useImageRecognitionStore = create<ImageRecognitionStore>()(
    devtools((set, get) => ({
        recognition: null,
        recognitions: [],
        isLoading: false,
        filters: {},

        setRecognition: (recognition) => set({ recognition }),
        updateRecognition: (recognitionUpdate) => set((state) => ({
            recognition: state.recognition ? { ...state.recognition, ...recognitionUpdate } : null,
            recognitions: state.recognitions.map(r =>
                r.id === state.recognition?.id ? { ...r, ...recognitionUpdate } : r
            )
        })),
        clearRecognition: () => set({ recognition: null }),

        setRecognitions: (recognitions) => set({ recognitions }),
        addRecognition: (recognition) => set((state) => ({
            recognitions: [...state.recognitions, recognition]
        })),
        removeRecognition: (recognitionId) => set((state) => ({
            recognitions: state.recognitions.filter(r => r.id !== recognitionId)
        })),

        setFilters: (newFilters) => set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),

        getFilteredRecognitions: () => {
            const { recognitions, filters } = get();
            return recognitions.filter(recognition => {
                if (filters.recognizedType &&
                    recognition.recognizedType !== filters.recognizedType)
                    return false;
                if (filters.minConfidence &&
                    recognition.confidence < filters.minConfidence)
                    return false;
                if (filters.propertyId &&
                    recognition.propertyId !== filters.propertyId)
                    return false;
                return true;
            });
        },

        getByProperty: (propertyId) => {
            const { recognitions } = get();
            return recognitions.filter(recognition => recognition.propertyId === propertyId);
        },

        getByPhoto: (photoId) => {
            const { recognitions } = get();
            return recognitions.filter(recognition => recognition.photoId === photoId);
        },

        getByHash: (hash) => {
            const { recognitions } = get();
            return recognitions.find(recognition => recognition.base64Hash === hash) ?? null;
        },

        getHighConfidenceRecognitions: (threshold = 0.5) => {
            const { recognitions } = get();
            return recognitions.filter(recognition => recognition.confidence >= threshold);
        },

        getByRecognitionType: (type) => {
            const { recognitions } = get();
            return recognitions.filter(recognition => recognition.recognizedType === type);
        },
    }))
); 