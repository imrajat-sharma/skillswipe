import React from "react";
import { Briefcase, Heart, MapPin, MessageCircle } from "lucide-react";
import { Avatar } from "./Avatar";
import { SkillBadge } from "./SkillBadge";
import { Badge } from "./Badge";

export const ProfileCard = ({ profile, onLike, onSkip, onMessage, variant = "compact" }) => {
  const { name, headline, image, location, skills = [], role, connections, matchPercentage, isPremium } = profile;

  if (variant === "compact") {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] shadow-soft transition-all duration-300 hover:shadow-soft-lg">
        <div className="group relative h-64 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(247,98,98,0.16),_transparent_38%),linear-gradient(135deg,_#ffe2d0,_#ffe2ea_55%,_#eef5ff)] md:h-80">
          {image ? (
            <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Avatar name={name} size="xl" />
            </div>
          )}
          {isPremium ? (
            <Badge variant="accent" className="absolute right-4 top-4">
              Premium
            </Badge>
          ) : null}
          {matchPercentage ? (
            <div className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-1.5 backdrop-blur-sm dark:bg-slate-900/80">
              <p className="text-sm font-bold text-rose-500">{matchPercentage}% Match</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3">
            <h3 className="line-clamp-1 text-lg font-bold text-[var(--text-strong)] md:text-xl">{name}</h3>
            <p className="line-clamp-2 text-sm text-[var(--text-muted)]">{headline}</p>
          </div>

          <div className="mb-4 flex-1 space-y-2">
            {location ? (
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <MapPin size={16} className="text-rose-500" />
                <span>{location}</span>
              </div>
            ) : null}
            {role ? (
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Briefcase size={16} className="text-cyan-600" />
                <span>{role}</span>
              </div>
            ) : null}
            {connections ? <p className="text-xs text-[var(--text-soft)]">{connections} common connections</p> : null}
          </div>

          {skills.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, idx) => (
                <SkillBadge key={idx} skill={skill} />
              ))}
              {skills.length > 3 ? <Badge variant="neutral">+{skills.length - 3}</Badge> : null}
            </div>
          ) : null}

          <div className="flex gap-2 border-t border-[var(--border-soft)] pt-4">
            <button
              onClick={onSkip}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[var(--border-strong)] py-2.5 font-semibold text-[var(--text-body)] transition-all duration-200 hover:bg-[var(--surface-subtle)]"
            >
              <span>✕</span> Pass
            </button>
            <button
              onClick={onMessage}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-50 py-2.5 font-semibold text-cyan-700 transition-all duration-200 hover:bg-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300"
            >
              <MessageCircle size={18} /> Chat
            </button>
            <button
              onClick={onLike}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-orange-400 py-2.5 font-semibold text-white transition-all duration-200 hover:shadow-soft-lg active:scale-95"
            >
              <Heart size={18} fill="white" /> Connect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] shadow-soft">
      {image ? (
        <div className="max-h-96 overflow-hidden bg-[var(--surface-subtle)] md:h-full">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>
      ) : null}

      <div className="p-6 md:p-8">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-[var(--text-strong)] md:text-3xl">{name}</h2>
            <p className="mb-3 text-lg text-[var(--text-muted)]">{headline}</p>
            <div className="flex flex-wrap gap-3 text-sm text-[var(--text-muted)]">
              {location ? (
                <div className="flex items-center gap-1">
                  <MapPin size={18} className="text-rose-500" />
                  {location}
                </div>
              ) : null}
              {role ? (
                <div className="flex items-center gap-1">
                  <Briefcase size={18} className="text-cyan-600" />
                  {role}
                </div>
              ) : null}
            </div>
          </div>
          {isPremium ? <Badge variant="accent">Premium</Badge> : null}
        </div>

        {skills.length > 0 ? (
          <div className="mt-6 border-t border-[var(--border-soft)] pt-6">
            <h4 className="mb-3 font-semibold text-[var(--text-strong)]">Top Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <SkillBadge key={idx} skill={skill} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileCard;
