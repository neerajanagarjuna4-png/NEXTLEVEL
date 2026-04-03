#!/usr/bin/env node
// Update Render service environment variables and trigger a deploy.
// Usage:
// RENDER_API_KEY=... RENDER_SERVICE_ID=... node scripts/set_render_envs.mjs
// Provide env values via env: VITE_API_URL, VITE_SOCKET_URL, JWT_SECRET, FRONTEND_URL

const apiKey = process.env.RENDER_API_KEY;
const serviceId = process.env.RENDER_SERVICE_ID;

if (!apiKey || !serviceId) {
  console.error('RENDER_API_KEY and RENDER_SERVICE_ID are required in environment.');
  process.exit(2);
}

const newEnv = [];
if (process.env.VITE_API_URL) newEnv.push({ key: 'VITE_API_URL', value: process.env.VITE_API_URL });
if (process.env.VITE_SOCKET_URL) newEnv.push({ key: 'VITE_SOCKET_URL', value: process.env.VITE_SOCKET_URL });
if (process.env.JWT_SECRET) newEnv.push({ key: 'JWT_SECRET', value: process.env.JWT_SECRET });
if (process.env.FRONTEND_URL) newEnv.push({ key: 'FRONTEND_URL', value: process.env.FRONTEND_URL });

if (newEnv.length === 0) {
  console.log('No environment variables provided to update. Set VITE_API_URL, VITE_SOCKET_URL, JWT_SECRET or FRONTEND_URL.');
  process.exit(0);
}

const fetchJson = async (url, opts) => {
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch (e) { return text; }
};

(async () => {
  try {
    // Fetch current service
    const svc = await fetchJson(`https://api.render.com/v1/services/${serviceId}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    // Merge existing envVars with new values (replace keys)
    const existing = Array.isArray(svc.envVars) ? svc.envVars : (svc.environment ? svc.environment.envVars || [] : []);
    const merged = existing.filter(e => !newEnv.some(n => n.key === e.key));
    for (const n of newEnv) merged.push({ key: n.key, value: n.value });

    // PATCH service
    console.log('Updating Render service environment variables...');
    const patchBody = { envVars: merged };
    const patched = await fetchJson(`https://api.render.com/v1/services/${serviceId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(patchBody)
    });
    console.log('Render update response:', patched);

    // Trigger deploy
    console.log('Triggering Render deploy...');
    const deploy = await fetchJson(`https://api.render.com/v1/services/${serviceId}/deploys`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    console.log('Render deploy response:', deploy);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();
