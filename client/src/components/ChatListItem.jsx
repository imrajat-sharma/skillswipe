import React from "react";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";

export const ChatListItem = ({ chat, onSelect, isActive }) => {
  const { id, name, avatar, lastMessage, timestamp, unreadCount, status } =
    chat;

  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full text-left rounded-xl p-4 transition-all duration-200 border ${
        isActive
          ? "bg-primary-50 border-primary-200"
          : "hover:bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar name={name} image={avatar} size="md" status={status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
            {unreadCount > 0 && (
              <Badge variant="primary" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
          <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
        </div>
      </div>
    </button>
  );
};
