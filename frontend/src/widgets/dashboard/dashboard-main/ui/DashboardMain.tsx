import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthStore } from '@/entities/user/store/useAuthStore';
import type { Company } from '@/entities/company';
import { companyApi } from '@/entities/company/api/companyApi';
import { useCompanyStore } from '@/entities/company/store/useCompanyStore';
import CompanySearch from '@/features/company-search';
import Loader from '@/shared/ui/Loader';
import PopularCompanies from '@/widgets/dashboard/popular-companies';

import BookingsTab from './components/BookingsTab/BookingsTab';
import OverviewTab from './components/OverviewTab/OverviewTab';
import ServicesTab from './components/ServicesTab/ServicesTab';
import styles from './DashboardMain.module.scss';

type Tab = 'overview' | 'services' | 'finance' | 'bookings';

const DashboardMain = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { user } = useAuthStore();
  const { companies, fetchCompanies, isLoading: isCompaniesLoading } = useCompanyStore();

  const [isCompanyLoading, setIsCompanyLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (!slug) {
      setCompany(null);
      return;
    }

    const fetchCompany = async () => {
      setIsCompanyLoading(true);
      try {
        const foundCompany = await companyApi.getBySlug(slug);
        setCompany(foundCompany);
        setActiveTab('overview');
      } catch (e) {
        console.error(e);
        setCompany(null);
      } finally {
        setIsCompanyLoading(false);
      }
    };

    fetchCompany();
  }, [slug]);

  if (isCompaniesLoading) {
    return (
      <div className={styles.wrapper}>
        <CompanySearch companies={companies} isLoading={isCompaniesLoading} />

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
  };

  return (
    <div className={styles.wrapper}>
      <CompanySearch companies={companies} isLoading={isCompaniesLoading} />

      <div className={styles.content}>
        {company ? (
          <>
            {isCompanyLoading && (
              <Loader />
            )}

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
                <BookingsTab selectedCompany={company} />
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