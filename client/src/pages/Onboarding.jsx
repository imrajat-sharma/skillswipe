import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

const onboardingSteps = [
  {
    title: "Welcome to SkillSwipe",
    description:
      "Discover innovative ways to connect with professionals who match your goals.",
    icon: "🎯",
  },
  {
    title: "Smart Matching",
    description:
      "Our AI learns your preferences to show you the perfect professional connections.",
    icon: "🤖",
  },
  {
    title: "Real Opportunities",
    description:
      "Find jobs, internships, freelance gigs, and mentorship from top companies.",
    icon: "💼",
  },
  {
    title: "Network & Grow",
    description:
      "Chat with matches, collaborate on projects, and expand your professional network.",
    icon: "🚀",
  },
  {
    title: "Your Profile Matters",
    description:
      "Create an impressive profile to attract the right opportunities and connections.",
    icon: "⭐",
  },
];

export default function Onboarding() {
  const MotionDiv = motion.div;
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const step = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Progress bar */}
      <div className="w-full max-w-md mb-12">
        <div className="flex gap-1.5">
          {onboardingSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                idx <= currentStep ? "bg-primary-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <MotionDiv
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="text-7xl mb-6 flex justify-center">{step.icon}</div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {step.description}
            </p>
          </MotionDiv>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() =>
              setCurrentStep(
                Math.min(onboardingSteps.length - 1, currentStep + 1),
              )
            }
            disabled={currentStep === onboardingSteps.length - 1}
            className="flex-1 py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* CTA */}
        {currentStep === onboardingSteps.length - 1 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </MotionDiv>
        )}

        {/* Step indicator */}
        <p className="text-center text-sm text-gray-600 mt-6">
          {currentStep + 1} of {onboardingSteps.length}
        </p>
      </div>
    </div>
  );
}
