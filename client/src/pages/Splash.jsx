import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const MotionDiv = motion.div;
  const MotionH1 = motion.h1;
  const MotionP = motion.p;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a3d88] via-[#2659a6] to-[#1685a9] flex flex-col items-center justify-center px-4 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <MotionDiv
        className="absolute top-14 left-5 w-56 h-56 bg-white/12 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <MotionDiv
        className="absolute bottom-14 right-2 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <MotionDiv
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <MotionDiv
          className="mb-4 inline-block"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Zap size={30} className="text-white" />
          </div>
        </MotionDiv>

        {/* Title */}
        <MotionH1
          className="font-display text-4xl md:text-5xl font-semibold mb-3 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          SkillSwipe
        </MotionH1>

        {/* Subtitle */}
        <MotionP
          className="text-base md:text-lg text-white/90 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Connect with Your Perfect Match
        </MotionP>

        {/* Description */}
        <MotionP
          className="text-sm md:text-base text-white/80 max-w-md mb-8 leading-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Swipe through professional profiles to network, hire, collaborate, and
          find your next opportunity.
        </MotionP>

        {/* Features */}
        <MotionDiv
          className="flex flex-col md:flex-row gap-3 justify-center mb-8 text-white/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">💼</span>
            <span>Jobs</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">🤝</span>
            <span>Networking</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">🚀</span>
            <span>Growth</span>
          </div>
        </MotionDiv>

        {/* CTA Buttons */}
        <MotionDiv
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/register")}
          >
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="text-white border-white/70 bg-white/10 hover:bg-white/20" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </MotionDiv>
      </MotionDiv>

      {/* Scroll indicator */}
      <MotionDiv
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </MotionDiv>
    </div>
  );
}
