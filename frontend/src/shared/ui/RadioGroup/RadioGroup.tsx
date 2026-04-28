import styles from './RadioGroup.module.scss';

interface RadioOption {
    value: boolean;
    label: string;
}

interface RadioGroupProps {
    label: string;
    options: RadioOption[];
    value: boolean;
    onChange: (value: boolean) => void;
    error?: string;
    required?: boolean;
}

const RadioGroup = ({
    label,
    options,
    value,
    onChange,
    error,
    required,
}: RadioGroupProps) => {
    return (
        <div className={styles.radioGroup}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <div className={styles.options}>
                {options.map((option) => (
                    <label key={String(option.value)} className={styles.radioLabel}>
                        <input
                            type="radio"
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};

export default RadioGroup;