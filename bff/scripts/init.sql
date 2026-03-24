-- NAB Banking Portal Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('checking', 'savings', 'credit')),
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    account_number VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer')),
    amount DECIMAL(15, 2) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Clear existing data (respect FK constraints)
TRUNCATE TABLE transactions, accounts, users RESTART IDENTITY CASCADE;

-- =====================
-- SEED DATA
-- =====================

-- Users (5 users)
-- Password: 123456 | bcrypt hash (10 rounds)
INSERT INTO users (email, name, password_hash) VALUES
    ('admin@nab.com', 'Admin User', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.Y.XlZQy7PqFGsv1ZKu'),
    ('john@nab.com', 'John Nguyen', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.Y.XlZQy7PqFGsv1ZKu'),
    ('jane@nab.com', 'Jane Tran', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.Y.XlZQy7PqFGsv1ZKu'),
    ('bob@nab.com', 'Bob Le', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.Y.XlZQy7PqFGsv1ZKu'),
    ('alice@nab.com', 'Alice Pham', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.Y.XlZQy7PqFGsv1ZKu');

-- Accounts (10 accounts)
INSERT INTO accounts (user_id, name, type, balance, currency, account_number) VALUES
    -- Admin (2 accounts)
    (1, 'Tai khoan thanh toan', 'checking', 25000000.00, 'VND', '1001000001'),
    (1, 'Tai khoan tiet kiem', 'savings', 80000000.00, 'VND', '1001000002'),
    -- John (2 accounts)
    (2, 'Tai khoan ca nhan', 'checking', 15500000.00, 'VND', '1002000001'),
    (2, 'Tiet kiem linh hoat', 'savings', 45000000.00, 'VND', '1002000002'),
    -- Jane (2 accounts)
    (3, 'Tai khoan luong', 'checking', 32000000.00, 'VND', '1003000001'),
    (3, 'The tin dung', 'credit', 12500000.00, 'VND', '1003000002'),
    -- Bob (2 accounts)
    (4, 'Tai khoan chinh', 'checking', 8750000.00, 'VND', '1004000001'),
    (4, 'Tiet kiem ky han', 'savings', 100000000.00, 'VND', '1004000002'),
    -- Alice (2 accounts)
    (5, 'Tai khoan giao dich', 'checking', 5200000.00, 'VND', '1005000001'),
    (5, 'The tin dung NAB', 'credit', 3800000.00, 'VND', '1005000002');

-- Transactions (20 transactions - spread across 30 days)
INSERT INTO transactions (account_id, type, amount, description, created_at) VALUES
    -- Admin transactions
    (1, 'deposit', 8000000.00, 'Luong thang 3', NOW() - INTERVAL '2 days'),
    (1, 'withdrawal', 2500000.00, 'Thanh toan hoa don dien nuoc', NOW() - INTERVAL '5 days'),
    (2, 'deposit', 10000000.00, 'Gui tiet kiem hang thang', NOW() - INTERVAL '8 days'),

    -- John transactions
    (3, 'deposit', 12000000.00, 'Luong thang 3', NOW() - INTERVAL '3 days'),
    (3, 'transfer', 5000000.00, 'Chuyen tien cho me', NOW() - INTERVAL '6 days'),
    (3, 'withdrawal', 1500000.00, 'Rut tien ATM', NOW() - INTERVAL '10 days'),
    (4, 'deposit', 3000000.00, 'Tien thuong quy 1', NOW() - INTERVAL '15 days'),

    -- Jane transactions
    (5, 'deposit', 18000000.00, 'Luong thang 3', NOW() - INTERVAL '1 day'),
    (5, 'transfer', 8000000.00, 'Chuyen khoan mua hang', NOW() - INTERVAL '4 days'),
    (5, 'withdrawal', 500000.00, 'Rut tien mat', NOW() - INTERVAL '7 days'),
    (6, 'withdrawal', 3500000.00, 'Thanh toan the tin dung', NOW() - INTERVAL '12 days'),

    -- Bob transactions
    (7, 'deposit', 6500000.00, 'Luong thang 2', NOW() - INTERVAL '25 days'),
    (7, 'withdrawal', 200000.00, 'Rut tien ATM Circle K', NOW() - INTERVAL '9 days'),
    (7, 'transfer', 1000000.00, 'Tra tien ban', NOW() - INTERVAL '14 days'),
    (8, 'deposit', 20000000.00, 'Gui tiet kiem ky han 12 thang', NOW() - INTERVAL '28 days'),

    -- Alice transactions
    (9, 'deposit', 4500000.00, 'Luong part-time', NOW() - INTERVAL '5 days'),
    (9, 'withdrawal', 800000.00, 'Mua sam Shopee', NOW() - INTERVAL '2 days'),
    (9, 'transfer', 2000000.00, 'Chuyen tien hoc phi', NOW() - INTERVAL '18 days'),
    (10, 'withdrawal', 1200000.00, 'Thanh toan Grab', NOW() - INTERVAL '11 days'),
    (10, 'withdrawal', 650000.00, 'Thanh toan Netflix + Spotify', NOW() - INTERVAL '20 days');
