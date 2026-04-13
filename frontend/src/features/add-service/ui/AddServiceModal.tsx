import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import FormField from '@/shared/ui/auth/FormField';
import Button from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';
import { CURRENCIES } from '@/shared/utils/selectorValues';

import { serviceSchema, type ServiceFormData } from '../modal/AddServiceModal.types';

import styles from './AddServiceModal.module.scss';

interface AddServiceModalProps {
    onClose: () => void;
    onAdd: (service: ServiceFormData) => void;
}

const AddServiceModal = ({ onClose, onAdd }: AddServiceModalProps) => {
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        mode: "onBlur",
        defaultValues: {
            name: '',
            description: '',
            duration: 60,
            price: 0,
            currency: 'RUB',
        }
    });

    const onSubmit = (data: ServiceFormData) => {
        onAdd(data);
        reset();
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>Добавить услугу</h3>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formContent}>
                        <FormField
                            label="Название услуги"
                            id="name"
                            placeholder="Стрижка, Маникюр, Консультация..."
                            required
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <FormField
                            label="Описание"
                            id="description"
                            placeholder="Краткое описание услуги"
                            error={errors.description?.message}
                            {...register('description')}
                        />

                        <FormField
                            label="Длительность (минуты)"
                            id="duration"
                            type="number"
                            placeholder="60"
                            required
                            error={errors.duration?.message}
                            onChange={(e) => setValue('duration', parseInt(e.target.value) || 0, { shouldValidate: true })}
                        />

                        <Select
                            label="Валюта"
                            options={CURRENCIES}
                            value={watch('currency')}
                            onChange={(value) => setValue('currency', value, { shouldValidate: true })}
                            placeholder="Выберите валюту"
                            required
                        />

                        <FormField
                            label="Цена"
                            id="price"
                            type="number"
                            placeholder="1000"
                            required
                            error={errors.price?.message}
                            onChange={(e) => setValue('price', parseFloat(e.target.value) || 0, { shouldValidate: true })}
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
                        >
                            Добавить услугу
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddServiceModal;