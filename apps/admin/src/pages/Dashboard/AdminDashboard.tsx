import { type FC, type JSX } from 'react';
import { Link } from 'react-router';
import { Badge, Button, Avatar } from '@nab/shared-ui';
import { formatCurrency, formatDate } from '@nab/shared-utils';
import styles from './AdminDashboard.module.scss';

// ── Types ─────────────────────────────────────────────────────────────────────

interface MockUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface MockTransaction {
  id: number;
  account_number: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  created_at: string;
  description: string;
  timeAgo: string;
}

interface KpiCard {
  label: string;
  value: string;
  icon: string;
  accent: 'blue' | 'green' | 'orange' | 'purple';
  trend: string;
  trendUp: boolean;
}

interface BarDatum {
  day: string;
  count: number;
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const RECENT_USERS: MockUser[] = [
  { id: 1, name: 'Admin User',  email: 'admin@nab.com', role: 'admin', created_at: '2024-01-15T08:00:00.000Z' },
  { id: 2, name: 'John Nguyen', email: 'john@nab.com',  role: 'user',  created_at: '2024-02-01T09:30:00.000Z' },
  { id: 3, name: 'Jane Tran',   email: 'jane@nab.com',  role: 'user',  created_at: '2024-02-14T10:15:00.000Z' },
  { id: 4, name: 'Bob Le',      email: 'bob@nab.com',   role: 'user',  created_at: '2024-03-05T11:00:00.000Z' },
  { id: 5, name: 'Alice Pham',  email: 'alice@nab.com', role: 'user',  created_at: '2024-03-20T14:45:00.000Z' },
];

const RECENT_TRANSACTIONS: MockTransaction[] = [
  { id: 1, account_number: '1234567890', type: 'deposit',    amount: 50_000_000,  created_at: '2024-03-20T09:00:00.000Z', description: 'Nạp tiền từ ngân hàng VCB',      timeAgo: '2 giờ trước'  },
  { id: 2, account_number: '1234567890', type: 'withdrawal', amount: 5_000_000,   created_at: '2024-03-21T10:30:00.000Z', description: 'Rút tiền tại ATM Hoàn Kiếm',     timeAgo: '5 giờ trước'  },
  { id: 3, account_number: '9876543210', type: 'deposit',    amount: 100_000_000, created_at: '2024-03-22T11:00:00.000Z', description: 'Nhận chuyển khoản từ Techcombank', timeAgo: '1 ngày trước' },
  { id: 4, account_number: '5555444433', type: 'transfer',   amount: 20_000_000,  created_at: '2024-03-23T14:00:00.000Z', description: 'Chuyển khoản liên ngân hàng',    timeAgo: '2 ngày trước' },
  { id: 5, account_number: '9876543210', type: 'withdrawal', amount: 10_000_000,  created_at: '2024-03-24T16:00:00.000Z', description: 'Thanh toán hóa đơn điện',        timeAgo: '3 ngày trước' },
];

const KPI_CARDS: KpiCard[] = [
  { label: 'Tổng người dùng',     value: '5',                          icon: '👥', accent: 'blue',   trend: '+2 so với tháng trước',   trendUp: true  },
  { label: 'Tổng tài khoản',      value: '10',                         icon: '🏦', accent: 'green',  trend: '+3 so với tháng trước',   trendUp: true  },
  { label: 'Tổng giao dịch',      value: '20',                         icon: '📊', accent: 'orange', trend: '+12% so với tháng trước', trendUp: true  },
  { label: 'Tổng số dư hệ thống', value: formatCurrency(327_750_000),  icon: '💰', accent: 'purple', trend: '+8.5% so với tháng trước',trendUp: true  },
];

const BAR_DATA: BarDatum[] = [
  { day: 'T2', count: 3 },
  { day: 'T3', count: 5 },
  { day: 'T4', count: 2 },
  { day: 'T5', count: 7 },
  { day: 'T6', count: 4 },
  { day: 'T7', count: 1 },
  { day: 'CN', count: 2 },
];

const BAR_MAX = Math.max(...BAR_DATA.map((d) => d.count));

// ── Sub-components ────────────────────────────────────────────────────────────

const BarChart: FC = (): JSX.Element => (
  <div className={styles['chart-bar__wrapper']} role="img" aria-label="Biểu đồ giao dịch 7 ngày gần nhất">
    {BAR_DATA.map((d) => {
      const heightPct = Math.round((d.count / BAR_MAX) * 100);
      return (
        <div key={d.day} className={styles['chart-bar__col']}>
          <div className={styles['chart-bar__track']}>
            <div
              className={styles['chart-bar__bar']}
              style={{ height: `${heightPct}%` }}
              aria-label={`${d.day}: ${d.count} giao dịch`}
            >
              <span className={styles['chart-bar__tooltip']}>{d.count}</span>
            </div>
          </div>
          <span className={styles['chart-bar__label']}>{d.day}</span>
        </div>
      );
    })}
  </div>
);

const DonutChart: FC = (): JSX.Element => (
  <div className={styles['chart-donut__wrapper']}>
    <div className={styles['chart-donut__ring']} role="img" aria-label="Phân bổ loại tài khoản">
      <div className={styles['chart-donut__center']}>
        <span className={styles['chart-donut__total']}>10</span>
        <span className={styles['chart-donut__sublabel']}>tài khoản</span>
      </div>
    </div>
    <ul className={styles['chart-donut__legend']} aria-label="Chú thích biểu đồ">
      <li className={styles['chart-donut__legend-item']}>
        <span className={`${styles['chart-donut__dot']} ${styles['chart-donut__dot--blue']}`} />
        <span className={styles['chart-donut__legend-label']}>Thanh toán</span>
        <span className={styles['chart-donut__legend-pct']}>50%</span>
      </li>
      <li className={styles['chart-donut__legend-item']}>
        <span className={`${styles['chart-donut__dot']} ${styles['chart-donut__dot--green']}`} />
        <span className={styles['chart-donut__legend-label']}>Tiết kiệm</span>
        <span className={styles['chart-donut__legend-pct']}>30%</span>
      </li>
      <li className={styles['chart-donut__legend-item']}>
        <span className={`${styles['chart-donut__dot']} ${styles['chart-donut__dot--purple']}`} />
        <span className={styles['chart-donut__legend-label']}>Tín dụng</span>
        <span className={styles['chart-donut__legend-pct']}>20%</span>
      </li>
    </ul>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────

const AdminDashboard: FC = (): JSX.Element => {
  console.log('%c[Remote: AdminDashboard] rendered', 'color: #9333ea; font-weight: bold');

  return (
    <div className={styles.dashboard}>

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <header className={styles.dashboard__header}>
        <div>
          <h1 className={styles.dashboard__title}>Bảng điều khiển quản trị</h1>
          <p className={styles.dashboard__subtitle}>Tổng quan hệ thống ngân hàng NAB</p>
        </div>
        <div className={styles.dashboard__timestamp}>
          <span className={styles['dashboard__timestamp-dot']} aria-hidden="true" />
          <span>Cập nhật lúc: 29/03/2026 15:30</span>
        </div>
      </header>

      {/* ── KPI Cards ─────────────────────────────────────────────────────────── */}
      <div className={styles.dashboard__kpis} role="list" aria-label="Các chỉ số KPI">
        {KPI_CARDS.map((card) => (
          <article
            key={card.label}
            className={`${styles.kpi} ${styles[`kpi--${card.accent}`]}`}
            role="listitem"
          >
            <div className={styles.kpi__top}>
              <span className={styles.kpi__icon} aria-hidden="true">{card.icon}</span>
              <span className={`${styles.kpi__trend} ${card.trendUp ? styles['kpi__trend--up'] : styles['kpi__trend--down']}`}>
                <span className={styles.kpi__arrow} aria-hidden="true">{card.trendUp ? '↑' : '↓'}</span>
                {card.trend}
              </span>
            </div>
            <span className={styles.kpi__value}>{card.value}</span>
            <span className={styles.kpi__label}>{card.label}</span>
          </article>
        ))}
      </div>

      {/* ── Charts row ────────────────────────────────────────────────────────── */}
      <div className={styles.dashboard__charts}>
        <section className={styles['chart-card']} aria-labelledby="bar-chart-heading">
          <h2 id="bar-chart-heading" className={styles['chart-card__title']}>
            Giao dịch 7 ngày gần nhất
          </h2>
          <BarChart />
        </section>

        <section className={styles['chart-card']} aria-labelledby="donut-chart-heading">
          <h2 id="donut-chart-heading" className={styles['chart-card__title']}>
            Phân bổ loại tài khoản
          </h2>
          <DonutChart />
        </section>
      </div>

      {/* ── Activity row ──────────────────────────────────────────────────────── */}
      <div className={styles.dashboard__activity}>

        {/* New users */}
        <section className={styles['activity-card']} aria-labelledby="new-users-heading">
          <h2 id="new-users-heading" className={styles['activity-card__title']}>
            Người dùng mới
          </h2>
          <ul className={styles['user-list']} aria-label="Danh sách người dùng mới">
            {RECENT_USERS.map((user) => (
              <li key={user.id} className={styles['user-item']}>
                <Avatar name={user.name} size="md" />
                <div className={styles['user-item__info']}>
                  <span className={styles['user-item__name']}>{user.name}</span>
                  <span className={styles['user-item__email']}>{user.email}</span>
                </div>
                <div className={styles['user-item__meta']}>
                  <Badge variant={user.role === 'admin' ? 'error' : 'info'} size="sm">
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                  <span className={styles['user-item__date']}>
                    {formatDate(user.created_at, 'short')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Transaction feed */}
        <section className={styles['activity-card']} aria-labelledby="recent-tx-heading">
          <h2 id="recent-tx-heading" className={styles['activity-card__title']}>
            Giao dịch gần nhất
          </h2>
          <ul className={styles['tx-feed']} aria-label="Danh sách giao dịch gần nhất">
            {RECENT_TRANSACTIONS.map((tx) => (
              <li
                key={tx.id}
                className={`${styles['tx-item']} ${styles[`tx-item--${tx.type}`]}`}
              >
                <span
                  className={`${styles['tx-item__dot']} ${styles[`tx-item__dot--${tx.type}`]}`}
                  aria-hidden="true"
                />
                <div className={styles['tx-item__body']}>
                  <span className={styles['tx-item__desc']}>{tx.description}</span>
                  <span className={styles['tx-item__account']}>
                    ****{tx.account_number.slice(-4)}
                  </span>
                </div>
                <div className={styles['tx-item__right']}>
                  <span className={`${styles['tx-item__amount']} ${styles[`tx-item__amount--${tx.type}`]}`}>
                    {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <span className={styles['tx-item__time']}>{tx.timeAgo}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ── Quick actions ─────────────────────────────────────────────────────── */}
      <div className={styles.dashboard__actions}>
        <Link to="/admin/users" className={styles['dashboard__actions-link']}>
          <Button variant="primary" size="md">
            Quản lý người dùng
          </Button>
        </Link>
        <Button variant="secondary" size="md" disabled>
          Xuất báo cáo
        </Button>
        <Button variant="secondary" size="md" disabled>
          Cài đặt hệ thống
        </Button>
      </div>

    </div>
  );
};

export default AdminDashboard;
