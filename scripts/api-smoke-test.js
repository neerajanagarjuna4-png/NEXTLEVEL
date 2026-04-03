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
        try {
          parsed = JSON.parse(body);
        } catch (e) {}
        resolve({ statusCode: res.statusCode, body: parsed });
      });
    });
    req.on('error', (err) => reject(err));
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function main() {
  console.log('API smoke tests starting — base =', BASE);
  const ts = Date.now();
  const email = `smoketest+${ts}@example.com`;
  const password = 'TestPass123!';

  try {
    let res;

    console.log('\n1) Signup');
    res = await request('POST', '/auth/signup', { name: 'Smoke Student', email, password, role: 'student' });
    console.log('signup ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    console.log('\n2) Login');
    res = await request('POST', '/auth/login', { email, password });
    console.log('login ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    const token = res.body && (res.body.token || (res.body.data && res.body.data.token) || res.body.accessToken);
    const user = res.body && (res.body.user || (res.body.data && res.body.data.user));

    if (!token) {
      console.warn('No token returned — authenticated tests will be skipped');
    } else {
      console.log('Token received length=', token.length);
    }

    if (user && user._id) {
      console.log('\n3) Syllabus progress (GET)');
      res = await request('GET', `/student/syllabus-progress/${user._id}`, null, token);
      console.log('syllabus ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));
    } else {
      console.log('Skipping syllabus progress (no user id)');
    }

    console.log('\n4) Planner generate (POST)');
    res = await request('POST', '/planner/generate', { userId: user?._id }, token);
    console.log('planner generate ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    console.log('\n5) Add custom flashcard (POST)');
    res = await request('POST', '/flashcards/custom', { question: 'Smoke Q: 2+2?', answer: '4' }, token);
    console.log('flashcards custom ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    console.log('\n6) Flashcards due (GET)');
    res = await request('GET', '/flashcards/due', null, token);
    console.log('flashcards due ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    console.log('\n7) PYQ attempt (POST)');
    res = await request('POST', '/pyq/attempt', { question: 'What is 2+2?', isCorrect: true }, token);
    console.log('pyq attempt ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    console.log('\n8) PYQ progress (GET)');
    res = await request('GET', '/pyq/progress', null, token);
    console.log('pyq progress ->', res.statusCode, JSON.stringify(res.body).slice(0, 800));

    console.log('\nSmoke tests completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Smoke tests encountered an error:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

main();
