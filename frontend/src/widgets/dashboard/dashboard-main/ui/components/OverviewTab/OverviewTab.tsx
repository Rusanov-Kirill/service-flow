import type { Company } from '@/entities/company';
import CompanyLogo from '@/shared/ui/CompanyLogo';

import styles from './OverviewTab.module.scss';

interface OverviewTabProps {
    selectedCompany: Company | null
};

const OverviewTab = ({ selectedCompany }: OverviewTabProps) => {
    if (!selectedCompany) return null;

    const hasAddress = !!selectedCompany.address;
    const hasPhone = !!selectedCompany.phone;
    const hasEmail = !!selectedCompany.email;
    const hasContacts = hasPhone || hasEmail;

    return (
        <div className={styles.company}>
            <div className={styles.header}>
                <CompanyLogo
                    src={selectedCompany.logo}
                    alt={selectedCompany.name}
                    className={styles.logo}
                />

                <div>
                    <h2>{selectedCompany.name}</h2>
                    <span className={styles.slug}>
                        @{selectedCompany.slug}
                    </span>
                </div>
            </div>

            <div className={styles.section}>
                <h4>Описание</h4>
                <p>{selectedCompany.description}</p>
            </div>

            {selectedCompany.tags.length > 0 && (
                <div className={styles.section}>
                    <h4>Теги</h4>
                    <div className={styles.tags}>
                        {selectedCompany.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.section}>
                <h4>Бизнес-информация</h4>
                <div className={styles.grid}>
                    <div>
                        <span className={styles.label}>Часовой пояс</span>
                        <p>{selectedCompany.timezone} ({selectedCompany.city})</p>
                    </div>

                    <div>
                        <span className={styles.label}>Валюта</span>
                        <p>{selectedCompany.currency}</p>
                    </div>
                </div>
            </div>

            {hasAddress && (
                <div className={styles.section}>
                    <h4>Адрес</h4>
                    <p>{selectedCompany.address}</p>
                </div>
            )}

            {hasContacts && (
                <div className={styles.section}>
                    <h4>Контакты</h4>
                    <div className={styles.grid}>
                        {hasPhone && (
                            <div>
                                <span className={styles.label}>Номер телефона</span>
                                <p>📞 {selectedCompany.phone}</p>
                            </div>
                        )}

                        {hasEmail && (
                            <div>
                                <span className={styles.label}>Корпоративная почта</span>
                                <p>{selectedCompany.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewTab;