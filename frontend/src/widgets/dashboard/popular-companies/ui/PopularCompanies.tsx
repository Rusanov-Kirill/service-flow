import { useNavigate } from 'react-router-dom';

import { mockCompanies } from '@/features/company-search/ui/mock';
import CompanyLogo from '@/shared/ui/CompanyLogo';

import styles from './PopularCompanies.module.scss';

const PopularCompanies = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Популярные компании</h3>

      <div className={styles.list}>
        {mockCompanies.map((c) => (
          <div
            key={c.id}
            className={styles.card}
            onClick={() => navigate(`/home/dashboard/${c.slug}`)}
          >
            <div className={styles.header}>
              <CompanyLogo
                src={c.logo}
                alt={c.name}
                className={styles.logo}
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