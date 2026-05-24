import { useState, useEffect, useMemo } from 'react';
import { bookingApi } from '@/entities/booking';
import { STATUS_LABELS } from '@/shared/utils/selectorValues';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';
import Loader from '@/shared/ui/Loader';
import Button from '@/shared/ui/Button';
import { useAuthStore } from '@/entities/user/store/useAuthStore';

import styles from './MyBookings.module.scss';

interface UserBooking {
    id: string;
    totalPrice: number;
    startTime: string;
    status: string;
    company: {
        id: string;
        name: string;
        slug: string;
        logo?: string | null;
    };
    service: {
        name: string;
        duration: number;
    };
}

interface BookingsResponse {
    success: boolean;
    data: UserBooking[];
}

const statusOrder: Record<string, number> = {
    confirmed: 1,
    pending: 2,
    completed: 3,
    cancelled: 4,
};

const MyBookings = () => {
    const { user } = useAuthStore();
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const sortedBookings = useMemo(() => {
        return [...bookings].sort((a, b) => {
            const orderA = statusOrder[a.status] ?? 999;
            const orderB = statusOrder[b.status] ?? 999;
            return orderA - orderB;
        });
    }, [bookings]);

    useEffect(() => {
        const fetchUserBookings = async () => {
            if (!user?.id) return;

            try {
                setIsLoading(true);
                setError(null);
                const response = await bookingApi.getUserBookings(user.id) as BookingsResponse;
                
                if (response.success && Array.isArray(response.data)) {
                    setBookings(response.data);
                } else {
                    setBookings([]);
                }
            } catch (err) {
                console.error('Ошибка загрузки бронирований:', err);
                setError('Не удалось загрузить бронирования');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserBookings();
    }, [user?.id]);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'pending': return styles.pending;
            case 'confirmed': return styles.confirmed;
            case 'completed': return styles.completed;
            case 'cancelled': return styles.cancelled;
            default: return '';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDuration = (minutes: number) => {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
        }
        return `${minutes} мин`;
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.content}>
                    <Loader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <div className={styles.content}>
                    <div className={styles.errorContainer}>
                        <div className={styles.errorIcon}>⚠️</div>
                        <p>{error}</p>
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Попробовать снова
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className={styles.page}>
                <div className={styles.content}>
                    <div className={styles.emptyContainer}>
                        <div className={styles.emptyIcon}>📅</div>
                        <h3>У вас пока нет бронирований</h3>
                        <p>Запишитесь на услугу в любой компании, и она появится здесь</p>
                        <Button variant="primary" onClick={() => window.location.href = '/home/companies'}>
                            Найти компании
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Мои бронирования</h2>
                    <p className={styles.subtitle}>
                        {bookings.length} {bookings.length === 1 ? 'бронирование' : bookings.length < 5 ? 'бронирования' : 'бронирований'}
                    </p>
                </div>

                <div className={styles.tableWrapper}>
                    <div className={styles.table}>
                        <div className={styles.tableHead}>
                            <div>Компания</div>
                            <div>Услуга</div>
                            <div>Стоимость</div>
                            <div>Длительность</div>
                            <div>Дата</div>
                            <div>Статус</div>
                        </div>

                        <div className={styles.tableBody}>
                            {sortedBookings.map((booking) => (
                                <div key={booking.id} className={styles.row}>
                                    <div className={styles.company}>
                                        <div className={styles.companyInfo}>
                                            <PlaceholderLogo
                                                src={booking.company.logo}
                                                alt={booking.company.name}
                                                className={styles.companyLogo}
                                                variant="company"
                                            />
                                            <div>
                                                <div className={styles.companyName}>
                                                    {booking.company.name}
                                                </div>
                                                <div className={styles.companySlug}>
                                                    @{booking.company.slug}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.service}>
                                        {booking.service.name}
                                    </div>

                                    <div className={styles.price}>
                                        {Number(booking.totalPrice).toLocaleString('ru-RU')} ₽
                                    </div>

                                    <div className={styles.duration}>
                                        {formatDuration(booking.service.duration)}
                                    </div>

                                    <div className={styles.date}>
                                        {formatDate(booking.startTime)}
                                    </div>

                                    <div className={styles.statusCell}>
                                        <span className={`${styles.status} ${getStatusClass(booking.status)}`}>
                                            {STATUS_LABELS[booking.status as keyof typeof STATUS_LABELS]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyBookings;