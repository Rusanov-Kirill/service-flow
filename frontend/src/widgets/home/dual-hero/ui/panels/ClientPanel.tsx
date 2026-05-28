import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CityDropdown from '@/features/city-dropdown';
import Button from '@/shared/ui/Button';
import InputField from '@/shared/ui/InputField';
import MasterCard from '@/shared/ui/MasterCard';
import SectionHeading from '@/shared/ui/SectionHeading';
import { useRedirect } from '@/shared/utils/useRedirect';

import styles from './ClientPanel.module.scss';

const categories = ['Красота', 'Образование', 'Фитнес', 'Ремонт', 'Консультации'];

const ClientPanel = () => {
    const { redirectToLogin } = useRedirect();

    return (
        <div className={styles['hero-client']}>
            <div className={styles.wrapper}>
                <div className={styles['hero-client-content']}>
                    <SectionHeading heading='Найди мастера и запишись онлайн' headingLevel='1'>
                        Парикмахеры, маникюр, репетиторы, фитнес-тренеры и другие специалисты рядом с вами
                    </SectionHeading>
                    <div className={styles['search-bar']}>
                        <InputField className={styles['search-bar-input']} type="text" placeholder="Что ищете?" />
                        <CityDropdown />
                        <Button isSearch onClick={redirectToLogin}>
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