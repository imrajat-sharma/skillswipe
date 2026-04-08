import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Send, SendHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { buildApiAssetUrl } from "../utils/formatters";
import { Avatar } from "./Avatar";

const MotionArticle = motion.article;
const MotionDiv = motion.div;

const resolveImageSource = (value, apiBaseUrl) => {
  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:") ||
    value.startsWith("/src/") ||
    value.startsWith("/assets/")
  ) {
    return value;
  }

  return buildApiAssetUrl(value, apiBaseUrl);
};

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

  const isMock = !localPost._id || String(localPost._id).startsWith("mock-");
  const imageSource = resolveImageSource(localPost.images?.[0], apiBaseUrl);
  const authorPhoto = resolveImageSource(localPost.author?.photo, apiBaseUrl);
  const authorMeta = [localPost.author?.username ? `@${localPost.author.username}` : null, (localPost.author?.roles || []).join(" · ")]
    .filter(Boolean)
    .join(" · ");

  const loadComments = async () => {
    if (isMock) {
      return;
    }

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
    if (isMock) {
      return;
    }

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
    if (isMock) {
      return;
    }

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
    if (!commentText.trim() || isMock) {
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
    <MotionArticle
      className="overflow-hidden rounded-[1.75rem] border border-[#edf0f6] bg-white p-4 shadow-[0_18px_42px_rgba(148,163,184,0.18)]"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={localPost.author?.name} image={authorPhoto} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-[1rem] font-semibold leading-5 text-slate-700">
              {localPost.author?.name || "Community member"}
            </p>
            <p className="mt-0.5 text-[0.82rem] leading-4 text-slate-400">{authorMeta || "Product update"}</p>
          </div>
        </div>

        {localPost.isOwner && onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(localPost)}
            disabled={deleting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-400"
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full bg-gradient-to-r from-[#4f8df7] to-[#4d7ef0] px-4 py-2 text-[0.82rem] font-semibold text-white"
          >
            Connect
          </button>
        )}
      </div>

      {localPost.content ? (
        <div className="mt-4 whitespace-pre-wrap break-words text-[0.98rem] leading-7 text-slate-600">
          {localPost.content}
        </div>
      ) : null}

      {imageSource ? <img src={imageSource} alt={localPost.caption || "SkillSwipe post"} className="mt-4 h-44 w-full rounded-[1rem] object-cover" /> : null}

      <div className="mt-4 flex items-center gap-2 text-[0.84rem] text-slate-400">
        <span>{localPost.likeCount || 0} likes</span>
        <span>·</span>
        <span>{localPost.commentCount || 0} comments</span>
        {Boolean(localPost.shareCount) ? (
          <>
            <span>·</span>
            <span>{localPost.shareCount} shares</span>
          </>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-around border-t border-[#edf0f6] pt-3 text-slate-400">
        <button type="button" onClick={handleLike} className={`feed-action ${localPost.isLiked ? "active" : ""}`} disabled={actionState.liking}>
          <Heart size={18} fill={localPost.isLiked ? "currentColor" : "none"} />
        </button>
        <button type="button" onClick={handleToggleComments} className={`feed-action ${showComments ? "active" : ""}`}>
          <MessageCircle size={18} />
        </button>
        <button type="button" onClick={handleShare} className={`feed-action ${localPost.isShared ? "active" : ""}`} disabled={actionState.sharing}>
          <SendHorizontal size={18} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showComments ? (
          <MotionDiv
            className="mt-4 rounded-[1.15rem] bg-slate-50 p-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {isMock ? (
              <p className="text-sm text-slate-500">Comments are available on live posts once your feed is connected.</p>
            ) : (
              <>
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    className="input flex-1"
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Write a comment..."
                  />
                  <button
                    type="submit"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#8b5cf6] text-white"
                    disabled={commentStatus.saving || commentStatus.loading}
                  >
                    <Send size={15} />
                  </button>
                </form>

                {commentStatus.error ? <div className="status-message error mt-3">{commentStatus.error}</div> : null}

                <div className="mt-4 grid gap-3">
                  {commentStatus.loading ? <p className="text-sm text-slate-500">Loading comments...</p> : null}
                  {!commentStatus.loading && !comments.length ? (
                    <p className="text-sm text-slate-500">No comments yet. Be the first to respond.</p>
                  ) : null}
                  {comments.map((comment) => (
                    <div key={comment._id} className="rounded-[1rem] bg-white px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={comment.author?.name || "Member"}
                          image={resolveImageSource(comment.author?.photo, apiBaseUrl)}
                          size="xs"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{comment.author?.name || "Member"}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {actionState.error ? <span className="mt-3 block text-xs text-rose-500">{actionState.error}</span> : null}
          </MotionDiv>
        ) : null}
      </AnimatePresence>
    </MotionArticle>
  );
}
