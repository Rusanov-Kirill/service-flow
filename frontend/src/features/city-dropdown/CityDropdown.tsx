import { faMapPin, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useRef, useEffect } from 'react';

import styles from './CityDropdown.module.scss';
import CitySelector from "./CitySelector";

const CityDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState('Москва');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                toggleDropdown();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className={`${styles['city-selector']} ${isOpen ? styles.active : ''}`}>
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