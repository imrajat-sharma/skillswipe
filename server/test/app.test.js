const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs/promises');
const mongoose = require('mongoose');
const path = require('path');
const request = require('supertest');
const { spawn } = require('child_process');
const os = require('os');
const bcrypt = require('bcrypt');

let createApp;
let app;
let User;
let Match;
let Post;
let mongoProcess;
let mongoDataDir;
let mongoUri;

const createAgent = () => request.agent(app);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startMongoProcess = async () => {
  mongoDataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'skillswipe-mongo-'));
  mongoUri = 'mongodb://127.0.0.1:27018/skillswipe-test';

  mongoProcess = spawn(
    'mongod',
    ['--dbpath', mongoDataDir, '--port', '27018', '--bind_ip', '127.0.0.1'],
    {
      stdio: 'ignore',
      windowsHide: true,
    }
  );

  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1000 });
      return;
    } catch (error) {
      await mongoose.disconnect().catch(() => null);
      await sleep(1000);
    }
  }

  throw new Error('Unable to start MongoDB for tests.');
};

test.before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';
  process.env.SESSION_SECRET = 'test-session-secret';
  process.env.CLIENT_URL = 'http://localhost:5173';
  process.env.RATE_LIMIT_MAX = '1000';
  process.env.AUTH_RATE_LIMIT_MAX = '1000';
  process.env.REDIS_URL = '';

  await startMongoProcess();
  process.env.MONGO_URI = mongoUri;

  ({ createApp } = require('../app'));
  User = require('../models/User');
  Match = require('../models/Match');
  Post = require('../models/Post');

  app = await createApp();
});

test.after(async () => {
  await mongoose.disconnect();
  if (mongoProcess) {
    await new Promise((resolve) => {
      mongoProcess.once('exit', resolve);
      mongoProcess.kill();
    });
  }
  if (mongoDataDir) {
    await fs.rm(mongoDataDir, { recursive: true, force: true });
  }
});

test.afterEach(async () => {
  await Promise.all([User.deleteMany({}), Match.deleteMany({}), Post.deleteMany({})]);
});

test('registers and returns the authenticated user payload', async () => {
  const response = await createAgent()
    .post('/api/auth/register')
    .send({
      name: 'Rajat',
      email: 'rajat@example.com',
      password: 'secret123',
    })
    .expect(201);

  assert.equal(response.body.user.email, 'rajat@example.com');
  assert.equal(response.body.user.name, 'Rajat');
  assert.equal(response.body.user.swipesLeftToday, 10);
});

test('rejects invalid profile updates', async () => {
  const agent = createAgent();

  await agent.post('/api/auth/register').send({
    name: 'Rajat',
    email: 'rajat@example.com',
    password: 'secret123',
  });

  const response = await agent
    .put('/api/profile')
    .field('bio', '')
    .field('roles', 'Mentor')
    .field('skills', 'Node.js')
    .expect(400);

  assert.match(response.body.message, /Bio is required/);
});

test('saves valid profile updates and marks the profile complete', async () => {
  const agent = createAgent();

  await agent.post('/api/auth/register').send({
    name: 'Rajat',
    email: 'rajat-profile@example.com',
    password: 'secret123',
  });

  const response = await agent
    .put('/api/profile')
    .field('bio', 'Full-stack builder looking for collaborators.')
    .field('roles', 'Mentor, Collaborator')
    .field('skills', 'Node.js, React')
    .field('location', 'Delhi/NCR')
    .field('pincode', '110001')
    .field('availability', 'Weekends')
    .expect(200);

  assert.equal(response.body.user.bio, 'Full-stack builder looking for collaborators.');
  assert.deepEqual(response.body.user.roles, ['Mentor', 'Collaborator']);
  assert.deepEqual(response.body.user.skills, ['Node.js', 'React']);
  assert.equal(response.body.user.location, 'Delhi/NCR');
  assert.equal(response.body.user.pincode, '110001');
  assert.equal(response.body.user.availability, 'Weekends');
  assert.equal(response.body.user.isProfileComplete, false);
});

test('paginates matches for authenticated users', async () => {
  const hashedPassword = await bcrypt.hash('secret123', 10);

  await User.create({
    name: 'Owner',
    email: 'owner@example.com',
    password: hashedPassword,
    photo: '/uploads/owner.jpg',
    bio: 'Owner bio',
    roles: ['Mentor'],
    skills: ['Node.js'],
    availability: 'Weekends',
    isProfileComplete: true,
  });

  const owner = await User.findOne({ email: 'owner@example.com' });
  const peers = await User.insertMany(
    Array.from({ length: 3 }, (_, index) => ({
      name: `Peer ${index + 1}`,
      email: `peer${index + 1}@example.com`,
      password: hashedPassword,
      photo: `/uploads/peer-${index + 1}.jpg`,
      bio: `Peer ${index + 1} bio`,
      roles: ['Collaborator'],
      skills: ['MongoDB'],
      availability: 'Evenings',
      isProfileComplete: true,
    }))
  );

  await Match.insertMany(
    peers.map((peer, index) => ({
      users: [owner._id, peer._id],
      messages: [
        {
          sender: owner._id,
          content: `Message ${index + 1}`,
        },
      ],
    }))
  );

  const agent = createAgent();
  await agent.post('/api/auth/login').send({
    email: 'owner@example.com',
    password: 'secret123',
  });

  const response = await agent.get('/api/matches?page=1&limit=2').expect(200);

  assert.equal(response.body.matches.length, 2);
  assert.equal(response.body.pagination.total, 3);
  assert.equal(response.body.pagination.hasNextPage, true);
});

