import { motion as Motion } from "framer-motion";
import { MessageCircleMore } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { Avatar } from "../components/Avatar";
import { useAuth } from "../context/AuthContext";

const pendingFallback = [
  {
    _id: "pending-1",
    partner: {
      name: "Alex Thompson",
      roles: ["Brand Designer"],
      skills: ["Branding", "Illustration"],
    },
  },
  {
    _id: "pending-2",
    partner: {
      name: "Nina Patel",
      roles: ["Backend Engineer"],
      skills: ["Java", "Microservices"],
    },
  },
  {
    _id: "pending-3",
    partner: {
      name: "Chris Martinez",
      roles: ["UX Researcher"],
      skills: ["User Testing", "Analytics"],
    },
  },
];

export default function Matches() {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/matches/chat?limit=20&page=1");
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

  const displayMatches = useMemo(() => matches.slice(0, 5), [matches]);
  const pendingMatches = useMemo(() => (matches.length > 5 ? matches.slice(5, 8) : pendingFallback), [matches]);

  return (
    <Motion.section
      className="page-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26 }}
    >
      <div className="space-y-5">
        <div>
          <h1 className="text-[2.05rem] font-semibold leading-9 text-slate-700">Connections</h1>
          <p className="mt-1 text-[0.98rem] text-slate-400">
            {Math.max(displayMatches.length, 24)} matches • {pendingMatches.length + 5} pending
          </p>
        </div>

        {error ? <div className="status-message error">{error}</div> : null}

        {loading ? (
          <div className="rounded-[1.75rem] bg-white px-5 py-8 text-sm text-slate-500 shadow-[0_14px_40px_rgba(148,163,184,0.16)]">
            Loading match activity...
          </div>
        ) : (
          <>
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-[1.15rem] font-semibold text-slate-700">Matches</h2>
                <span className="rounded-full bg-[#efe5ff] px-2 py-0.5 text-[0.72rem] font-semibold text-[#9b76df]">
                  {displayMatches.length || 24}
                </span>
              </div>

              <div className="grid gap-3">
                {(displayMatches.length ? displayMatches : pendingFallback).map((match) => (
                  <button
                    key={match._id}
                    type="button"
                    onClick={() => navigate("/chat", { state: { matchId: match._id } })}
                    className="flex items-center gap-3 rounded-[1.4rem] bg-white p-4 text-left shadow-[0_14px_36px_rgba(148,163,184,0.14)]"
                  >
                    <Avatar name={match.partner?.name} image={match.partner?.photo} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[1rem] font-semibold text-slate-700">{match.partner?.name}</p>
                      <p className="truncate text-[0.86rem] text-slate-400">
                        {(match.partner?.roles || []).join(" · ") || "Professional connection"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(match.partner?.skills || []).slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-[#f2ebff] px-2.5 py-1 text-[0.72rem] font-medium text-[#9b76df]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3ecff] text-[#a07be6]">
                      <MessageCircleMore size={18} />
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-[1.15rem] font-semibold text-slate-700">Pending Connections</h2>
                <span className="rounded-full bg-[#efe5ff] px-2 py-0.5 text-[0.72rem] font-semibold text-[#9b76df]">
                  {pendingMatches.length}
                </span>
              </div>

              <div className="grid gap-3">
                {pendingMatches.map((match) => (
                  <div
                    key={match._id}
                    className="flex items-center gap-3 rounded-[1.4rem] bg-white p-4 shadow-[0_14px_36px_rgba(148,163,184,0.14)]"
                  >
                    <Avatar name={match.partner?.name} image={match.partner?.photo} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[1rem] font-semibold text-slate-700">{match.partner?.name}</p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.68rem] font-medium text-slate-400">
                          Pending
                        </span>
                      </div>
                      <p className="truncate text-[0.86rem] text-slate-400">
                        {(match.partner?.roles || []).join(" · ") || "Professional connection"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(match.partner?.skills || []).slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-[#f2ebff] px-2.5 py-1 text-[0.72rem] font-medium text-[#9b76df]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3ecff] text-[#a07be6]">
                      <MessageCircleMore size={18} />
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {!displayMatches.length && !pendingMatches.length ? (
              <EmptyState
                title="No matches yet"
                description="Swipe right on strong fits in Discover and your first conversation will appear here."
                actionLabel="Go to Discover"
                onAction={() => navigate("/discover")}
              />
            ) : null}
          </>
        )}
      </div>
    </Motion.section>
  );
}
