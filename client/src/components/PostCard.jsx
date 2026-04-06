import { BarChart3, Clock3, Trash2 } from "lucide-react";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Button } from "./Button";

const formatTime = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export default function PostCard({ post, onDelete, deleting }) {
  return (
    <article className="page-surface rounded-[1.5rem] p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={post.author?.name} image={post.author?.photo} />
          <div>
            <p className="text-sm font-semibold text-slate-900">{post.author?.name || "Community member"}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock3 size={12} />
                {formatTime(post.createdAt)}
              </span>
              <Badge variant="neutral">{post.type}</Badge>
              {post.formatting === "markdown" ? <Badge variant="secondary">markdown</Badge> : null}
            </div>
          </div>
        </div>
        {post.isOwner ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(post)} isLoading={deleting}>
            <Trash2 size={16} />
            Delete
          </Button>
        ) : null}
      </div>

      {post.content ? (
        <div className="mt-4 whitespace-pre-wrap break-words text-[14px] leading-6 text-slate-700">{post.content}</div>
      ) : null}

      {post.caption ? <p className="mt-3 text-[13px] leading-6 text-slate-600">{post.caption}</p> : null}

      {post.images?.length ? (
        <div className={`mt-4 grid gap-2.5 ${post.images.length > 1 ? "md:grid-cols-2" : ""}`}>
          {post.images.map((image) => (
            <img
              key={image}
              src={image}
              alt={post.caption || "SkillSwipe post"}
              className="h-56 w-full rounded-[1.2rem] object-cover md:h-64"
            />
          ))}
        </div>
      ) : null}

      {post.poll ? (
        <div className="mt-4 rounded-[1.25rem] bg-slate-50 p-3.5">
          <div className="flex items-center gap-2 text-slate-500">
            <BarChart3 size={14} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Poll</span>
          </div>
          <h3 className="mt-2 text-[15px] font-bold text-slate-900">{post.poll.question}</h3>
          <div className="mt-3 grid gap-2">
            {post.poll.options.map((option) => (
              <div key={option._id || option.text} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-700">{option.text}</span>
                  <Badge variant="primary">{option.votesCount || 0} votes</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
