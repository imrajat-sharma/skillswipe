import { AnimatePresence, motion as Motion } from "framer-motion";
import { BellRing, Heart, MessageSquareText, RefreshCcw, Sparkles, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { ActivitySignalCard } from "../components/activity/ActivitySignalCard";
import { useAuth } from "../context/AuthContext";
import { formatRelativeTime } from "../utils/formatters";

export default function Notifications() {
  const navigate = useNavigate();
  const { api, user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSignals = useCallback(async () => {
    try {
      setLoading(true);
      const [matchesResponse, postsResponse] = await Promise.all([
        api.get("/matches/chat?limit=5&page=1"),
        api.get("/posts?limit=5&page=1"),
      ]);
      setMatches(matchesResponse.data.matches || []);
      setPosts(postsResponse.data.posts || []);
      setError("");
    } catch (loadError) {
      setError(loadError?.response?.data?.message || "Unable to load activity right now.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadSignals();
    const intervalId = window.setInterval(loadSignals, 30000);
    return () => window.clearInterval(intervalId);
  }, [loadSignals]);

  const items = useMemo(() => {
    const feedPost = posts.find((post) => post.author?._id !== user?._id);
    const latestMatch = matches[0];

    return [
      {
        id: "profile",
        title: user?.isProfileComplete ? "Your profile is discoverable" : "Complete your profile",
        body: user?.isProfileComplete
          ? "You are live in SwipeConnect and ready for mutual matches."
          : "Add your photo, skills, roles, bio, and availability to unlock SwipeConnect.",
        meta: user?.isProfileComplete ? "Profile live" : "Needs action",
        badge: user?.isProfileComplete ? "Ready" : "Setup",
      },
      {
        id: "swipes",
        title: `${user?.swipesLeftToday ?? 0} swipes left today`,
        body: "Use your daily swipes on people whose skills and intent match what you want next.",
        meta: "Daily rhythm",
        badge: "Swipe",
      },
      latestMatch
        ? {
            id: "match",
            title: `Recent match with ${latestMatch.partner?.name || "a builder"}`,
            body: latestMatch.lastMessage?.content || "You have a fresh match waiting for a first message.",
            meta: formatRelativeTime(latestMatch.updatedAt || latestMatch.matchedAt),
            badge: "Chat",
          }
        : {
            id: "community",
            title: "Community posting is active",
            body: feedPost
              ? `${feedPost.author?.name || "Someone"} shared a new ${feedPost.type} post ${formatRelativeTime(feedPost.createdAt)}.`
              : "Share text updates, image drops, and polls from the home feed to build context before a match starts.",
            meta: "Feed pulse",
            badge: "Live",
          },
    ];
  }, [matches, posts, user]);

  return (
    <Motion.section
      className="page-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26 }}
    >
      <div className="mx-auto grid max-w-5xl gap-4">
        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(250,204,21,0.2),rgba(251,191,36,0.14),rgba(255,255,255,0.92))] p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">Activity</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-strong)]">What needs your attention.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
                This surface stitches together profile state, match activity, and recent feed momentum until a dedicated
                notification stream exists in the backend.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={loadSignals}>
              <RefreshCcw size={15} />
              Refresh
            </Button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.25rem] bg-[var(--surface)] p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">Status</p>
              <p className="mt-2 text-2xl font-bold text-[var(--text-strong)]">
                {user?.isProfileComplete ? "Live" : "Setup"}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface)] p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">Matches</p>
              <p className="mt-2 text-2xl font-bold text-[var(--text-strong)]">{matches.length}</p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface)] p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">Swipes left</p>
              <p className="mt-2 text-2xl font-bold text-[var(--text-strong)]">{user?.swipesLeftToday ?? 0}</p>
            </div>
          </div>
        </div>

        {error ? <div className="status-message error">{error}</div> : null}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-3">
            {loading ? (
              <div className="rounded-[1.5rem] bg-[var(--surface)] p-6 text-sm text-[var(--text-muted)] shadow-soft">
                Loading activity...
              </div>
            ) : (
              <AnimatePresence>
                {items.map((item) => (
                  <Motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <ActivitySignalCard
                      title={item.title}
                      body={item.body}
                      meta={item.meta}
                      badge={item.badge}
                      onClick={() => {
                        if (item.id === "profile") {
                          navigate("/profile");
                        }
                        if (item.id === "swipes") {
                          navigate("/discover");
                        }
                        if (item.id === "match") {
                          navigate("/matches");
                        }
                      }}
                    />
                  </Motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <aside className="grid gap-4">
            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">
                <BellRing size={14} />
                Quick actions
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="primary">{user?.isProfileComplete ? "Ready to match" : "Finish profile"}</Badge>
                <Badge variant="neutral">SwipeConnect</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                Tap into Discover to keep your queue moving or jump into Matches to reply faster.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">
                <Users size={14} />
                Signals
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                Recent posts and mutual matches appear here so the app still feels alive even without a dedicated alerts
                endpoint.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">
                <Heart size={14} />
                Latest pulse
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                {items[2]?.body || "No activity yet. Your next swipe or message will show up here."}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">
                {items[2]?.meta || "Waiting"}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Motion.section>
  );
}
