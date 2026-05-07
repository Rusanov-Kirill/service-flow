export const roleLabels: Record<string, string> = {
  owner: 'Владелец',
  admin: 'Системный администратор',
  manager: 'Управляющий',
  receptionist: 'Администратор',
  member: 'Сотрудник'
};

export const PERMISSIONS = {
  EDIT_COMPANY: 'edit_company',
  DELETE_COMPANY: 'delete_company',

  EDIT_BOOKING_SETTINGS: 'edit_booking_settings',

  VIEW_FINANCE: 'view_finance',

  VIEW_MEMBERS: 'view_members',
  MANAGE_MEMBERS: 'manage_members',

  VIEW_SERVICES: 'view_services',
  MANAGE_SERVICES: 'manage_services',

  VIEW_CUSTOMERS: 'view_customers',
  MANAGE_CUSTOMERS: 'manage_customers',

  VIEW_BOOKINGS: 'view_bookings',
  MANAGE_BOOKINGS: 'manage_bookings',

  EDIT_SCHEDULE: 'edit_schedule',
};

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: ['Все права'],
  admin: [
    'Редактирование компании',
    'Удаление компании',
    'Настройки бронирования',
    'Просмотр финансов',
    'Просмотр сотрудников',
    'Управление сотрудниками',
    'Просмотр услуг',
    'Управление услугами',
    'Просмотр клиентов',
    'Управление клиентами',
    'Просмотр бронирований',
    'Управление бронированиями',
    'Редактирование расписания',
  ],
  manager: [
    'Просмотр сотрудников',
    'Просмотр услуг',
    'Управление услугами',
    'Просмотр клиентов',
    'Просмотр бронирований',
    'Управление бронированиями',
    'Редактирование расписания',
  ],
  receptionist: [
    'Просмотр клиентов',
    'Просмотр сотрудников',
    'Просмотр бронирований',
    'Просмотр услуг',
    'Управление бронированиями',
  ],
  member: [
    'Просмотр услуг',
    'Просмотр клиентов',
    'Просмотр бронирований',
    'Просмотр сотрудников',
  ],
};