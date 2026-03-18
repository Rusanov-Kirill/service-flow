import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';

import styles from './ValueItem.module.scss';

interface ValueItemProps {
    children: ReactNode;
    heading: string;
    icon: IconDefinition;
}

const ValueItem = ({ children, heading, icon }: ValueItemProps) => {
    return (
        <div className={styles['value-item']}>
            <div className={styles['value-icon']}>
                <FontAwesomeIcon icon={icon} />
            </div>
            <h3>{heading}</h3>
            <p>{children}</p>
        </div>
    );
};

export default ValueItem;