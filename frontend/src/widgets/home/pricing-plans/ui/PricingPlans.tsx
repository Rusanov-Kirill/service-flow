import { forwardRef, useState } from 'react';

import SectionHeading from '@/shared/ui/SectionHeading';

import PricingCard from './components/PricingCard';
import styles from './PricingPlans.module.scss';

const PricingPlans = forwardRef<HTMLDivElement>((_, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const plans = [
        { heading: 'Старт', price: 0, features: startFeatures, btnVariant: 'secondary' as const, btnText: 'Попробовать' },
        { heading: 'Профи', price: 990, features: proFeautres, btnVariant: 'primary' as const, btnText: 'Подключить', isPopular: true },
        { heading: 'Бизнес', price: 2490, features: businessFeautres, btnVariant: 'secondary' as const, btnText: 'Связаться' }
    ];

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % plans.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + plans.length) % plans.length);
    };

    return (
        <section ref={ref} className={styles.pricing}>
            <div className={styles.wrapper}>
                <SectionHeading heading='Тарифы для специалистов' headingLevel='2'>
                    Растём вместе с вами. Можно начать бесплатно.
                </SectionHeading>
                {/* Десктопная сетка */}
                <div className={styles['pricing-grid']}>
                    {plans.map((plan, index) => (
                        <PricingCard key={index} {...plan} />
                    ))}
                </div>

                {/* Мобильная карусель */}
                <div className={styles['pricing-carousel']}>
                    <button className={styles['carousel-btn']} onClick={prev} aria-label="Предыдущий тариф">
                        ‹
                    </button>
                    <div className={styles['carousel-track']}>
                        <div
                            className={styles['carousel-slides']}
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {plans.map((plan, index) => (
                                <div key={index} className={styles['carousel-slide']}>
                                    <PricingCard {...plan} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className={styles['carousel-btn']} onClick={next} aria-label="Следующий тариф">
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
});

PricingPlans.displayName = 'PricingPlans';

export default PricingPlans;