"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/store/useSession";
import {
  Send,
  MessageCircle,
  Clock,
  CheckCircle,
  Paperclip,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { socketService } from "@/lib/socketService";
import { cn } from "@/lib/utils";
import { useGetChatMessages, markMessageAsRead } from "@/lib/chat.api";
import { ChatMessage } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./ui/badge";

export default function SupportChat() {
  const { user } = useSession((state) => state);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [showAutoReply, setShowAutoReply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = user && user[0]?.id;

  const {
    data: messages = [],
    isLoading,
    refetch: refetchMessages,
  } = useGetChatMessages(userId || "");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socketService.connect();

    socketService.onMessageReceived(() => {
      void refetchMessages();
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
  }, [refetchMessages, typingTimeout]);

  const formatDate = (date: string | Date | null) => {
    if (!date) return "";
    const messageDate = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffHours =
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return format(messageDate, "h:mm a");
    } else if (diffHours < 48) {
      return `Yesterday, ${format(messageDate, "h:mm a")}`;
    } else {
      return format(messageDate, "MMM d, h:mm a");
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !userId) return;

    try {
      socketService.sendMessage({
        senderId: userId,
        recipientId: "209bfd5b-124c-4bd1-8151-86ecbde89527",
        content: newMessage,
      });

      setNewMessage("");
      void refetchMessages();

      if (!showAutoReply) {
        const firstConversation = messages.filter(
          (msg) => msg.senderId === userId,
        );

        if (firstConversation.length < 1) {
          setTimeout(() => {
            setShowAutoReply(true);
            scrollToBottom();
          }, 1000);
        }
      }
    } catch (error) {
      toast.error("Transmission Error", {
        description: "Failed to send message. Please check your connection.",
      });
    }
  };

  useEffect(() => {
    if (!messages?.length) return;

    const unreadMessages = messages.filter((msg) => msg.senderId !== userId);

    if (unreadMessages.length) {
      (async () => {
        for (const message of unreadMessages) {
          try {
            await markMessageAsRead(message.id);
          } catch (error) {
            console.error("Failed to mark message as read", error);
          }
        }
      })();
    }
  }, [messages, userId]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const autoReplyMessage: ChatMessage = {
    id: 999999999,
    senderId: "0",
    recipientId: userId || null,
    content:
      "Thank you for reaching out. An institutional support officer will be assigned to your case shortly.",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const displayMessages = showAutoReply
    ? [...messages, autoReplyMessage]
    : messages;

  return (
    <div className="space-y-10 pb-20 mt-16 lg:mt-0 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-1 bg-emerald-500 rounded-full"></div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
              Support Center
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-none"
          >
            Live <span className="text-emerald-400">Assistance</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-xl font-medium text-lg leading-relaxed"
          >
            Direct access to our institutional support desk. Real-time
            resolution for account, security, and trading inquiries.
          </motion.p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card className="bg-slate-900/40 border-white/5 backdrop-blur-3xl rounded-[2.5rem] flex flex-col h-[70vh] shadow-2xl overflow-hidden">
            <CardHeader className="p-8 pb-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Headphones size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">
                      Jerisom{" "}
                      <span className="text-emerald-500">Concierge</span>
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-1">
                      Typically responds in under 15 minutes
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-transparent font-black text-[9px] uppercase tracking-widest">
                  Live Status: Active
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-grow overflow-hidden p-0 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50">
                  <div className="h-10 w-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                </div>
              ) : null}

              <ScrollArea className="h-full px-8 py-8">
                <div className="space-y-6">
                  {displayMessages.map((message) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={message.id}
                      className={cn(
                        "flex",
                        message.senderId === userId
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-[1.5rem] p-5 shadow-lg",
                          message.senderId === userId
                            ? "bg-emerald-500 text-slate-950 rounded-tr-none font-bold"
                            : "bg-white/5 border border-white/5 text-white rounded-tl-none font-medium",
                        )}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                        <div
                          className={cn(
                            "flex items-center gap-2 mt-3",
                            message.senderId === userId
                              ? "text-slate-950/60"
                              : "text-slate-500",
                          )}
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {formatDate(message.created_at)}
                          </span>
                          {message.senderId === userId && (
                            <CheckCircle
                              size={10}
                              className={cn(
                                message.recipientId !== userId
                                  ? "text-slate-950"
                                  : "text-slate-950/30",
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-full w-fit">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Agent is typing
                      </span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            <Separator className="bg-white/5" />

            <CardFooter className="p-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex w-full gap-4"
              >
                <div className="relative flex-grow group">
                  <Input
                    placeholder="Describe your inquiry..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="h-16 pl-6 pr-16 bg-slate-950 border-white/5 focus:border-emerald-500/50 text-white font-medium rounded-2xl transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 text-slate-500 hover:text-white transition-colors"
                    >
                      <Paperclip size={20} />
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="h-16 w-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.98] disabled:opacity-50 shrink-0"
                >
                  <Send className="h-6 w-6" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <Card className="bg-slate-900/40 border-white/5 backdrop-blur-3xl rounded-[2rem] p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-lg font-black text-white uppercase tracking-tighter">
                Support <span className="text-emerald-500">Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-6">
                {[
                  { day: "Mon - Fri", hours: "09:00 - 20:00 EST" },
                  { day: "Saturday", hours: "10:00 - 16:00 EST" },
                  { day: "Sunday", hours: "Limited Response" },
                ].map((schedule, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center group"
                  >
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                      {schedule.day}
                    </span>
                    <span className="text-xs font-bold text-white uppercase">
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] p-8">
            <div className="space-y-4">
              <ShieldCheck className="text-emerald-500 h-8 w-8" />
              <h3 className="text-sm font-black text-white uppercase tracking-tight">
                Security Protocol
              </h3>
              <p className="text-[10px] font-medium text-emerald-500/70 leading-relaxed uppercase tracking-widest">
                All communications are encrypted end-to-end. Our agents will
                NEVER ask for your password or seed phrase.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
