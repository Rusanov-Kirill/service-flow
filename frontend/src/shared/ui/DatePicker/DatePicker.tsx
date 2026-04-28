import { forwardRef, useRef } from 'react';

import styles from './DatePicker.module.scss';

interface DatePickerProps {
    label: string;
    value: Date[];
    onChange: (dates: Date[]) => void;
    error?: string;
    required?: boolean;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({
    label,
    value,
    onChange,
    error,
    required,
}, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const newDate = new Date(e.target.value);
            if (!value.some(d => d.toDateString() === newDate.toDateString())) {
                onChange([...value, newDate]);
            }
            e.target.value = '';
        }
    };

    const handleRemoveDate = (index: number) => {
        const newDates = [...value];
        newDates.splice(index, 1);
        onChange(newDates);
    };

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.showPicker?.();
            inputRef.current.focus();
        }
    };

    return (
        <div className={styles.datePicker}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <div className={styles.datesList}>
                {value.map((date, index) => (
                    <div key={index} className={styles.dateItem}>
                        <span>{date.toLocaleDateString('ru-RU')}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveDate(index)}
                            className={styles.removeDate}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <div className={styles.inputWrapper} onClick={handleClick}>
                <input
                    ref={(node) => {
                        if (typeof ref === 'function') ref(node);
                        if (node) inputRef.current = node;
                    }}
                    type="date"
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                    onChange={handleAddDate}
                />
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;