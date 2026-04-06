import { Camera, MapPin, Save, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import PostCard from "../components/PostCard";
import { Tabs } from "../components/Tabs";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { api, user, setUser } = useAuth();
  const [form, setForm] = useState({
    bio: "",
    roles: "",
    skills: "",
    location: "",
    pincode: "",
    availability: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileUser, setProfileUser] = useState(user);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      bio: user.bio || "",
      roles: (user.roles || []).join(", "),
      skills: (user.skills || []).join(", "),
      location: user.location || "",
      pincode: user.pincode || "",
      availability: user.availability || "",
    });
  }, [user]);

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
        const response = await api.get("/posts?limit=20&page=1");
        setPosts((response.data.posts || []).filter((post) => post.author?._id === user?._id));
      } catch {
        setPosts([]);
      }
    };

    if (user?._id) {
      loadPosts();
    }
  }, [api, user?._id]);

  const profileStrength = useMemo(() => {
    const checks = [profileUser?.photo, profileUser?.bio, profileUser?.roles?.length, profileUser?.skills?.length, profileUser?.availability];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profileUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = new FormData();
      payload.append("bio", form.bio);
      payload.append("roles", form.roles);
      payload.append("skills", form.skills);
      payload.append("location", form.location);
      payload.append("pincode", form.pincode);
      payload.append("availability", form.availability);
      if (photoFile) {
        payload.append("photo", photoFile);
      }

      const response = await api.put("/profile", payload);
      const nextUser = response.data.user;
      setUser(nextUser);
      setProfileUser(nextUser);
      setPhotoFile(null);
      setMessage("Profile updated.");
    } catch (saveError) {
      setError(saveError?.response?.data?.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      label: "About",
      content: (
        <div className="mt-6 grid gap-5">
          <div className="rounded-[1.5rem] bg-[var(--surface-subtle)] p-5">
            <h3 className="font-display text-xl font-bold text-[var(--text-strong)]">Bio</h3>
            <p className="mt-3 whitespace-pre-wrap text-[var(--text-muted)]">
              {profileUser?.bio || "Add a bio so people know what kind of collaborator you are."}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[var(--surface-subtle)] p-5">
            <h3 className="font-display text-xl font-bold text-[var(--text-strong)]">Skills</h3>
            <div className="mt-4 chip-group">
              {(profileUser?.skills || []).length ? (
                profileUser.skills.map((skill) => <Badge key={skill} variant="primary">{skill}</Badge>)
              ) : (
                <p className="text-[var(--text-muted)]">No skills added yet.</p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Posts",
      content: (
        <div className="mt-6 grid gap-4">
          {posts.length ? posts.map((post) => <PostCard key={post._id} post={post} onDelete={() => {}} deleting={false} />) : (
            <div className="glass-panel rounded-[2rem]">
              <EmptyState title="No posts yet" description="Your published posts will show up here after you share your first update." />
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Edit",
      content: (
        <form onSubmit={handleSave} className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--text-body)]">Bio</span>
            <textarea className="textarea" name="bio" value={form.bio} onChange={handleChange} maxLength={200} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--text-body)]">Roles</span>
            <input className="input" name="roles" value={form.roles} onChange={handleChange} placeholder="Mentor, Collaborator" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--text-body)]">Skills</span>
            <input className="input" name="skills" value={form.skills} onChange={handleChange} placeholder="Node.js, React, Product Design" />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-body)]">Location</span>
              <input className="input" name="location" value={form.location} onChange={handleChange} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-body)]">Pincode</span>
              <input className="input" name="pincode" value={form.pincode} onChange={handleChange} />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--text-body)]">Availability</span>
            <input className="input" name="availability" value={form.availability} onChange={handleChange} placeholder="Weekends, evenings, full-time collab" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--text-body)]">Profile photo</span>
            <input type="file" accept="image/*" className="input" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} />
          </label>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" isLoading={saving}>
              <Save size={16} />
              Save changes
            </Button>
          </div>
        </form>
      ),
    },
  ];

  return (
    <section className="page-container">
      <div className="grid gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="glass-panel rounded-[1.8rem] p-4 md:p-5">
          <div className="flex flex-col items-center text-center">
            <Avatar name={profileUser?.name} image={profileUser?.photo} size="xl" />
            <h1 className="h3 mt-4">{profileUser?.name || "Your profile"}</h1>
            <p className="mt-1.5 text-xs text-[var(--text-muted)]">{profileUser?.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-800">
              <Sparkles size={13} />
              {profileStrength}% complete
            </div>
          </div>

          <div className="mt-4 grid gap-2.5 rounded-[1.2rem] bg-[var(--surface-subtle)] p-4 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-amber-500" />
              {profileUser?.location || "Delhi/NCR"}
            </div>
            <div className="flex items-center gap-2">
              <Camera size={14} className="text-cyan-600" />
              {profileUser?.availability || "Add availability"}
            </div>
          </div>

          <div className="mt-6 chip-group">
            {(profileUser?.roles || []).map((role) => (
              <Badge key={role} variant="secondary">{role}</Badge>
            ))}
          </div>
        </aside>

        <div className="glass-panel rounded-[1.8rem] p-4 md:p-6">
          <div className="section-label">Profile</div>
          <h2 className="h2 mt-2">Show people how you like to build</h2>
          <p className="mt-2.5 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
            Your profile controls who sees you in the discover queue and gives context to anyone who lands on your posts.
          </p>

          {message ? <div className="status-message success mt-5">{message}</div> : null}
          {error ? <div className="status-message error mt-5">{error}</div> : null}

          <div className="mt-6">
            <Tabs tabs={tabs} defaultTab={0} />
          </div>
        </div>
      </div>
    </section>
  );
}
