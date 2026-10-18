import IORedis from 'ioredis';
import { ENVIRONMENT } from './environment';

export const isRedisConfigured = (): boolean => {
	return Boolean(ENVIRONMENT.REDIS.URL);
};

export const createRedisConnection = (): IORedis | null => {
	const redisUrl = ENVIRONMENT.REDIS.URL;
	if (!redisUrl) return null;

	const isTls = redisUrl.startsWith('rediss://') || redisUrl.includes('upstash.io');

	if (redisUrl.startsWith('redis://') || redisUrl.startsWith('rediss://')) {
		return new IORedis(redisUrl, {
			maxRetriesPerRequest: null,
			enableOfflineQueue: false,
			...(isTls ? { tls: {} } : {}),
		});
	}

	return new IORedis({
		host: redisUrl,
		port: ENVIRONMENT.REDIS.PORT || 6379,
		password: ENVIRONMENT.REDIS.PASSWORD || undefined,
		maxRetriesPerRequest: null,
		enableOfflineQueue: false,
		...(isTls ? { tls: {} } : {}),
	});
};

let redisClient: IORedis | null = null;
export const connectRedis = async (): Promise<void> => {
	if (!isRedisConfigured()) {
		console.warn('QUEUE_REDIS_URL is not set. Redis connection skipped.');
		return;
	}

	try {
		redisClient = createRedisConnection();
		if (!redisClient) return;

		redisClient.on('connect', () => {
			console.log('Redis cluster connected');
		});

		redisClient.on('error', (error) => {
			console.error('Redis connection error:', error.message);
		});
	} catch (error) {
		console.log('Error connecting to Redis cluster: ' + (error as Error).message);
	}
};

export const disconnectRedis = async (): Promise<void> => {
	try {
		if (redisClient) {
			await redisClient.quit();
			console.log('Redis disconnected');
		}
	} catch (error) {
		console.log('Error disconnecting from Redis: ' + (error as Error).message);
	}
};

export { redisClient };
