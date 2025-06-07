import type { Prisma } from "@acme/db";

export type FavoriteWithIncludes = Prisma.FavoriteGetPayload<{
  include: {
    user: true;
    property: true;
    agency: true;
    agent: true;
    tenant: true;
  };
}>;
