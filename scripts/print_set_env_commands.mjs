#!/usr/bin/env node
/*
  Helper: prints curl / CLI commands to set `POSTGRES_URL` in Vercel and Render.
  Usage (locally):
    node scripts/print_set_env_commands.mjs "postgresql://..."

  This script DOES NOT send secrets to remote services; it only prints the
  exact commands you can run locally (with your tokens) to set the env vars.
*/

const val = process.argv[2] || process.env.POSTGRES_URL;
if (!val) {
  console.error('Usage: node scripts/print_set_env_commands.mjs "<POSTGRES_URL>"');
  process.exit(2);
}

const vercelProjectId = process.env.VERCEL_PROJECT_ID || 'prj_GPpNT1bcLPDDCs4fugMZ4etcElLp';

console.log('\n--- Commands to set POSTGRES_URL in Vercel (run locally) ---\n');
console.log('Replace <VERCEL_TOKEN> with your token and run:');
console.log('');
console.log('curl -X POST "https://api.vercel.com/v1/projects/' + vercelProjectId + '/env" \\');
console.log("  -H 'Authorization: Bearer <VERCEL_TOKEN>' \\');
console.log("  -H 'Content-Type: application/json' \\');
console.log('  -d "' + JSON.stringify({ key: 'POSTGRES_URL', value: val, target: ['production','preview','development'], type: 'encrypted' }, null, 2).replace(/\n/g,'\n  ') + '"');

console.log('\n--- Commands to set POSTGRES_URL on Render via API (run locally) ---\n');
console.log('Replace <RENDER_API_KEY> and <RENDER_SERVICE_ID> and run:');
console.log('');
console.log('curl -X PATCH "https://api.render.com/v1/services/<RENDER_SERVICE_ID>" \\');
console.log("  -H 'Authorization: Bearer <RENDER_API_KEY>' \\');
console.log("  -H 'Content-Type: application/json' \\');
console.log('  -d "{ \"envVars\": [ { \"key\": \"POSTGRES_URL\", \"value\": \"' + val.replace(/"/g,'\"') + '\" } ] }"');

console.log('\nNote: For Render, consider editing the service via the Render dashboard if the API PATCH is rejected.');
console.log('');
console.log('After setting the envs, redeploy both services (Render + Vercel).');
console.log('');
