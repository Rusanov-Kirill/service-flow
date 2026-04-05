import { NavLink } from 'react-router-dom'

import Button from '@/shared/ui/Button'
import Logo from '@/shared/ui/Logo'

import styles from './Sidebar.module.scss'

const Sidebar = () => {
    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${styles.link} ${styles.active}` : styles.link;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.wrapper}>
                <Logo type="primary" />

                <nav className={styles.nav}>
                    <NavLink to="/profile" className={getLinkClass}>
                        Мой профиль
                    </NavLink>
                    <NavLink to="/companies" className={getLinkClass}>
                        Мои компании
                    </NavLink>
                    <NavLink to="/dashboard" className={getLinkClass}>
                        Доска предложений
                    </NavLink>
                    <NavLink to="/settings" className={getLinkClass}>
                        Настройки
                    </NavLink>
                </nav>
            </div>

            <Button variant='primary'>Выйти</Button>
        </aside>
    )
}

export default Sidebar