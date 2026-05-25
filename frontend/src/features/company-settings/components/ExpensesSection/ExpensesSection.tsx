import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { expensesApi } from '@/entities/expenses';
import { CATEGORY_LABELS, EXPENSE_CATEGORIES, type Expense, type ExpenseCategory, type CategoryStats } from '@/entities/expenses';
import Button from '@/shared/ui/Button';
import FormField from '@/shared/ui/auth/FormField';
import Select from '@/shared/ui/Select';
import Loader from '@/shared/ui/Loader';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import Notification from '@/shared/ui/Notification';

import styles from './ExpensesSection.module.scss';

interface ExpensesSectionProps {
    companyId: string | undefined;
}

const ExpensesSection = ({ companyId }: ExpensesSectionProps) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null,
    });
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    
    const formRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        amount: '',
        category: 'other' as ExpenseCategory,
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (companyId) {
            fetchAllData();
        }
    }, [companyId]);

    useEffect(() => {
        if (showForm && formRef.current) {
            formRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [showForm, editingExpense]);

    const fetchAllData = async () => {
        if (!companyId) return;

        setIsLoading(true);
        try {
            const [expensesRes, categoryRes] = await Promise.all([
                expensesApi.getByCompany(companyId),
                expensesApi.getByCategory(companyId),
            ]);

            if (expensesRes.success) {
                setExpenses(expensesRes.data.expenses);
                setTotal(expensesRes.data.total);
            }

            if (categoryRes.success) {
                setCategoryStats(categoryRes.data.categories);
            }
        } catch (error) {
            console.error('Ошибка загрузки расходов:', error);
            setNotification({ type: 'error', message: 'Не удалось загрузить расходы' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyId) return;

        try {
            if (editingExpense) {
                await expensesApi.update(editingExpense.id, {
                    amount: Number(formData.amount),
                    category: formData.category,
                    description: formData.description || null,
                    date: formData.date,
                });
                setNotification({ type: 'success', message: 'Расход обновлён' });
            } else {
                await expensesApi.create({
                    companyId,
                    amount: Number(formData.amount),
                    category: formData.category,
                    description: formData.description || null,
                    date: formData.date,
                });
                setNotification({ type: 'success', message: 'Расход добавлен' });
            }

            setShowForm(false);
            setEditingExpense(null);
            resetForm();
            fetchAllData();
        } catch (error) {
            console.error('Ошибка сохранения расхода:', error);
            setNotification({ type: 'error', message: 'Не удалось сохранить расход' });
        }
    };

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setFormData({
            amount: expense.amount.toString(),
            category: expense.category,
            description: expense.description || '',
            date: expense.date.split('T')[0],
        });
        setShowForm(true);
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;

        try {
            await expensesApi.delete(deleteConfirm.id);
            setNotification({ type: 'success', message: 'Расход удалён' });
            setDeleteConfirm({ isOpen: false, id: null });
            fetchAllData();
        } catch (error) {
            console.error('Ошибка удаления расхода:', error);
            setNotification({ type: 'error', message: 'Не удалось удалить расход' });
        }
    };

    const resetForm = () => {
        setFormData({
            amount: '',
            category: 'other',
            description: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingExpense(null);
        resetForm();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const formatAmount = (amount: number) => {
        return amount.toLocaleString('ru-RU') + ' ₽';
    };

    if (isLoading) {
        return (
            <div className={styles.sectionContent}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={styles.sectionContent}>
            {/* Статистика по категориям */}
            {categoryStats.length > 0 && (
                <div className={styles.statsSection}>
                    <h4>Расходы по категориям</h4>
                    <div className={styles.categoryStats}>
                        {categoryStats.map((stat) => (
                            <div key={stat.category} className={styles.statItem}>
                                <div className={styles.statHeader}>
                                    <span className={styles.categoryName}>{CATEGORY_LABELS[stat.category]}</span>
                                    <span className={styles.categoryAmount}>{formatAmount(stat.total)}</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${stat.percentage}%` }}
                                    />
                                </div>
                                <div className={styles.statFooter}>
                                    <span>{stat.count} операций</span>
                                    <span>{stat.percentage.toFixed(1)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div ref={formRef} className={styles.totalExpenses}>
                        <span>Общая сумма расходов:</span>
                        <strong>{formatAmount(total)}</strong>
                    </div>
                </div>
            )}

            {/* Форма добавления/редактирования */}
            {showForm && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h4>{editingExpense ? 'Редактировать расход' : 'Добавить расход'}</h4>

                    <div className={styles.formRow}>
                        <FormField
                            label="Сумма"
                            type="number"
                            placeholder="1000"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />

                        <Select
                            label="Категория"
                            options={EXPENSE_CATEGORIES}
                            value={formData.category}
                            onChange={(value) => setFormData({ ...formData, category: value as ExpenseCategory })}
                            required
                        />
                    </div>

                    <FormField
                        label="Описание"
                        placeholder="Например: Реклама в соцсетях"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <FormField
                        label="Дата"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />

                    <div className={styles.formActions}>
                        <Button type="button" variant="secondary" onClick={handleCancel}>
                            Отмена
                        </Button>
                        <Button type="submit" variant="primary">
                            {editingExpense ? 'Сохранить' : 'Добавить'}
                        </Button>
                    </div>
                </form>
            )}

            {/* Кнопка добавления */}
            {!showForm && (
                <div className={styles.addButton}>
                    <Button onClick={() => setShowForm(true)} variant="primary">
                        + Добавить расход
                    </Button>
                </div>
            )}

            {/* Список расходов */}
            <div className={styles.expensesList}>
                <h4>История расходов</h4>

                {expenses.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Расходы не добавлены</p>
                        <span>Нажмите «Добавить расход», чтобы создать первый расход</span>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <div className={styles.expensesTable}>
                            <div className={styles.tableHeader}>
                                <div>Дата</div>
                                <div>Категория</div>
                                <div>Описание</div>
                                <div>Сумма</div>
                                <div></div>
                            </div>

                            {expenses.map((expense) => (
                                <div key={expense.id} className={styles.tableRow}>
                                    <div className={styles.date}>{formatDate(expense.date)}</div>
                                    <div className={styles.category}>
                                        <span className={`${styles.categoryBadge} ${styles[expense.category]}`}>
                                            {CATEGORY_LABELS[expense.category]}
                                        </span>
                                    </div>
                                    <div className={styles.description}>{expense.description || '—'}</div>
                                    <div className={styles.amount}>{formatAmount(expense.amount)}</div>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => handleEdit(expense)}
                                            title="Редактировать"
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => setDeleteConfirm({ isOpen: true, id: expense.id })}
                                            title="Удалить"
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                    duration={3000}
                    position="top"
                />
            )}

            <ConfirmModal
                isOpen={deleteConfirm.isOpen}
                title="Удаление расхода"
                message="Вы уверены, что хотите удалить этот расход? Это действие нельзя отменить."
                confirmText="Удалить"
                cancelText="Отмена"
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
            />
        </div>
    );
};

export default ExpensesSection;