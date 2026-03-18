import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { ReactNode } from 'react';

import WidgetHeading from '@/shared/ui/WidgetHeading';

import styles from './FeatureCard.module.scss';

interface FeatureCardProps {
    children: ReactNode;
    icon: IconDefinition;
    heading: string;
}

const FeatureCard = ({ children, icon, heading }: FeatureCardProps) => {
    return (
        <div className={styles['feature-card']}>
            <WidgetHeading
                className={styles['feature-icon']}
                heading={heading}
                icon={icon}
            >
                {children}
            </WidgetHeading>
        </div>
    );
};

export default FeatureCard;