import { Message, SocketEvents } from '@/interfaces';
import { io, Socket } from 'socket.io-client';

class SocketService {
	private socket: Socket | null = null;
	private static instance: SocketService;

	private constructor() {}

	public static getInstance(): SocketService {
		if (!SocketService.instance) {
			SocketService.instance = new SocketService();
		}
		return SocketService.instance;
	}

	public connect(): void {
		if (this.socket) {
			this.disconnect();
		}

		const socketUrl = (process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000').replace(/\/api\/v1\/?$/, '');
		this.socket = io(socketUrl, {
			withCredentials: true,
		});

		this.socket.on(SocketEvents.CONNECT, () => {
			console.log('Connected to socket server');
		});

		this.socket.on(SocketEvents.DISCONNECT, () => {
			console.log('Disconnected from socket server');
		});

		this.socket.on(SocketEvents.AUTH_ERROR, (error) => {
			console.error('Socket authentication error:', error);
		});
	}

	public disconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	public sendMessage(message: Partial<Message>): void {
		if (this.socket) {
			this.socket.emit(SocketEvents.SEND_MESSAGE, message);
			console.log('Message sent:', message);
		}
	}

	public onMessageReceived(callback: (message: Message) => void): void {
		if (this.socket) {
			this.socket.on(SocketEvents.MESSAGE_RECEIVED, callback);
		}
	}

	public onUserTyping(callback: (userId: number) => void): void {
		if (this.socket) {
			this.socket.on(SocketEvents.USER_TYPING, callback);
		}
	}

	public onUserStopTyping(callback: (userId: number) => void): void {
		if (this.socket) {
			this.socket.on(SocketEvents.USER_STOP_TYPING, callback);
		}
	}
}

export const socketService = SocketService.getInstance();
