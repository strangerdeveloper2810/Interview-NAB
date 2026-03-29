import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/userRepository.js";
import { User } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";
import { jwtUtils, TokenPair } from "../utils/jwt.js";

export interface AuthResult {
  user: Omit<User, "password_hash">;
  tokens: TokenPair;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResult> {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(409, "Email already registered");
    }

    // Validate password
    if (password.length < 6) {
      throw new AppError(400, "Password must be at least 6 characters");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.create(email, name, passwordHash);

    // Generate tokens
    const tokens = jwtUtils.generateTokenPair(user.id, user.email, user.role);

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  },

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResult> {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError(401, "Invalid email or password");
    }

    // Generate tokens
    const tokens = jwtUtils.generateTokenPair(user.id, user.email, user.role);

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  },

  /**
   * Refresh tokens
   */
  refreshTokens(refreshToken: string): TokenPair {
    return jwtUtils.refreshTokens(refreshToken);
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<User | null> {
    return userRepository.findById(userId);
  },
};
