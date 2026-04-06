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
  const { api, user, refreshUser } = useAuth();
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
    const checks = [user?.photo, user?.bio, user?.roles?.length, user?.skills?.length, user?.availability];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [user]);

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

      await api.put("/profile", payload);
      await refreshUser();
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
          <div className="rounded-[1.5rem] bg-slate-50 p-5">
            <h3 className="font-display text-xl font-bold text-slate-900">Bio</h3>
            <p className="mt-3 whitespace-pre-wrap text-slate-600">{user?.bio || "Add a bio so people know what kind of collaborator you are."}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-5">
            <h3 className="font-display text-xl font-bold text-slate-900">Skills</h3>
            <div className="mt-4 chip-group">
              {(user?.skills || []).length ? (
                user.skills.map((skill) => <Badge key={skill} variant="primary">{skill}</Badge>)
              ) : (
                <p className="text-slate-500">No skills added yet.</p>
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
            <div className="page-surface rounded-[2rem]">
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
            <span className="text-sm font-semibold text-slate-700">Bio</span>
            <textarea className="textarea" name="bio" value={form.bio} onChange={handleChange} maxLength={200} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Roles</span>
            <input className="input" name="roles" value={form.roles} onChange={handleChange} placeholder="Mentor, Collaborator" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Skills</span>
            <input className="input" name="skills" value={form.skills} onChange={handleChange} placeholder="Node.js, React, Product Design" />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Location</span>
              <input className="input" name="location" value={form.location} onChange={handleChange} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Pincode</span>
              <input className="input" name="pincode" value={form.pincode} onChange={handleChange} />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Availability</span>
            <input className="input" name="availability" value={form.availability} onChange={handleChange} placeholder="Weekends, evenings, full-time collab" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Profile photo</span>
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
    <section className="page-container pt-5 md:pt-7">
      <div className="grid gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="page-surface rounded-[1.6rem] p-4 md:p-5">
          <div className="flex flex-col items-center text-center">
            <Avatar name={user?.name} image={user?.photo} size="xl" />
            <h1 className="h3 mt-4 text-slate-900">{user?.name || "Your profile"}</h1>
            <p className="mt-1.5 text-xs text-slate-500">{user?.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-800">
              <Sparkles size={13} />
              {profileStrength}% complete
            </div>
          </div>

          <div className="mt-4 grid gap-2.5 rounded-[1.2rem] bg-slate-50 p-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-accent-600" />
              {user?.location || "Delhi/NCR"}
            </div>
            <div className="flex items-center gap-2">
              <Camera size={14} className="text-secondary-600" />
              {user?.availability || "Add availability"}
            </div>
          </div>

          <div className="mt-6 chip-group">
            {(user?.roles || []).map((role) => (
              <Badge key={role} variant="secondary">{role}</Badge>
            ))}
          </div>
        </aside>

        <div className="page-surface rounded-[1.6rem] p-4 md:p-6">
          <div className="section-label">Profile</div>
          <h2 className="h2 mt-2 text-slate-900">Show people how you like to build</h2>
          <p className="mt-2.5 max-w-3xl text-sm leading-6 text-slate-600">
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
