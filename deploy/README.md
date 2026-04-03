# Phase 10 — Backend Deployment (Render) — NEXT_LEVEL

Goal: produce a repeatable, production-ready deployment for the backend service and provide the exact env variables required for production seeding and verification.

Prerequisites
- Render account with GitHub access (or ability to create a Web Service manually)
- MongoDB Atlas cluster and a connection string (SRV URI)
- GitHub repo connected to Render (recommended)

Required environment variables (set these on Render or your host):

- `MONGODB_URI` — MongoDB Atlas connection string (SRV). Example: `mongodb+srv://user:pass@cluster0.mongodb.net/nextlevel?retryWrites=true&w=majority`
- `JWT_SECRET` — long random string used to sign JWT tokens (48+ bytes recommended)
- `FRONTEND_URL` / `APP_URL` — public URL of the frontend (Vercel) e.g. `https://app.nextlevel.example`
- `MENTOR_MASTER_PASSWORD` — master password used to provision mentor accounts
- SMTP: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `MENTOR_EMAIL` — required if you want email invites/notifications

- `POSTGRES_URL` — optional Postgres connection string for analytics or integrations (set if you provision a Postgres DB). Example: `postgresql://user:pass@host:5432/nextlevel?sslmode=require`

Optional but recommended:
- `SENTRY_DSN`, `REDIS_URL`, `STRIPE_SECRET_KEY`, `CLOUDINARY_URL`

Deployment steps (short)

1) Configure environment

  - Create a MongoDB Atlas cluster and add a database user. Whitelist Render's outbound IPs or allow access from anywhere (0.0.0.0/0) for quick testing.
  - Generate a secure `JWT_SECRET`:

    ```bash
    node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
    ```

2) Deploy backend to Render (two options)

  Option A — using `render.yaml` (recommended):
  - Push `render.yaml` to the repository root (already included in this repo).
  - In Render dashboard, connect the GitHub repo and the service will be detected automatically.
  - Edit the service's env vars and paste the production values for `MONGODB_URI`, `JWT_SECRET`, etc.

  Option B — manual service creation:
  - Create a new Web Service on Render.
  - Set `Environment` to `Node`.
  - Set `Build Command` to `npm ci` and `Start Command` to `npm start` and set the `Root Directory / Path` to `backend`.
  - Add the same required env vars in the dashboard.

3) Seed production database (recommended, run locally against Atlas)

  - On your machine (safer than running seeds inside Render), run:

    PowerShell (Windows):
    ```powershell
    $env:MONGODB_URI = 'mongodb+srv://<user>:<pass>@cluster0.mongodb.net/nextlevel?retryWrites=true&w=majority'
    node backend/seed.js
    ```

    macOS / Linux:
    ```bash
    MONGODB_URI='mongodb+srv://<user>:<pass>@cluster0.mongodb.net/nextlevel?retryWrites=true&w=majority' node backend/seed.js
    ```

  - `seed.js` creates a mentor account and a test student. If you want to seed tracker/sample data, run `node backend/seedTracker.js` after creating the sample user.

4) Verify health endpoint

  After Render finishes a deploy, check:

    ```bash
    curl https://<your-render-service>.onrender.com/api/health
    ```

  Expected JSON: `{ "status":"ok", "mongodb":"connected", "hasMongodbUri":true, ... }`

5) Frontend (Vercel)

  - Create a Vercel project connected to this repo's frontend (root repo uses Vite).
  - Set the frontend environment variables in Vercel: `VITE_API_URL` (e.g. `https://<your-render-service>.onrender.com/api`) and `VITE_SOCKET_URL` (e.g. `wss://<your-render-service>.onrender.com`).
  - Deploy the frontend and verify login and Mentor flows.

6) Production Smoke Tests

  - After both services are live, run the project smoke tests or these quick checks:

    ```bash
    # health
    curl https://<your-render-service>.onrender.com/api/health

    # signup (example)
    curl -X POST https://<your-render-service>.onrender.com/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test+smoke@example.com","password":"Pass1234"}'
    ```

7) Rollback & logs

  - Use Render's deploy history to rollback if needed and check service logs for runtime errors.

If you want, I can automate the Render deployment (create the service, set envs, and verify) — provide the following items and I will proceed:

- `MONGODB_URI` (Atlas)
- `JWT_SECRET`
- `FRONTEND_URL` (Vercel URL)
- `MENTOR_MASTER_PASSWORD`
- SMTP credentials (if available)
- Render API key with `service.manage` scope OR confirm you will create the Render service and allow me to set envs

Security note: never paste these secrets in public chat. If you want me to proceed, paste them here securely or provide a Render service URL where I can set envs.
