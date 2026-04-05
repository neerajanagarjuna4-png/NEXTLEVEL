require('dotenv').config();
const mongoose = require('mongoose');

async function createIndexes() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nextlevel');
  const db = mongoose.connection.db;

  const indexes = [
    { collection: 'studyreports', index: { userId: 1, date: -1 } },
    { collection: 'dailytrackerlogs', index: { userId: 1, date: -1 } },
    { collection: 'dailytasks', index: { userId: 1 } },
    { collection: 'notifications', index: { userId: 1, isRead: 1, createdAt: -1 } },
    { collection: 'stories', index: { isApproved: 1, createdAt: -1 } },
    { collection: 'pyqprogresses', index: { userId: 1 } },
    { collection: 'flashcardprogresses', index: { userId: 1 } },
    { collection: 'chatmessages', index: { fromUserId: 1, toUserId: 1, sentAt: -1 } },
    { collection: 'users', index: { email: 1 }, options: { unique: true } }
  ];

  for (const { collection, index, options = {} } of indexes) {
    try {
      await db.collection(collection).createIndex(index, options);
      console.log(`✅ Index created: ${collection}`);
    } catch (err) {
      console.log(`⚠️ Index already exists or failed: ${collection}`, err.message || err);
    }
  }
  console.log('All indexes ready');
  process.exit(0);
}

createIndexes().catch(err => { console.error(err); process.exit(1); });
