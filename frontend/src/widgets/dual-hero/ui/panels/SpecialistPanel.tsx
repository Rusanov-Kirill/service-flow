import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import Button from '@/shared/ui/Button';
import SearchBar from '@/shared/ui/SearchBar';
import DashboardPreview from '../components/DashboardPreview';
import styles from './SpecialistPanel.module.scss';

const SpecialistPanel = () => {
    return (
        <div className={styles['hero-specialist']}>
            <div className={styles.wrapper}>
                <div className={styles['hero-content']}>
                    <h1>Управляй бронированиями и финансами в одном окне</h1>
                    <p>ServiceFlow — SaaS-платформа для самозанятых и малого бизнеса. Онлайн-запись, учет
                        доходов/расходов и аналитика без сложностей.
                    </p>
                    <div className={styles['hero-form']}>
                        <SearchBar type='email' placeholder='Введите ваш email' />
                        <Button variant='primary' size='large'>Начать бесплатно</Button>
                    </div>
                    <div className={styles['hero-stats']}>
                        <span>
                            <FontAwesomeIcon icon={faCheckCircle} /> 14 дней триала
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faCreditCard} /> Без карты
                        </span>
                    </div>
                </div>
                <DashboardPreview />
            </div>
        </div>
    );
};

export default SpecialistPanel;