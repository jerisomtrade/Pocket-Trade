'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { MessageSquare, Send, Search, CheckCircle, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { socketService } from '@/lib/socket/socketService';
import { cn } from '@/lib/utils';
import { useGetConversations, useGetChatMessages, markMessageAsRead } from '@/lib/chat.api';
import { useSession } from '@/store';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Megaphone, Mail, Bell, Globe } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { callApi } from '@/lib';

export default function AdminMessages() {
	const { user } = useSession((state) => state);
	const [selectedUserId, setSelectedUserId] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState('');
	const [newMessage, setNewMessage] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();

	const {
		data: conversations = [],
		isLoading: isLoadingConversations,
		refetch: refetchConversations,
	} = useGetConversations();
	const { data: messages = [], isLoading: isLoadingMessages } = useGetChatMessages(selectedUserId);

	// Scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	useEffect(() => {
		// Connect to socket service when component mounts
		socketService.connect();

		socketService.onMessageReceived(() => {
			refetchConversations();
			if (selectedUserId) {
				// Refetch messages for the current conversation
				refetchConversations();
			}
		});

		socketService.onUserTyping(() => {
			setIsTyping(true);
			if (typingTimeout) clearTimeout(typingTimeout);
			const timeout = setTimeout(() => setIsTyping(false), 3000);
			setTypingTimeout(timeout);
		});

		socketService.onUserStopTyping(() => {
			setIsTyping(false);
			if (typingTimeout) clearTimeout(typingTimeout);
		});

		return () => {
			socketService.disconnect();
			if (typingTimeout) clearTimeout(typingTimeout);
		};
	}, [refetchConversations, selectedUserId, typingTimeout]);

	const handleUserSelect = async (userId: string) => {
		setSelectedUserId(userId);
	};

	useEffect(() => {
		if (!selectedUserId || !messages?.length) return;

		const selectedConversation = messages.filter((msg) => msg.senderId === selectedUserId);

		if (selectedConversation.length) {
			(async () => {
				for (const message of selectedConversation) {
					try {
						await markMessageAsRead(message.id);
					} catch (error) {
						console.error('Failed to mark message as read', error);
					}
				}
			})();
		}
	}, [selectedUserId, messages]);

	const handleSendMessage = () => {
		if (!selectedUserId || !newMessage.trim() || !user) return;

		try {
			// Using socket to send message
			socketService.sendMessage({
				senderId: user[0].id,
				recipientId: selectedUserId,
				content: newMessage,
			});

			// Using API mutation as fallback
			// sendMessageMutation.mutate({
			//     senderId: user[0].id,
			// 	recipientId: selectedUserId,
			// 	content: newMessage,
			// });

			setNewMessage('');
			//toast.success('Message Sent', { description: 'Your message has been sent successfully.' });
			queryClient.invalidateQueries({ queryKey: ['chat', 'messages', selectedUserId] });
		} catch (error) {
			toast.error('Error', { description: String(error) || 'Failed to send message. Please try again.' });
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const formatTime = (date: string | Date | null) => {
		if (!date) return '';
		const messageDate = typeof date === 'string' ? new Date(date) : date;
		const now = new Date();
		const diffHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

		if (diffHours < 24) {
			return format(messageDate, 'h:mm a');
		} else if (diffHours < 48) {
			return `Yesterday, ${format(messageDate, 'h:mm a')}`;
		} else {
			return format(messageDate, 'MMM d, h:mm a');
		}
	};

	const filteredConversations = conversations.filter((conv) => {
		// Filter based on search query
		const fullName = `${conv.senderFirstName} ${conv.senderLastName}`.toLowerCase();
		if (searchQuery && !fullName.includes(searchQuery.toLowerCase())) {
			return false;
		}

		return true;
	});

	return (
		<>
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold">Communications Center</h1>
						<p className="text-muted-foreground mt-1">
							Manage individual support tickets and platform-wide broadcasts.
						</p>
					</div>
				</div>

				<Tabs defaultValue="inbox" className="w-full">
					<TabsList className="bg-slate-100 p-1 mb-6">
						<TabsTrigger value="inbox" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
							<MessageSquare className="h-4 w-4 mr-2" />
							Direct Messages
						</TabsTrigger>
						<TabsTrigger value="broadcast" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
							<Megaphone className="h-4 w-4 mr-2" />
							Broadcast Center
						</TabsTrigger>
					</TabsList>

					<TabsContent value="inbox" className="mt-0">
						<div className="grid md:grid-cols-4 gap-6 h-full min-h-[600px]">
							{/* User List Panel */}
							<Card className="md:col-span-1 flex flex-col h-full glass-card">
								<CardHeader className="pb-3">
									<CardTitle className="text-lg flex items-center gap-2">
										<MessageSquare className="h-5 w-5 text-invest" />
										Conversations
									</CardTitle>
									<div className="relative">
										<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
										<Input
											placeholder="Search users..."
											className="pl-9"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
										/>
									</div>
								</CardHeader>

								<CardContent className="flex-grow px-3 pb-3 pt-0">
									{isLoadingConversations ? (
										<div className="flex justify-center py-10 w-full min-w-[200px]">
											<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
										</div>
									) : filteredConversations.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">No conversations match your criteria</div>
									) : (
										<div className="space-y-1">
											{filteredConversations.map((conversation) => (
												<div
													key={conversation.id}
													className={cn(
														'flex items-start gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors',
														selectedUserId === conversation.id && 'bg-gray-100'
													)}
													onClick={() => handleUserSelect(conversation.id)}
												>
													<div className="relative">
														<Avatar>
															{conversation.senderProfileImage ? (
																<AvatarImage
																	src={conversation.senderProfileImage}
																	alt={`${conversation.senderFirstName} ${conversation.senderLastName}`}
																/>
															) : (
																<AvatarFallback>
																	{conversation.senderFirstName[0]}
																	{conversation.senderLastName[0]}
																</AvatarFallback>
															)}
														</Avatar>
														{/* Online indicator would be implemented with socket status */}
													</div>
													<div className="flex-grow min-w-0">
														<div className="flex items-center justify-between">
															<div className="font-medium truncate">
																{conversation.senderFirstName} {conversation.senderLastName}
															</div>
															<div className="text-xs text-gray-500 ml-2 whitespace-nowrap">
																{formatTime(conversation.created_at)}
															</div>
														</div>
														<div className="flex items-center justify-between mt-1">
															<div className="text-sm text-gray-600 truncate max-w-[150px]">
																{conversation.lastMessage || conversation.content || 'No messages yet'}
															</div>
															{conversation.unreadCount && conversation.unreadCount > 0 ? (
																<div className="ml-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium">
																	{conversation.unreadCount}
																</div>
															) : null}
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>

							{/* Message Thread Panel */}
							<Card className="md:col-span-3 flex flex-col glass-card relative">
								{selectedUserId ? (
									<>
										{/* Message header */}
										<CardHeader className="pb-3 border-b">
											<div className="flex items-center gap-3">
												<Avatar>
													{conversations.find((c) => c.id === selectedUserId)?.senderProfileImage ? (
														<AvatarImage
															src={conversations.find((c) => c.id === selectedUserId)?.senderProfileImage || ''}
															alt="User avatar"
														/>
													) : (
														<AvatarFallback>
															{conversations.find((c) => c.id === selectedUserId)?.senderFirstName[0] || 'U'}
															{conversations.find((c) => c.id === selectedUserId)?.senderLastName[0] || 'S'}
														</AvatarFallback>
													)}
												</Avatar>
												<div>
													<CardTitle className="text-lg">
														{conversations.find((c) => c.id === selectedUserId)?.senderFirstName || ''}{' '}
														{conversations.find((c) => c.id === selectedUserId)?.senderLastName || ''}
													</CardTitle>
													<CardDescription>
														Phone: {conversations.find((c) => c.id === selectedUserId)?.phone || ''}
													</CardDescription>
												</div>
											</div>
										</CardHeader>

										{/* Messages area */}
										<ScrollArea className="flex-grow p-4" type="scroll">
											{isLoadingMessages ? (
												<div className="flex justify-center py-10">
													<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
												</div>
											) : (
												<div className="space-y-2">
													{messages?.map((message) => (
														<div
															key={message.id}
															className={cn(
																'flex',
																message.senderId === user?.[0]?.id ? 'justify-end' : 'justify-start'
															)}
														>
															<div
																className={cn(
																	'max-w-[80%] rounded-lg p-3',
																	message.senderId === user?.[0]?.id
																		? 'bg-[#1d4ed8] text-white rounded-tr-none'
																		: 'bg-gray-100 rounded-tl-none'
																)}
															>
																<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
																	<p className="text-sm">{message.content}</p>
																	<div className="flex items-center gap-1 mt-1 md:mt-0 md:ml-4">
																		<span className="text-xs opacity-70 whitespace-nowrap">
																			{formatTime(message.created_at)}
																		</span>
																		{message.senderId === user?.[0]?.id && (
																			<CheckCircle className="h-3 w-3 opacity-70 flex-shrink-0" />
																		)}
																	</div>
																</div>
															</div>
														</div>
													))}
													{isTyping && (
														<div className="flex items-center gap-2 text-sm text-muted-foreground">
															<div className="flex gap-1">
																<div
																	className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
																	style={{ animationDelay: '0ms' }}
																/>
																<div
																	className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
																	style={{ animationDelay: '150ms' }}
																/>
																<div
																	className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
																	style={{ animationDelay: '300ms' }}
																/>
															</div>
															<span>Typing...</span>
														</div>
													)}
													<div ref={messagesEndRef} />
												</div>
											)}
										</ScrollArea>

										{/* Message input */}
										<CardFooter className="p-4 border-t">
											<form
												onSubmit={(e) => {
													e.preventDefault();
													handleSendMessage();
												}}
												className="flex w-full gap-2"
											>
												<Button type="button" variant="ghost" size="icon">
													<Paperclip className="h-4 w-4" />
												</Button>
												<Input
													placeholder="Type your message..."
													value={newMessage}
													onChange={(e) => setNewMessage(e.target.value)}
													onKeyDown={handleKeyPress}
													className="flex-grow"
												/>
												<Button
													type="submit"
													className="bg-[#1d4ed8] text-white hover:cursor-pointer"
													disabled={!newMessage.trim()}
												>
													<Send className="h-4 w-4" />
													<span className="sr-only">Send message</span>
												</Button>
											</form>
										</CardFooter>
									</>
								) : (
									<div className="flex flex-col items-center justify-center h-full text-center p-6">
										<MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
										<h3 className="text-xl font-medium mb-2">No Conversation Selected</h3>
										<p className="text-muted-foreground max-w-md">
											Select a user from the list to view your conversation history and send messages.
										</p>
									</div>
								)}
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="broadcast" className="mt-0">
						<div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
							<Card className="lg:col-span-2 border-none shadow-sm bg-white">
								<CardHeader>
									<CardTitle className="text-lg flex items-center gap-2">
										<Megaphone className="h-5 w-5 text-invest" />
										Compose Broadcast
									</CardTitle>
									<CardDescription>Send a priority announcement to all registered platform users.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<label className="text-sm font-bold text-slate-700">Message Title</label>
										<Input
											placeholder="e.g. Scheduled Maintenance or Market Update"
											className="font-medium"
											id="broadcast-title"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-bold text-slate-700">Announcement Content</label>
										<Textarea
											placeholder="Write your platform announcement here..."
											className="min-h-[200px] leading-relaxed"
											id="broadcast-content"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="flex items-center gap-3 p-3 border rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer group">
											<div className="bg-blue-100 p-2 rounded text-blue-600">
												<Mail className="h-4 w-4" />
											</div>
											<div>
												<p className="text-xs font-bold text-slate-800">Email Dispatch</p>
												<p className="text-[10px] text-slate-500">Send to user inboxes</p>
											</div>
										</div>
										<div className="flex items-center gap-3 p-3 border rounded-lg hover:border-invest-200 hover:bg-invest-50/30 transition-colors cursor-pointer group border-invest">
											<div className="bg-invest-100 p-2 rounded text-invest">
												<Bell className="h-4 w-4" />
											</div>
											<div>
												<p className="text-xs font-bold text-slate-800">In-App Notification</p>
												<p className="text-[10px] text-slate-500">Push to dashboard bell</p>
											</div>
										</div>
									</div>
								</CardContent>
								<CardFooter className="border-t bg-slate-50/50 pt-6">
									<Button
										className="w-full bg-invest hover:bg-invest/90 text-white font-bold h-12 text-lg active:scale-95 transition-all shadow-lg shadow-invest/20"
										onClick={async () => {
											const title = (document.getElementById('broadcast-title') as HTMLInputElement).value;
											const content = (document.getElementById('broadcast-content') as HTMLTextAreaElement).value;

											if (!title || !content) {
												toast.error('Missing Information', {
													description: 'Please provide both a title and content for the broadcast.',
												});
												return;
											}

											const { error } = await callApi('/admin/broadcast', { title, content });
											if (error) {
												toast.error('Broadcast Failed', { description: error.message });
											} else {
												toast.success('Broadcast Sent', {
													description: 'The announcement has been dispatched to all users successfully.',
												});
												(document.getElementById('broadcast-title') as HTMLInputElement).value = '';
												(document.getElementById('broadcast-content') as HTMLTextAreaElement).value = '';
											}
										}}
									>
										<Send className="h-5 w-5 mr-2" />
										Dispatch Platform Broadcast
									</Button>
								</CardFooter>
							</Card>

							<Card className="border-none shadow-sm bg-white">
								<CardHeader>
									<CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
										Targeting Summary
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
										<div className="flex items-center gap-2">
											<Globe className="h-4 w-4 text-blue-500" />
											<span className="text-sm font-medium">Platform Reach</span>
										</div>
										<span className="text-sm font-bold">100% (Global)</span>
									</div>
									<div className="space-y-2">
										<div className="flex justify-between text-xs mb-1">
											<span className="text-slate-500 font-medium">Estimated Recipient Count</span>
											<span className="font-bold">148 Users</span>
										</div>
										<div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
											<div className="h-full bg-invest w-[85%] rounded-full" />
										</div>
										<p className="text-[10px] text-slate-400">85% active within the last 24 hours</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
}
