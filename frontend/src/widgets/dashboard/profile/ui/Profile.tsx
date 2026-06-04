import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { UserCompany } from '@/entities/user';
import { useAuthStore } from '@/entities/user/store/useAuthStore';
import { authApi } from '@/entities/user/api/authApi';
import EditProfileModal from '@/features/edit-profile';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';
import Loader from '@/shared/ui/Loader';

import styles from './Profile.module.scss';

const Profile = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState<UserCompany[]>([]);
  const { user } = useAuthStore();

  const handleOpenCompany = (slug: string) => {
    window.scrollTo(0, 0);
    navigate(`/home/dashboard/${slug}`);
  };

  useEffect(() => {
    const fetchUserCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await authApi.getAllUserCompanies();
        setCompanies(response.data.data || []);
      } catch (error) {
        console.error('Ошибка загрузки компаний:', error);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      };
    };

    if (user) {
      fetchUserCompanies();
    }
  }, [user]);

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
          {isLoading ? (
            <Loader />
          ) : companies.length === 0 ? (
            <div className={styles.empty}>
              У вас еще нет действующих компаний
            </div>
          ) : (
            <div className={styles.companiesList}>
              {companies.filter(c => c.role === 'owner').map((company) => (
                <div key={company.slug} className={styles.companyCard}>
                  <div>
                    <p className={styles.companyName}>{company.name}</p>
                    <span className={styles.slug}>@{company.slug}</span>
                  </div>

                  <button
                    className={styles.openBtn}
                    onClick={() => handleOpenCompany(company.slug)}
                  >
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