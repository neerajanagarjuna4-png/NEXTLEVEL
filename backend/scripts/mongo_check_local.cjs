#!/usr/bin/env node
const fs = require('fs');
const mongoose = require('mongoose');

function parseEnvFile(path) {
  try {
    const txt = fs.readFileSync(path, 'utf8');
    const lines = txt.split(/\r?\n/).map(l => l.trim()).filter(Boolean).filter(l => !l.startsWith('#'));
    const out = {};
    for (const line of lines) {
      const idx = line.indexOf('=');
      if (idx === -1) continue;
      const k = line.slice(0, idx).trim();
      let v = line.slice(idx + 1).trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      out[k] = v;
    }
    return out;
  } catch (e) {
    return {};
  }
}

const env = parseEnvFile('./.env');
const uri = env.MONGODB_URI;
if (!uri) {
  console.error('No MONGODB_URI found in backend/.env (or file unreadable)');
  process.exit(2);
}
console.log('Attempting MongoDB connection using backend/.env (URI not printed)');
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => { console.log('MongoDB connected ✅'); process.exit(0); })
  .catch(err => { console.error('MongoDB FAILED:', err.message); process.exit(1); });
