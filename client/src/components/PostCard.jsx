import { BarChart3, Clock3, Heart, MessageCircle, Send, Share2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { buildApiAssetUrl, formatDateTime, formatRelativeTime } from "../utils/formatters";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Button } from "./Button";

export default function PostCard({ post, onDelete, deleting, onPostUpdate }) {
  const { api } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [localPost, setLocalPost] = useState(post);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentStatus, setCommentStatus] = useState({ loading: false, saving: false, error: "" });
  const [actionState, setActionState] = useState({ liking: false, sharing: false, error: "" });

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const updatePost = (nextPost) => {
    setLocalPost(nextPost);
    onPostUpdate?.(nextPost);
  };

  const imageSources = useMemo(
    () => (localPost.images || []).map((image) => buildApiAssetUrl(image, apiBaseUrl)),
    [apiBaseUrl, localPost.images],
  );

  const loadComments = async () => {
    try {
      setCommentStatus((current) => ({ ...current, loading: true, error: "" }));
      const response = await api.get(`/posts/${localPost._id}/comments?limit=10&page=1`);
      setComments(response.data.comments || []);
    } catch (error) {
      setCommentStatus((current) => ({
        ...current,
        error: error?.response?.data?.message || "Unable to load comments.",
      }));
    } finally {
      setCommentStatus((current) => ({ ...current, loading: false }));
    }
  };

  const handleToggleComments = async () => {
    const nextVisible = !showComments;
    setShowComments(nextVisible);
    if (nextVisible && !comments.length) {
      await loadComments();
    }
  };

  const handleLike = async () => {
    try {
      setActionState({ liking: true, sharing: false, error: "" });
      const response = await api[localPost.isLiked ? "delete" : "post"](`/posts/${localPost._id}/like`);
      updatePost(response.data.post);
    } catch (error) {
      setActionState({
        liking: false,
        sharing: false,
        error: error?.response?.data?.message || "Unable to update like state.",
      });
      return;
    }

    setActionState({ liking: false, sharing: false, error: "" });
  };

  const handleShare = async () => {
    try {
      setActionState({ liking: false, sharing: true, error: "" });
      const response = await api.post(`/posts/${localPost._id}/share`);
      updatePost(response.data.post);
    } catch (error) {
      setActionState({
        liking: false,
        sharing: false,
        error: error?.response?.data?.message || "Unable to share this post.",
      });
      return;
    }

    setActionState({ liking: false, sharing: false, error: "" });
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) {
      return;
    }

    try {
      setCommentStatus((current) => ({ ...current, saving: true, error: "" }));
      const response = await api.post(`/posts/${localPost._id}/comments`, { content: commentText.trim() });
      updatePost(response.data.post);
      setComments((current) => [response.data.comment, ...current]);
      setCommentText("");
      setShowComments(true);
    } catch (error) {
      setCommentStatus((current) => ({
        ...current,
        error: error?.response?.data?.message || "Unable to add your comment.",
      }));
    } finally {
      setCommentStatus((current) => ({ ...current, saving: false }));
    }
  };

  return (
    <article className="glass-panel rounded-[1.7rem] p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={localPost.author?.name} image={buildApiAssetUrl(localPost.author?.photo, apiBaseUrl)} />
          <div>
            <p className="text-sm font-semibold text-[var(--text-strong)]">{localPost.author?.name || "Community member"}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1">
                <Clock3 size={12} />
                {formatDateTime(localPost.createdAt)}
              </span>
              <Badge variant="neutral">{localPost.type}</Badge>
              {localPost.formatting === "markdown" ? <Badge variant="secondary">markdown</Badge> : null}
              <span>{formatRelativeTime(localPost.createdAt)}</span>
            </div>
          </div>
        </div>
        {localPost.isOwner ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(localPost)} isLoading={deleting}>
            <Trash2 size={16} />
            Delete
          </Button>
        ) : null}
      </div>

      {localPost.content ? (
        <div className="mt-4 whitespace-pre-wrap break-words text-[14px] leading-7 text-[var(--text-body)]">{localPost.content}</div>
      ) : null}

      {localPost.caption ? <p className="mt-3 text-[13px] leading-6 text-[var(--text-muted)]">{localPost.caption}</p> : null}

      {imageSources.length ? (
        <div className={`mt-4 grid gap-2.5 ${imageSources.length > 1 ? "md:grid-cols-2" : ""}`}>
          {imageSources.map((image) => (
            <img
              key={image}
              src={image}
              alt={localPost.caption || "SkillSwipe post"}
              className="h-56 w-full rounded-[1.2rem] object-cover md:h-64"
            />
          ))}
        </div>
      ) : null}

      {localPost.poll ? (
        <div className="mt-4 rounded-[1.25rem] border border-[var(--border-soft)] bg-[var(--surface-subtle)] p-3.5">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <BarChart3 size={14} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Poll</span>
          </div>
          <h3 className="mt-2 text-[15px] font-bold text-[var(--text-strong)]">{localPost.poll.question}</h3>
          <div className="mt-3 grid gap-2">
            {localPost.poll.options.map((option) => (
              <div
                key={option._id || option.text}
                className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-[var(--text-body)]">{option.text}</span>
                  <Badge variant="primary">{option.votesCount || 0} votes</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-soft)] pt-4 text-sm text-[var(--text-muted)]">
        <div className="flex flex-wrap items-center gap-4">
          <span>{localPost.likeCount} likes</span>
          <span>{localPost.commentCount} comments</span>
          <span>{localPost.shareCount} shares</span>
        </div>
        {actionState.error ? <span className="text-xs text-rose-500">{actionState.error}</span> : null}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <button type="button" onClick={handleLike} className={`post-action ${localPost.isLiked ? "active" : ""}`}>
          <Heart size={15} fill={localPost.isLiked ? "currentColor" : "none"} />
          {localPost.isLiked ? "Liked" : "Like"}
        </button>
        <button type="button" onClick={handleToggleComments} className={`post-action ${showComments ? "active" : ""}`}>
          <MessageCircle size={15} />
          Comment
        </button>
        <button type="button" onClick={handleShare} className={`post-action ${localPost.isShared ? "active" : ""}`}>
          <Share2 size={15} />
          {localPost.isShared ? "Shared" : "Share"}
        </button>
      </div>

      {showComments ? (
        <div className="mt-4 rounded-[1.25rem] border border-[var(--border-soft)] bg-[var(--surface-subtle)] p-4">
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              className="input flex-1"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Write a comment..."
            />
            <Button type="submit" variant="primary" size="sm" isLoading={commentStatus.saving || commentStatus.loading}>
              <Send size={15} />
            </Button>
          </form>

          {commentStatus.error ? <div className="status-message error mt-3">{commentStatus.error}</div> : null}

          <div className="mt-4 grid gap-3">
            {commentStatus.loading ? <p className="text-sm text-[var(--text-muted)]">Loading comments...</p> : null}
            {!commentStatus.loading && !comments.length ? (
              <p className="text-sm text-[var(--text-muted)]">No comments yet. Be the first to respond.</p>
            ) : null}
            {comments.map((comment) => (
              <div key={comment._id} className="rounded-[1rem] bg-[var(--surface)] px-3 py-3">
                <div className="flex items-center gap-2">
                  <Avatar
                    name={comment.author?.name || "Member"}
                    image={buildApiAssetUrl(comment.author?.photo, apiBaseUrl)}
                    size="xs"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-strong)]">{comment.author?.name || "Member"}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatRelativeTime(comment.createdAt)}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
