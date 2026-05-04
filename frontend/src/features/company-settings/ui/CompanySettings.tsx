import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { companyMemberApi } from '@/entities/company_member';
import { companyApi } from '@/entities/company/api/companyApi';
import { useAuthStore } from '@/entities/user/store/useAuthStore';
import type { Company } from '@/entities/company';
import type { WorkScheduleType, PaymentMethod } from '@/entities/company/model/types';
import Button from '@/shared/ui/Button';
import FormField from '@/shared/ui/auth/FormField';
import Select from '@/shared/ui/Select';
import MultiSelect from '@/shared/ui/MultiSelect';
import TimePicker from '@/shared/ui/TimePicker';
import RadioGroup from '@/shared/ui/RadioGroup';
import DatePicker from '@/shared/ui/DatePicker';
import CustomWorkDays from '@/shared/ui/CustomWorkDays';
import Loader from '@/shared/ui/Loader';
import { TIMEZONES, CURRENCIES, TAGS_OPTIONS, SCHEDULE_TYPES, PAYMENT_METHODS } from '@/shared/utils/selectorValues';
import { updateCompanySchema, type UpdateCompanyFormData } from '../model/CompanySettings.types';

import styles from './CompanySettings.module.scss';

type UpdateCompanyRequest = Omit<UpdateCompanyFormData, 'holidays'> & {
    holidays?: string[];
};

interface CompanyMemberInfo {
    role: string;
    permissions: string[];
}

