import { faCheckCircle, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';

import styles from './Notification.module.scss';

interface NotificationProps {
    type: 'success' | 'error' | 'info';
    message: string;
    onClose: () => void;
    duration?: number;
    position?: 'top' | 'bottom';
}

const Notification = ({
    type,
    message,
    onClose,
    duration = 5000,
    position = 'top'
}: NotificationProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: faCheckCircle,
        error: faExclamationCircle,
        info: faExclamationCircle,
    };

    return (
        <div className={`${styles.notification} ${styles[type]} ${styles[position]}`}>
            <FontAwesomeIcon icon={icons[type]} className={styles.icon} />
            <span className={styles.message}>{message}</span>
            <button onClick={onClose} className={styles.closeBtn}>
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </div>
    );
};

export default Notification;