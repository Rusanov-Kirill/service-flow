import { forwardRef, useRef } from 'react';
import styles from './TimePicker.module.scss';

interface TimePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(({
    label,
    value,
    onChange,
    error,
    required,
}, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.showPicker?.();
            inputRef.current.focus();
        }
    };

    return (
        <div className={styles.timePicker}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <div className={styles.inputWrapper} onClick={handleClick}>
                <input
                    ref={(node) => {
                        if (typeof ref === 'function') ref(node);
                        if (node) inputRef.current = node;
                    }}
                    type="time"
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
});

TimePicker.displayName = 'TimePicker';

export default TimePicker;