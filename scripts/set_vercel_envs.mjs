#!/usr/bin/env node
// Set or update Vercel project environment variables via API.
// Usage:
// VERCEL_TOKEN=... VERCEL_PROJECT_ID=... node scripts/set_vercel_envs.mjs
// Or pass values via env: VITE_API_URL, VITE_SOCKET_URL, JWT_SECRET, FRONTEND_URL

const token = process.env.VERCEL_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID || 'prj_GPpNT1bcLPDDCs4fugMZ4etcElLp';

if (!token) {
  console.error('VERCEL_TOKEN is required in environment.');
  process.exit(2);
}

const envsToSet = {
  VITE_API_URL: process.env.VITE_API_URL,
  VITE_SOCKET_URL: process.env.VITE_SOCKET_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL
};

const fetchJson = async (url, opts) => {
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch (e) { return text; }
};

(async () => {
  try {
    // fetch existing envs
    const list = await fetchJson(`https://api.vercel.com/v1/projects/${projectId}/env`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    for (const [key, value] of Object.entries(envsToSet)) {
      if (!value) continue;

      const existing = Array.isArray(list) ? list.find(e => e.key === key) : null;
      if (existing && existing.id) {
        console.log(`Patching Vercel env ${key} (id=${existing.id})`);
        const res = await fetchJson(`https://api.vercel.com/v1/projects/${projectId}/env/${existing.id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ value, target: ['production','preview','development'], type: 'encrypted' })
        });
        console.log('->', res);
      } else {
        console.log(`Creating Vercel env ${key}`);
        const res = await fetchJson(`https://api.vercel.com/v1/projects/${projectId}/env`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value, target: ['production','preview','development'], type: 'encrypted' })
        });
        console.log('->', res);
      }
    }

    // Trigger a production redeploy
    console.log('Triggering Vercel production redeploy...');
    const deploy = await fetchJson('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, target: 'production' })
    });
    console.log('Redeploy started:', deploy.id || deploy);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();
