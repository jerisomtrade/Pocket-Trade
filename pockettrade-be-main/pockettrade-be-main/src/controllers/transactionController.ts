import { Request, Response } from 'express';
import {
	AppError,
	AppResponse,
	referenceGenerator,
	sendFailedDepositEmail,
	sendFailedWithdrawalEmail,
	sendProcessingDepositEmail,
	sendProcessingWithdrawalEmail,
	sendSuccessfulDepositEmail,
	sendSuccessfulWithdrawalEmail,
	sendAdminNewDepositEmail,
	toJSON,
	uploadPaymentProofFile,
	paginate,
} from '@/common/utils';
import { TransactionStatus } from '@/common/constants';
import { catchAsync } from '@/middlewares';
import { transactionRepository, userRepository, walletRepository } from '@/repository';
import { knexDb } from '@/common/config';
import axios from 'axios';

interface FdicBankData {
	NAME: string;
	CERT: string;
	CITY: string;
	STNAME: string;
	ZIP: string;
	ADDRESS: string;
	FED_RSSD?: string;
}

interface FdicApiItem {
	data: FdicBankData;
}

export class TransactionController {
	findByUserId = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const transaction = await transactionRepository.findByUserId(user.id, req.isDemoMode || false);
		if (!transaction) throw new AppError('No transaction found', 404);

