import { useState } from 'react';

import type { MemberRole, MemberWithUser } from '@/entities/company_member';
import PlaceholderLogo from '@/shared/ui/PlaceholderLogo';
import Button from '@/shared/ui/Button';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import Notification from '@shared/ui/Notification';
import { roleLabels, ROLE_PERMISSIONS } from '@/shared/utils/roleUtils';

import styles from './MemberDetailsModal.module.scss';

interface MemberDetailsModalProps {
    member: MemberWithUser;
    canManageMembers?: boolean;
    currentUserId?: string;
    onClose: () => void;
    onDelete?: (memberId: string) => Promise<void> | void;
    onRoleChange?: (memberId: string, role: MemberRole) => Promise<void> | void;
}

const dayLabels: Record<number, string> = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
    7: 'Воскресенье',
};

const MemberDetailsModal = ({
    member,
    canManageMembers = false,
    currentUserId,
    onClose,
    onDelete,
    onRoleChange
}: MemberDetailsModalProps) => {
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [role, setRole] = useState<MemberRole>(member.role);
    const [isSavingRole, setIsSavingRole] = useState<boolean>(false);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    if (!member) return null;

    const fullName = `${member.user?.firstName || ''} ${member.user?.lastName || ''}`.trim();
    const isSelf = member.userId === currentUserId;

    const renderScheduleType = () => {
        switch (member.scheduleType) {
            case 'FIVE_TWO':
                return '5/2';
            case 'TWO_TWO':
                return '2/2';
            case 'CUSTOM':
                return 'Индивидуальный';
            default:
                return '—';
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;

        try {
            setIsDeleting(true);
            await onDelete(member.id);

            setNotification({
                type: 'success',
                message: `Сотрудник ${fullName || member.user?.email} успешно удалён`,
            });

            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Не удалось удалить сотрудника',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveRole = async () => {
        if (!onRoleChange) return;

        try {
            setIsSavingRole(true);
            await onRoleChange(member.id, role);

            setNotification({
                type: 'success',
                message: `Роль успешно изменена на "${roleLabels[role]}"`,
            });
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Не удалось изменить роль сотрудника',
            });
            setRole(member.role);
        } finally {
            setIsSavingRole(false);
        }
    };

    return (
        <>
            <div className={styles.overlay} onClick={onClose}>
                <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.header}>
                        <h2>Сотрудник</h2>
                        <button onClick={onClose}>✕</button>
                    </div>

                    <div className={styles.content}>

                        <div className={styles.profile}>
                            <div className={styles.avatar}>
                                <PlaceholderLogo
                                    src={member.user?.avatar}
                                    alt="avatar"
                                    variant="profile"
                                />
                            </div>

                            <h3>{fullName || 'Без имени'}</h3>
                            <p>{member.user?.email}</p>
                        </div>

                        <div className={styles.section}>
                            <h4>Роль</h4>

                            {canManageMembers ? (
                                <div className={styles.roleEditor}>
                                    <select
                                        className={styles.select}
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as MemberRole)}
                                        disabled={member.role === 'owner'}
                                    >
                                        {Object.entries(roleLabels).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        className={styles.saveBtn}
                                        onClick={handleSaveRole}
                                        disabled={isSavingRole || role === member.role}
                                    >
                                        {isSavingRole ? 'Сохранение...' : 'Сохранить'}
                                    </button>
                                </div>
                            ) : (
                                <p>{roleLabels[member.role]}</p>
                            )}
                        </div>

                        <div className={styles.section}>
                            <h4>Разрешения</h4>

                            <div className={styles.permissions}>
                                {(ROLE_PERMISSIONS[role] || []).map((perm, i) => (
                                    <label key={i} className={styles.permissionItem}>
                                        <input type="checkbox" checked readOnly />
                                        <span>{perm}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h4>Тип графика</h4>
                            <p>{renderScheduleType()}</p>
                        </div>

                        {member.scheduleType === 'CUSTOM' && member.customWorkSchedule && (
                            <div className={styles.section}>
                                <h4>Индивидуальный график</h4>

                                <div className={styles.scheduleList}>
                                    {member.customWorkSchedule.map((day: any, index: number) => (
                                        <div key={index} className={styles.scheduleItem}>
                                            <span className={styles.day}>
                                                {dayLabels[day.dayOfWeek] || `День ${day.dayOfWeek}`}
                                            </span>
                                            <span className={styles.time}>
                                                {day.startWorkTime} — {day.endWorkTime}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {member.scheduleType !== 'CUSTOM' && (<div className={styles.section}>
                            <h4>Рабочее время</h4>
                            <p>
                                {member.startWorkTime} — {member.endWorkTime}
                            </p>
                        </div>
                        )}
                    </div>

                    <div className={styles.footer}>

                        {canManageMembers && member.role !== 'owner' && (
                            <button
                                className={styles.deleteBtn}
                                disabled={isSelf}
                                onClick={() => setConfirmOpen(true)}
                                title={isSelf ? 'Нельзя удалить самого себя' : ''}
                            >
                                Удалить сотрудника
                            </button>
                        )}

                        <Button onClick={onClose}>Закрыть</Button>
                    </div>
                </div>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                    duration={4000}
                    position="top"
                />
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                title="Удаление сотрудника"
                message="Вы уверены, что хотите удалить сотрудника?"
                confirmText="Удалить"
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </>
    );
};

export default MemberDetailsModal;