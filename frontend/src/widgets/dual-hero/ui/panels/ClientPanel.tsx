import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import Button from '@/shared/ui/Button';
import MasterCard from '@/shared/ui/MasterCard';
import SearchBar from '@/shared/ui/SearchBar';
import CityDropdown from '@/shared/ui/SearchBar/CitySelector';

import styles from './ClientPanel.module.scss';

const ClientPanel = () => {
    const [selectedCity, setSelectedCity] = useState('Москва');
    const categories = ['Красота', 'Образование', 'Фитнес', 'Ремонт', 'Консультации'];

    return (
        <div className={styles['hero-client']}>
            <div className={styles.wrapper}>
                <div className={styles['hero-client-content']}>
                    <h1>Найди мастера и запишись онлайн</h1>
                    <p>Парикмахеры, маникюр, репетиторы, фитнес-тренеры и другие специалисты рядом с вами</p>

                    <div className={styles['search-bar']}>
                        <SearchBar className={styles['search-bar-input']} type="text" placeholder="Что ищете?" />
                        <CityDropdown 
                            selectedCity={selectedCity}
                            onCityChange={setSelectedCity}
                        />
                        <Button isSearch>
                            <FontAwesomeIcon icon={faSearch} />
                            <span>Найти</span>
                        </Button>
                    </div>

                    <div className={styles['popular-categories']}>
                        {categories.map(category => (
                            <span key={category} className={styles['category-tag']}>{category}</span>
                        ))}
                    </div>
                </div>

                <div className={styles['hero-client-image']}>
                    <MasterCard initials='АН' name='Анна Петрова' specialty='Мастер маникюра' rating='4.9' />
                    <MasterCard initials='ДМ' name='Дмитрий Соколов' specialty='Фитнес-тренер' rating='4.8' />
                    <MasterCard initials='ЕК' name='Екатерина Волкова' specialty='Репетитор английского' rating='5.0' />
                </div>
            </div>
        </div>
    );
};

export default ClientPanel;