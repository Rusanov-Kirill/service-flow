import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { ClientService } from '@/entities/service';

import styles from './ServiceCard.module.scss';

type Mode = 'edit' | 'view';

interface ServiceCardProps {
    service: ClientService;
    mode: Mode;
    onRemove: (id: string) => void;
}

const ServiceCard = ({ service, mode = 'view', onRemove }: ServiceCardProps) => {
    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes} мин`;

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours < 24) {
            return remainingMinutes > 0
                ? `${hours} ч ${remainingMinutes} мин`
                : `${hours} ч`;
        }

        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;

        if (remainingHours === 0 && remainingMinutes === 0) {
            return `${days} ${getDaysWord(days)}`;
        }

        if (remainingHours > 0 && remainingMinutes === 0) {
            return `${days} ${getDaysWord(days)} ${remainingHours} ч`;
        }

        if (remainingHours === 0 && remainingMinutes > 0) {
            return `${days} ${getDaysWord(days)} ${remainingMinutes} мин`;
        }

        return `${days} ${getDaysWord(days)} ${remainingHours} ч ${remainingMinutes} мин`;
    };

    const getDaysWord = (days: number) => {
        if (days % 10 === 1 && days % 100 !== 11) return 'день';
        if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) return 'дня';
        return 'дней';
    };

    return (
        <div className={styles.serviceCard}>
            <div className={styles.serviceInfo}>
                <div className={styles.serviceHeader}>
                    <h5>{service.name}</h5>
                    {mode === 'edit' ? (
                        <button
                            className={styles.removeBtn}
                            onClick={() => onRemove(service.id)}
                            type="button"
                        >
                            ×
                        </button>
                    ) : null}
                </div>
                {service.description && (
                    <p className={styles.description}>{service.description}</p>
                )}
                <div className={styles.serviceMeta}>
                    <span className={styles.duration}>
                        <FontAwesomeIcon icon={faClock} className={styles.icon} />
                        {formatDuration(service.duration)}
                    </span>
                    <span className={styles.price}>
                        {service.price.toLocaleString()} {service.currency}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;