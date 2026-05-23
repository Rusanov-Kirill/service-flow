import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Company } from '@/entities/company';
import { favoritesApi } from '@/entities/favorites';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';
import Loader from '@/shared/ui/Loader';

import styles from './FavoriteCompanies.module.scss';

const FavoriteCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavoriteCompanies = async () => {
      try {
        setIsLoading(true);

        const data = await favoritesApi.getUserFavorites();
        setCompanies(data);
        
      } catch (err: unknown) {
        console.error('Ошибка загрузки избранных компаний:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Не удалось загрузить избранные компании');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteCompanies();
  }, []);

  if(isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <Loader />
        </div>
      </div>
    )
  };

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <h3 className={styles.title}>Избранные компании</h3>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  };

  if (companies.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <h3 className={styles.title}>Избранные компании</h3>
          <div className={styles.emptyContainer}>
            <div className={styles.emptyIcon}>⭐</div>
            <p>У вас пока нет избранных компаний</p>
            <p className={styles.emptyHint}>Добавляйте компании в избранное, чтобы они появились здесь</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h3 className={styles.title}>Избранные компании</h3>

        <div className={styles.list}>
          {companies.map((c) => (
            <div
              key={c.id}
              className={styles.card}
              onClick={() => navigate(`/home/dashboard/${c.slug}`)}
            >
              <div className={styles.cardHeader}>
                <PlaceholderLogo
                  src={c.logo}
                  alt={c.name}
                  className={styles.logo}
                  variant='company'
                />

                <div className={styles.info}>
                  <h4>{c.name}</h4>
                  <span className={styles.slug}>@{c.slug}</span>
                </div>
              </div>

              <p className={styles.description}>
                {c.description || 'Описание отсутствует'}
              </p>

              <div className={styles.tags}>
                {c.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoriteCompanies;