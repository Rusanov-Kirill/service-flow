import { DateTime } from 'luxon';
import { useState, useMemo } from 'react';

import { bookingApi } from '@/entities/booking';
import type { Company } from '@/entities/company';
import { useAuthStore } from '@/entities/user/store/useAuthStore';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import Notification from '@/shared/ui/Notification';
import { getDaysInMonth, isToday } from '@/shared/utils/dateUtils';
import { TIMEZONES } from '@/shared/utils/selectorValues';

import styles from './BookingsTab.module.scss';

interface BookingsTabProps {
    selectedCompany: Company | null;
}

const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00',
    '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
    '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
];

const BookingsTab = ({ selectedCompany }: BookingsTabProps) => {
    const { user } = useAuthStore();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [showTimeSlots, setShowTimeSlots] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    if (!selectedCompany) return null;
    if (!user) return null;

    const services = selectedCompany.services || [];

    const selectedService = services.find(s => s.id === selectedServiceId);

    const days = getDaysInMonth(selectedDate);
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const changeMonth = (increment: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(selectedDate.getMonth() + increment);
        setSelectedDate(newDate);
    };

    const fetchBookedSlots = async (date: Date, serviceId: string) => {
        try {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            const dateStr = `${year}-${month}-${day}`;

            const slots = await bookingApi.getBookedSlots(
                selectedCompany.id,
                dateStr,
                serviceId
            );

            return slots;
        } catch (err) {
            console.error('Ошибка загрузки слотов:', err);
            return [];
        }
    };

    const handleOpenTimeSlots = async (date: Date, serviceId?: string) => {
        setSelectedDate(date);
        const targetServiceId = serviceId || selectedServiceId || services[0]?.id;

        if (targetServiceId) {
            setSelectedServiceId(targetServiceId);
            setIsLoading(true);
            try {
                const slots = await fetchBookedSlots(date, targetServiceId);
                setBookedSlots(slots);
            } catch (err) {
                console.error('Ошибка загрузки слотов:', err);
                setError('Не удалось загрузить доступное время');
            } finally {
                setIsLoading(false);
            }
        }

        setIsAnimating(true);
        setShowTimeSlots(true);
        setError(null);
        setSuccessMessage(null);
    };

    const handleCloseTimeSlots = () => {
        setIsAnimating(false);

        setTimeout(() => {
            setShowTimeSlots(false);
        }, 300);
    };

    const handleTimeSelect = (time: string) => {
        setIsAnimating(false);

        setTimeout(() => {
            setShowTimeSlots(false);
            setSelectedTime(time);
            setShowConfirmModal(true);
        }, 300);
    };

    const handleConfirmBooking = async () => {
        if (!selectedTime) return;

        if (!selectedServiceId || !selectedService) return;

        const parts = selectedTime.split(':');
        if (parts.length !== 2) {
            setError('Неверный формат времени');
            setShowConfirmModal(false);
            return;
        }

        const hours = Number(parts[0]);
        const minutes = Number(parts[1]);

        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
            setError('Неверный формат времени');
            setShowConfirmModal(false);
            return;
        }

        const tz = selectedCompany.timezone;

        const dt = DateTime.fromObject(
            {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
                hour: hours,
                minute: minutes,
            },
            { zone: tz }
        );

        if (!dt.isValid) {
            setError('Ошибка даты');
            setShowConfirmModal(false);
            return;
        }

        let endTimeLocal = dt.plus({ minutes: selectedService.duration });
        const endOfDay = dt.set({ hour: 20, minute: 0 });

        if (endTimeLocal > endOfDay) {
            endTimeLocal = endOfDay;
        }

        const startUTC = dt.toUTC();
        const endUTC = endTimeLocal.toUTC();

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await bookingApi.create({
                companyId: selectedCompany.id,
                serviceId: selectedServiceId,
                startTime: startUTC.toJSDate(),
                endTime: endUTC.toJSDate(),
                totalPrice: Number(selectedService.price),
                status: 'pending',
                userId: user.id,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email,
                phone: user.phoneNumber || undefined,
            });

            setSuccessMessage(`Бронь на ${selectedTime} (${tz}) успешно создана`);

            setShowConfirmModal(false);
            setSelectedTime(null);
            handleCloseTimeSlots();

        } catch (err) {
            console.error('Ошибка бронирования:', err);
            const errorMessage = err instanceof Error ? err.message : 'Ошибка при создании бронирования';
            setError(errorMessage); 
            setShowConfirmModal(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelBooking = () => {
        setShowConfirmModal(false);
        setSelectedTime(null);
        setIsAnimating(true);
        setShowTimeSlots(true);
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const availableTimeSlots = useMemo(() => {
        if (!selectedService) return [];

        const companyTz = selectedCompany.timezone;
        const nowInCompanyTz = DateTime.now().setZone(companyTz);
        const selectedDateInCompanyTz = DateTime.fromObject(
            {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            },
            { zone: companyTz }
        ).startOf('day');

        return timeSlots.filter(time => {
            const [hoursStr, minutesStr] = time.split(':');
            const hours = parseInt(hoursStr || '0');
            const minutes = parseInt(minutesStr || '0');

            const slotDateTime = selectedDateInCompanyTz.set({ hour: hours, minute: minutes, second: 0 });

            if (slotDateTime < nowInCompanyTz) return false;
            if (bookedSlots.includes(time)) return false;

            return true;
        });
    }, [selectedService, selectedCompany, selectedDate, bookedSlots]);

    return (
        <div className={styles.bookingsTab}>
            {error && (
                <Notification
                    type="error"
                    message={error}
                    onClose={() => setError(null)}
                    position="top"
                />
            )}
            {successMessage && (
                <Notification
                    type="success"
                    message={successMessage}
                    onClose={() => setSuccessMessage(null)}
                    position="top"
                />
            )}

            <div className={styles.selectMode}>
                <div className={styles.calendarSection}>
                    <div className={styles.calendarHeader}>
                        <button onClick={() => changeMonth(-1)}>←</button>
                        <h3>
                            {selectedDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button onClick={() => changeMonth(1)}>→</button>
                    </div>

                    <div className={styles.weekDays}>
                        {weekDays.map(day => (
                            <span key={day} className={styles.weekDay}>{day}</span>
                        ))}
                    </div>

                    <div className={styles.daysGrid}>
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={`${styles.day} ${!day ? styles.empty : ''} ${day && isToday(day) ? styles.today : ''}`}
                                onClick={() => day && handleOpenTimeSlots(day)}
                            >
                                {day && <span className={styles.dayNumber}>{day.getDate()}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.servicesSection}>
                    <h4>Выберите услугу</h4>
                    <div className={styles.servicesList}>
                        {services.map(service => (
                            <button
                                key={service.id}
                                className={`${styles.serviceCard} ${selectedServiceId === service.id ? styles.selected : ''}`}
                                onClick={() => {
                                    setSelectedServiceId(service.id);
                                    if (showTimeSlots) {
                                        setShowTimeSlots(false);
                                        setTimeout(() => setShowTimeSlots(true), 50);
                                    }
                                }}
                            >
                                <div className={styles.serviceContent}>
                                    <div className={styles.serviceInfo}>
                                        <strong className={styles.serviceName}>{service.name}</strong>
                                        {service.description && (
                                            <span className={styles.serviceDesc}>{service.description}</span>
                                        )}
                                    </div>
                                    <div className={styles.serviceMeta}>
                                        <span className={styles.duration}>⏱ {service.duration} мин</span>
                                        <span className={styles.price}>{service.price.toLocaleString()} {service.currency}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    {services.length === 0 && (
                        <div className={styles.emptyServices}>
                            <p>У компании пока нет услуг</p>
                        </div>
                    )}
                </div>
            </div>

            {showTimeSlots && selectedService && (
                <>
                    <div className={`${styles.overlay} ${isAnimating ? styles.overlayEnter : styles.overlayExit}`} onClick={handleCloseTimeSlots} />
                    <div className={`${styles.drawer} ${isAnimating ? styles.drawerEnter : styles.drawerExit}`}>
                        <div className={styles.drawerHeader}>
                            <button className={styles.closeBtn} onClick={handleCloseTimeSlots}>×</button>
                            <div className={styles.selectedInfo}>
                                <div className={styles.date}>
                                    <span>Дата:</span> {selectedDate.toLocaleString('ru-RU', { day: 'numeric', month: 'long' })}
                                </div>
                                <div className={styles.date}>
                                    <span>Часовой пояс:</span> {selectedCompany.timezone && TIMEZONES.find(tz => tz.value === selectedCompany.timezone)?.label || selectedCompany.timezone}
                                </div>
                                <div className={styles.service}>
                                    <span>Услуга:</span> {selectedService.name} • {selectedService.duration} мин
                                </div>
                                <div className={styles.price}>
                                    <span>Стоимость:</span> {selectedService.price.toLocaleString()} {selectedService.currency}
                                </div>
                            </div>
                        </div>

                        <div className={styles.drawerContent}>
                            {availableTimeSlots.length > 0 ? (
                                <>
                                    <h4>Выберите удобное время</h4>
                                    <div className={styles.timeSlotsGrid}>
                                        {availableTimeSlots.map(time => (
                                            <button
                                                key={time}
                                                className={styles.timeSlot}
                                                onClick={() => handleTimeSelect(time)}
                                                disabled={isLoading}
                                            >
                                                <span className={styles.time}>{time}</span>
                                                <span className={styles.available}>доступно</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className={styles.emptyTimeSlots}>
                                    <div className={styles.noAvailableSlots}>
                                        😕 Нет доступных слотов на эту дату
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            <ConfirmModal
                isOpen={showConfirmModal}
                title="Подтверждение бронирования"
                message={`Вы действительно хотите забронировать ${selectedService?.name} на ${selectedDate.toLocaleString('ru-RU', { day: 'numeric', month: 'long' })} в ${selectedTime}?`}
                confirmText="Подтвердить"
                cancelText="Отмена"
                onConfirm={handleConfirmBooking}
                onCancel={handleCancelBooking}
                isLoading={isLoading}
            />

            {isLoading && (
                <div className={styles.loader}>Загрузка...</div>
            )}
        </div>
    );
};

export default BookingsTab;