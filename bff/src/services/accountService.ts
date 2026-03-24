import { accountRepository } from "../repositories/accountRepository.js";
import { transactionRepository } from "../repositories/transactionRepository.js";
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
    offset: number = 0
  ): Promise<{ transactions: Transaction[]; total: number }> {
    // First verify the user owns this account
    await this.getAccountById(accountId, userId);

    const [transactions, total] = await Promise.all([
      transactionRepository.findByAccountId(accountId, limit, offset),
      transactionRepository.countByAccountId(accountId),
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

    // Verify source account ownership
    const fromAccount = await this.getAccountById(fromAccountId, userId);

    // Check sufficient balance
    if (Number(fromAccount.balance) < amount) {
      throw new AppError(400, "Insufficient balance");
    }

    // Get destination account (no ownership check needed)
    const toAccount = await accountRepository.findById(toAccountId);
    if (!toAccount) {
      throw new AppError(404, "Destination account not found");
    }

    // Perform transfer
    const updatedFromAccount = await accountRepository.updateBalance(
      fromAccountId,
      -amount
    );
    const updatedToAccount = await accountRepository.updateBalance(
      toAccountId,
      amount
    );

    // Create transaction record
    const transaction = await transactionRepository.create(
      fromAccountId,
      "transfer",
      amount,
      description || `Transfer to account ${toAccountId}`
    );

    return {
      fromAccount: updatedFromAccount!,
      toAccount: updatedToAccount!,
      transaction,
    };
  },
};
