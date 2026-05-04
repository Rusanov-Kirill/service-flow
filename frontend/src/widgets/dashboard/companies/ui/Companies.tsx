import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '@/entities/user/api/authApi';
import { useAuthStore } from '@/entities/user/store/useAuthStore';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';
import Loader from '@/shared/ui/Loader';
import type { UserCompany } from '@/entities/user';

import styles from './Companies.module.scss';

const roleLabels: Record<string, string> = {
  owner: 'Владелец',
  admin: 'Системный администратор',
  manager: 'Управляющий',
  receptionist: 'Администратор',
  member: 'Сотрудник'
};

const Companies = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [companies, setCompanies] = useState<UserCompany[]>([]);

  const { user } = useAuthStore();

  const navigate = useNavigate();

  const handleOpenCompany = (slug: string) => {
    navigate(`/home/dashboard/${slug}`);
  };

  const handleCreateCompany = () => {
    navigate('/home/companies/create');
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await authApi.getAllUserCompanies();
        setCompanies(response.data.data || []);
      } catch (error) {
        console.error('Ошибка загрузки компаний:', error);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [user]);

  const getRoleClassName = (role: string): string => {
    const roleClassMap: Record<string, string | undefined> = {
      owner: styles.roleOwner,
      admin: styles.roleAdmin,
      manager: styles.roleManager,
      receptionist: styles.roleReceptionist,
      member: styles.roleMember,
    };
    return roleClassMap[role] || styles.roleMember || '';
  };

  if (isLoading) {
    return (
      <div className={styles.companiesPage}>
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      </div>
    );
  }

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
        {companies.length === 0 ? (
          <div className={styles.empty}>
            <p>У вас пока нет компаний</p>
            <button
              className={styles.createEmptyBtn}
              onClick={handleCreateCompany}
            >
              Создать первую компанию
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            {companies.map((company) => (
              <div key={company.slug} className={styles.companyCard}>
                <div className={styles.cardContent}>
                  <div className={styles.left}>
                    <PlaceholderLogo
                      src={company.logo}
                      alt={company.name}
                      className={styles.logo}
                      variant="company"
                    />

                    <div className={styles.info}>
                      <div className={styles.nameRow}>
                        <h3 className={styles.name}>{company.name}</h3>
                        <span className={`${styles.role} ${getRoleClassName(company.role)}`}>
                          {roleLabels[company.role] || company.role}
                        </span>
                      </div>
                      <span className={styles.slug}>@{company.slug}</span>

                      {company.city && (
                        <span className={styles.meta}>
                          г. {company.city}
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