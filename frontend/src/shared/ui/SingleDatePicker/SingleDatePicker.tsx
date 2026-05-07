import { forwardRef, useRef } from 'react';

import styles from './SingleDatePicker.module.scss';

interface SingleDatePickerProps {
    label: string;
    value?: string; // ← строка вместо Date
    onChange: (date?: string) => void; // ← строку возвращаем
    error?: string;
    required?: boolean;
}

const SingleDatePicker = forwardRef<
    HTMLInputElement,
    SingleDatePickerProps
>(
    (
        {
            label,
            value,
            onChange,
            error,
            required,
        },
        ref
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);

        const handleInputClick = () => {
            inputRef.current?.showPicker?.();
            inputRef.current?.focus();
        };

        return (
            <div className={styles.datePicker}>
                <label className={styles.label}>
                    {label}
                    {required && (
                        <span className={styles.required}>*</span>
                    )}
                </label>

                <div
                    className={styles.inputWrapper}
                    onClick={handleInputClick}
                >
                    <input
                        ref={(node) => {
                            if (typeof ref === 'function') {
                                ref(node);
                            }

                            if (node) {
                                inputRef.current = node;
                            }
                        }}
                        type="date"
                        className={`${styles.input} ${error ? styles.inputError : ''}`}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value || undefined)}
                    />
                </div>

                {error && (
                    <span className={styles.error}>
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

SingleDatePicker.displayName = 'SingleDatePicker';

export default SingleDatePicker;