import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Company } from '@/entities/company';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';
import Loader from '@/shared/ui/Loader';
import { companyApi } from '@entities/company/api/companyApi';

import styles from './PopularCompanies.module.scss';

const PopularCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const data = await companyApi.getAll();
        setCompanies(data);
        setError(null);
      } catch (err: unknown) {
        console.error('Ошибка загрузки компаний:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Не удалось загрузить компании');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if(isLoading) {
    return (
      <div className={styles.wrapper}>
        <Loader />
      </div>
    )
  };

  if (error) {
    return (
      <div className={styles.wrapper}>
        <h3 className={styles.title}>Популярные компании</h3>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Популярные компании</h3>

      <div className={styles.list}>
        {companies.map((c) => (
          <div
            key={c.id}
            className={styles.card}
            onClick={() => navigate(`/home/dashboard/${c.slug}`)}
          >
            <div className={styles.header}>
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
  );
};

export default PopularCompanies;