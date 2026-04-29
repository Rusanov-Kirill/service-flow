import { DateTime } from 'luxon';
import { useState, useMemo } from 'react';

import { bookingApi } from '@/entities/booking';
import type { Company } from '@/entities/company';
import { useAuthStore } from '@/entities/user/store/useAuthStore';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import Notification from '@/shared/ui/Notification';
import { getDaysInMonth, isToday, getDayConfig, isHoliday, isWorkingDay, isDateSelectable, generateTimeSlots } from '@/shared/utils/dateUtils';
import { TIMEZONES } from '@/shared/utils/selectorValues';

import styles from './BookingsTab.module.scss';

interface BookingsTabProps {
    selectedCompany: Company | null;
}

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
    const [paymentMethod, setPaymentMethod] = useState<string>('');

    if (!selectedCompany) return null;
    if (!user) return null;

    const services = selectedCompany.services || [];
    const selectedService = services.find(s => s.id === selectedServiceId);
    const companyTz = selectedCompany.timezone;

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
            return await bookingApi.getBookedSlots(selectedCompany.id, dateStr, serviceId);
        } catch (err) {
            console.error('Ошибка загрузки слотов:', err);
            return [];
        }
    };

    const handleOpenTimeSlots = async (date: Date, serviceId?: string) => {
        const dt = DateTime.fromObject(
            {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
            },
            { zone: companyTz }
        );
        if (!isDateSelectable(dt, selectedCompany)) {
            setError('Этот день недоступен для бронирования');
            return;
        }

        setSelectedDate(date);
        const targetServiceId = serviceId || selectedServiceId || services[0]?.id;
        if (targetServiceId) {
            setSelectedServiceId(targetServiceId);
            setIsLoading(true);
            try {
                const slots = await fetchBookedSlots(date, targetServiceId);
                setBookedSlots(slots);
            } catch {
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
        setTimeout(() => setShowTimeSlots(false), 300);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        if (selectedCompany.paymentMethods === 'BOTH') {
            setPaymentMethod('cash'); 
        } else if (selectedCompany.paymentMethods === 'CASH') {
            setPaymentMethod('cash');
        } else {
            setPaymentMethod('prepayment');
        }
        setIsAnimating(false);
        setTimeout(() => setShowTimeSlots(false), 300);
        setShowConfirmModal(true);
    };

    const handleConfirmBooking = async () => {
        if (!selectedTime || !selectedServiceId || !selectedService) return;

        const parts = selectedTime.split(':');
        if (parts.length !== 2) {
            setError('Неверный формат времени');
            setShowConfirmModal(false);
            return;
        }

        const hours = Number(parts[0]);
        const minutes = Number(parts[1]);
        if (isNaN(hours) || isNaN(minutes)) {
            setError('Неверный формат времени');
            setShowConfirmModal(false);
            return;
        }

        const dt = DateTime.fromObject(
            {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
                hour: hours,
                minute: minutes,
            },
            { zone: companyTz }
        );

        if (!dt.isValid) {
            setError('Ошибка даты');
            setShowConfirmModal(false);
            return;
        }

        let endTimeLocal = dt.plus({ minutes: selectedService.duration });
        const dayConfig = getDayConfig(selectedCompany, dt);
        const [endHour, endMinute] = dayConfig.endTime.split(':').map(Number);
        const endOfDay = DateTime.fromObject(
            {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
                hour: endHour,
                minute: endMinute,
            },
            { zone: companyTz }
        );

        if (endTimeLocal.isValid && endOfDay.isValid && endTimeLocal > endOfDay) {
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

            setSuccessMessage(`Бронь на ${selectedTime} (${companyTz}) успешно создана`);
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
        const dt = DateTime.fromObject(
            {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            },
            { zone: companyTz }
        ).startOf('day');
        if (!isWorkingDay(dt, selectedCompany)) return [];

        const allSlots = generateTimeSlots(selectedCompany, dt);
        const now = DateTime.now().setZone(companyTz);
        return allSlots.filter(slot => {
            const [h, m] = slot.split(':').map(Number);
            const slotDateTime = dt.set({ hour: h, minute: m });
            if (slotDateTime < now) return false;
            if (bookedSlots.includes(slot)) return false;
            return true;
        });
    }, [selectedService, selectedDate, bookedSlots, selectedCompany, companyTz]);

    const getDayClassName = (day: Date | null) => {
        if (!day) return styles.empty;
        const dt = DateTime.fromObject(
            {
                year: day.getFullYear(),
                month: day.getMonth() + 1,
                day: day.getDate(),
            },
            { zone: companyTz }
        );

        let className = styles.day;
        if (isToday(day)) className = `${className} ${styles.today}`;

        const isSelectable = isDateSelectable(dt, selectedCompany);
        if (!isSelectable) {
            if (!isWorkingDay(dt, selectedCompany) || isHoliday(dt, selectedCompany)) {
                className = `${className} ${styles.holiday}`;
            } else {
                className = `${className} ${styles.disabled}`;
            }
        }
        return className;
    };

    const renderPaymentMethodSelection = () => {
        const methods = selectedCompany.paymentMethods;
        if (methods === 'BOTH') {
            return (
                <div className={styles.paymentMethod}>
                    <span>Способ оплаты:</span>
                    <div className={styles.radioGroup}>
                        <label>
                            <input type="radio" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                            Наличные
                        </label>
                        <label>
                            <input type="radio" value="prepayment" checked={paymentMethod === 'prepayment'} onChange={() => setPaymentMethod('prepayment')} />
                            Предоплата
                        </label>
                    </div>
                </div>
            );
        } else {
            const label = methods === 'CASH' ? 'Наличные' : 'Предоплата';
            return (
                <div className={styles.paymentMethod}>
                    <span>Способ оплаты: {label}</span>
                </div>
            );
        }
    };

    return (
        <div className={styles.bookingsTab}>
            {error && <Notification type="error" message={error} onClose={() => setError(null)} position="top" />}
            {successMessage && <Notification type="success" message={successMessage} onClose={() => setSuccessMessage(null)} position="top" />}

            <div className={styles.selectMode}>
                <div className={styles.calendarSection}>
                    <div className={styles.calendarHeader}>
                        <button onClick={() => changeMonth(-1)}>←</button>
                        <h3>{selectedDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}</h3>
                        <button onClick={() => changeMonth(1)}>→</button>
                    </div>

                    <div className={styles.weekDays}>
                        {weekDays.map(day => <span key={day} className={styles.weekDay}>{day}</span>)}
                    </div>

                    <div className={styles.daysGrid}>
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={getDayClassName(day)}
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
                                        {service.description && <span className={styles.serviceDesc}>{service.description}</span>}
                                    </div>
                                    <div className={styles.serviceMeta}>
                                        <span className={styles.duration}>⏱ {service.duration} мин</span>
                                        <span className={styles.price}>{service.price.toLocaleString()} {service.currency}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    {services.length === 0 && <div className={styles.emptyServices}><p>У компании пока нет услуг</p></div>}
                </div>
            </div>

            {showTimeSlots && selectedService && (
                <>
                    <div className={`${styles.overlay} ${isAnimating ? styles.overlayEnter : styles.overlayExit}`} onClick={handleCloseTimeSlots} />
                    <div className={`${styles.drawer} ${isAnimating ? styles.drawerEnter : styles.drawerExit}`}>
                        <div className={styles.drawerHeader}>
                            <button className={styles.closeBtn} onClick={handleCloseTimeSlots}>×</button>
                            <div className={styles.selectedInfo}>
                                <div className={styles.date}><span>Дата:</span> {selectedDate.toLocaleString('ru-RU', { day: 'numeric', month: 'long' })}</div>
                                <div className={styles.date}><span>Часовой пояс:</span> {selectedCompany.timezone && TIMEZONES.find(tz => tz.value === selectedCompany.timezone)?.label || selectedCompany.timezone}</div>
                                <div className={styles.service}><span>Услуга:</span> {selectedService.name} • {selectedService.duration} мин</div>
                                <div className={styles.price}><span>Стоимость:</span> {selectedService.price.toLocaleString()} {selectedService.currency}</div>
                            </div>
                        </div>

                        <div className={styles.drawerContent}>
                            {availableTimeSlots.length > 0 ? (
                                <>
                                    <h4>Выберите удобное время</h4>
                                    <div className={styles.timeSlotsGrid}>
                                        {availableTimeSlots.map(time => (
                                            <button key={time} className={styles.timeSlot} onClick={() => handleTimeSelect(time)} disabled={isLoading}>
                                                <span className={styles.time}>{time}</span>
                                                <span className={styles.available}>доступно</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className={styles.emptyTimeSlots}>
                                    <div className={styles.noAvailableSlots}>😕 Нет доступных слотов на эту дату</div>
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
            >
                {renderPaymentMethodSelection()}
            </ConfirmModal>

            {isLoading && <div className={styles.loader}>Загрузка...</div>}
        </div>
    );
};

export default BookingsTab;