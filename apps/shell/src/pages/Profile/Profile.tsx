import { type FC, type JSX, useState } from 'react';
import { Avatar } from '@nab/shared-ui';
import { Badge } from '@nab/shared-ui';
import { Button } from '@nab/shared-ui';
import { Input } from '@nab/shared-ui';
import { Card, CardHeader, CardContent } from '@nab/shared-ui';
import { EyeIcon, EyeOffIcon } from '@nab/shared-ui';
import useAuthStore from '../../stores/authStore';
import { formatDate } from '@nab/shared-utils';
import styles from './Profile.module.scss';

const Profile: FC = (): JSX.Element => {
  const { user } = useAuthStore();

  // Edit name state
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name ?? '');

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveName = () => {
    // In real scenario, call API to update name
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name ?? '');
    setIsEditing(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In real scenario, call API to change password
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const roleBadgeVariant = user?.role === 'admin' ? 'error' : 'info';
  const roleLabel = user?.role === 'admin' ? 'Admin' : 'User';

  return (
    <div className={styles.profile}>
      <h1 className={styles.profile__title}>Hồ sơ cá nhân</h1>

      {/* User Info Card */}
      <Card className={styles['profile__card']}>
        <CardHeader>
          <h2 className={styles['profile__card-title']}>Thông tin tài khoản</h2>
        </CardHeader>
        <CardContent>
          <div className={styles['profile__user-info']}>
            <div className={styles['profile__avatar-wrapper']}>
              <Avatar
                name={user?.name}
                size="xl"
                aria-label={`Avatar của ${user?.name}`}
              />
            </div>

            <div className={styles['profile__details']}>
              {/* Name field */}
              <div className={styles['profile__field']}>
                <span className={styles['profile__field-label']}>Họ và tên</span>
                {isEditing ? (
                  <div className={styles['profile__edit-row']}>
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      aria-label="Chỉnh sửa họ và tên"
                      autoFocus
                    />
                    <div className={styles['profile__edit-actions']}>
                      <Button size="sm" onClick={handleSaveName}>
                        Lưu
                      </Button>
                      <Button size="sm" variant="secondary" onClick={handleCancelEdit}>
                        Huỷ
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles['profile__name-row']}>
                    <span className={styles['profile__field-value']}>{user?.name}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      Chỉnh sửa
                    </Button>
                  </div>
                )}
              </div>

              {/* Email field - read only */}
              <div className={styles['profile__field']}>
                <span className={styles['profile__field-label']}>Email</span>
                <span className={styles['profile__field-value']}>{user?.email}</span>
              </div>

              {/* Role field */}
              <div className={styles['profile__field']}>
                <span className={styles['profile__field-label']}>Vai trò</span>
                <Badge variant={roleBadgeVariant}>{roleLabel}</Badge>
              </div>

              {/* Member since */}
              <div className={styles['profile__field']}>
                <span className={styles['profile__field-label']}>Thành viên từ</span>
                <span className={styles['profile__field-value']}>
                  {user?.created_at ? formatDate(user.created_at, 'long') : '—'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className={styles['profile__card']}>
        <CardHeader>
          <h2 className={styles['profile__card-title']}>Đổi mật khẩu</h2>
        </CardHeader>
        <CardContent>
          <form
            className={styles['profile__password-form']}
            onSubmit={handleChangePassword}
            noValidate
          >
            {/* Current password */}
            <div className={styles['profile__password-field']}>
              <Input
                label="Mật khẩu hiện tại"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles['profile__eye-toggle']}
                onClick={() => setShowCurrentPassword((v) => !v)}
                aria-label={showCurrentPassword ? 'Ẩn mật khẩu hiện tại' : 'Hiện mật khẩu hiện tại'}
              >
                {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* New password */}
            <div className={styles['profile__password-field']}>
              <Input
                label="Mật khẩu mới"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles['profile__eye-toggle']}
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
              >
                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Confirm new password */}
            <div className={styles['profile__password-field']}>
              <Input
                label="Xác nhận mật khẩu mới"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles['profile__eye-toggle']}
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Ẩn xác nhận mật khẩu' : 'Hiện xác nhận mật khẩu'}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className={styles['profile__password-submit']}>
              <Button
                type="submit"
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                Đổi mật khẩu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
