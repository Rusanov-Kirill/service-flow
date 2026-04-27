import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuthStore } from '@/entities/user/store/useAuthStore';
import { authApi } from '@/entities/user/api/authApi';
import FormField from '@/shared/ui/auth/FormField';
import Button from '@/shared/ui/Button';
import { useRedirect } from '@/shared/utils/useRedirect';

import styles from '../../shared-styles/AuthForms.module.scss';
import { loginSchema } from '../model/LoginForm.types';
import type { LoginFormData } from '../model/LoginForm.types';

const LoginForm = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const [isLoading, setIsLoading] = useState(false);
    const [_, setServerError] = useState<string | null>(null);

    const { redirectToRegister } = useRedirect();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setServerError(null);

        try {
            const response = await authApi.login(data);

            if (response.data.success) {
                setAuth(response.data.data.accessToken, response.data.data.user);
            }
        } catch (err) {
            const error = err as AxiosError<{ error: string }>;
            const message = error.response?.data?.error;

            if (message === 'Please verify your email first') {
                setServerError('Подтвердите email перед входом. Проверьте почту.');
            } else {
                setServerError('Неверный email или пароль');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles['auth-form-wrapper']}
        >
            <div className={styles['step-content']}>
                <FormField
                    label='Электронная почта'
                    id='email'
                    type='email'
                    placeholder='ivan@example.com'
                    error={errors.email?.message}
                    {...register('email')}
                />
                <FormField
                    label='Пароль'
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    error={errors.password?.message}
                    {...register('password')}
                />
            </div>

            <div className={styles['nav-button-wrapper']}>
                <Button type="submit" variant="primary">
                    {isLoading ? 'Вход...' : 'Войти'}
                </Button>
            </div>

            <div className={styles['auth-link-wrapper']}>
                <Button
                    type="button"
                    className={styles['auth-link']}
                    onClick={redirectToRegister}
                >
                    Регистрация
                </Button>
            </div>
        </form>
    );
};

export default LoginForm;