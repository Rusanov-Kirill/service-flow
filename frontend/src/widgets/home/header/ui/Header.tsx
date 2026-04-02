import { useContext, useState } from 'react';

import { HomePageSectionRefsContext } from '@/pages/home/context';
import { CloseIcon } from '@/shared/ui/icons/CloseIcon';
import { MenuIcon } from '@/shared/ui/icons/MenuIcon';
import { useRedirect } from '@/shared/utils/useRedirect';
import Button from '@shared/ui/Button';
import Logo from '@shared/ui/Logo';

import styles from './Header.module.scss';

const Header = () => {
    const { redirectToLogin, redirectToRegister } = useRedirect();
    const refs = useContext(HomePageSectionRefsContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScrollValues = () => {
        refs?.platformValuesRef?.current?.scrollIntoView();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleScrollAudience = () => {
        refs?.targetAudienceRef?.current?.scrollIntoView();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleScrollCapabilities = () => {
        refs?.specialistCapabilitiesRef?.current?.scrollIntoView();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleScrollPricing = () => {
        refs?.pricingRef?.current?.scrollIntoView();
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={styles.header}>
            <div className={styles.wrapper}>
                <Logo type='primary' />
                <Button
                    className={styles.burger}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label='Меню'
                >
                    {isMenuOpen ? <MenuIcon /> : <CloseIcon />}
                </Button>
                <div className={`${styles['dropdown-menu']} ${isMenuOpen ? styles.open : ''}`}>
                    <nav className={styles['nav-links']}>
                        <button onClick={handleScrollValues}>Ценности</button>
                        <button onClick={handleScrollAudience}>Аудитория</button>
                        <button onClick={handleScrollCapabilities}>Для специалистов</button>
                        <button onClick={handleScrollPricing}>Тарифы</button>
                    </nav>
                    <Button className={styles['sign-in']}>Войти</Button>
                </div>
                <div className={styles['auth-buttons']}>
                    <Button variant='secondary' onClick={redirectToLogin}>Войти</Button>
                    <Button variant='primary' onClick={redirectToRegister}>Регистрация</Button>
                </div>
            </div>
        </header>
    );
};

export default Header;