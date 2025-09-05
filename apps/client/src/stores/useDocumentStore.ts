import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Document {
    id: string;
    cuid: string;
    url: string;
    carId?: string;
    propertyId?: string;
    hotelId?: string;
    userId?: string;
    agencyId?: string;
    agentId?: string;
    taskId?: string;
    FacilityId?: string;
    listingId?: string;
    reservationId?: string;
    messageId?: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface DocumentStore {
    document: Document | null;
    documents: Document[];
    isLoading: boolean;
    filters: {
        entityType?: 'car' | 'property' | 'hotel' | 'listing' | 'reservation';
        entityId?: string;
        userId?: string;
    };

    setDocument: (document: Document) => void;
    updateDocument: (document: Partial<Document>) => void;
    clearDocument: () => void;
    setDocuments: (documents: Document[]) => void;
    addDocument: (document: Document) => void;
    removeDocument: (documentId: string) => void;
    setFilters: (filters: Partial<DocumentStore['filters']>) => void;

    getFilteredDocuments: () => Document[];
    getDocumentsByEntity: (entityType: string, entityId: string) => Document[];
    getDocumentsByUser: (userId: string) => Document[];
    getActiveDocuments: () => Document[];
    searchDocumentsByUrl: (query: string) => Document[];
}

export const useDocumentStore = create<DocumentStore>()(
    devtools((set, get) => ({
        document: null,
        documents: [],
        isLoading: false,
        filters: {},

        setDocument: (document) => set({ document }),
        updateDocument: (documentUpdate) => set((state) => ({
            document: state.document ? { ...state.document, ...documentUpdate } : null,
            documents: state.documents.map(d =>
                d.id === state.document?.id ? { ...d, ...documentUpdate } : d
            )
        })),
        clearDocument: () => set({ document: null }),

        setDocuments: (documents) => set({ documents }),
        addDocument: (document) => set((state) => ({
            documents: [...state.documents, document]
        })),
        removeDocument: (documentId) => set((state) => ({
            documents: state.documents.filter(d => d.id !== documentId)
        })),

        setFilters: (newFilters) => set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),

        getFilteredDocuments: () => {
            const { documents, filters } = get();
            return documents.filter(doc => {
                if (filters.entityType && filters.entityId) {
                    switch (filters.entityType) {
                        case 'car': return doc.carId === filters.entityId;
                        case 'property': return doc.propertyId === filters.entityId;
                        case 'hotel': return doc.hotelId === filters.entityId;
                        case 'listing': return doc.listingId === filters.entityId;
                        case 'reservation': return doc.reservationId === filters.entityId;
                    }
                }
                if (filters.userId && doc.userId !== filters.userId) return false;
                return true;
            });
        },

        getDocumentsByEntity: (entityType, entityId) => {
            const { documents } = get();
            return documents.filter(doc => {
                switch (entityType) {
                    case 'car': return doc.carId === entityId;
                    case 'property': return doc.propertyId === entityId;
                    case 'hotel': return doc.hotelId === entityId;
                    case 'listing': return doc.listingId === entityId;
                    case 'reservation': return doc.reservationId === entityId;
                    default: return false;
                }
            });
        },

        getDocumentsByUser: (userId) => {
            const { documents } = get();
            return documents.filter(d => d.userId === userId);
        },

        getActiveDocuments: () => {
            const { documents } = get();
            return documents.filter(d => !d.deletedAt);
        },

        searchDocumentsByUrl: (query) => {
            const { documents } = get();
            const searchTerm = query.toLowerCase();
            return documents.filter(d =>
                d.url.toLowerCase().includes(searchTerm)
            );
        }
    }))
);