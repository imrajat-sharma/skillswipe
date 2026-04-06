import { Compass, Filter, Heart, RefreshCcw, Search, X } from "lucide-react";
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

const emptyFilters = {
  roles: [],
  skills: [],
  location: "",
  availability: "",
  pincode: "",
  search: "",
};

export default function Swipe() {
  const navigate = useNavigate();
  const { api, setUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [swipesLeft, setSwipesLeft] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [batchKey, setBatchKey] = useState(0);
  const [filters, setFilters] = useState(emptyFilters);
  const [filterOptions, setFilterOptions] = useState({
    roles: [],
    skills: [],
    locations: [],
    availability: [],
    pincodes: [],
  });

  const cards = useMemo(() => profiles.map(mapProfileToCard), [profiles]);

  const loadProfiles = useCallback(async (nextFilters = emptyFilters) => {
    try {
      setLoading(true);
      const params = {
        limit: 10,
        page: 1,
        ...(nextFilters.roles.length ? { roles: nextFilters.roles.join(",") } : {}),
        ...(nextFilters.skills.length ? { skills: nextFilters.skills.join(",") } : {}),
        ...(nextFilters.location ? { location: nextFilters.location } : {}),
        ...(nextFilters.availability ? { availability: nextFilters.availability } : {}),
        ...(nextFilters.pincode ? { pincode: nextFilters.pincode } : {}),
        ...(nextFilters.search ? { search: nextFilters.search } : {}),
      };
      const response = await api.get("/swipe/next", { params });
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

  const loadFilterOptions = useCallback(async () => {
    try {
      const response = await api.get("/swipe/filters");
      setFilterOptions(response.data.filters || {
        roles: [],
        skills: [],
        locations: [],
        availability: [],
        pincodes: [],
      });
    } catch {
      setFilterOptions({
        roles: [],
        skills: [],
        locations: [],
        availability: [],
        pincodes: [],
      });
    }
  }, [api]);

  useEffect(() => {
    loadProfiles(filters);
    // Initial queue load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadProfiles]);

  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

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
      setUser((currentUser) => currentUser ? {
        ...currentUser,
        swipesLeftToday: response.data.swipesLeft ?? currentUser.swipesLeftToday,
      } : currentUser);
    } catch (actionError) {
      if (currentProfile) {
        setProfiles((current) => [currentProfile, ...current]);
      }
      setError(actionError?.response?.data?.message || "Unable to record that swipe.");
    }
  };

  const toggleArrayFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  };

  return (
    <section className="page-container">
      <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_290px]">
        <aside className="glass-panel h-fit rounded-[1.8rem] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="section-label">Filters</div>
              <h2 className="h3 mt-2">Tune your queue</h2>
            </div>
            <Filter size={18} className="text-rose-500" />
          </div>

          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Search</span>
              <div className="relative">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  className="input pl-10"
                  value={filters.search}
                  onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                  placeholder="Name, bio, skills..."
                />
              </div>
            </label>

            <div>
              <span className="text-xs font-semibold text-[var(--text-muted)]">Roles</span>
              <div className="chip-group mt-2">
                {filterOptions.roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleArrayFilter("roles", role)}
                    className={`filter-chip ${filters.roles.includes(role) ? "active" : ""}`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-[var(--text-muted)]">Skills</span>
              <div className="chip-group mt-2">
                {filterOptions.skills.slice(0, 10).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleArrayFilter("skills", skill)}
                    className={`filter-chip ${filters.skills.includes(skill) ? "active" : ""}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <label className="grid gap-2">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Location</span>
              <select className="select" value={filters.location} onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}>
                <option value="">Any location</option>
                {filterOptions.locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Availability</span>
              <select
                className="select"
                value={filters.availability}
                onChange={(event) => setFilters((current) => ({ ...current, availability: event.target.value }))}
              >
                <option value="">Any availability</option>
                {filterOptions.availability.map((availability) => (
                  <option key={availability} value={availability}>{availability}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Pincode</span>
              <select className="select" value={filters.pincode} onChange={(event) => setFilters((current) => ({ ...current, pincode: event.target.value }))}>
                <option value="">Any pincode</option>
                {filterOptions.pincodes.map((pincode) => (
                  <option key={pincode} value={pincode}>{pincode}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setFilters(emptyFilters);
                loadProfiles(emptyFilters);
              }}
            >
              Clear
            </Button>
            <Button type="button" variant="primary" className="flex-1" onClick={() => loadProfiles(filters)}>
              Apply
            </Button>
          </div>
        </aside>

        <div className="grid gap-4">
          <div className="glass-panel rounded-[2rem] p-4 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="section-label">SwipeConnect</div>
                <h1 className="h2 mt-2">Swipe with context, not guesswork</h1>
                <p className="mt-2.5 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
                  Profiles are ranked using overlapping skills, roles, and location. Keep the discover queue intentional and use your limited daily swipes well.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => loadProfiles(filters)}>
                <RefreshCcw size={16} />
                Refresh queue
              </Button>
            </div>
          </div>

          {message ? <div className="status-message success">{message}</div> : null}
          {error ? <div className="status-message error">{error}</div> : null}

          <div className="glass-panel rounded-[1.8rem] p-3.5 md:p-5">
            {loading ? (
              <div className="rounded-[1.2rem] bg-[var(--surface-subtle)] p-8 text-center text-sm text-[var(--text-muted)]">Loading your discover queue...</div>
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
                onAction={() => loadProfiles(filters)}
              />
            )}
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="glass-panel rounded-[1.5rem] p-4 md:p-5">
            <div className="flex items-center justify-between">
              <span className="section-label">Daily rhythm</span>
              <Compass size={16} className="text-rose-500" />
            </div>
            <p className="mt-3 text-3xl font-bold text-[var(--text-strong)]">{swipesLeft}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Swipes left today</p>
          </div>

          <div className="glass-panel rounded-[1.5rem] p-4 md:p-5">
            <div className="section-label">How to use it</div>
            <ul className="mt-3 grid gap-2 text-xs leading-6 text-[var(--text-muted)]">
              <li className="flex gap-2.5"><Heart size={14} className="mt-1 shrink-0 text-rose-500" /> Swipe right when skills and intent line up.</li>
              <li className="flex gap-2.5"><X size={14} className="mt-1 shrink-0 text-cyan-600" /> Pass quickly when the fit is weak so the queue stays relevant.</li>
              <li className="flex gap-2.5"><Compass size={14} className="mt-1 shrink-0 text-amber-500" /> Use matches to continue the conversation after a mutual like.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
