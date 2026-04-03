#!/usr/bin/env node
/*
  Helper: trigger a Render deploy from your machine.
  Usage:
    RENDER_API_KEY=... RENDER_SERVICE_ID=... node scripts/trigger_render_deploy.mjs
*/
const apiKey = process.env.RENDER_API_KEY;
const serviceId = process.env.RENDER_SERVICE_ID;
if (!apiKey || !serviceId) {
  console.error('Missing RENDER_API_KEY or RENDER_SERVICE_ID in environment');
  process.exit(1);
}

const url = `https://api.render.com/v1/services/${serviceId}/deploys`;
try {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  const text = await res.text();
  console.log('Render response:', text);
} catch (err) {
  console.error('Failed to call Render API:', err);
  process.exit(1);
}
