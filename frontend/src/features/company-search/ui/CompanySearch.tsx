import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/shared/ui/Button';
import InputField from '@/shared/ui/InputField';
import { useClickOutside } from '@/shared/utils/useClickOutside';
import { useDebounce } from '@/shared/utils/useDebounce';

import styles from './CompanySearch.module.scss';
import { mockCompanies } from './mock';

type SearchMode = 'name' | 'tags';

const CompanySearch = () => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<SearchMode>('name');
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();
    const { slug } = useParams<{ slug?: string }>();

    const debouncedQuery = useDebounce(query, 500);

    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => setIsOpen(false));

    useEffect(() => {
        const handleName = async () => {
            if (!slug) {
                setQuery('');
                return;
            }

            const company = mockCompanies.find((c) => c.slug === slug);

            if (company && company.name !== query) {
                setQuery(company.name);
            }
        };

        handleName();
    }, [slug, query]);

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
                        setQuery(e.target.value);
                        setIsOpen(true);
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
                                    navigate(`/home/dashboard/${c.slug}`);
                                    setQuery(c.name);
                                    setIsOpen(false);
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
    );
};

export default CompanySearch;