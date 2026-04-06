import { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ChatListItem } from "../components/ChatListItem";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { formatDateTime } from "../utils/formatters";

export default function Chat() {
  const location = useLocation();
  const { api, user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [selectedChat, setSelectedChat] = useState("");
  const [activeMatch, setActiveMatch] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoadingList(true);
        const response = await api.get("/matches/chat?limit=20&page=1");
        const nextMatches = response.data.matches || [];
        const preferredMatchId = location.state?.matchId;

        setMatches(nextMatches);
        setSelectedChat((current) => current || preferredMatchId || nextMatches[0]?._id || "");
        setError("");
      } catch (loadError) {
        setError(loadError?.response?.data?.message || "Unable to load conversations.");
      } finally {
        setLoadingList(false);
      }
    };

    loadMatches();
  }, [api, location.state?.matchId]);

  useEffect(() => {
    if (!selectedChat) {
      setActiveMatch(null);
      return;
    }

    const loadThread = async () => {
      try {
        setLoadingThread(true);
        const response = await api.get(`/matches/${selectedChat}`);
        setActiveMatch(response.data.match || null);
        setError("");
      } catch (loadError) {
        setError(loadError?.response?.data?.message || "Unable to load this conversation.");
      } finally {
        setLoadingThread(false);
      }
    };

    loadThread();
  }, [api, selectedChat]);

  const handleSend = async () => {
    if (!selectedChat || !messageText.trim()) {
      return;
    }

    try {
      setSending(true);
      const response = await api.post(`/matches/${selectedChat}/messages`, {
        content: messageText.trim(),
      });
      const updatedMatch = response.data.match;

      setActiveMatch(updatedMatch);
      setMatches((current) =>
        current.map((match) => (match._id === updatedMatch._id ? updatedMatch : match)).sort((a, b) => {
          const aTime = new Date(a.updatedAt || a.matchedAt || 0).getTime();
          const bTime = new Date(b.updatedAt || b.matchedAt || 0).getTime();
          return bTime - aTime;
        }),
      );
      setMessageText("");
      setError("");
    } catch (sendError) {
      setError(sendError?.response?.data?.message || "Unable to send that message.");
    } finally {
      setSending(false);
    }
  };

  const chatItems = matches.map((match) => ({
    id: match._id,
    name: match.partner?.name || "Connection",
    avatar: match.partner?.photo || "",
    lastMessage: match.lastMessage?.content || "Start the conversation.",
    timestamp: formatDateTime(match.lastMessage?.sentAt || match.updatedAt || match.matchedAt),
    unreadCount: 0,
    status: "online",
  }));

  return (
    <div className="page-container">
      <div className="md:flex w-full">
        <div
          className={`glass-panel w-full rounded-[1.8rem] md:w-80 md:max-h-[calc(100vh-120px)] md:overflow-y-auto ${
            selectedChat ? "hidden md:block" : "block"
          }`}
        >
          <div className="p-4 md:p-6">
            <h1 className="mb-6 text-2xl font-bold text-[var(--text-strong)]">Messages</h1>
            {error ? <div className="status-message error mb-4">{error}</div> : null}
            <div className="space-y-2">
              {loadingList ? (
                <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 text-sm text-[var(--text-muted)]">
                  Loading conversations...
                </div>
              ) : chatItems.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No messages yet"
                  description="Match with someone in Discover to start a real conversation from the backend."
                />
              ) : (
                chatItems.map((chat) => (
                  <ChatListItem key={chat.id} chat={chat} onSelect={setSelectedChat} isActive={selectedChat === chat.id} />
                ))
              )}
            </div>
          </div>
        </div>

        {selectedChat ? (
          <div className="glass-panel mt-4 flex flex-1 flex-col rounded-[1.8rem] md:ml-4 md:mt-0">
            <div className="sticky top-0 border-b border-[var(--border-soft)] bg-[var(--surface)] p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[var(--text-strong)]">{activeMatch?.partner?.name || "Conversation"}</h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    {(activeMatch?.partner?.roles || []).join(", ") || "Professional connection"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedChat("")}
                  className="md:hidden text-[var(--text-muted)] hover:text-[var(--text-strong)]"
                  type="button"
                >
                  Back
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
              {loadingThread ? (
                <div className="text-sm text-[var(--text-muted)]">Loading thread...</div>
              ) : activeMatch?.messages?.length ? (
                activeMatch.messages.map((message, index) => {
                  const isOwnMessage = message.sender?._id === user?._id || message.sender === user?._id;

                  return (
                    <div key={`${message.sentAt || message.createdAt || index}-${index}`} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          isOwnMessage ? "bg-gradient-to-r from-rose-500 to-orange-400 text-white" : "bg-[var(--surface-subtle)] text-[var(--text-strong)]"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`mt-1 text-[11px] ${isOwnMessage ? "text-white/80" : "text-[var(--text-muted)]"}`}>
                          {formatDateTime(message.sentAt || message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  icon={MessageSquare}
                  title="No messages yet"
                  description="Start the conversation with a short intro, project context, or mentorship ask."
                />
              )}
            </div>

            <div className="sticky bottom-0 border-t border-[var(--border-soft)] bg-[var(--surface)] p-4 md:p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="input flex-1"
                />
                <Button variant="primary" size="md" onClick={handleSend} isLoading={sending}>
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="Select a conversation"
              description="Choose a match from the list to load the live thread from the backend."
            />
          </div>
        )}
      </div>
    </div>
  );
}
