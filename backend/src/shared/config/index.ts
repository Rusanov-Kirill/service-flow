import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
    'DATABASE_URL',
    'RESEND_API_KEY',
    'FRONTEND_URL',
    'JWT_SECRET',           
    'JWT_REFRESH_SECRET'    
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export const config = {
    port: parseInt(process.env['PORT'] || '5000'),
    nodeEnv: process.env['NODE_ENV'] || 'development',

    database: {
        url: process.env['DATABASE_URL'] as string
    },

    jwt: {
        secret: process.env['JWT_SECRET'] as string,
        refreshSecret: process.env['JWT_REFRESH_SECRET'] as string,
        expiresIn: process.env['JWT_EXPIRES_IN'] || '15m',
        refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] || '7d'
    },
    
    resend: {
        apiKey: process.env['RESEND_API_KEY'] as string
    },

    frontendUrl: process.env['FRONTEND_URL'] as string
};