import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import PostCard from "../components/PostCard";
import feedImage from "../assets/feed.png";
import connectionsImage from "../assets/connections.png";
import { useAuth } from "../context/AuthContext";

const POSTS_PAGE_SIZE = 10;

const fallbackPosts = [
  {
    _id: "mock-feed-1",
    type: "image",
    content: "Just launched our new design system! Excited to share insights on building scalable component libraries...",
    images: [feedImage],
    createdAt: "2026-04-06T08:00:00.000Z",
    likeCount: 234,
    commentCount: 45,
    shareCount: 0,
    isOwner: false,
    isLiked: false,
    isShared: false,
    author: {
      name: "Sarah Mitchell",
      username: "sarahmitchell",
      roles: ["Product Design"],
    },
  },
  {
    _id: "mock-feed-2",
    type: "image",
    content: "Amazing experience at TechConf 2024! Key takeaways on machine learning trends and the future of AI development.",
    images: [connectionsImage],
    createdAt: "2026-04-03T08:00:00.000Z",
    likeCount: 189,
    commentCount: 32,
    shareCount: 0,
    isOwner: false,
    isLiked: false,
    isShared: false,
    author: {
      name: "Marcus Chen",
      username: "marcuschen",
      roles: ["Software Engineer", "AI/ML"],
    },
  },
];

export default function Dashboard() {
  const { api } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/posts", {
        params: { limit: POSTS_PAGE_SIZE, page: 1 },
      });
      setPosts(response.data.posts || []);
      setError("");
    } catch (loadError) {
      setError(loadError?.response?.data?.message || "Unable to load the feed.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDeletePost = async (post) => {
    try {
      setDeletingId(post._id);
      await api.delete(`/posts/${post._id}`);
      setPosts((current) => current.filter((item) => item._id !== post._id));
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || "Unable to delete this post.");
    } finally {
      setDeletingId("");
    }
  };

  const displayPosts = posts.length ? posts : fallbackPosts;

  return (
    <section className="page-container">
      {error ? <div className="status-message error">{error}</div> : null}

      <div className="grid gap-4 pb-2">
        {loading ? (
          <div className="rounded-[1.75rem] bg-white px-5 py-8 text-sm text-slate-500 shadow-[0_14px_40px_rgba(148,163,184,0.16)]">
            Loading posts...
          </div>
        ) : displayPosts.length ? (
          displayPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDeletePost}
              deleting={deletingId === post._id}
              onPostUpdate={(updatedPost) =>
                setPosts((current) => current.map((item) => (item._id === updatedPost._id ? updatedPost : item)))
              }
            />
          ))
        ) : (
          <EmptyState title="No posts yet" description="Be the first person to share a project update." />
        )}
      </div>
    </section>
  );
}
