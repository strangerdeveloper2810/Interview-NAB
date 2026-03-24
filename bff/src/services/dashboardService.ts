import { accountRepository } from "../repositories/accountRepository.js";
import { transactionRepository } from "../repositories/transactionRepository.js";
import { Account, Transaction } from "../types/index.js";

export interface DashboardData {
  totalBalance: number;
  accountCount: number;
  recentTransactions: Transaction[];
}

export const dashboardService = {
  /**
   * Get dashboard summary for a user
   */
  async getDashboardData(userId: number): Promise<DashboardData> {
    // Get all accounts for user
    const accounts = await accountRepository.findByUserId(userId);

    // Calculate total balance
    const totalBalance = accounts.reduce(
      (sum, account) => sum + Number(account.balance),
      0
    );

    // Get recent transactions across all accounts
    const accountIds = accounts.map((a) => a.id);
    const recentTransactions =
      await transactionRepository.findRecentByAccountIds(accountIds, 5);

    return {
      totalBalance,
      accountCount: accounts.length,
      recentTransactions,
    };
  },
};
