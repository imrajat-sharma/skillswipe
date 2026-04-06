import React from "react";
import { Heart, MessageCircle, Share2, MapPin, Briefcase } from "lucide-react";
import { Avatar } from "./Avatar";
import { SkillBadge } from "./SkillBadge";
import { Badge } from "./Badge";

export const ProfileCard = ({
  profile,
  onLike,
  onSkip,
  onMessage,
  variant = "compact",
}) => {
  const {
    name,
    headline,
    image,
    location,
    skills = [],
    role,
    connections,
    matchPercentage,
    isPremium,
  } = profile;

  if (variant === "compact") {
    return (
      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-soft hover:shadow-soft-lg transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden group">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Avatar name={name} size="xl" />
            </div>
          )}
          {isPremium && (
            <Badge variant="accent" className="absolute top-4 right-4">
              💎 Premium
            </Badge>
          )}
          {matchPercentage && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <p className="text-sm font-bold text-primary-600">
                {matchPercentage}% Match
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-1">
              {name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{headline}</p>
          </div>

          {/* Meta */}
          <div className="space-y-2 mb-4 flex-1">
            {location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-primary-500" />
                <span>{location}</span>
              </div>
            )}
            {role && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase size={16} className="text-secondary-500" />
                <span>{role}</span>
              </div>
            )}
            {connections && (
              <p className="text-xs text-gray-500">
                {connections} common connections
              </p>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, idx) => (
                <SkillBadge key={idx} skill={skill} />
              ))}
              {skills.length > 3 && (
                <Badge variant="neutral">+{skills.length - 3}</Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={onSkip}
              className="flex-1 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>✕</span> Pass
            </button>
            <button
              onClick={onMessage}
              className="flex-1 py-2.5 rounded-lg bg-secondary-100 text-secondary-700 font-semibold hover:bg-secondary-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> Chat
            </button>
            <button
              onClick={onLike}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <Heart size={18} fill="white" /> Connect
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extended variant for profile view
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-soft">
      {/* Image banner */}
      {image && (
        <div className="h-96 md:h-full max-h-96 overflow-hidden bg-gray-200">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Profile info */}
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {name}
            </h2>
            <p className="text-lg text-gray-600 mb-3">{headline}</p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              {location && (
                <div className="flex items-center gap-1">
                  <MapPin size={18} className="text-primary-500" />
                  {location}
                </div>
              )}
              {role && (
                <div className="flex items-center gap-1">
                  <Briefcase size={18} className="text-secondary-500" />
                  {role}
                </div>
              )}
            </div>
          </div>
          {isPremium && <Badge variant="accent">💎 Premium</Badge>}
        </div>

        {/* Skills section */}
        {skills.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Top Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <SkillBadge key={idx} skill={skill} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
