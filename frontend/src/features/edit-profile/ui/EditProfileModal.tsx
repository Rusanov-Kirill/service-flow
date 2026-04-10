import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { useAuthStore } from '@/app/store/useAuthStore';
import { authApi } from '@/shared/api/authApi';
import FormField from '@/shared/ui/auth/FormField';
import Button from '@/shared/ui/Button';
import Notification from '@/shared/ui/Notification';

import styles from './EditProfileModal.module.scss';
import { editProfileSchema, type EditProfileFormData } from '../model/EditProfileModal.types';

interface EditProfileModalProps {
  onClose: () => void;
};

const EditProfileModal = ({ onClose }: EditProfileModalProps) => {
  const { user, setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      avatar: user?.avatar || '',
    }
  });

  const onSubmit = async (data: EditProfileFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await authApi.updateProfile(data);

      if (response.data.success) {
        setAuth(
          useAuthStore.getState().accessToken!,
          response.data.data.user
        );
        onClose();
      }
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setServerError(error.response?.data?.error || 'Ошибка обновления профиля');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Редактировать профиль</h3>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <FormField
            label="Имя"
            id="firstName"
            placeholder="Иван"
            error={errors.firstName?.message}
            {...register('firstName')}
          />

          <FormField
            label="Фамилия"
            id="lastName"
            placeholder="Иванов"
            error={errors.lastName?.message}
            {...register('lastName')}
          />

          <FormField
            label="Телефон"
            id="phoneNumber"
            type="tel"
            placeholder="+7 (xxx) xxx-xx-xx"
            error={errors.phoneNumber?.message}
            {...register('phoneNumber')}
          />

          <FormField
            label="Аватар (URL)"
            id="avatar"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            error={errors.avatar?.message}
            {...register('avatar')}
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
              disabled={isLoading || !isDirty}
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
    </div>
  );
};

export default EditProfileModal;