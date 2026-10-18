import { Socket } from 'socket.io';
import { AppError, authenticate, getCookieName, logger } from '@/common/utils';
import cookie from 'cookie';

export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
	try {
		logger.info('Auth middleware running for socket connection attempt');

		// Parse cookies from the socket handshake headers
		const cookies = socket.handshake.headers.cookie ? cookie.parse(socket.handshake.headers.cookie) : {};
		const origin = (socket.handshake.headers.origin as string) || (socket.handshake.headers.referer as string) || '';

		const accessTokenName = getCookieName(origin, 'accessToken');
		const refreshTokenName = getCookieName(origin, 'refreshToken');

		const accessToken = cookies[accessTokenName];
		const refreshToken = cookies[refreshTokenName];

		if (!accessToken && !refreshToken) {
			return next(new AppError('Authentication required'));
		}

		// Authenticate the user
		const { currentUser } = await authenticate({
			accessToken,
			refreshToken,
		});

		const user = currentUser;
		socket.data.user = {
			...user,
		};

		logger.info('Socket authentication successful');
		return next();
	} catch (error) {
		logger.error('Socket authentication failed', error);
		return next(new AppError('Authentication failed'));
	}
};
