# SkillSwipe - Modern Mobile-First React UI

A polished, premium UI/UX for a professional networking and job discovery platform combining LinkedIn professionalism with Tinder simplicity.

## 🎨 Design System

### Colors

- **Primary**: Indigo/Blue (`#4f46e5` - `#3730a3`)
- **Secondary**: Purple (`#9333ea` - `#7e22ce`)
- **Accent**: Pink (`#ec4899` - `#be185d`)
- **Neutral**: Gray scale with premium shadows

### Typography

- **Headings**: Cal Sans (display font)
- **Body**: Inter (clean, modern)
- **Sizes**: Sm (12px), Base (14px), Lg (16px), Xl (20px), 2xl (24px), 3xl (30px), 4xl (36px)

### Components

- **Button**: Primary, Secondary, Outline, Ghost, Success variants with Sm, Md, Lg sizes
- **Badge**: Multiple color variants with optional icons
- **Avatar**: Support for images with fallback initials, multiple sizes
- **Card**: Hover effects, soft shadows for premium feel
- **Input**: Accessible with icons, error states
- **Modal**: Animated overlay with smooth transitions
- **Tabs**: Icon support, smooth tab switching
- **Loading**: Spinner with smooth animation

## 📱 Screens

### 1. **Splash** (`/`)

- Animated gradient background
- 3D rotating logo animation
- Feature highlights
- CTA buttons to get started

### 2. **Onboarding** (`/onboarding`)

- 5-step carousel with progress bar
- Smooth fade-in/slide-in transitions
- Feature highlights with emojis
- Skip/Next/Complete flow

### 3. **Login/Register** (`/login`, `/register`)

- Clean form with icon inputs
- Password visibility toggle
- Social login buttons
- Toggle between modes

### 4. **Discover** (`/discover`)

- Interactive swipe deck with drag gestures
- Profile cards with match percentage
- Action buttons: Pass, Chat, Connect
- Filter drawer with mobileresponsive design
- Live stats: Connected, Passed, Match Rate

### 5. **Matches** (`/matches`)

- Recent, Favorites, Mutual tabs
- Compact profile cards
- Empty states for better UX
- Framer Motion animations

### 6. **Chat** (`/chat`)

- List of conversations with unread badges
- Real-time message view
- Message input with send button
- Online status indicators
- Responsive split layout

### 7. **Profile** (`/profile`)

- Cover photo with gradient
- Profile header with edit mode
- Skills showcase
- Stats: Connections, Profile Views
- About and Activity tabs

### 8. **Opportunities** (`/opportunities`)

- Job listings with company info
- Filter by type (Full-time, Freelance, Internship)
- Required skills display
- Apply/Save actions
- For You and Saved tabs

### 9. **Notifications** (`/notifications`)

- Activity feed with emoji indicators
- Unread badge for new notifications
- Timestamps
- Settings button

### 10. **Settings** (`/settings`)

- Dark mode toggle
- Account settings
- Privacy & notifications
- Sign out button

## 🧩 Component Structure

