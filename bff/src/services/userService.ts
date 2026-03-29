import bcrypt from "bcryptjs";
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

  /**
   * Change user password
   */
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );
    if (!isValidPassword) {
      throw new AppError(401, "Current password is incorrect");
    }

    // New password must differ from current
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password_hash
    );
    if (isSamePassword) {
      throw new AppError(
        400,
        "New password must be different from current password"
      );
    }

    // Validate new password length
    if (newPassword.length < 6) {
      throw new AppError(400, "Password must be at least 6 characters");
    }

    // Hash and update
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updated = await userRepository.updatePassword(userId, passwordHash);

    if (!updated) {
      throw new AppError(500, "Failed to update password");
    }
  },
};
