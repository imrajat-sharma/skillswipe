import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowLeft, MessageSquareText, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { formatDateTime } from "../utils/formatters";

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
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
        current
          .map((match) => (match._id === updatedMatch._id ? updatedMatch : match))
          .sort((a, b) => {
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

  const chatItems = useMemo(
    () =>
      matches.map((match) => ({
        id: match._id,
        name: match.partner?.name || "Connection",
        avatar: match.partner?.photo || "",
        lastMessage: match.lastMessage?.content || "Start the conversation.",
        timestamp: formatDateTime(match.lastMessage?.sentAt || match.updatedAt || match.matchedAt),
        roles: match.partner?.roles || [],
      })),
    [matches],
  );

  return (
    <Motion.section
      className="page-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26 }}
    >
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className={`rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] shadow-soft ${selectedChat ? "hidden lg:block" : "block"}`}>
          <div className="border-b border-[var(--border-soft)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">Inbox</p>
                <h1 className="mt-1 text-xl font-bold text-[var(--text-strong)]">Messages</h1>
              </div>
              <MessageSquareText size={18} className="text-[var(--text-soft)]" />
            </div>
          </div>

          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-3">
            {error ? <div className="status-message error mb-3">{error}</div> : null}
            {loadingList ? (
              <div className="rounded-[1.25rem] bg-[var(--surface-subtle)] p-5 text-sm text-[var(--text-muted)]">
                Loading conversations...
              </div>
            ) : chatItems.length ? (
              <div className="grid gap-2">
                {chatItems.map((chat) => {
                  const isActive = selectedChat === chat.id;

                  return (
                    <Motion.button
                      key={chat.id}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={() => setSelectedChat(chat.id)}
                      className={`w-full rounded-[1.35rem] border p-4 text-left transition ${
                        isActive
                          ? "border-[var(--text-strong)] bg-[var(--surface-subtle)] shadow-soft"
                          : "border-[var(--border-soft)] bg-[var(--surface)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={chat.name} image={chat.avatar} size="md" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-semibold text-[var(--text-strong)]">{chat.name}</p>
                            <span className="text-[11px] text-[var(--text-soft)]">{chat.timestamp}</span>
                          </div>
                          <p className="mt-1 truncate text-sm text-[var(--text-muted)]">{chat.lastMessage}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {chat.roles.slice(0, 2).map((role) => (
                          <Badge key={role} variant="neutral">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </Motion.button>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={MessageSquareText}
                title="No messages yet"
                description="Match with someone in Discover to start a real conversation from the backend."
              />
            )}
          </div>
        </aside>

        {selectedChat ? (
          <Motion.div
            key={selectedChat}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex min-h-[72vh] flex-col overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] shadow-soft"
          >
            <div className="sticky top-0 z-10 border-b border-[var(--border-soft)] bg-[var(--surface)] p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/matches")}
                    className="rounded-full bg-[var(--surface-subtle)] p-2 text-[var(--text-muted)] lg:hidden"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <Avatar
                    name={activeMatch?.partner?.name}
                    image={activeMatch?.partner?.photo}
                    size="md"
                    status="online"
                  />
                  <div>
                    <h2 className="text-sm font-bold text-[var(--text-strong)]">
                      {activeMatch?.partner?.name || "Conversation"}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">
                      {(activeMatch?.partner?.roles || []).join(", ") || "Professional connection"}
                    </p>
                  </div>
                </div>
                <Badge variant="primary">{activeMatch?.messageCount || 0} messages</Badge>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {loadingThread ? (
                <div className="rounded-[1.25rem] bg-[var(--surface-subtle)] p-5 text-sm text-[var(--text-muted)]">
                  Loading thread...
                </div>
              ) : activeMatch?.messages?.length ? (
                <AnimatePresence initial={false}>
                  {activeMatch.messages.map((message, index) => {
                    const isOwnMessage = message.sender?._id === user?._id || message.sender === user?._id;

                    return (
                      <Motion.div
                        key={`${message.sentAt || message.createdAt || index}-${index}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[82%] rounded-[1.4rem] px-4 py-3 shadow-soft ${
                            isOwnMessage
                              ? "bg-gradient-to-r from-primary-600 to-secondary-500 text-white"
                              : "bg-[var(--surface-subtle)] text-[var(--text-strong)]"
                          }`}
                        >
                          <p className="text-sm leading-6">{message.content}</p>
                          <p className={`mt-2 text-[11px] ${isOwnMessage ? "text-white/80" : "text-[var(--text-soft)]"}`}>
                            {formatDateTime(message.sentAt || message.createdAt)}
                          </p>
                        </div>
                      </Motion.div>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <EmptyState
                  icon={MessageSquareText}
                  title="No messages yet"
                  description="Start with a short intro, shared context, or a direct ask to keep the match moving."
                />
              )}
            </div>

            <div className="border-t border-[var(--border-soft)] bg-[var(--surface)] p-4">
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
          </Motion.div>
        ) : (
          <div className="flex min-h-[72vh] items-center justify-center rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] shadow-soft">
            <EmptyState
              icon={MessageSquareText}
              title="Select a conversation"
              description="Choose a match from the list to load the live thread from the backend."
            />
          </div>
        )}
      </div>
    </Motion.section>
  );
}
