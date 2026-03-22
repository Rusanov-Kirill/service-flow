import type { InputHTMLAttributes } from 'react';

import styles from './InputField.module.scss';

const InputField = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <input className={className || styles.input}  {...props}></input>
    );
};

export default InputField;