import { motion } from "framer-motion";
import { Activity, Layers3, Sparkles } from "lucide-react";

const MotionArticle = motion.article;

const summaryCards = [
  {
    icon: Activity,
    title: "Daily swipes",
    tone: "from-[#0f172a] to-[#1d4ed8]",
    stat: (user) => user?.swipesLeftToday ?? 0,
    helper: "left before discover resets",
  },
  {
    icon: Sparkles,
    title: "Profile status",
    tone: "from-[#7c2d12] to-[#f97316]",
    stat: (user) => (user?.isProfileComplete ? "Live" : "Setup"),
    helper: "visibility in the discovery queue",
  },
  {
    icon: Layers3,
    title: "Feed window",
    tone: "from-[#065f46] to-[#14b8a6]",
    stat: (user, posts) => posts?.length ?? 0,
    helper: "posts loaded from the live API",
  },
];

export function FeedSummaryCards({ user, posts }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {summaryCards.map((card, index) => {
        const Icon = card.icon;

        return (
          <MotionArticle
            key={card.title}
            className={`rounded-[1.5rem] bg-gradient-to-br ${card.tone} p-[1px] shadow-[var(--shadow-soft)]`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="h-full rounded-[1.45rem] bg-[var(--bg-elevated)] p-4 text-[var(--text-body)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-soft)]">
                    {card.title}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-[var(--text-strong)]">{card.stat(user, posts)}</p>
                </div>
                <span className="rounded-2xl bg-[var(--surface-subtle)] p-3 text-[var(--text-strong)]">
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{card.helper}</p>
            </div>
          </MotionArticle>
        );
      })}
    </div>
  );
}
