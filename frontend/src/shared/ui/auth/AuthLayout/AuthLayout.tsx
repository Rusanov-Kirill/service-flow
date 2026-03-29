import type { ReactNode } from 'react';

import styles from './AuthLayout.module.scss';

interface AuthLayoutProps {
    children?: ReactNode;
    heading: string;
}

const AuthLayout = ({ children, heading }: AuthLayoutProps) => {
    return (
        <div className={styles['wrapper']}>
            <div className={styles['heading-wrapper']}>
                <h1>{heading}</h1>
            </div>
            {children}
        </div>
    );
};

export default AuthLayout;