import { type FC, type JSX, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  type Account,
  type Transaction,
  TransactionItem,
  Button,
  Badge,
  AmountDisplay,
  Skeleton,
  Card,
} from '@nab/shared-ui';
import {
  formatDate,
  formatAccountNumber,
  formatCurrency,
} from '@nab/shared-utils';
import { RoutesApp } from '../../constants/route';
import styles from './AccountDetail.module.scss';

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

function buildMockTransactions(accountId: string): Transaction[] {
  const now = Date.now();
  const DAY = 86_400_000;
  const rows: Transaction[] = [
    {
      id: 't-001',
      type: 'deposit',
      amount: 50_000_000,
      currency: 'VND',
      description: 'Lương tháng 3/2026',
      createdAt: new Date(now - 1 * DAY),
      category: 'income',
    },
    {
      id: 't-002',
      type: 'withdraw',
      amount: 5_200_000,
      currency: 'VND',
      description: 'Thanh toán hóa đơn điện',
      createdAt: new Date(now - 1 * DAY),
      category: 'utilities',
    },
    {
      id: 't-003',
      type: 'transfer',
      amount: 10_000_000,
      currency: 'VND',
      description: 'Chuyển tiền cho Minh',
      createdAt: new Date(now - 2 * DAY),
      category: 'transfer',
    },
    {
      id: 't-004',
      type: 'withdraw',
      amount: 800_000,
      currency: 'VND',
      description: 'Mua sắm VinMart',
      createdAt: new Date(now - 2 * DAY),
      category: 'shopping',
    },
    {
      id: 't-005',
      type: 'deposit',
      amount: 2_500_000,
      currency: 'VND',
      description: 'Hoàn tiền bảo hiểm',
      createdAt: new Date(now - 3 * DAY),
      category: 'income',
    },
    {
      id: 't-006',
      type: 'withdraw',
      amount: 1_200_000,
      currency: 'VND',
      description: 'Ăn uống nhà hàng',
      createdAt: new Date(now - 4 * DAY),
      category: 'food',
    },
    {
      id: 't-007',
      type: 'transfer',
      amount: 3_000_000,
      currency: 'VND',
      description: 'Trả nợ bạn Hùng',
      createdAt: new Date(now - 5 * DAY),
      category: 'transfer',
    },
    {
      id: 't-008',
      type: 'withdraw',
      amount: 450_000,
      currency: 'VND',
      description: 'Grab Food',
      createdAt: new Date(now - 5 * DAY),
      category: 'food',
    },
    {
      id: 't-009',
      type: 'deposit',
      amount: 150_000,
      currency: 'VND',
      description: 'Cashback thẻ tín dụng',
      createdAt: new Date(now - 7 * DAY),
      category: 'income',
    },
    {
      id: 't-010',
      type: 'withdraw',
      amount: 2_300_000,
      currency: 'VND',
      description: 'Thanh toán Netflix/Spotify',
      createdAt: new Date(now - 8 * DAY),
      category: 'entertainment',
    },
    {
      id: 't-011',
      type: 'transfer',
      amount: 15_000_000,
      currency: 'VND',
      description: 'Tiết kiệm định kỳ',
      createdAt: new Date(now - 10 * DAY),
      category: 'saving',
    },
    {
      id: 't-012',
      type: 'withdraw',
      amount: 3_500_000,
      currency: 'VND',
      description: 'Mua điện thoại Shopee',
      createdAt: new Date(now - 12 * DAY),
      category: 'shopping',
    },
    {
      id: 't-013',
      type: 'deposit',
      amount: 100_000,
      currency: 'VND',
      description: 'Lãi tài khoản',
      createdAt: new Date(now - 14 * DAY),
      category: 'income',
    },
    {
      id: 't-014',
      type: 'withdraw',
      amount: 600_000,
      currency: 'VND',
      description: 'Đổ xăng',
      createdAt: new Date(now - 15 * DAY),
      category: 'transport',
    },
    {
      id: 't-015',
      type: 'transfer',
      amount: 5_000_000,
      currency: 'VND',
      description: 'Chia tiền thuê nhà',
      createdAt: new Date(now - 18 * DAY),
      category: 'housing',
    },
    {
      id: 't-016',
      type: 'deposit',
      amount: 25_000_000,
      currency: 'VND',
      description: 'Thưởng quý 1',
      createdAt: new Date(now - 20 * DAY),
      category: 'income',
    },
    {
      id: 't-017',
      type: 'withdraw',
      amount: 900_000,
      currency: 'VND',
      description: 'Khám bệnh & thuốc',
      createdAt: new Date(now - 22 * DAY),
      category: 'health',
    },
    {
      id: 't-018',
      type: 'withdraw',
      amount: 250_000,
      currency: 'VND',
      description: 'Đậu nành',
      createdAt: new Date(now - 25 * DAY),
      category: 'food',
    },
    {
      id: 't-019',
      type: 'transfer',
      amount: 8_000_000,
      currency: 'VND',
      description: 'Chuyển tiền gia đình',
      createdAt: new Date(now - 28 * DAY),
      category: 'family',
    },
    {
      id: 't-020',
      type: 'deposit',
      amount: 50_000_000,
      currency: 'VND',
      description: 'Lương tháng 2/2026',
      createdAt: new Date(now - 30 * DAY),
      category: 'income',
    },
    // Extra entries for 90-day range
    {
      id: 't-021',
      type: 'withdraw',
      amount: 7_200_000,
      currency: 'VND',
      description: 'Mua sắm Black Friday',
      createdAt: new Date(now - 35 * DAY),
      category: 'shopping',
    },
    {
      id: 't-022',
      type: 'transfer',
      amount: 2_000_000,
      currency: 'VND',
      description: 'Gửi tiền cho em',
      createdAt: new Date(now - 40 * DAY),
      category: 'family',
    },
    {
      id: 't-023',
      type: 'deposit',
      amount: 500_000,
      currency: 'VND',
      description: 'Hoàn tiền Grab',
      createdAt: new Date(now - 45 * DAY),
      category: 'income',
    },
    {
      id: 't-024',
      type: 'withdraw',
      amount: 1_800_000,
      currency: 'VND',
      description: 'Gia hạn phần mềm',
      createdAt: new Date(now - 50 * DAY),
      category: 'tech',
    },
    {
      id: 't-025',
      type: 'deposit',
      amount: 50_000_000,
      currency: 'VND',
      description: 'Lương tháng 1/2026',
      createdAt: new Date(now - 60 * DAY),
      category: 'income',
    },
    {
      id: 't-026',
      type: 'transfer',
      amount: 12_000_000,
      currency: 'VND',
      description: 'Tiết kiệm định kỳ',
      createdAt: new Date(now - 65 * DAY),
      category: 'saving',
    },
    {
      id: 't-027',
      type: 'withdraw',
      amount: 4_300_000,
      currency: 'VND',
      description: 'Đi du lịch Đà Nẵng',
      createdAt: new Date(now - 70 * DAY),
      category: 'travel',
    },
    {
      id: 't-028',
      type: 'withdraw',
      amount: 320_000,
      currency: 'VND',
      description: 'Grab bike',
      createdAt: new Date(now - 75 * DAY),
      category: 'transport',
    },
    {
      id: 't-029',
      type: 'deposit',
      amount: 200_000,
      currency: 'VND',
      description: 'Lãi tài khoản',
      createdAt: new Date(now - 80 * DAY),
      category: 'income',
    },
    {
      id: 't-030',
      type: 'transfer',
      amount: 6_000_000,
      currency: 'VND',
      description: 'Góp quỹ văn phòng',
      createdAt: new Date(now - 85 * DAY),
      category: 'other',
    },
  ];
  return rows.map((t) => ({ ...t, id: `${accountId}-${t.id}` }));
}

