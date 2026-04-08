import { motion as Motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "../Badge";

export function ActivitySignalCard({ title, body, meta, badge, onClick }) {
  return (
    <Motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
      className="w-full rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface)] p-4 text-left shadow-soft"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-3 text-rose-500">
            <Sparkles size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-[var(--text-strong)]">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{body}</p>
          </div>
        </div>
        {badge ? <Badge variant="neutral">{badge}</Badge> : <ArrowRight size={16} className="text-[var(--text-soft)]" />}
      </div>
      {meta ? <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-soft)]">{meta}</p> : null}
    </Motion.button>
  );
}
