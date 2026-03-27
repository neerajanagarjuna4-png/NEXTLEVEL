/**
 * Database Seed Script for NEXT_LEVEL Platform
 * 
 * Run this script to create the initial mentor account and a test student:
 *   node backend/seed.js
 * 
 * Requires MONGODB_URI environment variable or defaults to localhost.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextlevel';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create Mentor account (Bhima Sankar Sir)
    const mentorEmail = 'sankar.bhima@gmail.com';
    const existingMentor = await User.findOne({ email: mentorEmail });
    if (!existingMentor) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Bhima@123', salt);
      await User.create({
        name: 'Bhima Sankar Sir',
        email: mentorEmail,
        password: hashedPassword,
        branch: 'ECE',
        role: 'mentor',
        status: 'approved'
      });
      console.log('✅ Mentor account created: sankar.bhima@gmail.com / Bhima@123');
    } else {
      console.log('ℹ️  Mentor account already exists');
    }

    // Create Test Student
    const studentEmail = 'nagarjunaneeraja4@gmail.com';
    const existingStudent = await User.findOne({ email: studentEmail });
    if (!existingStudent) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await User.create({
        name: 'Nagarjuna User',
        email: studentEmail,
        password: hashedPassword,
        branch: 'ECE',
        role: 'student',
        status: 'approved',
        targets: { daily: 8, weekly: 50, monthly: 200 }
      });
      console.log('✅ Test student created: nagarjunaneeraja4@gmail.com / password123');
    } else {
      console.log('ℹ️  Test student already exists');
    }

    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
