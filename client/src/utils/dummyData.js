// Dummy matching data for profiles
export const profiles = [
  {
    id: 1,
    name: "Sarah Johnson",
    headline: "Senior Product Designer at Google",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
    location: "San Francisco, CA",
    role: "Product Designer",
    skills: ["UI/UX", "Figma", "Design Systems", "User Research"],
    connections: 5,
    matchPercentage: 95,
    isPremium: true,
    bio: "Passionate about user-centered design and building beautiful experiences.",
  },
  {
    id: 2,
    name: "Alex Chen",
    headline: "Full-Stack Developer at Meta",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    location: "Menlo Park, CA",
    role: "Full-Stack Engineer",
    skills: ["React", "Node.js", "Python", "AWS"],
    connections: 12,
    matchPercentage: 88,
    bio: "Building scalable web applications with modern tech stacks.",
  },
  {
    id: 3,
    name: "Emma Davis",
    headline: "Marketing Manager at Stripe",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop",
    location: "San Francisco, CA",
    role: "Marketing Manager",
    skills: ["Growth Strategy", "Analytics", "Content", "Leadership"],
    connections: 8,
    matchPercentage: 92,
    isPremium: true,
    bio: "Driving growth through data-driven marketing strategies.",
  },
  {
    id: 4,
    name: "James Wilson",
    headline: "Data Scientist at OpenAI",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    location: "San Francisco, CA",
    role: "Data Scientist",
    skills: ["Machine Learning", "Python", "Deep Learning", "Statistics"],
    connections: 15,
    matchPercentage: 91,
    bio: "Exploring the frontiers of AI and machine learning.",
  },
];

// Dummy opportunities for job board
export const opportunities = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "Google",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$150k - $200k",
    description:
      "We're looking for an experienced product designer to lead our design team and shape the future of our products.",
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
      "Looking for an experienced React developer for a 3-month project building our new dashboard.",
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
      "Join our PM team and learn product management from experienced leaders in a high-growth startup.",
    skills: ["Product Strategy", "Analytics", "Communication"],
    deadline: "2024-12-10",
  },
];

// Dummy chat conversations
export const chats = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    lastMessage: "That sounds great! Let's connect soon",
    timestamp: "2m ago",
    unreadCount: 2,
    status: "online",
  },
  {
    id: 2,
    name: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    lastMessage: "I'd love to collaborate on that project",
    timestamp: "1h ago",
    unreadCount: 0,
    status: "online",
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    lastMessage: "Thanks for the opportunity!",
    timestamp: "3h ago",
    unreadCount: 0,
    status: "offline",
  },
];

// Notifications feed
export const notifications = [
  {
    id: 1,
    type: "match",
    message: "You matched with Sarah Johnson!",
    timestamp: "2024-01-10T14:30:00Z",
    read: false,
  },
  {
    id: 2,
    type: "message",
    message: "Alex Chen sent you a message",
    timestamp: "2024-01-10T09:00:00Z",
    read: false,
  },
  {
    id: 3,
    type: "opportunity",
    message: "New job opportunity: Senior Designer at Google",
    timestamp: "2024-01-09T16:45:00Z",
    read: true,
  },
];
