import { connectedWalletController } from '@/controllers/connectedWalletController';
import { protect, restrictTo } from '@/middlewares';
import { Role } from '@/common/constants';
import express from 'express';

const router = express.Router();

router.post('/create', protect, connectedWalletController.create);
// For admin only
router.get('/all', protect, restrictTo(Role.Admin), connectedWalletController.getAll);

export { router as connectedWalletRouter };
