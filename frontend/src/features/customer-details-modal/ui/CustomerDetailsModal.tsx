import { useState } from 'react';

import { statusLabels } from '@/features/company-settings/components/CusomerSection/CustomerSection';
import { customerApi, type Customer, type CustomerStatus } from '@/entities/customer';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';
import Button from '@/shared/ui/Button';
import Notification from '@/shared/ui/Notification';
import { CUSTOMER_STATUS } from '@/shared/utils/selectorValues';
import Select from '@/shared/ui/Select';

import styles from './CustomerDetailsModal.module.scss';

interface CustomerDetailsModalProps {
    customer: Customer;
    canManageCustomers?: boolean;
    onClose: () => void;
    onUpdate?: () => void;
}

const weekdayLabels: Record<number, string> = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
    7: 'Воскресенье',
};

const CustomerDetailsModal = ({
    customer,
    canManageCustomers = false,
    onClose,
    onUpdate,
}: CustomerDetailsModalProps) => {
    const [status, setStatus] = useState<CustomerStatus>(customer.status);
    const [isSavingStatus, setIsSavingStatus] = useState<boolean>(false);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    if (!customer) return null;

    const fullName = `${customer.user?.firstName || ''} ${customer.user?.lastName || ''}`.trim();

    const handleSaveStatus = async () => {
        try {
            setIsSavingStatus(true);
            await customerApi.update(customer.id, { status });

            setNotification({
                type: 'success',
                message: `Статус успешно изменен на "${statusLabels[status]}"`,
            });

            if (onUpdate) onUpdate();
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Не удалось изменить статус клиента',
            });
            setStatus(customer.status);
        } finally {
            setIsSavingStatus(false);
        }
    };

    const hasPreferences = customer.preferredWeekDays && customer.preferredWeekDays.length > 0;

    return (
        <>
            <div className={styles.overlay} onClick={onClose}>
                <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.header}>
                        <h2>Информация о клиенте</h2>
                        <button onClick={onClose}>✕</button>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.profile}>
                            <div className={styles.avatar}>
                                <PlaceholderLogo
                                    src={customer.user?.avatar}
                                    alt="avatar"
                                    variant="profile"
                                />
                            </div>

                            <h3>{fullName || 'Без имени'}</h3>
                            <p>{customer.email}</p>
                        </div>

                        <div className={styles.section}>
                            <h4>Статистика</h4>
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Всего записей:</span>
                                    <span className={styles.statValue}>{customer.totalBookings}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Потрачено всего:</span>
                                    <span className={styles.statValue}>{customer.totalSpent} ₽</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Скидка:</span>
                                    <span className={styles.statValue}>{customer.discountRate}%</span>
                                </div>
                            </div>
                        </div>

                        {hasPreferences && (
                            <div className={styles.section}>
                                <h4>Предпочтения</h4>
                                <div className={styles.preferences}>
                                    {customer.preferredWeekDays && customer.preferredWeekDays.length > 0 && (
                                        <div className={styles.preferenceItem}>
                                            <span className={styles.preferenceLabel}>Любимые дни:</span>
                                            <span className={styles.preferenceValue}>
                                                {customer.preferredWeekDays.map(day => weekdayLabels[day]).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={styles.section}>
                            <h4>Статус</h4>
                            {canManageCustomers ? (
                                <div className={styles.statusEditor}>
                                    <Select
                                        label=""
                                        options={CUSTOMER_STATUS}
                                        value={status}
                                        onChange={(value) => setStatus(value as CustomerStatus)}
                                        disabled={isSavingStatus}
                                    />
                                    <button
                                        className={styles.saveBtn}
                                        onClick={handleSaveStatus}
                                        disabled={isSavingStatus || status === customer.status}
                                    >
                                        {isSavingStatus ? 'Сохранение...' : 'Сохранить'}
                                    </button>
                                </div>
                            ) : (
                                <p className={`${styles.statusBadge} ${styles[status]}`}>
                                    {statusLabels[status]}
                                </p>
                            )}
                        </div>

                        {customer.blacklisted && customer.blacklistReason && (
                            <div className={styles.section}>
                                <h4>Причина блокировки</h4>
                                <p className={styles.blacklistReason}>{customer.blacklistReason}</p>
                            </div>
                        )}

                        {customer.notes && (
                            <div className={styles.section}>
                                <h4>Заметки</h4>
                                <p className={styles.notes}>{customer.notes}</p>
                            </div>
                        )}

                        <div className={styles.section}>
                            <h4>Даты</h4>
                            <div className={styles.dates}>
                                {customer.firstBookingDate && (
                                    <div className={styles.dateItem}>
                                        <span className={styles.dateLabel}>Первая запись:</span>
                                        <span className={styles.dateValue}>
                                            {new Date(customer.firstBookingDate).toLocaleDateString('ru-RU')}
                                        </span>
                                    </div>
                                )}
                                {customer.lastBookingDate && (
                                    <div className={styles.dateItem}>
                                        <span className={styles.dateLabel}>Последняя запись:</span>
                                        <span className={styles.dateValue}>
                                            {new Date(customer.lastBookingDate).toLocaleDateString('ru-RU')}
                                        </span>
                                    </div>
                                )}
                                <div className={styles.dateItem}>
                                    <span className={styles.dateLabel}>Дата регистрации:</span>
                                    <span className={styles.dateValue}>
                                        {new Date(customer.createdAt).toLocaleDateString('ru-RU')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <Button onClick={onClose}>Закрыть</Button>
                    </div>
                </div>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                    duration={4000}
                    position="top"
                />
            )}
        </>
    );
};

export default CustomerDetailsModal;