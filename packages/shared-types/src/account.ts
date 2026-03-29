export type AccountType = 'checking' | 'savings' | 'credit';

export interface Account {
  id: number;
  user_id: number;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  account_number: string;
  created_at: string;
}
