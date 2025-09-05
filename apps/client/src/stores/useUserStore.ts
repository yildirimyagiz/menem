import type { Gender, Language, UserPermission, UserRole } from "~/utils/types";
import { Statuses } from "~/utils/types";
import { createBaseStore } from "./createBaseStore";

// Define the User interface
interface User {
  id: string;
  cuid: string;
  userName?: string;
  name?: string;
  type: UserRole;
  image?: string;
  bgImage?: string;
  email?: string;
  emailVerified?: Date;
  password?: string;
  status: Statuses;
  language: Language[];
  phone?: string;
  count: number;
  href?: string;
  jobName?: string;
  bio?: string;
  gender?: Gender;
  birthday?: Date;
  starRating?: number;
  slug?: string;
  lastActiveAt?: Date;
  permissions: UserPermission[];
  locationId?: string;
  locationCoordinates?: Record<string, unknown>;
  offerId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lastLoginAt?: Date;
  token?: string;
  insuranceId?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  socialMedia?: Record<string, unknown>;
}

interface SerializedUser
  extends Omit<
    User,
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
    | "lastLoginAt"
    | "birthday"
    | "emailVerified"
    | "resetTokenExpiry"
  > {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  lastLoginAt?: string;
  birthday?: string;
  emailVerified?: string;
  resetTokenExpiry?: string;
}

// Create the base store first
const baseStore = createBaseStore<User>({
  name: "user-store",
  persist: true,
  version: 1,
  logging: {
    enabled: true,
    level: "debug",
  },
  cache: {
    ttl: 1000 * 60 * 5,
    maxSize: 100,
  },
  transformers: {
    serialize: (user: User): SerializedUser => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      deletedAt: user.deletedAt?.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
      birthday: user.birthday?.toISOString(),
      emailVerified: user.emailVerified?.toISOString(),
      resetTokenExpiry: user.resetTokenExpiry?.toISOString(),
    }),
    deserialize: (data: SerializedUser): User => ({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      deletedAt: data.deletedAt ? new Date(data.deletedAt) : undefined,
      lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : undefined,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
      emailVerified: data.emailVerified
        ? new Date(data.emailVerified)
        : undefined,
      resetTokenExpiry: data.resetTokenExpiry
        ? new Date(data.resetTokenExpiry)
        : undefined,
    }),
  },
});

// Extend the base store with additional functionality
const useUserStore = () => {
  const store = baseStore();

  return {
    ...store,
    updateUser: (user: User, _options: { type: "update" }) => {
      // First get the current items
      const currentItems = store.items;
      // Create new array with updated user
      const updatedItems = currentItems.map((item) =>
        item.id === user.id ? user : item,
      );
      // Update items
      store.setItems(updatedItems);

      // Update current item if it matches
      if (store.data?.id === user.id) {
        store.setItem(user);
      }
    },
  };
};

// Create custom hooks using the extended store
export const useUsers = () => {
  const store = useUserStore();

  return {
    // Basic state
    user: store.data,
    users: store.items,
    isLoading: store.isLoading,
    error: store.error,

    // Basic actions (inherited from base store)
    setUser: store.setItem,
    updateUser: store.updateUser,
    clearUser: store.clearItem,
    setUsers: store.setItems,
    addUser: store.addItem,
    removeUser: store.removeItem,

    // Custom queries using base store methods
    getUserById: store.getById,
    getUsersByRole: (role: UserRole) =>
      store.advancedFilter({
        where: { type: { eq: role } },
      }),
    getActiveUsers: () =>
      store.advancedFilter({
        where: {
          status: { eq: Statuses.Active },
          deletedAt: { eq: undefined },
        },
      }),

    // Additional custom queries
    searchUsers: (query: string) =>
      store.search(query, ["name", "userName", "email", "phone"]),

    getUsersByLocation: (locationId: string) =>
      store.advancedFilter({
        where: { locationId: { eq: locationId } },
      }),

    // Utility methods
    resetStore: store.resetState,
    setLoading: store.setLoading,
    setError: (error: Error | null) => store.setError(error),
  };
};

export { useUserStore };