		return AppResponse(res, 200, toJSON(transaction), 'User Transacions retrieved successfully');
	});

	walletTopUp = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { amount, crypto, address } = req.body;
		const { file } = req;

		if (!user) throw new AppError('Please log in again', 400);
		if (!amount) throw new AppError('Amount is required', 400);
		if (!crypto) throw new AppError('Crypto is required', 400);
		if (!address) throw new AppError('Crypto Address is required', 400);

		let paymentProof: string | null = null;
		if (file?.buffer && file?.originalname && file?.mimetype) {
			const { secureUrl } = await uploadPaymentProofFile({
				fileName: `payment-proof/${Date.now()}-${file.originalname}`,
				buffer: file.buffer,
				mimetype: file.mimetype,
			});

			paymentProof = secureUrl;
		}

		let wallet = await walletRepository.findByUserId(user.id, req.isDemoMode || false);
		if (!wallet || wallet.length === 0) {
			wallet = await walletRepository.create({ userId: user.id, isDemo: req.isDemoMode || false });
		}

		const reference = referenceGenerator();
		const transaction = await transactionRepository.create({
			userId: user.id,
			amount,
			type: 'Deposit',
			description: 'Wallet Deposit',
			reference,
			crypto,
			address,
			paymentProof,
			isDemo: req.isDemoMode || false,
		});
		if (!transaction) throw new AppError('Failed to create wallet top up transaction', 500);

		await sendProcessingDepositEmail(user.email, user.firstName, amount, reference);

		// Notify all admins of the new deposit request
		const admins = await userRepository.findAllAdmins();
		for (const admin of admins) {
			if (admin.email) {
				await sendAdminNewDepositEmail(admin.email, `${user.firstName} ${user.lastName}`, amount, reference);
			}
		}

		return AppResponse(res, 200, toJSON(transaction), 'Transaction created successfully');
	});

	withdrawFunds = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { amount, crypto, address } = req.body;

		if (!user) throw new AppError('Please log in again', 400);
		if (!amount) throw new AppError('Amount is required', 400);
		if (!crypto) throw new AppError('Crypto is required', 400);
		if (!address) throw new AppError('Crypto Address is required', 400);

		const reference = referenceGenerator();
		let transactionRecord: any;

		await knexDb.transaction(async (trx) => {
			let wallet = await trx('wallets')
				.where({ userId: user.id, isDemo: req.isDemoMode || false })
				.first();

			if (!wallet) {
				[wallet] = await trx('wallets')
					.insert({ userId: user.id, isDemo: req.isDemoMode || false, balance: 0, portfolioBalance: 0 })
					.returning('*');
			}

			const currentBalance = Number(wallet.balance) || 0;
			const currentPortfolio = Number(wallet.portfolioBalance) || 0;
			const availableBalance = currentBalance + currentPortfolio;

			if (Number(amount) <= 0 || Number(amount) > availableBalance) {
				throw new AppError('Insufficient Funds', 400);
			}

			// Lock the funds immediately to prevent double-withdrawal race conditions.
			// Deduct from balance first, then portfolioBalance if needed.
			let remainingAmount = Number(amount);
			let newBalance = currentBalance;
			let newPortfolioBalance = currentPortfolio;

			if (remainingAmount <= newBalance) {
				newBalance -= remainingAmount;
				remainingAmount = 0;
			} else {
				remainingAmount -= newBalance;
				newBalance = 0;
			}
			if (remainingAmount > 0) {
				newPortfolioBalance -= remainingAmount;
			}

			await trx('wallets').where({ id: wallet.id }).update({
				balance: newBalance,
				portfolioBalance: newPortfolioBalance,
			});

			const [createdTx] = await trx('transactions')
				.insert({
					userId: user.id,
					amount,
					type: 'withdrawal',
					description: 'Withdrawal',
					reference,
					crypto,
					address,
					isDemo: req.isDemoMode || false,
				})
				.returning('*');

			transactionRecord = createdTx;
		});

		await sendProcessingWithdrawalEmail(user.email, user.firstName, amount, reference);
		return AppResponse(res, 200, toJSON(transactionRecord), 'Withdrawal requested successfully');
	});

	updateTransaction = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { transactionId, status } = req.body;

		if (!user) throw new AppError('Please log in again', 400);
		if (user.role !== 'admin') throw new AppError('Unauthorized', 400);
		if (!transactionId) throw new AppError('Transaction ID is required', 400);

		const transaction = await transactionRepository.findById(transactionId);
		if (!transaction) throw new AppError('No transaction found', 404);

		const update = await transactionRepository.update(transactionId, {
			status,
		});
		if (!update) throw new AppError('Failed to update transaction', 500);

		return AppResponse(res, 200, toJSON(update), 'Transaction updated successfully');
	});

	updateDeposit = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { transactionId, status, userId } = req.body;

		if (!user) throw new AppError('Please log in again', 400);
		if (user.role !== 'admin') throw new AppError('Unauthorized', 403);
		if (!transactionId) throw new AppError('Transaction ID is required', 400);
		if (!userId) throw new AppError('User ID is required', 400);

		// Validate UUID format
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(transactionId)) {
			throw new AppError('Invalid transaction ID format', 400);
		}
		if (!uuidRegex.test(userId)) {
			throw new AppError('Invalid user ID format', 400);
		}

		const transaction = await transactionRepository.findById(transactionId);
		if (!transaction) throw new AppError('No transaction found', 404);

		if (transaction.status === 'completed') {
			throw new AppError('This deposit has already been completed', 400);
		}

		const extinguishUser = await userRepository.findById(userId);
		if (!extinguishUser) throw new AppError('No User found', 404);

		let updatedTx: any;
		await knexDb.transaction(async (trx) => {
			let userWallet = await trx('wallets').where({ userId, isDemo: transaction.isDemo || false }).first();
			if (!userWallet) {
				[userWallet] = await trx('wallets')
					.insert({ userId, isDemo: transaction.isDemo || false, balance: 0, portfolioBalance: 0 })
					.returning('*');
			}

			const [tx] = await trx('transactions')
				.where({ id: transactionId })
				.update({ status, updated_at: new Date() })
				.returning('*');

			updatedTx = tx;

			if (status === 'completed') {
				const txAmount = Number(transaction.amount) || 0;
				await trx('wallets').where({ id: userWallet.id }).increment('balance', txAmount);
			}
		});

		if (status === 'completed') {
			await sendSuccessfulDepositEmail(
				extinguishUser.email,
				extinguishUser.firstName,
				transaction.amount,
				transaction.reference
			);
		}
		if (status === 'failed') {
			await sendFailedDepositEmail(
				extinguishUser.email,
				extinguishUser.firstName,
				transaction.amount,
				transaction.reference
			);
		}

		return AppResponse(res, 200, toJSON(updatedTx), 'Transaction updated successfully');
	});

	updateWithdrawal = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { transactionId, status, userId } = req.body;

		if (!user) throw new AppError('Please log in again', 400);
		if (user.role !== 'admin') throw new AppError('Unauthorized', 403);
		if (!transactionId) throw new AppError('Transaction ID is required', 400);
		if (!userId) throw new AppError('User ID is required', 400);

		// Validate UUID format
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(transactionId)) {
			throw new AppError('Invalid transaction ID format', 400);
		}
		if (!uuidRegex.test(userId)) {
			throw new AppError('Invalid user ID format', 400);
		}

		const transaction = await transactionRepository.findById(transactionId);
		if (!transaction) throw new AppError('No transaction found', 404);

		if (transaction.status === 'completed' || transaction.status === 'failed') {
			throw new AppError('This withdrawal has already been processed', 400);
		}

		const extinguishUser = await userRepository.findById(userId);
		if (!extinguishUser) throw new AppError('No User found', 404);

		let updatedTx: any;
		await knexDb.transaction(async (trx) => {
			let userWallet = await trx('wallets').where({ userId, isDemo: transaction.isDemo || false }).first();
			if (!userWallet) {
				[userWallet] = await trx('wallets')
					.insert({ userId, isDemo: transaction.isDemo || false, balance: 0, portfolioBalance: 0 })
					.returning('*');
			}

			const [tx] = await trx('transactions')
				.where({ id: transactionId })
				.update({ status, updated_at: new Date() })
				.returning('*');

			updatedTx = tx;

			const txAmount = Number(transaction.amount) || 0;
			if (status === 'failed') {
				// Refund the locked funds back to available balance.
				await trx('wallets').where({ id: userWallet.id }).increment('balance', txAmount);
			}
		});

		if (status === 'completed') {
			// Funds were already locked when withdrawal was requested
			await sendSuccessfulWithdrawalEmail(
				extinguishUser.email,
				extinguishUser.firstName,
				transaction.amount,
				transaction.reference
			);
		}

		if (status === 'failed') {
			await sendFailedWithdrawalEmail(
				extinguishUser.email,
				extinguishUser.firstName,
				transaction.amount,
				transaction.reference
			);
		}

		return AppResponse(res, 200, toJSON(updatedTx), 'Transaction updated successfully');
	});

	fetchDeposits = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { page, limit } = req.query;

		if (!user) throw new AppError('Please log in again', 400);
		if (user.role === 'user') throw new AppError('Unauthorized', 403);

		const query = transactionRepository.findDepositsQuery();
		const paginatedDeposits = await paginate(query, {
			page: Number(page),
			limit: Number(limit),
		});

		return AppResponse(res, 200, toJSON(paginatedDeposits), 'Deposits fetched successfully');
	});

	fetchWithdrawals = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { page, limit } = req.query;

		if (!user) throw new AppError('Please log in again', 400);
		if (user.role === 'user') throw new AppError('Unauthorized', 403);

		const query = transactionRepository.findWithdrawalsQuery();
		const paginatedWithdrawals = await paginate(query, {
			page: Number(page),
			limit: Number(limit),
		});

		return AppResponse(res, 200, toJSON(paginatedWithdrawals), 'Withdrawals fetched successfully');
	});

	fetchBanks = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { search } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		try {
			let url: string;

			if (!search || typeof search !== 'string' || search.trim().length === 0) {
				// Fetch popular/major banks when no query is provided
				url = `https://banks.data.fdic.gov/api/institutions?filters=ASSET:[1000000 TO *]&limit=50&format=json&sort_by=ASSET&sort_order=DESC`;
			} else {
				// Search for specific banks when query is provided
				const searchTerm = encodeURIComponent(search.trim());
				url = `https://banks.data.fdic.gov/api/institutions?filters=NAME:*${searchTerm}*&limit=20&format=json`;
			}

			const response = await axios.get(url, {
				headers: {
					Accept: 'application/json',
				},
			});

			if (!response.data?.data || !Array.isArray(response.data.data)) {
				return AppResponse(res, 200, [], 'No banks found');
			}

			const banks = (response.data.data as FdicApiItem[]).map((item) => ({
				name: item.data.NAME,
				cert: item.data.CERT,
				city: item.data.CITY,
				state: item.data.STNAME,
				zip: item.data.ZIP,
				address: item.data.ADDRESS,
				routingNumber: item.data.FED_RSSD || null,
			}));

			return AppResponse(res, 200, toJSON(banks), `Found ${banks.length} banks`);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 400) {
				throw new AppError('Invalid search query format', 400);
			}
			throw new AppError('Failed to fetch banks. Please try again.', 500);
		}
	});

	transferFunds = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { recipient, amount, description } = req.body;

		if (!user) throw new AppError('Please log in again', 400);
		if (!recipient) throw new AppError('Recipient email or ID is required', 400);
		if (!amount || Number(amount) <= 0) throw new AppError('Valid amount is required', 400);

		// 1. Find the recipient
		let recipientUser = await userRepository.findByEmail(recipient);
		if (!recipientUser) {
			recipientUser = await userRepository.findById(recipient);
		}

		if (!recipientUser) {
			throw new AppError('Recipient not found', 404);
		}

		if (recipientUser.id === user.id) {
			throw new AppError('You cannot transfer funds to yourself', 400);
		}

		// 2. Get sender's wallet and check balance
		let senderWalletList = await walletRepository.findByUserId(user.id, req.isDemoMode || false);
		let senderWallet = senderWalletList[0];
		if (!senderWallet) {
			senderWallet = (await walletRepository.create({ userId: user.id, isDemo: req.isDemoMode || false }))[0];
		}

		if (senderWallet.balance < Number(amount)) {
			throw new AppError('Insufficient balance', 400);
		}

		// 3. Get recipient's wallet
		let recipientWalletList = await walletRepository.findByUserId(recipientUser.id, req.isDemoMode || false);
		let recipientWallet = recipientWalletList[0];
		if (!recipientWallet) {
			recipientWallet = (await walletRepository.create({ userId: recipientUser.id, isDemo: req.isDemoMode || false }))[0];
		}

		// 4. Perform the transfer atomically
		const reference = referenceGenerator();
		const isDemo = req.isDemoMode || false;

		await knexDb.transaction(async (trx) => {
			const rowsUpdated = await trx('wallets')
				.where({ id: senderWallet.id })
				.where('balance', '>=', Number(amount))
				.decrement('balance', Number(amount));

			if (rowsUpdated === 0) {
				throw new AppError('Insufficient balance to complete transfer', 400);
			}

			await trx('wallets')
				.where({ id: recipientWallet.id })
				.increment('balance', Number(amount));
			await trx('transactions').insert({
				userId: user.id,
				amount: Number(amount),
				type: 'transfer',
				status: TransactionStatus.COMPLETED,
				description: description || `Transfer to ${recipientUser.firstName} ${recipientUser.lastName}`,
				reference,
				isDemo,
			});
			await trx('transactions').insert({
				userId: recipientUser.id,
				amount: Number(amount),
				type: 'transfer',
				status: TransactionStatus.COMPLETED,
				description: `Transfer from ${user.firstName} ${user.lastName}`,
				reference: reference + '-R',
				isDemo,
			});
		});

		return AppResponse(res, 200, null, 'Transfer successful');
	});
}

export const transactionController = new TransactionController();
