import type { ReactNode, InputHTMLAttributes } from 'react';

import styles from './FormField.module.scss';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    id?: string;
    children?: ReactNode;
}

const FormField = ({ label, error, id, children, ...props }: FormFieldProps) => {
    const fieldId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
        <div className={styles.field}>
            <label htmlFor={fieldId} className={styles.label}>
                {label}
            </label>
            {children || <input id={fieldId} className={styles.input} {...props} />}
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};

export default FormField;