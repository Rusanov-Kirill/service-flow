import { useState, useRef, useEffect, forwardRef } from 'react';
import styles from './MultiSelect.module.scss';

interface MultiSelectProps {
    label: string;
    options: string[];
    value: string[];
    onChange: (value: string[]) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(({
    label,
    options,
    value,
    onChange,
    error,
    placeholder = 'Выберите теги',
    required,
    disabled = false,
}, _ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTag = (tag: string) => {
        if (disabled) return;
        
        if (value.includes(tag)) {
            onChange(value.filter(t => t !== tag));
        } else {
            onChange([...value, tag]);
        }
    };

    const removeTag = (tag: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        onChange(value.filter(t => t !== tag));
    };

    return (
        <div className={`${styles.multiSelect} ${disabled ? styles.disabled : ''}`} ref={wrapperRef}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            
            <div 
                className={`${styles.inputWrapper} ${isOpen ? styles.open : ''} ${error ? styles.error : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className={styles.tagsContainer}>
                    {value.length > 0 ? (
                        value.map(tag => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                                {!disabled && (
                                    <button
                                        type="button"
                                        className={styles.removeTag}
                                        onClick={(e) => removeTag(tag, e)}
                                    >
                                        ×
                                    </button>
                                )}
                            </span>
                        ))
                    ) : (
                        <span className={styles.placeholder}>{placeholder}</span>
                    )}
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
                        {options.length > 0 ? (
                            options.map(option => (
                                <div
                                    key={option}
                                    className={`${styles.option} ${value.includes(option) ? styles.selected : ''}`}
                                    onClick={() => toggleTag(option)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={value.includes(option)}
                                        readOnly
                                        className={styles.checkbox}
                                    />
                                    <span>{option}</span>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noOptions}>
                                Нет доступных тегов
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
});

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;