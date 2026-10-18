import { copySubscriptionRepository, followerTradeRepository } from '@/repository';
import { logger } from '@/common/utils';
import { TradeStatus } from '@/common/interfaces';

export const handleCopyOpen = async (data: { masterTradeId: string; traderId: string; symbol: string; direction: string; entryPrice: number; size: number }) => {
	const { masterTradeId, traderId, symbol, direction, entryPrice, size: masterSize } = data;

	logger.info(`Starting fan-out for master trade ${masterTradeId}`);

	// 1. Get all active real (non-demo) subscribers — master trades are always real
	const subscribers = await copySubscriptionRepository.findActiveSubscriptionsByTrader(traderId, false);

	if (!subscribers || subscribers.length === 0) {
		logger.info(`No active subscribers for trader ${traderId}`);
		return;
	}

	// 2. Clone the trade for each subscriber
	for (const sub of subscribers) {
		try {
			const followerSize = masterSize * Number(sub.copyRatio);

			await followerTradeRepository.create({
				masterTradeId,
				followerId: sub.followerId,
				traderId: sub.traderId,
				subscriptionId: sub.id,
				symbol,
				direction,
				entryPrice,
				allocatedAmount: sub.allocatedAmount,
				size: followerSize,
				status: 'open',
				isDemo: sub.isDemo ?? false,
				openedAt: new Date(),
			});
		} catch (error) {
			logger.error(`Failed to mirror trade ${masterTradeId} for follower ${sub.followerId}:`, error);
		}
	}

	logger.info(`Fan-out completed for trade ${masterTradeId} to ${subscribers.length} followers`);
};
