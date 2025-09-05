import type { DefaultSession } from "next-auth";
import type { Role } from "@reservatior/validators/src/schemas/interfaces";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: Role;
    } & DefaultSession["user"];
  }
}
