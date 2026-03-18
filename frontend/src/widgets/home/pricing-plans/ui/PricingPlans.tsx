import SectionHeading from '@/shared/ui/SectionHeading';

import PricingCard from './components/PricingCard';
import styles from './PricingPlans.module.scss';

const PricingPlans = () => {
    const startFeatures = [
        'До 10 записей в месяц',
        'База клиентов',
        'Учет доходов'
    ];

    const proFeautres = [
        'Безлимит записей',
        'Финансовая аналитика',
        'SMS/Telegram напоминания',
        'Интеграции с платежками'
    ];

    const businessFeautres = [
        'Всё из тарифа Профи',
        'До 5 сотрудников',
        'API доступ'
    ];

    return (
        <section className={styles.pricing}>
            <div className={styles.wrapper}>
                <SectionHeading heading='Тарифы для специалистов'>
                    Растём вместе с вами. Можно начать бесплатно.
                </SectionHeading>
                <div className={styles['pricing-grid']}>
                    <PricingCard
                        heading='Старт'
                        price={0}
                        features={startFeatures}
                        btnVariant='secondary'
                        btnText='Попробовать'
                    />
                    <PricingCard
                        isPopular
                        heading='Профи'
                        price={990}
                        features={proFeautres}
                        btnVariant='primary'
                        btnText='Подключить'
                    />
                    <PricingCard
                        heading='Бизнес'
                        price={2490}
                        features={businessFeautres}
                        btnVariant='secondary'
                        btnText='Связаться'
                    />
                </div>
            </div>
        </section>
    );
};

export default PricingPlans;