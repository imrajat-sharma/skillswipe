import { Heart, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/Badge";
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

  useEffect(() => {
    const loadMatches = async () => {
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
    };

    loadMatches();
  }, [api]);

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
            onMessage={() => navigate("/chat")}
            variant="compact"
          />
        ))}
      </div>
    ) : (
      <div className="mt-6 page-surface rounded-[2rem]">
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
    <section className="page-container pt-5 md:pt-7">
      <div className="page-surface rounded-[1.6rem] p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="section-label">Connections</div>
            <h1 className="h2 mt-2 text-slate-900">Matches that deserve follow-through</h1>
            <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-600">
              Use this space to revisit the people you have mutual interest with and keep momentum after the discover queue.
            </p>
          </div>
          <Badge variant="primary">{matches.length} total</Badge>
        </div>

        {error ? <div className="status-message error mt-5">{error}</div> : null}
        {loading ? <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-8 text-center text-slate-500">Loading matches...</div> : <div className="mt-6"><Tabs tabs={tabsData} defaultTab={0} /></div>}
      </div>
    </section>
  );
}
