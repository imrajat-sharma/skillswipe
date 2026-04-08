import { motion as Motion } from "framer-motion";
import { Heart, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { Avatar } from "../components/Avatar";
import { useAuth } from "../context/AuthContext";
import { buildApiAssetUrl } from "../utils/formatters";

const fallbackProfiles = [
  {
    _id: "mock-swipe-1",
    name: "Emily Rodriguez",
    bio: "Passionate about creating intuitive digital experiences. 8+ years designing products that users love.",
    location: "San Francisco, CA",
    roles: ["UX Designer"],
    skills: ["UX Design", "Figma", "Design Systems", "User Research"],
    photo: "",
    connections: 340,
  },
];

const mapProfileToCard = (profile) => ({
  id: profile._id,
  name: profile.name,
  image: profile.photo || "",
  location: profile.location,
  role: profile.roles?.join(", ") || "Professional",
  skills: profile.skills || [],
  bio: profile.bio || "Open to thoughtful collaborations and meaningful product work.",
  connections: profile.connections || 0,
});

export default function Swipe() {
  const { api, setUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [swipesLeft, setSwipesLeft] = useState(0);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const cards = useMemo(() => (profiles.length ? profiles : fallbackProfiles).map(mapProfileToCard), [profiles]);
  const activeCard = cards[0];

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/swipe/next", { params: { limit: 10, page: 1 } });
      setProfiles(response.data.profiles || []);
      setSwipesLeft(response.data.swipesLeft ?? 0);
      setNotice(response.data.message || "");
      setError("");
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

    if (String(card.id).startsWith("mock-")) {
      setNotice(direction === "like" ? "Connection saved." : "Passed for now.");
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
      setUser((currentUser) =>
        currentUser
          ? {
              ...currentUser,
              swipesLeftToday: response.data.swipesLeft ?? currentUser.swipesLeftToday,
            }
          : currentUser,
      );
      setError("");

      if (response.data.isMatch) {
        setNotice(`You matched with ${currentProfile?.name || "someone new"}. Open Connections to follow up.`);
      } else {
        setNotice(direction === "like" ? "Connection saved." : "Passed for now.");
      }
    } catch (actionError) {
      if (currentProfile) {
        setProfiles((current) => [currentProfile, ...current]);
      }
      setError(actionError?.response?.data?.message || "Unable to record that swipe.");
    }
  };

  return (
    <Motion.section
      className="page-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
    >
      {notice ? <div className="status-message success">{notice}</div> : null}
      {error ? <div className="status-message error">{error}</div> : null}

      {loading ? (
        <div className="rounded-[2rem] bg-white px-5 py-10 text-center text-sm text-slate-500 shadow-[0_18px_42px_rgba(148,163,184,0.16)]">
          Loading your discover queue...
        </div>
      ) : activeCard ? (
        <div className="grid gap-6">
          <article className="overflow-hidden rounded-[2rem] bg-white shadow-[0_22px_60px_rgba(148,163,184,0.22)]">
            {activeCard.image ? (
              <img
                src={buildApiAssetUrl(activeCard.image, import.meta.env.VITE_API_URL || "http://localhost:5000/api")}
                alt={activeCard.name}
                className="h-[18rem] w-full object-cover"
              />
            ) : (
              <div className="flex h-[18rem] items-center justify-center bg-[linear-gradient(135deg,#ffe6d7,#fff4ef)]">
                <Avatar name={activeCard.name} image="" size="xl" />
              </div>
            )}

            <div className="px-5 py-4">
              <h1 className="text-[2rem] font-semibold leading-9 text-slate-700">{activeCard.name}</h1>
              <p className="mt-1 text-[1.05rem] font-medium text-slate-400">{activeCard.role}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {activeCard.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-[#f1e8ff] px-3 py-1.5 text-[0.86rem] font-medium text-[#9b76df]">
                    {skill}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-[1rem] leading-8 text-slate-500">{activeCard.bio}</p>

              <div className="mt-5 flex items-center gap-3 text-[0.95rem] text-slate-400">
                <MapPin size={16} />
                <span>{activeCard.location || "San Francisco, CA"}</span>
                <span>•</span>
                <span>{activeCard.connections || 340} connections</span>
                {swipesLeft ? (
                  <>
                    <span>•</span>
                    <span>{swipesLeft} left</span>
                  </>
                ) : null}
              </div>
            </div>
          </article>

          <div className="flex items-start justify-center gap-12 pb-2">
            <button
              type="button"
              onClick={() => handleAction("pass", activeCard)}
              className="grid justify-items-center gap-3 text-slate-400"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffe8e8] text-[#ff6b6b] shadow-[0_12px_28px_rgba(255,107,107,0.18)]">
                <X size={26} />
              </span>
              <span className="text-[0.95rem] font-medium">Pass</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction("like", activeCard)}
              className="grid justify-items-center gap-3 text-slate-400"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#def9ea] text-[#35c889] shadow-[0_12px_28px_rgba(53,200,137,0.2)]">
                <Heart size={24} />
              </span>
              <span className="text-[0.95rem] font-medium">Interested</span>
            </button>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No profiles available"
          description="You may have reached your limit or already reviewed everyone in the current queue."
          actionLabel="Reload discover queue"
          onAction={loadProfiles}
        />
      )}
    </Motion.section>
  );
}
