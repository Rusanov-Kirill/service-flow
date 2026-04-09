import { useState } from 'react';
import styles from './EditProfileModal.module.scss';

type FormState = {
  firstName: string;
  lastName: string;
  avatar: string;
  phoneNumber: string;
};

interface EditProfileModalProps {
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
    phoneNumber?: string;
  };
  onClose: () => void;
};

const EditProfileModal = ({ user, onClose }: EditProfileModalProps) => {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    avatar: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isDirty = Object.values(form).some((v) => v.trim() !== '');

  const handleSubmit = () => {
    console.log('Новые данные:', form);
    onClose();
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleModalClick}>
        <h3>Редактировать профиль</h3>

        <div className={styles.form}>
          <input name="firstName" placeholder={user.firstName} onChange={handleChange} />
          <input name="lastName" placeholder={user.lastName} onChange={handleChange} />
          <input name="avatar" placeholder="Ссылка на аватар" onChange={handleChange} />
          <input name="phoneNumber" placeholder={user.phoneNumber || '+7 (xxx) xxx-xx-xx'} onChange={handleChange} />
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancel}>
            Отмена
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isDirty}
            className={`${styles.submit} ${isDirty ? styles.active : ''}`}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;