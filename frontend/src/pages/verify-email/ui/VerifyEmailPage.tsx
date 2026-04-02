import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { apiClient } from '@/shared/api/client';

import styles from './VerifyEmailPage.module.scss';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setError('Токен не найден');
        return;
      }

      try {
        await apiClient.get(`/auth/verify-email?token=${token}`);
        setStatus('success');

        setTimeout(() => navigate('/login?verified=true'), 1500);
      } catch (err) {
        const error = err as AxiosError<{ error: string }>;
        setStatus('error');
        setError(error.response?.data?.error || 'Ошибка подтверждения');
      }
    };

    verify();
  }, [token, navigate]);

  if (status === 'loading') return (
    <div className={styles.container}>
      <h1>⏳ Подтверждаем email...</h1>
    </div>
  );

  if (status === 'success') return (
    <div className={styles.container}>
      <h1>✅ Email подтверждён!</h1>
      <p>Вы будете перенаправлены на страницу входа</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1>❌ Ошибка</h1>
      <p>{error}</p>
    </div>
  );
};

export default VerifyEmailPage;