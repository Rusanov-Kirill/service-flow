import Button from '@shared/ui/Button';
import Logo from '@shared/ui/Logo';

import styles from './Header.module.scss';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.wrapper}>
                <Logo type='header' />
                <nav className={styles['nav-links']}>
                    <a href="#">Возможности</a>
                    <a href="#">Для бизнеса</a>
                    <a href="#">Для клиентов</a>
                    <a href="#">Тарифы</a>
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