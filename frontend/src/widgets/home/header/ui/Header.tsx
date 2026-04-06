import { useContext, useState } from 'react';

import { useAuthStore } from '@/app/store/useAuthStore';
import { LandingPageSectionRefsContext } from '@/pages/landing/context';
import { CloseIcon } from '@/shared/ui/icons/CloseIcon';
import { MenuIcon } from '@/shared/ui/icons/MenuIcon';
import { useLogout } from '@/shared/utils/useLogout';
import { useRedirect } from '@/shared/utils/useRedirect';
import Button from '@shared/ui/Button';
import Logo from '@shared/ui/Logo';

import HeaderSkeleton from './components/HeaderSkeleton';
import styles from './Header.module.scss';

const Header = () => {
    const { redirectToLogin, redirectToRegister } = useRedirect();
    const { accessToken, user, isInitialized } = useAuthStore();
    const logout = useLogout();
    const refs = useContext(LandingPageSectionRefsContext);
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

    if (!isInitialized) {
        return <HeaderSkeleton />;
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
                    {!accessToken ?
                        <Button className={styles['sign-in']} onClick={redirectToLogin}>Войти</Button>
                        :
                        <Button className={styles['sign-in']} onClick={logout}>Выйти</Button>
                    }
                </div>
                <div className={styles['auth-buttons']}>
                    {accessToken ? (
                        <div className={styles['user-menu']}>
                            <div className={styles.avatar}>
                                {user?.firstName?.charAt(0)?.toUpperCase()
                                    || user?.email?.charAt(0)?.toUpperCase()
                                    || 'U'}
                            </div>

                            <Button className={styles['my-profile']}>
                                Мой профиль
                            </Button>

                            <Button
                                className={`${styles['my-profile']} ${styles.logout}`}
                                onClick={logout}>
                                Выйти
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Button variant='secondary' onClick={redirectToLogin}>
                                Войти
                            </Button>
                            <Button variant='primary' onClick={redirectToRegister}>
                                Регистрация
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;