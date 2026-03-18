import { faCheck, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/shared/ui/Button';
import WidgetHeading from '@/shared/ui/WidgetHeading';

import styles from './AudienceCard.module.scss';

interface AudienceCardProps {
    heading: string;
    description: string;
    audienceIcon: IconDefinition;
    features: string[];
    btnVariant: 'primary' | 'secondary';
    btnText: string;
}

const AudienceCard = ({ heading, description, audienceIcon, features, btnVariant, btnText }: AudienceCardProps) => {
    return (
        <div className={styles['audience-card']}>
            <WidgetHeading
                className={styles['audience-icon']}
                heading={heading}
                icon={audienceIcon}
            >
                {description}
            </WidgetHeading>
            <ul className={styles['audience-features']}>
                {features.map((feature, index) => (
                    <li key={index}>
                        <FontAwesomeIcon icon={faCheck} />
                        {feature}
                    </li>
                ))}
            </ul>
            <Button variant={btnVariant}>{btnText}</Button>
        </div>
    );
};

export default AudienceCard;