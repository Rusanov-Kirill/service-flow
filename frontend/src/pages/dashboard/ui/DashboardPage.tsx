import { Outlet } from 'react-router-dom';

import BurgerButton from '@/widgets/dashboard/sidebar/ui/components/BurgerButton';
import Sidebar from '@/widgets/dashboard/sidebar';

import styles from './DashboardPage.module.scss';

const DashboardPage = () => {
    return (
        <div className={styles.layout}>
            <div className={styles.burgerWrapper}>
                <BurgerButton />
            </div>

            <Sidebar />

            <div className={styles.main}>
                <Outlet />
            </div>
        </div>

    );
};

export default DashboardPage;