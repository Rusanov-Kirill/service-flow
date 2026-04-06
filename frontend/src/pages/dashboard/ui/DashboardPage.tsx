import BurgerButton from '@/shared/ui/BurgerButton';
import DashboardMain from '@/widgets/dashboard/dashboard-main';
import Sidebar from '@widgets/dashboard/sidebar';

import styles from './DashboardPage.module.scss';

const DashboardPage = () => {
    return (
        <div className={styles.layout}>
            <div className={styles.burgerWrapper}>
                <BurgerButton />
            </div>

            <Sidebar />

            <div className={styles.main}>
                <DashboardMain />
            </div>
        </div>

    );
};

export default DashboardPage;