import { useRef } from 'react';

import type { CustomWorkDay } from '@/entities/company/model/types';

import styles from './CustomWorkDays.module.scss';

interface CustomWorkDaysProps {
    value: CustomWorkDay[];
    onChange: (value: CustomWorkDay[]) => void;
    error?: string;
}

const weekDays = [
    { value: 1, label: 'Пн' },
    { value: 2, label: 'Вт' },
    { value: 3, label: 'Ср' },
    { value: 4, label: 'Чт' },
    { value: 5, label: 'Пт' },
    { value: 6, label: 'Сб' },
    { value: 7, label: 'Вс' },
];

const CustomWorkDays = ({ value, onChange, error }: CustomWorkDaysProps) => {
    const startTimeRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
    const endTimeRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
    const intervalRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

    const handleDayToggle = (day: number) => {
        const dayExists = value.some(d => d.dayOfWeek === day);

        if (dayExists) {
            onChange(value.filter(d => d.dayOfWeek !== day));
        } else {
            onChange([...value, { dayOfWeek: day, startTime: '09:00', endTime: '18:00', slotInterval: 30 }]);
        }
    };

    const handleTimeChange = (day: number, field: 'startTime' | 'endTime', newTime: string) => {
        const updated = value.map(d =>
            d.dayOfWeek === day ? { ...d, [field]: newTime } : d
        );
        onChange(updated);
    };

    const handleIntervalChange = (day: number, newInterval: number) => {
        const updated = value.map(d =>
            d.dayOfWeek === day ? { ...d, slotInterval: newInterval } : d
        );
        onChange(updated);
    };

    const handleStartTimeClick = (day: number) => {
        startTimeRefs.current[day]?.showPicker?.();
        startTimeRefs.current[day]?.focus();
    };

    const handleEndTimeClick = (day: number) => {
        endTimeRefs.current[day]?.showPicker?.();
        endTimeRefs.current[day]?.focus();
    };

    return (
        <div className={styles.customWorkDays}>
            <label className={styles.label}>Рабочие дни и расписание</label>
            <div className={styles.daysGrid}>
                {weekDays.map(day => {
                    const customDay = value.find(d => d.dayOfWeek === day.value);
                    const isActive = !!customDay;
                    return (
                        <div key={day.value} className={`${styles.dayCard} ${isActive ? styles.active : ''}`}>
                            <button
                                type="button"
                                className={`${styles.dayButton} ${isActive ? styles.activeDay : ''}`}
                                onClick={() => handleDayToggle(day.value)}
                            >
                                {day.label}
                            </button>
                            {isActive && (
                                <>
                                    <div className={styles.dayTimes}>
                                        <div 
                                            className={styles.timeWrapper} 
                                            onClick={() => handleStartTimeClick(day.value)}
                                        >
                                            <input
                                                ref={(el) => {
                                                    if (el) startTimeRefs.current[day.value] = el;
                                                }}
                                                type="time"
                                                value={customDay.startTime}
                                                onChange={(e) => handleTimeChange(day.value, 'startTime', e.target.value)}
                                                className={styles.timeInput}
                                            />
                                        </div>
                                        <span className={styles.separator}>—</span>
                                        <div 
                                            className={styles.timeWrapper} 
                                            onClick={() => handleEndTimeClick(day.value)}
                                        >
                                            <input
                                                ref={(el) => {
                                                    if (el) endTimeRefs.current[day.value] = el;
                                                }}
                                                type="time"
                                                value={customDay.endTime}
                                                onChange={(e) => handleTimeChange(day.value, 'endTime', e.target.value)}
                                                className={styles.timeInput}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.intervalWrapper}>
                                        <label className={styles.intervalLabel}>Интервал (мин)</label>
                                        <input
                                            ref={(el) => {
                                                if (el) intervalRefs.current[day.value] = el;
                                            }}
                                            type="number"
                                            min={15}
                                            max={120}
                                            step={15}
                                            value={customDay.slotInterval || 30}
                                            onChange={(e) => handleIntervalChange(day.value, parseInt(e.target.value) || 30)}
                                            className={styles.intervalInput}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};

export default CustomWorkDays;