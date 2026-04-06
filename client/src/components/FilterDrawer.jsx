import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders } from "lucide-react";
import { Button } from "./Button";

export const FilterDrawer = ({ isOpen, onClose, onApply }) => {
  const MotionDiv = motion.div;
  const [filters, setFilters] = useState({
    location: "",
    experience: "all",
    industry: "",
    skills: [],
    salary: [0, 200000],
  });

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Marketing",
    "Design",
    "Other",
  ];
  const experiences = ["Entry Level", "Mid Level", "Senior", "C-Suite"];

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[90vh] overflow-y-auto md:sticky md:top-0 md:h-auto md:border border-gray-200 md:rounded-xl md:p-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30 }}
          >
            <div className="p-6 md:p-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 md:hidden">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Experience Level
                </label>
                <div className="space-y-2">
                  {experiences.map((exp) => (
                    <label
                      key={exp}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={exp}
                        checked={filters.experience === exp}
                        onChange={(e) =>
                          setFilters({ ...filters, experience: e.target.value })
                        }
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-gray-700">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Industry
                </label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          industry: filters.industry === ind ? "" : ind,
                        })
                      }
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        filters.industry === ind
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Salary Range
                </label>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="10000"
                  value={filters.salary[1]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      salary: [filters.salary[0], parseInt(e.target.value)],
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>${filters.salary[0].toLocaleString()}</span>
                  <span>${filters.salary[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 md:border-0 md:pt-0">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setFilters({
                      location: "",
                      experience: "all",
                      industry: "",
                      skills: [],
                      salary: [0, 200000],
                    });
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    onApply(filters);
                    onClose();
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};
