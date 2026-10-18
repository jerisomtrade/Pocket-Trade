import type { IEnvironment } from '@/common/interfaces';

const parseAllowedOrigins = (): string[] => {
	const defaultOrigins = [
		'https://jerisomtrade.com',
		'https://www.jerisomtrade.com',
		'https://jerisomtrade-admin.vercel.app',
		'https://admin.jerisomtrade.com',
		'https://www.admin.jerisomtrade.com',
		'https://connect.jerisomtrade.com',
		'https://www.connect.jerisomtrade.com',
		'http://localhost:5173',
		'http://localhost:3000',
		'http://localhost:3001',
		'http://localhost:4000',
		'http://localhost:5000',
		'https://jerisomtrade.netlify.app',
		'https://jerisomtrade-admin.netlify.app',
		'https://pockettrade-fe.vercel.app',
		'https://copytrade-admin.vercel.app',
	];

	const customOrigins = process.env.ALLOWED_ORIGINS
		? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
		: [];

	const frontendUrl = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim()] : [];
	const adminUrl = process.env.ADMIN_URL ? [process.env.ADMIN_URL.trim()] : [];

	return Array.from(new Set([...defaultOrigins, ...customOrigins, ...frontendUrl, ...adminUrl]));
};

export const ENVIRONMENT: IEnvironment = {
	APP: {
		NAME: process.env.APP_NAME || 'pockettrade-backend',
		COMPANY_NAME: process.env.COMPANY_NAME || 'PocketTrade',
		PORT: parseInt(process.env.PORT || process.env.APP_PORT || '4000'),
		ENV: process.env.NODE_ENV || 'development',
		CLIENT: process.env.FRONTEND_URL || 'http://localhost:3000',
		COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
		ALLOWED_ORIGINS: parseAllowedOrigins(),
	},
	DB: {
		URL: process.env.DATABASE_URL || process.env.DB_URL,
		HOST: process.env.DB_HOST || 'localhost',
		USER: process.env.DB_USER || 'postgres',
		PASSWORD: process.env.DB_PASSWORD || '',
		DATABASE: process.env.DB_DATABASE || 'pockettrade',
		PORT: process.env.DB_PORT || '5432',
		SSL:
			process.env.DB_SSL === 'true' ||
			process.env.NODE_ENV === 'production' ||
			/sslmode=require|neon\.tech/i.test(process.env.DATABASE_URL || process.env.DB_URL || ''),
	},
	JWT: {
		AUTH_SECRET: process.env.AUTH_SECRET || 'dev_jwt_auth_secret_must_be_changed_in_prod',
		ACCESS_SECRET: process.env.ACCESS_TOKEN || 'dev_access_secret_must_be_changed_in_prod',
		REFRESH_SECRET: process.env.REFRESH_TOKEN || 'dev_refresh_secret_must_be_changed_in_prod',
	},
	JWT_EXPIRES_IN: {
		ACCESS: process.env.ACCESS_TOKEN_EXPIRES_IN || '1d',
		REFRESH: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
	},
	EMAIL: {
		FROM_ADDRESS: process.env.EMAIL_FROM || `${process.env.COMPANY_NAME || 'PocketTrade'} <support@updates.pockettrade.com>`,
		GMAIL_USER: process.env.GMAIL_USER || '',
		GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || '',
		RESEND_API_KEY: process.env.RESEND_API_KEY || '',
	},
	FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
	R2: {
		ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
		REGION: process.env.R2_REGION || 'auto',
		ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
		SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
		BUCKET_NAME: process.env.R2_BUCKET_NAME,
		CDN_URL: process.env.R2_CDN_URL,
		PUBLIC_URL: process.env.R2_PUBLIC_URL,
	},
	REDIS: {
		URL: process.env.QUEUE_REDIS_URL,
		PASSWORD: process.env.QUEUE_REDIS_PASSWORD,
		PORT: process.env.QUEUE_REDIS_PORT ? parseInt(process.env.QUEUE_REDIS_PORT, 10) : undefined,
	},
	FINNHUB_API_KEY: process.env.FINNHUB_API_KEY || '',
	TWELVE_DATA_API_KEY: process.env.TWELVE_DATA_API_KEY || '',
};
