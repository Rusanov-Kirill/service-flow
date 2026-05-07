import { useRef } from 'react';

import type { CustomWorkSchedule } from '@/entities/company_member';

import styles from './MemberCustomWorkDays.module.scss';

interface MemberCustomWorkDaysProps {
    value: CustomWorkSchedule[];
    onChange: (value: CustomWorkSchedule[]) => void;
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

const MemberCustomWorkDays = ({
    value,
    onChange,
    error,
}: MemberCustomWorkDaysProps) => {
    const startTimeRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
    const endTimeRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

    const handleDayToggle = (day: number) => {
        const dayExists = value.some(d => d.dayOfWeek === day);

        if (dayExists) {
            onChange(value.filter(d => d.dayOfWeek !== day));
        } else {
            onChange([
                ...value,
                {
                    dayOfWeek: day,
                    startWorkTime: '09:00',
                    endWorkTime: '18:00',
                },
            ]);
        }
    };

    const handleTimeChange = (
        day: number,
        field: 'startWorkTime' | 'endWorkTime',
        newTime: string
    ) => {
        const updated = value.map(d =>
            d.dayOfWeek === day
                ? { ...d, [field]: newTime }
                : d
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
            <label className={styles.label}>
                Индивидуальный график работы
            </label>

            <div className={styles.daysGrid}>
                {weekDays.map(day => {
                    const customDay = value.find(
                        d => d.dayOfWeek === day.value
                    );

                    const isActive = !!customDay;

                    return (
                        <div
                            key={day.value}
                            className={`${styles.dayCard} ${
                                isActive ? styles.active : ''
                            }`}
                        >
                            <button
                                type="button"
                                className={`${styles.dayButton} ${
                                    isActive ? styles.activeDay : ''
                                }`}
                                onClick={() => handleDayToggle(day.value)}
                            >
                                {day.label}
                            </button>

                            {isActive && customDay && (
                                <div className={styles.dayTimes}>
                                    <div
                                        className={styles.timeWrapper}
                                        onClick={() =>
                                            handleStartTimeClick(day.value)
                                        }
                                    >
                                        <input
                                            ref={(el) => {
                                                if (el) {
                                                    startTimeRefs.current[
                                                        day.value
                                                    ] = el;
                                                }
                                            }}
                                            type="time"
                                            value={customDay.startWorkTime}
                                            onChange={(e) =>
                                                handleTimeChange(
                                                    day.value,
                                                    'startWorkTime',
                                                    e.target.value
                                                )
                                            }
                                            className={styles.timeInput}
                                        />
                                    </div>

                                    <span className={styles.separator}>—</span>

                                    <div
                                        className={styles.timeWrapper}
                                        onClick={() =>
                                            handleEndTimeClick(day.value)
                                        }
                                    >
                                        <input
                                            ref={(el) => {
                                                if (el) {
                                                    endTimeRefs.current[
                                                        day.value
                                                    ] = el;
                                                }
                                            }}
                                            type="time"
                                            value={customDay.endWorkTime}
                                            onChange={(e) =>
                                                handleTimeChange(
                                                    day.value,
                                                    'endWorkTime',
                                                    e.target.value
                                                )
                                            }
                                            className={styles.timeInput}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {error && (
                <span className={styles.error}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default MemberCustomWorkDays;