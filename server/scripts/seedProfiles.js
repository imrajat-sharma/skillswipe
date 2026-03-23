require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const demoProfiles = [
  {
    name: 'Aarav Mehta',
    email: 'aarav.mehta@skillswipe.demo',
    roles: ['Mentor', 'Collaborator'],
    bio: 'Senior React engineer in Gurgaon helping early-stage teams ship clean frontend systems and mentor junior developers.',
    skills: ['React', 'TypeScript', 'Node.js', 'System Design'],
    location: 'Gurgaon, Delhi/NCR',
    pincode: '122002',
    availability: 'Weekends only',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ishita Rao',
    email: 'ishita.rao@skillswipe.demo',
    roles: ['Collaborator'],
    bio: 'Product designer from South Delhi exploring AI-first interfaces and open to short mobile app collaborations.',
    skills: ['UI/UX', 'Product Design', 'Figma', 'AI/ML'],
    location: 'South Delhi, Delhi/NCR',
    pincode: '110017',
    availability: 'Evenings',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Kunal Bansal',
    email: 'kunal.bansal@skillswipe.demo',
    roles: ['Mentee', 'Collaborator'],
    bio: 'Node and backend learner in Noida looking for mentorship on APIs, MongoDB modeling, and production practices.',
    skills: ['Node.js', 'Express', 'MongoDB', 'JavaScript'],
    location: 'Noida, Delhi/NCR',
    pincode: '201301',
    availability: 'Weekends only',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Rhea Sethi',
    email: 'rhea.sethi@skillswipe.demo',
    roles: ['Mentor'],
    bio: 'AI engineer based in Faridabad mentoring builders who want to move from tutorials to real machine learning projects.',
    skills: ['Python', 'AI/ML', 'MLOps', 'Data Science'],
    location: 'Faridabad, Delhi/NCR',
    pincode: '121001',
    availability: 'Full-time collab',
    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dev Malhotra',
    email: 'dev.malhotra@skillswipe.demo',
    roles: ['Mentee', 'Collaborator'],
    bio: 'Full-stack builder from Ghaziabad eager to join short product sprints and level up on React plus backend integration.',
    skills: ['React', 'Node.js', 'Postman', 'MongoDB'],
    location: 'Ghaziabad, Delhi/NCR',
    pincode: '201001',
    availability: 'Evenings',
    photo: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sana Khan',
    email: 'sana.khan@skillswipe.demo',
    roles: ['Mentor', 'Collaborator'],
    bio: 'Frontend architect in New Delhi who enjoys mentoring designers moving into code and helping teams polish motion and accessibility.',
    skills: ['React', 'Accessibility', 'UI/UX', 'CSS'],
    location: 'New Delhi, Delhi/NCR',
    pincode: '110001',
    availability: 'Weekends only',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
  },
];

async function seedProfiles() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash(process.env.SEED_DEFAULT_PASSWORD || 'skillswipe123', 10);

  for (const profile of demoProfiles) {
    await User.findOneAndUpdate(
      { email: profile.email },
      {
        $set: {
          ...profile,
          password: hashedPassword,
          isProfileComplete: true,
          swipedUsers: [],
          likedUsers: [],
          swipesToday: 0,
          dailySwipeLimit: 10,
          lastSwipeDate: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${demoProfiles.length} Delhi/NCR demo profiles.`);
  await mongoose.disconnect();
}

seedProfiles().catch(async (error) => {
  console.error('Seeding failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
