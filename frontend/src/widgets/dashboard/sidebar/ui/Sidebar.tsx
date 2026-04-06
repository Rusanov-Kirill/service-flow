import { NavLink } from 'react-router-dom'

import Button from '@/shared/ui/Button'
import Logo from '@/shared/ui/Logo'
import { useLogout } from '@/shared/utils/useLogout'

import styles from './Sidebar.module.scss'

const Sidebar = () => {
    const logout = useLogout();

    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${styles.link} ${styles.active}` : styles.link;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.wrapper}>
                <Logo type="primary" />

                <nav className={styles.nav}>
                    <NavLink to="/home/profile" className={getLinkClass}>
                        Мой профиль
                    </NavLink>
                    <NavLink to="/home/companies" className={getLinkClass}>
                        Мои компании
                    </NavLink>
                    <NavLink to="/home/dashboard" className={getLinkClass}>
                        Доска предложений
                    </NavLink>
                    <NavLink to="/home/settings" className={getLinkClass}>
                        Настройки
                    </NavLink>
                </nav>
            </div>

            <Button variant='primary' onClick={logout}>Выйти</Button>
        </aside>
    )
}

export default Sidebar