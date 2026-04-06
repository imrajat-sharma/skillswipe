import React, { useState } from "react";
import { ChatListItem } from "../components/ChatListItem";
import { Button } from "../components/Button";
import { MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";
import { EmptyState } from "../components/EmptyState";

const dummyChats = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    lastMessage: "That sounds great! Let's connect soon",
    timestamp: "2m ago",
    unreadCount: 2,
    status: "online",
  },
  {
    id: 2,
    name: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    lastMessage: "I'd love to collaborate on that project",
    timestamp: "1h ago",
    unreadCount: 0,
    status: "online",
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    lastMessage: "Thanks for the opportunity!",
    timestamp: "3h ago",
    unreadCount: 0,
    status: "offline",
  },
];

export default function Chat() {
  const MotionDiv = motion.div;
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState("");

  return (
    <div className="min-h-screen bg-white md:flex">
      <div className="md:flex w-full">
        {/* Chat List - Sidebar */}
        <MotionDiv
          className={`w-full md:w-80 md:border-r md:border-gray-200 md:max-h-[calc(100vh-60px)] md:overflow-y-auto ${
            selectedChat ? "hidden md:block" : "block"
          }`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

            <div className="space-y-2">
              {dummyChats.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No messages yet"
                  description="Start a conversation with someone on your matches"
                />
              ) : (
                dummyChats.map((chat, idx) => (
                  <MotionDiv
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ChatListItem
                      chat={chat}
                      onSelect={setSelectedChat}
                      isActive={selectedChat === chat.id}
                    />
                  </MotionDiv>
                ))
              )}
            </div>
          </div>
        </MotionDiv>

        {/* Chat Window */}
        {selectedChat ? (
          <MotionDiv
            className="flex-1 flex flex-col bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4 md:p-6 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">
                    {dummyChats.find((c) => c.id === selectedChat)?.name}
                  </h2>
                  <p className="text-sm text-gray-600">Online</p>
                </div>
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden text-gray-600 hover:text-gray-900"
                >
                  ← Back
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      idx % 2 === 0
                        ? "bg-gray-100 text-gray-900"
                        : "bg-primary-600 text-white"
                    }`}
                  >
                    <p className="text-sm">
                      {idx % 2 === 0
                        ? "Hey! How are you doing?"
                        : "Great! Looking forward to connecting"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 md:p-6 sticky bottom-0 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="input flex-1"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setMessageText("");
                  }}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </MotionDiv>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="Select a conversation"
              description="Choose a chat from the list to start messaging"
            />
          </div>
        )}
      </div>
    </div>
  );
}
