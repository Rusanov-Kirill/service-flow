import { Request, Response } from 'express';
import { bookingsService } from './bookings.service';
import { createBookingSchema, updateBookingSchema, bookingIdSchema } from './bookings.validation';

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
};