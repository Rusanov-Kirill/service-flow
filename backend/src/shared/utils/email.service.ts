import { Resend } from 'resend';
import { config } from '../config';

const resend = new Resend(config.resend.apiKey);

export const emailService = {
    sendVerificationEmail: async (to: string, token: string) => {
        const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;
        
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
    }
};