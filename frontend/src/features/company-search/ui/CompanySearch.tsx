import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { companyApi } from '@/shared/api/companyApi';
import type { Company } from '@/entities/company';
import Button from '@/shared/ui/Button';
import InputField from '@/shared/ui/InputField';
import { useClickOutside } from '@/shared/utils/useClickOutside';
import { useDebounce } from '@/shared/utils/useDebounce';

import styles from './CompanySearch.module.scss';

type SearchMode = 'name' | 'tags';

interface CompanySearchProps {
    companies?: Company[];
}

const CompanySearch = ({ companies: externalCompanies }: CompanySearchProps) => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<SearchMode>('name');
    const [isOpen, setIsOpen] = useState(false);
    const [localCompanies, setLocalCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { slug } = useParams<{ slug?: string }>();

    const debouncedQuery = useDebounce(query, 500);
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => setIsOpen(false));

    useEffect(() => {
        const fetchCompanies = async () => {
            if (externalCompanies) {
                setLocalCompanies(externalCompanies);
                return;
            }

            setIsLoading(true);
            try {
                const allCompanies = await companyApi.getAll();
                setLocalCompanies(allCompanies);
            } catch (error) {
                console.error('Ошибка загрузки компаний:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanies();
    }, [externalCompanies]);

    useEffect(() => {
        const handleName = async () => {
            if (!slug) {
                setQuery('');
                return;
            }

            const company = localCompanies.find((c) => c.slug === slug);

            if (company && company.name !== query) {
                setQuery(company.name);
            }
        };

        if (localCompanies.length > 0) {
            handleName();
        }
    }, [slug, localCompanies]);

    const filtered = useMemo(() => {
        if (!debouncedQuery) return [];

        const searchLower = debouncedQuery.toLowerCase();

        if (mode === 'name') {
            return localCompanies.filter((c) =>
                c.name.toLowerCase().includes(searchLower)
            );
        }

        return localCompanies.filter((c) =>
            c.tags.some((tag) =>
                tag.toLowerCase().startsWith(searchLower)
            )
        );
    }, [localCompanies, debouncedQuery, mode]);

    if (isLoading && localCompanies.length === 0) {
        return (
            <div ref={ref} className={styles.search}>
                <div className={styles.inputWrapper}>
                    <InputField
                        className={styles['company-input']}
                        placeholder="Загрузка компаний..."
                        disabled
                    />
                </div>
            </div>
        );
    }

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
};

export default CompanySearch;