import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import DailyTrackerLog from './models/DailyTrackerLog.js';
import SubjectProgress from './models/SubjectProgress.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const sampleUserEmail = 'student1@gate.com';

const sampleLogs = [
  {
    date: '2026-04-02',
    entries: [
      { subject: 'Networks', activity: 'Video', targetHours: 1, actualHours: 1 },
      { subject: 'Signals', activity: 'Video', targetHours: 2, actualHours: 2 },
      { subject: 'Break', activity: 'Break', targetHours: 1, actualHours: 1 }
    ],
    mentorRemarks: 'Focus on Video Lecture',
    studentAnswers: 'Completed as planned.'
  },
  {
    date: '2026-04-03',
    entries: [
      { subject: 'Networks', activity: 'Practice', targetHours: 4, actualHours: 3 },
      { subject: 'Networks', activity: 'Practice', targetHours: 3, actualHours: 3 },
      { subject: 'Apti', activity: 'Video', targetHours: 3, actualHours: 3 }
    ],
    mentorRemarks: 'Focus on Video Lecture',
    studentAnswers: 'Practiced more problems.'
  }
];

const sampleSubjects = [
  { subject: 'Networks', videoTarget: 70, practiceTarget: 50, revisionTarget: 10, videoDone: 1, practiceDone: 6, revisionDone: 1 },
  { subject: 'Digital', videoTarget: 80, practiceTarget: 40, revisionTarget: 10 },
  { subject: 'Signals', videoTarget: 70, practiceTarget: 30, revisionTarget: 10, videoDone: 2 },
  { subject: 'Controls', videoTarget: 70, practiceTarget: 30, revisionTarget: 20 },
  { subject: 'Maths', videoTarget: 40, practiceTarget: 30, revisionTarget: 10 },
  { subject: 'Apti', videoTarget: 60, practiceTarget: 30, revisionTarget: 10, videoDone: 3 },
  { subject: 'Analog', videoTarget: 70, practiceTarget: 40, revisionTarget: 20 },
  { subject: 'Emft', videoTarget: 60, practiceTarget: 30, revisionTarget: 10 },
  { subject: 'EDC', videoTarget: 70, practiceTarget: 30, revisionTarget: 15 },
  { subject: 'Commn', videoTarget: 70, practiceTarget: 40, revisionTarget: 15 }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const user = await User.findOne({ email: sampleUserEmail });
  if (!user) {
    console.error('Sample user not found:', sampleUserEmail);
    process.exit(1);
  }
  await DailyTrackerLog.deleteMany({ userId: user._id });
  await SubjectProgress.deleteMany({ userId: user._id });
  for (const log of sampleLogs) {
    await DailyTrackerLog.create({ ...log, userId: user._id, date: new Date(log.date) });
  }
  for (const subj of sampleSubjects) {
    await SubjectProgress.create({ ...subj, userId: user._id });
  }
  console.log('Sample tracker data seeded.');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
