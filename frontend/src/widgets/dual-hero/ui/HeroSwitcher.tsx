import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './HeroSwitcher.module.scss';

interface HeroSwitcherProps {
    isSpecialist: boolean;
    onSwitch: (value: boolean) => void;
}

const HeroSwitcher = ({ isSpecialist, onSwitch }: HeroSwitcherProps) => {
    return (
        <div className={styles['hero-switcher']}>
            <button
                className={`${styles['switcher-btn']} ${isSpecialist ? styles.active : ''}`}
                onClick={() => onSwitch(true)}
            >
                Я специалист <FontAwesomeIcon icon={faBriefcase} />
            </button>
            <button
                className={`${styles['switcher-btn']} ${!isSpecialist ? styles.active : ''}`}
                onClick={() => onSwitch(false)}
            >
                Я клиент <FontAwesomeIcon icon={faUser} />
            </button>
        </div>
    );
};

export default HeroSwitcher;