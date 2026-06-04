import { useState, useEffect, useMemo } from 'react';
import {
    Line,
    Bar,
    Pie,
    Doughnut,
} from 'react-chartjs-2';

import { analyticsApi } from '@/entities/analytics';
import Loader from '@/shared/ui/Loader';
import Button from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';

import styles from './AnalyticsSection.module.scss';

interface AnalyticsSectionProps {
    companyId: string | undefined;
}

type Period = 'day' | 'week' | 'month';

const periodOptions = [
    { value: 'day', label: 'По дням' },
    { value: 'week', label: 'По неделям' },
    { value: 'month', label: 'По месяцам' },
];

const AnalyticsSection = ({ companyId }: AnalyticsSectionProps) => {
    const [isLoading, setIsLoading] = useState(true);

    const [period, setPeriod] = useState<Period>('week');

    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: '',
    });

    // API DATA
    const [revenueData, setRevenueData] = useState<any>(null);
    const [topServices, setTopServices] = useState<any[]>([]);
    const [statusDistribution, setStatusDistribution] = useState<any[]>([]);
    const [popularDays, setPopularDays] = useState<any[]>([]);
    const [financeData, setFinanceData] = useState<any>(null);
    const [dashboardStats, setDashboardStats] = useState<any>(null);

    useEffect(() => {
        if (companyId) {
            initDateRange();
        }
    }, [companyId]);

    useEffect(() => {
        if (
            companyId &&
            dateRange.startDate &&
            dateRange.endDate
        ) {
            fetchAllData();
        }
    }, [companyId, period, dateRange]);

    const initDateRange = () => {
        const endDate = new Date();

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);

        setDateRange({
            startDate:
                startDate.toISOString().split('T')[0] || '',
            endDate:
                endDate.toISOString().split('T')[0] || '',
        });
    };

    const fetchAllData = async () => {
        if (!companyId) return;

        setIsLoading(true);

        try {
            const [
                revenue,
                services,
                status,
                days,
                finance,
                dashboard,
            ] = await Promise.all([
                analyticsApi.getRevenue(
                    companyId,
                    dateRange.startDate,
                    dateRange.endDate,
                    period
                ),

                analyticsApi.getTopServices(
                    companyId,
                    dateRange.startDate,
                    dateRange.endDate
                ),

                analyticsApi.getStatusDistribution(
                    companyId,
                    dateRange.startDate,
                    dateRange.endDate
                ),

                analyticsApi.getPopularDays(
                    companyId,
                    dateRange.startDate,
                    dateRange.endDate
                ),

                analyticsApi.getFinance(
                    companyId,
                    dateRange.startDate,
                    dateRange.endDate
                ),

                analyticsApi.getDashboardStats(companyId),
            ]);

            setRevenueData(revenue.data);
            setTopServices(services.data || []);
            setStatusDistribution(status.data || []);
            setPopularDays(days.data || []);
            setFinanceData(finance.data);
            setDashboardStats(dashboard.data);
        } catch (error) {
            console.error('Ошибка загрузки аналитики:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePeriodChange = (value: string) => {
        setPeriod(value as Period);
    };

    // =========================
    // KPI CALCULATIONS
    // =========================

    const totalStatuses = useMemo(() => {
        return statusDistribution.reduce(
            (sum, s) => sum + s.count,
            0
        );
    }, [statusDistribution]);

    const completedCount = useMemo(() => {
        return (
            statusDistribution.find(
                s => s.status === 'completed'
            )?.count || 0
        );
    }, [statusDistribution]);

    const cancelledCount = useMemo(() => {
        return (
            statusDistribution.find(
                s => s.status === 'cancelled'
            )?.count || 0
        );
    }, [statusDistribution]);

    const conversion = useMemo(() => {
        if (!totalStatuses) return 0;

        return (
            (completedCount / totalStatuses) *
            100
        ).toFixed(1);
    }, [completedCount, totalStatuses]);

    const cancelRate = useMemo(() => {
        if (!totalStatuses) return 0;

        return (
            (cancelledCount / totalStatuses) *
            100
        ).toFixed(1);
    }, [cancelledCount, totalStatuses]);

    const bestDay = useMemo(() => {
        if (!popularDays.length) return null;

        return popularDays.reduce((prev, current) =>
            current.revenue > prev.revenue
                ? current
                : prev
        );
    }, [popularDays]);

    const topService = topServices[0];

    // =========================
    // REVENUE CHART
    // =========================

    const revenueChartData = revenueData
        ? {
              labels:
                  revenueData.periodData?.map(
                      (item: any) => item.date
                  ) || [],

              datasets: [
                  {
                      label: 'Выручка (₽)',
                      data:
                          revenueData.periodData?.map(
                              (item: any) => item.revenue
                          ) || [],

                      borderColor: '#4f46e5',
                      backgroundColor:
                          'rgba(79, 70, 229, 0.1)',

                      tension: 0.4,
                      fill: true,
                  },

                  {
                      label:
                          'Количество бронирований',

                      data:
                          revenueData.periodData?.map(
                              (item: any) =>
                                  item.bookingsCount
                          ) || [],

                      borderColor: '#10b981',

                      backgroundColor:
                          'rgba(16, 185, 129, 0.1)',

                      tension: 0.4,
                      fill: true,

                      yAxisID: 'y1',
                  },
              ],
          }
        : null;

    const revenueChartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
            mode: 'index' as const,
            intersect: false,
        },

        plugins: {
            legend: {
                position: 'top' as const,
            },

            tooltip: {
                callbacks: {
                    label: (context: any) =>
                        `${context.dataset.label}: ${context.raw.toLocaleString(
                            'ru-RU'
                        )}`,
                },
            },
        },

        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Выручка (₽)',
                },
            },

            y1: {
                position: 'right' as const,

                title: {
                    display: true,
                    text: 'Бронирования',
                },

                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    // =========================
    // TOP SERVICES CHART
    // =========================

    const topServicesChartData = topServices.length
        ? {
              labels: topServices.map(
                  s => s.serviceName
              ),

              datasets: [
                  {
                      label: 'Выручка',

                      data: topServices.map(
                          s => s.revenue
                      ),

                      backgroundColor: '#4f46e5',
                      borderRadius: 10,
                  },
              ],
          }
        : null;

    // =========================
    // STATUS CHART
    // =========================

    const statusChartData = statusDistribution.length
        ? {
              labels: statusDistribution.map(s => {
                  const labels: Record<
                      string,
                      string
                  > = {
                      pending: 'Ожидает',
                      confirmed: 'Подтверждено',
                      completed: 'Завершено',
                      cancelled: 'Отменено',
                  };

                  return (
                      labels[s.status] || s.status
                  );
              }),

              datasets: [
                  {
                      data: statusDistribution.map(
                          s => s.count
                      ),

                      backgroundColor: [
                          '#f59e0b',
                          '#3b82f6',
                          '#10b981',
                          '#ef4444',
                      ],
                  },
              ],
          }
        : null;

    // =========================
    // POPULAR DAYS
    // =========================

    const popularDaysChartData =
        popularDays.length
            ? {
                  labels: popularDays.map(
                      d => d.dayName
                  ),

                  datasets: [
                      {
                          label:
                              'Количество бронирований',

                          data: popularDays.map(
                              d => d.bookingsCount
                          ),

                          backgroundColor: '#8b5cf6',

                          borderRadius: 10,
                      },
                  ],
              }
            : null;

    // =========================
    // REVENUE VS EXPENSES
    // =========================

    const financeCompareData = financeData
        ? {
              labels: [
                  'Выручка',
                  'Расходы',
                  'Прибыль',
              ],

              datasets: [
                  {
                      data: [
                          financeData.totalRevenue,
                          financeData.totalExpenses,
                          financeData.netProfit,
                      ],

                      backgroundColor: [
                          '#10b981',
                          '#ef4444',
                          '#4f46e5',
                      ],

                      borderWidth: 0,
                  },
              ],
          }
        : null;

    if (isLoading) {
        return (
            <div className={styles.sectionContent}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={styles.sectionContent}>
            {/* KPI */}
            {dashboardStats && (
                <div className={styles.kpiGrid}>
                    <div className={styles.kpiCard}>
                        <span
                            className={styles.kpiLabel}
                        >
                            Выручка за месяц
                        </span>

                        <span
                            className={styles.kpiValue}
                        >
                            {Math.round(
                                dashboardStats.revenueThisMonth
                            ).toLocaleString('ru-RU')}{' '}
                            ₽
                        </span>
                    </div>

                    <div className={styles.kpiCard}>
                        <span
                            className={styles.kpiLabel}
                        >
                            Выручка за неделю
                        </span>

                        <span
                            className={styles.kpiValue}
                        >
                            {Math.round(
                                dashboardStats.revenueThisWeek
                            ).toLocaleString('ru-RU')}{' '}
                            ₽
                        </span>
                    </div>

                    <div className={styles.kpiCard}>
                        <span
                            className={styles.kpiLabel}
                        >
                            Средний чек
                        </span>

                        <span
                            className={styles.kpiValue}
                        >
                            {Math.round(
                                revenueData?.averageCheck || 0
                            ).toLocaleString('ru-RU')}{' '}
                            ₽
                        </span>
                    </div>

                    <div className={styles.kpiCard}>
                        <span
                            className={styles.kpiLabel}
                        >
                            Конверсия
                        </span>

                        <span
                            className={styles.kpiValue}
                        >
                            {conversion}%
                        </span>
                    </div>

                    <div className={styles.kpiCard}>
                        <span
                            className={styles.kpiLabel}
                        >
                            Процент отмен
                        </span>

                        <span
                            className={styles.kpiValue}
                        >
                            {cancelRate}%
                        </span>
                    </div>

                    <div className={styles.kpiCard}>
                        <span
                            className={styles.kpiLabel}
                        >
                            Всего клиентов
                        </span>

                        <span
                            className={styles.kpiValue}
                        >
                            {
                                dashboardStats.totalCustomers
                            }
                        </span>
                    </div>

                    <div className={styles.kpiCard}>
                        <span
                            className={styles.kpiLabel}
                        >
                            Активные бронирования
                        </span>

                        <span
                            className={styles.kpiValue}
                        >
                            {
                                dashboardStats.activeBookings
                            }
                        </span>
                    </div>

                    <div className={styles.kpiCard}>
                        <span
                            className={styles.kpiLabel}
                        >
                            Лучший день
                        </span>

                        <span
                            className={styles.kpiValue}
                        >
                            {bestDay?.dayName || '-'}
                        </span>
                    </div>
                </div>
            )}

            {/* CONTROLS */}
            <div className={styles.controls}>
                <Select
                    label="Период"
                    options={periodOptions}
                    value={period}
                    onChange={handlePeriodChange}
                />

                <Button
                    variant="secondary"
                    onClick={fetchAllData}
                >
                    Обновить
                </Button>
            </div>

            {/* FINANCE */}
            {financeData && (
                <div className={styles.financeGrid}>
                    <div className={styles.financeCard}>
                        <h4>Выручка</h4>

                        <p
                            className={
                                styles.revenue
                            }
                        >
                            {Math.round(
                                financeData.totalRevenue
                            ).toLocaleString(
                                'ru-RU'
                            )}{' '}
                            ₽
                        </p>
                    </div>

                    <div className={styles.financeCard}>
                        <h4>Расходы</h4>

                        <p
                            className={
                                styles.expense
                            }
                        >
                            {Math.round(
                                financeData.totalExpenses
                            ).toLocaleString(
                                'ru-RU'
                            )}{' '}
                            ₽
                        </p>
                    </div>

                    <div className={styles.financeCard}>
                        <h4>Прибыль</h4>

                        <p
                            className={
                                styles.profit
                            }
                        >
                            {Math.round(
                                financeData.netProfit
                            ).toLocaleString(
                                'ru-RU'
                            )}{' '}
                            ₽
                        </p>
                    </div>

                    <div className={styles.financeCard}>
                        <h4>Рентабельность</h4>

                        <p>
                            {financeData.profitMargin.toFixed(
                                1
                            )}
                            %
                        </p>
                    </div>

                    <div className={styles.financeCard}>
                        <h4>
                            Топ услуга
                        </h4>

                        <p>
                            {topService?.serviceName ||
                                '-'}
                        </p>
                    </div>
                </div>
            )}

            {/* REVENUE CHART */}
            {revenueChartData && (
                <div className={styles.chartCard}>
                    <h3>
                        Динамика выручки и
                        бронирований
                    </h3>

                    <div
                        className={
                            styles.chartWrapper
                        }
                    >
                        <Line
                            data={
                                revenueChartData
                            }
                            options={
                                revenueChartOptions
                            }
                        />
                    </div>
                </div>
            )}

            {/* FINANCE COMPARE */}
            {financeCompareData && (
                <div className={styles.chartCard}>
                    <h3>
                        Финансовое сравнение
                    </h3>

                    <div
                        className={
                            styles.chartWrapperSmall
                        }
                    >
                        <Doughnut
                            data={
                                financeCompareData
                            }
                            options={{
                                responsive: true,
                                maintainAspectRatio:
                                    false,
                            }}
                        />
                    </div>
                </div>
            )}

            <div className={styles.chartsRow}>
                {/* TOP SERVICES */}
                {topServicesChartData && (
                    <div className={styles.chartCard}>
                        <h3>
                            Топ услуг по
                            выручке
                        </h3>

                        <div
                            className={
                                styles.chartWrapperSmall
                            }
                        >
                            <Bar
                                data={
                                    topServicesChartData
                                }
                                options={{
                                    responsive: true,
                                    maintainAspectRatio:
                                        false,
                                }}
                            />
                        </div>

                        {/* PROGRESS BARS */}
                        <div
                            className={
                                styles.servicesList
                            }
                        >
                            {topServices.map(
                                service => (
                                    <div
                                        key={
                                            service.serviceId
                                        }
                                        className={
                                            styles.serviceItem
                                        }
                                    >
                                        <div
                                            className={
                                                styles.serviceRow
                                            }
                                        >
                                            <span>
                                                {
                                                    service.serviceName
                                                }
                                            </span>

                                            <span>
                                                {service.percentage.toFixed(
                                                    1
                                                )}
                                                %
                                            </span>
                                        </div>

                                        <div
                                            className={
                                                styles.progress
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.progressFill
                                                }
                                                style={{
                                                    width: `${service.percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* STATUS */}
                {statusChartData && (
                    <div className={styles.chartCard}>
                        <h3>
                            Статусы
                            бронирований
                        </h3>

                        <div
                            className={
                                styles.chartWrapperSmall
                            }
                        >
                            <Pie
                                data={
                                    statusChartData
                                }
                                options={{
                                    responsive: true,
                                    maintainAspectRatio:
                                        false,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* POPULAR DAYS */}
            {popularDaysChartData && (
                <div className={styles.chartCard}>
                    <h3>
                        Популярные дни
                        недели
                    </h3>

                    <div
                        className={
                            styles.chartWrapper
                        }
                    >
                        <Bar
                            data={
                                popularDaysChartData
                            }
                            options={{
                                responsive: true,
                                maintainAspectRatio:
                                    false,
                            }}
                        />
                    </div>
                </div>
            )}

            {!topServices.length &&
                !popularDays.length && (
                    <div className={styles.empty}>
                        <p>
                            Нет данных за
                            выбранный период
                        </p>

                        <span>
                            Попробуйте
                            изменить период
                            или дождитесь
                            поступления
                            бронирований
                        </span>
                    </div>
                )}
        </div>
    );
};

export default AnalyticsSection;