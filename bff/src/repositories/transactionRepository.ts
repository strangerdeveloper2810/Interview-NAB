import { query } from '../config/database.js';
import { Transaction } from '../types/index.js';

export const transactionRepository = {
  async findAll(): Promise<Transaction[]> {
    const result = await query<Transaction>(
      'SELECT * FROM transactions ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async findById(id: number): Promise<Transaction | null> {
    const result = await query<Transaction>(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async findByAccountId(
    accountId: number,
    limit = 50,
    offset = 0,
    type?: string,
    days?: number
  ): Promise<Transaction[]> {
    const params: unknown[] = [accountId];
    const conditions: string[] = ['account_id = $1'];
    let paramIndex = 2;

    if (type && type !== 'all') {
      conditions.push(`type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }

    if (days) {
      conditions.push(`created_at >= NOW() - INTERVAL '1 day' * $${paramIndex}`);
      params.push(days);
      paramIndex++;
    }

    params.push(limit, offset);

    const result = await query<Transaction>(
      `SELECT * FROM transactions
       WHERE ${conditions.join(' AND ')}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );
    return result.rows;
  },

  async create(
    accountId: number,
    type: Transaction['type'],
    amount: number,
    description?: string
  ): Promise<Transaction> {
    const result = await query<Transaction>(
      `INSERT INTO transactions (account_id, type, amount, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [accountId, type, amount, description || null]
    );
    return result.rows[0];
  },

  async countByAccountId(
    accountId: number,
    type?: string,
    days?: number
  ): Promise<number> {
    const params: unknown[] = [accountId];
    const conditions: string[] = ['account_id = $1'];
    let paramIndex = 2;

    if (type && type !== 'all') {
      conditions.push(`type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }

    if (days) {
      conditions.push(`created_at >= NOW() - INTERVAL '1 day' * $${paramIndex}`);
      params.push(days);
    }

    const result = await query<{ count: string }>(
      `SELECT COUNT(*) FROM transactions WHERE ${conditions.join(' AND ')}`,
      params
    );
    return parseInt(result.rows[0].count, 10);
  },

  async findRecentByAccountIds(
    accountIds: number[],
    limit = 5
  ): Promise<Transaction[]> {
    if (accountIds.length === 0) {
      return [];
    }
    const result = await query<Transaction>(
      `SELECT * FROM transactions
       WHERE account_id = ANY($1)
       ORDER BY created_at DESC
       LIMIT $2`,
      [accountIds, limit]
    );
    return result.rows;
  },
};
