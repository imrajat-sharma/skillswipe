import { motion as Motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";

export function ProfileOverviewCard({ user, completion, swipesLeft }) {
  return (
    <Motion.div
      layout
      className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-soft"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} image={user?.photo} size="lg" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">Profile</p>
            <h2 className="mt-1 text-2xl font-bold text-[var(--text-strong)]">{user?.name || "Your profile"}</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{user?.email}</p>
          </div>
        </div>
        <Badge variant={user?.isProfileComplete ? "success" : "warning"}>{completion}%</Badge>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.4rem] bg-[var(--surface-subtle)] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">
            <Sparkles size={14} />
            Discover status
          </div>
          <p className="mt-2 text-base font-semibold text-[var(--text-strong)]">
            {user?.isProfileComplete ? "Visible in SwipeConnect" : "Complete profile to unlock discover"}
          </p>
        </div>
        <div className="rounded-[1.4rem] bg-[var(--surface-subtle)] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">
            <MapPin size={14} />
            Daily rhythm
          </div>
          <p className="mt-2 text-base font-semibold text-[var(--text-strong)]">{swipesLeft} swipes left today</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(user?.roles || []).map((role) => (
          <Badge key={role} variant="secondary">
            {role}
          </Badge>
        ))}
      </div>
    </Motion.div>
  );
}
