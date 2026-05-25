import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';

import { useServicesStore } from '@/entities/service';
import { serviceApi } from '@/entities/service/api/serviceApi';
import FormField from '@/shared/ui/auth/FormField';
import Button from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';
import { CURRENCIES } from '@/shared/utils/selectorValues';

import { serviceSchema, type ServiceFormData } from '../modal/AddServiceModal.types';

import styles from './AddServiceModal.module.scss';

interface AddServiceModalProps {
    onClose: (updated?: boolean) => void;
    initialService?: any;
    companyId?: string;
}

const AddServiceModal = ({ onClose, initialService, companyId }: AddServiceModalProps) => {
    const addService = useServicesStore((state) => state.addService);

    const { control, register, handleSubmit, formState: { errors }, reset } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        mode: "onBlur",
        defaultValues: {
            name: '',
            description: '',
            duration: 60,
            price: 0,
            cost: undefined,
            currency: 'RUB',
        }
    });

    useEffect(() => {
        if (initialService) {
            reset({
                name: initialService.name,
                description: initialService.description || '',
                duration: Number(initialService.duration),
                price: Number(initialService.price),
                cost: Number(initialService.cost),
                currency: initialService.currency,
            });
        }
    }, [initialService, reset]);

    const onSubmit = async (data: ServiceFormData) => {
        try {
            if (initialService) {
                await serviceApi.update(initialService.id, data);
                onClose(true);
            } else if (companyId) {
                await serviceApi.create(companyId, data);
                onClose(true);
            } else {
                addService({
                    name: data.name,
                    description: data.description,
                    duration: data.duration,
                    price: data.price,
                    currency: data.currency,
                    cost: data.cost,
                    isActive: true,
                });
                reset();
                onClose(false);
            }
        } catch (err) {
            console.error(err);
            onClose(false);
        }
    };

    const title = initialService ? 'Редактировать услугу' : 'Добавить услугу';
    const submitButtonText = initialService ? 'Сохранить' : 'Добавить';

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>{title}</h3>
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
                            {...register('duration', { valueAsNumber: true })}
                        />
                        <Controller
                            name="currency"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Валюта"
                                    options={CURRENCIES}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Выберите валюту"
                                    required
                                />
                            )}
                        />
                        <FormField
                            label="Цена"
                            id="price"
                            type="number"
                            placeholder="1000"
                            required
                            error={errors.price?.message}
                            {...register('price', { valueAsNumber: true })}
                        />
                        <FormField
                            label="Себестоимость"
                            id="cost"
                            type="number"
                            placeholder="500"
                            error={errors.cost?.message}
                            {...register('cost', { valueAsNumber: true })}
                        />
                    </div>
                    <div className={styles.actions}>
                        <Button type="button" onClick={() => onClose(false)} variant="secondary">Отмена</Button>
                        <Button type="submit" variant="primary">{submitButtonText}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddServiceModal;