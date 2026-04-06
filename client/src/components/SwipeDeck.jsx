import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BriefcaseBusiness, Heart, MapPin, MessageCircle, X } from "lucide-react";
import { buildApiAssetUrl } from "../utils/formatters";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { SkillBadge } from "./SkillBadge";

export const SwipeDeck = ({ cards = [], onPass, onLike, onMessage }) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const MotionDiv = motion.div;
  const MotionButton = motion.button;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];

  const handleSwipeLeft = () => {
    setExitX(-300);
    onPass?.(currentCard);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
      setExitX(0);
      setIsLiked(false);
    }, 300);
  };

  const handleSwipeRight = () => {
    setExitX(300);
    setIsLiked(true);
    onLike?.(currentCard);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
      setExitX(0);
      setIsLiked(false);
    }, 300);
  };

  const handleSwipeUp = () => {
    onMessage?.(currentCard);
  };

  if (!currentCard) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-[1.8rem] border-2 border-dashed border-[var(--border-soft)] bg-[var(--surface-subtle)] md:h-[620px]">
        <div className="text-center">
          <p className="mb-2 text-lg font-semibold text-[var(--text-strong)]">No more profiles</p>
          <p className="text-[var(--text-muted)]">Come back later for more matches.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 md:h-[620px]">
      {nextCard && (
        <MotionDiv
          className="absolute inset-0 overflow-hidden rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface)] shadow-soft"
          initial={{ scale: 0.95, y: 10, opacity: 0 }}
          animate={{ scale: 0.95, y: 10, opacity: 0.4 }}
        >
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(247,98,98,0.14),_transparent_40%),linear-gradient(145deg,_var(--surface),_var(--surface-subtle))]" />
        </MotionDiv>
      )}

      <AnimatePresence mode="wait">
        <MotionDiv
          key={currentIndex}
          className="absolute inset-0 cursor-grab overflow-hidden rounded-[1.9rem] border border-[var(--border-soft)] bg-[var(--surface)] shadow-soft-lg active:cursor-grabbing"
          initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
          animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
          exit={{
            x: exitX,
            y: exitX !== 0 ? 0 : -200,
            opacity: 0,
            rotate: exitX > 0 ? 15 : exitX < 0 ? -15 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag
          dragConstraints={{ left: -200, right: 200, top: -200, bottom: 0 }}
          onDragEnd={(event, info) => {
            const threshold = 50;
            if (Math.abs(info.velocity.x) > 500 || Math.abs(info.offset.x) > threshold) {
              if (info.offset.x > threshold) {
                handleSwipeRight();
              } else if (info.offset.x < -threshold) {
                handleSwipeLeft();
              }
            }
            if (Math.abs(info.velocity.y) > 500 || info.offset.y < -threshold) {
              handleSwipeUp();
            }
          }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative h-72 w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(247,98,98,0.2),_transparent_32%),linear-gradient(180deg,_#ffdfd1,_#ffd9e7_55%,_#f4ecff)] md:h-[420px]">
            {currentCard.image ? (
              <img
                src={buildApiAssetUrl(currentCard.image, apiBaseUrl)}
                alt={currentCard.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Avatar name={currentCard.name} size="xl" />
              </div>
            )}
            {isLiked ? (
              <MotionDiv
                className="absolute inset-0 flex items-center justify-center bg-green-500/10 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Heart className="h-20 w-20 fill-green-500 text-green-500" />
              </MotionDiv>
            ) : null}
          </div>

          <div className="p-5 md:p-6">
            <div className="mb-2 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-strong)] md:text-2xl">{currentCard.name}</h3>
                <p className="mt-1 text-[var(--text-muted)]">{currentCard.headline}</p>
              </div>
              <Badge variant="accent">{currentCard.role || "Builder"}</Badge>
            </div>

            <div className="mt-4 grid gap-3 rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-subtle)] p-4 text-sm text-[var(--text-body)]">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-rose-500" />
                <span>{currentCard.location || "Location not added yet"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BriefcaseBusiness size={15} className="text-cyan-600" />
                <span>{currentCard.role || "Open to collaboration"}</span>
              </div>
            </div>

            {currentCard.skills?.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {currentCard.skills.slice(0, 4).map((skill, idx) => (
                  <SkillBadge key={idx} skill={skill} />
                ))}
              </div>
            ) : null}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80">
            <span>Pass</span>
            <span>Chat</span>
            <span>Like</span>
          </div>
        </MotionDiv>
      </AnimatePresence>

      <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-3 md:-bottom-24 md:gap-4">
        <MotionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSwipeLeft}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-body)] shadow-soft transition-all hover:shadow-soft-lg md:h-14 md:w-14"
        >
          <X size={24} />
        </MotionButton>
        <MotionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSwipeUp}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-white shadow-soft transition-all hover:bg-cyan-600 hover:shadow-soft-lg md:h-14 md:w-14"
        >
          <MessageCircle size={24} />
        </MotionButton>
        <MotionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSwipeRight}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-soft transition-all hover:shadow-soft-lg md:h-14 md:w-14"
        >
          <Heart size={24} fill="white" />
        </MotionButton>
      </div>
    </div>
  );
};
