import React from "react";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";

export const ChatListItem = ({ chat, onSelect, isActive }) => {
  const { id, name, avatar, lastMessage, timestamp, unreadCount, status } = chat;

  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
        isActive
          ? "border-rose-300 bg-rose-50/70 dark:border-rose-500/20 dark:bg-rose-500/10"
          : "border-[var(--border-soft)] hover:bg-[var(--surface-subtle)]"
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar name={name} image={avatar} size="md" status={status} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="truncate font-semibold text-[var(--text-strong)]">{name}</h3>
            {unreadCount > 0 ? (
              <Badge variant="primary" className="ml-2">
                {unreadCount}
              </Badge>
            ) : null}
          </div>
          <p className="truncate text-sm text-[var(--text-muted)]">{lastMessage}</p>
          <p className="mt-1 text-xs text-[var(--text-soft)]">{timestamp}</p>
        </div>
      </div>
    </button>
  );
};
