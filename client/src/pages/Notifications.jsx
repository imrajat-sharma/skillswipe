import { BellRing, Heart, MessageSquareText, RefreshCcw, Sparkles, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { formatRelativeTime } from "../utils/formatters";

export default function Notifications() {
  const { api, user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSignals = useCallback(async () => {
    try {
      setLoading(true);
      const [matchesResponse, postsResponse] = await Promise.all([
        api.get("/matches?limit=5&page=1"),
        api.get("/posts?limit=5&page=1"),
      ]);
      setMatches(matchesResponse.data.matches || []);
      setPosts(postsResponse.data.posts || []);
      setError("");
    } catch (loadError) {
      setError(loadError?.response?.data?.message || "Unable to load notifications right now.");
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
        icon: Sparkles,
        title: user?.isProfileComplete ? "Your profile is discoverable" : "Complete your profile",
        body: user?.isProfileComplete
          ? "Your profile is live in SwipeConnect, so new mutual connections can happen anytime."
          : "Add your photo, skills, roles, bio, and availability to unlock SwipeConnect.",
        status: user?.isProfileComplete ? "Live" : "Action needed",
      },
      {
        id: "swipes",
        icon: Heart,
        title: `${user?.swipesLeftToday ?? 0} swipes left today`,
        body: "Use your limited daily swipes on people whose skills and intent line up with what you want next.",
        status: "Daily rhythm",
      },
      latestMatch
        ? {
            id: "match",
            icon: MessageSquareText,
            title: `Recent match with ${latestMatch.partner?.name || "a builder"}`,
            body: latestMatch.lastMessage?.content || "You have a fresh match waiting for a first message.",
            status: formatRelativeTime(latestMatch.updatedAt || latestMatch.matchedAt),
          }
        : {
            id: "community",
            icon: Users,
            title: "Community posting is active",
            body: feedPost
              ? `${feedPost.author?.name || "Someone"} shared a new ${feedPost.type} post ${formatRelativeTime(feedPost.createdAt)}.`
              : "Share text updates, image drops, and polls from the home feed to build context before a match starts.",
            status: "Feed pulse",
          },
    ];
  }, [matches, posts, user]);

  return (
    <section className="page-container">
      <div className="glass-panel rounded-[2rem] p-6 md:p-8">
        <div className="section-label">Notifications</div>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="h2">Important account signals</h1>
            <p className="mt-3 max-w-2xl text-[var(--text-muted)]">
              This view synthesizes live backend state from your profile, feed, and matches so the app still feels active
              even without a dedicated notifications endpoint.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={loadSignals}>
            <RefreshCcw size={15} />
            Refresh
          </Button>
        </div>

        {error ? <div className="status-message error mt-6">{error}</div> : null}

        <div className="mt-8 grid gap-4">
          {loading ? <div className="rounded-[1.5rem] bg-[var(--surface-subtle)] p-6 text-sm text-[var(--text-muted)]">Loading notifications...</div> : null}
          {items.map((item) => (
            <article key={item.id} className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="rounded-2xl bg-[var(--surface-subtle)] p-3 text-rose-500">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-[var(--text-strong)]">{item.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{item.body}</p>
                  </div>
                </div>
                <Badge variant="primary">{item.status}</Badge>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-[linear-gradient(135deg,#0f172a,#172554)] p-5 text-white">
          <div className="flex items-center gap-2 text-white/80">
            <BellRing size={18} />
            <span className="text-sm font-semibold uppercase tracking-[0.16em]">Next step</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/75">
            When the backend adds a dedicated notification stream, this screen can move from synthesized signals to true
            event-based alerts without reworking the rest of the client.
          </p>
        </div>
      </div>
    </section>
  );
}