test('enforces daily swipe limits', async () => {
  const hashedPassword = await bcrypt.hash('secret123', 10);

  await User.create({
    name: 'Swiper',
    email: 'swiper@example.com',
    password: hashedPassword,
    photo: '/uploads/swiper.jpg',
    bio: 'Swiper bio',
    roles: ['Mentor'],
    skills: ['Node.js'],
    availability: 'Anytime',
    isProfileComplete: true,
    swipesToday: 10,
    dailySwipeLimit: 10,
    lastSwipeDate: new Date(),
  });

  const target = await User.create({
    name: 'Target',
    email: 'target@example.com',
    password: hashedPassword,
    photo: '/uploads/target.jpg',
    bio: 'Target bio',
    roles: ['Mentee'],
    skills: ['React'],
    availability: 'Evenings',
    isProfileComplete: true,
  });

  const agent = createAgent();
  await agent.post('/api/auth/login').send({
    email: 'swiper@example.com',
    password: 'secret123',
  });

  const response = await agent
    .post('/api/swipe/action')
    .send({ targetId: target._id.toString(), direction: 'like' })
    .expect(400);

  assert.equal(response.body.message, 'Daily swipe limit reached.');
});

test('filters discover profiles and exposes available filter options', async () => {
  const hashedPassword = await bcrypt.hash('secret123', 10);

  await User.create({
    name: 'Swiper',
    email: 'discoverer@example.com',
    password: hashedPassword,
    photo: '/uploads/discoverer.jpg',
    bio: 'Discover bio',
    roles: ['Mentor'],
    skills: ['Node.js'],
    availability: 'Evenings',
    isProfileComplete: true,
  });

  await User.insertMany([
    {
      name: 'Node Candidate',
      email: 'node-candidate@example.com',
      password: hashedPassword,
      photo: '/uploads/node.jpg',
      bio: 'Node candidate bio',
      roles: ['Mentee'],
      skills: ['Node.js'],
      location: 'Delhi/NCR',
      availability: 'Weekends',
      isProfileComplete: true,
    },
    {
      name: 'React Candidate',
      email: 'react-candidate@example.com',
      password: hashedPassword,
      photo: '/uploads/react.jpg',
      bio: 'React candidate bio',
      roles: ['Collaborator'],
      skills: ['React'],
      location: 'Mumbai',
      availability: 'Weekdays',
      isProfileComplete: true,
    },
  ]);

  const agent = createAgent();
  await agent.post('/api/auth/login').send({
    email: 'discoverer@example.com',
    password: 'secret123',
  });

  const discoverResponse = await agent.get('/api/swipe/discover?skills=Node.js&page=1&limit=10').expect(200);
  assert.equal(discoverResponse.body.profiles.length, 1);
  assert.equal(discoverResponse.body.profiles[0].name, 'Node Candidate');
  assert.deepEqual(discoverResponse.body.filters.skills, ['Node.js']);

  const filtersResponse = await agent.get('/api/swipe/filters').expect(200);
  assert(filtersResponse.body.filters.skills.includes('Node.js'));
  assert(filtersResponse.body.filters.roles.includes('Mentor'));
});

test('loads a match thread and appends chat messages', async () => {
  const hashedPassword = await bcrypt.hash('secret123', 10);

  const [owner, partner] = await User.insertMany([
    {
      name: 'Owner',
      email: 'owner-chat@example.com',
      password: hashedPassword,
      photo: '/uploads/owner-chat.jpg',
      bio: 'Owner bio',
      roles: ['Mentor'],
      skills: ['Node.js'],
      availability: 'Weekends',
      isProfileComplete: true,
    },
    {
      name: 'Partner',
      email: 'partner-chat@example.com',
      password: hashedPassword,
      photo: '/uploads/partner-chat.jpg',
      bio: 'Partner bio',
      roles: ['Mentee'],
      skills: ['React'],
      availability: 'Evenings',
      isProfileComplete: true,
    },
  ]);

  const match = await Match.create({
    users: [owner._id, partner._id],
    messages: [
      {
        sender: owner._id,
        content: 'Hello there',
      },
    ],
  });

  const agent = createAgent();
  await agent.post('/api/auth/login').send({
    email: 'owner-chat@example.com',
    password: 'secret123',
  });

  const threadResponse = await agent.get(`/api/matches/${match._id}`).expect(200);
  assert.equal(threadResponse.body.match.messages.length, 1);
  assert.equal(threadResponse.body.match.partner.name, 'Partner');

  const replyResponse = await agent
    .post(`/api/matches/${match._id}/messages`)
    .send({ content: 'Excited to connect.' })
    .expect(201);

  assert.equal(replyResponse.body.match.messages.length, 2);
  assert.equal(replyResponse.body.match.lastMessage.content, 'Excited to connect.');
});

