import { authConfig } from "./config";

export type { Session } from "next-auth";
export { authConfig } from "./config";
export {
  invalidateSessionToken,
  validateToken,
  isSecureContext,
} from "./config";

