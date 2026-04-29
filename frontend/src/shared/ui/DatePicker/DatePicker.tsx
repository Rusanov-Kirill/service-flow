import { forwardRef, useRef, useState } from 'react';
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
    const [tempDate, setTempDate] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddDate = () => {
        if (tempDate) {
            const newDate = new Date(tempDate);
            const exists = value.some(d => 
                d.getFullYear() === newDate.getFullYear() &&
                d.getMonth() === newDate.getMonth() &&
                d.getDate() === newDate.getDate()
            );
            if (!exists) {
                onChange([...value, newDate]);
            }
            setTempDate('');
        }
    };

    const handleRemoveDate = (index: number) => {
        const newDates = [...value];
        newDates.splice(index, 1);
        onChange(newDates);
    };

    const handleInputClick = () => {
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
            <div className={styles.inputRow}>
                <div className={styles.inputWrapper} onClick={handleInputClick}>
                    <input
                        ref={(node) => {
                            if (typeof ref === 'function') ref(node);
                            if (node) inputRef.current = node;
                        }}
                        type="date"
                        className={`${styles.input} ${error ? styles.inputError : ''}`}
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAddDate}
                    className={styles.addButton}
                    disabled={!tempDate}
                >
                    Добавить
                </button>
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;