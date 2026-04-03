# CI / GitHub Actions — Render deployment

This repository includes a GitHub Actions workflow to assist with backend deploys to Render.

Files added:
- `.github/workflows/render-deploy.yml` — runs when `main` receives a push that affects the `backend/` folder and triggers a Render deploy via API.
- `scripts/trigger_render_deploy.mjs` — small helper to trigger a deploy locally.

Required GitHub repository secrets (set these in GitHub Settings → Secrets → Actions):

- `RENDER_API_KEY` — your Render API key (minimum `service.manage` scope)
- `RENDER_SERVICE_ID` — the Render service id for the backend service (e.g. `srv-abc123...`)

How it works:
- When you push to `main`, the workflow installs backend dependencies then calls the Render API to create a new deploy. Render will use the `render.yaml` or the service settings to build and start the service.

Manual trigger (local):

```bash
RENDER_API_KEY='your_key' RENDER_SERVICE_ID='srv-xxxxx' node scripts/trigger_render_deploy.mjs
```

Notes & next steps:
- The workflow will only trigger a deploy if both `RENDER_API_KEY` and `RENDER_SERVICE_ID` are configured in GitHub Secrets.
- For full automatic deploys you can connect this repository to Render (recommended) and use the included `render.yaml` for configuration.
- After the Render service is live, set frontend envs (Vercel) and run the seed script locally or from a safe CI job.
