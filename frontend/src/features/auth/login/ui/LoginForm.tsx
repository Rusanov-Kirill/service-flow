import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormField from '@/shared/ui/auth/FormField';
import Button from '@/shared/ui/Button';

import { loginSchema } from '../model/LoginForm.types';
import type { LoginFormData } from '../model/LoginForm.types';

import styles from '../../register/ui/RegisterForm.module.scss';

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors }, trigger } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        const isValid = await trigger();
        if (isValid) {
            console.log('Логин:', data);
            // TODO: отправка на сервер
        }
    };

    const handleRegisterClick = () => {
        console.log('Переход на регистрацию');
        // TODO: редирект на /register
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
                    Подтвердить
                </Button>
            </div>

            <div className={styles['auth-link-wrapper']}>
                <Button
                    type="button"
                    className={styles['auth-link']}
                    onClick={handleRegisterClick}
                >
                   Регистрация
                </Button>
            </div>
        </form>
    );
};

export default LoginForm;