#!/usr/bin/env node
const fs = require('fs');
const nodemailer = require('nodemailer');

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
const user = env.EMAIL_USER;
const pass = env.EMAIL_PASS;
if (!user || !pass) {
  console.error('EMAIL_USER or EMAIL_PASS missing in backend/.env');
  process.exit(2);
}

console.log('Verifying email transporter using backend/.env (credentials not printed)');
const t = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass }
});

t.verify((err, success) => {
  if (err) {
    console.error('Email FAILED:', err.message || err);
    process.exit(1);
  } else {
    console.log('Email service ready ✅');
    process.exit(0);
  }
});
