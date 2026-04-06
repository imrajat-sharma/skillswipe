import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Filter } from "lucide-react";
import { TopNav } from "../components/TopNav";
import { BottomNav } from "../components/BottomNav";
import { OpportunityCard } from "../components/OpportunityCard";
import { Button } from "../components/Button";
import { Tabs } from "../components/Tabs";

const dummyOpportunities = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "Google",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$150k - $200k",
    description:
      "We're looking for an experienced product designer to lead our design team...",
    skills: ["UI/UX", "Figma", "Design Systems", "Leadership"],
    deadline: "2024-12-31",
  },
  {
    id: 2,
    title: "Freelance React Developer",
    company: "Startup XYZ",
    location: "Remote",
    type: "freelance",
    salary: "$60 - $80/hr",
    description:
      "Looking for an experienced React developer for a 3-month project...",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    deadline: "2024-12-15",
  },
  {
    id: 3,
    title: "Product Management Internship",
    company: "Tech Startup",
    location: "San Francisco, CA",
    type: "internship",
    salary: "Competitive",
    description:
      "Join our PM team and learn product management from experienced leaders...",
    skills: ["Product Strategy", "Analytics", "Communication"],
    deadline: "2024-12-10",
  },
];

export default function Opportunities() {
  const MotionDiv = motion.div;
  const [filterOpen, setFilterOpen] = useState(false);

  const tabsData = [
    {
      label: "For You",
      icon: Briefcase,
      content: (
        <div className="mt-6 space-y-4">
          {dummyOpportunities.map((opp, idx) => (
            <MotionDiv
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <OpportunityCard
                opportunity={opp}
                onApply={() => console.log("Apply:", opp.title)}
                onSave={() => console.log("Save:", opp.title)}
              />
            </MotionDiv>
          ))}
        </div>
      ),
    },
    {
      label: "Saved",
      icon: null,
      content: (
        <div className="mt-6 space-y-4">
          {dummyOpportunities.slice(0, 1).map((opp, idx) => (
            <MotionDiv
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <OpportunityCard
                opportunity={opp}
                onApply={() => console.log("Apply:", opp.title)}
                onSave={() => console.log("Save:", opp.title)}
              />
            </MotionDiv>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <div className="page-container pt-6 md:pt-8">
        {/* Header */}
        <MotionDiv
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="h2 text-gray-900 mb-2">Opportunities</h1>
          <p className="text-gray-600">
            Jobs, internships, freelance gigs, and mentorships
          </p>
        </MotionDiv>

        {/* Filter Button */}
        <MotionDiv
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="outline"
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2"
          >
            <Filter size={18} />
            Filters
          </Button>
        </MotionDiv>

        {/* Tabs */}
        <Tabs tabs={tabsData} defaultTab={0} />
      </div>

      <BottomNav />
    </div>
  );
}
