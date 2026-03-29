import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
    stepCount: number;
    currentStep: number;
}

const ProgressBar = ({ stepCount, currentStep }: ProgressBarProps) => {
    const progress = (currentStep / stepCount) * 100;

    return (
        <div className={styles.progressBar}>
            <div 
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ProgressBar;