```
src/
├── components/
│   ├── Avatar.jsx              # User avatars with initials
│   ├── Badge.jsx               # Flexible badge component
│   ├── BottomNav.jsx           # Mobile bottom navigation
│   ├── Button.jsx              # Reusable button with variants
│   ├── Card.jsx                # Base card component
│   ├── ChatListItem.jsx        # Chat list item
│   ├── EmptyState.jsx          # Empty state placeholder
│   ├── FilterDrawer.jsx        # Filter modal/drawer
│   ├── LoadingSpinner.jsx      # Loading indicator
│   ├── Modal.jsx               # Animated modal
│   ├── OpportunityCard.jsx     # Job/opportunity card
│   ├── ProfileCard.jsx         # Profile display
│   ├── SkillBadge.jsx          # Skill badge with verification
│   ├── SwipeDeck.jsx           # Swipe gesture handler
│   ├── Tabs.jsx                # Tabbed interface
│   ├── TopNav.jsx              # App header
│   └── index.js                # Component exports
├── pages/
│   ├── Auth.jsx                # Login/Register
│   ├── Chat.jsx                # Chat screen
│   ├── Notifications.jsx       # Notifications
│   ├── Onboarding.jsx          # Onboarding flow
│   ├── Opportunities.jsx       # Jobs/opportunities
│   ├── Profile.jsx             # User profile
│   ├── Settings.jsx            # Settings
│   ├── Splash.jsx              # Splash screen
│   ├── Swipe.jsx               # Discover/swipe
│   └── Matches.jsx             # Matches list
├── App.jsx                      # Main router
├── App.css                      # Global animations
├── index.css                    # Tailwind + custom styles
├── tailwind.config.js           # Tailwind configuration
└── postcss.config.js            # PostCSS configuration
```

## 🎬 Animations & Interactions

### Framer Motion Features

- **Page Transitions**: Fade in on load
- **Swipe Gestures**: Drag-based card swiping
- **Wave Animations**: Rotating logos
- **Stagger Effects**: List item animations
- **Modal Pop-ins**: Scale with fade
- **Hover Effects**: Subtle scale on buttons/cards

### CSS Animations

- **Pulse effects**: Subtle breathing animation
- **Slide animations**: Entry/exit transitions
- **Fade animations**: Smooth opacity changes
- **Swipe animations**: Left/right/up swipes

## 📦 Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize color palette:

```js
colors: {
  primary: { ... },
  secondary: { ... },
  accent: { ... },
}
```

### Typography

Modify font family in tailwind config:

```js
fontFamily: {
  sans: ['Inter', 'system-ui'],
  display: ['Cal Sans', 'system-ui'],
}
```

### Spacing

Adjust padding/margin defaults in tailwind theme.

## 🚀 Key Features

✅ **Mobile-First Design**: Optimized for small screens first
✅ **Responsive Breakpoints**: Md (768px), Lg (1024px), Xl (1280px)
✅ **Accessibility**: ARIA labels, keyboard navigation, color contrast
✅ **Performance**: Lazy loading, optimized images, code splitting
✅ **Animations**: Smooth transitions with Framer Motion
✅ **Dark Mode Ready**: Toggle-enabled settings
✅ **Dummy Data**: Realistic profiles and opportunities
✅ **Production-Ready**: Clean code, proper error handling

## 🔧 Technologies

- **React 18**: Latest features with hooks
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Lucide React**: Beautiful icons
- **Clsx**: Conditional class names
- **CVA**: Component variants

## 📝 Usage Examples

### Using the SwipeDeck

```jsx
<SwipeDeck
  cards={profiles}
  onLike={handleLike}
  onPass={handlePass}
  onMessage={handleMessage}
/>
```

### Using Tabs

```jsx
const tabs = [
  { label: "Recent", content: <RecentComponent /> },
  { label: "Saved", content: <SavedComponent /> },
];
<Tabs tabs={tabs} defaultTab={0} onChange={handleTabChange} />;
```

### Using Modal

```jsx
<Modal isOpen={isOpen} onClose={handleClose} title="Connect" size="md">
  Content here
</Modal>
```

## 🎯 Performance Tips

1. **Image Optimization**: Use next/image or optimization service
2. **Code Splitting**: Route-based lazy loading
3. **Memoization**: Prevent unnecessary re-renders
4. **Debouncing**: Smooth search/filter interactions
5. **Virtual Lists**: For long lists of matches/chats

## 🔐 Security Considerations

- Sanitize user input
- Validate form data
- Use HTTPS for API calls
- Implement rate limiting
- Store auth tokens securely

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Create feature branches
2. Follow component patterns
3. Test responsive design
4. Update documentation

## 📄 License

MIT License - feel free to use in your projects!

---

**Built with ❤️ for modern professionals**
