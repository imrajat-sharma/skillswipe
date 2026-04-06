import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, MessageCircle } from "lucide-react";
import { SkillBadge } from "./SkillBadge";
import { Badge } from "./Badge";

export const SwipeDeck = ({
  cards = [],
  onPass,
  onLike,
  onMessage,
}) => {
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
      <div className="flex flex-col items-center justify-center h-96 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            No more profiles
          </p>
          <p className="text-gray-600">Come back later for more matches!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 md:h-[600px] cursor-grab active:cursor-grabbing">
      {/* Background card */}
      {nextCard && (
        <MotionDiv
          className="absolute inset-0 rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-soft"
          initial={{ scale: 0.95, y: 10, opacity: 0 }}
          animate={{ scale: 0.95, y: 10, opacity: 0.4 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100" />
        </MotionDiv>
      )}

      {/* Main card */}
      <AnimatePresence mode="wait">
        <MotionDiv
          key={currentIndex}
          className="absolute inset-0 rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-soft-lg cursor-grab active:cursor-grabbing"
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
            if (
              Math.abs(info.velocity.x) > 500 ||
              Math.abs(info.offset.x) > threshold
            ) {
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
          {/* Image */}
          <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
            {currentCard.image ? (
              <img
                src={currentCard.image}
                alt={currentCard.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-secondary-200" />
            )}
            {isLiked && (
              <MotionDiv
                className="absolute inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Heart className="w-20 h-20 text-green-500 fill-green-500" />
              </MotionDiv>
            )}
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            <div className="mb-2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {currentCard.name}
              </h3>
              <p className="text-gray-600">{currentCard.headline}</p>
            </div>

            {/* Skills */}
            {currentCard.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {currentCard.skills.slice(0, 4).map((skill, idx) => (
                  <SkillBadge key={idx} skill={skill} />
                ))}
              </div>
            )}
          </div>

          {/* Action hints */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs text-gray-500">
            <span>← Swipe left to Pass</span>
            <span>Swipe up for Chat →</span>
            <span>Swipe right to Like →</span>
          </div>
        </MotionDiv>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="absolute -bottom-20 md:-bottom-24 left-0 right-0 flex justify-center gap-3 md:gap-4">
        <MotionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSwipeLeft}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 transition-all shadow-soft hover:shadow-soft-lg"
        >
          <X size={24} />
        </MotionButton>
        <MotionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSwipeUp}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-secondary-500 text-white flex items-center justify-center hover:bg-secondary-600 transition-all shadow-soft hover:shadow-soft-lg"
        >
          <MessageCircle size={24} />
        </MotionButton>
        <MotionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSwipeRight}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white flex items-center justify-center hover:shadow-soft-lg transition-all shadow-soft"
        >
          <Heart size={24} fill="white" />
        </MotionButton>
      </div>
    </div>
  );
};
