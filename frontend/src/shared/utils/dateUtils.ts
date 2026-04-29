import { DateTime } from "luxon";

import type { Company } from "@/entities/company";

export const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    let firstDayIndex = firstDay.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    for (let i = 0; i < firstDayIndex; i++) {
        days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }

    return days;
};

export const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

export function getDayConfig(company: Company, date: DateTime): { startTime: string; endTime: string; slotInterval: number } {
    if (company.workScheduleType === 'CUSTOM') {
        const dayOfWeek = date.weekday;
        const custom = company.customWorkDays?.find(c => c.dayOfWeek === dayOfWeek);
        if (custom) {
            return {
                startTime: custom.startTime,
                endTime: custom.endTime,
                slotInterval: custom.slotInterval ?? company.slotInterval ?? 30,
            };
        }
    }
    return {
        startTime: company.defaultStartTime,
        endTime: company.defaultEndTime,
        slotInterval: company.slotInterval ?? 30,
    };
}

export function isHoliday(date: DateTime, company: Company): boolean {
    if (!company.holidays?.length) return false;
    return company.holidays.some(h => {
        let holidayDate: DateTime;
        if (typeof h === 'string') {
            holidayDate = DateTime.fromISO(h).startOf('day');
        } else {
            holidayDate = DateTime.fromJSDate(h).startOf('day');
        }
        return holidayDate.hasSame(date, 'day');
    });
}

export function isWorkingDay(date: DateTime, company: Company): boolean {
    if (isHoliday(date, company)) return false;
    const dayOfWeek = date.weekday;
    switch (company.workScheduleType) {
        case 'EVERY_DAY':
            return true;
        case 'FIVE_TWO':
            return dayOfWeek !== 6 && dayOfWeek !== 7;
        case 'CUSTOM':
            return !!company.customWorkDays?.some(c => c.dayOfWeek === dayOfWeek);
        default:
            return true;
    }
}

export function isDateSelectable(date: DateTime, company: Company): boolean {
    const now = DateTime.now().setZone(company.timezone).startOf('day');
    if (date < now) return false;
    const maxDays = company.bookingLeadDays ?? 30;
    const maxDate = now.plus({ days: maxDays });
    if (date > maxDate) return false;
    return isWorkingDay(date, company);
}

export function generateTimeSlots(company: Company, date: DateTime): string[] {
    const config = getDayConfig(company, date);
    const [startHour, startMin] = config.startTime.split(':').map(Number);
    const [endHour, endMin] = config.endTime.split(':').map(Number);

    const start = DateTime.fromObject({
        year: date.year,
        month: date.month,
        day: date.day,
        hour: startHour,
        minute: startMin,
    }, { zone: company.timezone });

    const end = DateTime.fromObject({
        year: date.year,
        month: date.month,
        day: date.day,
        hour: endHour,
        minute: endMin,
    }, { zone: company.timezone });

    const slots: string[] = [];
    let current = start;
    while (current < end) {
        slots.push(current.toFormat('HH:mm'));
        current = current.plus({ minutes: config.slotInterval });
    }
    return slots;
}