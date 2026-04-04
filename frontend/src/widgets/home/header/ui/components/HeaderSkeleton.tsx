import styles from '../Header.module.scss';

const HeaderSkeleton = () => {
    return (
        <header className={styles.skeleton}>
            <div className={styles.wrapper}>
                <div className={styles['logo-skeleton']} />
                
                <div className={styles['nav-skeleton']}>
                    <div className={styles['nav-item']} />
                    <div className={styles['nav-item']} />
                    <div className={styles['nav-item']} />
                    <div className={styles['nav-item']} />
                </div>

                <div className={styles['auth-skeleton']}>
                    <div className={styles['auth-button']} />
                    <div className={styles['auth-button']} />
                </div>

                <div className={styles['burger-skeleton']} />
            </div>
        </header>
    );
};

export default HeaderSkeleton;