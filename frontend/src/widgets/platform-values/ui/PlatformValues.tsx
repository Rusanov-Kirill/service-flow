import { faHandshake, faRocket, faClock } from '@fortawesome/free-solid-svg-icons';

import ValueItem from './components/ValueItem';
import styles from './PlatformValues.module.scss';

const PlatformValues = () => {
    return (
        <section className={styles.values}>
            <div className={styles.wrapper}>
                <h2>Экосистема, которая объединяет</h2>
                <p className='section-desc'>Мы создаем пространство, где специалисты растут, а клиенты находят лучшее</p>
                <div className={styles['values-grid']}>
                    <ValueItem heading='Доверие и прозрачность' icon={faHandshake}>
                        Честные отзывы, реальное расписание, никаких скрытых платежей — всё открыто для обеих сторон
                    </ValueItem>
                    <ValueItem heading='Рост и развитие' icon={faRocket}>
                        Помогаем специалистам масштабироваться, а клиентам — получать услуги на новом уровне
                    </ValueItem>
                    <ValueItem heading='Экономия времени' icon={faClock}>
                        Автоматизация рутины: запись, напоминания, оплата — всё в несколько кликов
                    </ValueItem>
                </div>
            </div>
        </section>
    );
};

export default PlatformValues;