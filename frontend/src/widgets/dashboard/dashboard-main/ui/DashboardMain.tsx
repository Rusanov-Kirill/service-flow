import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthStore } from '@/app/store/useAuthStore';
import type { Company } from '@/entities/company';
import CompanySearch from '@/features/company-search';
import { companyApi } from '@/shared/api/companyApi';
import PopularCompanies from '@/widgets/dashboard/popular-companies';

import OverviewTab from './components/OverviewTab/OverviewTab';
import ServicesTab from './components/ServicesTab/ServicesTab';
import styles from './DashboardMain.module.scss';

type Tab = 'overview' | 'services' | 'finance' | 'bookings';

const DashboardMain = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [company, setCompany] = useState<Company | null>(null);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const companies = await companyApi.getAll();
        setAllCompanies(companies);

        if (slug) {
          try {
            const foundCompany = await companyApi.getBySlug(slug);
            setCompany(foundCompany);
            setActiveTab('overview');
          } catch (error) {
            console.error('Компания не найдена:', error);
            setCompany(null);
          }
        } else {
          setCompany(null);
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setCompany(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <CompanySearch companies={[]} />

        <div className={styles.content}>
          <div className={styles.skeleton}>
            {/* Скелетон PopularCompanies */}
            <div className={styles.skeletonTitle}>  </div>
            <div className={styles.skeletonGrid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonCardHeader}>
                    <div className={styles.skeletonLogo}></div>
                    <div className={styles.skeletonCardInfo}>
                      <div className={styles.skeletonCardTitle}></div>
                      <div className={styles.skeletonCardSlug}></div>
                    </div>
                  </div>
                  <div className={styles.skeletonCardDescription}></div>
                  <div className={styles.skeletonTags}>
                    <div className={styles.skeletonTag}></div>
                    <div className={styles.skeletonTag}></div>
                    <div className={styles.skeletonTag}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <CompanySearch companies={allCompanies} />

      <div className={styles.content}>
        {company ? (
          <>
            <div className={styles.tabs}>
              <button
                className={activeTab === 'overview' ? styles.activeTab : ''}
                onClick={() => setActiveTab('overview')}
              >
                Обзор
              </button>

              <button
                className={activeTab === 'services' ? styles.activeTab : ''}
                onClick={() => setActiveTab('services')}
              >
                Услуги
              </button>

              {company.ownerId === user?.id ? (
                <button
                  className={activeTab === 'finance' ? styles.activeTab : ''}
                  onClick={() => setActiveTab('finance')}
                >
                  Финансы
                </button>
              ) : null}

              <button
                className={activeTab === 'bookings' ? styles.activeTab : ''}
                onClick={() => setActiveTab('bookings')}
              >
                Бронирования
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'overview' && (
                <OverviewTab selectedCompany={company} />
              )}

              {activeTab === 'services' && (
                <ServicesTab selectedCompany={company} />
              )}

              {activeTab === 'finance' && (
                <div>Финансовая информация</div>
              )}

              {activeTab === 'bookings' && (
                <div>Бронирования</div>
              )}
            </div>
          </>
        ) : (
          <PopularCompanies />
        )}
      </div>
    </div>
  );
};

export default DashboardMain;