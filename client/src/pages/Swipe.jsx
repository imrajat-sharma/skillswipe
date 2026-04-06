import { Compass, Heart, RefreshCcw, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { SwipeDeck } from "../components/SwipeDeck";
import { useAuth } from "../context/AuthContext";

const mapProfileToCard = (profile) => ({
  id: profile._id,
  name: profile.name,
  headline: profile.bio || `${profile.roles?.join(", ") || "Member"} ready to connect`,
  image: profile.photo,
  location: profile.location,
  role: profile.roles?.join(", "),
  skills: profile.skills || [],
});

export default function Swipe() {
  const navigate = useNavigate();
  const { api, refreshUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [swipesLeft, setSwipesLeft] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [batchKey, setBatchKey] = useState(0);

  const cards = useMemo(() => profiles.map(mapProfileToCard), [profiles]);

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/swipe/next?limit=10&page=1");
      setProfiles(response.data.profiles || []);
      setSwipesLeft(response.data.swipesLeft ?? 0);
      setMessage(response.data.message || "");
      setError("");
      setBatchKey((current) => current + 1);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || "Unable to load profiles right now.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const handleAction = async (direction, card) => {
    if (!card?.id) {
      return;
    }

    const currentProfile = profiles.find((profile) => profile._id === card.id);
    setProfiles((current) => current.filter((profile) => profile._id !== card.id));

    try {
      const response = await api.post("/swipe/action", {
        targetId: card.id,
        direction,
      });
      setSwipesLeft(response.data.swipesLeft ?? 0);
      if (response.data.isMatch) {
        setMessage(`You matched with ${currentProfile?.name || "someone"}! Head to Matches to follow up.`);
      } else {
        setMessage(direction === "like" ? "Connection saved." : "Passed for now.");
      }
      setError("");
      await refreshUser();
    } catch (actionError) {
      if (currentProfile) {
        setProfiles((current) => [currentProfile, ...current]);
      }
      setError(actionError?.response?.data?.message || "Unable to record that swipe.");
    }
  };

  return (
    <section className="page-container pt-5 md:pt-7">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_296px]">
        <div className="grid gap-4">
          <div className="page-surface rounded-[1.6rem] p-4 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="section-label">Discover people</div>
                <h1 className="h2 mt-2 text-slate-900">Swipe with context, not guesswork</h1>
                <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-600">
                  Profiles are ranked using overlapping skills, roles, and location. Keep the discover queue intentional and use your limited daily swipes well.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={loadProfiles}>
                <RefreshCcw size={16} />
                Refresh queue
              </Button>
            </div>
          </div>

          {message ? <div className="status-message success">{message}</div> : null}
          {error ? <div className="status-message error">{error}</div> : null}

          <div className="page-surface rounded-[1.6rem] p-3.5 md:p-5">
            {loading ? (
              <div className="rounded-[1.2rem] bg-slate-50 p-8 text-center text-sm text-slate-500">Loading your discover queue...</div>
            ) : cards.length ? (
              <SwipeDeck
                key={batchKey}
                cards={cards}
                onPass={(card) => handleAction("pass", card)}
                onLike={(card) => handleAction("like", card)}
                onMessage={() => navigate("/matches")}
              />
            ) : (
              <EmptyState
                icon={Compass}
                title="No profiles available"
                description="You may have reached your limit or already reviewed everyone in the current queue."
                actionLabel="Reload discover queue"
                onAction={loadProfiles}
              />
            )}
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="page-surface rounded-[1.5rem] p-4 md:p-5">
            <div className="flex items-center justify-between">
              <span className="section-label">Daily rhythm</span>
              <Compass size={16} className="text-primary-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">{swipesLeft}</p>
            <p className="mt-1 text-xs text-slate-500">Swipes left today</p>
          </div>

          <div className="page-surface rounded-[1.5rem] p-4 md:p-5">
            <div className="section-label">How to use it</div>
            <ul className="mt-3 grid gap-2 text-xs leading-6 text-slate-600">
              <li className="flex gap-2.5"><Heart size={14} className="mt-1 shrink-0 text-primary-600" /> Swipe right when skills and intent line up.</li>
              <li className="flex gap-2.5"><X size={14} className="mt-1 shrink-0 text-secondary-600" /> Pass quickly when the fit is weak so the queue stays relevant.</li>
              <li className="flex gap-2.5"><Compass size={14} className="mt-1 shrink-0 text-accent-600" /> Use matches to continue the conversation after a mutual like.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