// ─── Types & constants ───────────────────────────────────────────────────────

type TxTypeFilter = 'all' | 'deposit' | 'withdraw' | 'transfer';
type TimeFilter = 7 | 30 | 90;

const TYPE_FILTER_OPTIONS: { value: TxTypeFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'deposit', label: 'Nhận tiền' },
  { value: 'withdraw', label: 'Rút tiền' },
  { value: 'transfer', label: 'Chuyển khoản' },
];

const TIME_FILTER_OPTIONS: { value: TimeFilter; label: string }[] = [
  { value: 7, label: '7 ngày' },
  { value: 30, label: '30 ngày' },
  { value: 90, label: '90 ngày' },
];

const TYPE_LABELS: Record<Account['type'], string> = {
  savings: 'Tiết kiệm',
  checking: 'Thanh toán',
  credit: 'Tín dụng',
};

const TYPE_BADGE_VARIANT: Record<
  Account['type'],
  'info' | 'success' | 'warning'
> = {
  savings: 'success',
  checking: 'info',
  credit: 'warning',
};

const PAGE_SIZE = 10;

// ─── Helper: group transactions by date ─────────────────────────────────────

function groupByDate(transactions: Transaction[]): Map<string, Transaction[]> {
  const map = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const key = formatDate(tx.createdAt, 'long');
    const group = map.get(key) ?? [];
    group.push(tx);
    map.set(key, group);
  }
  return map;
}

