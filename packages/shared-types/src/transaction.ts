export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

export interface Transaction {
  id: number;
  account_id: number;
  type: TransactionType;
  amount: number;
  description: string | null;
  created_at: string;
}
