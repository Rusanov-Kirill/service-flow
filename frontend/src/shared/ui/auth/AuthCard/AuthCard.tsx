import type { ReactNode } from 'react';

import styles from './AuthCard.module.scss';

interface AuthCardProps {
    children?: ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => {
    return (
        <div className={styles['auth-card-wrapper']}>
            {children}
        </div>
    );
};

export default AuthCard;