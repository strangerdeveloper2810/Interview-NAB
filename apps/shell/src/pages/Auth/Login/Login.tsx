import { type FC, type JSX, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Input, EyeIcon, EyeOffIcon, useToast } from '@nab/shared-ui';
import { apiClient, ApiError } from '@nab/shared-utils';
import type { AuthResult, SuccessResponse } from '@nab/shared-types';
import useAuthStore from '../../../stores/authStore';
import { loginSchema, LoginForm } from '../../../validation/auth.validation';
import styles from './Login.module.scss';

const LoginPage: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    mode: 'onBlur',
    resolver: zodResolver(loginSchema),
  });

  const onSubmitLogin = async (data: LoginForm) => {
    setApiError(null);

    try {
      const response = await apiClient.post<SuccessResponse<AuthResult>>(
        '/auth/login',
        data,
      );
      setAuth(response.data);
      showToast('Đăng nhập thành công!', 'success');
      const redirectTo = response.data.user.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError('Email hoặc mật khẩu không đúng');
      } else {
        setApiError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div role="region" aria-label="Đăng nhập">
      <div className={styles.header}>
        <h1 className={styles.title}>Đăng nhập</h1>
        <p className={styles.subtitle}>Chào mừng bạn trở lại NAB Banking</p>
      </div>

      <form
        className={styles.form}
        aria-label="Form đăng nhập"
        noValidate
        onSubmit={handleSubmit(onSubmitLogin)}
      >
        {apiError && (
          <Alert variant="error" onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        <div className={styles.fields}>
          {/* Email */}
          <Input
            id="login-email"
            type="email"
            label="Email"
            placeholder="example@email.com"
            autoComplete="email"
            autoFocus
            aria-required="true"
            {...register('email')}
            error={errors.email?.message}
          />

          {/* Password */}
          <div className={styles['password-wrapper']}>
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              aria-required="true"
              {...register('password')}
              error={errors.password?.message}
            />
            <button
              type="button"
              className={styles['toggle-password']}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              aria-controls="login-password"
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
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
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>

      {/* Footer link */}
      <p className={styles.footer}>
        Chưa có tài khoản? <Link to="/auth/register">Đăng ký</Link>
      </p>
    </div>
  );
};

export default LoginPage;
