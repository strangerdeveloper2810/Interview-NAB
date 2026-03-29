import { type FC, type JSX, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  AccountCard,
  type Account,
  SkeletonCard,
  AmountDisplay,
  Card,
} from '@nab/shared-ui';
import { formatCurrency } from '@nab/shared-utils';
import { RoutesApp } from '../../constants/route';
import styles from './Accounts.module.scss';

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-001',
    name: 'Tài khoản thanh toán chính',
    type: 'checking',
    balance: 125_450_000,
    currency: 'VND',
    accountNumber: '0123456789',
  },
  {
    id: 'acc-002',
    name: 'Tài khoản tiết kiệm 6 tháng',
    type: 'savings',
    balance: 500_000_000,
    currency: 'VND',
    accountNumber: '9876543210',
  },
  {
    id: 'acc-003',
    name: 'Thẻ tín dụng NAB Platinum',
    type: 'credit',
    balance: -12_300_000,
    currency: 'VND',
    accountNumber: '1111222233334444',
  },
  {
    id: 'acc-004',
    name: 'Tài khoản tiết kiệm 12 tháng',
    type: 'savings',
    balance: 200_000_000,
    currency: 'VND',
    accountNumber: '5555666677778888',
  },
  {
    id: 'acc-005',
    name: 'Tài khoản thanh toán phụ',
    type: 'checking',
    balance: 8_750_000,
    currency: 'VND',
    accountNumber: '9999000011112222',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

const LOADING_SKELETON_COUNT = 3;

const Accounts: FC = (): JSX.Element => {
  console.log('%c[Remote: Accounts] rendered', 'color: #059669; font-weight: bold');
  const navigate = useNavigate();
  const [isLoading] = useState(false);

  const totalBalance = useMemo(
    () => MOCK_ACCOUNTS.reduce((sum, acc) => sum + acc.balance, 0),
    []
  );

  const handleAccountSelect = (account: Account) => {
    navigate(RoutesApp.ACCOUNT_DETAIL.replace(':id', account.id));
  };

  if (isLoading) {
    return (
      <div className={styles.accounts}>
        <div className={styles.accounts__header}>
          <h1 className={styles.accounts__title}>Tài khoản của tôi</h1>
        </div>
        <div className={styles.accounts__grid} aria-busy="true" aria-label="Đang tải tài khoản">
          {Array.from({ length: LOADING_SKELETON_COUNT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.accounts}>
      {/* Page header */}
      <header className={styles.accounts__header}>
        <h1 className={styles.accounts__title}>Tài khoản của tôi</h1>

        <Card className={styles.accounts__summaryCard} padding="md">
          <span className={styles.accounts__summaryLabel}>
            Tổng số dư
          </span>
          <AmountDisplay
            amount={totalBalance}
            currency="VND"
            size="xl"
            className={styles.accounts__summaryAmount}
          />
          <span className={styles.accounts__summaryCount}>
            {MOCK_ACCOUNTS.length} tài khoản
          </span>
        </Card>
      </header>

      {/* Account grid */}
      {MOCK_ACCOUNTS.length === 0 ? (
        <div className={styles.accounts__empty} role="status">
          <span className={styles.accounts__emptyIcon} aria-hidden="true">🏦</span>
          <p className={styles.accounts__emptyText}>Bạn chưa có tài khoản nào</p>
          <p className={styles.accounts__emptyHint}>
            Liên hệ NAB để mở tài khoản mới
          </p>
        </div>
      ) : (
        <div
          className={styles.accounts__grid}
          role="list"
          aria-label="Danh sách tài khoản"
        >
          {MOCK_ACCOUNTS.map((account) => (
            <div key={account.id} role="listitem">
              <AccountCard
                account={account}
                onAccountSelect={handleAccountSelect}
                aria-label={`${account.name}, số dư ${formatCurrency(account.balance)}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accounts;
