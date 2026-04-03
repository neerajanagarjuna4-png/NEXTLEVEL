#!/usr/bin/env node
const https = require('https');
const url = 'https://nextlevel-0xw2.onrender.com/api/health';
const timeoutMs = 300000; // 5 minutes
const start = Date.now();

function getHealth() {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ ok: res.statusCode === 200, statusCode: res.statusCode, body });
      });
    });
    req.on('error', (e) => resolve({ ok: false, error: e.message }));
    req.setTimeout(15000, () => { req.abort(); resolve({ ok: false, error: 'timeout' }); });
  });
}

(async () => {
  while (Date.now() - start < timeoutMs) {
    const r = await getHealth();
    if (r.ok) {
      console.log('HEALTH_OK');
      try {
        // Pretty-print JSON body if possible
        const parsed = JSON.parse(r.body);
        console.log(JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log(r.body);
      }
      process.exit(0);
    } else {
      console.log('not-ready:', r.error || `status ${r.statusCode}`);
      await new Promise(r => setTimeout(r, 10000));
    }
  }
  console.error('HEALTH_TIMEOUT');
  process.exit(2);
})();
