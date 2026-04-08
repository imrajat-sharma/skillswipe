import { createElement } from "react";
import { Inbox } from "lucide-react";
import { Button } from "./Button";

export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="surface-empty flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--text-body)]">
        {createElement(Icon, { size: 30 })}
      </div>
      <h3 className="mb-2 text-lg font-bold text-[var(--text-strong)] md:text-xl">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm leading-7 text-[var(--text-muted)]">{description}</p>
      {actionLabel && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