test('creates and deletes markdown text posts for the owner', async () => {
  const agent = createAgent();

  await agent.post('/api/auth/register').send({
    name: 'Poster',
    email: 'poster@example.com',
    password: 'secret123',
  });

  const createResponse = await agent
    .post('/api/posts')
    .send({
      type: 'text',
      formatting: 'markdown',
      content: '## Building SkillSwipe\nThis is a **formatted** update.',
    })
    .expect(201);

  assert.equal(createResponse.body.post.type, 'text');
  assert.equal(createResponse.body.post.formatting, 'markdown');
  assert.equal(createResponse.body.post.isOwner, true);
  assert.equal(createResponse.body.post.likeCount, 0);
  assert.equal(createResponse.body.post.commentCount, 0);
  assert.equal(createResponse.body.post.shareCount, 0);
  assert.equal(createResponse.body.post.isLiked, false);
  assert.equal(createResponse.body.post.isShared, false);

  await agent.delete(`/api/posts/${createResponse.body.post._id}`).expect(200);
  assert.equal(await Post.countDocuments(), 0);
});

test('creates poll posts with unique options', async () => {
  const agent = createAgent();

  await agent.post('/api/auth/register').send({
    name: 'Poll Creator',
    email: 'poll@example.com',
    password: 'secret123',
  });

  const response = await agent
    .post('/api/posts')
    .send({
      type: 'poll',
      formatting: 'plain',
      question: 'Which production upgrade matters most next?',
      options: ['Notifications', 'Search', 'Analytics'],
      caption: 'Help us prioritize.',
    })
    .expect(201);

  assert.equal(response.body.post.type, 'poll');
  assert.equal(response.body.post.poll.options.length, 3);
});

test('supports liking, commenting, sharing, and validates interaction input', async () => {
  const ownerAgent = createAgent();
  const viewerAgent = createAgent();

  await ownerAgent.post('/api/auth/register').send({
    name: 'Owner',
    email: 'owner@example.com',
    password: 'secret123',
  });

  const createResponse = await ownerAgent
    .post('/api/posts')
    .send({
      type: 'text',
      formatting: 'plain',
      content: 'Building a new feature today.',
    })
    .expect(201);

  const postId = createResponse.body.post._id;

  await request(app)
    .post(`/api/posts/${postId}/like`)
    .expect(401);

  await viewerAgent.post('/api/auth/register').send({
    name: 'Viewer',
    email: 'viewer@example.com',
    password: 'secret123',
  });

  const likeResponse = await viewerAgent.post(`/api/posts/${postId}/like`).expect(200);
  assert.equal(likeResponse.body.liked, true);
  assert.equal(likeResponse.body.post.likeCount, 1);
  assert.equal(likeResponse.body.post.isLiked, true);
  assert.equal(likeResponse.body.post.commentCount, 0);
  assert.equal(likeResponse.body.post.shareCount, 0);

  const commentResponse = await viewerAgent
    .post(`/api/posts/${postId}/comments`)
    .send({ content: 'This is a great update.' })
    .expect(201);

  assert.equal(commentResponse.body.comment.content, 'This is a great update.');
  assert.equal(commentResponse.body.post.commentCount, 1);
  assert.equal(commentResponse.body.post.likeCount, 1);
  assert.equal(commentResponse.body.post.isLiked, true);

  const commentsResponse = await viewerAgent.get(`/api/posts/${postId}/comments?page=1&limit=10`).expect(200);
  assert.equal(commentsResponse.body.comments.length, 1);
  assert.equal(commentsResponse.body.pagination.total, 1);
  assert.equal(commentsResponse.body.comments[0].author.name, 'Viewer');

  const shareResponse = await viewerAgent.post(`/api/posts/${postId}/share`).expect(200);
  assert.equal(shareResponse.body.shared, true);
  assert.equal(shareResponse.body.post.shareCount, 1);
  assert.equal(shareResponse.body.post.isShared, true);

  const unlikeResponse = await viewerAgent.delete(`/api/posts/${postId}/like`).expect(200);
  assert.equal(unlikeResponse.body.liked, false);
  assert.equal(unlikeResponse.body.post.likeCount, 0);
  assert.equal(unlikeResponse.body.post.isLiked, false);

  const validationResponse = await viewerAgent
    .post(`/api/posts/${postId}/comments`)
    .send({ content: '   ' })
    .expect(400);

  assert.equal(validationResponse.body.message, 'Comment content is required.');
});
