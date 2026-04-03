const http = require('http');
const https = require('https');
const { URL } = require('url');

const BASE = process.env.API_URL || 'http://localhost:5000/api';

function buildUrl(path) {
  const cleanBase = BASE.endsWith('/') ? BASE : BASE + '/';
  const cleanPath = path.replace(/^\//, '');
  return new URL(cleanPath, cleanBase);
}

function request(method, path, data, token) {
  const url = buildUrl(path);
  const lib = url.protocol === 'https:' ? https : http;

  const options = {
    method,
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + (url.search || ''),
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) options.headers['Authorization'] = `Bearer ${token}`;

  return new Promise((resolve, reject) => {
    const req = lib.request(options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        let parsed = body;
        try { parsed = JSON.parse(body) } catch (e) {}
        resolve({ statusCode: res.statusCode, body: parsed });
      });
    });
    req.on('error', (err) => reject(err));
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function main() {
  console.log('Tracker walkthrough starting — base =', BASE);
  const ts = Date.now();
  const email = `wt+${ts}@example.com`;
  const password = 'TestPass123!';

  try {
    let res;

    console.log('\n1) Signup');
    res = await request('POST', '/auth/signup', { name: 'WT Student', email, password, branch: 'CSE' });
    console.log('signup ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    console.log('\n2) Login');
    res = await request('POST', '/auth/login', { email, password });
    console.log('login ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    const token = res.body && (res.body.token || (res.body.data && res.body.data.token));
    const user = res.body && (res.body.user || (res.body.data && res.body.data.user));

    if (!token) {
      console.warn('No token returned — tracker tests cannot continue');
      process.exit(1);
    }

    // 3) Create today's tracker log
    console.log('\n3) Create today tracker log (upsert)');
    const today = new Date();
    const todayIso = new Date(today).toISOString();
    res = await request('POST', '/tracker/logs', { date: todayIso, entries: [{ subject: 'Digital Logic', activity: 'Practice', targetHours: 2, actualHours: 3 }] }, token);
    console.log('create today log ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    // 4) Duplicate submission (same date) should upsert, not create duplicate
    console.log('\n4) Duplicate submit same date (upsert)');
    res = await request('POST', '/tracker/logs', { date: todayIso, entries: [{ subject: 'Digital Logic', activity: 'Practice', targetHours: 2, actualHours: 1 }] }, token);
    console.log('duplicate upsert ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    // 5) Fetch logs and count entries
    console.log('\n5) Fetch tracker logs (GET)');
    res = await request('GET', '/tracker/logs', null, token);
    console.log('get logs ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    // 6) Create a past date log (yesterday) then attempt to update it (should be read-only for student)
    console.log('\n6) Create yesterday log and try update (should be forbidden)');
    const y = new Date(Date.now() - 24*3600*1000);
    const yIso = new Date(y).toISOString();
    res = await request('POST', '/tracker/logs', { date: yIso, entries: [{ subject: 'Math', activity: 'Video', targetHours: 1, actualHours: 1 }] }, token);
    console.log('create yesterday ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    console.log('\nAttempt update yesterday (expect 403)');
    res = await request('POST', '/tracker/logs', { date: yIso, entries: [{ subject: 'Math', activity: 'Video', targetHours: 1, actualHours: 2 }] }, token);
    console.log('update yesterday ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    console.log('\nTracker walkthrough finished');
    process.exit(0);
  } catch (err) {
    console.error('Tracker walkthrough error:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

main();
