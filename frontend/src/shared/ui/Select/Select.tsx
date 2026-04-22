import { useState, useRef, useEffect, forwardRef } from 'react';

import styles from './Select.module.scss';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label: string;
    options: readonly SelectOption[] | string[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(({
    label,
    options,
    value,
    onChange,
    error,
    placeholder = 'Выберите',
    required,
    disabled = false,
}, _ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const isStringArray = options.length > 0 && typeof options[0] === 'string';
    
    const formattedOptions = isStringArray 
        ? (options as string[]).map(opt => ({ value: opt, label: opt }))
        : options as SelectOption[];

    const selectedOption = formattedOptions.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue);
        setIsOpen(false);
    };

    return (
        <div 
            className={`${styles.selectField} ${disabled ? styles.disabled : ''}`} 
            ref={wrapperRef}
        >
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            
            <div 
                className={`${styles.selectWrapper} ${isOpen ? styles.open : ''} ${error ? styles.error : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className={styles.selectedValue}>
                    {selectedOption ? selectedOption.label : placeholder}
                </div>
                <svg 
                    className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M4 6L8 10L12 6" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {isOpen && !disabled && (
                <div className={styles.dropdown}>
                    <div className={styles.optionsList}>
                        {formattedOptions.length > 0 ? (
                            formattedOptions.map(option => (
                                <div
                                    key={option.value}
                                    className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <span>{option.label}</span>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noOptions}>
                                Нет доступных опций
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;