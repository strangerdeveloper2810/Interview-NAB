import { userRepository } from "../repositories/userRepository.js";
import { accountRepository } from "../repositories/accountRepository.js";
import { transactionRepository } from "../repositories/transactionRepository.js";
import { User, Account, Transaction } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";
import { query } from "../config/database.js";

export const adminService = {
  /**
   * Get all users (without password_hash)
   */
  async getAllUsers(): Promise<Omit<User, "password_hash">[]> {
    const users = await userRepository.findAll();
    return users.map(({ password_hash, ...user }) => user);
  },

  /**
   * Get all accounts for a specific user
   */
  async getUserAccounts(userId: number): Promise<Account[]> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return accountRepository.findByUserId(userId);
  },

  /**
   * Get all transactions across all users with pagination
   */
  async getAllTransactions(
    limit: number,
    offset: number
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const [txResult, countResult] = await Promise.all([
      query<Transaction>(
        `SELECT t.*, a.user_id, a.account_number, a.name as account_name
         FROM transactions t
         JOIN accounts a ON t.account_id = a.id
         ORDER BY t.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query<{ count: string }>("SELECT COUNT(*) FROM transactions"),
    ]);

    return {
      transactions: txResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  },
};
