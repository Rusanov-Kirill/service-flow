import { useEffect, useState } from 'react';

import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    children?: React.ReactNode; 
}

const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    onConfirm,
    onCancel,
    isLoading = false,
    children,
}: ConfirmModalProps) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsAnimating(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onCancel();
        }, 300);
    };

    const handleConfirm = () => {
        onConfirm();
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className={`${styles.overlay} ${isAnimating ? styles.overlayEnter : styles.overlayExit}`}
                onClick={handleClose}
            />
            <div className={`${styles.modal} ${isAnimating ? styles.modalEnter : styles.modalExit}`}>
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <h3>{title}</h3>
                        <button className={styles.closeBtn} onClick={handleClose}>×</button>
                    </div>
                    <div className={styles.modalBody}>
                        <p>{message}</p>
                        {children && <div className={styles.modalExtra}>{children}</div>}
                    </div>
                    <div className={styles.modalFooter}>
                        <button
                            className={styles.cancelBtn}
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </button>
                        <button
                            className={styles.confirmBtn}
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Загрузка...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;