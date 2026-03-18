import PreviewCard from "../PreviewCard/PreviewCard";
import styles from './DashboardPreview.module.scss';

const DashboardPreview = () => {
    return (
        <div className={styles['hero-image']}>
            <div className={styles['dashboard-preview']}>
                <div className={styles['preview-header']}>
                    <span className={`${styles['preview-circle']} ${styles.red}`}></span>
                    <span className={`${styles['preview-circle']} ${styles.yellow}`}></span>
                    <span className={`${styles['preview-circle']} ${styles.green}`}></span>
                </div>
                <div className={styles['preview-content']}>
                    <PreviewCard width='40' />
                    <PreviewCard width='70' />
                    <PreviewCard width='40' />
                    <PreviewCard width='70' />
                </div>
            </div>
        </div>
    );
};

export default DashboardPreview;