import type { Company } from '@/entities/company';
import ServiceCard from '@/features/add-service/ui/components/ServiceCard';

import styles from './ServicesTab.module.scss';

interface ServicesTabProps {
    selectedCompany: Company | null;
}

const ServicesTab = ({ selectedCompany }: ServicesTabProps) => {
    if (!selectedCompany) return null;

    const services = selectedCompany.services;

    if (!services || services.length === 0) {
        return (
            <div className={styles.empty}>
                <h3>Услуги не добавлены</h3>
                <p>У этой компании пока нет услуг</p>
            </div>
        );
    }

    return (
        <div className={styles.servicesTab}>
            <div className={styles.header}>
                <h3>Услуги компании</h3>
                <span className={styles.count}>Всего: {services.length}</span>
            </div>

            <div className={styles.servicesList}>
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        mode='view'
                        onRemove={() => {}} 
                    />
                ))}
            </div>
        </div>
    );
};

export default ServicesTab;