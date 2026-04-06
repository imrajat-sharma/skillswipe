const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const pinoHttp = require('pino-http');

const env = require('./config/env');
const logger = require('./config/logger');
const passport = require('./config/passport');
const { createSessionMiddleware } = require('./config/sessionStore');
const requestContext = require('./middleware/requestContext');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { standardRateLimiter } = require('./middleware/rateLimit');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const swipeRoutes = require('./routes/swipe');
const matchRoutes = require('./routes/matches');
const postRoutes = require('./routes/posts');

const createApp = async () => {
  const app = express();
  const sessionMiddleware = await createSessionMiddleware();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(requestContext);
  app.use(
    pinoHttp({
      logger,
      customProps: (req) => ({
        requestId: req.requestId,
        userId: req.user?._id?.toString(),
      }),
      customLogLevel(req, res, error) {
        if (error || res.statusCode >= 500) {
          return 'error';
        }
        if (res.statusCode >= 400) {
          return 'warn';
        }
        return 'info';
      },
    })
  );
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
  app.use(compression());
  app.use(standardRateLimiter);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.get('/api/health', (req, res) => {
    res.json({
      ok: true,
      service: 'SkillSwipe API',
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/ready', async (req, res) => {
    const mongoose = require('mongoose');
    const mongoReady = mongoose.connection.readyState === 1;

    if (!mongoReady) {
      return res.status(503).json({
        ok: false,
        checks: {
          mongodb: mongoReady,
        },
      });
    }

    return res.json({
      ok: true,
      checks: {
        mongodb: mongoReady,
      },
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/swipe', swipeRoutes);
  app.use('/api/matches', matchRoutes);
  app.use('/api/posts', postRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

module.exports = {
  createApp,
};
