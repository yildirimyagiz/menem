import type { AccountType } from "@prisma/client";
import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@reservatior/db";

const providerToAccountType: Record<string, AccountType> = {
  google: "GOOGLE",
  email: "EMAIL",
  oidc: "OIDC",
  credentials: "CREDENTIALS",
  facebook: "FACEBOOK",
} as const;

export function CustomPrismaAdapter(): Adapter {
  if (!db) {
    throw new Error("Prisma client is not initialized");
  }
  const prismaAdapter = PrismaAdapter(db);

  return {
    ...prismaAdapter,
    createUser: async (data: AdapterUser) => {
      // Only create the user, don't try to infer provider/type here.
      const user = await db.user.create({
        data: {
          id: data.id,
          email: data.email,
          name: data.name,
          image: data.image,
          emailVerified: data.emailVerified,
          role: "USER",
          type: "GOOGLE", // Default to GOOGLE for OAuth signups
          updatedAt: new Date(),
        },
      });
      return user as AdapterUser;
    },

    // Override linkAccount to enable account linking for users with the same email
    linkAccount: async (account: AdapterAccount) => {
      const type: AccountType =
        providerToAccountType[account.provider] ?? "GOOGLE";
      // Try to find an existing user with the same providerAccountId and provider
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const existingAccount = await db.account.findFirst({
        where: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      });
      if (existingAccount) {
        // Account already linked, nothing to do
        return;
      }
      // Try to find a user with the same email as the new account's email
      let userId = account.userId;
      if (!userId && typeof account.email === "string") {
        const existingUser = await db.user.findFirst({
          where: { email: account.email },
        });
        if (existingUser) {
          userId = existingUser.id;
        }
      }
      await db.account.create({
        data: {
          ...account,
          userId,
          type,
          updatedAt: new Date(),
        },
      });
    },
  };
}
