export default function handler(req, res) {
  res.status(200).json({
    message: "Minimal test successful - Vercel is routing to api/test.js",
    timestamp: new Date().toISOString()
  });
}
