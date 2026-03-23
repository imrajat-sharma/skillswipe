require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function fixIndexes() {
  await mongoose.connect(process.env.MONGO_URI);

  const collection = mongoose.connection.collection('users');
  const indexes = await collection.indexes();
  const staleIndexNames = indexes
    .filter((index) => index.key?.skills === 1 && index.key?.roles === 1)
    .map((index) => index.name);

  for (const indexName of staleIndexNames) {
    console.log(`Dropping stale index: ${indexName}`);
    await collection.dropIndex(indexName);
  }

  await User.syncIndexes();

  const nextIndexes = await collection.indexes();
  console.log('Current user indexes:');
  console.table(
    nextIndexes.map((index) => ({
      name: index.name,
      key: JSON.stringify(index.key),
      unique: Boolean(index.unique),
    }))
  );

  await mongoose.disconnect();
}

fixIndexes().catch(async (error) => {
  console.error('Index fix failed:', error.message);
  await mongoose.disconnect().catch(() => null);
  process.exit(1);
});
