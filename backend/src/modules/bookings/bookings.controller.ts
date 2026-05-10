import { Request, Response } from 'express';
import { bookingsService } from './bookings.service';
import { createBookingSchema, updateBookingSchema, bookingIdSchema, findAllCompanyBookingsSchema } from './bookings.validation';

export const bookingsController = {
    create: async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = createBookingSchema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    error: result.error.issues[0]?.message || 'Ошибка валидации'
                });
            }

            const booking = await bookingsService.create(result.data);
            return res.status(201).json(booking);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },

    update: async (req: Request, res: Response): Promise<Response> => {
        try {
            const idResult = bookingIdSchema.safeParse(req.params);
            if (!idResult.success) {
                return res.status(400).json({ error: 'Неверный формат ID' });
            }

            const dataResult = updateBookingSchema.safeParse(req.body);
            if (!dataResult.success) {
                return res.status(400).json({ error: dataResult.error.issues[0]?.message });
            }

            const booking = await bookingsService.update(idResult.data.id, dataResult.data);
            return res.json(booking);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },

    getBookedSlots: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId } = req.params;
            const { date, serviceId } = req.query;

            if (!date || typeof date !== 'string') {
                return res.status(400).json({ error: 'date обязателен и должен быть строкой' });
            }

            if (typeof companyId !== 'string') {
                return res.status(400).json({ error: 'Неверный формат companyId' });
            }

            const bookedSlots = await bookingsService.getBookedSlots(
                companyId,
                date,
                typeof serviceId === 'string' ? serviceId : undefined
            );

            return res.json(bookedSlots);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },

    findAllCompanyBookings: async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = findAllCompanyBookingsSchema.safeParse({
                companyId: req.query['companyId'],
            });

            if (!result.success) {
                return res.status(400).json({
                    error: result.error.issues[0]?.message || 'Ошибка валидации'
                });
            }

            const { companyId } = result.data;
            const bookings = await bookingsService.findAllCompanyBookings(companyId);

            return res.status(200).json({
                success: true,
                data: bookings
            });
        } catch (error: any) {
            if (error.message === 'Бронирований не найдено') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
};