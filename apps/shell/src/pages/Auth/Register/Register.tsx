import { type FC, type JSX, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Input, EyeIcon, EyeOffIcon, useToast } from '@nab/shared-ui';
import { apiClient, ApiError } from '@nab/shared-utils';
import styles from './Register.module.scss';
import {
  RegisterForm,
  registerSchema,
} from '../../../validation/auth.validation';

const RegisterPage: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const passwordValue = watch('password') || '';
  const confirmValue = watch('confirmPassword') || '';

  const confirmTouched = confirmValue.length > 0;
  const confirmMatches = confirmValue === passwordValue;

  const onSubmitRegister = async (data: RegisterForm) => {
    setApiError(null);
    const { confirmPassword, ...body } = data;

    try {
      await apiClient.post('/auth/register', body);
      showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
      navigate('/auth/login', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setApiError('Email đã được đăng ký');
      } else if (err instanceof ApiError) {
        setApiError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      } else {
        setApiError('Đã xảy ra lỗi. Vui lòng thử lại.');
        showToast('Đã xảy ra lỗi không mong đợi. Vui lòng thử lại.', 'error');
      }
    }
  };

  return (
    <div role="region" aria-label="Tạo tài khoản">
      <div className={styles.header}>
        <h1 className={styles.title}>Tạo tài khoản</h1>
        <p className={styles.subtitle}>
          Đăng ký để trải nghiệm dịch vụ ngân hàng
        </p>
      </div>

      <form
        className={styles.form}
        aria-label="Form đăng ký"
        noValidate
        onSubmit={handleSubmit(onSubmitRegister)}
      >
        {apiError && (
          <Alert variant="error" onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        <div className={styles.fields}>
          {/* Họ tên */}
          <Input
            id="register-name"
            label="Họ tên"
            type="text"
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            required
            aria-required="true"
            {...register('name')}
            error={errors.name?.message}
          />

          {/* Email */}
          <Input
            id="register-email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            required
            aria-required="true"
            {...register('email')}
            error={errors.email?.message}
          />

          {/* Mật khẩu */}
          <div>
            <div className={styles['password-wrapper']}>
              <Input
                id="register-password"
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Tối thiểu 6 ký tự"
                required
                aria-required="true"
                {...register('password')}
                error={errors.password?.message}
              />
              <button
                type="button"
                className={styles['toggle-password']}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className={styles['confirm-wrapper']}>
            <Input
              id="register-confirm-password"
              label="Xác nhận mật khẩu"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              required
              aria-required="true"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            <button
              type="button"
              className={styles['toggle-password']}
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={
                showConfirm ? 'Ẩn xác nhận mật khẩu' : 'Hiện xác nhận mật khẩu'
              }
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            {confirmTouched && (
              <span
                className={`${styles['match-icon']} ${confirmMatches ? styles['match-icon--match'] : styles['match-icon--mismatch']}`}
                aria-live="polite"
                aria-label={
                  confirmMatches ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'
                }
              >
                {confirmMatches ? '✓' : '✗'}
              </span>
            )}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          className={styles.submit}
        >
          {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>

        {/* Footer link */}
        <p className={styles.footer}>
          Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
