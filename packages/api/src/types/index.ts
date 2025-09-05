import type { Prisma } from "@reservatior/db";

export type FavoriteWithIncludes = Prisma.FavoriteGetPayload<{
  include: {
    user: true;
    property: true;
    agency: true;
    agent: true;
    tenant: true;
  };
}>;
