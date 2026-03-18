import { faCalendarCheck, faWallet, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';

import SectionHeading from '@/shared/ui/SectionHeading';

import FeatureCard from './components/FeatureCard';
import styles from './SpecialistCapabilities.module.scss';

const SpecialistCapabilities = () => {
    return (
        <section className={styles['for-specialists']}>
            <div className={styles.wrapper}>
                <SectionHeading heading='Возможности для специалистов'>
                    Всё необходимое для профессионального роста
                </SectionHeading>
                <div className={styles['features-grid']}>
                    <FeatureCard icon={faCalendarCheck} heading='Онлайн-бронирование'>
                        Клиенты записываются 24/7. Синхронизация с календарем, автоматические напоминания.
                    </FeatureCard>
                    <FeatureCard icon={faWallet} heading='Финансовый учёт'>
                        Доходы, расходы, налоги. Автоматическое формирование отчётов.
                    </FeatureCard>
                    <FeatureCard icon={faUsers} heading='CRM для клиентов'>
                        История визитов, заметки, база клиентов.
                    </FeatureCard>
                    <FeatureCard icon={faChartLine} heading='Аналитика'>
                        Наглядные графики, выручка, загрузка.
                    </FeatureCard>
                </div>
            </div>
        </section>
    );
};

export default SpecialistCapabilities;