import { faStore, faUserClock } from '@fortawesome/free-solid-svg-icons';

import SectionHeading from '@/shared/ui/SectionHeading';

import AudienceCard from './components/AudienceCard';
import styles from './TargetAudience.module.scss';

const TargetAudience = () => {
    const specialistFeatures = [
        'Календарь и онлайн-запись 24/7',
        'Финансовый учёт и отчёты',
        'Клиентская база и история',
        'Напоминания клиентам'
    ];

    const clientFeatures = [
        'Поиск по категориям и городу',
        'Реальное свободное время',
        'Напоминания о записи',
        'История визитов'
    ];

    return (
        <section className={styles['for-whom']}>
            <div className={styles.wrapper}>
                <SectionHeading heading='Для кого ServiceFlow'>
                    Универсальное решение для двух миров
                </SectionHeading>
                <div className={styles['audience-grid']}>
                    <AudienceCard 
                        heading='Специалистам и бизнесу'
                        description='Всё для управления услугами: от самозанятого мастера до небольшой студии с сотрудниками'
                        audienceIcon={faStore}
                        features={specialistFeatures}
                        btnVariant='primary'
                        btnText='Начать работать'
                    />
                    <AudienceCard 
                        heading='Клиентам и покупателям'
                        description='Удобный способ находить специалистов и записываться без звонков и очередей'
                        audienceIcon={faUserClock}
                        features={clientFeatures}
                        btnVariant='secondary'
                        btnText='Найти мастера'
                    />
                </div>
            </div>
        </section>
    );
};

export default TargetAudience;