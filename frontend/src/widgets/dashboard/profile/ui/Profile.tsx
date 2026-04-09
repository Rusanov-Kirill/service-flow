import { useState } from 'react';

import EditProfileModal from '@/features/edit-profile';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';

import styles from './Profile.module.scss';

const mockUser = {
  email: 'user@mail.com',
  firstName: 'Иван',
  lastName: 'Иванов',
  emailVerified: false,
  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsWnOH5VcpJMtinN689lmKB0ebMS_ttbvS3Q&s',
  phoneNumber: '+7 (547) 123-45-67',
  lastLogin: '2026-04-08',
  createdAt: '2025-12-01',
  companies: [
    { name: 'Barbershop', slug: 'barbershop' },
    { name: 'Yoga Studio', slug: 'yoga-studio' },
  ],
};

const Profile = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <PlaceholderLogo
            src={mockUser.avatar}
            alt={`Аватар пользователя ${mockUser.firstName + '' + mockUser.lastName}`}
            className={styles.avatar}
            variant='profile'
          />
        </div>

        <div className={styles.info}>
          <h2>
            {mockUser.firstName} {mockUser.lastName}
          </h2>
        </div>

        <button onClick={() => setIsOpen(true)} className={styles.editBtn}>
          Редактировать
        </button>
      </div>

      {isOpen && (
        <EditProfileModal
          user={mockUser}
          onClose={() => setIsOpen(false)}
        />
      )}

      <div className={styles.card}>
        <h4>Контакты</h4>

        <div className={styles.grid}>
          <div className={styles.item}>
            <span className={styles.label}>Электронная почта</span>
            <p className={styles.emailRow}>
              {mockUser.email}

              {!mockUser.emailVerified && (
                <span className={styles.unverified}>
                  Не подтверждена
                </span>
              )}
            </p>
          </div>

          <div className={styles.item}>
            <span className={styles.label}>Телефон</span>
            <p>{mockUser.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h4>Информация</h4>

        <div className={styles.grid}>
          <div className={styles.item}>
            <span className={styles.label}>Последний вход</span>
            <p>{mockUser.lastLogin}</p>
          </div>

          <div className={styles.item}>
            <span className={styles.label}>Дата регистрации</span>
            <p>{mockUser.createdAt}</p>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h4>Мои компании</h4>

        <div className={styles.companies}>
          {mockUser.companies.length === 0 ? (
            <div className={styles.empty}>
              У вас еще нету действующих компаний
            </div>
          ) : (
            <div className={styles.companies}>
              {mockUser.companies.map((c) => (
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