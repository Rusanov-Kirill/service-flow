import { useMemo, useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormField from '@/shared/ui/auth/FormField';
import ProgressBar from '@/shared/ui/ProgressBar';
import Button from '@/shared/ui/Button';

import { registerSchema } from '../model/RegisterForm.types';
import type { RegisterFormData } from '../model/RegisterForm.types';

import styles from './RegisterForm.module.scss';

const Step1 = () => {
    const { register, formState: { errors } } = useFormContext<RegisterFormData>();

    return (
        <>
            <FormField
                label='Имя'
                id='firstName'
                placeholder='Иван'
                error={errors.firstName?.message}
                {...register('firstName')}
            />
            <FormField
                label='Фамилия'
                id='lastName'
                placeholder='Иванов'
                error={errors.lastName?.message}
                {...register('lastName')}
            />
        </>
    );
};

const Step2 = () => {
    const { register, formState: { errors } } = useFormContext<RegisterFormData>();

    return (
        <FormField
            label='Электронная почта'
            id='email'
            type='email'
            placeholder='ivan@example.com'
            error={errors.email?.message}
            {...register('email')}
        />
    );
};

const Step3 = () => {
    const { register, formState: { errors } } = useFormContext<RegisterFormData>();

    return (
        <FormField
            label='Пароль'
            id='password'
            type='password'
            placeholder='••••••••'
            error={errors.password?.message}
            {...register('password')}
        />
    );
};

const RegisterForm = () => {
    const [step, setStep] = useState(1);

    const methods = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        }
    });

    const { handleSubmit, trigger } = methods;

    const onNext = async () => {
        let fieldsToValidate: (keyof RegisterFormData)[] = [];

        if (step === 1) fieldsToValidate = ['firstName', 'lastName'];
        else if (step === 2) fieldsToValidate = ['email'];
        else return;

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setStep(step + 1);
        }
    };

    const onBack = () => {
        setStep(step - 1);
    };

    const onSubmit = (data: RegisterFormData) => {
        console.log('Регистрация:', data);
        // TODO: отправка на сервер
    };

    const handleConfirm = async () => {
        const isPasswordValid = await trigger('password');
        if (isPasswordValid) {
            handleSubmit(onSubmit)();
        }
    };

    const steps = useMemo(() => [
        <Step1 key="1" />,
        <Step2 key="2" />,
        <Step3 key="3" />
    ], []);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                className={styles['auth-form-wrapper']}
            >
                <ProgressBar stepCount={3} currentStep={step} />
                <h4>Шаг {step} из 3</h4>

                <div className={styles['step-content']}>
                    {steps[step - 1]}
                </div>

                <div className={styles['nav-button-wrapper']}>
                    <Button
                        type="button"
                        onClick={onBack}
                        disabled={step === 1}
                        className={step === 1 ? styles.disabled : ''}
                    >
                        Назад
                    </Button>

                    {step === 3 ? (
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            variant="primary"
                        >
                            Подтвердить
                        </Button>
                    ) : (
                        <Button type="button" onClick={onNext} variant="primary">
                            Далее
                        </Button>
                    )}
                </div>
            </form>
        </FormProvider>
    );
};

export default RegisterForm;