import type { Service } from "@/entities/service";

export interface Company {
  id: string
  name: string
  slug: string
  description?: string
  tags: string[]
  timezone: string
  city: string
  currency: string
  address?: string
  logo?: string
  phone?: string
  email?: string
  website?: string
  isActive: boolean
  ownerId: string
  members?: CompanyMember[]
  services?: Service[]
  bookingLeadDays: number
  workScheduleType: WorkScheduleType
  slotInterval: number
  defaultStartTime: string
  defaultEndTime: string
  customWorkDays?: CustomWorkDay[]
  holidays: Date[]
  autoConfirmBooking: boolean
  paymentMethods: PaymentMethod
};

export interface CompanyMember {
  id: string
  userId: string
  companyId: string
  role: 'owner' | 'admin' | 'manager' | 'staff'
  permissions: string[]
  user?: {
    firstName: string
    lastName: string
    email: string
    avatar?: string
  }
};

export interface CustomWorkDay {
  dayOfWeek: number
  startTime: string
  endTime: string
  slotInterval: number
};

export type WorkScheduleType = 'FIVE_TWO' | 'EVERY_DAY' | 'CUSTOM';
export type PaymentMethod = 'CASH' | 'PREPAYMENT' | 'BOTH';