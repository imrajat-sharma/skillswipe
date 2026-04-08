import { motion as Motion } from "framer-motion";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { Avatar } from "../components/Avatar";
import feedImage from "../assets/feed.png";
import connectionsImage from "../assets/connections.png";
import swipeImage from "../assets/swipe.png";
import { useAuth } from "../context/AuthContext";

const fallbackPosts = [
  {
    id: "profile-post-1",
    title: "Building Scalable React Applications",
    image: feedImage,
    likes: 234,
    comments: 45,
    date: "2 days ago",
  },
  {
    id: "profile-post-2",
    title: "Modern UI Design Principles",
    image: connectionsImage,
    likes: 189,
    comments: 32,
    date: "5 days ago",
  },
  {
    id: "profile-post-3",
    title: "TypeScript Best Practices",
    image: swipeImage,
    likes: 156,
    comments: 28,
    date: "1 week ago",
  },
];

const resolvePostImage = (value) => {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/src/") || value.startsWith("/assets/")) {
    return value;
  }

  const origin = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
};

export default function Profile() {
  const { api, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [profileUser, setProfileUser] = useState(user);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTab] = useState("posts");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/profile");
        setProfileUser(response.data.user || user);
      } catch {
        setProfileUser(user);
      }
    };

    if (user?._id) {
      loadProfile();
    }
  }, [api, user]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoadingPosts(true);
        const response = await api.get("/posts?limit=20&page=1");
        setPosts((response.data.posts || []).filter((post) => post.author?._id === user?._id));
      } catch {
        setPosts([]);
        setError("Unable to load your posts right now.");
      } finally {
        setLoadingPosts(false);
      }
    };

    if (user?._id) {
      loadPosts();
    } else {
      setLoadingPosts(false);
    }
  }, [api, user?._id]);

  const displayPosts = posts.length
    ? posts.map((post, index) => ({
        id: post._id,
        title: post.caption || post.content || `Post ${index + 1}`,
        image: resolvePostImage(post.images?.[0]) || fallbackPosts[index % fallbackPosts.length].image,
        likes: post.likeCount || 0,
        comments: post.commentCount || 0,
        date: "Recently",
      }))
    : fallbackPosts;

  const profileDetails = [
    { label: "Email", value: profileUser?.email || "alex.martinez@email.com" },
    { label: "Username", value: profileUser?.username ? `@${profileUser.username}` : "@alexdesigns" },
    { label: "City", value: profileUser?.location || "San Francisco" },
    { label: "Country", value: "United States" },
    { label: "Pin Code", value: profileUser?.pincode || "94102" },
    { label: "Timezone", value: "PST (UTC-8)" },
  ];

  return (
    <Motion.section
      className="page-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26 }}
    >
      <div className="space-y-5">
        {error ? <div className="status-message error">{error}</div> : null}

        <div className="grid justify-items-center gap-3 pt-1">
          <div className="rounded-full border-[3px] border-[#9f7aea] p-1">
            <Avatar name={profileUser?.name || "Alex Martinez"} image={profileUser?.photo} size="lg" />
          </div>
          <div className="text-center">
            <h1 className="text-[1.9rem] font-semibold leading-8 text-slate-700">{profileUser?.name || "Alex Martinez"}</h1>
            <span className="mt-3 inline-flex rounded-full bg-[#efe5ff] px-4 py-2 text-[0.82rem] font-semibold text-[#9b76df]">
              {user?.swipesLeftToday ?? 12} Swipes Remaining
            </span>
          </div>
        </div>

        <div className="rounded-[1.6rem] bg-white p-4 shadow-[0_16px_44px_rgba(148,163,184,0.16)]">
          <div className="grid gap-3">
            {profileDetails.map((detail, index) => (
              <div
                key={detail.label}
                className={`flex items-center justify-between gap-4 ${index < profileDetails.length - 1 ? "border-b border-slate-100 pb-3" : ""}`}
              >
                <span className="text-[0.88rem] font-medium text-slate-400">{detail.label}</span>
                <span className="text-right text-[0.9rem] font-semibold text-slate-600">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-around border-b border-slate-200 text-[0.95rem] font-semibold">
            <button type="button" className={`profile-tab ${activeTab === "posts" ? "active" : ""}`}>
              Posts
            </button>
            <button type="button" className="profile-tab">
              Activity
            </button>
          </div>

          <div className="mt-4 grid gap-4">
            {loadingPosts ? (
              <div className="rounded-[1.5rem] bg-white px-5 py-8 text-sm text-slate-500 shadow-[0_14px_40px_rgba(148,163,184,0.16)]">
                Loading your posts...
              </div>
            ) : displayPosts.length ? (
              displayPosts.map((post) => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-[1.6rem] bg-white shadow-[0_16px_44px_rgba(148,163,184,0.16)]"
                >
                  <img src={post.image} alt={post.title} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h2 className="text-[1rem] font-semibold text-slate-700">{post.title}</h2>
                    <div className="mt-3 flex items-center justify-between text-[0.82rem] text-slate-400">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1">
                          <Heart size={14} />
                          {post.likes}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle size={14} />
                          {post.comments}
                        </span>
                      </div>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState title="No posts yet" description="Your published posts will show up here after you share your first update." />
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pb-1 text-[0.9rem] text-slate-400">
          <MapPin size={15} />
          <span>{profileUser?.location || "San Francisco, CA"}</span>
        </div>
      </div>
    </Motion.section>
  );
}
