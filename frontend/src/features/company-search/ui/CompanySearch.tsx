import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useRef, useEffect, useMemo, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { Company } from '@/entities/company';
import Button from '@/shared/ui/Button';
import InputField from '@/shared/ui/InputField';
import { useClickOutside } from '@/shared/utils/useClickOutside';
import { useDebounce } from '@/shared/utils/useDebounce';

import styles from './CompanySearch.module.scss';

type SearchMode = 'name' | 'tags';

interface CompanySearchProps {
    companies?: Company[];
    isLoading: boolean;
}

const CompanySearch = memo(({ companies: externalCompanies, isLoading }: CompanySearchProps) => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<SearchMode>('name');
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();
    const { slug } = useParams<{ slug?: string }>();

    const companies = useMemo(
        () => externalCompanies ?? [],
        [externalCompanies]
    );

    const debouncedQuery = useDebounce(query, 500);
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => setIsOpen(false));

    useEffect(() => {
        const getCompanies = async () => {
            if (companies.length === 0) return;

            if (!slug) {
                setQuery('');
                return;
            }

            const company = companies.find((c) => c.slug === slug);

            if (!company) return;

            setQuery((prev) => (prev === company.name ? prev : company.name));
        };

        getCompanies();
    }, [slug, companies]);

    const filtered = useMemo(() => {
        if (!debouncedQuery) return [];

        const searchLower = debouncedQuery.toLowerCase();

        if (mode === 'name') {
            return companies.filter((c) =>
                c.name.toLowerCase().includes(searchLower)
            );
        }

        return companies.filter((c) =>
            c.tags.some((tag) =>
                tag.toLowerCase().startsWith(searchLower)
            )
        );
    }, [debouncedQuery, mode, companies]);

    if (isLoading && companies.length === 0) {
        return (
            <div ref={ref} className={styles.search}>
                <div className={styles.inputWrapper}>
                    <InputField
                        className={styles['company-input']}
                        placeholder="Загрузка компаний..."
                        disabled
                        value={query ?? ''}
                    />
                </div>
            </div>
        );
    };

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
                    <FontAwesomeIcon
                        icon={faArrowRightArrowLeft}
                        className={`${styles.icon} ${mode === 'tags' ? styles.rotated : ''}`}
                    />
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
});

CompanySearch.displayName = 'CompanySearch';

export default CompanySearch;