import mongoose from 'mongoose';
import fs from 'fs';
import { uploadFile } from './driveService.js';

const MODELS = [
  'User','StudyReport','DailyTrackerLog','SubjectProgress','SyllabusProgress','DailyTask','SuccessStory','MockTestAttempt','MentorFeedback','Notification','Partnership','Note','FlashcardProgress','PYQProgress','ChatMessage'
];

export const runDailyBackup = async () => {
  try {
    const backup = {};
    for (const name of MODELS) {
      try {
        const Model = mongoose.model(name);
        backup[name] = await Model.find({}).lean();
      } catch (e) {
        backup[name] = [];
      }
    }
    const json = JSON.stringify(backup, null, 2);
    const buffer = Buffer.from(json, 'utf8');
    const date = new Date().toISOString().slice(0,10);
    const result = await uploadFile(`NEXTLEVEL_Backup_${date}.json`, 'application/json', buffer);
    console.log('✅ Daily backup uploaded to Drive:', result.viewLink);
    return result;
  } catch (err) {
    console.error('Backup failed:', err && err.message ? err.message : err);
    throw err;
  }
};

export default { runDailyBackup };
