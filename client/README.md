# SkillSwipe - Mobile-First React UI

A premium, modern UI for a professional networking platform (LinkedIn + Tinder hybrid) built with React 18, Tailwind CSS, and Framer Motion. Features gesture-based interactions, real-time notifications, and a polished design system.

## 🎯 Features

- **Swipe Discovery**: Gesture-based card swiping with drag detection
- **Smart Matching**: Profile recommendations with skill-based matching
- **Real-Time Chat**: Messaging interface with unread indicators
- **Opportunity Board**: Job, internship, and freelance gig listings
- **Activity Feed**: Notifications and connection requests
- **User Profiles**: Showcase skills, experience, and work history
- **Responsive Design**: Mobile-first, optimized for all screen sizes
- **Premium Animations**: Smooth transitions and micro-interactions

## 🛠️ Tech Stack

| Tool                | Purpose                                 |
| ------------------- | --------------------------------------- |
| **React 18.3**      | Component library with hooks            |
| **Vite**            | Lightning-fast build tool               |
| **Tailwind CSS 3**  | Utility-first styling with custom theme |
| **Framer Motion**   | Animations and gesture handling         |
| **React Router v6** | Client-side routing                     |
| **Lucide React**    | Premium icon library (200+ icons)       |
| **clsx**            | Conditional className helper            |
| **PostCSS**         | CSS processing pipeline                 |

## 📦 Installation

### Prerequisites

- Node.js 16+ and npm 7+

