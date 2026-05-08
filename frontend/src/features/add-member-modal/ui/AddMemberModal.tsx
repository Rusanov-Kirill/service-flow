import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { companyMemberApi, type MemberRole } from '@/entities/company_member';
import { authApi } from '@/entities/user/api/authApi';
import type { UserPreview } from '@/entities/user';
import FormField from '@/shared/ui/auth/FormField';
import Button from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';
import Notification from '@/shared/ui/Notification';
import { MEMBER_ROLE } from '@/shared/utils/selectorValues';
import { useDebounce } from '@/shared/utils/useDebounce';

import { addMemberSchema, type AddMemberFormData } from '../model/AddMemberModal.types';

import styles from './AddMemberModal.module.scss';

interface AddMemberModalProps {
    companyId: string;
    onClose: () => void;
};

const AddMemberModal = ({ companyId, onClose }: AddMemberModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [userPreview, setUserPreview] = useState<UserPreview | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isUserValid, setIsUserValid] = useState(false);

    const { register, watch, handleSubmit, formState: { errors, isDirty }, setValue } = useForm<AddMemberFormData>({
        resolver: zodResolver(addMemberSchema),
        mode: "onBlur",
        defaultValues: {
            email: '',
            role: 'member',
        }
    });

    const emailValue = watch('email');
    const debouncedEmail = useDebounce(emailValue, 2000);

    useEffect(() => {
        const searchUser = async () => {
            if (!debouncedEmail || errors.email) {
                setUserPreview(null);
                setIsUserValid(false);
                return;
            }

            setIsSearching(true);
            setServerError(null);

            try {
                const response = await authApi.getUserByEmail(debouncedEmail);

                if (response.data.success && response.data.data) {
                    setUserPreview(response.data.data);
                    setIsUserValid(true);
                } else {
                    setUserPreview(null);
                    setIsUserValid(false);
                }
            } catch (error) {
                setUserPreview(null);
                setIsUserValid(false);
            } finally {
                setIsSearching(false);
            }
        };

        searchUser();
    }, [debouncedEmail, errors.email]);

    const onSubmit = async (data: AddMemberFormData) => {
        if (!userPreview || !isUserValid) {
            setServerError('Пользователь с данной почтой не найден');
            return;
        }

        setIsLoading(true);
        setServerError(null);
        setSuccessMessage(null);

        try {
            const response = await companyMemberApi.create({
                companyId: companyId,
                userId: userPreview.id,
                role: data.role,
            });

            if (response.success) {
                setSuccessMessage('Сотрудник успешно добавлен');

                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (err) {
            const error = err as AxiosError<{ error: string }>;
            setServerError(error.response?.data?.error || 'Ошибка добавления сотрудника');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>Добавить сотрудника</h3>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.emailField}>
                        <FormField
                            label="Email пользователя"
                            id="email"
                            placeholder="new-member@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        {debouncedEmail && !errors.email && (
                            <div className={styles.userPreview}>
                                {isSearching ? (
                                    <div className={styles.searching}>
                                        <span>Поиск пользователя...</span>
                                    </div>
                                ) : userPreview ? (
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>
                                            {userPreview.avatar ? (
                                                <img src={userPreview.avatar} alt={`${userPreview.firstName} ${userPreview.lastName}`} />
                                            ) : (
                                                <div className={styles.avatarPlaceholder}>
                                                    {userPreview.firstName?.[0]}{userPreview.lastName?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.userDetails}>
                                            <span className={styles.userName}>
                                                {userPreview.firstName} {userPreview.lastName}
                                            </span>
                                            <span className={styles.userEmail}>
                                                {debouncedEmail}
                                            </span>
                                        </div>
                                        <div className={styles.statusBadge}>
                                            Найден
                                        </div>
                                    </div>
                                ) : debouncedEmail && (
                                    <div className={styles.userNotFound}>
                                        <span>Пользователь не найден</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <Select
                        label="Роль"
                        options={MEMBER_ROLE}
                        value={watch('role')}
                        onChange={(value) => setValue('role', value as MemberRole, { shouldValidate: true })}
                        error={errors.role?.message}
                        required
                        placeholder="Выберите роль для нового сотрудника"
                        disabled={!isUserValid}
                    />

                    <div className={styles.actions}>
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="secondary"
                        >
                            Отмена
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading || !isDirty || !isUserValid}
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </div>
                </form>
            </div>

            {serverError && (
                <Notification
                    type="error"
                    message={serverError}
                    onClose={() => setServerError(null)}
                    position="top"
                />
            )}

            {successMessage && (
                <Notification
                    type="success"
                    message={successMessage}
                    onClose={() => setSuccessMessage(null)}
                    position="top"
                />
            )}
        </div>
    );
};

export default AddMemberModal;