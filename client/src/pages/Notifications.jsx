import { BellRing, Heart, Sparkles, Users } from "lucide-react";
import { Badge } from "../components/Badge";
import { useAuth } from "../context/AuthContext";

export default function Notifications() {
  const { user } = useAuth();

  const items = [
    {
      id: "profile",
      icon: Sparkles,
      title: user?.isProfileComplete ? "Your profile is discoverable" : "Complete your profile",
      body: user?.isProfileComplete
        ? "You can now appear in the discover queue and make the most of your daily swipes."
        : "Add your photo, skills, roles, bio, and availability to unlock discover mode.",
      status: user?.isProfileComplete ? "Live" : "Action needed",
    },
    {
      id: "swipes",
      icon: Heart,
      title: `${user?.swipesLeftToday ?? 0} swipes left today`,
      body: "Use your limited daily swipes on people whose skills and intent line up with what you want next.",
      status: "Daily rhythm",
    },
    {
      id: "community",
      icon: Users,
      title: "Community posting is active",
      body: "Share text updates, image drops, and polls from the home feed to build context before a match starts.",
      status: "New",
    },
  ];

  return (
    <section className="page-container pt-8">
      <div className="page-surface rounded-[2.25rem] p-6 md:p-8">
        <div className="section-label">Notifications</div>
        <h1 className="h2 mt-3 text-slate-900">Important account signals</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          This screen is still lightweight, but it now reflects real account state instead of dummy content.
        </p>

        <div className="mt-8 grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="rounded-2xl bg-primary-100 p-3 text-primary-700">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-900">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                  </div>
                </div>
                <Badge variant="primary">{item.status}</Badge>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-slate-900 p-5 text-white">
          <div className="flex items-center gap-2 text-white/80">
            <BellRing size={18} />
            <span className="text-sm font-semibold uppercase tracking-[0.16em]">Next step</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/75">
            When we tackle the next client pass, this page is ready for real match, post, and follow notifications from the backend.
          </p>
        </div>
      </div>
    </section>
  );
}
