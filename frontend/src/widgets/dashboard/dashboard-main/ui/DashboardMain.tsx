import { useState } from 'react';
import { useParams } from 'react-router-dom';

import CompanySearch from '@/features/company-search';
import { mockCompanies } from '@/features/company-search/ui/mock';
import PopularCompanies from '@/widgets/dashboard/popular-companies';

import OverviewTab from './components/OverviewTab/OverviewTab';
import styles from './DashboardMain.module.scss';

type Tab = 'overview' | 'services' | 'finance' | 'bookings';

const DashboardMain = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const company = mockCompanies.find(c => c.slug === slug);

  return (
    <div className={styles.wrapper}>
      <CompanySearch />

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

              <button
                className={activeTab === 'finance' ? styles.activeTab : ''}
                onClick={() => setActiveTab('finance')}
              >
                Финансы
              </button>

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
                <div>Список услуг (здесь будет позже)</div>
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