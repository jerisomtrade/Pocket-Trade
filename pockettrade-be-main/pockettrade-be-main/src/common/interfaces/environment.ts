export interface IEnvironment {
	APP: {
		NAME?: string;
		COMPANY_NAME?: string;
		PORT: number;
		ENV?: string;
		CLIENT: string;
		COOKIE_DOMAIN?: string;
		ALLOWED_ORIGINS?: string[];
	};
	DB: {
		URL?: string;
		HOST?: string;
		USER?: string;
		PASSWORD?: string;
		DATABASE?: string;
		PORT?: string;
		SSL?: boolean;
	};
	JWT: {
		AUTH_SECRET: string;
		ACCESS_SECRET: string;
		REFRESH_SECRET: string;
	};
	JWT_EXPIRES_IN: {
		ACCESS: string;
		REFRESH: string;
	};
	EMAIL: {
		FROM_ADDRESS?: string;
		GMAIL_USER?: string;
		GMAIL_PASSWORD?: string;
		RESEND_API_KEY?: string;
	};
	FRONTEND_URL: string;
	R2: {
		ACCOUNT_ID?: string;
		REGION?: string;
		ACCESS_KEY_ID?: string;
		SECRET_ACCESS_KEY?: string;
		BUCKET_NAME?: string;
		CDN_URL?: string;
		PUBLIC_URL?: string;
	};
	REDIS: {
		URL?: string;
		PORT?: number;
		PASSWORD?: string;
	};
	FINNHUB_API_KEY?: string;
	TWELVE_DATA_API_KEY?: string;
}
