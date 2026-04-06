import { useState } from 'react';

import CompanySearch from '@/features/company-search';
import { useCompanyStore } from '@/app/store/useCompanyStore';

import styles from './DashboardMain.module.scss';
import OverviewTab from './components/OverviewTab/OverviewTab';

type Tab = 'overview' | 'services' | 'finance' | 'bookings';

const DashboardMain = () => {
  const { selectedCompany } = useCompanyStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <div className={styles.wrapper}>
      <CompanySearch />

      <div className={styles.content}>
        {selectedCompany ? (
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
                <OverviewTab selectedCompany={selectedCompany} />
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
          <div className={styles.placeholder}>
            Выберите компанию, чтобы увидеть информацию
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMain;