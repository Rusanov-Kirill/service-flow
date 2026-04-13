import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import AddServiceModal from '@/features/add-service';
import { type Service, type ServiceFormData } from '@/features/add-service/modal/AddServiceModal.types';
import ServiceCard from '@/features/add-service/ui/components/ServiceCard';
import FormField from '@/shared/ui/auth/FormField';
import Button from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';
import MultiSelect from '@/shared/ui/MultiSelect';

import { createCompanySchema, type CreateCompanyFormData } from '../model/CreateCompany.types';
import { TIMEZONES, CURRENCIES, TAGS_OPTIONS } from '@/shared/utils/selectorValues';

import styles from './CreateCompany.module.scss';


const CreateCompany = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [services, setServices] = useState<Service[]>([]);

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

        console.log('Создание компании:', data);

        setTimeout(() => {
            setIsLoading(false);
            navigate('/home/companies');
        }, 1000);
    };

    const handleAddService = (serviceData: ServiceFormData) => {
        const newService: Service = {
            ...serviceData,
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        };
        setServices([...services, newService]);
    };

    const handleRemoveService = (id: string) => {
        setServices(services.filter(service => service.id !== id));
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
                    onAdd={handleAddService}
                />
            )
            }
        </>
    );
};

export default CreateCompany;