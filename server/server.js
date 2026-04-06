const mongoose = require('mongoose');
require('dotenv').config();
const env = require('./config/env');
const logger = require('./config/logger');
const { createApp } = require('./app');

mongoose
  .connect(env.mongoUri)
  .then(async () => {
    logger.info('MongoDB connected');
    const app = await createApp();

    app.listen(env.port, () => {
      logger.info(`SkillSwipe server listening on http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    logger.error({ err: error }, 'MongoDB connection error');
    process.exit(1);
  });
