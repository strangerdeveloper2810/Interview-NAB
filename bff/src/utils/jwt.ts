import jwt from "jsonwebtoken";
import { AppError } from "../middleware/errorHandler.js";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access-secret-key";
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || "refresh-secret-key";

const ACCESS_TOKEN_EXPIRES_IN = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = "7d"; // 7 days

export interface TokenPayload {
  userId: number;
  email: string;
  type: "access" | "refresh";
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds until access token expires
}

export const jwtUtils = {
  /**
   * Generate access and refresh token pair
   */
  generateTokenPair(userId: number, email: string): TokenPair {
    const accessToken = jwt.sign(
      { userId, email, type: "access" } as TokenPayload,
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId, email, type: "refresh" } as TokenPayload,
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  },

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): Omit<TokenPayload, "type"> {
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;

      if (decoded.type !== "access") {
        throw new AppError(401, "Invalid token type");
      }

      return { userId: decoded.userId, email: decoded.email };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(401, "Invalid or expired access token");
    }
  },

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): Omit<TokenPayload, "type"> {
    try {
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;

      if (decoded.type !== "refresh") {
        throw new AppError(401, "Invalid token type");
      }

      return { userId: decoded.userId, email: decoded.email };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(401, "Invalid or expired refresh token");
    }
  },

  /**
   * Refresh tokens - generate new pair from refresh token
   */
  refreshTokens(refreshToken: string): TokenPair {
    const payload = this.verifyRefreshToken(refreshToken);
    return this.generateTokenPair(payload.userId, payload.email);
  },
};
