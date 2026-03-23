const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return done(null, false, { message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (!email) {
            return done(new Error('Google account email is required.'));
          }

          let user = await User.findOne({ email });
          if (!user) {
            const generatedPassword = await bcrypt.hash(`${profile.id}-${Date.now()}`, 10);
            user = await User.create({
              email,
              password: generatedPassword,
              name: profile.displayName || email.split('@')[0],
              googleId: profile.id,
              photo: profile.photos?.[0]?.value || '',
              isProfileComplete: false,
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            if (!user.photo && profile.photos?.[0]?.value) {
              user.photo = profile.photos[0].value;
            }
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || false);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
