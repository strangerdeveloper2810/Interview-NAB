import { accountRepository } from "../repositories/accountRepository.js";
import { transactionRepository } from "../repositories/transactionRepository.js";
import { getClient } from "../config/database.js";
import { Account, Transaction } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export const accountService = {
  /**
   * Get all accounts for a user
   */
  async getAccountsByUserId(userId: number): Promise<Account[]> {
    const accounts = await accountRepository.findByUserId(userId);
    return accounts;
  },

  /**
   * Get account by ID with ownership verification
   */
  async getAccountById(accountId: number, userId: number): Promise<Account> {
    const account = await accountRepository.findById(accountId);

    if (!account) {
      throw new AppError(404, "Account not found");
    }

    // Verify ownership
    if (account.user_id !== userId) {
      throw new AppError(403, "Access denied");
    }

    return account;
  },

  /**
   * Get transactions for an account with ownership verification
   */
  async getTransactionsByAccountId(
    accountId: number,
    userId: number,
    limit: number = 50,
    offset: number = 0,
    type?: string,
    days?: number
  ): Promise<{ transactions: Transaction[]; total: number }> {
    // First verify the user owns this account
    await this.getAccountById(accountId, userId);

    const [transactions, total] = await Promise.all([
      transactionRepository.findByAccountId(accountId, limit, offset, type, days),
      transactionRepository.countByAccountId(accountId, type, days),
    ]);

    return { transactions, total };
  },

  /**
   * Transfer money between accounts
   */
  async transfer(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    userId: number,
    description?: string
  ): Promise<{
    fromAccount: Account;
    toAccount: Account;
    transaction: Transaction;
  }> {
    // Validate amount
    if (amount <= 0) {
      throw new AppError(400, "Amount must be positive");
    }

    // Cannot transfer to the same account
    if (fromAccountId === toAccountId) {
      throw new AppError(400, "Cannot transfer to the same account");
    }

    const client = await getClient();

    try {
      await client.query("BEGIN");

      // Validate source account exists and user owns it
      const fromResult = await client.query<Account>(
        "SELECT * FROM accounts WHERE id = $1",
        [fromAccountId]
      );
      const fromAccount = fromResult.rows[0];

      if (!fromAccount) {
        throw new AppError(404, "Account not found");
      }

      if (fromAccount.user_id !== userId) {
        throw new AppError(403, "Access denied");
      }

      // Check sufficient balance
      if (Number(fromAccount.balance) < amount) {
        throw new AppError(400, "Insufficient balance");
      }

      // Validate destination account exists
      const toResult = await client.query<Account>(
        "SELECT * FROM accounts WHERE id = $1",
        [toAccountId]
      );
      const toAccount = toResult.rows[0];

      if (!toAccount) {
        throw new AppError(404, "Destination account not found");
      }

      // Update source balance
      const updatedFromResult = await client.query<Account>(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *",
        [-amount, fromAccountId]
      );

      // Update destination balance
      const updatedToResult = await client.query<Account>(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *",
        [amount, toAccountId]
      );

      // Create transaction record
      const transactionResult = await client.query<Transaction>(
        `INSERT INTO transactions (account_id, type, amount, description)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [fromAccountId, "transfer", amount, description || `Transfer to account ${toAccountId}`]
      );

      await client.query("COMMIT");

      return {
        fromAccount: updatedFromResult.rows[0],
        toAccount: updatedToResult.rows[0],
        transaction: transactionResult.rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};
