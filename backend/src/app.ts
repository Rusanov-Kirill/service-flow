import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
// import path from 'path';

import authRoutes from './modules/auth/auth.routes';

import { config } from './shared/config';
 import { errorHandler } from './shared/middleware/error.middleware';

const app = express();

/* Static files 
const staticPath = path.join(process.cwd(), 'public');
app.use('/static', express.static(staticPath));
*/

// Middleware
app.use(helmet());
app.use(
    cors({
        origin: [config.frontendUrl].filter(Boolean) as string[],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
        optionsSuccessStatus: 200
    })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;