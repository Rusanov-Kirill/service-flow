import styles from './PreviewCard.module.scss';

type LineWidth = '40' | '70';

interface PreviewCardProps {
    width: LineWidth
}

const PreviewCard = ({ width }: PreviewCardProps ) => {
    return (
        <div className={styles['preview-card']}>
            <div className={styles['preview-line']}></div>
            <div className={`${styles['preview-line']} ${styles.short}`}></div>
            <div className={`${styles['preview-line']} ${styles[`width-${width}`]}`}></div>
        </div>
    );
};

export default PreviewCard;