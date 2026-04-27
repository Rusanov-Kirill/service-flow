import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useUIStore } from '@/widgets/dashboard/sidebar/store/useUIStore';
import Button from '@/shared/ui/Button';

import styles from './BurgerButton.module.scss';

const BurgerButton = () => {
  const { toggleSidebar } = useUIStore();

  return (
    <Button onClick={toggleSidebar} className={styles['slider-button']}>
      <FontAwesomeIcon icon={faAngleRight} />
    </Button>
  );
};

export default BurgerButton;