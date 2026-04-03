import express from 'express';
import { spawn } from 'child_process';

const router = express.Router();

// Protected endpoint to run the seed script on the running instance.
// Requires header `x-seed-secret` to match `process.env.SEED_SECRET` or
// `process.env.MENTOR_MASTER_PASSWORD` (falls back to 'Bhima@123').
router.post('/seed', (req, res) => {
  const secret = req.headers['x-seed-secret'] || req.body?.secret;
  const allowed = process.env.SEED_SECRET || process.env.MENTOR_MASTER_PASSWORD || 'Bhima@123';
  if (!secret || String(secret) !== String(allowed)) {
    return res.status(403).json({ error: true, message: 'Forbidden' });
  }

  try {
    const proc = spawn('node', ['seed.js'], {
      cwd: process.cwd(),
      env: process.env
    });

    let out = '';
    proc.stdout.on('data', (d) => { out += d.toString(); });
    proc.stderr.on('data', (d) => { out += d.toString(); });

    proc.on('close', (code) => {
      res.json({ ok: code === 0, code, output: out.slice(0, 20000) });
    });

    // safety: timeout the seed if it runs too long
    setTimeout(() => {
      try { proc.kill('SIGKILL'); } catch (e) {}
    }, 1000 * 60 * 5); // 5 minutes
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
