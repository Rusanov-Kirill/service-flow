import { faCheck, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/shared/ui/Button';

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
            <div className={styles['audience-icon']}>
                <FontAwesomeIcon icon={audienceIcon} />
            </div>
            <h3>{heading}</h3>
            <p>{description}</p>
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