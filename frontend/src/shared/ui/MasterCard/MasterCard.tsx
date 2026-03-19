import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';

import styles from './MasterCard.module.scss';
import type { MasterCardProps } from './MasterCard.types.ts';

const MasterCard =  memo(({ initials, name, specialty, rating }: MasterCardProps) => {
    return (
        <div className={styles['master-card']}>
            <div className={styles['master-avatar']}>{initials}</div>
            <div className={styles['master-info']}>
                <h4>{name}</h4>
                <p>{specialty}</p>
            </div>
            <div className={styles['rating']}>
                <FontAwesomeIcon icon={faStar} /> {rating}
            </div>
        </div>
    );
});

export default MasterCard;