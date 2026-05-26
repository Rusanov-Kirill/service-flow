import { Resend } from 'resend';
import { config } from '../config';

const resend = new Resend(config.resend.apiKey);

export const emailService = {
    sendVerificationEmail: async (to: string, token: string) => {
        const verificationUrl = `${config.frontendUrl}/auth/verify-email?token=${token}`;

        const { data, error } = await resend.emails.send({
            from: config.resend.fromEmail,
            to,
            subject: 'Подтверждение email - ServiceFlow',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Подтверждение email</title>
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #6B4EFF;">ServiceFlow</h1>
                    <h2>Добро пожаловать!</h2>
                    <p>Для подтверждения вашего email адреса, пожалуйста, нажмите на кнопку ниже:</p>
                    <a href="${verificationUrl}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #6B4EFF; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
                        Подтвердить email
                    </a>
                    <p>Или скопируйте ссылку в браузер:</p>
                    <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                    <p>Ссылка действительна в течение 24 часов.</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px;">Если вы не регистрировались в ServiceFlow, просто проигнорируйте это письмо.</p>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send verification email');
        }

        return data;
    },

    sendBookingConfirmedEmail: async (to: string, bookingDetails: {
        bookingId: string;
        customerName: string;
        serviceName: string;
        startTime: Date;
        companyName: string;
        companySlug?: string;
    }) => {
        const dashboardUrl = `${config.frontendUrl}/home/dashboard/${bookingDetails.companySlug || bookingDetails.companyName.toLowerCase().replace(/\s+/g, '-')}`;

        const formattedDate = new Date(bookingDetails.startTime).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const { data, error } = await resend.emails.send({
            from: config.resend.fromEmail,
            to,
            subject: `Бронирование подтверждено - ServiceFlow`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Бронирование подтверждено</title>
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #6B4EFF;">ServiceFlow</h1>
                    
                    <div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10b981;">
                        <h2 style="margin: 0 0 10px 0;">Здравствуйте, ${bookingDetails.customerName}!</h2>
                        <p style="margin: 0; color: #666;">Ваше бронирование <strong>подтверждено</strong>! Ждём вас в назначенное время.</p>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0;">Детали бронирования:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Компания:</td>
                                <td style="padding: 8px 0; font-weight: bold;">${bookingDetails.companyName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Услуга:</td>
                                <td style="padding: 8px 0; font-weight: bold;">${bookingDetails.serviceName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Дата и время:</td>
                                <td style="padding: 8px 0; font-weight: bold;">${formattedDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Номер бронирования:</td>
                                <td style="padding: 8px 0; font-weight: bold;">${bookingDetails.bookingId.slice(0, 8)}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <a href="${dashboardUrl}" 
                           style="display: inline-block; padding: 12px 24px; background-color: #6B4EFF; color: white; text-decoration: none; border-radius: 8px;">
                            Перейти к бронированию
                        </a>
                    </div>

                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px;">
                        Если у вас возникли вопросы, свяжитесь с компанией напрямую или напишите в поддержку ServiceFlow.
                    </p>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send booking confirmation email');
        }

        return data;
    }
};