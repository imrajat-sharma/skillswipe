import { Heart, MessageCircle, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { ProfileCard } from "../components/ProfileCard";
import { Tabs } from "../components/Tabs";
import { useAuth } from "../context/AuthContext";

const mapMatchToProfile = (match) => ({
  id: match._id,
  name: match.partner?.name,
  headline: match.partner?.bio || "Start the conversation from your shared goals.",
  image: match.partner?.photo,
  location: match.partner?.location,
  role: match.partner?.roles?.join(", "),
  skills: match.partner?.skills || [],
});

export default function Matches() {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/matches?limit=12&page=1");
      setMatches(response.data.matches || []);
      setError("");
    } catch (loadError) {
      setError(loadError?.response?.data?.message || "Unable to load matches.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadMatches();
    const intervalId = window.setInterval(loadMatches, 30000);
    return () => window.clearInterval(intervalId);
  }, [loadMatches]);

  const mutualMatches = useMemo(() => matches.filter((match) => match.messages?.length), [matches]);

  const renderCards = (items, empty) =>
    items.length ? (
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((match) => (
          <ProfileCard
            key={match._id}
            profile={mapMatchToProfile(match)}
            onLike={() => {}}
            onSkip={() => {}}
            onMessage={() => navigate("/chat", { state: { matchId: match._id } })}
            variant="compact"
          />
        ))}
      </div>
    ) : (
      <div className="mt-6 glass-panel rounded-[2rem]">
        <EmptyState {...empty} />
      </div>
    );

  const tabsData = [
    {
      label: "All",
      content: renderCards(matches, {
        icon: Heart,
        title: "No matches yet",
        description: "Swipe right on strong fits and come back here when you land a mutual connection.",
        actionLabel: "Go discover people",
        onAction: () => navigate("/discover"),
      }),
    },
    {
      label: "Mutual",
      icon: MessageCircle,
      content: renderCards(mutualMatches, {
        icon: MessageCircle,
        title: "No mutual messages yet",
        description: "Once you match with someone, you will see your strongest conversations here.",
      }),
    },
  ];

  return (
    <section className="page-container">
      <div className="glass-panel rounded-[2rem] p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="section-label">Connections</div>
            <h1 className="h2 mt-2">Matches that deserve follow-through</h1>
            <p className="mt-2.5 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
              Use this space to revisit the people you have mutual interest with and keep momentum after the discover queue.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">{matches.length} total</Badge>
            <Button type="button" variant="outline" onClick={loadMatches}>
              <RefreshCcw size={15} />
              Refresh
            </Button>
          </div>
        </div>

        {error ? <div className="status-message error mt-5">{error}</div> : null}
        {loading ? (
          <div className="mt-6 rounded-[1.5rem] bg-[var(--surface-subtle)] p-8 text-center text-[var(--text-muted)]">
            Loading matches...
          </div>
        ) : (
          <div className="mt-6">
            <Tabs tabs={tabsData} defaultTab={0} />
          </div>
        )}
      </div>
    </section>
  );
}