### Setup

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components (15 total)
│   ├── Button.jsx       # Primary CTA button with variants
│   ├── Badge.jsx        # Color badges with icon support
│   ├── Avatar.jsx       # User avatars with fallback
│   ├── Card.jsx         # Base card container
│   ├── ProfileCard.jsx  # Profile display (2 variants)
│   ├── SwipeDeck.jsx    # Gesture-based swipe (Framer Motion)
│   ├── SkillBadge.jsx   # Skill tags with verification
│   ├── Modal.jsx        # Animated dialog modal
│   ├── Tabs.jsx         # Tab interface
│   ├── TopNav.jsx       # App header with notifications
│   ├── BottomNav.jsx    # Mobile bottom nav (5 items)
│   ├── FilterDrawer.jsx # Experience/industry/salary filter
│   ├── OpportunityCard.jsx # Job listing card
│   ├── ChatListItem.jsx # Chat preview in list
│   ├── LoadingSpinner.jsx
│   ├── EmptyState.jsx   # Placeholder for empty states
│   └── index.js         # Barrel exports
├── pages/               # Application screens (12 total)
│   ├── Splash.jsx       # Landing with animated intro
│   ├── Onboarding.jsx   # 5-step feature walkthrough
│   ├── Auth.jsx         # Login/Register form
│   ├── Swipe.jsx        # Main discovery w/ SwipeDeck
│   ├── Matches.jsx      # Match management with tabs
│   ├── Chat.jsx         # Messaging interface
│   ├── Profile.jsx      # User profile showcase
│   ├── Opportunities.jsx # Job/opportunity board
│   ├── Notifications.jsx # Activity feed
│   ├── Settings.jsx     # User preferences
│   ├── Login.jsx        # Auth wrapper (mode: login)
│   └── Register.jsx     # Auth wrapper (mode: register)
├── context/             # React context (auth, theme, etc.)
├── utils/
│   ├── helpers.js       # 8 utility functions
│   ├── dummyData.js     # Mock data for development
│   └── cache.js         # Caching utilities
├── styles/              # CSS modules for specific screens
│   ├── CardStack.module.css
│   └── SwipeCard.module.css
├── App.jsx              # Router configuration
├── App.css              # Global animations
├── index.css            # Tailwind & typography
└── main.jsx             # React entry point
```

## 🎨 Design System

### Color Palette

```js
// Primary (Indigo)
primary-50 (#f0f4ff) → primary-900 (#312e81)
primary-600 (#4f46e5) // Brand color

// Secondary (Violet)
secondary-50 (#f5f3ff) → secondary-900 (#581c87)
secondary-600 (#9333ea)

// Accent (Pink)
accent-50 (#fdf2f8) → accent-900 (#831843)
accent-600 (#ec4899)
```

### Shadows

- **soft**: Subtle shadows for cards
- **soft-md, soft-lg, soft-xl**: Progressive shadow intensities
- **glow-primary, glow-secondary**: Ambient glow effects

### Animations

- **fadeIn**: Opacity 0→1 (300ms)
- **slideUp/slideDown**: Y-axis translations (400ms)
- **pulseSoft**: Gentle pulse effect
- **swipeLeft/Right/Up**: CSS keyframes for card exit (300ms)

### Typography

- **h1-h6**: Heading classes with size/weight
- **subtitle**: Secondary text (14px, 500 weight)
- **body-sm, body-xs**: Small text variants
- **Font**: Inter for body, Cal Sans for display

## 🎬 Animation Patterns

### Swipe Gesture (SwipeDeck Component)

```jsx
<motion.div
  drag
  dragConstraints={{ left: -200, right: 200, top: -200, bottom: 0 }}
  onDragEnd={(event, info) => {
    if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 500) {
      // Swipe left or right
    }
  }}
>
  {/* Card content */}
</motion.div>
```

### Page Transitions

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Page content */}
</motion.div>
```

### Staggered List

```jsx
<motion.div>
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
    >
      {/* Item */}
    </motion.div>
  ))}
</motion.div>
```

## 📱 Responsive Breakpoints

- **Mobile**: Default (< 640px)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)

Example:

```jsx
<div className="w-full md:w-1/2 lg:w-1/3">Responsive layout</div>
```

## 🚀 Screens Overview

| Screen         | Route            | Purpose                   |
| -------------- | ---------------- | ------------------------- |
| Splash         | `/`              | Landing page with CTA     |
| Onboarding     | `/onboarding`    | 5-step feature tour       |
| Login          | `/login`         | Auth form (login mode)    |
| Register       | `/register`      | Auth form (register mode) |
| Swipe/Discover | `/discover`      | Main swiping interface    |
| Matches        | `/matches`       | Connection management     |
| Chat           | `/chat`          | Messaging interface       |
| Profile        | `/profile`       | User profile showcase     |
| Opportunities  | `/opportunities` | Job/gig board             |
| Notifications  | `/notifications` | Activity feed             |
| Settings       | `/settings`      | Preferences & settings    |

## 💡 Usage Examples

### Using Button Component

```jsx
import { Button } from './components';

<Button variant="primary" size="lg" onClick={handleClick}>
  Get Started
</Button>

<Button variant="secondary" disabled>
  Disabled State
</Button>

<Button isLoading>
  Loading...
</Button>
```

### Using ProfileCard

```jsx
import { ProfileCard } from "./components";

<ProfileCard
  profile={userProfile}
  variant="compact"
  onConnect={handleConnect}
/>;
```

### Using SwipeDeck

```jsx
import { SwipeDeck } from "./components";

<SwipeDeck
  cards={cardData}
  onSwipeLeft={handlePass}
  onSwipeRight={handleLike}
/>;
```

### Framer Motion Page Transition

```jsx
import { motion } from "framer-motion";

export default function MyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page content */}
    </motion.div>
  );
}
```

## 🔗 Routing

All routes are defined in [src/App.jsx](src/App.jsx):

```jsx
<Routes>
  <Route path="/" element={<Splash />} />
  <Route path="/onboarding" element={<Onboarding />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/discover" element={<Swipe />} />
  <Route path="/matches" element={<Matches />} />
  <Route path="/chat" element={<Chat />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/opportunities" element={<Opportunities />} />
  <Route path="/notifications" element={<Notifications />} />
  <Route path="/settings" element={<Settings />} />
</Routes>
```

## 📊 Dummy Data

Mock data is provided in [src/utils/dummyData.js](src/utils/dummyData.js):

- **profiles**: 5 user profiles with skills, images, match percentages
- **opportunities**: 3 job/internship/freelance listings
- **chats**: 3 conversation previews
- **notifications**: 3 activity feed items

Replace with real API calls by modifying the page components.

## 🔄 API Integration

To connect to the backend server, update page components to use API endpoints instead of dummy data:

```jsx
// Before: Using dummy data
import { dummyProfiles } from "../utils/dummyData";

// After: Using API
const fetchProfiles = async () => {
  const response = await fetch("/api/profiles");
  return response.json();
};
```

See [../server/README.md](../server/README.md) for backend API documentation.

## 🎯 Component Best Practices

1. **Props Interface**: All components have clear prop interfaces documented
2. **Variants Pattern**: Use `variant` prop for component styles
3. **Compound Components**: Modal, Tabs use children pattern for composition
4. **Accessibility**: Semantic HTML, aria labels where needed
5. **Performance**: Memoization for heavy components, efficient animations

## 🏗️ Building for Production

```bash
# Build optimized production bundle
npm run build

# Output directory: dist/

# Analyze bundle size (if using vite-plugin-visualizer)
npm run preview
```

## 📚 Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Router Docs](https://reactrouter.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Vite Docs](https://vitejs.dev/)

## 📝 Component Guide

For detailed component documentation, see [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md).

## 🤝 Contributing

1. Follow the component structure in `src/components/`
2. Use Tailwind CSS utilities (no inline styles)
3. Add animations using Framer Motion for consistency
4. Test responsive design on mobile devices
5. Document new components with prop interfaces

## 📄 License

Part of the SkillSwipe project.
