# SkillSwipe

SkillSwipe is a production-style professional networking app for Delhi/NCR techies. It uses a Tinder-like swipe experience to help developers, designers, and AI enthusiasts discover mentors, mentees, and short-term collaborators.

## Stack

- Frontend: React 18, React Router v6, Context API, Vite, plain CSS/CSS modules
- Backend: Node.js, Express, Passport.js sessions, MongoDB, Mongoose, Multer
- Auth: Passport Local, optional Google OAuth
- Deployment: Vercel for the client, Render or Railway for the server

## Project Structure

```text
SkillSwipe/
  client/
    src/
      components/
        AppShell.jsx
        Loader.jsx
        ProfileCard.jsx
        ProtectedRoute.jsx
        SwipeCard.jsx
      context/
        AuthContext.jsx
      pages/
        Dashboard.jsx
        Landing.jsx
        Login.jsx
        Matches.jsx
        Profile.jsx
        Register.jsx
        Swipe.jsx
      styles/
        CardStack.module.css
        SwipeCard.module.css
      App.jsx
      App.css
      index.css
      main.jsx
    .env.example
    package.json
  server/
    config/
      passport.js
    middleware/
      isAuthenticated.js
    models/
      Match.js
      User.js
    routes/
      auth.js
      matches.js
      profile.js
      swipe.js
    uploads/
    .env.example
    package.json
    server.js
```

## Features

- Email/password registration and login with Passport Local
- Optional Google OAuth wiring in Passport
- Session-based auth with protected routes
- Forced profile completion before swiping
- Photo upload with Multer and local storage
- Cloudinary-ready profile uploads with local fallback when Cloudinary env vars are absent
- Multi-select roles: Mentor, Mentee, Collaborator
- Swipe deck with native pointer events, drag transforms, rotation, and skip/like overlays
- Recommendation scoring based on overlapping skills and role alignment
- Mutual-like matching flow with match records and starter messages
- Daily swipe limit simulation with dashboard visibility
- Responsive mobile-first UI

## Environment Variables

### Client: `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_API_HOST=http://localhost:5000
```

### Server: `server/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/skillswipe
SESSION_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SEED_DEFAULT_PASSWORD=skillswipe123
```

## Local Setup

1. Install dependencies:
   - `cd server && npm install`
   - `cd client && npm install`
2. Copy env examples:
   - `server/.env.example` to `server/.env`
   - `client/.env.example` to `client/.env`
3. Start MongoDB locally or point `MONGO_URI` at Atlas.
4. Run the backend:
   - `cd server && npm run dev`
5. Run the frontend:
   - `cd client && npm run dev`
6. Open `http://localhost:5173`

## Seed Demo Profiles

- Run `cd server && npm run seed`
- This seeds several Delhi/NCR mentor, mentee, and collaborator profiles into MongoDB
- Seeded demo accounts use `SEED_DEFAULT_PASSWORD` from `server/.env`

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/google`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/swipe/next`
- `POST /api/swipe/action`
- `GET /api/matches`

## Deployment Notes

### Frontend on Vercel

- Set `VITE_API_URL` to your deployed backend API URL plus `/api`
- Set `VITE_API_HOST` to your backend origin
- Build command: `npm run build`
- Output directory: `dist`

### Backend on Render or Railway

- Use `npm start`
- Set all env vars from `server/.env.example`
- Point `MONGO_URI` to MongoDB Atlas or another hosted MongoDB
- Ensure `CLIENT_URL` matches the deployed Vercel domain
- If using sessions cross-origin in production, keep cookie settings and CORS aligned with your final domains

## Notes

- Profile photos are stored locally in `server/uploads`; switch to Cloudinary later if you want persistent cloud media.
- If Cloudinary credentials are present, profile uploads are sent to Cloudinary and local temp files are cleaned up automatically.
- Google OAuth is optional. If Google env vars are omitted, email/password auth still works.
- Messaging is intentionally a placeholder in the match record rather than a full chat system.
