export interface CreateCompanyMemberDto {
    userId: string;
    companyId: string;
    role: MemberRole;
    scheduleType: MemberScheduleType;
    startWorkTime: string;
    endWorkTime: string;
    startWorkDay?: Date;
    customWorkSchedule?: CustomWorkSchedule[];
};

export interface UpdateCompanyMemberDto {
    role?: MemberRole;
    scheduleType?: MemberScheduleType;
    startWorkTime?: string;
    endWorkTime?: string;
    startWorkDay?: Date;
    customWorkSchedule?: CustomWorkSchedule[];
};

export type MemberRole = 'owner' | 'admin' | 'manager' | 'receptionist' | 'member';
type MemberScheduleType = 'FIVE_TWO' | 'TWO_TWO' | 'CUSTOM';

interface CustomWorkSchedule {
    dayOfWeek: number; 
    startWorkTime: string; 
    endWorkTime: string;   
};
 