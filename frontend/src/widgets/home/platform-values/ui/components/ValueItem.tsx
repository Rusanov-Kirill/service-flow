import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { ReactNode } from 'react';

import styles from './ValueItem.module.scss';
import WidgetHeading from '@/shared/ui/WidgetHeading';

interface ValueItemProps {
    children: ReactNode;
    heading: string;
    icon: IconDefinition;
}

const ValueItem = ({ children, heading, icon }: ValueItemProps) => {
    return (
        <div className={styles['value-item']}>
            <WidgetHeading
                className={styles['value-icon']}
                heading={heading}
                icon={icon}
            >
                {children}
            </WidgetHeading>
        </div>
    );
};

export default ValueItem;