import { useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowRight, Camera, ChevronLeft, ChevronRight, Compass, Layers3, Sparkles } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/profileService";

const introSteps = [
  {
    title: "A mobile-first professional network",
    description: "The app starts with feed context, then guides people into discovery and live activity.",
    icon: Sparkles,
  },
  {
    title: "Swipe on fit, not on guesswork",
    description: "Your backend already ranks people by skills, roles, location, and availability.",
    icon: Compass,
  },
  {
    title: "Profile first, then the dashboard",
    description: "After signup, complete your profile so Feed, Discover, Activity, and Profile all unlock cleanly.",
    icon: Layers3,
  },
];

export default function Onboarding() {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formStep, setFormStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [form, setForm] = useState({
    bio: user?.bio || "",
    roles: (user?.roles || []).join(", "),
    skills: (user?.skills || []).join(", "),
    location: user?.location || "Delhi/NCR",
    pincode: user?.pincode || "",
    availability: user?.availability || "",
  });

  const profileSteps = useMemo(
    () => [
      {
        title: "Shape your first impression",
        description: "Add a concise bio plus the roles that describe how you want to connect.",
      },
      {
        title: "Add skills and location",
        description: "These fields map directly into discovery filters and ranking on the server.",
      },
      {
        title: "Finish with availability and photo",
        description: "Once saved, your profile becomes discoverable and the main dashboard takes over.",
      },
    ],
    [],
  );

  if (!loading && user?.isProfileComplete) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <main className="auth-scene px-4 py-5 md:px-6 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl items-center justify-center">
        <div className="glass-panel w-full rounded-[2rem] p-5 md:p-7 lg:p-8">
          {!user ? (
            <>
              <div className="section-label">Onboarding</div>
              <div className="mt-4 flex gap-1.5">
                {introSteps.map((_, index) => (
                  <div
                    key={index}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      background: index <= currentStep ? "linear-gradient(135deg, var(--primary), var(--accent))" : "var(--surface-subtle)",
                    }}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <Motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.22 }}
                  className="mt-6"
                >
                  <div className="brand-mark h-14 w-14">
                    {(() => {
                      const Icon = introSteps[currentStep].icon;
                      return <Icon size={22} />;
                    })()}
                  </div>
                  <h1 className="h2 mt-5">{introSteps[currentStep].title}</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
                    {introSteps[currentStep].description}
                  </p>
                </Motion.div>
              </AnimatePresence>

              <div className="mt-8 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((value) => Math.max(value - 1, 0))}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>
                {currentStep < introSteps.length - 1 ? (
                  <Button variant="primary" onClick={() => setCurrentStep((value) => Math.min(value + 1, introSteps.length - 1))}>
                    Next
                    <ChevronRight size={16} />
                  </Button>
                ) : (
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <Link to="/register">
                      <Button variant="primary">
                        Create account
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline">I already have an account</Button>
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="section-label">Profile setup</div>
              <h1 className="h2 mt-3">Finish onboarding before entering the dashboard</h1>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                This flow maps directly to `PUT /api/profile`, including image upload and comma-separated roles and skills.
              </p>

              <div className="mt-5 flex gap-1.5">
                {profileSteps.map((_, index) => (
                  <div
                    key={index}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      background: index <= formStep ? "linear-gradient(135deg, var(--primary), var(--accent))" : "var(--surface-subtle)",
                    }}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <Motion.div
                  key={formStep}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.22 }}
                  className="mt-6 grid gap-4"
                >
                  <div>
                    <h2 className="h3">{profileSteps[formStep].title}</h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{profileSteps[formStep].description}</p>
                  </div>

                  {formStep === 0 ? (
                    <>
                      <label className="grid gap-2">
                        <span className="text-xs font-semibold text-[var(--text-muted)]">Bio</span>
                        <textarea
                          className="textarea"
                          maxLength={200}
                          value={form.bio}
                          onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                          placeholder="What do you build, and what kind of connections are useful right now?"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-xs font-semibold text-[var(--text-muted)]">Roles</span>
                        <input
                          className="input"
                          value={form.roles}
                          onChange={(event) => setForm((current) => ({ ...current, roles: event.target.value }))}
                          placeholder="Mentor, Student, Collaborator"
                        />
                      </label>
                    </>
                  ) : null}

                  {formStep === 1 ? (
                    <>
                      <label className="grid gap-2">
                        <span className="text-xs font-semibold text-[var(--text-muted)]">Skills</span>
                        <input
                          className="input"
                          value={form.skills}
                          onChange={(event) => setForm((current) => ({ ...current, skills: event.target.value }))}
                          placeholder="React, Node.js, UI Design"
                        />
                      </label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-xs font-semibold text-[var(--text-muted)]">Location</span>
                          <input
                            className="input"
                            value={form.location}
                            onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                          />
                        </label>
                        <label className="grid gap-2">
                          <span className="text-xs font-semibold text-[var(--text-muted)]">Pincode</span>
                          <input
                            className="input"
                            value={form.pincode}
                            onChange={(event) => setForm((current) => ({ ...current, pincode: event.target.value }))}
                            placeholder="110001"
                          />
                        </label>
                      </div>
                    </>
                  ) : null}

                  {formStep === 2 ? (
                    <>
                      <label className="grid gap-2">
                        <span className="text-xs font-semibold text-[var(--text-muted)]">Availability</span>
                        <input
                          className="input"
                          value={form.availability}
                          onChange={(event) => setForm((current) => ({ ...current, availability: event.target.value }))}
                          placeholder="Weekends, evenings, async collaboration"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-xs font-semibold text-[var(--text-muted)]">Photo</span>
                        <div className="flex items-center gap-3 rounded-[1rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-3">
                          <Camera size={18} className="text-[var(--text-muted)]" />
                          <input type="file" accept="image/*" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} />
                        </div>
                      </label>
                    </>
                  ) : null}
                </Motion.div>
              </AnimatePresence>

              {error ? <div className="status-message error mt-4">{error}</div> : null}

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setFormStep((value) => Math.max(value - 1, 0))} disabled={formStep === 0 || saving}>
                  <ChevronLeft size={16} />
                  Back
                </Button>
                {formStep < profileSteps.length - 1 ? (
                  <Button variant="primary" onClick={() => setFormStep((value) => Math.min(value + 1, profileSteps.length - 1))}>
                    Next
                    <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    isLoading={saving}
                    onClick={async () => {
                      try {
                        setSaving(true);
                        setError("");
                        const nextUser = await updateProfile({
                          bio: form.bio,
                          roles: form.roles,
                          skills: form.skills,
                          location: form.location,
                          pincode: form.pincode,
                          availability: form.availability,
                          photo: photoFile,
                        });
                        setUser(nextUser);
                        navigate(nextUser.isProfileComplete ? "/feed" : "/profile", { replace: true });
                      } catch (saveError) {
                        setError(saveError.message);
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    Finish onboarding
                    <ArrowRight size={16} />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
