import { type FC, type JSX } from 'react';
import { Outlet } from 'react-router';
import styles from './AuthLayout.module.scss';

const AuthLayout: FC = (): JSX.Element => {
  return (
    <main className={styles.layout}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo} aria-hidden="true">
            <span className={styles['logo__text']}>NAB</span>
          </div>
        </div>
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
