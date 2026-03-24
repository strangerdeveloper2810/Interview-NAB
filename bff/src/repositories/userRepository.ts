import { query } from '../config/database.js';
import { User } from '../types/index.js';

export const userRepository = {
  async findAll(): Promise<User[]> {
    const result = await query<User>('SELECT * FROM users ORDER BY id');
    return result.rows;
  },

  async findById(id: number): Promise<User | null> {
    const result = await query<User>('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const result = await query<User>('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    return result.rows[0] || null;
  },

  async create(
    email: string,
    name: string,
    passwordHash: string
  ): Promise<User> {
    const result = await query<User>(
      'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [email, name, passwordHash]
    );
    return result.rows[0];
  },

  async updateName(id: number, name: string): Promise<User | null> {
    const result = await query<User>(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0] || null;
  },
};
