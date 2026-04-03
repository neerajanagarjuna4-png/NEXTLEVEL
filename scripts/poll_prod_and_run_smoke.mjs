#!/usr/bin/env node
import { spawn } from 'node:child_process';

const url = process.env.FRONTEND_URL || 'https://nextlevel-snowy.vercel.app';
const maxAttempts = parseInt(process.env.MAX_ATTEMPTS || '90', 10);
const delayMs = parseInt(process.env.DELAY_MS || '10000', 10);

console.log(`Polling ${url} up to ${maxAttempts} times every ${delayMs/1000}s...`);
let attempt = 0;

async function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

(async () => {
  while (attempt < maxAttempts) {
    attempt++;
    try {
      const res = await fetch(url, { method: 'GET' });
      console.log(new Date().toISOString(), 'Attempt', attempt, res.status);
      if (res.status === 200) {
        console.log('Production is live (200). Running UI smoke tests...');
        const env = { ...process.env, FRONTEND_URL: url };
        const child = spawn(process.execPath, ['scripts/ui-smoke.mjs'], { stdio: 'inherit', env });
        const code = await new Promise((resolve) => child.on('close', resolve));
        process.exit(code ?? 0);
      }
    } catch (err) {
      console.log(new Date().toISOString(), 'Attempt', attempt, 'ERR', err.message);
    }
    await sleep(delayMs);
  }
  console.log('Timed out waiting for production to return 200.');
  process.exit(2);
})();
