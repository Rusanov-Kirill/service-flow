import { useState } from 'react';

import { useAuthStore } from '@/app/store/useAuthStore';
import EditProfileModal from '@/features/edit-profile';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';

import styles from './Profile.module.scss';

const Profile = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <PlaceholderLogo
            src={user.avatar}
            alt={`Аватар пользователя ${user.firstName + '' + user.lastName}`}
            className={styles.avatar}
            variant='profile'
          />
        </div>

        <div className={styles.info}>
          <h2>
            {user.firstName} {user.lastName}
          </h2>
        </div>

        <button onClick={() => setIsOpen(true)} className={styles.editBtn}>
          Редактировать
        </button>
      </div>

      {isOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsOpen(false)}
        />
      )}

      <div className={styles.card}>
        <h4>Контакты</h4>

        <div className={styles.grid}>
          <div className={styles.item}>
            <span className={styles.label}>Электронная почта</span>
            <p className={styles.emailRow}>
              {user.email}

              {!user.emailVerified && (
                <span className={styles.unverified}>
                  Не подтверждена
                </span>
              )}
            </p>
          </div>

          <div className={styles.item}>
            <span className={styles.label}>Телефон</span>
            <p>{user.phoneNumber || 'Не добавлен'}</p>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h4>Информация</h4>

        <div className={styles.grid}>
          <div className={styles.item}>
            <span className={styles.label}>Последний вход</span>
            <p>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ru-RU') : '—'}</p>
          </div>

          <div className={styles.item}>
            <span className={styles.label}>Дата регистрации</span>
            <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '—'}</p>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h4>Мои компании</h4>

        <div className={styles.companies}>
          {!(user.companies && user.companies.length > 0) ? (
            <div className={styles.empty}>
              У вас еще нету действующих компаний
            </div>
          ) : (
            <div className={styles.companies}>
              {user.companies?.map((c) => (
                <div key={c.slug} className={styles.companyCard}>
                  <div>
                    <p className={styles.companyName}>{c.name}</p>
                    <span className={styles.slug}>@{c.slug}</span>
                  </div>

                  <button className={styles.openBtn}>
                    Открыть
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;