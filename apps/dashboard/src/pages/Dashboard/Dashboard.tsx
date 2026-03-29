import { type FC, type JSX, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Card,
  CardHeader,
  CardContent,
  AccountCard,
  TransactionItem,
  Skeleton,
  Button,
} from '@nab/shared-ui';
import { formatCurrency } from '@nab/shared-utils';
// TODO: Replace with shared store or props when integrating with shell
import type { Account } from '@nab/shared-ui';
import type { Transaction } from '@nab/shared-ui';
import styles from './Dashboard.module.scss';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-001',
    name: 'Tài khoản chính',
    type: 'checking',
    balance: 45_680_000,
    currency: 'VND',
    accountNumber: '1234567890123456',
  },
  {
    id: 'acc-002',
    name: 'Tiết kiệm 12 tháng',
    type: 'savings',
    balance: 120_000_000,
    currency: 'VND',
    accountNumber: '9876543210987654',
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-001',
    type: 'deposit',
    amount: 5_000_000,
    currency: 'VND',
    description: 'Nhận lương tháng 3/2026',
    createdAt: '2026-03-28T08:30:00.000Z',
    category: 'income',
  },
  {
    id: 'txn-002',
    type: 'transfer',
    amount: 2_000_000,
    currency: 'VND',
    description: 'Chuyển tiền cho Nguyễn Văn A',
    createdAt: '2026-03-27T14:15:00.000Z',
    category: 'transfer',
  },
  {
    id: 'txn-003',
    type: 'withdraw',
    amount: 500_000,
    currency: 'VND',
    description: 'Rút tiền ATM Hoàn Kiếm',
    createdAt: '2026-03-26T10:00:00.000Z',
    category: 'atm',
  },
  {
    id: 'txn-004',
    type: 'transfer',
    amount: 1_200_000,
    currency: 'VND',
    description: 'Thanh toán hoá đơn điện',
    createdAt: '2026-03-25T09:45:00.000Z',
    category: 'utilities',
  },
  {
    id: 'txn-005',
    type: 'deposit',
    amount: 800_000,
    currency: 'VND',
    description: 'Hoàn tiền mua sắm online',
    createdAt: '2026-03-24T16:20:00.000Z',
    category: 'shopping',
  },
];

