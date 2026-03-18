import styles from './Button.module.scss';
import type { ButtonProps } from './Button.types.ts';

const Button = ({ children, variant, size, isSearch, ...props }: ButtonProps) => {
    const buttonClasses = isSearch ? styles['search-btn'] : [
        styles.btn,
        styles[`btn-${variant}`],
        styles[`btn-${size}`],
        props.className
    ].filter(Boolean).join(' ');

    return (
        <button className={buttonClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;