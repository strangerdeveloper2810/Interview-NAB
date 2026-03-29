import { type FC, type JSX, useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { Avatar, Button } from '@nab/shared-ui';
import useAuthStore from '../../stores/authStore';
import { RoutesApp } from '../../constants/route';
import styles from './HomeLayout.module.scss';

const USER_NAV_LINKS = [
  { to: RoutesApp.DASHBOARD, label: 'Dashboard' },
  { to: RoutesApp.ACCOUNTS, label: 'Accounts' },
  { to: RoutesApp.TRANSFER, label: 'Transfer' },
];

const ADMIN_NAV_LINKS = [
  { to: RoutesApp.ADMIN_DASHBOARD, label: 'Dashboard' },
  { to: RoutesApp.ADMIN_USERS, label: 'Quản lý Users' },
];

const HomeLayout: FC = (): JSX.Element => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate(RoutesApp.LOGIN);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const navLinks = isAdmin ? ADMIN_NAV_LINKS : USER_NAV_LINKS;

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.nav__link} ${isActive ? styles['nav__link--active'] : ''}`;

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.header__inner}>
          {/* Logo */}
          <NavLink
            to={isAdmin ? RoutesApp.ADMIN_DASHBOARD : RoutesApp.DASHBOARD}
            className={styles.logo}
            aria-label="NAB Banking - Về trang chủ"
          >
            <span className={styles.logo__text}>NAB</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end className={getNavClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side: user menu + hamburger */}
          <div className={styles.header__right}>
            {/* User dropdown */}
            <div className={styles.user} ref={dropdownRef}>
              <button
                className={styles.user__trigger}
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <Avatar name={user?.name ?? ''} size="sm" />
                <span className={styles.user__name}>{user?.name}</span>
                <span className={styles.user__chevron} aria-hidden="true">
                  {dropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown} role="menu">
                  <NavLink
                    to={RoutesApp.PROFILE}
                    className={styles.dropdown__item}
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <div className={styles.dropdown__divider} />
                  <button
                    className={`${styles.dropdown__item} ${styles['dropdown__item--danger']}`}
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger (mobile) */}
            <button
              className={styles.hamburger}
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className={`${styles.hamburger__bar} ${mobileMenuOpen ? styles['hamburger__bar--open'] : ''}`} />
              <span className={`${styles.hamburger__bar} ${mobileMenuOpen ? styles['hamburger__bar--open'] : ''}`} />
              <span className={`${styles.hamburger__bar} ${mobileMenuOpen ? styles['hamburger__bar--open'] : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileMenuOpen && (
        <div className={styles['mobile-nav']} role="dialog" aria-label="Mobile navigation">
          <nav>
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={getNavClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <div className={styles['mobile-nav__divider']} />
            <NavLink
              to={RoutesApp.PROFILE}
              className={getNavClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </NavLink>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.main__container}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default HomeLayout;
