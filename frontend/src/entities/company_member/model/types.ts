export interface CompanyMember {
    id: string;
    userId: string;
    companyId: string;
    role: MemberRole;
    permissions: string[];
    scheduleType?: MemberScheduleType;
    startWorkTime: string;
    endWorkTime: string;
    startWorkDay?: Date;
    customWorkSchedule?: CustomWorkSchedule;
};

export type MemberRole = 'owner' | 'admin' | 'manager' | 'receptionist' | 'member';

interface CustomWorkSchedule {
    dayOfWeek: number;
    startWorkTime: string;
    endWorkTime: string;
};

type MemberScheduleType = 'FIVE_TWO' | 'TWO_TWO' | 'CUSTOM';