import { userRepository } from "../repositories/userRepository.js";
import { User } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export const userService = {
  /**
   * Get user by ID (excludes password_hash)
   */
  async getUserById(
    userId: number
  ): Promise<Omit<User, "password_hash">> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  /**
   * Update user name
   */
  async updateUserName(
    userId: number,
    name: string
  ): Promise<Omit<User, "password_hash">> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const updatedUser = await userRepository.updateName(userId, name);

    if (!updatedUser) {
      throw new AppError(500, "Failed to update user");
    }

    const { password_hash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },
};
