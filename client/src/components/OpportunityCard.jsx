import React from "react";
import { Briefcase, MapPin, DollarSign } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";

export const OpportunityCard = ({ opportunity, onApply, onSave }) => {
  const {
    title,
    company,
    location,
    type,
    salary,
    description,
    skills,
    deadline,
  } = opportunity;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600">{company}</p>
        </div>
        <Badge variant={type === "full-time" ? "primary" : "secondary"}>
          {type}
        </Badge>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 md:gap-4 text-sm text-gray-600 mb-4">
        {location && (
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-primary-500" />
            {location}
          </div>
        )}
        {salary && (
          <div className="flex items-center gap-1">
            <DollarSign size={16} className="text-green-500" />
            {salary}
          </div>
        )}
        <div className="flex items-center gap-1">
          <Briefcase size={16} className="text-secondary-500" />
          {type}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{description}</p>

      {/* Skills */}
      {skills?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <Badge key={skill} variant="neutral" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Deadline */}
      {deadline && (
        <p className="text-xs text-gray-500 mb-4">
          Apply by {new Date(deadline).toLocaleDateString()}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <Button variant="outline" size="sm" onClick={onSave} className="flex-1">
          Save
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onApply}
          className="flex-1"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
