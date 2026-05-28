import { faCheckCircle, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/shared/ui/Button';
import InputField from '@/shared/ui/InputField';
import SectionHeading from '@/shared/ui/SectionHeading';
import { useRedirect } from '@/shared/utils/useRedirect';

import DashboardPreview from '../components/DashboardPreview';

import styles from './SpecialistPanel.module.scss';

const SpecialistPanel = () => {
    const { redirectToLogin } = useRedirect();

    return (
        <div className={styles['hero-specialist']}>
            <div className={styles.wrapper}>
                <div className={styles['hero-content']}>
                    <SectionHeading heading='Управляй бронированиями и финансами в одном окне' headingLevel='1'>
                        ServiceFlow — SaaS-платформа для самозанятых и малого бизнеса. Онлайн-запись, учет
                        доходов/расходов и аналитика без сложностей.
                    </SectionHeading>
                    <div className={styles['hero-form']}>
                        <InputField type='email' placeholder='Введите ваш email' />
                        <Button variant='primary' size='large' onClick={redirectToLogin}>Начать бесплатно</Button>
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
                <div className={styles.dashboard}>
                    <DashboardPreview/>
                </div>
            </div>
        </div>
    );
};

export default SpecialistPanel;