const MOCK_SUMMARY = {
  totalBalance: MOCK_ACCOUNTS.reduce((sum, a) => sum + a.balance, 0),
  accountCount: MOCK_ACCOUNTS.length,
  transactionCount: 18, // this month
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SummaryCardSkeleton() {
  return (
    <Card className={styles.summaryCard} padding="lg">
      <Skeleton variant="text" width="50%" height={16} />
      <Skeleton variant="text" width="80%" height={36} style={{ marginTop: 12 }} />
    </Card>
  );
}

function AccountCardSkeleton() {
  return (
    <Card padding="md" className={styles.accountCardSkeleton}>
      <Skeleton variant="rectangular" height={120} />
      <div className={styles.accountCardSkeleton__content}>
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="50%" />
      </div>
    </Card>
  );
}

function TransactionSkeleton() {
  return (
    <div className={styles.transactionSkeleton}>
      <Skeleton variant="circular" width={40} height={40} />
      <div className={styles.transactionSkeleton__text}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
      <Skeleton variant="text" width={80} height={20} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const Dashboard: FC = (): JSX.Element => {
  console.log('%c[Remote: Dashboard] rendered', 'color: #1a56db; font-weight: bold');
  const navigate = useNavigate();
  const user = { name: 'User' }; // mock — real data from shell via shared store

  // Simulate initial loading state — in real use this comes from a data-fetch hook
  const [isLoading] = useState(false);

  const handleAccountSelect = (account: Account) => {
    navigate(`/accounts/${account.id}`);
  };

  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.dashboard__header}>
          <Skeleton variant="text" width={240} height={32} />
          <Skeleton variant="text" width={160} height={20} style={{ marginTop: 8 }} />
        </div>

        <section className={styles.summaryGrid} aria-label="Tóm tắt tài chính">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </section>

        <section className={styles.section} aria-label="Tài khoản">
          <div className={styles.section__header}>
            <Skeleton variant="text" width={120} height={24} />
          </div>
          <div className={styles.accountGrid}>
            <AccountCardSkeleton />
            <AccountCardSkeleton />
          </div>
        </section>

        <section className={styles.section} aria-label="Giao dịch gần đây">
          <div className={styles.section__header}>
            <Skeleton variant="text" width={160} height={24} />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <TransactionSkeleton key={i} />
          ))}
        </section>
      </div>
    );
  }

  return (
    <main className={styles.dashboard}>
      {/* ------------------------------------------------------------------ */}
      {/* Header / Welcome                                                     */}
      {/* ------------------------------------------------------------------ */}
      <header className={styles.dashboard__header}>
        <h1 className={styles.dashboard__welcome}>
          Xin chào, <span className={styles.dashboard__username}>{user?.name ?? 'Khách'}</span>
        </h1>
        <p className={styles.dashboard__subtitle}>Đây là tổng quan tài khoản của bạn</p>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Quick Actions                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className={styles.quickActions} aria-label="Thao tác nhanh">
        <Button
          variant="secondary"
          size="md"
          className={styles.quickActions__btn}
          onClick={() => navigate('/transfer')}
        >
          Chuyển khoản
        </Button>
        <Button
          variant="secondary"
          size="md"
          className={styles.quickActions__btn}
          onClick={() => navigate('/deposit')}
        >
          Nạp tiền
        </Button>
        <Button
          variant="secondary"
          size="md"
          className={styles.quickActions__btn}
          onClick={() => navigate('/withdraw')}
        >
          Rút tiền
        </Button>
        <Button
          variant="secondary"
          size="md"
          className={styles.quickActions__btn}
          onClick={() => navigate('/accounts')}
        >
          Lịch sử
        </Button>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Summary cards                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className={styles.summaryGrid} aria-label="Tóm tắt tài chính">
        <Card className={styles.summaryCard} padding="lg">
          <CardContent>
            <p className={styles.summaryCard__label}>Tổng số dư</p>
            <p className={styles.summaryCard__value}>
              {formatCurrency(MOCK_SUMMARY.totalBalance)}
            </p>
          </CardContent>
        </Card>

        <Card className={styles.summaryCard} padding="lg">
          <CardContent>
            <p className={styles.summaryCard__label}>Số tài khoản</p>
            <p className={styles.summaryCard__value}>{MOCK_SUMMARY.accountCount}</p>
          </CardContent>
        </Card>

        <Card className={styles.summaryCard} padding="lg">
          <CardContent>
            <p className={styles.summaryCard__label}>Giao dịch tháng này</p>
            <p className={styles.summaryCard__value}>{MOCK_SUMMARY.transactionCount}</p>
          </CardContent>
        </Card>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Account list                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className={styles.section} aria-label="Tài khoản của tôi">
        <div className={styles.section__header}>
          <h2 className={styles.section__title}>Tài khoản của tôi</h2>
          <Link to="/accounts" className={styles.section__viewAll}>
            Xem tất cả
          </Link>
        </div>

        <div className={styles.accountGrid}>
          {MOCK_ACCOUNTS.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onAccountSelect={handleAccountSelect}
            />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Recent transactions                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className={styles.section} aria-label="Giao dịch gần đây">
        <div className={styles.section__header}>
          <h2 className={styles.section__title}>Giao dịch gần đây</h2>
          <Link to="/accounts" className={styles.section__viewAll}>
            Xem tất cả
          </Link>
        </div>

        <Card padding="none" className={styles.transactionList}>
          {MOCK_TRANSACTIONS.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              className={styles.transactionList__item}
            />
          ))}
        </Card>
      </section>
    </main>
  );
};

export default Dashboard;
