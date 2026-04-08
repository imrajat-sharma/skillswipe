import { motion as Motion } from "framer-motion";
import { ChevronRight, MessageSquareText } from "lucide-react";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { formatRelativeTime } from "../../utils/formatters";

export function ConversationPreview({ match, onOpen }) {
  return (
    <Motion.button
      type="button"
      whileTap={{ scale: 0.99 }}
      onClick={onOpen}
      className="w-full rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--surface)] p-4 text-left shadow-soft"
    >
      <div className="flex items-center gap-3">
        <Avatar name={match.partner?.name} image={match.partner?.photo} size="md" status="online" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="truncate text-sm font-bold text-[var(--text-strong)]">{match.partner?.name || "Conversation"}</h3>
            <Badge variant="neutral">{formatRelativeTime(match.updatedAt || match.matchedAt)}</Badge>
          </div>
          <p className="mt-1 truncate text-sm text-[var(--text-muted)]">
            {match.lastMessage?.content || "Send the first message and keep the match moving."}
          </p>
        </div>
        <ChevronRight size={16} className="text-[var(--text-soft)]" />
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-soft)]">
        <MessageSquareText size={13} />
        <span>{match.messageCount || 0} messages</span>
        <span>•</span>
        <span>{(match.partner?.roles || []).join(", ") || "Professional connection"}</span>
      </div>
    </Motion.button>
  );
}
