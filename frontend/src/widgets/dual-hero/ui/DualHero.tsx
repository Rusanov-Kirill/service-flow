import { useState } from 'react';

import styles from './DualHero.module.scss';
import HeroSwitcher from './HeroSwitcher.tsx';
import ClientPanel from './panels/ClientPanel.tsx';
import SpecialistPanel from './panels/SpecialistPanel.tsx';

const DualHero = () => {
    const [isSpecialist, setIsSpecialist] = useState<boolean>(true);

    return (
        <section className={styles['dual-hero']}>
            <div className={styles.wrapper}>
                <HeroSwitcher
                    isSpecialist={isSpecialist}
                    onSwitch={setIsSpecialist}
                />
                <div className={styles['hero-container']}>
                    <div key={isSpecialist ? 'spec' : 'client'} className={styles['hero-animation']}>
                        {isSpecialist ? <SpecialistPanel /> : <ClientPanel />}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DualHero;