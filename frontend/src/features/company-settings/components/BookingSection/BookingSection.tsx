import { useEffect, useState, useMemo } from 'react';

import { bookingApi, type BookingStatus } from '@/entities/booking';
import ChangeStatusModal from '@/shared/ui/ChangeStatusModal';
import { STATUS_LABELS } from '@/shared/utils/selectorValues';
import Loader from '@/shared/ui/Loader';

import styles from './BookingSection.module.scss';

interface BookingsSectionProps {
    companyId?: string;
    canManageStatus: boolean;
}

interface BookingItem {
    id: string;
    totalPrice: number;
    startTime: string;
    status: BookingStatus;

    customer: {
        user?: {
            firstName?: string | null;
            lastName?: string | null;
        } | null;
    };

    service: {
        name: string;
        duration: number;
    };
}

const BookingsSection = ({ companyId, canManageStatus }: BookingsSectionProps) => {
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const sortedBookings = useMemo(() => {
        return [...bookings].sort((a, b) => {
            const dateA = new Date(a.startTime).getTime();
            const dateB = new Date(b.startTime).getTime();
            return dateA - dateB; 
        });
    }, [bookings]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!companyId) return;

            try {
                setIsLoading(true);
                const response = await bookingApi.getAllBookings(companyId);

                if (response.success && Array.isArray(response.data)) {
                    setBookings(response.data);
                } else if (Array.isArray(response)) {
                    setBookings(response);
                } else {
                    console.error('Неожиданный формат ответа:', response);
                    setBookings([]);
                }
            } catch (error) {
                console.error('Ошибка загрузки бронирований:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [companyId]);

    const handleStatusClick = (booking: BookingItem) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleStatusChange = async (newStatus: BookingStatus) => {
        if (!selectedBooking) return;

        try {
            setIsUpdating(true);
            await bookingApi.update(selectedBooking.id, { status: newStatus });

            setBookings(prev =>
                prev.map(booking =>
                    booking.id === selectedBooking.id
                        ? { ...booking, status: newStatus as BookingStatus }
                        : booking
                )
            );

            setIsModalOpen(false);
            setSelectedBooking(null);
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusClass = (status: BookingStatus) => {
        switch (status) {
            case 'pending':
                return styles.pending;

            case 'confirmed':
                return styles.confirmed;

            case 'completed':
                return styles.completed;

            case 'cancelled':
                return styles.cancelled;

            default:
                return '';
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loaderWrapper}>
                <Loader />
            </div>
        );
    }

    if (!bookings.length) {
        return (
            <div className={styles.empty}>
                Бронирований пока нет
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.table}>
                <div className={styles.tableHead}>
                    <div>Клиент</div>
                    <div>Услуга</div>
                    <div>Стоимость</div>
                    <div>Дата</div>
                    <div>Длительность</div>
                    <div>Статус</div>
                </div>

                <div className={styles.tableBody}>
                    {sortedBookings.map((booking) => {
                        const customerName = `${booking.customer?.user?.firstName ?? ''} ${booking.customer?.user?.lastName ?? ''}`.trim();

                        return (
                            <div
                                key={booking.id}
                                className={styles.row}
                                onClick={() => canManageStatus && handleStatusClick(booking)}
                            >
                                <div className={styles.customer}>
                                    {customerName || 'Без имени'}
                                </div>

                                <div>
                                    {booking.service.name}
                                </div>

                                <div>
                                    {Number(booking.totalPrice).toLocaleString('ru-RU')} ₽
                                </div>

                                <div>
                                    {new Date(booking.startTime).toLocaleString('ru-RU', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>

                                <div>
                                    {booking.service.duration} мин
                                </div>

                                <div>
                                    <span className={`${styles.status} ${getStatusClass(booking.status)}`}>
                                        {STATUS_LABELS[booking.status]}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isModalOpen && selectedBooking && (
                <ChangeStatusModal
                    currentStatus={selectedBooking.status}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedBooking(null);
                    }}
                    onConfirm={handleStatusChange}
                    isLoading={isUpdating}
                />
            )}
        </div>
    );
};

export default BookingsSection;