import { useState, useEffect } from 'react';
import type { Company } from '@/entities/company';
import { favoritesApi } from '@/entities/favorites';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';
import Button from '@/shared/ui/Button';
import { TIMEZONES } from '@/shared/utils/selectorValues';

import styles from './OverviewTab.module.scss';

interface OverviewTabProps {
    selectedCompany: Company | null
};

const OverviewTab = ({ selectedCompany }: OverviewTabProps) => {
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (selectedCompany?.id) {
            checkFavoriteStatus();
        }
    }, [selectedCompany?.id]);

    const checkFavoriteStatus = async () => {
        if (!selectedCompany?.id) return;
        
        try {
            const status = await favoritesApi.checkFavorite(selectedCompany.id);
            setIsFavorite(status);
        } catch (error) {
            console.error('Ошибка проверки избранного:', error);
        }
    };

    const handleToggleFavorite = async () => {
        if (!selectedCompany?.id) return;
        
        setIsLoading(true);
        try {
            if (isFavorite) {
                await favoritesApi.removeFromFavorites(selectedCompany.id);
                setIsFavorite(false);
            } else {
                await favoritesApi.addToFavorites(selectedCompany.id);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Ошибка при изменении избранного:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!selectedCompany) return null;

    const hasAddress = !!selectedCompany.address;
    const hasPhone = !!selectedCompany.phone;
    const hasEmail = !!selectedCompany.email;
    const hasContacts = hasPhone || hasEmail;

    return (
        <div className={styles.company}>
            <div className={styles.header}>
                <PlaceholderLogo
                    src={selectedCompany.logo}
                    alt={selectedCompany.name}
                    className={styles.logo}
                    variant='company'
                />

                <div className={styles.headerInfo}>
                    <div className={styles.titleRow}>
                        <h2>{selectedCompany.name}</h2>
                        <Button
                            variant={isFavorite ? "secondary" : "primary"}
                            onClick={handleToggleFavorite}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                '...'
                            ) : isFavorite ? (
                                <>
                                    <span className={styles.starIcon}>★</span>
                                    В избранном
                                </>
                            ) : (
                                <>
                                    <span className={styles.starIcon}>☆</span>
                                    Добавить в избранное
                                </>
                            )}
                        </Button>
                    </div>
                    <span className={styles.slug}>
                        @{selectedCompany.slug}
                    </span>
                </div>
            </div>

            <div className={styles.section}>
                <h4>Описание</h4>
                <p>{selectedCompany.description}</p>
            </div>

            {selectedCompany.tags.length > 0 && (
                <div className={styles.section}>
                    <h4>Теги</h4>
                    <div className={styles.tags}>
                        {selectedCompany.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.section}>
                <h4>Бизнес-информация</h4>
                <div className={styles.grid}>
                    <div>
                        <span className={styles.label}>Часовой пояс</span>
                        <p>{selectedCompany.timezone && TIMEZONES.find(tz => tz.value === selectedCompany.timezone)?.label || selectedCompany.city}</p>
                    </div>

                    <div>
                        <span className={styles.label}>Валюта</span>
                        <p>{selectedCompany.currency}</p>
                    </div>
                </div>
            </div>

            {hasAddress && (
                <div className={styles.section}>
                    <h4>Адрес</h4>
                    <p>{selectedCompany.address}</p>
                </div>
            )}

            {hasContacts && (
                <div className={styles.section}>
                    <h4>Контакты</h4>
                    <div className={styles.grid}>
                        {hasPhone && (
                            <div>
                                <span className={styles.label}>Номер телефона</span>
                                <p>📞 {selectedCompany.phone}</p>
                            </div>
                        )}

                        {hasEmail && (
                            <div>
                                <span className={styles.label}>Корпоративная почта</span>
                                <p>{selectedCompany.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewTab;