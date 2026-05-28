import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
// import path from 'path';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import companyRoutes from './modules/company/company.routes';
import customerRoutes from './modules/customer/customer.routes';
import bookingRoutes from './modules/bookings/bookings.routes';
import companyMemberRoutes from './modules/company_member/company_member.routes';
import serviceRoutes from './modules/service/service.routes';
import favoritesRoutes from './modules/favorites/favorites.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import expensesRoutes from './modules/expenses/expenses.routes';

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
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/companies', companyRoutes);
app.use('/customers', customerRoutes);
app.use('/bookings', bookingRoutes);
app.use('/company-members', companyMemberRoutes);
app.use('/services', serviceRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/expenses', expensesRoutes);

// Health check
app.get('/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;