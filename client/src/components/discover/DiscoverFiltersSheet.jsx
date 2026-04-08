import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { Button } from "../Button";
const sheetVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: "100%", opacity: 0 },
};

export function DiscoverFiltersSheet({
  open,
  filters,
  filterOptions,
  onClose,
  onChange,
  onToggle,
  onApply,
  onReset,
}) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <Motion.button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <Motion.div
            className="absolute inset-x-0 bottom-0 rounded-t-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-soft-lg"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
          >
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[var(--border-soft)]" />

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">Filters</p>
                <h3 className="mt-1 text-lg font-bold text-[var(--text-strong)]">Tune your discover queue</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[var(--surface-subtle)] p-2 text-[var(--text-muted)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid gap-4 max-h-[65vh] overflow-y-auto pr-1">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">Search</span>
                <div className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" />
                  <input
                    className="input pl-10"
                    value={filters.search}
                    onChange={(event) => onChange("search", event.target.value)}
                    placeholder="Name, skills, bio..."
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">Location</span>
                <select
                  className="select"
                  value={filters.location}
                  onChange={(event) => onChange("location", event.target.value)}
                >
                  <option value="">Any location</option>
                  {filterOptions.locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">Availability</span>
                <select
                  className="select"
                  value={filters.availability}
                  onChange={(event) => onChange("availability", event.target.value)}
                >
                  <option value="">Any availability</option>
                  {filterOptions.availability.map((availability) => (
                    <option key={availability} value={availability}>
                      {availability}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">Pincode</span>
                <select
                  className="select"
                  value={filters.pincode}
                  onChange={(event) => onChange("pincode", event.target.value)}
                >
                  <option value="">Any pincode</option>
                  {filterOptions.pincodes.map((pincode) => (
                    <option key={pincode} value={pincode}>
                      {pincode}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">Roles</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {filterOptions.roles.map((role) => {
                    const active = filters.roles.includes(role);

                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => onToggle("roles", role)}
                        className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                          active
                            ? "bg-[var(--text-strong)] text-white shadow-soft"
                            : "bg-[var(--surface-subtle)] text-[var(--text-muted)]"
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">Skills</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {filterOptions.skills.slice(0, 12).map((skill) => {
                    const active = filters.skills.includes(skill);

                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => onToggle("skills", skill)}
                        className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                          active
                            ? "bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-soft"
                            : "bg-[var(--surface-subtle)] text-[var(--text-muted)]"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onReset}>
                <ChevronDown size={16} />
                Reset
              </Button>
              <Button type="button" variant="primary" className="flex-1" onClick={onApply}>
                <Filter size={16} />
                Apply
              </Button>
            </div>
          </Motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
