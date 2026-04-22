import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/app/store/useAuthStore';
import { useServicesStore } from '@/entities/service';
import AddServiceModal from '@/features/add-service';
import ServiceCard from '@/features/add-service/ui/components/ServiceCard';
import { companyApi } from '@/shared/api/companyApi';
import FormField from '@/shared/ui/auth/FormField';
import Button from '@/shared/ui/Button';
import MultiSelect from '@/shared/ui/MultiSelect';
import Select from '@/shared/ui/Select';
import { TIMEZONES, CURRENCIES, TAGS_OPTIONS } from '@/shared/utils/selectorValues';

import { createCompanySchema, type CreateCompanyFormData } from '../model/CreateCompany.types';

import styles from './CreateCompany.module.scss';

const CreateCompany = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { services, removeService, clearServices } = useServicesStore();
    const { user } = useAuthStore();

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateCompanyFormData>({
        resolver: zodResolver(createCompanySchema),
        mode: "onBlur",
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            tags: [],
            timezone: 'UTC+3',
            city: '',
            currency: 'RUB',
            address: '',
            logo: '',
            phone: '',
            email: '',
            website: '',
        }
    });

    const onSubmit = async (data: CreateCompanyFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!user?.id) {
                throw new Error('Пользователь не авторизован');
            }

            const requestData = {
                ...data,
                ownerId: user.id,
                services: services.map(service => ({
                    name: service.name,
                    description: service.description,
                    duration: service.duration,
                    price: service.price,
                    currency: service.currency,
                    isActive: true,
                })),
            };

            await companyApi.create(requestData);

            clearServices();
            navigate('/home/companies');

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error ?? 'Ошибка сервера');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ошибка при создании компании');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveService = (id: string) => {
        removeService(id);
    };

    return (
        <>
            <div className={styles.createCompanyPage}>
                <div className={styles.header}>
                    <div>
                        <h2>Создать компанию</h2>
                        <p className={styles.subtitle}>
                            Заполните информацию о вашем бизнесе
                        </p>
                    </div>
                </div>

                <div className={styles.content}>
                    {error && (
                        <div className={styles.errorAlert}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <div className={styles.formGrid}>
                            {/* Основная информация */}
                            <div className={styles.section}>
                                <h4>Основная информация</h4>

                                <FormField
                                    label="Название компании"
                                    id="name"
                                    placeholder="РемонтПро"
                                    required
                                    error={errors.name?.message}
                                    {...register('name')}
                                />

                                <FormField
                                    label="Короткое имя (slug)"
                                    id="slug"
                                    placeholder="remontpro"
                                    required
                                    error={errors.slug?.message}
                                    {...register('slug')}
                                />

                                <FormField
                                    label="Описание"
                                    id="description"
                                    placeholder="Краткое описание компании"
                                    error={errors.description?.message}
                                    {...register('description')}
                                />

                                <MultiSelect
                                    label="Теги"
                                    options={TAGS_OPTIONS}
                                    value={watch('tags')}
                                    onChange={(value) => setValue('tags', value, { shouldValidate: true })}
                                    error={errors.tags?.message}
                                    required
                                    placeholder="Выберите теги"
                                />
                            </div>

                            {/* Локализация */}
                            <div className={styles.section}>
                                <h4>Локализация</h4>

                                <Select
                                    label="Часовой пояс"
                                    options={TIMEZONES}
                                    value={watch('timezone')}
                                    onChange={(value) => setValue('timezone', value, { shouldValidate: true })}
                                    error={errors.timezone?.message}
                                    required
                                    placeholder="Выберите часовой пояс"
                                />

                                <FormField
                                    label="Город"
                                    id="city"
                                    placeholder="Москва"
                                    required
                                    error={errors.city?.message}
                                    {...register('city')}
                                />

                                <Select
                                    label="Валюта"
                                    options={CURRENCIES}
                                    value={watch('currency')}
                                    onChange={(value) => setValue('currency', value, { shouldValidate: true })}
                                    error={errors.currency?.message}
                                    required
                                    placeholder="Выберите валюту"
                                />

                                <FormField
                                    label="Адрес"
                                    id="address"
                                    placeholder="г. Москва, ул. Тверская, д. 15"
                                    error={errors.address?.message}
                                    {...register('address')}
                                />
                            </div>

                            {/* Контакты */}
                            <div className={styles.section}>
                                <h4>Контакты</h4>

                                <FormField
                                    label="Email"
                                    id="email"
                                    type="email"
                                    placeholder="info@remontpro.ru"
                                    required
                                    error={errors.email?.message}
                                    {...register('email')}
                                />

                                <FormField
                                    label="Телефон"
                                    id="phone"
                                    type="tel"
                                    placeholder="+7 (495) 123-45-67"
                                    error={errors.phone?.message}
                                    {...register('phone')}
                                />

                                <FormField
                                    label="Сайт"
                                    id="website"
                                    type="url"
                                    placeholder="https://remontpro.ru"
                                    error={errors.website?.message}
                                    {...register('website')}
                                />

                                <FormField
                                    label="Логотип (URL)"
                                    id="logo"
                                    type="url"
                                    placeholder="https://example.com/logo.jpg"
                                    error={errors.logo?.message}
                                    {...register('logo')}
                                />
                            </div>

                            {/* Услуги */}
                            <div className={styles.section}>
                                <h4>Услуги</h4>

                                <div className={styles.servicesHeader}>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setIsServiceModalOpen(true)}
                                    >
                                        + Добавить услугу
                                    </Button>
                                </div>

                                {services.length > 0 ? (
                                    <div className={styles.servicesList}>
                                        {services.map(service => (
                                            <ServiceCard
                                                key={service.id}
                                                service={service}
                                                mode='edit'
                                                onRemove={handleRemoveService}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyServices}>
                                        <p>Услуги не добавлены</p>
                                        <span>Нажмите "Добавить услугу", чтобы создать первую услугу</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <Button
                                type="button"
                                onClick={() => navigate('/home/companies')}
                                variant="secondary"
                            >
                                Отмена
                            </Button>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Создание...' : 'Создать компанию'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {isServiceModalOpen && (
                <AddServiceModal
                    onClose={() => setIsServiceModalOpen(false)}
                />
            )}
        </>
    );
};

export default CreateCompany;