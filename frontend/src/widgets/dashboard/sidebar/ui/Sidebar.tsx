import { NavLink } from 'react-router-dom';

import { useLogout } from '@/entities/user/hooks/useLogout';
import Button from '@/shared/ui/Button';
import Logo from '@/shared/ui/Logo';
import { useUIStore } from '@/widgets/dashboard/sidebar/store/useUIStore';

import styles from './Sidebar.module.scss';

const Sidebar = () => {
    const logout = useLogout();
    const { isSidebarOpen, closeSidebar } = useUIStore();

    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${styles.link} ${styles.active}` : styles.link;

    const handleLinkClick = () => {
        if (isSidebarOpen) {
            closeSidebar();
        }
    };

    return (
        <>
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.wrapper}>
                    <Logo type="primary" />

                    <nav className={styles.nav}>
                        <NavLink to="/home/profile" className={getLinkClass} onClick={handleLinkClick}>
                            Мой профиль
                        </NavLink>
                        <NavLink to="/home/companies" className={getLinkClass} onClick={handleLinkClick}>
                            Мои компании
                        </NavLink>
                        <NavLink to="/home/dashboard" className={getLinkClass} onClick={handleLinkClick}>
                            Доска предложений
                        </NavLink>
                        <NavLink to="/home/settings" className={getLinkClass} onClick={handleLinkClick}>
                            Настройки
                        </NavLink>
                    </nav>
                </div>

                <Button variant='primary' onClick={logout}>Выйти</Button>
            </aside>
            <div
                className={`${styles.overlay} ${isSidebarOpen ? styles.visible : ''}`}
                onClick={closeSidebar}
            />
        </>
    );
};

export default Sidebar;