// ─── Component ───────────────────────────────────────────────────────────────

const AccountDetail: FC = (): JSX.Element => {
  console.log('%c[Remote: AccountDetail] rendered', 'color: #d97706; font-weight: bold');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState<TxTypeFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(30);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [copied, setCopied] = useState(false);

  const account = useMemo(
    () => MOCK_ACCOUNTS.find((a) => a.id === id) ?? null,
    [id],
  );

  const allTransactions = useMemo(
    () => (account ? buildMockTransactions(account.id) : []),
    [account],
  );

  const filteredTransactions = useMemo(() => {
    const cutoff = Date.now() - timeFilter * 86_400_000;
    return allTransactions.filter((tx) => {
      const txDate =
        typeof tx.createdAt === 'string'
          ? new Date(tx.createdAt)
          : tx.createdAt;
      if (txDate.getTime() < cutoff) return false;
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      return true;
    });
  }, [allTransactions, timeFilter, typeFilter]);

  const visibleTransactions = useMemo(
    () => filteredTransactions.slice(0, visibleCount),
    [filteredTransactions, visibleCount],
  );

  const groupedTransactions = useMemo(
    () => groupByDate(visibleTransactions),
    [visibleTransactions],
  );

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  const handleTypeFilterChange = useCallback((value: TxTypeFilter) => {
    setTypeFilter(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleTimeFilterChange = useCallback((value: TimeFilter) => {
    setTimeFilter(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleCopyAccountNumber = useCallback(() => {
    if (!account?.accountNumber) return;
    navigator.clipboard.writeText(account.accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [account]);

  // Account not found
  if (!account) {
    return (
      <div className={styles.accountDetail}>
        <Link to={RoutesApp.ACCOUNTS} className={styles.accountDetail__back}>
          ← Quay lại
        </Link>
        <div className={styles.accountDetail__notFound} role="alert">
          <p>Không tìm thấy tài khoản.</p>
        </div>
      </div>
    );
  }

  const hasMore = visibleCount < filteredTransactions.length;

  return (
    <div className={styles.accountDetail}>
      {/* Back button */}
      <Link
        to={RoutesApp.ACCOUNTS}
        className={styles.accountDetail__back}
        aria-label="Quay lại danh sách tài khoản"
      >
        ← Quay lại
      </Link>

      {/* Account info card */}
      <div
        className={styles.accountDetail__infoCard}
        role="region"
        aria-label="Thông tin tài khoản"
      >
        <div className={styles.accountDetail__infoHeader}>
          <div>
            <h1 className={styles.accountDetail__name}>{account.name}</h1>
            <Badge
              variant={TYPE_BADGE_VARIANT[account.type]}
              size="sm"
              className={styles.accountDetail__typeBadge}
            >
              {TYPE_LABELS[account.type]}
            </Badge>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`${RoutesApp.TRANSFER}?from=${account.id}`)}
            className={styles.accountDetail__transferBtn}
          >
            Chuyển khoản
          </Button>
        </div>

        {/* Account number row */}
        {account.accountNumber && (
          <div className={styles.accountDetail__numberRow}>
            <span className={styles.accountDetail__numberLabel}>
              Số tài khoản
            </span>
            <div className={styles.accountDetail__numberValue}>
              <code className={styles.accountDetail__number}>
                {formatAccountNumber(account.accountNumber)}
              </code>
              <button
                type="button"
                className={styles.accountDetail__copyBtn}
                onClick={handleCopyAccountNumber}
                aria-label={copied ? 'Đã sao chép' : 'Sao chép số tài khoản'}
                title={copied ? 'Đã sao chép!' : 'Sao chép'}
              >
                {copied ? '✓' : '⎘'}
              </button>
            </div>
          </div>
        )}

        {/* Balance */}
        <div className={styles.accountDetail__balanceRow}>
          <span className={styles.accountDetail__balanceLabel}>
            Số dư hiện tại
          </span>
          <AmountDisplay
            amount={account.balance}
            currency={account.currency}
            size="xl"
            className={styles.accountDetail__balance}
          />
        </div>
      </div>

      {/* Transaction history */}
      <section
        className={styles.accountDetail__txSection}
        aria-labelledby="tx-history-heading"
      >
        <h2 id="tx-history-heading" className={styles.accountDetail__txTitle}>
          Lịch sử giao dịch
        </h2>

        {/* Filters */}
        <div
          className={styles.accountDetail__filters}
          role="group"
          aria-label="Bộ lọc giao dịch"
        >
          {/* Type filter */}
          <div className={styles.accountDetail__filterGroup}>
            {TYPE_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.accountDetail__filterBtn} ${
                  typeFilter === opt.value
                    ? styles['accountDetail__filterBtn--active']
                    : ''
                }`}
                onClick={() => handleTypeFilterChange(opt.value)}
                aria-pressed={typeFilter === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Time filter */}
          <div className={styles.accountDetail__filterGroup}>
            {TIME_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.accountDetail__filterBtn} ${
                  timeFilter === opt.value
                    ? styles['accountDetail__filterBtn--active']
                    : ''
                }`}
                onClick={() => handleTimeFilterChange(opt.value)}
                aria-pressed={timeFilter === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction list */}
        {filteredTransactions.length === 0 ? (
          <div className={styles.accountDetail__txEmpty} role="status">
            <p>Không có giao dịch nào trong khoảng thời gian này.</p>
          </div>
        ) : (
          <>
            <div
              className={styles.accountDetail__txList}
              role="list"
              aria-label="Danh sách giao dịch"
            >
              {Array.from(groupedTransactions.entries()).map(
                ([dateLabel, txs]) => (
                  <div
                    key={dateLabel}
                    className={styles.accountDetail__txGroup}
                    role="listitem"
                  >
                    <h3 className={styles.accountDetail__txGroupDate}>
                      {dateLabel}
                    </h3>
                    <Card
                      variant="outlined"
                      padding="none"
                      className={styles.accountDetail__txGroupCard}
                    >
                      {txs.map((tx, idx) => (
                        <TransactionItem
                          key={tx.id}
                          transaction={tx}
                          className={`${styles.accountDetail__txItem} ${
                            idx < txs.length - 1
                              ? styles['accountDetail__txItem--bordered']
                              : ''
                          }`}
                          role="listitem"
                        />
                      ))}
                    </Card>
                  </div>
                ),
              )}
            </div>

            {/* Pagination footer */}
            <div
              className={styles.accountDetail__txFooter}
              role="status"
              aria-live="polite"
            >
              <span className={styles.accountDetail__txCount}>
                {Math.min(visibleCount, filteredTransactions.length)}/
                {filteredTransactions.length} giao dịch
              </span>

              {hasMore && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleLoadMore}
                  className={styles.accountDetail__loadMoreBtn}
                  aria-label={`Xem thêm giao dịch, hiện có ${visibleCount} trong ${filteredTransactions.length}`}
                >
                  Xem thêm
                </Button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AccountDetail;
