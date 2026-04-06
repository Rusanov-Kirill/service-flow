import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useRef } from 'react';

import { useCompanyStore } from '@/app/store/useCompanyStore';
import Button from '@/shared/ui/Button';
import InputField from '@/shared/ui/InputField';
import { useClickOutside } from '@/shared/utils/useClickOutside';
import { useDebounce } from '@/shared/utils/useDebounce';

import styles from './CompanySearch.module.scss';

const mockCompanies = [
    {
        id: '1',
        name: 'Barbershop',
        description: 'Лучший барбершоп',
        image: '',
        tags: ['услуги', 'красота'],
    },
    {
        id: '2',
        name: 'Yoga Studio',
        description: 'Йога для всех',
        image: '',
        tags: ['спорт', 'здоровье'],
    },
    {
        id: '3',
        name: 'Music School',
        description: 'Музыка',
        image: '',
        tags: ['образование', 'музыка'],
    },
    {
        id: '4',
        name: 'Music School Number 2',
        description: 'Музыка',
        image: '',
        tags: ['музыка'],
    },
];

type SearchMode = 'name' | 'tags';

const CompanySearch = () => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<SearchMode>('name');
    const [isOpen, setIsOpen] = useState(false);

    const debouncedQuery = useDebounce(query, 500);

    const { setSelectedCompany } = useCompanyStore();

    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => setIsOpen(false));

    const filtered = mockCompanies.filter((c) => {
        if (!debouncedQuery) return false;

        if (mode === 'name') {
            return c.name.toLowerCase().includes(debouncedQuery.toLowerCase());
        }

        return c.tags.some((tag) =>
            tag.toLowerCase().startsWith(debouncedQuery.toLowerCase())
        );
    });

    return (
        <div ref={ref} className={styles.search}>
            <div className={styles.inputWrapper}>
                <InputField
                    className={styles['company-input']}
                    placeholder={
                        mode === 'name'
                            ? 'Введите название компании...'
                            : 'Введите тег (спорт, музыка...)'
                    }
                    value={query}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                />

                <Button
                    className={styles.modeToggle}
                    onClick={() =>
                        setMode((prev) => (prev === 'name' ? 'tags' : 'name'))
                    }
                >
                    {mode === 'name' ? 'Название' : 'Теги'}
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} className={`${styles.icon} ${mode === 'tags' ? styles.rotated : ''}`} />
                </Button>
            </div>

            {isOpen && query && (
                <div className={styles.results}>
                    {filtered.length > 0 ? (
                        filtered.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => {
                                    setSelectedCompany(c)
                                    setIsOpen(false)
                                }}
                                className={styles.item}
                            >
                                {c.name}
                            </div>
                        ))
                    ) : (
                        <div className={styles.empty}>
                            По запросу "<span>{query}</span>" ничего не найдено
                        </div>
                    )}
                </div>
            )}
        </div>
    )
};

export default CompanySearch;