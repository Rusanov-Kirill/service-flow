// ChangeStatusModal.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { BookingStatus } from '@/entities/booking';
import Button from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';
import { STATUS_OPTIONS } from '@/shared/utils/selectorValues';

import styles from './ChangeStatusModal.module.scss';

const changeStatusSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
});

type ChangeStatusFormData = z.infer<typeof changeStatusSchema>;

interface ChangeStatusModalProps {
    currentStatus: string;
    onClose: () => void;
    onConfirm: (status: BookingStatus) => void;
    isLoading?: boolean;
}

const ChangeStatusModal = ({ 
    currentStatus, 
    onClose, 
    onConfirm,
    isLoading = false 
}: ChangeStatusModalProps) => {
    const { control, handleSubmit, formState: { errors } } = useForm<ChangeStatusFormData>({
        resolver: zodResolver(changeStatusSchema),
        defaultValues: {
            status: currentStatus as BookingStatus,
        }
    });

    const onSubmit = (data: ChangeStatusFormData) => {
        onConfirm(data.status);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Изменение статуса</h3>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.content}>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Статус бронирования"
                                    options={STATUS_OPTIONS}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.status?.message}
                                    placeholder="Выберите статус"
                                />
                            )}
                        />
                    </div>

                    <div className={styles.actions}>
                        <Button 
                            type="button" 
                            onClick={onClose} 
                            variant="secondary"
                        >
                            Отмена
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeStatusModal;