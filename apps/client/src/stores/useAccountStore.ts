import type { AccountType } from "@reservatior/db";

import { createBaseStore } from "./createBaseStore";

// Define the Account interface
interface Account {
  id: string;
  userId: string;
  type: AccountType;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Serialized Account for storage
interface SerializedAccount
  extends Omit<Account, "createdAt" | "updatedAt" | "deletedAt"> {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Create the base store first
const baseStore = createBaseStore<Account>({
  name: "account-store",
  persist: true,
  version: 1,
  logging: {
    enabled: true,
    level: "debug",
  },
  cache: {
    ttl: 1000 * 60 * 5, // 5 minutes
    maxSize: 100,
  },
  transformers: {
    serialize: (account: Account): SerializedAccount => ({
      ...account,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
      deletedAt: account.deletedAt?.toISOString(),
    }),
    deserialize: (data: SerializedAccount): Account => ({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      deletedAt: data.deletedAt ? new Date(data.deletedAt) : undefined,
    }),
  },
});

// Extend the base store with additional functionality
const useAccountStore = () => {
  const store = baseStore();

  /**
   * Deep copy an Account object. Useful for immutability.
   * This is a standalone utility, not a store method, to avoid confusion and typing errors.
   */
  function copyAccount(account: Account): Account {
    return {
      ...account,
      createdAt: new Date(account.createdAt),
      updatedAt: new Date(account.updatedAt),
      deletedAt: account.deletedAt ? new Date(account.deletedAt) : undefined,
    };
  }

  // Type-safe return object
  return {
    ...store,
    /**
     * Deep copy an Account object. Useful for immutability.
     */
    /**
     * Update an account in the store by id. Ensures immutability and type safety.
     */
    updateAccount: (account: Account, _options: { type: "update" }): void => {
      const updatedAccount = copyAccount(account);
      const updatedItems = store.items.map((item: Account) =>
        item.id === updatedAccount.id ? updatedAccount : item,
      );
      store.setItems(updatedItems);

      // Update current account if it matches
      if (store.data && store.data.id === updatedAccount.id) {
        store.setItem(updatedAccount);
      }
    },

    /**
     * Get all accounts for a given userId.
     */
    getAccountsByUser: (userId: string): Account[] =>
      store.items.filter((account: Account) => account.userId === userId),

    /**
     * Get all accounts by provider name.
     */
    getAccountsByProvider: (provider: string): Account[] =>
      store.items.filter((account: Account) => account.provider === provider),

    /**
     * Get all active (not deleted) accounts.
     */
    getActiveAccounts: (): Account[] =>
      store.items.filter((account: Account) => !account.deletedAt),

    /**
     * Check if an account's token is expired by accountId.
     */
    isTokenExpired: (accountId: string): boolean => {
      const account = store.items.find((a: Account) => a.id === accountId);
      return account?.expires_at
        ? Date.now() >= account.expires_at * 1000
        : true;
    },
  };
};

// Create custom hooks using the extended store
export const useAccounts = () => {
  const store = useAccountStore();

  return {
    // Basic state
    account: store.data as Account | null,
    accounts: store.items as Account[],
    isLoading: store.isLoading as boolean,
    error: store.error as Error | null,

    // Basic actions (inherited from base store)
    setAccount: store.setItem as (account: Account) => void,
    updateAccount: store.updateAccount as (
      account: Account,
      options: { type: "update" },
    ) => void,
    clearAccount: store.clearItem as () => void,
    setAccounts: store.setItems as (accounts: Account[]) => void,
    addAccount: store.addItem as (account: Account) => void,
    removeAccount: store.removeItem as (id: string) => void,

    // Custom queries
    getAccountsByUser: store.getAccountsByUser as (userId: string) => Account[],
    getAccountsByProvider: store.getAccountsByProvider as (
      provider: string,
    ) => Account[],
    getActiveAccounts: store.getActiveAccounts as () => Account[],
    isTokenExpired: store.isTokenExpired as (accountId: string) => boolean,

    // Utility methods
    resetStore: store.resetState as () => void,
    setLoading: store.setLoading as (loading: boolean) => void,
    setError: (error: Error | null) => store.setError(error),
  };
};

export { useAccountStore };
