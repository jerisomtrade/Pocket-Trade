import { createRedisConnection, isRedisConfigured } from '@/common/config';
import { logger } from '@/common/utils';
import { Queue, Worker, Job } from 'bullmq';
import { handleCopyOpen, handleCopyClose } from './handlers';

const connection = createRedisConnection();

// Queues
const copyQueue = connection
	? new Queue('copyQueue', {
			connection,
			defaultJobOptions: {
				attempts: 3,
				backoff: { type: 'exponential', delay: 1000 },
			},
		})
	: null;

// Workers
const copyWorker = connection
	? new Worker(
			'copyQueue',
			async (job: Job) => {
				const { type, data } = job.data;
				try {
					if (type === 'OPEN_TRADE') {
						await handleCopyOpen(data);
					} else if (type === 'CLOSE_TRADE') {
						await handleCopyClose(data);
					}
				} catch (error) {
					logger.error(`Error processing copy job ${job.id}:`, error);
					throw error;
				}
			},
			{ connection, concurrency: 5 }
		)
	: null;

export const addCopyJob = async (type: 'OPEN_TRADE' | 'CLOSE_TRADE', data: any) => {
	if (copyQueue) {
		await copyQueue.add(type, { type, data });
	} else {
		// In-process fallback when Redis is not running
		try {
			if (type === 'OPEN_TRADE') {
				await handleCopyOpen(data);
			} else if (type === 'CLOSE_TRADE') {
				await handleCopyClose(data);
			}
		} catch (error) {
			logger.error(`Error in direct copy job (${type}):`, error);
		}
	}
};

export const startCopyQueue = async () => {
	if (!copyQueue || !copyWorker) {
		console.info('Redis is not configured. Copy trading queue disabled (running synchronous fallback).');
		return;
	}
	await copyQueue.waitUntilReady();
	await copyWorker.waitUntilReady();
	console.info('Copy trading queue and worker are ready.');
};

export const stopCopyQueue = async () => {
	if (copyWorker) await copyWorker.close();
	if (copyQueue) await copyQueue.close();
};

export { copyQueue, copyWorker };
