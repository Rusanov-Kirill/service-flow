import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import CitySelector from "./CitySelector";
import styles from './CityDropdown.module.scss';

interface CityDropdownProps {
    selectedCity: string;
    onCityChange: (city: string) => void;
}

const CityDropdown = ({ selectedCity, onCityChange }: CityDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleCitySelect = (city: string) => {
        onCityChange(city);
        setIsOpen(false);
    };

    return (
        <div className={`${styles['city-selector']} ${isOpen ? styles.active : ''}`}>
            <div className={styles['selected-city']} onClick={toggleDropdown}>
                <FontAwesomeIcon icon={faMapPin} />
                <span>{selectedCity}</span>
                <FontAwesomeIcon icon={faChevronDown} />
            </div>
            {isOpen && (
                <div className={styles['dropdown-open']}> 
                    <CitySelector
                        selectedCity={selectedCity}
                        onSelect={handleCitySelect}
                    />
                </div>
            )}
        </div>
    );
};

export default CityDropdown;