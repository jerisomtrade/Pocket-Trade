import {
    followerTradeRepository,
    copySubscriptionRepository,
    walletRepository,
    traderRepository,
    traderStatsRepository
} from '@/repository';
import { knexDb } from '@/common/config';
import { logger } from '@/common/utils';
import { TradeDirection } from '@/common/interfaces';

export const handleCopyClose = async (data: { masterTradeId: string; exitPrice: number; closedAt: Date }) => {
	const { masterTradeId, exitPrice: masterExitPrice, closedAt } = data;

	logger.info(`Starting settlement fan-out for master trade ${masterTradeId}`);

	// 1. Find all open mirrored trades
	const followerTrades = await followerTradeRepository.findOpenTradesByMasterTrade(masterTradeId);

	if (!followerTrades || followerTrades.length === 0) {
		logger.info(`No follower positions to close for master trade ${masterTradeId}`);
		return;
	}

	// Fetch trader and their wallet once — all follower trades share the same trader
	const traderId = followerTrades[0].traderId;
	const trader = await traderRepository.findById(traderId);
	const commissionRate = trader?.commissionRate ?? 10;
	const [traderWallet] = trader ? await walletRepository.findByUserId(trader.userId) : [null];

	for (const ft of followerTrades) {
		try {
			// Simulate small slippage for followers (0 to 0.1%)
			const slippage = 1 - (Math.random() * 0.001);
			const followerExitPrice = masterExitPrice * slippage;

			// Calculate P&L
			const pnlFactor = ft.direction === TradeDirection.BUY ? 1 : -1;
			const profitLossPercent = ((followerExitPrice - ft.entryPrice) / ft.entryPrice) * pnlFactor;
			const grossProfitLoss = ft.size * profitLossPercent;

			// Apply commission only on profitable trades
			let commission = 0;
			let netProfitLoss = grossProfitLoss;
			if (grossProfitLoss > 0) {
				commission = grossProfitLoss * (commissionRate / 100);
				netProfitLoss = grossProfitLoss - commission;
			}

			// 1. Update follower trade record
			await followerTradeRepository.update(ft.id, {
				exitPrice: followerExitPrice,
				status: 'closed',
				profitLoss: netProfitLoss,
				commissionPaid: commission,
				closedAt,
			});

			// 2. Update subscription aggregate P&L
			const sub = await copySubscriptionRepository.findById(ft.subscriptionId);
			if (sub) {
				await copySubscriptionRepository.update(sub.id, {
					totalProfitLoss: Number(sub.totalProfitLoss) + netProfitLoss,
				});
			}

			// 3. Update follower wallet — portfolioBalance reflects current value while position is open
			const [followerWallet] = await walletRepository.findByUserId(ft.followerId, ft.isDemo ?? false);
			if (followerWallet) {
				await walletRepository.update(followerWallet.id, {
					portfolioBalance: Number(followerWallet.portfolioBalance) + netProfitLoss,
				});
			}

			// 4. Credit commission to trader's real wallet
			if (commission > 0 && traderWallet) {
				await walletRepository.update(traderWallet.id, {
					balance: Number(traderWallet.balance) + commission,
				});
			}

		} catch (error) {
			logger.error(`Failed to settle trade ${ft.id} for follower ${ft.followerId}:`, error);
		}
	}

	// 5. Recalculate and persist trader stats
	await updateTraderAggregatedStats(traderId);

	logger.info(`Settlement fan-out completed for master trade ${masterTradeId}`);
};

async function updateTraderAggregatedStats(traderId: string) {
	try {
		const closedTrades = await knexDb('trades')
			.where({ traderId, status: 'closed' })
			.select('profitLoss', 'profitLossPercent');

		const totalTrades = closedTrades.length;
		if (totalTrades === 0) return;

		const winningTrades = closedTrades.filter((t: any) => Number(t.profitLoss) > 0).length;
		const losingTrades = totalTrades - winningTrades;
		const winRate = (winningTrades / totalTrades) * 100;
		const totalProfitLoss = closedTrades.reduce((sum: number, t: any) => sum + Number(t.profitLoss ?? 0), 0);
		const avgTradePercent = closedTrades.reduce((sum: number, t: any) => sum + Number(t.profitLossPercent ?? 0), 0) / totalTrades;
		const totalProfitPercent = closedTrades.reduce((sum: number, t: any) => sum + Number(t.profitLossPercent ?? 0), 0);

		await traderStatsRepository.update(traderId, {
			totalTrades,
			winningTrades,
			losingTrades,
			totalProfitLoss,
			avgTradePercent,
		});

		// Keep denormalised columns on the traders table in sync for the leaderboard
		await knexDb('traders').where({ id: traderId }).update({
			winRate: parseFloat(winRate.toFixed(2)),
			totalProfitPercent: parseFloat(totalProfitPercent.toFixed(2)),
		});

		logger.info(`Updated stats for trader ${traderId}: winRate=${winRate.toFixed(1)}%, totalPnL=${totalProfitPercent.toFixed(2)}%`);
	} catch (e) {
		logger.error(`Error updating stats for trader ${traderId}:`, e);
	}
}
