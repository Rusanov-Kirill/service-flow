export interface CompanyMember {
    id: string;
    userId: string;
    companyId: string;
    role: MemberRole;
    permissions: string[];
    scheduleType?: MemberScheduleType;
    startWorkTime?: string;
    endWorkTime?: string;
    startWorkDay?: string;
    customWorkSchedule?: CustomWorkSchedule[];
};

export type MemberWithUser = CompanyMember & {
    user: MemberUserPreview;
};

export type MemberRole = 'owner' | 'admin' | 'manager' | 'receptionist' | 'member';

export interface CustomWorkSchedule {
    dayOfWeek: number;
    startWorkTime: string;
    endWorkTime: string;
};

type MemberScheduleType = 'FIVE_TWO' | 'TWO_TWO' | 'CUSTOM';

type MemberUserPreview = {
    firstName: string | null;
    lastName: string | null;
    email: string;
    avatar: string | null;
};