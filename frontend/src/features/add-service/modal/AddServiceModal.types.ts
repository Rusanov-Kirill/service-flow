import { z } from 'zod';

import { CURRENCIES, type CurrenciesType } from '@/shared/utils/selectorValues';

const currencyValues = CURRENCIES.map(c => c.value) as [CurrenciesType, ...CurrenciesType[]];

export const serviceSchema = z.object({
    name: z.string().min(2, 'Название должно состоять минимум из 2 символов'),
    description: z.string().optional(),
    duration: z.number()
        .min(1, 'Услуга должна занимать минимум 1 минуту')
        .max(525600, 'Услуга не может занимать более 525600 минут (1 год)'),
    price: z.number()
        .min(0, 'Цена не может быть отрицательной')
        .max(100_000_000, 'Цена не может превышать 100 000 000'),
    currency: z.enum(currencyValues),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export interface Service extends ServiceFormData {
    id: string;
};