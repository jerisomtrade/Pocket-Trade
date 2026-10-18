import { useQuery } from '@tanstack/react-query';
import { callApi } from './helpers/callApi';
import { ChatMessage, Conversation, ApiResponse } from '@/interfaces';

// ========== GET CONVERSATIONS ==========
export const useGetConversations = () => {
	return useQuery<Conversation[], Error>({
		queryKey: ['chat', 'conversations'],
		queryFn: async () => {
			const { data, error } = await callApi<ApiResponse<Conversation[]>>('/message/all-last-messages');
			if (error) {
				throw new Error(error.message || 'Failed to fetch conversations');
			}
			return data?.data || [];
		},
	});
};

// ========== GET MESSAGES BY RECIPIENT ==========
export const useGetChatMessages = (recipientId: string) => {
	return useQuery<ChatMessage[], Error>({
		queryKey: ['chat', 'messages', recipientId],
		queryFn: async () => {
			const { data, error } = await callApi<ApiResponse<ChatMessage[]>>(`/message/admin-user?userId=${recipientId}`);
			if (error) {
				throw new Error(error.message || 'Failed to fetch messages');
			}
			return data?.data || [];
		},
	});
};

export const markMessageAsRead = async (messageId: number) => {
	const { data, error } = await callApi<ApiResponse<ChatMessage[]>>(`/message/mark-as-read?messageId=${messageId}`);

	if (error) {
		throw new Error(error.message || 'Failed to mark message as read');
	}

	return data?.data || [];
};
