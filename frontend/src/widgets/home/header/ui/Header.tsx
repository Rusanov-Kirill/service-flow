import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/app/store/authStore';
import { HomePageSectionRefsContext } from '@/pages/home/context';
import { CloseIcon } from '@/shared/ui/icons/CloseIcon';
import { MenuIcon } from '@/shared/ui/icons/MenuIcon';
import { useRedirect } from '@/shared/utils/useRedirect';
import Button from '@shared/ui/Button';
import Logo from '@shared/ui/Logo';

import HeaderSkeleton from './components/HeaderSkeleton';
import styles from './Header.module.scss';

const Header = () => {
    const navigate = useNavigate();
    const { redirectToLogin, redirectToRegister } = useRedirect();
    const { accessToken, user, logout, isInitialized } = useAuthStore();
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

    const handleLogout = () => {
        logout();
        navigate('/');
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
                        <Button className={styles['sign-in']} onClick={handleLogout}>Выйти</Button>
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
                                onClick={handleLogout}>
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