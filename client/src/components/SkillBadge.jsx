import React from "react";

export const SkillBadge = ({ skill, endorsements = 0, verified = false }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 hover:border-primary-300 transition-all cursor-pointer group">
      <span className="text-sm font-semibold text-primary-700 group-hover:text-primary-800">
        {skill}
      </span>
      {verified && (
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500">
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
      {endorsements > 0 && (
        <span className="ml-1 text-xs font-medium text-gray-600">
          +{endorsements}
        </span>
      )}
    </div>
  );
};
