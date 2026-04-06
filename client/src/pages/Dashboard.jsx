import { Activity, RefreshCcw, Sparkles, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import PostCard from "../components/PostCard";
import PostComposer from "../components/PostComposer";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { api, user, refreshUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/posts?limit=10&page=1");
      setPosts(response.data.posts || []);
      setPagination(response.data.pagination || null);
      setError("");
    } catch (loadError) {
      setError(loadError?.response?.data?.message || "Unable to load the feed.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async ({ type, formatting, content, caption, question, options, files, resetForm, setLocalError }) => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      let payload;
      let config = {};

      if (type === "image") {
        payload = new FormData();
        payload.append("type", type);
        payload.append("caption", caption);
        files.forEach((file) => payload.append("images", file));
      } else {
        payload = { type, formatting, content, caption, question, options };
        config = { headers: { "Content-Type": "application/json" } };
      }

      const response = await api.post("/posts", payload, config);
      setPosts((current) => [response.data.post, ...current]);
      setMessage("Post published.");
      resetForm();
    } catch (createError) {
      setLocalError(createError?.response?.data?.message || "Unable to publish this post.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (post) => {
    try {
      setDeletingId(post._id);
      await api.delete(`/posts/${post._id}`);
      setPosts((current) => current.filter((item) => item._id !== post._id));
      setMessage("Post deleted.");
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || "Unable to delete this post.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section className="page-container pt-5 md:pt-7">
      <div className="feed-grid">
        <div className="grid gap-4">
          <div className="page-surface rounded-[1.6rem] p-4 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="section-label">Your home base</div>
                <h1 className="h2 mt-2 text-slate-900">Feed, context, and quick action</h1>
                <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-600">
                  Share progress updates, run polls, and see what the network is building before you jump into the discover queue.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => { loadPosts(); refreshUser(); }}>
                <RefreshCcw size={16} />
                Refresh
              </Button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.1rem] bg-slate-900 px-4 py-4 text-white">
                <Activity size={16} />
                <p className="mt-3 text-2xl font-bold">{user?.swipesLeftToday ?? 0}</p>
                <p className="mt-1 text-xs text-white/70">Swipes left today</p>
              </div>
              <div className="rounded-[1.1rem] bg-primary-100 px-4 py-4 text-primary-900">
                <Users size={16} />
                <p className="mt-3 text-2xl font-bold">{user?.roles?.length || 0}</p>
                <p className="mt-1 text-xs text-primary-900/70">Roles on profile</p>
              </div>
              <div className="rounded-[1.1rem] bg-secondary-100 px-4 py-4 text-secondary-900">
                <Sparkles size={16} />
                <p className="mt-3 text-2xl font-bold">{pagination?.total ?? posts.length}</p>
                <p className="mt-1 text-xs text-secondary-900/70">Posts in current feed window</p>
              </div>
            </div>
          </div>

          <PostComposer onCreate={handleCreatePost} submitting={submitting} />

          {message ? <div className="status-message success">{message}</div> : null}
          {error ? <div className="status-message error">{error}</div> : null}

          {loading ? (
            <div className="page-surface rounded-[2rem] p-6 text-slate-500">Loading posts...</div>
          ) : posts.length ? (
            <div className="grid gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={handleDeletePost}
                  deleting={deletingId === post._id}
                />
              ))}
            </div>
          ) : (
            <div className="page-surface rounded-[1.5rem]">
              <EmptyState
                title="No posts yet"
                description="Be the first person to share a project update, quick poll, or collaboration ask."
              />
            </div>
          )}
        </div>

        <aside className="grid gap-4">
          <div className="page-surface rounded-[1.5rem] p-4 md:p-5">
            <div className="section-label">Profile status</div>
            <h2 className="h3 mt-2 text-slate-900">{user?.isProfileComplete ? "Ready to be discovered" : "Complete your profile first"}</h2>
            <p className="mt-2 text-xs leading-6 text-slate-600">
              Your profile needs roles, skills, availability, bio, and a photo before it appears in the discover queue.
            </p>
            <div className="mt-3 chip-group">
              {(user?.skills || []).slice(0, 6).map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="page-surface rounded-[1.5rem] p-4 md:p-5">
            <div className="section-label">Posting tips</div>
            <ul className="mt-3 grid gap-2 text-xs leading-6 text-slate-600">
              <li>Use markdown text posts for build logs, learning notes, or mentorship asks.</li>
              <li>Image posts work well for screenshots, event moments, and project reveals.</li>
              <li>Polls are useful when you want quick signal from the community before building.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
