import type { Company } from '@/entities/company';

import styles from './OverviewTab.module.scss';

interface OverviewTabProps {
    selectedCompany: Company | null
};

const OverviewTab = ({ selectedCompany }: OverviewTabProps) => {
    return (
        <div className={styles.company}>
            <div className={styles.header}>
                {selectedCompany?.logo && (
                    <img
                        src={selectedCompany.logo}
                        alt={selectedCompany.name}
                        className={styles.logo}
                    />
                )}

                <div>
                    <h2>{selectedCompany?.name}</h2>
                    <span className={styles.slug}>
                        @{selectedCompany?.slug}
                    </span>
                </div>
            </div>

            <div className={styles.section}>
                <h4>Описание</h4>
                <p>{selectedCompany?.description}</p>
            </div>

            <div className={styles.section}>
                <h4>Теги</h4>
                <div className={styles.tags}>
                    {selectedCompany?.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h4>Бизнес-информация</h4>
                <div className={styles.grid}>
                    <div>
                        <span className={styles.label}>Часовой пояс</span>
                        <p>{selectedCompany?.timezone}</p>
                    </div>

                    <div>
                        <span className={styles.label}>Валюта</span>
                        <p>{selectedCompany?.currency}</p>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h4>Адрес</h4>
                {selectedCompany?.address && (
                    <p>{selectedCompany.address}</p>
                )}
            </div>

            <div className={styles.section}>
                <h4>Контакты</h4>
                {selectedCompany?.phone && (
                    <p>📞 {selectedCompany.phone}</p>
                )}
            </div>
        </div>
    );
};

export default OverviewTab;