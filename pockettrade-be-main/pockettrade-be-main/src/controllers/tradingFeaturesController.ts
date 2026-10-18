import { Request, Response } from 'express';

import { AppError } from '@/common/utils';
import { userBotRepository, liveTradeRepository, walletRepository } from '@/repository';
import { DateTime } from 'luxon';
import { catchAsync } from '@/middlewares';

import { knexDb } from '@/common/config';

class TradingFeaturesController {
  purchaseBot = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;
    const { botId, name, amount, roi, duration_days } = req.body;

    if (!user) throw new AppError('Please log in again', 400);
    if (!botId || !name || !amount || Number(amount) <= 0 || !roi || !duration_days) {
      throw new AppError('Missing or invalid required bot parameters', 400);
    }

    const isDemo = req.isDemoMode || false;
    const maturesAt = DateTime.now().plus({ days: Number(duration_days) }).toJSDate();

    let bot: any;
    await knexDb.transaction(async (trx) => {
      // Ensure wallet exists
      let wallet = await trx('wallets').where({ userId: user.id, isDemo }).first();
      if (!wallet) {
        [wallet] = await trx('wallets').insert({ userId: user.id, isDemo, balance: 0 }).returning('*');
      }

      // Atomic balance deduction
      const rowsUpdated = await trx('wallets')
        .where({ id: wallet.id })
        .where('balance', '>=', Number(amount))
        .decrement('balance', Number(amount));

      if (rowsUpdated === 0) {
        throw new AppError('Insufficient balance to purchase bot', 400);
      }

      // Create bot subscription
      const [newBot] = await trx('user_bots')
        .insert({
          userId: user.id,
          botId,
          name,
          amount: Number(amount),
          roi,
          duration_days: Number(duration_days),
          matures_at: maturesAt,
          status: 'active',
          isDemo,
        })
        .returning('*');

      bot = newBot;
    });

    res.status(201).json({
      status: 'success',
      message: 'Bot purchased successfully',
      data: bot
    });
  });

  executeLiveTrade = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;
    const { symbol, amount, orderType, duration } = req.body;

    if (!user) throw new AppError('Please log in again', 400);
    if (!symbol || !amount || Number(amount) <= 0 || !orderType || !duration) {
      throw new AppError('Missing or invalid required trade parameters', 400);
    }

    const isDemo = req.isDemoMode || false;

    // Calculate expiration (e.g., "1m", "5m")
    const durationMatch = duration.match(/(\d+)([mhd])/);
    let expiresAt = DateTime.now().plus({ minutes: 1 }).toJSDate();
    if (durationMatch) {
      const val = parseInt(durationMatch[1], 10);
      const unit = durationMatch[2];
      if (unit === 'm') expiresAt = DateTime.now().plus({ minutes: val }).toJSDate();
      else if (unit === 'h') expiresAt = DateTime.now().plus({ hours: val }).toJSDate();
      else if (unit === 'd') expiresAt = DateTime.now().plus({ days: val }).toJSDate();
    }

    // Lookup actual current price from asset_metrics
    const assetQuote = await knexDb('assets')
      .leftJoin('asset_metrics', 'assets.id', 'asset_metrics.asset_id')
      .where('assets.symbol', symbol)
      .select('asset_metrics.price')
      .first<{ price: string | number | null }>();

    const entryPrice = assetQuote?.price && Number(assetQuote.price) > 0 ? Number(assetQuote.price) : 100.0;

    let trade: any;
    await knexDb.transaction(async (trx) => {
      // Ensure wallet exists
      let wallet = await trx('wallets').where({ userId: user.id, isDemo }).first();
      if (!wallet) {
        [wallet] = await trx('wallets').insert({ userId: user.id, isDemo, balance: 0 }).returning('*');
      }

      // Atomic deduction
      const rowsUpdated = await trx('wallets')
        .where({ id: wallet.id })
        .where('balance', '>=', Number(amount))
        .decrement('balance', Number(amount));

      if (rowsUpdated === 0) {
        throw new AppError('Insufficient balance to execute trade', 400);
      }

      // Create live trade
      const [newTrade] = await trx('live_trades')
        .insert({
          userId: user.id,
          symbol,
          amount: Number(amount),
          orderType,
          duration,
          entryPrice,
          status: 'open',
          profit: 0,
          expires_at: expiresAt,
          isDemo,
        })
        .returning('*');

      trade = newTrade;
    });

    res.status(201).json({
      status: 'success',
      message: 'Trade executed successfully',
      data: trade
    });
  });

  getLiveTradeStats = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;
    if (!user) throw new AppError('Please log in again', 400);

    const trades = await liveTradeRepository.findByUserId(user.id, req.isDemoMode || false);

    // Calculate stats directly from trades for 100% consistency and performance
    const totalTrades = trades.length;
    const wonTrades = trades.filter((t: any) => t.status === 'won').length;
    const totalProfit = trades.reduce((acc: number, t: any) => acc + Number(t.profit || 0), 0);

    const stats = {
      totalTrades,
      wonTrades,
      totalProfit
    };

    // Also get active bots just to have them accessible if needed, but primarily live trades
    const bots = await userBotRepository.findByUserId(user.id, req.isDemoMode || false);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        trades,
        bots
      }
    });
  });

  getUserBots = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;
    if (!user) throw new AppError('Please log in again', 400);

    const bots = await userBotRepository.findByUserId(user.id, req.isDemoMode || false);

    res.status(200).json({
      status: 'success',
      data: bots
    });
  });
}

export const tradingFeaturesController = new TradingFeaturesController();
