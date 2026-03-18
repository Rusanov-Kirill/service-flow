import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/shared/ui/Button';

import styles from './PricingCard.module.scss';

interface PricingCardProps {
    isPopular?: boolean;
    heading: string;
    price: number;
    features: string[];
    btnVariant: 'primary' | 'secondary';
    btnText: string;
}

const PricingCard = ({ isPopular, heading, price, features, btnVariant, btnText }: PricingCardProps) => {
    return (
        <div className={`${styles['pricing-card']} ${isPopular ? styles.popular : ''}`}>
            {isPopular && <div className={styles['popular-badge']}>Самый популярный</div>}
            <h3>{heading}</h3>
            <div className={styles.price}>{price} ₽ <span>/мес</span></div>
            <ul>
                {features.map((feature, index) => (
                    <li key={index}>
                        <FontAwesomeIcon icon={faCheck} /> {feature}
                    </li>
                ))}
            </ul>
            <Button variant={btnVariant}>{btnText}</Button>
        </div>
    );
};

export default PricingCard;