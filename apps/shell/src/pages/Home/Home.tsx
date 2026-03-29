import { type FC, type JSX } from 'react';
import { Link } from 'react-router';
import { Avatar } from '@nab/shared-ui';
import useAuthStore from '../../stores/authStore';
import { RoutesApp } from '../../constants/route';
import styles from './Home.module.scss';

interface NavCard {
  icon: string;
  title: string;
  description: string;
  to: RoutesApp;
  ariaLabel: string;
}

const NAV_CARDS: NavCard[] = [
  {
    icon: '📊',
    title: 'Tổng quan',
    description: 'Xem tổng quan tài khoản',
    to: RoutesApp.DASHBOARD,
    ariaLabel: 'Đi đến trang tổng quan',
  },
  {
    icon: '🏦',
    title: 'Tài khoản',
    description: 'Quản lý tài khoản',
    to: RoutesApp.ACCOUNTS,
    ariaLabel: 'Đi đến trang tài khoản',
  },
  {
    icon: '💸',
    title: 'Chuyển khoản',
    description: 'Chuyển tiền nhanh chóng',
    to: RoutesApp.TRANSFER,
    ariaLabel: 'Đi đến trang chuyển khoản',
  },
  {
    icon: '👤',
    title: 'Hồ sơ',
    description: 'Cập nhật thông tin cá nhân',
    to: RoutesApp.PROFILE,
    ariaLabel: 'Đi đến trang hồ sơ',
  },
];

const Home: FC = (): JSX.Element => {
  const { user } = useAuthStore();

  return (
    <main className={styles.home}>
      <section className={styles.home__hero} aria-labelledby="welcome-heading">
        <div className={styles.home__hero_avatar}>
          <Avatar name={user?.name ?? ''} size="xl" />
        </div>
        <div className={styles.home__hero_text}>
          <h1 id="welcome-heading" className={styles.home__title}>
            Chào mừng, {user?.name ?? 'bạn'}!
          </h1>
          <p className={styles.home__subtitle}>
            Quản lý tài chính của bạn một cách dễ dàng
          </p>
        </div>
      </section>

      <section
        className={styles.home__grid}
        aria-label="Điều hướng nhanh"
      >
        {NAV_CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={styles.home__card}
            aria-label={card.ariaLabel}
          >
            <span className={styles.home__card_icon} aria-hidden="true">
              {card.icon}
            </span>
            <h2 className={styles.home__card_title}>{card.title}</h2>
            <p className={styles.home__card_desc}>{card.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default Home;
