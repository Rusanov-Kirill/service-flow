import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/app/store/useAuthStore';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';

import styles from './Companies.module.scss';

const Companies = () => {
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const companies = user?.companies;

  const handleOpenCompany = (slug: string) => {
    navigate(`/home/dashboard/${slug}`);
  };

  const handleCreateCompany = () => {
    navigate('/home/companies/create');
  };

  return (
    <div className={styles.companiesPage}>
      <div className={styles.header}>
        <div>
          <h2>Мои компании</h2>
          <p className={styles.subtitle}>
            Управляйте своими бизнесами и услугами
          </p>
        </div>

        <button className={styles.createBtn} onClick={handleCreateCompany}>
          + Создать компанию
        </button>
      </div>

      <div className={styles.content}>
        {!companies ? (
          <div className={styles.empty}>
            У вас пока нет компаний
          </div>
        ) : (
          <div className={styles.list}>
            {companies?.map((company) => (
              <div key={company.id} className={styles.companyCard}>
                <div className={styles.cardContent}>
                  <div className={styles.left}>
                    <PlaceholderLogo
                      src={company.logo}
                      alt={company.name}
                      className={styles.logo}
                      variant="company"
                    />

                    <div className={styles.info}>
                      <h3 className={styles.name}>{company.name}</h3>
                      <span className={styles.slug}>@{company.slug}</span>

                      {company.city && (
                        <span className={styles.meta}>
                          {`г. ${company.city}`}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button
                      className={styles.openBtn}
                      onClick={() => handleOpenCompany(company.slug)}
                    >
                      Открыть
                    </button>

                    <button className={styles.settingsBtn}>
                      Настройки
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;