import { type FC, type JSX, useState, useMemo } from 'react';
import { Badge } from '@nab/shared-ui';
import { Button } from '@nab/shared-ui';
import { Input } from '@nab/shared-ui';
import { Card, CardContent } from '@nab/shared-ui';
import { formatDate } from '@nab/shared-utils';
import type { User } from '@nab/shared-types';
import styles from './Users.module.scss';

// Mock data matching seed data in init.sql
const MOCK_USERS: User[] = [
  {
    id: 1,
    email: 'admin@nab.com',
    name: 'Admin User',
    role: 'admin',
    created_at: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 2,
    email: 'john@nab.com',
    name: 'John Nguyen',
    role: 'user',
    created_at: '2024-02-01T09:30:00.000Z',
  },
  {
    id: 3,
    email: 'jane@nab.com',
    name: 'Jane Tran',
    role: 'user',
    created_at: '2024-02-14T10:15:00.000Z',
  },
  {
    id: 4,
    email: 'bob@nab.com',
    name: 'Bob Le',
    role: 'user',
    created_at: '2024-03-05T11:00:00.000Z',
  },
  {
    id: 5,
    email: 'alice@nab.com',
    name: 'Alice Pham',
    role: 'user',
    created_at: '2024-03-20T14:45:00.000Z',
  },
];

const AdminUsers: FC = (): JSX.Element => {
  console.log('%c[Remote: Admin] rendered', 'color: #9333ea; font-weight: bold');
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return MOCK_USERS;
    return MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
  }, [search]);

  const handleViewAccounts = (user: User) => {
    console.log('View accounts for user:', user);
  };

  return (
    <div className={styles.users}>
      <div className={styles.users__header}>
        <div className={styles['users__header-left']}>
          <h1 className={styles.users__title}>Quản lý người dùng</h1>
          <span className={styles.users__count}>{filteredUsers.length} người dùng</span>
        </div>
        <div className={styles['users__header-right']}>
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Tìm kiếm người dùng"
          />
        </div>
      </div>

      <Card padding="none">
        <CardContent>
          <div className={styles['users__table-wrapper']}>
            <table className={styles.users__table} aria-label="Danh sách người dùng">
              <thead>
                <tr>
                  <th className={styles['users__th']}>ID</th>
                  <th className={styles['users__th']}>Họ tên</th>
                  <th className={styles['users__th']}>Email</th>
                  <th className={styles['users__th']}>Vai trò</th>
                  <th className={styles['users__th']}>Ngày tạo</th>
                  <th className={styles['users__th']}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className={styles['users__empty']}
                    >
                      Không tìm thấy người dùng nào.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className={styles['users__row']}>
                      <td className={styles['users__td']}>{user.id}</td>
                      <td className={styles['users__td']}>{user.name}</td>
                      <td className={styles['users__td']}>{user.email}</td>
                      <td className={styles['users__td']}>
                        <Badge variant={user.role === 'admin' ? 'error' : 'info'}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </Badge>
                      </td>
                      <td className={styles['users__td']}>
                        {formatDate(user.created_at, 'short')}
                      </td>
                      <td className={styles['users__td']}>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewAccounts(user)}
                        >
                          Xem tài khoản
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
