import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './CitySelector.module.scss';

interface CitySelectorProps {
    selectedCity: string;
    onSelect: (city: string) => void;
}

const CitySelector = ({ selectedCity, onSelect }: CitySelectorProps) => {
    const cities = [
        { id: 'msk', name: 'Москва' },
        { id: 'spb', name: 'Санкт-Петербург' },
        { id: 'kzn', name: 'Казань' },
        { id: 'nsk', name: 'Новосибирск' },
        { id: 'ekb', name: 'Екатеринбург' },
        { id: 'other', name: 'Другой город' }
    ];

    return (
        <div className={styles['city-dropdown']}>
            {cities.map(city => (
                <div 
                    key={city.id}
                    className={`${styles['city-option']} ${selectedCity === city.name ? styles.active : ''}`}
                    onClick={() => onSelect(city.name)}
                >
                    <FontAwesomeIcon icon={faCheck} />
                    {city.name}
                </div>
            ))}
        </div>
    );
};

export default CitySelector;