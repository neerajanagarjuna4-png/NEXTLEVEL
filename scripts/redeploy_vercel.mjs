#!/usr/bin/env node
// Redeploy Vercel production by triggering a new deployment via the Vercel API.
// Usage: VERCEL_TOKEN=your_token node scripts/redeploy_vercel.mjs

import fetch from 'node-fetch';

const token = process.env.VERCEL_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID || 'prj_GPpNT1bcLPDDCs4fugMZ4etcElLp';

if (!token) {
  console.error('VERCEL_TOKEN not set. Export VERCEL_TOKEN and try again.');
  process.exit(2);
}

(async () => {
  try {
    console.log('Fetching project info...');
    const projRes = await fetch(`https://api.vercel.com/v1/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!projRes.ok) {
      console.error('Failed to fetch project info:', projRes.status, await projRes.text());
      process.exit(1);
    }
    const project = await projRes.json();
    console.log('Project found:', project.name, project.id);

    console.log('Triggering production redeploy...');
    const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        projectId: projectId,
        target: 'production'
      })
    });

    if (!deployRes.ok) {
      console.error('Redeploy failed:', deployRes.status, await deployRes.text());
      process.exit(1);
    }

    const deploy = await deployRes.json();
    console.log('Redeploy started. Deployment ID:', deploy.id, 'URL:', deploy.url);
    console.log('You can poll https://api.vercel.com/v1/deployments/' + deploy.id + ' for status.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
