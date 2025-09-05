import type { SignOptions, VerifyOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret";

export function createJWT(
  payload: string | object | Buffer,
  expiresIn: SignOptions["expiresIn"] = "7d",
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Validates a JWT and returns the decoded payload if valid, otherwise returns null.
 * @param token JWT string
 * @param options Optional verify options
 */
export function validateToken<T = any>(token: string, options?: VerifyOptions): T | null {
  try {
    return jwt.verify(token, JWT_SECRET, options) as T;
  } catch (err) {
    return null;
  }
}