const CompanySettings = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [company, setCompany] = useState<Company | null>(null);
    const [memberInfo, setMemberInfo] = useState<CompanyMemberInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [successes, setSuccesses] = useState<Record<string, string | null>>({});
    const [openSections, setOpenSections] = useState<string[]>([]);

    const {
        trigger,
        register,
        formState: { errors: formErrors },
        setValue,
        watch,
        reset,
        getValues 
    } = useForm<UpdateCompanyFormData>({
        resolver: zodResolver(updateCompanySchema),
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            tags: [],
            timezone: 'Europe/Moscow',
            city: '',
            currency: 'RUB',
            address: '',
            logo: '',
            phone: '',
            email: '',
            website: '',
            bookingLeadDays: 30,
            workScheduleType: 'EVERY_DAY',
            slotInterval: 30,
            defaultStartTime: '09:00',
            defaultEndTime: '18:00',
            customWorkDays: [],
            holidays: [],
            autoConfirmBooking: false,
            paymentMethods: 'BOTH',
        }
    });

    const watchWorkScheduleType = watch('workScheduleType');

    const hasPermission = (permission: string): boolean => {
        if (memberInfo?.role === 'owner') return true;
        return memberInfo?.permissions?.includes(permission) || false;
    };

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!slug || !user) return;

            try {
                setIsLoading(true);

                const companyRes = await companyApi.getBySlug(slug);
                const memberRes = await companyMemberApi.getMemberByUserId(companyRes.id, user.id);

                setCompany(companyRes);
                setMemberInfo(memberRes);

                const formData: UpdateCompanyFormData = {
                    ...companyRes,
                    holidays: (companyRes.holidays || []).map((d: string) => new Date(d)),
                    customWorkDays: companyRes.customWorkDays ?? [],
                };

                reset(formData);
            } catch (err) {
                console.error('Ошибка загрузки:', err);
                setErrors(prev => ({ ...prev, general: 'Не удалось загрузить данные' }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug, user, reset]);

    const onSubmitSection = async (sectionId: string, data: UpdateCompanyFormData) => {
        setSavingStates(prev => ({ ...prev, [sectionId]: true }));
        setErrors(prev => ({ ...prev, [sectionId]: null }));
        setSuccesses(prev => ({ ...prev, [sectionId]: null }));

        try {
            if (company) {
                let updateData: Partial<UpdateCompanyRequest> = {};

                switch (sectionId) {
                    case 'general':
                        updateData = {
                            name: data.name,
                            slug: data.slug,
                            description: data.description,
                            tags: data.tags,
                            timezone: data.timezone,
                            city: data.city,
                            currency: data.currency,
                            address: data.address,
                            logo: data.logo,
                        };
                        break;
                    case 'contacts':
                        updateData = {
                            email: data.email,
                            phone: data.phone,
                            website: data.website,
                        };
                        break;
                    case 'booking':
                        updateData = {
                            bookingLeadDays: data.bookingLeadDays,
                            workScheduleType: data.workScheduleType,
                            slotInterval: data.slotInterval,
                            defaultStartTime: data.defaultStartTime,
                            defaultEndTime: data.defaultEndTime,
                            customWorkDays: data.customWorkDays,
                            holidays: data.holidays?.map(d => d.toISOString()),
                            autoConfirmBooking: data.autoConfirmBooking,
                            paymentMethods: data.paymentMethods,
                        };
                        break;
                }

                await companyApi.update(company.id, updateData as Partial<Company>);
                setSuccesses(prev => ({ ...prev, [sectionId]: 'Данные успешно сохранены' }));
                setTimeout(() => {
                    setSuccesses(prev => ({ ...prev, [sectionId]: null }));
                }, 3000);
            }
        } catch (err: any) {
            setErrors(prev => ({ ...prev, [sectionId]: err.response?.data?.error || 'Ошибка сохранения' }));
        } finally {
            setSavingStates(prev => ({ ...prev, [sectionId]: false }));
        }
    };

    const handleSectionSubmit = async (sectionId: string) => {
        let fields: (keyof UpdateCompanyFormData)[] = [];

        if (sectionId === 'general') {
            fields = ['name', 'slug', 'description', 'tags', 'timezone', 'city', 'currency', 'address', 'logo'];
        }

        if (sectionId === 'contacts') {
            fields = ['email', 'phone', 'website'];
        }

        if (sectionId === 'booking') {
            fields = [
                'bookingLeadDays',
                'workScheduleType',
                'slotInterval',
                'defaultStartTime',
                'defaultEndTime',
                'customWorkDays',
                'holidays',
                'autoConfirmBooking',
                'paymentMethods'
            ];
        }

        const isValid = await trigger(fields);

        if (!isValid) return;

        const data = getValues();
        onSubmitSection(sectionId, data);
    };

    const sections = [
        { id: 'general', title: 'Основная информация', permission: 'edit_company', icon: '🏢' },
        { id: 'contacts', title: 'Контакты', permission: 'edit_company', icon: '📞' },
        { id: 'booking', title: 'Настройки бронирования', permission: 'edit_booking_settings', icon: '📅' },
        { id: 'services', title: 'Услуги', permission: 'manage_services', icon: '✂️' },
        { id: 'members', title: 'Сотрудники', permission: 'manage_members', icon: '👥' },
        { id: 'finance', title: 'Финансы', permission: 'view_finance', icon: '💰' },
    ];

    const visibleSections = sections.filter(s => hasPermission(s.permission));

    if (isLoading) {
        return (
            <div className={styles.settingsPage}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={styles.settingsPage}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(`/home/companies`)}>
                    ← Назад
                </button>
                <h1>Настройки компании</h1>
                <div className={styles.placeholder} />
            </div>

            {visibleSections.map(section => (
                <div key={section.id} className={styles.accordionItem}>
                    <button
                        type="button"
                        className={`${styles.accordionHeader} ${openSections.includes(section.id) ? styles.open : ''}`}
                        onClick={() => toggleSection(section.id)}
                    >
                        <span className={styles.accordionIcon}>{section.icon}</span>
                        <span className={styles.accordionTitle}>{section.title}</span>
                        <span className={styles.accordionChevron}>
                            {openSections.includes(section.id) ? '▲' : '▼'}
                        </span>
                    </button>

                    {openSections.includes(section.id) && (
                        <div className={styles.accordionContent}>
                            {/* Основная информация */}
                            {section.id === 'general' && (
                                <div className={styles.sectionContent}>
                                    <FormField
                                        label="Название компании"
                                        id="name"
                                        placeholder="РемонтПро"
                                        required
                                        error={formErrors.name?.message}
                                        {...register('name')}
                                    />

                                    <FormField
                                        label="Короткое имя (slug)"
                                        id="slug"
                                        placeholder="remontpro"
                                        required
                                        error={formErrors.slug?.message}
                                        {...register('slug')}
                                    />

                                    <FormField
                                        label="Описание"
                                        id="description"
                                        placeholder="Краткое описание компании"
                                        error={formErrors.description?.message}
                                        {...register('description')}
                                    />

                                    <MultiSelect
                                        label="Теги"
                                        options={TAGS_OPTIONS}
                                        value={watch('tags')}
                                        onChange={(value) => setValue('tags', value, { shouldValidate: true })}
                                        error={formErrors.tags?.message}
                                        required
                                        placeholder="Выберите теги"
                                    />

                                    <Select
                                        label="Часовой пояс"
                                        options={TIMEZONES}
                                        value={watch('timezone')}
                                        onChange={(value) => setValue('timezone', value, { shouldValidate: true })}
                                        error={formErrors.timezone?.message}
                                        required
                                        placeholder="Выберите часовой пояс"
                                    />

                                    <FormField
                                        label="Город"
                                        id="city"
                                        placeholder="Москва"
                                        required
                                        error={formErrors.city?.message}
                                        {...register('city')}
                                    />

                                    <Select
                                        label="Валюта"
                                        options={CURRENCIES}
                                        value={watch('currency')}
                                        onChange={(value) => setValue('currency', value, { shouldValidate: true })}
                                        error={formErrors.currency?.message}
                                        required
                                        placeholder="Выберите валюту"
                                    />

                                    <FormField
                                        label="Адрес"
                                        id="address"
                                        placeholder="г. Москва, ул. Тверская, д. 15"
                                        error={formErrors.address?.message}
                                        {...register('address')}
                                    />

                                    <FormField
                                        label="Логотип (URL)"
                                        id="logo"
                                        type="url"
                                        placeholder="https://example.com/logo.jpg"
                                        error={formErrors.logo?.message}
                                        {...register('logo')}
                                    />
                                </div>
                            )}

                            {/* Контакты */}
                            {section.id === 'contacts' && (
                                <div className={styles.sectionContent}>
                                    <FormField
                                        label="Email"
                                        id="email"
                                        type="email"
                                        placeholder="info@remontpro.ru"
                                        required
                                        error={formErrors.email?.message}
                                        {...register('email')}
                                    />

                                    <FormField
                                        label="Телефон"
                                        id="phone"
                                        type="tel"
                                        placeholder="+7 (495) 123-45-67"
                                        error={formErrors.phone?.message}
                                        {...register('phone')}
                                    />

                                    <FormField
                                        label="Сайт"
                                        id="website"
                                        type="url"
                                        placeholder="https://remontpro.ru"
                                        error={formErrors.website?.message}
                                        {...register('website')}
                                    />
                                </div>
                            )}

                            {/* Настройки бронирования */}
                            {section.id === 'booking' && (
                                <div className={styles.sectionContent}>
                                    <FormField
                                        label="Максимальный срок бронирования (дней)"
                                        id="bookingLeadDays"
                                        type="number"
                                        placeholder="30"
                                        required
                                        error={formErrors.bookingLeadDays?.message}
                                        {...register('bookingLeadDays', { valueAsNumber: true })}
                                    />

                                    <Select
                                        label="Тип рабочей недели"
                                        options={SCHEDULE_TYPES}
                                        value={watch('workScheduleType')}
                                        onChange={(value) => setValue('workScheduleType', value as WorkScheduleType, { shouldValidate: true })}
                                        error={formErrors.workScheduleType?.message}
                                        required
                                        placeholder="Выберите график работы"
                                    />

                                    <TimePicker
                                        label="Начало рабочего дня"
                                        value={watch('defaultStartTime')}
                                        onChange={(value) => setValue('defaultStartTime', value, { shouldValidate: true })}
                                        error={formErrors.defaultStartTime?.message}
                                        required
                                    />

                                    <TimePicker
                                        label="Конец рабочего дня"
                                        value={watch('defaultEndTime')}
                                        onChange={(value) => setValue('defaultEndTime', value, { shouldValidate: true })}
                                        error={formErrors.defaultEndTime?.message}
                                        required
                                    />

                                    <FormField
                                        label="Интервал между слотами (минуты)"
                                        id="slotInterval"
                                        type="number"
                                        placeholder="30"
                                        required
                                        error={formErrors.slotInterval?.message}
                                        {...register('slotInterval', { valueAsNumber: true })}
                                    />

                                    {watchWorkScheduleType === 'CUSTOM' && (
                                        <CustomWorkDays
                                            value={watch('customWorkDays') ?? []}
                                            onChange={(value) => setValue('customWorkDays', value, { shouldValidate: true })}
                                            error={formErrors.customWorkDays?.message}
                                        />
                                    )}

                                    <DatePicker
                                        label="Праздничные (нерабочие) дни"
                                        value={watch('holidays')}
                                        onChange={(value) => setValue('holidays', value, { shouldValidate: true })}
                                        error={formErrors.holidays?.message}
                                    />

                                    <RadioGroup
                                        label="Подтверждение бронирования"
                                        options={[
                                            { value: true, label: 'Автоматически' },
                                            { value: false, label: 'Вручную' }
                                        ]}
                                        value={watch('autoConfirmBooking')}
                                        onChange={(value) => setValue('autoConfirmBooking', value, { shouldValidate: true })}
                                        error={formErrors.autoConfirmBooking?.message}
                                        required
                                    />

                                    <Select
                                        label="Способы оплаты"
                                        options={PAYMENT_METHODS}
                                        value={watch('paymentMethods')}
                                        onChange={(value) => setValue('paymentMethods', value as PaymentMethod, { shouldValidate: true })}
                                        error={formErrors.paymentMethods?.message}
                                        required
                                        placeholder="Выберите способы оплаты"
                                    />
                                </div>
                            )}

                            {/* Услуги - заглушка */}
                            {section.id === 'services' && (
                                <div className={styles.sectionContent}>
                                    <div className={styles.placeholderContent}>
                                        <p>Управление услугами будет доступно здесь</p>
                                        <Button variant="primary">+ Добавить услугу</Button>
                                    </div>
                                </div>
                            )}

                            {/* Сотрудники - заглушка */}
                            {section.id === 'members' && (
                                <div className={styles.sectionContent}>
                                    <div className={styles.placeholderContent}>
                                        <p>Управление сотрудниками будет доступно здесь</p>
                                        <Button variant="primary">+ Пригласить сотрудника</Button>
                                    </div>
                                </div>
                            )}

                            {/* Финансы - заглушка */}
                            {section.id === 'finance' && (
                                <div className={styles.sectionContent}>
                                    <div className={styles.placeholderContent}>
                                        <p>Финансовая информация будет доступна здесь</p>
                                    </div>
                                </div>
                            )}

                            {errors[section.id] && (
                                <div className={styles.error}>{errors[section.id]}</div>
                            )}
                            {successes[section.id] && (
                                <div className={styles.success}>{successes[section.id]}</div>
                            )}

                            <div className={styles.actions}>
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => handleSectionSubmit(section.id)}
                                    disabled={savingStates[section.id]}
                                >
                                    {savingStates[section.id] ? 'Сохранение...' : 'Сохранить изменения'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CompanySettings;