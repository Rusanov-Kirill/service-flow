import { useContext } from 'react';

import { HomePageSectionRefsContext } from '@/pages/home/context';
import Button from '@shared/ui/Button';
import Logo from '@shared/ui/Logo';

import styles from './Header.module.scss';

const Header = () => {
    const refs = useContext(HomePageSectionRefsContext);

    const handleScrollValues = () => refs?.platformValuesRef?.current?.scrollIntoView();
    const handleScrollAudience = () => refs?.targetAudienceRef?.current?.scrollIntoView();
    const handleScrollCapabilities = () => refs?.specialistCapabilitiesRef?.current?.scrollIntoView();
    const handleScrollPricing = () => refs?.pricingRef?.current?.scrollIntoView();

    return (
        <header className={styles.header}>
            <div className={styles.wrapper}>
                <Logo type='header' />
                <nav className={styles['nav-links']}>
                    <button onClick={handleScrollValues}>Ценности</button>
                    <button onClick={handleScrollAudience}>Аудитория</button>
                    <button onClick={handleScrollCapabilities}>Для специалистов</button>
                    <button onClick={handleScrollPricing}>Тарифы</button>
                </nav>
                <div className={styles['auth-buttons']}>
                    <Button variant='secondary'>Войти</Button>
                    <Button variant='primary'>Регистрация</Button>
                </div>
            </div>
        </header>
    );
};

export default Header;