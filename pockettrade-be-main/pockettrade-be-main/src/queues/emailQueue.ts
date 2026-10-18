import { createRedisConnection } from '@/common/config';
import type { EmailJobData } from '@/common/interfaces';
import { logger } from '@/common/utils';
import { Job, Queue, QueueEvents, Worker, WorkerOptions } from 'bullmq';
import { sendEmail } from './handlers';

const connection = createRedisConnection();

if (connection) {
	console.log('Connected to queue redis cluster');
}

// Create a new connection in every node instance
const emailQueue = connection
	? new Queue<EmailJobData>('emailQueue', {
			connection,
			defaultJobOptions: {
				attempts: 5,
				backoff: {
					type: 'exponential',
					delay: 5000,
				},
			},
		})
	: null;

const addEmailToQueue = async (opts: EmailJobData) => {
	const { type, data } = opts;
	try {
		if (emailQueue) {
			await emailQueue.add(type, opts, {
				...(data.priority !== 'high' && { priority: 2 }),
			});
		} else {
			// In-process fallback when Redis is not running
			sendEmail({ data: opts } as Job<EmailJobData>).catch((err) => {
				logger.error('Failed to send direct email:', err);
			});
		}
	} catch (error) {
		console.error('Error enqueueing email job:', error);
		logger.error('Error enqueueing email job:', error);
		throw error;
	}
};

export const resetEmailQueue = async () => {
	if (!emailQueue) return;
	try {
		console.info('Resetting email queue...');
		await emailQueue.obliterate({ force: true });
		console.info('Email queue reset successfully.');
	} catch (error) {
		console.error('Failed to reset email queue:', error);
	}
};

const workerOptions: WorkerOptions | undefined = connection
	? {
			connection,
			limiter: { max: 1, duration: 1000 },
			lockDuration: 5000,
			removeOnComplete: { age: 3600, count: 1000 },
			removeOnFail: { age: 24 * 3600 },
		}
	: undefined;

// create a worker to process jobs from the email queue
const emailWorker = (connection && workerOptions)
	? new Worker<EmailJobData>(
			'emailQueue',
			async (job: Job<EmailJobData>) => {
				try {
					await sendEmail(job);
				} catch (error) {
					console.error('Error sending email:', error);
					throw new Error('Failed to send email');
				}
			},
			workerOptions
		)
	: null;

// EVENT LISTENERS
const emailQueueEvent = connection ? new QueueEvents('emailQueue', { connection }) : null;

if (emailQueueEvent) {
	emailQueueEvent.on('failed', ({ jobId, failedReason }) => {
		console.log(`Job ${jobId} failed with error ${failedReason}`);
		logger.error(`Job ${jobId} failed with error ${failedReason}`);
	});

	emailQueueEvent.on('waiting', ({ jobId }) => {
		console.log(`A job with ID ${jobId} is waiting`);
	});

	emailQueueEvent.on('completed', ({ jobId, returnvalue }) => {
		console.log(`Job ${jobId} completed`, returnvalue);
		logger.info(`Job ${jobId} completed`, returnvalue);
	});
}

if (emailWorker) {
	emailWorker.on('error', (err) => {
		console.error(err);
		logger.error(`Error processing email job: ${err}`);
	});
}

const startEmailQueue = async () => {
	if (!emailQueue || !emailWorker || !emailQueueEvent) {
		console.info('Redis is not configured. Email queue disabled (running direct fallback).');
		return;
	}
	await emailQueue.waitUntilReady();
	await emailWorker.waitUntilReady();
	await emailQueueEvent.waitUntilReady();
	console.info('Email queue and worker are ready.');
};

const stopEmailQueue = async () => {
	if (emailWorker) await emailWorker.close();
	if (emailQueue) await emailQueue.close();
	console.info('Email queue closed!');
};

export { addEmailToQueue, emailQueue, emailQueueEvent, emailWorker, startEmailQueue, stopEmailQueue };
