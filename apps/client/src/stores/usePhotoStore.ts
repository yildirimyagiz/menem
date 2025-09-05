import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { PhotoFormat } from "~/utils/types";

interface Photo {
  id: string;
  cuid: string;
  url: string;
  caption: string;
  width: number;
  height: number;
  format: PhotoFormat;
  metadata?: Record<string, unknown>;
  image: string;
  slug: string;
  carId?: string;
  propertyId?: string;
  hotelId?: string;
  userId?: string;
  agencyId?: string;
  agentId?: string;
  taskId?: string;
  facilityId?: string;
  listingId?: string;
  blogId?: string;
  reservationId?: string;
  experienceId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface PhotoStore {
  photo: Photo | null;
  photos: Photo[];
  isLoading: boolean;

  setPhoto: (photo: Photo) => void;
  updatePhoto: (photo: Partial<Photo>) => void;
  clearPhoto: () => void;
  setPhotos: (photos: Photo[]) => void;
  addPhoto: (photo: Photo) => void;
  removePhoto: (photoId: string) => void;
  getPhotosByEntity: (entityType: string, entityId: string) => Photo[];
}

export const usePhotoStore = create<PhotoStore>()(
  devtools((set, get) => ({
    photo: null,
    photos: [],
    isLoading: false,

    setPhoto: (photo) => set({ photo }),
    updatePhoto: (photoUpdate) =>
      set((state) => ({
        photo: state.photo ? { ...state.photo, ...photoUpdate } : null,
        photos: state.photos.map((p) =>
          p.id === state.photo?.id ? { ...p, ...photoUpdate } : p,
        ),
      })),
    clearPhoto: () => set({ photo: null }),

    setPhotos: (photos) => set({ photos }),

    addPhoto: (photo) =>
      set((state) => ({
        photos: [...state.photos, photo],
      })),

    removePhoto: (photoId) =>
      set((state) => ({
        photos: state.photos.filter((photo) => photo.id !== photoId),
      })),
    getPhotosByEntity: (entityType: string, entityId: string) => {
      return get().photos.filter((photo) => {
        const entityIdKey = (entityType + "Id") as keyof Photo;
        return (
          Object.prototype.hasOwnProperty.call(photo, entityIdKey) &&
          photo[entityIdKey] === entityId
        );
      });
    },
  })),
);
