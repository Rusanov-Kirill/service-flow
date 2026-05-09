import {
    faCogs,
    faClock,
    faMoneyBillWave,
    faPen,
    faTrashAlt,
    faBuilding,
    faPhone,
    faCalendarDays,
    faScissors,
    faUsers,
    faAddressBook,
    faWallet
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { MemberRole, MemberWithUser } from '@/entities/company_member';
import { companyMemberApi } from '@/entities/company_member';
import { companyApi } from '@/entities/company/api/companyApi';
import { serviceApi } from '@/entities/service/api/serviceApi';
import { useAuthStore } from '@/entities/user/store/useAuthStore';
import type { Company } from '@/entities/company';
import type { Service } from '@/entities/service';
import type { WorkScheduleType, PaymentMethod } from '@/entities/company/model/types';
import Button from '@/shared/ui/Button';
import FormField from '@/shared/ui/auth/FormField';
import Select from '@/shared/ui/Select';
import MultiSelect from '@/shared/ui/MultiSelect';
import TimePicker from '@/shared/ui/TimePicker';
import RadioGroup from '@/shared/ui/RadioGroup';
import SingleDatePicker from '@/shared/ui/SingleDatePicker';
import DatePicker from '@/shared/ui/DatePicker';
import MemberCustomWorkDays from '@/shared/ui/MemberCustomWorkDays';
import CustomWorkDays from '@/shared/ui/CustomWorkDays';
import MemberDetailsModal from '@/features/member-details-modal';
import Loader from '@/shared/ui/Loader';
import AddMemberModal from '@/features/add-member-modal';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';
import { roleLabels, PERMISSIONS } from '@/shared/utils/roleUtils';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import AddServiceModal from '@/features/add-service/ui/AddServiceModal';
import { TIMEZONES, CURRENCIES, TAGS_OPTIONS, SCHEDULE_TYPES, PAYMENT_METHODS } from '@/shared/utils/selectorValues';
import { updateCompanySchema, type UpdateCompanyFormData } from '../model/CompanySettings.types';

import CustomerSection from '../components/CusomerSection/CustomerSection';

import styles from './CompanySettings.module.scss';

type UpdateCompanyRequest = Omit<UpdateCompanyFormData, 'holidays'> & {
    holidays?: string[];
};

const CompanySettings = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [company, setCompany] = useState<Company | null>(null);
    const [currentMember, setCurrentMember] = useState<MemberWithUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [successes, setSuccesses] = useState<Record<string, string | null>>({});
    const [openSections, setOpenSections] = useState<string[]>([]);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; serviceId: string | null }>({
        isOpen: false,
        serviceId: null,
    });
    const [members, setMembers] = useState<MemberWithUser[]>([]);
    const [selectedMember, setSelectedMember] = useState<MemberWithUser | null>(null);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState<boolean>(false)

    const {
        trigger,
        register,
        formState: { errors: formErrors },
        setValue,
        watch,
        reset,
        getValues,
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
            memberScheduleType: 'FIVE_TWO',
            memberStartWorkTime: '09:00',
            memberEndWorkTime: '18:00',
            memberStartWorkDay: undefined,
            memberCustomWorkSchedule: [],
        },
    });

    const watchWorkScheduleType = watch('workScheduleType');
    const watchMemberScheduleType = watch('memberScheduleType');

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
                const membersRes: MemberWithUser[] = await companyMemberApi.getByCompanyId(companyRes.id);

                const foundMember = membersRes.find(m => m.userId === user.id) ?? null;

                setMembers(membersRes);
                setCompany(companyRes);
                setCurrentMember(foundMember);

                const formData: UpdateCompanyFormData = {
                    ...companyRes,
                    holidays: (companyRes.holidays || []).map((d: string) => new Date(d)),
                    customWorkDays: companyRes.customWorkDays ?? [],
                    memberScheduleType: foundMember?.scheduleType || 'FIVE_TWO',
                    memberStartWorkTime: foundMember?.startWorkTime || '09:00',
                    memberEndWorkTime: foundMember?.endWorkTime || '18:00',
                    memberStartWorkDay: foundMember?.startWorkDay ?? undefined,
                    memberCustomWorkSchedule: (foundMember?.customWorkSchedule as any) ?? [],
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

    useEffect(() => {
        if (watchMemberScheduleType !== 'TWO_TWO') {
            setValue('memberStartWorkDay', undefined);
        }

        if (watchMemberScheduleType !== 'CUSTOM') {
            setValue('memberCustomWorkSchedule', []);
        }
    }, [watchMemberScheduleType, setValue]);

    useEffect(() => {
        if (watchWorkScheduleType !== 'CUSTOM') {
            setValue('customWorkDays', []);
        }
    }, [watchWorkScheduleType, setValue]);

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
                    case 'mySchedule':
                        if (!currentMember) return;

                        await companyMemberApi.update(currentMember.id, {
                            scheduleType: data.memberScheduleType,
                            startWorkTime: data.memberStartWorkTime,
                            endWorkTime: data.memberEndWorkTime,
                            startWorkDay: data.memberStartWorkDay ?? undefined,
                            customWorkSchedule: data.memberCustomWorkSchedule,
                        });

                        setSuccesses(prev => ({
                            ...prev,
                            mySchedule: 'Расписание обновлено',
                        }));

                        return;
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
        } else if (sectionId === 'contacts') {
            fields = ['email', 'phone', 'website'];
        } else if (sectionId === 'booking') {
            fields = [
                'bookingLeadDays',
                'workScheduleType',
                'slotInterval',
                'defaultStartTime',
                'defaultEndTime',
                'customWorkDays',
                'holidays',
                'autoConfirmBooking',
                'paymentMethods',
            ];
        } else if (sectionId === 'mySchedule') {
            fields = [
                'memberScheduleType',
                'memberStartWorkTime',
                'memberEndWorkTime',
                'memberStartWorkDay',
                'memberCustomWorkSchedule',
            ];
        }

        const isValid = await trigger(fields);
        if (!isValid) return;

        const data = getValues();
        onSubmitSection(sectionId, data);
    };

    const handleAddService = () => {
        setEditingService(null);
        setIsServiceModalOpen(true);
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setIsServiceModalOpen(true);
    };

    const handleDeleteService = (serviceId: string) => {
        setDeleteConfirm({ isOpen: true, serviceId });
    };

    const handleMemberClick = (member: any) => {
        setSelectedMember(member);
        setIsMemberModalOpen(true);
    };

    const handleAddMember = () => {
        if (!company?.id) return;
        setIsAddMemberModalOpen(true);
    };

    const handleAddMemberClose = () => {
        setIsAddMemberModalOpen(false);
    };

    const handleRoleChange = async (memberId: string, role: MemberRole) => {
        await companyMemberApi.update(memberId, { role });

        setMembers(prev =>
            prev.map(m =>
                m.id === memberId ? { ...m, role } : m
            )
        );
    };

    const confirmDeleteService = async () => {
        if (!deleteConfirm.serviceId) return;
        try {
            await serviceApi.delete(deleteConfirm.serviceId);
            if (slug) {
                const updatedCompany = await companyApi.getBySlug(slug);
                setCompany(updatedCompany);
            }
            setSuccesses(prev => ({ ...prev, services: 'Услуга удалена' }));
            setTimeout(() => setSuccesses(prev => ({ ...prev, services: null })), 3000);
        } catch (err: any) {
            setErrors(prev => ({ ...prev, services: err.response?.data?.error || 'Ошибка удаления' }));
        } finally {
            setDeleteConfirm({ isOpen: false, serviceId: null });
        }
    };

    const handleServiceModalClose = async (updated?: boolean) => {
        setIsServiceModalOpen(false);
        setEditingService(null);
        if (updated && slug) {
            const updatedCompany = await companyApi.getBySlug(slug);
            setCompany(updatedCompany);
        }
    };

    const getRoleClassName = (role: string): string => {
        const roleClassMap: Record<string, string | undefined> = {
            owner: styles.roleOwner,
            admin: styles.roleAdmin,
            manager: styles.roleManager,
            receptionist: styles.roleReceptionist,
            member: styles.roleMember,
        };
        return roleClassMap[role] || styles.roleMember || '';
    };

    const sections = [
        { id: 'mySchedule', title: 'Мое расписание', permission: PERMISSIONS.VIEW_MEMBERS, icon: faClock },
        { id: 'general', title: 'Основная информация', permission: PERMISSIONS.EDIT_COMPANY, icon: faBuilding },
        { id: 'contacts', title: 'Контакты', permission: PERMISSIONS.EDIT_COMPANY, icon: faPhone },
        { id: 'booking', title: 'Настройки бронирования', permission: PERMISSIONS.EDIT_BOOKING_SETTINGS, icon: faCalendarDays },
        { id: 'services', title: 'Услуги', permission: PERMISSIONS.VIEW_SERVICES, icon: faScissors },
        { id: 'members', title: 'Сотрудники', permission: PERMISSIONS.VIEW_MEMBERS, icon: faUsers },
        { id: 'customers', title: 'Список клиентов', permission: PERMISSIONS.VIEW_CUSTOMERS, icon: faAddressBook },
        { id: 'finance', title: 'Финансы', permission: PERMISSIONS.VIEW_FINANCE, icon: faWallet },
    ];

    const hasPermission = (permission: string): boolean => {
        if (!currentMember) return false;

        if (currentMember.role === 'owner') return true;

        return currentMember.permissions?.includes(permission) ?? false;
    };

    const visibleSections = sections.filter(s => {
        return hasPermission(s.permission);
    });

    if (isLoading) {
        return (
            <div className={styles.settingsPage}>
                <Loader />
            </div>
        );
    };

    return (
        <div className={styles.settingsPage}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate('/home/companies')}>
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
                        <span className={styles.accordionIcon}>
                            <FontAwesomeIcon icon={section.icon} />
                        </span>
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
                                            { value: false, label: 'Вручную' },
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

                            {/* Услуги */}
                            {section.id === 'services' && (
                                <div className={styles.sectionContent}>
                                    {hasPermission(PERMISSIONS.MANAGE_SERVICES) && (<div className={styles.servicesHeader}>
                                        <Button variant="primary" onClick={handleAddService}>
                                            + Добавить услугу
                                        </Button>
                                    </div>
                                    )}
                                    {company?.services && company.services.length > 0 ? (
                                        <div className={styles.servicesList}>
                                            {company.services.map(service => (
                                                <div key={service.id} className={styles.serviceCard}>

                                                    <div className={styles.serviceMain}>
                                                        <div className={styles.serviceName}>
                                                            <FontAwesomeIcon icon={faCogs} className={styles.serviceIcon} />
                                                            <span>{service.name}</span>
                                                        </div>

                                                        <div className={styles.serviceDetails}>
                                                            <div className={styles.detailItem}>
                                                                <FontAwesomeIcon icon={faClock} />
                                                                <span>{service.duration} мин</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <FontAwesomeIcon icon={faMoneyBillWave} />
                                                                <span>{service.price} {service.currency}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {hasPermission(PERMISSIONS.MANAGE_SERVICES) && (
                                                        <div className={styles.serviceActions}>
                                                            <button
                                                                className={styles.editBtn}
                                                                onClick={() => handleEditService(service)}
                                                                title="Редактировать"
                                                            >
                                                                <FontAwesomeIcon icon={faPen} />
                                                            </button>

                                                            <button
                                                                className={styles.deleteBtn}
                                                                onClick={() => handleDeleteService(service.id)}
                                                                title="Удалить"
                                                            >
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={styles.emptyServices}>
                                            <p>Услуги не добавлены</p>
                                            {hasPermission(PERMISSIONS.MANAGE_SERVICES) && <span>Нажмите «+ Добавить услугу», чтобы создать первую услугу</span>}
                                        </div>
                                    )}
                                </div>
                            )}

                            {section.id === 'members' && (
                                <div className={styles.sectionContent}>
                                    {members.length > 0 ? (
                                        <div className={styles.membersTable}>
                                            {members.map(member => (
                                                <div
                                                    key={member.id}
                                                    className={styles.memberRow}
                                                    onClick={() => handleMemberClick(member)}
                                                >

                                                    <div className={styles.memberAvatar}>
                                                        <PlaceholderLogo
                                                            src={member.user?.avatar}
                                                            alt="avatar"
                                                            variant='profile'
                                                        />
                                                    </div>

                                                    <div className={styles.memberName}>
                                                        {member.user?.firstName} {member.user?.lastName}
                                                    </div>

                                                    <div className={`${styles.memberRole} ${getRoleClassName(member.role)}`}>
                                                        {roleLabels[member.role]}
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={styles.emptyServices}>
                                            <p>Сотрудники не добавлены</p>
                                        </div>
                                    )}

                                    {hasPermission(PERMISSIONS.MANAGE_MEMBERS) &&
                                        <Button
                                            variant="primary"
                                            onClick={handleAddMember}
                                        >
                                            + Добавить сотрудника
                                        </Button>
                                    }
                                </div>
                            )}

                            {section.id === 'mySchedule' && (
                                <div className={styles.scheduleCard}>
                                    <Select
                                        label="Тип графика"
                                        options={[
                                            { value: 'FIVE_TWO', label: '5/2' },
                                            { value: 'TWO_TWO', label: '2/2' },
                                            { value: 'CUSTOM', label: 'Свой график' },
                                        ]}
                                        value={watch('memberScheduleType')}
                                        onChange={(value) =>
                                            setValue(
                                                'memberScheduleType',
                                                value as any,
                                                { shouldValidate: true }
                                            )
                                        }
                                        required
                                    />

                                    <TimePicker
                                        label="Начало рабочего дня"
                                        value={watch('memberStartWorkTime')}
                                        onChange={(value) =>
                                            setValue(
                                                'memberStartWorkTime',
                                                value,
                                                { shouldValidate: true }
                                            )
                                        }
                                        required
                                    />

                                    <TimePicker
                                        label="Конец рабочего дня"
                                        value={watch('memberEndWorkTime')}
                                        onChange={(value) =>
                                            setValue(
                                                'memberEndWorkTime',
                                                value,
                                                { shouldValidate: true }
                                            )
                                        }
                                        required
                                    />

                                    {watchMemberScheduleType === 'TWO_TWO' && (
                                        <SingleDatePicker
                                            label="Первый рабочий день"
                                            value={watch('memberStartWorkDay')}
                                            onChange={(value) =>
                                                setValue(
                                                    'memberStartWorkDay',
                                                    value,
                                                    { shouldValidate: true }
                                                )
                                            }
                                        />
                                    )}

                                    {watchMemberScheduleType === 'CUSTOM' && (
                                        <MemberCustomWorkDays
                                            value={watch('memberCustomWorkSchedule') ?? []}
                                            onChange={(value) =>
                                                setValue(
                                                    'memberCustomWorkSchedule',
                                                    value,
                                                    { shouldValidate: true }
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            )}

                            {section.id === 'customers' &&
                                <CustomerSection
                                    companyId={company?.id}
                                    canManageCustomers={hasPermission(PERMISSIONS.MANAGE_CUSTOMERS)}
                                />
                            }

                            {/* Финансы - заглушка */}
                            {section.id === 'finance' && (
                                <div className={styles.sectionContent}>
                                    <div className={styles.placeholderContent}>
                                        <p>Финансовая информация будет доступна здесь</p>
                                    </div>
                                </div>
                            )}

                            {errors[section.id] && <div className={styles.error}>{errors[section.id]}</div>}
                            {successes[section.id] && <div className={styles.success}>{successes[section.id]}</div>}

                            {section.id !== 'services' && section.id !== 'members' && section.id !== 'customers' && (
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
                            )}
                        </div>
                    )}
                </div>
            ))}

            {isServiceModalOpen && (
                <AddServiceModal
                    onClose={handleServiceModalClose}
                    initialService={editingService}
                    companyId={company?.id}
                />
            )}

            {isMemberModalOpen && selectedMember && (
                <MemberDetailsModal
                    member={selectedMember}
                    onClose={() => {
                        setIsMemberModalOpen(false);
                        setSelectedMember(null);
                    }}
                    canManageMembers={hasPermission(PERMISSIONS.MANAGE_MEMBERS)}
                    currentUserId={user?.id}
                    onDelete={(memberId) => companyMemberApi.delete(memberId)}
                    onRoleChange={handleRoleChange}
                />
            )}

            {isAddMemberModalOpen && company?.id && (
                <AddMemberModal
                    companyId={company.id}
                    onClose={handleAddMemberClose}
                />
            )}

            <ConfirmModal
                isOpen={deleteConfirm.isOpen}
                title="Удаление услуги"
                message="Вы действительно хотите удалить эту услугу? Это действие нельзя отменить."
                confirmText="Удалить"
                cancelText="Отмена"
                onConfirm={confirmDeleteService}
                onCancel={() => setDeleteConfirm({ isOpen: false, serviceId: null })}
            />
        </div>
    );
};

export default CompanySettings;