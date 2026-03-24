import { query } from '../config/database.js';
import { Account } from '../types/index.js';

export const accountRepository = {
  async findAll(): Promise<Account[]> {
    const result = await query<Account>('SELECT * FROM accounts ORDER BY id');
    return result.rows;
  },

  async findById(id: number): Promise<Account | null> {
    const result = await query<Account>(
      'SELECT * FROM accounts WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async findByUserId(userId: number): Promise<Account[]> {
    const result = await query<Account>(
      'SELECT * FROM accounts WHERE user_id = $1 ORDER BY id',
      [userId]
    );
    return result.rows;
  },

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    const result = await query<Account>(
      'SELECT * FROM accounts WHERE account_number = $1',
      [accountNumber]
    );
    return result.rows[0] || null;
  },

  async create(
    userId: number,
    name: string,
    type: Account['type'],
    accountNumber: string,
    balance = 0,
    currency = 'VND'
  ): Promise<Account> {
    const result = await query<Account>(
      `INSERT INTO accounts (user_id, name, type, account_number, balance, currency)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, name, type, accountNumber, balance, currency]
    );
    return result.rows[0];
  },

  async updateBalance(id: number, delta: number): Promise<Account | null> {
    const result = await query<Account>(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *',
      [delta, id]
    );
    return result.rows[0] || null;
  },
};
