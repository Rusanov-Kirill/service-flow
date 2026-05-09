import { useState, useEffect } from 'react';

import CustomerDetailsModal from '@/features/customer-details-modal';
import { customerApi, type Customer } from '@/entities/customer';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';
import Loader from '@/shared/ui/Loader';

import styles from './CustomerSection.module.scss';

interface CustomerSectionProps {
    companyId: string | undefined;
    canManageCustomers: boolean;
};

export const statusLabels: Record<string, string> = {
    active: 'Активный',
    inactive: 'Неактивный',
    blocked: 'Заблокированный',
};

const CustomerSection = ({ companyId, canManageCustomers }: CustomerSectionProps) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleCustomerClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!companyId) return;

            try {
                setIsLoading(true);

                const customersRes = await customerApi.getAllCompanyCustomers(companyId);
                if (customersRes.success) setCustomers(customersRes.data);
            } catch (err) {
                console.error('Ошибка загрузки:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [companyId]);

    if (isLoading) {
        return (
            <div className={styles.sectionContent}>
                <Loader />
            </div>
        );
    };

    return (
        <>
            <div className={styles.sectionContent}>
                {customers.length > 0 ? (
                    <div className={styles.customerTable}>
                        {customers.map(customer => (
                            <div
                                key={customer.id}
                                className={styles.customerRow}
                                onClick={() => handleCustomerClick(customer)}
                            >
                                <div className={styles.customerAvatar}>
                                    <PlaceholderLogo
                                        src={customer.user?.avatar}
                                        alt="avatar"
                                        variant='profile'
                                    />
                                </div>

                                <div className={styles.customerName}>
                                    {customer.user?.firstName} {customer.user?.lastName}
                                </div>

                                <div className={`${styles.customerStatus} ${styles[`${customer.status}`]}`}>
                                    {statusLabels[customer.status]}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyServices}>
                        <p>Клиенты не найдены</p>
                    </div>
                )}
            </div>

            {isModalOpen && selectedCustomer && (
                <CustomerDetailsModal
                    customer={selectedCustomer}
                    onClose={handleCloseModal}
                    canManageCustomers={canManageCustomers} 
                />
            )}
        </>
    );
};

export default CustomerSection;